import { Request, Response } from "express";
import postService from "../../models/post/post.service";
import logger from "../../utils/logger";
import User from "../../models/user/user.schema";

interface AuthRequest extends Request {
  user?: User;
}

const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      imageUrls,
      price,
      type,
      category,
      address,
      latitude,
      longitude,
    } = req.body;

    if (!title) {
      logger.warn("Missing title in createPost request");
      res.status(400).json({ message: "Title is required" });
      return;
    }

    if (!type || !["offer", "request"].includes(type)) {
      logger.warn(`Invalid post type provided: ${type}`);
      res
        .status(400)
        .json({ message: "Valid post type (offer or request) is required" });
      return;
    }

    if (type === "offer" && (price === undefined || price === null)) {
      logger.warn("Missing price for offer post");
      res.status(400).json({ message: "Price is required for offer posts" });
      return;
    }

    if (!category) {
      logger.warn("Missing category in createPost request");
      res.status(400).json({ message: "Category is required" });
      return;
    }

    if (!latitude || !longitude) {
      logger.warn("Missing coordinates in createPost request");
      res.status(400).json({ message: "Latitude and longitude are required" });
      return;
    }

    if (!req.user) {
      logger.warn("User not found in request");
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const post = await postService.createPost({
      title,
      description,
      imageUrls,
      price: type === "request" ? undefined : parseFloat(price),
      type,
      userId: req.user.id,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      address,
      category,
    });

    res.status(201).json({
      post,
      message: "Post created successfully",
    });
  } catch (error) {
    logger.error(
      `Error in createPost controller: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to create post",
    });
  }
};

const getUserPosts = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      logger.warn("User not found in request");
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const posts = await postService.getUserPosts(req.user.id);
    res.status(200).json({ posts });
  } catch (error) {
    logger.error(
      `Error in getUserPosts controller: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    res.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to get user posts",
    });
  }
};

const getNearbyPosts = async (req: AuthRequest, res: Response) => {
  try {
    const { latitude, longitude, radius, page, limit } = req.query;

    if (!latitude || !longitude) {
      logger.warn("Missing coordinates in getNearbyPosts request");
      res.status(400).json({ message: "Latitude and longitude are required" });
      return;
    }

    if (!req.user) {
      logger.warn("User not found in request");
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const result = await postService.getNearbyPosts(
      parseFloat(latitude as string),
      parseFloat(longitude as string),
      radius ? parseFloat(radius as string) : 5,
      page ? parseInt(page as string) : 1,
      limit ? parseInt(limit as string) : 10
    );

    res.status(200).json({
      posts: result.posts,
      totalCount: result.totalCount,
      currentPage: result.currentPage,
      hasMore: result.hasMore,
    });
  } catch (error) {
    logger.error(
      `Error in getNearbyPosts controller: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    res.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to get nearby posts",
    });
  }
};

const updatePostStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !status) {
      logger.warn("Missing post ID or status in updatePostStatus request");
      res.status(400).json({ message: "Post ID and status are required" });
      return;
    }

    if (!req.user) {
      logger.warn("User not found in request");
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    await postService.updatePostStatus(id, req.user.id, status);
    res.status(200).json({
      message: "Post status updated successfully",
    });
  } catch (error) {
    logger.error(
      `Error in updatePostStatus controller: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    res.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to update post status",
    });
  }
};

export default {
  createPost,
  getUserPosts,
  getNearbyPosts,
  updatePostStatus,
};
