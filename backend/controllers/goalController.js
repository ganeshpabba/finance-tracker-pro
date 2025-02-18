// backend/controllers/goalController.js
const asyncHandler = require('express-async-handler');
const Goal = require('../models/Goal');
const io = require('../server'); // Import for Socket.IO

const createGoal = asyncHandler(async (req, res) => {
    const { name, targetAmount, deadline } = req.body;
     if(!name || !targetAmount || !deadline) {
        res.status(400)
        throw new Error("Please provide all required fields")
    }
    const goal = await Goal.create({
        user: req.user._id,
        name,
        targetAmount,
        deadline
    });
    res.status(201).json(goal);
    io.to(req.user._id.toString()).emit('goalCreated', goal); //socket event
});

const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user._id }).sort('-createdAt'); // Most recent first
  res.status(200).json(goals);
});

const getGoalById = asyncHandler(async (req, res) => {
     const goal = await Goal.findById(req.params.id);
      if (!goal) {
        res.status(404);
        throw new Error('Goal not found');
    }

    if (goal.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to access this goal');
    }
    res.status(200).json(goal);
});

const updateGoal = asyncHandler(async (req, res) => {
   const goal = await Goal.findById(req.params.id);
    if (!goal) {
        res.status(404);
        throw new Error('Goal not found');
    }

    if (goal.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this goal');
    }

    const { name, targetAmount, currentAmount, deadline, status } = req.body;
     // Basic date validation
    if (new Date(deadline) <= new Date()) {
        res.status(400);
        throw new Error('Deadline must be in the future');
    }
    goal.name = name;
    goal.targetAmount = targetAmount;
    goal.currentAmount = currentAmount;
    goal.deadline = deadline;
    goal.status = status

    const updatedGoal = await goal.save();
    res.status(200).json(updatedGoal);
     io.to(req.user._id.toString()).emit('goalUpdated', updatedGoal); //socket event
});

const deleteGoal = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
        res.status(404);
        throw new Error('Goal not found');
    }
    if (goal.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to delete this goal');
    }

    await goal.deleteOne();
    res.status(200).json({ id: req.params.id, message: 'Goal deleted' });
    io.to(req.user._id.toString()).emit('goalDeleted', req.params.id); //socket event
});

module.exports = {
    createGoal,
    getGoals,
    getGoalById,
    updateGoal,
    deleteGoal
};