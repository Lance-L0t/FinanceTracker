const db = require('../config/database');

// Add new goal
// Get all goals
// Delete Goal

// Update goal - To be added later

async function getAllGoals(userId) {
    const [result] = await db.query("SELECT * FROM savings_goals WHERE user_id = ?", [userId]);
    return result;
}

async function addNewGoal(userId, name, targetAmount, currentAmount, deadline) {
    const result = await db.query("INSERT INTO savings_goals(user_id, name, target_amount, current_amount, deadline) VALUES(?,?,?,?,?)", [userId, name, currentAmount, targetAmount, deadline]);
    return result;
}

async function deleteGoal(userId, goalId) {
    const result = await db.query("DELETE * FROM savings_goals WHERE user_id = ? AND id = ?", [userId, goalId]);
    return result;
}

module.exports = {getAllGoals, addNewGoal, deleteGoal};