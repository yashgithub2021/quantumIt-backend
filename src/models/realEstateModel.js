const { Sequelize, DataTypes } = require("sequelize");
const { db } = require("../config/dbConnect");

const RealEstate = db.define(
  "RealEstates",
  {
    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          args: true,
          msg: "Please provide a valid email",
        },
      },
    },
    phone_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = RealEstate;
