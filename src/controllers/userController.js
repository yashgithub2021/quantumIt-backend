const UserModel = require('../models/userModel');
const catchAsyncError = require('../utils/catchAsyncError');
const jwt = require("jsonwebtoken");

exports.signupAdmin = catchAsyncError(async (req, res, next) => {
    const { email, name, role, password, key } = req.body;
    if (key === 'aresController@123') {
        if (!name || !role || !password || !email) {
            return res.status(400).json({
                success: false,
                message: "Invalid username or password"
            });
        }
        const isCreated = await UserModel.findOne({ name, role });
        if (isCreated)
            return res.status(400).json({
                success: false,
                message: "Already created this admin"
            });
        const user = await new UserModel({
            email, name, role, password
        });
        await user.save();
        const token = user.getJWTToken();
        res.status(200).json({ user, token });
    } else {
        return res.status(400).json({
            success: false,
            message: "⚠ You are unauthorized ⚠"
        });
    }
});

exports.login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({
            success: false,
            message: "Please enter your email and password"
        });

    const user = await UserModel.findOne({ email: { $regex: new RegExp(email, "i") } }).select("+password");

    if (!user) {
        return res.status(400).json({
            success: false,
            message: "Invalid email or password"
        });
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched)
        return res.status(400).json({
            success: false,
            message: "Invalid email or password!"
        });

    const token = user.getJWTToken();
    res.status(201).json({ user, token });
});

exports.getProfile = catchAsyncError(async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "No token provided"
        });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
    console.log(decoded)

    const user = await UserModel.findById(decoded.userId).select('-password');
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    res.status(200).json({
        success: true,
        user
    });
});


exports.updateProfile = catchAsyncError(async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "No token provided"
        });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }

    const { name, email } = req.body;
    const updatedData = { name, email };

    const user = await UserModel.findByIdAndUpdate(decoded.id, updatedData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    res.status(200).json({
        success: true,
        user
    });
});
