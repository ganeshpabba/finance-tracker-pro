// backend/controllers/authController.js
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('express-async-handler');
const Wallet = require('../models/Wallet');
const Role = require('../models/Role');

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role: roleName } = req.body; // Get role from request body

    if (!name || !email || !password || !roleName) {
        res.status(400);
        throw new Error('Please enter all fields');
    }

     // Find the role by its name.  IMPORTANT: This assumes you've seeded the roles!
    const role = await Role.findOne({ name: roleName });
    if (!role) {
        res.status(400);
        throw new Error('Invalid user role'); // Or handle default role differently
    }


    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
        role: role._id, // Assign the role's ID
    });

    if (user) {
        await Wallet.create({ user: user._id });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: role.name,          // Return the role *name*
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find the user and populate the 'role' field
    const user = await User.findOne({ email }).populate('role');

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role.name, // Send the role *name*
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

module.exports = {
  registerUser,
  loginUser,
};