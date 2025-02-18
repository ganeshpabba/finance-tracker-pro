// backend/controllers/userController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User')

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    const { _id, name, email, role } = await User.findById(req.user.id).populate('role');

    res.status(200).json({
      id: _id,
      name,
      email,
      role,
    });
});
module.exports = {
    getMe
}