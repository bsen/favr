import axios from "axios";

const mapboxToken =
  "pk.eyJ1IjoiYmlzd2Fhc2VuIiwiYSI6ImNtOG5kMG1xcDBjcjYybHNnbXl3a3BmY3UifQ.nL_aJTlKbbuLrwZwuni43A";

const fetchAddress = async (longitude: number, latitude: number) => {
  const response = await axios.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxToken}`
  );
  const data = response.data;
  return data;
};

export default fetchAddress;
