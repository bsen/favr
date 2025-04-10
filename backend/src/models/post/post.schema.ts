import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/database";

enum PostType {
  Request = "request",
  Offer = "offer",
}

enum PostStatus {
  Open = "open",
  Closed = "closed",
}

class Post extends Model {
  id!: number;
  title!: string;
  description?: string;
  price?: number;
  images?: string[];
  userId!: string;
  latitude!: number;
  longitude!: number;
  address?: string;
  status!: PostStatus;
  type!: PostType;
  category?: string;
  metrics?: {
    views: number;
    responses: number;
  };
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
      allowNull: true,
    },
    images: {
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
    status: {
      type: DataTypes.ENUM("open", "closed"),
      allowNull: false,
      defaultValue: "open",
    },
    type: {
      type: DataTypes.ENUM("request", "offer"),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    metrics: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: { views: 0, responses: 0 },
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
      {
        fields: ["category"],
      },
      {
        fields: ["status"],
      },
    ],
  }
);

export default Post;
