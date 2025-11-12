import { Router } from "express";
import { RedditService } from "../services/reddit.service";
import { createPostToken } from "../services/token.service";
import { db } from "@Redcircle/db";
import * as schema from "@Redcircle/db";
import { eq, desc } from "drizzle-orm";

const { posts } = schema;
const router = Router();

/**
 * POST /api/posts/fetch-reddit
 * Fetch Reddit post details (preview before tokenization)
 */
router.post("/fetch-reddit", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "Reddit URL is required" });
    }

    console.log(`📥 Fetch request for URL: ${url}`);

    // Fetch post from Reddit
    const redditPost = await RedditService.fetchPost(url);

    // Validate post
    const validation = RedditService.validatePost(redditPost);
    if (!validation.valid) {
      return res.status(400).json({ 
        error: validation.reason || "Post is not valid for tokenization" 
      });
    }

    // Check if post is already tokenized
    const existingPost = await db
      .select()
      .from(posts)
      .where(eq(posts.redditPostId, redditPost.id))
      .limit(1);

    if (existingPost.length > 0) {
      return res.status(409).json({ 
        error: "This post has already been tokenized",
        existingPost: existingPost[0]
      });
    }

    // Return post data for preview
    res.json({
      success: true,
      post: {
        redditPostId: redditPost.id,
        title: redditPost.title,
        author: redditPost.author,
        subreddit: redditPost.subreddit,
        url: redditPost.url,
        thumbnail: redditPost.thumbnail,
        content: redditPost.selftext,
        upvotes: redditPost.upvotes,
        comments: redditPost.num_comments,
        createdAt: new Date(redditPost.created_utc * 1000).toISOString(),
        age: RedditService.getPostAge(redditPost.created_utc),
      },
    });
  } catch (error) {
    console.error("❌ Error fetching Reddit post:", error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : "Failed to fetch Reddit post" 
    });
  }
});

/**
 * POST /api/posts/tokenize
 * Create a tokenization request for a Reddit post
 */
router.post("/tokenize", async (req, res) => {
  try {
    const { 
      url, 
      tokenSupply, 
      initialPrice, 
      description,
      userId // This should come from authenticated user session/JWT
    } = req.body;

    // Validation
    if (!url || !tokenSupply || !initialPrice || !userId) {
      return res.status(400).json({ 
        error: "Missing required fields: url, tokenSupply, initialPrice, userId" 
      });
    }

    if (tokenSupply < 1 || tokenSupply > 1000000000) {
      return res.status(400).json({ 
        error: "Token supply must be between 1 and 1,000,000,000" 
      });
    }

    if (parseFloat(initialPrice) <= 0) {
      return res.status(400).json({ 
        error: "Initial price must be greater than 0" 
      });
    }

    console.log(`🪙 Tokenization request for URL: ${url}`);

    // Fetch fresh Reddit post data
    const redditPost = await RedditService.fetchPost(url);

    // Validate post
    const validation = RedditService.validatePost(redditPost);
    if (!validation.valid) {
      return res.status(400).json({ 
        error: validation.reason || "Post is not valid for tokenization" 
      });
    }

    // Check for duplicates
    const existingPost = await db
      .select()
      .from(posts)
      .where(eq(posts.redditPostId, redditPost.id))
      .limit(1);

    if (existingPost.length > 0) {
      return res.status(409).json({ 
        error: "This post has already been tokenized",
        post: existingPost[0]
      });
    }

    // Calculate initial market cap
    const marketCap = (parseFloat(tokenSupply.toString()) * parseFloat(initialPrice)).toFixed(9);

    // Generate token symbol (e.g., "POST123")
    const tokenSymbol = `POST${redditPost.id.toUpperCase().substring(0, 6)}`;

    // === BLOCKCHAIN: Create actual SPL token on Solana ===
    console.log("\n🚀 Creating SPL token on Solana blockchain...");
    let tokenMintData;
    try {
      tokenMintData = await createPostToken({
        postId: redditPost.id,
        tokenSymbol,
        tokenSupply: parseInt(tokenSupply.toString()),
        decimals: 9, // Standard SPL token decimals
      });
      
      console.log("✅ Token successfully minted on blockchain!");
      console.log(`   Mint Address: ${tokenMintData.mintAddress}`);
      console.log(`   Explorer: ${tokenMintData.explorerUrl}`);
    } catch (mintError) {
      console.error("❌ Failed to mint token on blockchain:", mintError);
      
      return res.status(500).json({
        error: "Failed to mint token on blockchain",
        details: mintError instanceof Error ? mintError.message : "Unknown error",
        hint: "Check backend logs for details. Ensure SOLANA_AUTHORITY_PRIVATE_KEY is set and has sufficient SOL."
      });
    }

    // Create post record with blockchain data
    const [newPost] = await db
      .insert(posts)
      .values({
        redditPostId: redditPost.id,
        redditUrl: redditPost.url,
        title: redditPost.title,
        author: redditPost.author,
        subreddit: redditPost.subreddit,
        thumbnail: redditPost.thumbnail,
        content: redditPost.selftext,
        upvotes: redditPost.upvotes,
        comments: redditPost.num_comments,
        redditCreatedAt: new Date(redditPost.created_utc * 1000),
        tokenSupply: parseInt(tokenSupply.toString()),
        initialPrice: initialPrice.toString(),
        currentPrice: initialPrice.toString(),
        description: description || null,
        tokenSymbol,
        tokenDecimals: tokenMintData.decimals,
        tokenMintAddress: tokenMintData.mintAddress, // ← Blockchain address
        status: "active", // ← Token is minted and active!
        totalVolume: "0",
        marketCap,
        holders: 1, // Authority wallet holds initial supply
        creatorId: userId,
        creatorRewards: "0",
        tags: redditPost.subreddit ? [redditPost.subreddit] : [],
        featured: 0,
      })
      .returning();

    console.log(`✅ Post tokenized: ${newPost.tokenSymbol} by user ${newPost.creatorId}`);

    res.status(201).json({
      success: true,
      message: "Post tokenized successfully on Solana blockchain",
      post: newPost,
      blockchain: {
        mintAddress: tokenMintData.mintAddress,
        explorerUrl: tokenMintData.explorerUrl,
        transactionSignature: tokenMintData.signature,
      },
    });
  } catch (error) {
    console.error("❌ Error tokenizing post:", error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : "Failed to tokenize post" 
    });
  }
});

/**
 * GET /api/posts
 * List all tokenized posts (for feed)
 */
router.get("/", async (req, res) => {
  try {
    const { 
      status = "active", 
      limit = 50, 
      offset = 0,
      subreddit,
      sortBy = "tokenizedAt" // tokenizedAt, upvotes, marketCap, totalVolume
    } = req.query;

    console.log(`📋 Fetching posts: status=${status}, limit=${limit}, offset=${offset}`);

    // Build query based on filters
    const baseQuery = db.select().from(posts);
    
    // Apply filters
    const conditions = [];
    if (status && status !== "all") {
      conditions.push(eq(posts.status, status));
    }
    if (subreddit) {
      conditions.push(eq(posts.subreddit, subreddit as string));
    }

    // Determine sort column
    let orderColumn;
    switch (sortBy) {
      case "upvotes":
        orderColumn = desc(posts.upvotes);
        break;
      case "marketCap":
        orderColumn = desc(posts.marketCap);
        break;
      case "totalVolume":
        orderColumn = desc(posts.totalVolume);
        break;
      default:
        orderColumn = desc(posts.tokenizedAt);
    }

    // Execute query with all filters
    const postsList = await (conditions.length > 0
      ? baseQuery.where(conditions[0]).orderBy(orderColumn)
      : baseQuery.orderBy(orderColumn)
    )
      .limit(parseInt(limit as string))
      .offset(parseInt(offset as string));

    // Check if there are more posts by fetching one extra
    const hasMore = postsList.length === parseInt(limit as string);

    res.json({
      success: true,
      posts: postsList,
      count: postsList.length,
      hasMore,
      pagination: {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        nextOffset: parseInt(offset as string) + postsList.length,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    res.status(500).json({ 
      error: "Failed to fetch posts" 
    });
  }
});

/**
 * GET /api/posts/:id
 * Get single post details
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({
      success: true,
      post,
    });
  } catch (error) {
    console.error("❌ Error fetching post:", error);
    res.status(500).json({ 
      error: "Failed to fetch post" 
    });
  }
});

export default router;

