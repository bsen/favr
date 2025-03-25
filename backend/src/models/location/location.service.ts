import Location from "./location.schema.js";
import fetchAddress from "../../services/mapbox.js";
import logger from "../../utils/logger.js";

interface AddressDetails {
  longitude: string;
  latitude: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

class LocationService {
  async getLocationDetails(longitude: number, latitude: number) {
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

  async createOrUpdateLocation(userId: string, addressDetails: AddressDetails) {
    try {
      const existingLocation = await Location.findOne({ where: { userId } });

      const locationData = {
        userId,
        ...addressDetails,
      };

      if (existingLocation) {
        const updatedLocation = await existingLocation.update(locationData);
        return {
          success: true,
          data: updatedLocation,
          message: "Location updated successfully",
        };
      } else {
        const newLocation = await Location.create(locationData);
        return {
          success: true,
          data: newLocation,
          message: "Location created successfully",
        };
      }
    } catch (error) {
      logger.error(
        `Error creating/updating location: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      return {
        success: false,
        message: "Failed to save location",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

export default new LocationService();
