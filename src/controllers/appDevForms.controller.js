const AppDevForms = require("../models/appDevForm")
const ErrorHandler = require("../utils/ErrorHandler")

exports.Create = async (req, res, next) => {
    const { name, contact, message } = req.body

    if (!name || !contact || !message)
        return next(new ErrorHandler("All fields are required", 501))

    let form
    try {
        form = await AppDevForms.create(req.body)

        res.status(200).json({ success: true, message: "Saved Successfully!" })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error saving form' })
    }
}

exports.GetAllQueries = async (req, res, next) => {
    const queries = await AppDevForms.findAll()
    res.status(200).json({ success: true, queries })
}