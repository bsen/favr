import Reply from "./reply.schema.js";
import Post from "../post/post.schema.js";
import User from "../user/user.schema.js";
import logger from "../../utils/logger.js";
import sequelize from "../../config/database.js";
import { Op } from "sequelize";

interface ReplyData {
  price: number;
  description?: string;
  imageUrls?: string[];
  postId: number;
  userId: string;
}

class ReplyService {
  async createReply({
    price,
    description,
    imageUrls,
    postId,
    userId,
  }: ReplyData) {
    try {
      logger.info(`Creating new reply for post: ${postId} by user: ${userId}`);

      const post = await Post.findByPk(postId);
      if (!post) {
        logger.warn(`Post not found with ID: ${postId}`);
        throw new Error("Post not found");
      }

      const reply = await Reply.create({
        price,
        description,
        imageUrls,
        postId,
        userId,
        status: "pending",
      });

      logger.info(`Reply created successfully with ID: ${reply.id}`);
      return reply;
    } catch (error) {
      logger.error(
        `Error creating reply: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw new Error("Failed to create reply");
    }
  }

  async getPostReplies(postId: number) {
    try {
      logger.info(`Fetching replies for post: ${postId}`);
      const replies = await Reply.findAll({
        where: { postId },
        attributes: [
          "id",
          "price",
          "description",
          "imageUrls",
          "status",
          "createdAt",
          "updatedAt",
        ],
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "profilePicture"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      return replies;
    } catch (error) {
      logger.error(
        `Error fetching post replies: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw new Error("Failed to fetch post replies");
    }
  }

  async getUserReplies(userId: string) {
    try {
      logger.info(`Fetching replies by user: ${userId}`);
      return await Reply.findAll({
        where: { userId },
        attributes: [
          "id",
          "price",
          "description",
          "imageUrls",
          "status",
          "createdAt",
          "updatedAt",
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
    } catch (error) {
      logger.error(
        `Error fetching user replies: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw new Error("Failed to fetch user replies");
    }
  }

  async acceptReply(replyId: number, postId: number, postOwnerId: string) {
    try {
      logger.info(`Accepting reply ID: ${replyId} for post: ${postId}`);

      const post = await Post.findOne({
        where: { id: postId, userId: postOwnerId },
      });

      if (!post) {
        logger.warn(`Post not found or not owned by user: ${postOwnerId}`);
        throw new Error("Post not found or unauthorized");
      }

      const reply = await Reply.findOne({
        where: { id: replyId, postId },
      });

      if (!reply) {
        logger.warn(`Reply not found with ID: ${replyId}`);
        throw new Error("Reply not found");
      }

      await reply.update({ status: "accepted" });

      await post.update({ status: "completed" });

      await Reply.update(
        { status: "pending" },
        { where: { postId, id: { [Op.ne]: replyId } } }
      );

      logger.info(`Reply ${replyId} accepted and post ${postId} completed`);
      return true;
    } catch (error) {
      logger.error(
        `Error accepting reply: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw new Error("Failed to accept reply");
    }
  }
}

export default new ReplyService();
