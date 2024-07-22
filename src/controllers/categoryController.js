const Category = require("../models/categoryModel");
const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");

exports.createCategory = catchAsyncError(async (req, res, next) => {
    console.log("bbooddyy", req.body)
    const { name } = req.body

    if (!name)
        return next(new ErrorHandler("Name is Required", 400))

    const isExisting = await Category.findOne({
        where: {
            name
        }
    })

    if (isExisting)
        return next(new ErrorHandler("Category already exist!", 400))

    const category = await Category.create({
        name
    })

    if (!category)
        return next(new ErrorHandler("There was same problem creating Category"))

    res.status(200).json({ success: true, message: `Category ${name} created successfully!` })
})

exports.getCategory = catchAsyncError(async (req, res, next) => {
    const category = await Category.findAll({
        order: [['createdAt', 'DESC']]
    })

    res.status(200).json({ success: true, category })
})

exports.deleteCategory = catchAsyncError(async (req, res, next) => {
    const { id } = req.params.id

    if (!id)
        return next(new ErrorHandler("Category id is Required"))

    const category = await Category.findByPk(id)

    if (!category)
        return next(new ErrorHandler("Category Not Found", 404))

    const deleted = await Category.destroy({
        where: {
            id
        }
    })

    if (deleted === 0)
        return next(new ErrorHandler("There was some problem deleting the Category"))

    res.status(200).json({ success: true, message: "Category deleted successfully!" })
})