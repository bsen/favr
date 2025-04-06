import User from "./user.schema";
import jwt from "jsonwebtoken";
import logger from "../../utils/logger";

class UserService {
  generateAuthToken(payload: { id: string; phone: string }): string {
    try {
      logger.info(`Generating JWT auth_token for user: ${payload.id}`);
      return jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: "30d",
      });
    } catch (error) {
      logger.error(
        `Error generating JWT: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw new Error("Failed to generate authentication auth_token");
    }
  }

  async createUserWithPhone(phone: string) {
    try {
      logger.info(`Checking for existing user with phone: ${phone}`);
      const existingUser = await User.findOne({ where: { phone } });

      if (existingUser) {
        logger.info(`Existing user found with phone: ${phone}`);
        return existingUser;
      }
      logger.info(`Creating new user with phone: ${phone}`);
      return await User.create({
        phone,
      });
    } catch (error) {
      logger.error(
        `Error creating user: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw new Error("Failed to create user");
    }
  }

  async findUserById(id: string) {
    try {
      const user = await User.findByPk(id, {
        attributes: [
          "id",
          "phone",
          "firstName",
          "birthDate",
          "gender",
          "profilePicture",
          "createdAt",
          "updatedAt",
        ],
      });

      if (!user) {
        logger.warn(`User not found with ID: ${id}`);
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      logger.error(
        `Error getting user profile: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw new Error("Failed to get user profile");
    }
  }

  async updateUserProfile(
    id: string,
    updateData: {
      firstName?: string;
      birthDate?: Date;
      gender?: string;
      profilePicture?: string;
    }
  ) {
    try {
      logger.info(`Updating user with ID: ${id}`);
      const user = await User.findByPk(id);

      if (!user) {
        logger.warn(`User not found with ID: ${id}`);
        throw new Error("User not found");
      }

      const updateFields: any = {};
      if (updateData.firstName !== undefined)
        updateFields.firstName = updateData.firstName;
      if (updateData.birthDate !== undefined)
        updateFields.birthDate = updateData.birthDate;
      if (updateData.gender !== undefined)
        updateFields.gender = updateData.gender;
      if (updateData.profilePicture !== undefined)
        updateFields.profilePicture = updateData.profilePicture;

      await user.update(updateFields);

      logger.info(`User updated successfully: ${user.phone}`);
      return user;
    } catch (error) {
      logger.error(
        `Error updating user: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw new Error(
        error instanceof Error ? error.message : "Failed to update user"
      );
    }
  }
}

export default new UserService();
