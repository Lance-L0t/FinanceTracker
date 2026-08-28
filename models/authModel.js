const db = require('../config/database');

async function addUser(fullname, email, password){
    const result = await  db.query("INSERT INTO users(username, email, password) VALUES(?,?,?)", [fullname, email, password]);
    return result;
}

async function getUserByEmail(email, password) {
    const [result] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    return result;
}



module.exports = {addUser, getUserByEmail};

