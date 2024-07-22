const { DataTypes } = require('sequelize')
const { db } = require('../config/dbConnect')

const Category = db.define('Category', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

module.exports = Category