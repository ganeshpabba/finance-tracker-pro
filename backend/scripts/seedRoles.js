// backend/scripts/seedRoles.js
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') }); // Load .env
const mongoose = require('mongoose');
const Role = require('../models/Role');
const connectDB = require('../db')

const seedRoles = async () => {
  try {
    await connectDB();

    const rolesExist = await Role.find();
    if (rolesExist.length > 0) {
      console.log('Roles already seeded.');
      mongoose.connection.close();
      return;
    }
        // Define roles and permissions.  MAKE SURE readBalance IS HERE!
        const roles = [
          { name: 'organization', permissions: ['createTransaction', 'readOwnTransactions', 'updateOwnTransaction', 'deleteOwnTransaction', 'createBudget', 'readOwnBudgets', 'updateOwnBudget', 'deleteOwnBudget', 'createGoal', 'readOwnGoals', 'updateOwnGoal', 'deleteOwnGoal', 'generateReports', 'readBalance'] }, // More specific permissions
          { name: 'personal', permissions: ['createTransaction', 'readOwnTransactions', 'updateOwnTransaction', 'deleteOwnTransaction', 'createBudget', 'readOwnBudgets', 'updateOwnBudget', 'deleteOwnBudget', 'createGoal', 'readOwnGoals', 'updateOwnGoal', 'deleteOwnGoal', 'readBalance'] },
          { name: 'student', permissions: ['createTransaction', 'readOwnTransactions', 'updateOwnTransaction', 'deleteOwnTransaction', 'createBudget', 'readOwnBudgets', 'updateOwnBudget', 'deleteOwnBudget', 'createGoal', 'readOwnGoals', 'updateOwnGoal', 'deleteOwnGoal', 'readBalance'] },
        ];

    await Role.insertMany(roles);
    console.log('Roles seeded successfully.');
  } catch (error) {
    console.error('Error seeding roles:', error);
  } finally {
    mongoose.connection.close(); // Close the connection
  }
};

seedRoles();