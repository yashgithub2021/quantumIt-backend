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
    type: DataTypes.ARRAY(DataTypes.TEXT),
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
  detailedInsights: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  keyPoints: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: false,
  },
  keyInsights: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: false,
  },
  quote: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  authorName: {
    type: DataTypes.STRING, // Typically author names don't need unlimited length
    allowNull: false,
  },
  profileImg: {
    type: DataTypes.STRING, // Typically URLs don't need unlimited length
    allowNull: false,
  },
  designation: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  about: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  socialMedia: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      facebook: '',
      twitter: '',
      instagram: ''
    }
  }
});

module.exports = Blog;
