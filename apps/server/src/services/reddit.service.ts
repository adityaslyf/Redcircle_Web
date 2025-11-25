/**
 * Reddit API Service
 * Fetches Reddit post data using Reddit's JSON API (no OAuth needed for public posts)
 */

export interface RedditPost {
  id: string;
  title: string;
  author: string;
  subreddit: string;
  url: string;
  permalink: string;
  thumbnail: string | null;
  selftext: string; // Post body/content
  upvotes: number;
  num_comments: number;
  created_utc: number;
  is_video: boolean;
  post_hint?: string;
  preview?: {
    images?: Array<{
      source: {
        url: string;
        width: number;
        height: number;
      };
    }>;
  };
}

export interface RedditApiResponse {
  kind: string;
  data: {
    children: Array<{
      kind: string;
      data: any;
    }>;
  };
}

export class RedditService {
  private static readonly BASE_URL = "https://www.reddit.com";
  // Updated User-Agent to comply with Reddit API rules
  // Format: <platform>:<app ID>:<version string> (by /u/<reddit username>)
  private static readonly USER_AGENT = "web:com.redcircle.app:v1.0.0 (by /u/RedCircleBot)";

  /**
   * Extract Reddit post ID from various URL formats
   */
  static extractPostId(url: string): string | null {
    const patterns = [
      /reddit\.com\/r\/[^/]+\/comments\/([a-z0-9]+)/i,
      /redd\.it\/([a-z0-9]+)/i,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }

    return null;
  }

  /**
   * Build Reddit JSON API URL from post ID
   */
  static buildApiUrl(postId: string): string | null {
    // Reddit's JSON API: Add .json to any URL
    return `${this.BASE_URL}/comments/${postId}.json`;
  }

  /**
   * Fetch post data from Reddit
   */
  static async fetchPost(url: string): Promise<RedditPost> {
    const postId = this.extractPostId(url);
    
    if (!postId) {
      throw new Error("Invalid Reddit URL. Please provide a valid Reddit post URL.");
    }

    const apiUrl = this.buildApiUrl(postId);
    
    if (!apiUrl) {
      throw new Error("Failed to build Reddit API URL.");
    }

    console.log(`🔍 Fetching Reddit post: ${postId}`);

    try {
      const response = await fetch(apiUrl, {
        headers: {
          "User-Agent": this.USER_AGENT,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Reddit post not found. Please check the URL.");
        }
        throw new Error(`Reddit API error: ${response.status} ${response.statusText}`);
      }

      const data: RedditApiResponse[] = await response.json();

      // Reddit returns an array: [post_data, comments_data]
      if (!data || data.length === 0 || !data[0]?.data?.children?.[0]) {
        throw new Error("Invalid response from Reddit API.");
      }

      const postData = data[0].data.children[0].data;

      // Extract thumbnail (handle various cases)
      let thumbnail: string | null = null;
      if (postData.thumbnail && 
          postData.thumbnail !== "self" && 
          postData.thumbnail !== "default" &&
          postData.thumbnail !== "nsfw" &&
          postData.thumbnail !== "spoiler" &&
          postData.thumbnail.startsWith("http")) {
        thumbnail = postData.thumbnail;
      } else if (postData.preview?.images?.[0]?.source?.url) {
        // Use preview image if thumbnail not available
        thumbnail = postData.preview.images[0].source.url.replace(/&amp;/g, "&");
      }

      const post: RedditPost = {
        id: postData.id,
        title: postData.title,
        author: postData.author,
        subreddit: postData.subreddit,
        url: `https://reddit.com${postData.permalink}`,
        permalink: postData.permalink,
        thumbnail,
        selftext: postData.selftext || "",
        upvotes: postData.ups || 0,
        num_comments: postData.num_comments || 0,
        created_utc: postData.created_utc,
        is_video: postData.is_video || false,
        post_hint: postData.post_hint,
        preview: postData.preview,
      };

      console.log(`✅ Reddit post fetched: "${post.title}" by u/${post.author}`);
      
      return post;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`❌ Error fetching Reddit post:`, error.message);
        throw error;
      }
      console.error(`❌ Unknown error fetching Reddit post:`, error);
      throw new Error("Failed to fetch Reddit post. Please try again.");
    }
  }

  /**
   * Get post age in human-readable format
   */
  static getPostAge(createdUtc: number): string {
    const now = Date.now() / 1000;
    const diffSeconds = now - createdUtc;
    
    const minutes = Math.floor(diffSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
    if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'just now';
  }

  /**
   * Validate if a post is suitable for tokenization
   */
  static validatePost(post: RedditPost): { valid: boolean; reason?: string } {
    // Check if post is deleted or removed
    if (post.author === "[deleted]" || post.author === "[removed]") {
      return { valid: false, reason: "This post has been deleted or removed." };
    }

    // Check if post is too old (optional: e.g., older than 1 year)
    const postAgeMonths = (Date.now() / 1000 - post.created_utc) / (30 * 24 * 60 * 60);
    if (postAgeMonths > 12) {
      return { valid: false, reason: "Post is too old. Please tokenize posts less than 1 year old." };
    }

    // Check if post has minimum engagement (optional)
    if (post.upvotes < 10) {
      return { valid: false, reason: "Post must have at least 10 upvotes to be tokenized." };
    }

    return { valid: true };
  }
}

