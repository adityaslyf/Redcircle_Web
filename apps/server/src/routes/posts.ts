import { Router } from "express";
import { RedditService } from "../services/reddit.service";
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

    // Create post record
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
        tokenDecimals: 9, // Standard SPL token decimals
        status: "pending", // Will be updated to "minting" when blockchain integration is added
        totalVolume: "0",
        marketCap,
        holders: 0,
        creatorId: userId,
        creatorRewards: "0",
        tags: redditPost.subreddit ? [redditPost.subreddit] : [],
        featured: 0,
      })
      .returning();

    console.log(`✅ Post tokenized: ${newPost.id} (${newPost.tokenSymbol})`);

    res.status(201).json({
      success: true,
      message: "Post tokenized successfully",
      post: newPost,
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

    let query = db
      .select()
      .from(posts)
      .limit(parseInt(limit as string))
      .offset(parseInt(offset as string));

    // Filter by status if specified
    if (status && status !== "all") {
      query = query.where(eq(posts.status, status as any));
    }

    // Filter by subreddit if specified
    if (subreddit) {
      query = query.where(eq(posts.subreddit, subreddit as string));
    }

    // Sort
    switch (sortBy) {
      case "upvotes":
        query = query.orderBy(desc(posts.upvotes));
        break;
      case "marketCap":
        query = query.orderBy(desc(posts.marketCap));
        break;
      case "totalVolume":
        query = query.orderBy(desc(posts.totalVolume));
        break;
      default:
        query = query.orderBy(desc(posts.tokenizedAt));
    }

    const postsList = await query;

    res.json({
      success: true,
      posts: postsList,
      count: postsList.length,
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

