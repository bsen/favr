import sequelize from "../config/database";
import User from "./user/user.schema";
import Post from "./post/post.schema";
import OTP from "./otp/otp.schema";

User.hasMany(Post, {
  foreignKey: "userId",
  as: "posts",
});

Post.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

const models = {
  sequelize,
  User,
  OTP,
  Post,
};

export default models;
