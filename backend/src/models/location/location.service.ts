import Location from "./location.schema.js";
import fetchAddress from "../../services/mapbox.js";

class LocationService {
  async createOrUpdateLocation(
    userId: string,
    longitude: number,
    latitude: number
  ) {
    const address = await fetchAddress(longitude, latitude);
    const addressFeatures = address.features;

    let addressDetails = {
      userId,
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

    const existingLocation = await Location.findOne({ where: { userId } });

    if (existingLocation) {
      return await existingLocation.update(addressDetails);
    } else {
      return await Location.create(addressDetails);
    }
  }

  async getLocationByUserId(userId: string) {
    return await Location.findOne({ where: { userId } });
  }
}

export default new LocationService();
