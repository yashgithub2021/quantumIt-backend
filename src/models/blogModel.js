const { Sequelize, DataTypes } = require("sequelize");
const { db } = require("../config/dbConnect"); // Adjust this path

const Blog = db.define("blogs", {
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image2: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  readTime: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  quote: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = Blog;
