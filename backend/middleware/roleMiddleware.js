// backend/middleware/roleMiddleware.js
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose'); // Import mongoose

const hasPermission = (permission) => asyncHandler(async (req, res, next) => {
  console.log("Checking permission:", permission); // DEBUG
  console.log("Request user:", req.user); // DEBUG: Log the entire user object

  if (!req.user || !req.user.role) {
    res.status(403);
    throw new Error('Forbidden: No role assigned');
  }

  const role = req.user.role; // Access the role directly (it's populated)
  console.log("User role:", role); // DEBUG

  if (!role) {
    res.status(403);
    throw new Error("Forbidden: Role not found");
  }

  console.log("Role permissions:", role.permissions); // DEBUG

  if (role.permissions.includes(permission)) {
    console.log("Permission granted!"); // DEBUG
    next();
  } else {
    console.log("Permission denied!"); // DEBUG
    res.status(403);
    throw new Error('Forbidden: Insufficient permissions');
  }
});

module.exports = { hasPermission };