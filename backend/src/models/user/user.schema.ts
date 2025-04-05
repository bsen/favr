import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/database";

class User extends Model {
  id!: string;
  name?: string;
  bio?: string;
  profilePicture?: string;
  phone!: string;
  isActive!: boolean;
  latitude?: number;
  longitude?: number;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
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
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bio: {
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
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
      validate: {
        min: -90,
        max: 90,
      },
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
      validate: {
        min: -180,
        max: 180,
      },
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
      {
        fields: ["name"],
      },
      {
        fields: ["latitude", "longitude"],
      },
      {
        fields: ["city"],
      },
      {
        fields: ["state"],
      },
      {
        fields: ["country"],
      },
    ],
  }
);

export default User;
