const { Sequelize, DataTypes } = require("sequelize");
const { db } = require("../config/dbConnect"); // Adjust this path

const ContactUsForm = db.define("contactusforms", {
  _id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
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
  companyName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  about: {
    type: DataTypes.STRING,
    allowNull: true
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  resume: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true
});

module.exports = ContactUsForm;
