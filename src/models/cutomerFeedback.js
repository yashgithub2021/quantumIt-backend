const { Sequelize, DataTypes } = require("sequelize");
const { db } = require("../config/dbConnect"); // Adjust this path as needed

const Feedbacks = db.define("feedbacks", {
    _id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    profileImg: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    designation: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    stars: {
        type: DataTypes.INTEGER, // Assuming rating is an integer
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    link: {
        type: DataTypes.STRING,
        allowNull: true
    },
    logo: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

Feedbacks.sync({ alter: true })

module.exports = Feedbacks;
