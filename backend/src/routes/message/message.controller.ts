import { Request, Response } from "express";
import messageService from "../../models/message/message.service";
import postService from "../../models/post/post.service";
import logger from "../../utils/logger";
import User from "../../models/user/user.schema";
import Post from "../../models/post/post.schema";

interface AuthRequest extends Request {
  user?: User;
}

const createMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { price, text, postId, threadId, type, meta } = req.body;

    if (!postId) {
      logger.warn("Missing required fields in createMessage request");
      res.status(400).json({ message: "PostId is required" });
      return;
    }

    if (!text) {
      logger.warn("Missing text in createMessage request");
      res.status(400).json({ message: "Message text is required" });
      return;
    }

    if (!req.user) {
      logger.warn("User not found in request");
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    if (threadId) {
      const canSend = await messageService.canSendMessage(
        threadId,
        req.user.id
      );
      if (!canSend) {
        logger.warn(
          `User ${req.user.id} not authorized to send message in thread ${threadId}`
        );
        res
          .status(403)
          .json({ message: "You cannot send messages in this thread yet" });
        return;
      }
    }

    const post = await Post.findByPk(postId);
    if (!post) {
      logger.warn(`Post not found with ID: ${postId}`);
      res.status(404).json({ message: "Post not found" });
      return;
    }

    const senderId = req.user.id;
    let receiverId;

    if (threadId) {
      const thread = await messageService.getThreadMessages(threadId, senderId);
      if (thread.length > 0) {
        const firstMessage = thread[0];
        receiverId =
          firstMessage.senderId === senderId
            ? firstMessage.receiverId
            : firstMessage.senderId;
      } else {
        logger.warn(`Thread ${threadId} not found`);
        res.status(404).json({ message: "Thread not found" });
        return;
      }
    } else {
      receiverId = post.userId;

      if (senderId === receiverId) {
        logger.warn(`User ${senderId} tried to message their own post`);
        res.status(400).json({ message: "You cannot message your own post" });
        return;
      }
    }

    const message = await messageService.createMessage({
      price,
      text,
      postId,
      senderId,
      receiverId,
      threadId,
      type,
      meta,
    });

    res.status(201).json({
      message,
      success: true,
    });
  } catch (error) {
    logger.error(
      `Error in createMessage controller: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    res.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to create message",
      success: false,
    });
  }
};

const getPostMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      logger.warn("Missing postId in getPostMessages request");
      res.status(400).json({ message: "Post ID is required" });
      return;
    }

    if (!req.user) {
      logger.warn("User not found in request");
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const threads = await messageService.getPostMessages(
      parseInt(postId),
      req.user.id
    );
    res.status(200).json({
      threads,
      success: true,
    });
  } catch (error) {
    logger.error(
      `Error in getPostMessages controller: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    res.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to get post messages",
      success: false,
    });
  }
};

const getUserThreads = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      logger.warn("User not found in request");
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const threads = await messageService.getUserThreads(req.user.id);
    res.status(200).json({
      threads,
      success: true,
    });
  } catch (error) {
    logger.error(
      `Error in getUserThreads controller: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    res.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to get user threads",
      success: false,
    });
  }
};

const getThreadMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { threadId } = req.params;

    if (!threadId) {
      logger.warn("Missing threadId in getThreadMessages request");
      res.status(400).json({ message: "Thread ID is required" });
      return;
    }

    if (!req.user) {
      logger.warn("User not found in request");
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const messages = await messageService.getThreadMessages(
      threadId,
      req.user.id
    );
    res.status(200).json({
      messages,
      success: true,
    });
  } catch (error) {
    logger.error(
      `Error in getThreadMessages controller: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to get thread messages",
      success: false,
    });
  }
};

export default {
  createMessage,
  getPostMessages,
  getUserThreads,
  getThreadMessages,
};
