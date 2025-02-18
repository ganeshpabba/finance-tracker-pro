// backend/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  // Use the existing status code if it's been set, otherwise default to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode);

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack, // Only include stack in development
  });
};

module.exports = {
  errorHandler,
};