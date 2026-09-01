const db=require('../config/database');
async function list(userId){const [r]=await db.query('SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT 30',[userId]);return r;}
async function create(userId,type,title,message){const [r]=await db.query('INSERT INTO notifications(user_id,type,title,message) VALUES(?,?,?,?)',[userId,type,title,message]);return r.insertId;}
async function markRead(userId,id){await db.query('UPDATE notifications SET read_at=COALESCE(read_at,CURRENT_TIMESTAMP) WHERE id=? AND user_id=?',[id,userId]);}
async function clear(userId){await db.query('DELETE FROM notifications WHERE user_id=?',[userId]);}
module.exports={list,create,markRead,clear};
