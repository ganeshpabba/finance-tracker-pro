
// --- Middleware ---
const http = require('http');
const { Server } = require("socket.io");
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes'); // Import authRoutesp
const transactionRoutes = require('./routes/transactionRoutes');
const walletRoutes = require('./routes/walletRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const goalRoutes = require('./routes/goalRoutes');
const reportRoutes = require('./routes/reportRoutes');

const { errorHandler } = require('./middleware/errorHandler');
const connectDB = require('./db');
const setupSocketHandlers = require('./sockets/notificationHandlers'); // Import

const app = express();
const server = http.createServer(app); // Create an http server
const io = new Server(server, {   // Pass server to socket.io
    cors: {
        origin: process.env.FRONTEND_URL,  //VERY IMPORTANT, allow connections
        methods: ["GET", "POST"]
    }
});
app.use(helmet()); // Set security headers
app.use(cors());  // Enable CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Log HTTP requests

// --- Database Connection ---
connectDB();

// --- Routes ---
app.use('/api/users', authRoutes); // Corrected route usage
app.use('/api/users', userRoutes); // Keep userRoutes for /me
app.use('/api/transactions', transactionRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/reports', reportRoutes);

// --- Error Handling Middleware (MUST be last) ---
app.use(errorHandler);

// --- Socket.IO Setup (Call the setup function) ---
setupSocketHandlers(io); // Pass the 'io' object

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
module.exports = io;