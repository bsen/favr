import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

class Location extends Model {
  id!: string;
  userId!: string;
  latitude!: number;
  longitude!: number;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

Location.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
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
  },
  {
    sequelize,
    modelName: "Location",
    paranoid: true,
    timestamps: true,
    indexes: [
      {
        fields: ["userId"],
        unique: true,
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

export default Location;
