import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/database";

enum ReplyStatus {
  Pending = "pending",
  Accepted = "accepted",
}

class Reply extends Model {
  id!: number;
  price!: number;
  description?: string;
  imageUrls?: string[];
  postId!: number;
  userId!: string;
  status!: ReplyStatus;
  createdAt!: Date;
  updatedAt!: Date;
}

Reply.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imageUrls: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Posts",
        key: "id",
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    modelName: "Reply",
    paranoid: true,
    timestamps: true,
    indexes: [
      {
        fields: ["postId"],
      },
      {
        fields: ["userId"],
      },
      {
        fields: ["status"],
      },
    ],
  }
);

export default Reply;
