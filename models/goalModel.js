const db = require('../config/database');

async function listGoals(userId) {
  const [rows] = await db.query('SELECT * FROM goals WHERE user_id = ? AND status <> \'archived\' ORDER BY status = \'completed\', deadline IS NULL, deadline ASC, created_at DESC', [userId]);
  return rows;
}
async function getGoal(userId, id) {
  const [rows] = await db.query('SELECT * FROM goals WHERE id = ? AND user_id = ?', [id, userId]); return rows[0] || null;
}
async function createGoal(userId, data) {
  const [r] = await db.query('INSERT INTO goals (user_id,name,description,target_amount,deadline) VALUES (?,?,?,?,?)', [userId,data.name,data.description||null,data.target_amount,data.deadline||null]);
  return getGoal(userId,r.insertId);
}
async function updateGoal(userId,id,data) {
  const goal=await getGoal(userId,id); if(!goal) throw Object.assign(new Error('Goal not found'),{status:404});
  const status=Number(data.target_amount)<=Number(goal.current_amount)?'completed':goal.status==='completed'?'active':goal.status;
  await db.query('UPDATE goals SET name=?,description=?,target_amount=?,deadline=?,status=? WHERE id=? AND user_id=?',[data.name,data.description||null,data.target_amount,data.deadline||null,status,id,userId]);
  return getGoal(userId,id);
}
async function deleteGoal(userId,id){const [r]=await db.query('DELETE FROM goals WHERE id=? AND user_id=?',[id,userId]);if(!r.affectedRows)throw Object.assign(new Error('Goal not found'),{status:404});}
async function contribute(userId,id,amount,note){
 const c=await db.getConnection();
 try{await c.beginTransaction();
  const [grows]=await c.query('SELECT * FROM goals WHERE id=? AND user_id=? FOR UPDATE',[id,userId]);
  if(!grows.length)throw Object.assign(new Error('Goal not found'),{status:404});
  const goal=grows[0]; if(goal.status==='archived')throw Object.assign(new Error('Archived goals cannot receive money'),{status:400});
  if(Number(goal.current_amount)+Number(amount)>Number(goal.target_amount))throw Object.assign(new Error('Contribution would exceed the goal target'),{status:400});
  const [u]=await c.query('SELECT balance FROM users WHERE id=? FOR UPDATE',[userId]);
  if(Number(u[0].balance)<Number(amount))throw Object.assign(new Error('Insufficient account balance'),{status:400});
  const newAmount=Number(goal.current_amount)+Number(amount);
  await c.query('UPDATE users SET balance=balance-? WHERE id=?',[amount,userId]);
  await c.query('UPDATE goals SET current_amount=?, status=? WHERE id=?',[newAmount,newAmount>=Number(goal.target_amount)?'completed':'active',id]);
  await c.query('INSERT INTO goal_contributions(goal_id,user_id,amount,note) VALUES(?,?,?,?)',[id,userId,amount,note||null]);
  await c.commit(); return getGoal(userId,id);
 }catch(e){await c.rollback();throw e;}finally{c.release();}
}
async function withdraw(userId,id,amount,note){
 const c=await db.getConnection();
 try{await c.beginTransaction();
  const [g]=await c.query('SELECT * FROM goals WHERE id=? AND user_id=? FOR UPDATE',[id,userId]); if(!g.length)throw Object.assign(new Error('Goal not found'),{status:404});
  if(Number(amount)>Number(g[0].current_amount))throw Object.assign(new Error('Withdrawal exceeds the amount saved in this goal'),{status:400});
  const next=Number(g[0].current_amount)-Number(amount);
  await c.query('UPDATE goals SET current_amount=?,status=\'active\' WHERE id=?',[next,id]);
  await c.query('UPDATE users SET balance=balance+? WHERE id=?',[amount,userId]);
  await c.query('INSERT INTO goal_contributions(goal_id,user_id,amount,note) VALUES(?,?,?,?)',[id,userId,-Number(amount),note||'Goal withdrawal']);
  await c.commit();return getGoal(userId,id);
 }catch(e){await c.rollback();throw e;}finally{c.release();}
}
async function contributions(userId,id){const [r]=await db.query('SELECT gc.* FROM goal_contributions gc JOIN goals g ON g.id=gc.goal_id WHERE gc.user_id=? AND gc.goal_id=? ORDER BY gc.created_at DESC',[userId,id]);return r;}
module.exports={listGoals,getGoal,createGoal,updateGoal,deleteGoal,contribute,withdraw,contributions};
