import User from "./user.schema";
import jwt from "jsonwebtoken";
import logger from "../../utils/logger";
import fetchAddress from "../../services/mapbox";

interface AddressDetails {
  longitude: string;
  latitude: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

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
          "name",
          "profilePicture",
          "latitude",
          "longitude",
          "address",
          "city",
          "state",
          "postalCode",
          "country",
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

  async getLocationDetailsFromCoordinates(longitude: number, latitude: number) {
    try {
      logger.info(`Fetching address details for ${longitude}, ${latitude}`);
      const address = await fetchAddress(longitude, latitude);
      const addressFeatures = address.features;

      let addressDetails = {
        longitude,
        latitude,
        address: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      };

      for (const feature of addressFeatures) {
        switch (feature.place_type[0]) {
          case "address":
            addressDetails.address = feature.text;
            break;
          case "place":
            addressDetails.city = feature.text;
            break;
          case "region":
            addressDetails.state = feature.text;
            break;
          case "postcode":
            addressDetails.postalCode = feature.text;
            break;
          case "country":
            addressDetails.country = feature.text;
            break;
        }
      }

      return {
        success: true,
        data: addressDetails,
        message: "Address details fetched successfully",
      };
    } catch (error) {
      logger.error(
        `Error fetching address details: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      return {
        success: false,
        message: "Failed to fetch address details",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async updateUserProfile(
    id: string,
    updateData: { name?: string; bio?: string; addressDetails?: AddressDetails }
  ) {
    try {
      logger.info(`Updating user with ID: ${id}`);
      const user = await User.findByPk(id);

      if (!user) {
        logger.warn(`User not found with ID: ${id}`);
        throw new Error("User not found");
      }

      const updateFields: any = {};
      if (updateData.name !== undefined) updateFields.name = updateData.name;
      if (updateData.bio !== undefined) updateFields.bio = updateData.bio;
      if (updateData.addressDetails) {
        updateFields.latitude = updateData.addressDetails.latitude;
        updateFields.longitude = updateData.addressDetails.longitude;
        updateFields.address = updateData.addressDetails.address;
        updateFields.city = updateData.addressDetails.city;
        updateFields.state = updateData.addressDetails.state;
        updateFields.postalCode = updateData.addressDetails.postalCode;
        updateFields.country = updateData.addressDetails.country;
      }

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
