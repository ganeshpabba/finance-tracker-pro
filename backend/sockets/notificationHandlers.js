
const setupSocketHandlers = (io) => { // Receives 'io' as an argument
    io.on('connection', (socket) => {
        console.log('a user connected:', socket.id);

        // Join a room based on user ID
        socket.on('joinRoom', (userId) => {
            socket.join(userId.toString()); //VERY IMPORTANT, userId is an object.
            console.log(`User ${socket.id} joined room ${userId}`);
        });

        socket.on('disconnect', () => {
            console.log('user disconnected:', socket.id);
        });
    });
};
module.exports = setupSocketHandlers;