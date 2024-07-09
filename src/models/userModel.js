const { Sequelize, DataTypes } = require("sequelize");
const { db } = require("../config/dbConnect"); // Adjust this path as needed
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = db.define("users", {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    },
    instanceMethods: {
        validPassword: async function (password) {
            return await bcrypt.compare(password, this.password);
        },
        generateToken: async function () {
            const token = await jwt.sign({ id: this.id, email: this.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return token;
        }
    },
    timestamps: true
});
// Instance method to validate password
User.prototype.validPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Instance method to generate JWT token
User.prototype.generateToken = function () {
    return jwt.sign({ id: this.id, email: this.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};
module.exports = User;
