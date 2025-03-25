import sequelize from "../config/database.js";
import User from "./user/user.schema.js";
import Post from "./post/post.schema.js";
import OTP from "./otp/otp.schema.js";
import Location from "./location/location.schema.js";

User.hasOne(Location, {
  foreignKey: "userId",
  as: "location",
});

User.hasMany(Post, {
  foreignKey: "userId",
  as: "posts",
});

Location.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Location.hasMany(Post, {
  foreignKey: "locationId",
  as: "posts",
});

Post.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Post.belongsTo(Location, {
  foreignKey: "locationId",
  as: "location",
});

const models = {
  sequelize,
  User,
  OTP,
  Location,
  Post,
};

export default models;
