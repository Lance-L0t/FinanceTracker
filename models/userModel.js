const db = require('../config/database');

async function findByEmail(email) {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await db.query('SELECT id, username, email, balance, currency, created_at, updated_at FROM users WHERE id = ?', [id]);
  return rows[0] || null;
}

async function createUser(username, email, password) {
  const [result] = await db.query(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, password]
  );
  await db.query('INSERT INTO user_settings (user_id) VALUES (?)', [result.insertId]);
  return findById(result.insertId);
}

async function updateProfile(userId, username, email) {
  await db.query('UPDATE users SET username = ?, email = ? WHERE id = ?', [username, email, userId]);
  return findById(userId);
}

async function updatePassword(userId, passwordHash) {
  await db.query('UPDATE users SET password = ? WHERE id = ?', [passwordHash, userId]);
}

module.exports = { findByEmail, findById, createUser, updateProfile, updatePassword };
