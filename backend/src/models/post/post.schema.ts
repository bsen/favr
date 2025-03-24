import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

enum PostType {
  Request = "request",
  Offer = "offer",
  Announcement = "announcement",
}

class Post extends Model {
  id!: number;
  title!: string;
  content?: string;
  imageUrls?: string[];
  userId!: number;
  locationId?: string;
  type!: PostType;
  createdAt!: Date;
  updatedAt!: Date;
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
    },
    imageUrls: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    locationId: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.ENUM("request", "offer", "announcement"),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Post",
    paranoid: true,
    timestamps: true,
    indexes: [
      {
        fields: ["userId"],
      },
      {
        fields: ["locationId", "type"],
      },
    ],
  }
);

export default Post;