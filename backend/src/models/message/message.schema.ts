import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/database";

enum MessageStatus {
  Pending = "pending",
  Replied = "replied",
}

enum MessageType {
  Text = "text",
  Image = "image",
}

class Message extends Model {
  id!: number;
  price?: number;
  text?: string;
  postId!: number;
  senderId!: string;
  receiverId!: string;
  threadId!: string;
  type!: MessageType;
  meta?: object;
  status!: MessageStatus;
  createdAt!: Date;
  updatedAt!: Date;
}

Message.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    text: {
      type: DataTypes.TEXT,
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
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    receiverId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    threadId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("text", "image"),
      allowNull: false,
      defaultValue: "text",
    },
    meta: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "replied"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    modelName: "Message",
    paranoid: true,
    timestamps: true,
    indexes: [
      {
        fields: ["postId"],
      },
      {
        fields: ["senderId"],
      },
      {
        fields: ["receiverId"],
      },
      {
        fields: ["threadId"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["type"],
      },
    ],
  }
);

export default Message;
