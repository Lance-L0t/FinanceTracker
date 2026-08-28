const { addNewGoal, getAllGoals, deleteGoal } = require('../models/goalsModel');

async function addGoal(req,res) {
    // const {name, targetAmount, currentAmount, deadline} = req.body;
    const result = await addNewGoal(req.user.id, req.body.name, req.body.target_amount, req.body.current_amount, req.body.deadline);
    res.json({error:"Successfully Added Goal!"});
}

async function getUserGoals(req,res) {
    const result = await getAllGoals(req.user.id);
    res.json(result);
}


async function removeGoal(req,res) {
    const id = req.params.id;
    const result = await deleteGoal(req.user.id, id);
    res.json(result);
}


module.exports = {addGoal, getUserGoals, removeGoal};