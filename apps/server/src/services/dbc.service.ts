import { 
  Connection, 
  Keypair, 
  PublicKey,
  Transaction,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import BN from 'bn.js';
import bs58 from 'bs58';
import {
  DynamicBondingCurveClient,
  buildCurveWithMarketCap,
  MigrationOption,
  TokenDecimal,
} from '@meteora-ag/dynamic-bonding-curve-sdk';

/**
 * Meteora DBC Service
 * Handles Dynamic Bonding Curve pool creation and trading operations
 * This makes the platform more decentralized by using on-chain pools
 */

// Initialize Solana connection
const getRpcUrl = () => {
  const rpcUrl = process.env.SOLANA_RPC_URL;
  
  if (!rpcUrl && process.env.NODE_ENV === 'production') {
    throw new Error('❌ SOLANA_RPC_URL must be set in production');
  }
  
  return rpcUrl || 'https://api.devnet.solana.com';
};

const connection = new Connection(getRpcUrl(), 'confirmed');

// Initialize DBC Client
const dbcClient = new DynamicBondingCurveClient(connection, 'confirmed');

// Platform fee claimer (receives platform fees from DBC pools)
const getFeeClaimerKeypair = (): Keypair => {
  const privateKey = process.env.SOLANA_FEE_CLAIMER_PRIVATE_KEY || process.env.SOLANA_AUTHORITY_PRIVATE_KEY;
  
  if (!privateKey) {
    throw new Error('❌ SOLANA_FEE_CLAIMER_PRIVATE_KEY or SOLANA_AUTHORITY_PRIVATE_KEY not set');
  }

  try {
    const decoded = bs58.decode(privateKey);
    return Keypair.fromSecretKey(decoded);
  } catch {
    throw new Error('❌ Invalid fee claimer private key format. Must be base58 encoded.');
  }
};

// Leftover receiver (receives leftover tokens after migration)
const getLeftoverReceiverKeypair = (): Keypair => {
  const privateKey = process.env.SOLANA_LEFTOVER_RECEIVER_PRIVATE_KEY || process.env.SOLANA_AUTHORITY_PRIVATE_KEY;
  
  if (!privateKey) {
    throw new Error('❌ SOLANA_LEFTOVER_RECEIVER_PRIVATE_KEY or SOLANA_AUTHORITY_PRIVATE_KEY not set');
  }

  try {
    const decoded = bs58.decode(privateKey);
    return Keypair.fromSecretKey(decoded);
  } catch {
    throw new Error('❌ Invalid leftover receiver private key format. Must be base58 encoded.');
  }
};

export interface CreateDBCPoolParams {
  baseMint: PublicKey;              // Token mint address
  tokenSupply: number;               // Total token supply
  initialMarketCap: number;          // Initial market cap in SOL
  migrationMarketCap: number;        // Market cap when pool migrates to DAMM
  tokenDecimals?: number;            // Token decimals (default: 9)
  creator?: PublicKey;               // Optional creator address
  tokenName?: string;                // Token name
  tokenSymbol?: string;               // Token symbol
  tokenUri?: string;                  // Token metadata URI
}

export interface CreateDBCPoolResult {
  configAddress: string;
  poolAddress: string;
  transactionSignature: string;
  initialPrice: number;
}

/**
 * Create a DBC pool for a token
 * This is called when a post is tokenized
 */
export async function createDBCPool(
  params: CreateDBCPoolParams,
  payer: Keypair
): Promise<CreateDBCPoolResult> {
  try {
    console.log('\n🏊 Creating DBC pool...');
    console.log(`   Base Mint: ${params.baseMint.toBase58()}`);
    console.log(`   Initial Market Cap: ${params.initialMarketCap} SOL`);
    console.log(`   Migration Market Cap: ${params.migrationMarketCap} SOL`);

    const feeClaimer = getFeeClaimerKeypair();
    const leftoverReceiver = getLeftoverReceiverKeypair();
    
    // Quote mint is SOL (native)
    const quoteMint = new PublicKey('So11111111111111111111111111111111111111112'); // Wrapped SOL

    // Build curve config using helper function
    const tokenDecimals = params.tokenDecimals || 9;
    const curveConfig = buildCurveWithMarketCap({
      totalTokenSupply: new BN(params.tokenSupply * Math.pow(10, tokenDecimals)),
      initialMarketCap: new BN(params.initialMarketCap * LAMPORTS_PER_SOL),
      migrationMarketCap: new BN(params.migrationMarketCap * LAMPORTS_PER_SOL),
      migrationOption: MigrationOption.MET_DAMM_V2, // Migrate to DAMM v2 after graduation
      tokenBaseDecimal: tokenDecimals === 6 ? TokenDecimal.SIX : TokenDecimal.NINE,
      tokenQuoteDecimal: TokenDecimal.NINE, // SOL has 9 decimals
    });

    console.log('✅ Curve config built');

    // Generate config keypair
    const configKeypair = Keypair.generate();
    const configAddress = configKeypair.publicKey;

    console.log(`📝 Config Address: ${configAddress.toBase58()}`);

    // Create config transaction
    const createConfigTx = await dbcClient.pool.createConfig({
      config: configAddress,
      feeClaimer: feeClaimer.publicKey,
      leftoverReceiver: leftoverReceiver.publicKey,
      quoteMint,
      payer: payer.publicKey,
      curveConfig,
    });

    // Sign and send config transaction
    createConfigTx.sign(configKeypair, payer);
    const configSignature = await sendAndConfirmTransaction(
      connection,
      createConfigTx,
      [configKeypair, payer],
      { commitment: 'confirmed' }
    );

    console.log(`✅ Config created: ${configSignature}`);

    // Generate pool keypair
    const poolKeypair = Keypair.generate();
    const poolAddress = poolKeypair.publicKey;

    // Create pool transaction
    const createPoolTx = await dbcClient.pool.createPool({
      pool: poolAddress,
      baseMint: params.baseMint,
      quoteMint,
      config: configAddress,
      creator: params.creator || payer.publicKey,
      payer: payer.publicKey,
      name: params.tokenName || 'Redcircle Token',
      symbol: params.tokenSymbol || 'RCT',
      uri: params.tokenUri || '',
    });

    // Sign and send pool transaction
    createPoolTx.sign(poolKeypair, payer);
    const poolSignature = await sendAndConfirmTransaction(
      connection,
      createPoolTx,
      [poolKeypair, payer],
      { commitment: 'confirmed' }
    );

    console.log(`✅ DBC pool created!`);
    console.log(`   Config: ${configAddress.toBase58()}`);
    console.log(`   Pool: ${poolAddress.toBase58()}`);
    console.log(`   Signature: ${poolSignature}`);

    // Calculate initial price from market cap
    const initialPrice = params.initialMarketCap / params.tokenSupply;

    return {
      configAddress: configAddress.toBase58(),
      poolAddress: poolAddress.toBase58(),
      transactionSignature: poolSignature,
      initialPrice,
    };
  } catch (error) {
    console.error('❌ Error creating DBC pool:', error);
    throw error;
  }
}

/**
 * Get DBC pool state
 */
export async function getDBCPoolState(poolAddress: string) {
  try {
    const poolPubkey = new PublicKey(poolAddress);
    const poolState = await dbcClient.state.getPoolState(poolPubkey);
    return poolState;
  } catch (error) {
    console.error('❌ Error getting DBC pool state:', error);
    return null;
  }
}

/**
 * Get current price from DBC pool
 */
export async function getDBCPoolPrice(poolAddress: string): Promise<number> {
  try {
    const poolState = await getDBCPoolState(poolAddress);
    if (!poolState) {
      throw new Error('Pool state not found');
    }

    // Calculate price from pool state
    // Price = quoteReserves / baseReserves
    const quoteReserves = poolState.quoteReserves.toNumber();
    const baseReserves = poolState.baseReserves.toNumber();
    
    if (baseReserves === 0) {
      return 0;
    }

    // Convert to SOL (quote is in lamports)
    const priceInSOL = (quoteReserves / LAMPORTS_PER_SOL) / (baseReserves / 1e9);
    return priceInSOL;
  } catch (error) {
    console.error('❌ Error getting DBC pool price:', error);
    throw error;
  }
}

/**
 * Create buy transaction for DBC pool
 * Returns a transaction that the user can sign
 */
export async function createBuyTransaction(
  poolAddress: string,
  buyer: PublicKey,
  amountInSOL: number
): Promise<Transaction> {
  try {
    const poolPubkey = new PublicKey(poolAddress);

    // Get quote amount in lamports
    const quoteAmount = new BN(Math.floor(amountInSOL * LAMPORTS_PER_SOL));
    
    // Calculate minimum amount out (with 1% slippage tolerance)
    const poolState = await getDBCPoolState(poolAddress);
    if (!poolState) {
      throw new Error('Pool state not found');
    }
    
    // Estimate base amount out (simplified calculation)
    // In production, you'd want to use the actual swap quote
    const estimatedBaseOut = quoteAmount.mul(new BN(poolState.baseReserves)).div(new BN(poolState.quoteReserves));
    const minimumAmountOut = estimatedBaseOut.mul(new BN(99)).div(new BN(100)); // 1% slippage

    // Create swap transaction (buying base tokens with quote tokens)
    const swapTx = await dbcClient.pool.swap({
      owner: buyer,
      pool: poolPubkey,
      amountIn: quoteAmount,
      minimumAmountOut,
      swapBaseForQuote: false, // false = buying base tokens with quote tokens
      referralTokenAccount: null,
      payer: buyer,
    });

    return swapTx;
  } catch (error) {
    console.error('❌ Error creating buy transaction:', error);
    throw error;
  }
}

/**
 * Create sell transaction for DBC pool
 * Returns a transaction that the user can sign
 */
export async function createSellTransaction(
  poolAddress: string,
  seller: PublicKey,
  amountInTokens: number,
  tokenDecimals: number = 9
): Promise<Transaction> {
  try {
    const poolPubkey = new PublicKey(poolAddress);

    // Get base amount in smallest unit
    const baseAmount = new BN(Math.floor(amountInTokens * Math.pow(10, tokenDecimals)));

    // Calculate minimum amount out (with 1% slippage tolerance)
    const poolState = await getDBCPoolState(poolAddress);
    if (!poolState) {
      throw new Error('Pool state not found');
    }
    
    // Estimate quote amount out (simplified calculation)
    const estimatedQuoteOut = baseAmount.mul(new BN(poolState.quoteReserves)).div(new BN(poolState.baseReserves));
    const minimumAmountOut = estimatedQuoteOut.mul(new BN(99)).div(new BN(100)); // 1% slippage

    // Create swap transaction (selling base tokens for quote tokens)
    const swapTx = await dbcClient.pool.swap({
      owner: seller,
      pool: poolPubkey,
      amountIn: baseAmount,
      minimumAmountOut,
      swapBaseForQuote: true, // true = selling base tokens for quote tokens
      referralTokenAccount: null,
      payer: seller,
    });

    return swapTx;
  } catch (error) {
    console.error('❌ Error creating sell transaction:', error);
    throw error;
  }
}

/**
 * Get quote for buying tokens
 */
export async function getBuyQuote(
  poolAddress: string,
  amountInSOL: number
): Promise<{ baseAmount: number; pricePerToken: number }> {
  try {
    const poolState = await getDBCPoolState(poolAddress);
    if (!poolState) {
      throw new Error('Pool state not found');
    }

    const quoteAmount = new BN(Math.floor(amountInSOL * LAMPORTS_PER_SOL));
    
    // Calculate base amount using constant product formula
    // baseAmount = (quoteAmount * baseReserves) / (quoteReserves + quoteAmount)
    const baseReserves = poolState.baseReserves;
    const quoteReserves = poolState.quoteReserves;
    
    const baseAmount = quoteAmount
      .mul(baseReserves)
      .div(quoteReserves.add(quoteAmount));
    
    const tokenDecimals = poolState.baseMintDecimals || 9;
    const baseAmountUI = baseAmount.toNumber() / Math.pow(10, tokenDecimals);
    const pricePerToken = amountInSOL / baseAmountUI;

    return {
      baseAmount: baseAmountUI,
      pricePerToken,
    };
  } catch (error) {
    console.error('❌ Error getting buy quote:', error);
    throw error;
  }
}

/**
 * Get quote for selling tokens
 */
export async function getSellQuote(
  poolAddress: string,
  amountInTokens: number,
  tokenDecimals: number = 9
): Promise<{ quoteAmount: number; pricePerToken: number }> {
  try {
    const poolState = await getDBCPoolState(poolAddress);
    if (!poolState) {
      throw new Error('Pool state not found');
    }

    const baseAmount = new BN(Math.floor(amountInTokens * Math.pow(10, tokenDecimals)));
    
    // Calculate quote amount using constant product formula
    // quoteAmount = (baseAmount * quoteReserves) / (baseReserves + baseAmount)
    const baseReserves = poolState.baseReserves;
    const quoteReserves = poolState.quoteReserves;
    
    const quoteAmount = baseAmount
      .mul(quoteReserves)
      .div(baseReserves.add(baseAmount));
    
    const quoteAmountUI = quoteAmount.toNumber() / LAMPORTS_PER_SOL;
    const pricePerToken = quoteAmountUI / amountInTokens;

    return {
      quoteAmount: quoteAmountUI,
      pricePerToken,
    };
  } catch (error) {
    console.error('❌ Error getting sell quote:', error);
    throw error;
  }
}
