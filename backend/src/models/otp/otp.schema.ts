import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

class OTP extends Model {
  id!: string;
  phone!: string;
  otp!: string;
}

OTP.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otp: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "OTP",
    paranoid: false,
    timestamps: true,
    indexes: [
      {
        fields: ["phone"],
        unique: true,
      },
    ],
  }
);

export default OTP;
