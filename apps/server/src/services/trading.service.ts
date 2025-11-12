import { 
  Connection, 
  Keypair, 
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
  getAccount,
} from '@solana/spl-token';
import bs58 from 'bs58';
import { db } from '@Redcircle/db';
import * as schema from '@Redcircle/db';
import { eq } from 'drizzle-orm';

const { posts } = schema;

/**
 * Trading Service for buying/selling tokens with bonding curve
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

// Platform authority keypair (receives SOL from trades)
const getAuthorityKeypair = (): Keypair => {
  const privateKey = process.env.SOLANA_AUTHORITY_PRIVATE_KEY;
  
  if (!privateKey) {
    throw new Error('❌ SOLANA_AUTHORITY_PRIVATE_KEY not set in environment variables');
  }

  try {
    const decoded = bs58.decode(privateKey);
    return Keypair.fromSecretKey(decoded);
  } catch {
    throw new Error('❌ Invalid SOLANA_AUTHORITY_PRIVATE_KEY format. Must be base58 encoded.');
  }
};

/**
 * Bonding Curve Pricing Model
 * 
 * Formula: price = initialPrice * (1 + soldSupply / totalSupply)^2
 * 
 * This creates an exponential curve where:
 * - Price starts at initialPrice
 * - Price increases as more tokens are sold
 * - Early buyers get better prices
 * - Creates natural market dynamics
 */

interface BondingCurveParams {
  initialPrice: number;      // Starting price in SOL
  totalSupply: number;        // Total token supply
  soldSupply: number;         // Tokens already sold
}

/**
 * Calculate current price for buying tokens
 */
export function calculateBuyPrice(params: BondingCurveParams, amount: number): number {
  const { initialPrice, totalSupply, soldSupply } = params;
  
  // Calculate average price across the range
  let totalCost = 0;
  for (let i = 0; i < amount; i++) {
    const currentSold = soldSupply + i;
    const ratio = currentSold / totalSupply;
    const price = initialPrice * Math.pow(1 + ratio, 2);
    totalCost += price;
  }
  
  return totalCost;
}

/**
 * Calculate sell price (with 5% platform fee)
 */
export function calculateSellPrice(params: BondingCurveParams, amount: number): number {
  const { initialPrice, totalSupply, soldSupply } = params;
  
  // Calculate average price across the range (selling reduces soldSupply)
  let totalReturn = 0;
  for (let i = 0; i < amount; i++) {
    const currentSold = soldSupply - i - 1;
    const ratio = Math.max(0, currentSold / totalSupply);
    const price = initialPrice * Math.pow(1 + ratio, 2);
    totalReturn += price;
  }
  
  // Apply 5% platform fee on sells
  const platformFee = 0.05;
  return totalReturn * (1 - platformFee);
}

/**
 * Get current market price
 */
export function getCurrentPrice(params: BondingCurveParams): number {
  const { initialPrice, totalSupply, soldSupply } = params;
  const ratio = soldSupply / totalSupply;
  return initialPrice * Math.pow(1 + ratio, 2);
}

interface BuyTokenParams {
  postId: string;
  buyerWalletAddress: string;
  amount: number;
}

/**
 * Buy tokens from a post
 */
export async function buyTokens(params: BuyTokenParams) {
  const { postId, buyerWalletAddress, amount } = params;
  
  console.log('\n💰 Processing token purchase...');
  console.log(`   Post ID: ${postId}`);
  console.log(`   Buyer: ${buyerWalletAddress}`);
  console.log(`   Amount: ${amount} tokens`);

  try {
    // 1. Get post details
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (!post) {
      throw new Error('Post not found');
    }

    if (!post.tokenMintAddress) {
      throw new Error('Token not minted for this post');
    }

    // 2. Calculate bonding curve price
    const soldSupply = post.tokenSupply - (post.tokenSupply - (post.holders * 100)); // Simplified
    const bondingParams: BondingCurveParams = {
      initialPrice: parseFloat(post.initialPrice),
      totalSupply: post.tokenSupply,
      soldSupply,
    };

    const costInSOL = calculateBuyPrice(bondingParams, amount);
    
    console.log(`   Cost: ${costInSOL.toFixed(6)} SOL`);

    // 3. Get authority keypair
    const authorityKeypair = getAuthorityKeypair();
    
    // 4. Create buyer public key
    const buyerPubkey = new PublicKey(buyerWalletAddress);
    const mintPubkey = new PublicKey(post.tokenMintAddress);

    // 5. Get token accounts
    const authorityTokenAccount = await getAssociatedTokenAddress(
      mintPubkey,
      authorityKeypair.publicKey
    );

    const buyerTokenAccount = await getAssociatedTokenAddress(
      mintPubkey,
      buyerPubkey
    );

    // Check if buyer's token account exists
    let buyerAccountExists = false;
    try {
      await getAccount(connection, buyerTokenAccount);
      buyerAccountExists = true;
      console.log('✅ Buyer token account exists');
    } catch (error) {
      console.log('⚠️  Buyer token account does not exist, will create it');
    }

    // 6. Create transaction
    const transaction = new Transaction();

    // Create associated token account if it doesn't exist
    if (!buyerAccountExists) {
      console.log('📝 Adding instruction to create token account');
      transaction.add(
        createAssociatedTokenAccountInstruction(
          buyerPubkey, // payer
          buyerTokenAccount, // associated token account
          buyerPubkey, // owner
          mintPubkey // mint
        )
      );
    }

    // Transfer SOL from buyer to authority (payment)
    const costInLamports = Math.floor(costInSOL * LAMPORTS_PER_SOL);
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: buyerPubkey,
        toPubkey: authorityKeypair.publicKey,
        lamports: costInLamports,
      })
    );

    // Transfer tokens from authority to buyer
    const amountWithDecimals = amount * Math.pow(10, post.tokenDecimals || 9);
    transaction.add(
      createTransferInstruction(
        authorityTokenAccount,
        buyerTokenAccount,
        authorityKeypair.publicKey,
        amountWithDecimals
      )
    );

    // 7. Get recent blockhash and set fee payer
    const { blockhash } = await connection.getLatestBlockhash('finalized');
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = buyerPubkey;

    // 8. Authority signs the transaction first
    transaction.sign(authorityKeypair);

    // 9. Serialize partially signed transaction
    const serializedTransaction = transaction.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    }).toString('base64');

    // 10. Update database (optimistically)
    const newVolume = parseFloat(post.totalVolume) + costInSOL;
    const newMarketCap = parseFloat(post.currentPrice) * post.tokenSupply;
    
    await db
      .update(posts)
      .set({
        currentPrice: getCurrentPrice({
          ...bondingParams,
          soldSupply: soldSupply + amount,
        }).toString(),
        totalVolume: newVolume.toString(),
        marketCap: newMarketCap.toString(),
        holders: post.holders + 1,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, postId));

    console.log('✅ Transaction prepared successfully');

    return {
      success: true,
      transaction: serializedTransaction,
      cost: costInSOL,
      newPrice: getCurrentPrice({
        ...bondingParams,
        soldSupply: soldSupply + amount,
      }),
    };
  } catch (error) {
    console.error('❌ Buy tokens error:', error);
    throw error;
  }
}

interface SellTokenParams {
  postId: string;
  sellerWalletAddress: string;
  amount: number;
}

/**
 * Sell tokens back to the bonding curve
 */
export async function sellTokens(params: SellTokenParams) {
  const { postId, sellerWalletAddress, amount } = params;
  
  console.log('\n💸 Processing token sale...');
  console.log(`   Post ID: ${postId}`);
  console.log(`   Seller: ${sellerWalletAddress}`);
  console.log(`   Amount: ${amount} tokens`);

  try {
    // 1. Get post details
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (!post) {
      throw new Error('Post not found');
    }

    if (!post.tokenMintAddress) {
      throw new Error('Token not minted for this post');
    }

    // 2. Calculate bonding curve price
    const soldSupply = post.tokenSupply - (post.tokenSupply - (post.holders * 100));
    const bondingParams: BondingCurveParams = {
      initialPrice: parseFloat(post.initialPrice),
      totalSupply: post.tokenSupply,
      soldSupply,
    };

    const returnInSOL = calculateSellPrice(bondingParams, amount);
    
    console.log(`   Return: ${returnInSOL.toFixed(6)} SOL (after 5% fee)`);

    // 3. Get authority keypair
    const authorityKeypair = getAuthorityKeypair();
    
    // 4. Create seller public key
    const sellerPubkey = new PublicKey(sellerWalletAddress);
    const mintPubkey = new PublicKey(post.tokenMintAddress);

    // 5. Get token accounts
    const authorityTokenAccount = await getAssociatedTokenAddress(
      mintPubkey,
      authorityKeypair.publicKey
    );

    const sellerTokenAccount = await getAssociatedTokenAddress(
      mintPubkey,
      sellerPubkey
    );

    // 6. Create transaction
    const transaction = new Transaction();

    // Transfer tokens from seller to authority
    const amountWithDecimals = amount * Math.pow(10, post.tokenDecimals || 9);
    transaction.add(
      createTransferInstruction(
        sellerTokenAccount,
        authorityTokenAccount,
        sellerPubkey,
        amountWithDecimals
      )
    );

    // Transfer SOL from authority to seller (payment)
    const returnInLamports = Math.floor(returnInSOL * LAMPORTS_PER_SOL);
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: authorityKeypair.publicKey,
        toPubkey: sellerPubkey,
        lamports: returnInLamports,
      })
    );

    // 7. Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = sellerPubkey;

    // 8. Sign with authority (partial sign)
    transaction.partialSign(authorityKeypair);

    // 9. Serialize transaction for client to sign
    const serializedTransaction = transaction.serialize({
      requireAllSignatures: false,
    }).toString('base64');

    // 10. Update database
    const newVolume = parseFloat(post.totalVolume) + returnInSOL;
    
    await db
      .update(posts)
      .set({
        currentPrice: getCurrentPrice({
          ...bondingParams,
          soldSupply: soldSupply - amount,
        }).toString(),
        totalVolume: newVolume.toString(),
        updatedAt: new Date(),
      })
      .where(eq(posts.id, postId));

    console.log('✅ Sell transaction prepared successfully');

    return {
      success: true,
      transaction: serializedTransaction,
      return: returnInSOL,
      newPrice: getCurrentPrice({
        ...bondingParams,
        soldSupply: soldSupply - amount,
      }),
    };
  } catch (error) {
    console.error('❌ Sell tokens error:', error);
    throw error;
  }
}

/**
 * Get trading stats for a post
 */
export async function getTradingStats(postId: string) {
  try {
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (!post) {
      throw new Error('Post not found');
    }

    const soldSupply = post.tokenSupply - (post.tokenSupply - (post.holders * 100));
    const bondingParams: BondingCurveParams = {
      initialPrice: parseFloat(post.initialPrice),
      totalSupply: post.tokenSupply,
      soldSupply,
    };

    return {
      currentPrice: getCurrentPrice(bondingParams),
      totalSupply: post.tokenSupply,
      soldSupply,
      availableSupply: post.tokenSupply - soldSupply,
      totalVolume: parseFloat(post.totalVolume),
      marketCap: parseFloat(post.marketCap),
      holders: post.holders,
      // Calculate price for 1, 10, 100 tokens
      buyPrice1: calculateBuyPrice(bondingParams, 1),
      buyPrice10: calculateBuyPrice(bondingParams, 10),
      buyPrice100: calculateBuyPrice(bondingParams, 100),
    };
  } catch (error) {
    console.error('❌ Get trading stats error:', error);
    throw error;
  }
}

