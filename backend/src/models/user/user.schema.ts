import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/database";

class User extends Model {
  id!: string;
  name?: string;
  bio?: string;
  profilePicture?: string;
  phone!: string;
  isActive!: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    birthDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    paranoid: true,
    timestamps: true,
    indexes: [
      {
        fields: ["phone"],
        unique: true,
      },
    ],
  }
);

export default User;
