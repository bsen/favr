import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

enum PostType {
  Request = "request",
  Offer = "offer",
  Announcement = "announcement",
}

enum PostStatus {
  Active = "active",
  Completed = "completed",
  Cancelled = "cancelled",
}

class Post extends Model {
  id!: number;
  title!: string;
  description?: string;
  price?: number;
  imageUrls?: string[];
  userId!: string;
  locationId!: string;
  status!: PostStatus;
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
    description: {
      type: DataTypes.TEXT,
    },
    price: {
      type: DataTypes.INTEGER,
    },
    imageUrls: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    locationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Locations",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("active", "cancelled", "completed"),
      allowNull: false,
      defaultValue: "active",
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
