const UserModel = require('../models/userModel');
const catchAsyncError = require('../utils/catchAsyncError');
const jwt = require("jsonwebtoken");
const { Op } = require('sequelize')
const projectDataSpicesUSA = {
    email: "yash@gmail.com",
    name: "Admin",
    role: "Admin",
    password: "123456789"
};

// Example function to create a project
async function createProject(data) {
    try {
        const newProject = await UserModel.create(data);
        console.log('Project created successfully:', newProject);
    } catch (error) {
        console.error('Error creating project:', error);
    }
}

// createProject(projectDataSpicesUSA)
exports.signupAdmin = catchAsyncError(async (req, res, next) => {
    const { email, name, role, password, key } = req.body;
    if (key === 'aresController@123') {
        if (!name || !role || !password || !email) {
            return res.status(400).json({
                success: false,
                message: "Invalid username or password",
            });
        }
        const isCreated = await UserModel.findOne({ where: { name, role } });
        if (isCreated) {
            return res.status(400).json({
                success: false,
                message: "Already created this admin",
            });
        }
        const user = await UserModel.create({
            email, name, role, password
        });
        const token = user.getJWTToken();
        res.status(200).json({ user, token });
    } else {
        return res.status(400).json({
            success: false,
            message: "⚠ You are unauthorized ⚠",
        });
    }
});

exports.login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please enter your email and password",
        });
    }

    const user = await UserModel.findOne({
        where: {
            email: {
                [Op.iLike]: email
            }
        },
        attributes: ['id', 'name', 'role', 'email', 'password']
    });

    if (!user) {
        return res.status(400).json({
            success: false,
            message: "Invalid email or password",
        });
    }
    const isPasswordMatched = await user.validPassword(password);
    if (!isPasswordMatched) {
        return res.status(400).json({
            success: false,
            message: "Invalid email or password!",
        });
    }

    const token = user.generateToken();
    res.status(201).json({ user, token });
});

exports.getProfile = catchAsyncError(async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer', '');
    console.log("ttoookkkeeennnn", token.replace('Bearer', ''))
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "No token provided",
        });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("dedooccded", decoded);
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }

    const user = await UserModel.findByPk(decoded.userId, {
        attributes: { exclude: ['password'] },
    });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }

    res.status(200).json({
        success: true,
        user,
    });
});

exports.updateProfile = catchAsyncError(async (req, res, next) => {
    const token = req.header('Authorization');
    console.log("ttoookkkeeennnn", token)
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "No token provided",
        });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }

    console.log("ddeecoded", decoded)
    const { name, email } = req.body;
    const updatedData = { name, email };

    const [updated] = await UserModel.update(updatedData, {
        where: { id: decoded.id },
        returning: true,
        individualHooks: true,
    });

    if (!updated) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }

    const updatedUser = await UserModel.findByPk(decoded.id, {
        attributes: { exclude: ['password'] },
    });

    res.status(200).json({
        success: true,
        user: updatedUser,
    });
});
