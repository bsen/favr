import Post from "./post.schema";
import User from "../user/user.schema";
import logger from "../../utils/logger";
import { Op } from "sequelize";

interface PostData {
  title: string;
  description?: string;
  imageUrls?: string[];
  userId: string;
  price?: number;
  type: string;
  latitude: number;
  longitude: number;
  address?: string;
  category: string;
}

class PostService {
  private validateCoordinates(latitude: number, longitude: number): boolean {
    return (
      latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180
    );
  }

  private validatePostData(postData: PostData): string | null {
    if (!postData.title.trim()) {
      return "Title is required";
    }

    if (
      postData.type === "offer" &&
      (postData.price === undefined || postData.price === null)
    ) {
      return "Price is required for offers";
    }

    if (postData.type === "request" && postData.price !== undefined) {
      postData.price = undefined;
    }

    if (!this.validateCoordinates(postData.latitude, postData.longitude)) {
      return "Invalid coordinates provided";
    }

    if (!postData.category) {
      return "Category is required";
    }

    return null;
  }

  async createPost({
    title,
    description,
    imageUrls,
    userId,
    price,
    type,
    latitude,
    longitude,
    address,
    category,
  }: PostData) {
    try {
      logger.info(
        `Creating new post for user: ${userId} at coordinates: ${latitude}, ${longitude}`
      );

      const validationError = this.validatePostData({
        title,
        description,
        imageUrls,
        userId,
        price,
        type,
        latitude,
        longitude,
        address,
        category,
      });

      if (validationError) {
        logger.warn(`Validation error: ${validationError}`);
        throw new Error(validationError);
      }

      const post = await Post.create({
        title,
        description,
        imageUrls,
        userId,
        price: type === "request" ? null : price,
        type,
        latitude,
        longitude,
        address,
        category,
      });

      logger.info(
        `Post created successfully with ID: ${post.id} at coordinates: ${latitude}, ${longitude}`
      );
      return post;
    } catch (error) {
      logger.error(
        `Error creating post: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw new Error(
        error instanceof Error ? error.message : "Failed to create post"
      );
    }
  }

  async getUserPosts(userId: string) {
    try {
      logger.info(`Fetching posts for user: ${userId}`);
      return await Post.findAll({
        where: { userId },
        attributes: [
          "id",
          "title",
          "description",
          "price",
          "imageUrls",
          "status",
          "type",
          "latitude",
          "longitude",
          "address",
          "category",
          "createdAt",
          "updatedAt",
        ],
        order: [["createdAt", "DESC"]],
      });
    } catch (error) {
      logger.error(
        `Error fetching user posts: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw new Error("Failed to fetch user posts");
    }
  }

  async getNearbyPosts(
    latitude: number,
    longitude: number,
    radius: number = 5,
    page: number = 1,
    limit: number = 10
  ) {
    try {
      logger.info(
        `Fetching nearby posts for coordinates: ${latitude}, ${longitude}, page: ${page}`
      );

      const offset = (page - 1) * limit;

      const latRange = radius / 111.32;
      const longRange =
        radius / (111.32 * Math.cos((latitude * Math.PI) / 180));

      const { count, rows: posts } = await Post.findAndCountAll({
        where: {
          status: "active",
          latitude: {
            [Op.between]: [latitude - latRange, latitude + latRange],
          },
          longitude: {
            [Op.between]: [longitude - longRange, longitude + longRange],
          },
        },
        include: [
          {
            model: User,
            attributes: ["id", "fullName", "profilePicture"],
            as: "user",
          },
        ],
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      const postsWithDistance = posts
        .map((post) => {
          const distance = this.calculateDistance(
            latitude,
            longitude,
            post.latitude,
            post.longitude
          );
          return {
            ...post.toJSON(),
            distance,
          };
        })
        .filter((post) => post.distance <= radius)
        .sort((a, b) => a.distance - b.distance);

      return {
        posts: postsWithDistance,
        totalCount: count,
        currentPage: page,
        hasMore: offset + limit < count,
      };
    } catch (error) {
      logger.error(
        `Error fetching nearby posts: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw new Error("Failed to fetch nearby posts");
    }
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(value: number): number {
    return (value * Math.PI) / 180;
  }

  async updatePostStatus(id: string, userId: string, status: string) {
    try {
      logger.info(`Updating post status with ID: ${id}`);
      const post = await Post.findOne({
        where: { id, userId },
      });

      if (!post) {
        logger.warn(`Post not found with ID: ${id}`);
        throw new Error("Post not found");
      }

      await post.update({ status: status });
      logger.info(`Post updated successfully: ${id}`);
      return true;
    } catch (error) {
      logger.error(
        `Error updating post status: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw new Error("Failed to update post status");
    }
  }
}

export default new PostService();
