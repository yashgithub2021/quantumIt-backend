const { Sequelize, DataTypes } = require("sequelize");
const { db } = require("../config/dbConnect"); // Adjust this path as needed

const Contributors = db.define("contributors", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    profileImage: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    numberOfArticles: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

module.exports = Contributors;
