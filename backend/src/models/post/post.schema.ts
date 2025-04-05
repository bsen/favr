import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/database";

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
  latitude!: number;
  longitude!: number;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
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
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    postalCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
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
        fields: ["latitude", "longitude"],
      },
      {
        fields: ["type"],
      },
    ],
  }
);

export default Post;
