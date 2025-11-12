import { Router } from "express";
import { buyTokens, sellTokens, getTradingStats } from "../services/trading.service";
import { authenticateToken } from "../middleware/auth";
import { db } from "@Redcircle/db";
import * as schema from "@Redcircle/db";
import { eq, and } from "drizzle-orm";

const { holdings } = schema;

const router = Router();

/**
 * POST /api/trading/buy
 * Buy tokens from a post's bonding curve
 */
router.post("/buy", authenticateToken, async (req, res) => {
  try {
    const { postId, amount, walletAddress } = req.body;

    // Validation
    if (!postId || !amount || !walletAddress) {
      return res.status(400).json({
        error: "Missing required fields: postId, amount, walletAddress",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        error: "Amount must be greater than 0",
      });
    }

    console.log(`\n🛒 Buy request: ${amount} tokens for post ${postId}`);

    const result = await buyTokens({
      postId,
      buyerWalletAddress: walletAddress,
      amount: parseInt(amount),
    });

    res.json({
      success: true,
      message: "Transaction prepared. Please sign with your wallet.",
      ...result,
    });
  } catch (error: any) {
    console.error("❌ Buy tokens error:", error);
    res.status(500).json({
      error: "Failed to prepare buy transaction",
      details: error.message,
    });
  }
});

/**
 * POST /api/trading/sell
 * Sell tokens back to the bonding curve
 */
router.post("/sell", authenticateToken, async (req, res) => {
  try {
    const { postId, amount, walletAddress } = req.body;

    // Validation
    if (!postId || !amount || !walletAddress) {
      return res.status(400).json({
        error: "Missing required fields: postId, amount, walletAddress",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        error: "Amount must be greater than 0",
      });
    }

    console.log(`\n💸 Sell request: ${amount} tokens for post ${postId}`);

    const result = await sellTokens({
      postId,
      sellerWalletAddress: walletAddress,
      amount: parseInt(amount),
    });

    res.json({
      success: true,
      message: "Transaction prepared. Please sign with your wallet.",
      ...result,
    });
  } catch (error: any) {
    console.error("❌ Sell tokens error:", error);
    res.status(500).json({
      error: "Failed to prepare sell transaction",
      details: error.message,
    });
  }
});

/**
 * GET /api/trading/stats/:postId
 * Get trading statistics for a post
 */
router.get("/stats/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    const stats = await getTradingStats(postId);

    res.json({
      success: true,
      stats,
    });
  } catch (error: any) {
    console.error("❌ Get trading stats error:", error);
    res.status(500).json({
      error: "Failed to get trading stats",
      details: error.message,
    });
  }
});

/**
 * POST /api/trading/confirm
 * Confirm transaction and update holdings
 */
router.post("/confirm", authenticateToken, async (req, res) => {
  try {
    const { signature, postId, type, amount, price } = req.body;
    const userId = (req as any).userId;

    console.log(`\n✅ Transaction confirmed: ${signature}`);
    console.log(`   Post: ${postId}`);
    console.log(`   Type: ${type}`);
    console.log(`   User: ${userId}`);

    // Get post details
    const [post] = await db
      .select()
      .from(schema.posts)
      .where(eq(schema.posts.id, postId))
      .limit(1);

    if (!post || !post.tokenMintAddress) {
      throw new Error("Post or token mint not found");
    }

    // Get or create user holding
    const [existingHolding] = await db
      .select()
      .from(holdings)
      .where(
        and(
          eq(holdings.userId, userId),
          eq(holdings.postId, postId)
        )
      )
      .limit(1);

    if (type === "buy") {
      if (existingHolding) {
        // Update existing holding
        const newAmount = existingHolding.amount + (amount || 0);
        const newTotalInvested = parseFloat(existingHolding.totalInvested) + (price || 0);
        const newAverageBuyPrice = newTotalInvested / newAmount;

        await db
          .update(holdings)
          .set({
            amount: newAmount,
            totalInvested: newTotalInvested.toString(),
            averageBuyPrice: newAverageBuyPrice.toString(),
            updatedAt: new Date(),
          })
          .where(eq(holdings.id, existingHolding.id));

        console.log(`✅ Updated holding: ${newAmount} tokens`);
      } else {
        // Create new holding
        await db.insert(holdings).values({
          userId,
          postId,
          tokenMintAddress: post.tokenMintAddress,
          amount: amount || 0,
          averageBuyPrice: (price / (amount || 1)).toString(),
          totalInvested: price.toString(),
          totalRealized: "0",
        });

        console.log(`✅ Created new holding: ${amount} tokens`);
      }
    } else if (type === "sell" && existingHolding) {
      // Update holding for sell
      const newAmount = existingHolding.amount - (amount || 0);
      const newTotalRealized = parseFloat(existingHolding.totalRealized) + (price || 0);

      if (newAmount > 0) {
        await db
          .update(holdings)
          .set({
            amount: newAmount,
            totalRealized: newTotalRealized.toString(),
            updatedAt: new Date(),
          })
          .where(eq(holdings.id, existingHolding.id));

        console.log(`✅ Updated holding: ${newAmount} tokens remaining`);
      } else {
        // Sold all tokens, delete holding
        await db
          .delete(holdings)
          .where(eq(holdings.id, existingHolding.id));

        console.log(`✅ Holding closed (all tokens sold)`);
      }
    }

    res.json({
      success: true,
      message: "Transaction confirmed and holdings updated",
      signature,
    });
  } catch (error: any) {
    console.error("❌ Confirm transaction error:", error);
    res.status(500).json({
      error: "Failed to confirm transaction",
      details: error.message,
    });
  }
});

export default router;

