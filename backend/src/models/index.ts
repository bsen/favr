import sequelize from "../config/database.js";
import User from "./user/user.schema.js";
import OTP from "./otp/otp.schema.js";
import Location from "./location/location.schema.js";

User.hasOne(Location, {
  foreignKey: "userId",
  as: "location",
});

Location.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

const models = {
  sequelize,
  User,
  OTP,
  Location,
};

export default models;
