import { Request, Response } from "express";
import replyService from "../../models/reply/reply.service.js";
import logger from "../../utils/logger.js";
import User from "../../models/user/user.schema.js";

interface AuthRequest extends Request {
  user?: User;
}

const createReply = async (req: AuthRequest, res: Response) => {
  try {
    const { price, description, imageUrls, postId } = req.body;

    if (!price || !postId) {
      logger.warn("Missing required fields in createReply request");
      res.status(400).json({ message: "Price and postId are required" });
      return;
    }

    if (!req.user) {
      logger.warn("User not found in request");
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const reply = await replyService.createReply({
      price,
      description,
      imageUrls,
      postId,
      userId: req.user.id,
    });

    res.status(201).json({
      reply,
      message: "Reply created successfully",
    });
  } catch (error) {
    logger.error(
      `Error in createReply controller: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    res.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to create reply",
    });
  }
};

const getPostReplies = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      logger.warn("Missing postId in getPostReplies request");
      res.status(400).json({ message: "Post ID is required" });
      return;
    }

    if (!req.user) {
      logger.warn("User not found in request");
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const replies = await replyService.getPostReplies(parseInt(postId));
    res.status(200).json({ replies });
  } catch (error) {
    logger.error(
      `Error in getPostReplies controller: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    res.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to get post replies",
    });
  }
};

const getUserReplies = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      logger.warn("User not found in request");
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const replies = await replyService.getUserReplies(req.user.id);
    res.status(200).json({ replies });
  } catch (error) {
    logger.error(
      `Error in getUserReplies controller: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    res.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to get user replies",
    });
  }
};

const acceptReply = async (req: AuthRequest, res: Response) => {
  try {
    const { replyId, postId } = req.params;

    if (!replyId || !postId) {
      logger.warn("Missing required parameters in acceptReply request");
      res.status(400).json({ message: "Reply ID and Post ID are required" });
      return;
    }

    if (!req.user) {
      logger.warn("User not found in request");
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    await replyService.acceptReply(
      parseInt(replyId),
      parseInt(postId),
      req.user.id
    );

    res.status(200).json({
      message: "Reply accepted successfully",
    });
  } catch (error) {
    logger.error(
      `Error in acceptReply controller: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    res.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to accept reply",
    });
  }
};

export default {
  createReply,
  getPostReplies,
  getUserReplies,
  acceptReply,
};
