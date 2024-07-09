const { Sequelize, DataTypes } = require("sequelize");
const { db } = require("../config/dbConnect"); // Adjust this path as needed

const Project = db.define("projects", {
  _id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(1024), // Increase capacity
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(2048), // Increase capacity
    allowNull: false,
  },
  description2: {
    type: DataTypes.STRING(2048), // Increase capacity
    allowNull: false,
  },
  clientName: {
    type: DataTypes.STRING(512), // Increase capacity
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  liveLink: {
    type: DataTypes.STRING(1024), // Increase capacity
    allowNull: false,
  },
  category: {
    type: DataTypes.ARRAY(DataTypes.STRING(512)), // Increase capacity
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING(2048), // Increase capacity
  },
  imageTwo: {
    type: DataTypes.STRING(2048), // Increase capacity
  },
  portfolioImage: {
    type: DataTypes.STRING(2048), // Increase capacity
  },
  keyPoints: {
    type: DataTypes.ARRAY(DataTypes.STRING(1024)), // Increase capacity
    allowNull: false,
  },
  keyInsights: {
    type: DataTypes.ARRAY(DataTypes.STRING(1024)), // Increase capacity
    allowNull: false,
  },
  aboutProject: {
    type: DataTypes.STRING(4096), // Increase capacity
    allowNull: false,
  },
}, {
  timestamps: true
});

module.exports = Project;
