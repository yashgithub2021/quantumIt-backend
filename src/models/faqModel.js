const { Sequelize, DataTypes } = require("sequelize");
const { db } = require("../config/dbConnect"); // Adjust this path as needed

const FAQ = db.define("faqs", {
  question: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // description: {
  //     type: DataTypes.TEXT,
  //     allowNull: false,
  // },
  // clientName: {
  //     type: DataTypes.STRING,
  //     allowNull: false,
  // },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  // keyPoints: {
  //     type: DataTypes.ARRAY(DataTypes.STRING),
  //     allowNull: false,
  // },
  // keyInsights: {
  //     type: DataTypes.ARRAY(DataTypes.STRING),
  //     allowNull: false,
  // },
  answer: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = FAQ;
