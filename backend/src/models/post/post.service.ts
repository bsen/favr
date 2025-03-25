import Post from "./post.schema.js";
import Location from "../location/location.schema.js";
import logger from "../../utils/logger.js";
import sequelize from "../../config/database.js";

interface PostData {
  title: string;
  description?: string;
  imageUrls?: string[];
  userId: string;
  price?: number;
  type?: string;
}

interface PostWithLocation extends Post {
  location?: Location;
}

class PostService {
  async createPost({
    title,
    description,
    imageUrls,
    userId,
    price,
    type = "offer",
  }: PostData) {
    try {
      logger.info(`Creating new post for user: ${userId}`);
      const location = await Location.findOne({
        where: { userId },
        attributes: ["id"],
      });

      if (!location) {
        logger.warn(`Location not found for user: ${userId}`);
        throw new Error("Location not found");
      }

      const post = await Post.create({
        title,
        description,
        imageUrls,
        userId,
        locationId: location.id,
        price,
        type,
      });

      logger.info(`Post created successfully with ID: ${post.id}`);
      return post;
    } catch (error) {
      logger.error(
        `Error creating post: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw new Error("Failed to create post");
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

      const [posts, totalCount] = (await Promise.all([
        sequelize.query(`
          WITH posts_with_distance AS (
            SELECT 
              p.id, p.title, p.description, p.price, p."imageUrls", 
              p.status, p.type, p."createdAt", p."updatedAt",
              l.id as "locationId", l.latitude, l.longitude,
              l.address, l.city, l.state, l."postalCode", l.country,
              u.id as "userId", u.name, u."profilePicture",
              (6371 * acos(cos(radians(${latitude})) * cos(radians(l.latitude)) * 
              cos(radians(l.longitude) - radians(${longitude})) + 
              sin(radians(${latitude})) * sin(radians(l.latitude)))) AS distance
            FROM "Posts" p
            JOIN "Locations" l ON p."locationId" = l.id
            JOIN "Users" u ON p."userId" = u.id
            WHERE p.status = 'active'
          )
          SELECT * FROM posts_with_distance
          WHERE distance <= ${radius}
          ORDER BY distance
          LIMIT ${limit} OFFSET ${offset}
        `),
        sequelize.query(`
          SELECT COUNT(*) as total
          FROM "Posts" p
          JOIN "Locations" l ON p."locationId" = l.id
          WHERE p.status = 'active'
          AND (6371 * acos(cos(radians(${latitude})) * cos(radians(l.latitude)) * 
          cos(radians(l.longitude) - radians(${longitude})) + 
          sin(radians(${latitude})) * sin(radians(l.latitude)))) <= ${radius}
        `),
      ])) as unknown as [any[], [{ total: string }]];

      const total = parseInt(totalCount[0].total);
      return {
        posts: posts[0],
        totalCount: total,
        currentPage: page,
        hasMore: offset + limit < total,
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
