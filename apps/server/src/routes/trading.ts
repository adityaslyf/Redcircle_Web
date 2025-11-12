import { Router } from "express";
import { buyTokens, sellTokens, getTradingStats } from "../services/trading.service";
import { authenticateToken } from "../middleware/auth";

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
 * Confirm transaction after user signs (webhook for transaction monitoring)
 */
router.post("/confirm", authenticateToken, async (req, res) => {
  try {
    const { signature, postId, type } = req.body;

    console.log(`\n✅ Transaction confirmed: ${signature}`);
    console.log(`   Post: ${postId}`);
    console.log(`   Type: ${type}`);

    // TODO: Monitor transaction on blockchain
    // TODO: Update user balances in database
    // TODO: Create transaction history record

    res.json({
      success: true,
      message: "Transaction confirmed",
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

