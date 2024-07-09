const { Sequelize, DataTypes } = require("sequelize");
const { db } = require("../config/dbConnect"); // Adjust this path

const Blog = db.define("blogs", {
  title: {
    type: DataTypes.STRING(2048),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(2048),
    allowNull: false,
  },
  category: {
    type: DataTypes.ARRAY(DataTypes.STRING(2048)),
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING(2048),
    allowNull: false,
  },
  image2: {
    type: DataTypes.STRING(2048),
    allowNull: false,
  },
  readTime: {
    type: DataTypes.STRING(2048),
    allowNull: false,
  },
  detailedInsights: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  keyPoints: {
    type: DataTypes.ARRAY(DataTypes.STRING(2048)),
    allowNull: false,
  },
  keyInsights: {
    type: DataTypes.ARRAY(DataTypes.STRING(2048)),
    allowNull: false,
  },
  quote: {
    type: DataTypes.STRING(2048),
    allowNull: false,
  },
  authorName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profileImg: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  designation: {
    type: DataTypes.STRING(2048),
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
