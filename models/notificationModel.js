const db = require("../config/database");
async function list(userId) {
  const [r] = await db.query(
    "SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT 30",
    [userId],
  );
  return r;
}
async function create(userId, type, title, message) {
  const [r] = await db.query(
    "INSERT INTO notifications(user_id,type,title,message) VALUES(?,?,?,?)",
    [userId, type, title, message],
  );
  return r.insertId;
}
async function createOnce(userId, type, title, message) {
  const [existing] = await db.query(
    "SELECT id FROM notifications WHERE user_id=? AND type=? AND title=? AND message=? AND created_at >= DATE_FORMAT(CURRENT_DATE,'%Y-%m-01') LIMIT 1",
    [userId, type, title, message],
  );
  if (existing.length) return existing[0].id;
  return create(userId, type, title, message);
}
async function markRead(userId, id) {
  await db.query(
    "UPDATE notifications SET read_at=COALESCE(read_at,CURRENT_TIMESTAMP) WHERE id=? AND user_id=?",
    [id, userId],
  );
}
async function clear(userId) {
  await db.query("DELETE FROM notifications WHERE user_id=?", [userId]);
}
module.exports = { list, create, createOnce, markRead, clear };
