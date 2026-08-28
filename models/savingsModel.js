const db = require('../config/database');

//ADD savings amount
// get savings amount
// 

async function getSavings(userId) {
    const [result] = await db.query("SELECT SUM(amount) AS total_savings FROM savings WHERE user_id = ?", [userId]);
    return result;
}

async function addSavings(userId, type, amount){
    const result = await db.query("INSERT INTO savings(user_id, type, amount) VALUES(?,?,?)", [userId, type, amount]);
    return result;
}



module.exports ={getSavings, addSavings};