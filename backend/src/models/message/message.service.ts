import Message from "./message.schema";
import Post from "../post/post.schema";
import User from "../user/user.schema";
import logger from "../../utils/logger";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";

interface MessageData {
  price?: number;
  text?: string;
  postId: number;
  senderId: string;
  receiverId: string;
  type?: string;
  meta?: object;
  threadId?: string;
}

class MessageService {
  async createMessage({
    price,
    text,
    postId,
    senderId,
    receiverId,
    type = "text",
    meta,
    threadId,
  }: MessageData) {
    try {
      logger.info(
        `Creating new message for post: ${postId} from ${senderId} to ${receiverId}`
      );

      const post = await Post.findByPk(postId);
      if (!post) {
        logger.warn(`Post not found with ID: ${postId}`);
        throw new Error("Post not found");
      }

      if (post.status !== "open") {
        logger.warn(`Post ${postId} is not open for messages`);
        throw new Error("This post is not accepting messages");
      }

      const messageThreadId = threadId || uuidv4();

      const message = await Message.create({
        price,
        text,
        postId,
        senderId,
        receiverId,
        threadId: messageThreadId,
        type,
        meta,
        status: "pending",
      });

      if (!threadId) {
        await post.update({
          metrics: {
            ...post.metrics,
            responses: (post.metrics?.responses || 0) + 1,
          },
        });
      }

      logger.info(`Message created successfully with ID: ${message.id}`);
      return message;
    } catch (error) {
      logger.error(
        `Error creating message: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw error instanceof Error
        ? error
        : new Error("Failed to create message");
    }
  }

  async getPostMessages(postId: number, userId: string) {
    try {
      logger.info(`Fetching messages for post: ${postId}`);

      const post = await Post.findByPk(postId);
      if (!post) {
        throw new Error("Post not found");
      }

      const messages = await Message.findAll({
        where: { postId },
        attributes: [
          "id",
          "threadId",
          "senderId",
          "receiverId",
          "text",
          "price",
          "type",
          "meta",
          "status",
          "createdAt",
        ],
        include: [
          {
            model: User,
            as: "sender",
            attributes: ["id", "fullName", "profilePicture"],
          },
          {
            model: User,
            as: "receiver",
            attributes: ["id", "fullName", "profilePicture"],
          },
        ],
        order: [["createdAt", "ASC"]],
      });

      const threads = new Map();

      messages.forEach((message) => {
        const msg = message.toJSON();

        if (!threads.has(msg.threadId)) {
          threads.set(msg.threadId, []);
        }

        threads.get(msg.threadId).push(msg);
      });

      return Array.from(threads.values());
    } catch (error) {
      logger.error(
        `Error fetching post messages: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw error instanceof Error
        ? error
        : new Error("Failed to fetch post messages");
    }
  }

  async getUserThreads(userId: string) {
    try {
      logger.info(`Fetching message threads for user: ${userId}`);

      const messages = await Message.findAll({
        where: {
          [Op.or]: [{ senderId: userId }, { receiverId: userId }],
        },
        attributes: [
          "threadId",
          "senderId",
          "receiverId",
          "postId",
          "status",
          "createdAt",
        ],
        include: [
          {
            model: Post,
            as: "post",
            attributes: ["id", "title", "type", "status"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      const threadMap = new Map();

      messages.forEach((message) => {
        const data = message.toJSON();

        if (
          !threadMap.has(data.threadId) ||
          threadMap.get(data.threadId).createdAt < data.createdAt
        ) {
          threadMap.set(data.threadId, data);
        }
      });

      return Array.from(threadMap.values()).sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      logger.error(
        `Error fetching user threads: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw error instanceof Error
        ? error
        : new Error("Failed to fetch user threads");
    }
  }

  async getThreadMessages(threadId: string, userId: string) {
    try {
      logger.info(`Fetching messages for thread: ${threadId}`);

      const messages = await Message.findAll({
        where: {
          threadId,
          [Op.or]: [{ senderId: userId }, { receiverId: userId }],
        },
        attributes: [
          "id",
          "senderId",
          "receiverId",
          "text",
          "price",
          "type",
          "meta",
          "status",
          "createdAt",
        ],
        include: [
          {
            model: User,
            as: "sender",
            attributes: ["id", "fullName", "profilePicture"],
          },
        ],
        order: [["createdAt", "ASC"]],
      });

      if (messages.length === 0) {
        throw new Error("Thread not found or you don't have access");
      }

      const firstMessage = messages[0];
      const post = await Post.findByPk(firstMessage.postId);

      if (post && post.userId === userId) {
        const initiatorMessage = messages.find(
          (msg) => msg.senderId !== userId
        );
        if (initiatorMessage) {
          await initiatorMessage.update({ status: "replied" });
        }
      }

      return messages;
    } catch (error) {
      logger.error(
        `Error fetching thread messages: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw error instanceof Error
        ? error
        : new Error("Failed to fetch thread messages");
    }
  }

  async canSendMessage(threadId: string, userId: string) {
    try {
      const firstMessage = await Message.findOne({
        where: { threadId },
        order: [["createdAt", "ASC"]],
      });

      if (!firstMessage) {
        return false;
      }

      const post = await Post.findByPk(firstMessage.postId);
      if (!post) {
        return false;
      }

      if (post.status !== "open") {
        return false;
      }

      if (post.userId === userId) {
        return true;
      }

      const postOwnerReplied = await Message.findOne({
        where: {
          threadId,
          senderId: post.userId,
        },
      });

      return !!postOwnerReplied;
    } catch (error) {
      logger.error(
        `Error checking if user can send message: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      return false;
    }
  }
}

export default new MessageService();
