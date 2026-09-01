const db=require('../config/database');
async function get(userId){const [r]=await db.query('SELECT * FROM user_settings WHERE user_id=?',[userId]);if(!r.length){await db.query('INSERT INTO user_settings(user_id) VALUES(?)',[userId]);return get(userId);}return r[0];}
async function update(userId,data){const current=await get(userId);const allowed=['theme','email_notifications','budget_alerts','goal_reminders','monthly_reminders'];const values=allowed.map(k=>data[k]===undefined?current[k]:data[k]);await db.query('UPDATE user_settings SET theme=?,email_notifications=?,budget_alerts=?,goal_reminders=?,monthly_reminders=? WHERE user_id=?',[...values,userId]);return get(userId);}
module.exports={get,update};
