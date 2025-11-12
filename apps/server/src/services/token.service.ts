import { 
  Connection, 
  Keypair, 
  PublicKey,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import {
  createMint,
  mintTo,
  getOrCreateAssociatedTokenAccount,
} from '@solana/spl-token';
import bs58 from 'bs58';

/**
 * Token Service for creating SPL tokens on Solana
 */

// Initialize Solana connection
const getRpcUrl = () => {
  const rpcUrl = process.env.SOLANA_RPC_URL;
  
  // In production, require explicit RPC URL
  if (!rpcUrl && process.env.NODE_ENV === 'production') {
    throw new Error('❌ SOLANA_RPC_URL must be set in production');
  }
  
  // Default to devnet for development
  return rpcUrl || 'https://api.devnet.solana.com';
};

const connection = new Connection(getRpcUrl(), 'confirmed');

// Load authority keypair (wallet that creates tokens)
const getAuthorityKeypair = (): Keypair => {
  const privateKey = process.env.SOLANA_AUTHORITY_PRIVATE_KEY;
  
  if (!privateKey) {
    throw new Error(
      '❌ SOLANA_AUTHORITY_PRIVATE_KEY not found in environment variables.\n' +
      'Generate a keypair with: solana-keygen new\n' +
      'Get the base58 key with: solana-keygen pubkey ~/.config/solana/id.json'
    );
  }

  try {
    return Keypair.fromSecretKey(bs58.decode(privateKey));
  } catch {
    throw new Error('❌ Invalid SOLANA_AUTHORITY_PRIVATE_KEY format. Must be base58 encoded.');
  }
};

export type CreateTokenParams = {
  postId: string;
  tokenSymbol: string;
  tokenSupply: number;
  decimals: number;
};

export type TokenMintResult = {
  mintAddress: string;
  tokenAccount: string;
  signature: string;
  decimals: number;
  explorerUrl: string;
};

/**
 * Creates a new SPL token on Solana blockchain
 */
export async function createPostToken(params: CreateTokenParams): Promise<TokenMintResult> {
  try {
    console.log('\n🪙 Starting token creation process...');
    console.log(`📝 Post ID: ${params.postId}`);
    console.log(`🏷️  Symbol: ${params.tokenSymbol}`);
    console.log(`💰 Supply: ${params.tokenSupply}`);
    console.log(`🔢 Decimals: ${params.decimals}`);

    const authorityKeypair = getAuthorityKeypair();
    
    console.log(`👤 Authority: ${authorityKeypair.publicKey.toBase58()}`);
    
    // Check balance
    const balance = await connection.getBalance(authorityKeypair.publicKey);
    console.log(`💵 Balance: ${balance / LAMPORTS_PER_SOL} SOL`);
    
    if (balance < 0.01 * LAMPORTS_PER_SOL) {
      throw new Error(
        `❌ Insufficient balance. Need at least 0.01 SOL.\n` +
        `Current: ${balance / LAMPORTS_PER_SOL} SOL\n` +
        `For devnet: solana airdrop 2 ${authorityKeypair.publicKey.toBase58()} --url devnet`
      );
    }

    // Step 1: Create token mint
    console.log('\n⏳ Step 1: Creating token mint...');
    const mintAddress = await createMint(
      connection,
      authorityKeypair,           // Payer
      authorityKeypair.publicKey, // Mint authority
      authorityKeypair.publicKey, // Freeze authority (can freeze accounts)
      params.decimals             // Decimals
    );

    console.log(`✅ Token mint created: ${mintAddress.toBase58()}`);

    // Step 2: Create token account to hold initial supply
    console.log('\n⏳ Step 2: Creating token account...');
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      authorityKeypair,
      mintAddress,
      authorityKeypair.publicKey
    );

    console.log(`✅ Token account created: ${tokenAccount.address.toBase58()}`);

    // Step 3: Mint initial supply
    console.log('\n⏳ Step 3: Minting initial supply...');
    const mintAmount = params.tokenSupply * Math.pow(10, params.decimals);
    const signature = await mintTo(
      connection,
      authorityKeypair,
      mintAddress,
      tokenAccount.address,
      authorityKeypair.publicKey,
      mintAmount
    );

    console.log(`✅ Minted ${params.tokenSupply} tokens`);
    console.log(`📝 Transaction signature: ${signature}`);

    // Determine network for explorer URL
    const network = getRpcUrl().includes('devnet') ? 'devnet' : 'mainnet';
    const explorerUrl = `https://solscan.io/token/${mintAddress.toBase58()}?cluster=${network}`;

    console.log(`🔍 View on Solscan: ${explorerUrl}\n`);

    return {
      mintAddress: mintAddress.toBase58(),
      tokenAccount: tokenAccount.address.toBase58(),
      signature,
      decimals: params.decimals,
      explorerUrl,
    };
  } catch (error) {
    console.error('\n❌ Error creating token:', error);
    
    if (error instanceof Error) {
      // Provide helpful error messages
      if (error.message.includes('403')) {
        throw new Error('❌ RPC endpoint rate limit. Try again in a moment or use a different RPC.');
      }
      if (error.message.includes('insufficient funds')) {
        throw new Error('❌ Insufficient SOL. Get devnet SOL: solana airdrop 2 --url devnet');
      }
    }
    
    throw error;
  }
}

/**
 * Verify if a token mint exists and is valid
 */
export async function verifyTokenMint(mintAddress: string): Promise<boolean> {
  try {
    const mintPublicKey = new PublicKey(mintAddress);
    const mintInfo = await connection.getParsedAccountInfo(mintPublicKey);
    return mintInfo.value !== null;
  } catch (error) {
    console.error('Error verifying token mint:', error);
    return false;
  }
}

/**
 * Get token supply information
 */
export async function getTokenSupply(mintAddress: string) {
  try {
    const mintPublicKey = new PublicKey(mintAddress);
    const supply = await connection.getTokenSupply(mintPublicKey);
    return {
      amount: supply.value.amount,
      decimals: supply.value.decimals,
      uiAmount: supply.value.uiAmount,
    };
  } catch (error) {
    console.error('Error getting token supply:', error);
    return null;
  }
}

