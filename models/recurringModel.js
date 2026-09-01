const db=require('../config/database');
async function list(userId){const [r]=await db.query('SELECT * FROM recurring_transactions WHERE user_id=? ORDER BY active DESC,next_run',[userId]);return r;}
async function get(userId,id){const [r]=await db.query('SELECT * FROM recurring_transactions WHERE id=? AND user_id=?',[id,userId]);return r[0]||null;}
async function create(userId,d){const [r]=await db.query('INSERT INTO recurring_transactions(user_id,description,amount,category,transaction_type,frequency,next_run) VALUES(?,?,?,?,?,?,?)',[userId,d.description,d.amount,d.category,d.transaction_type,d.frequency,d.next_run]);return get(userId,r.insertId);}
async function update(userId,id,d){if(!await get(userId,id))throw Object.assign(new Error('Recurring transaction not found'),{status:404});await db.query('UPDATE recurring_transactions SET description=?,amount=?,category=?,transaction_type=?,frequency=?,next_run=?,active=? WHERE id=? AND user_id=?',[d.description,d.amount,d.category,d.transaction_type,d.frequency,d.next_run,d.active===undefined?true:d.active,id,userId]);return get(userId,id);}
async function remove(userId,id){const [r]=await db.query('DELETE FROM recurring_transactions WHERE id=? AND user_id=?',[id,userId]);if(!r.affectedRows)throw Object.assign(new Error('Recurring transaction not found'),{status:404});}
module.exports={list,get,create,update,remove};
