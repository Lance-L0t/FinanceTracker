const { getSavings, addSavings } = require('../models/savingsModel');

async function getUserSavings(req,res) {
    const [result] = await getSavings(req.user.id);
    res.status(200).json(result);
}

async function addToSavings(req,res) {
    const {type , amount} = req.body;
    const result = await addSavings(req.user.id, type , amount);
    if(result[0].affectedRows > 0){
        res.status(201).json({message:"Successfully Added Savings"});
    }
}

module.exports={getUserSavings, addToSavings};