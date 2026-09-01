const db = require('../config/database');

async function getCurrentUserBalance(userId) {
  const [rows] = await db.query('SELECT id, username, email, balance, currency FROM users WHERE id = ?', [userId]);
  return rows;
}

async function getUserTransactions(userId, options = {}) {
  let sql = 'SELECT * FROM expenses WHERE user_id = ?';
  const params = [userId];
  if (options.from) { sql += ' AND date >= ?'; params.push(options.from); }
  if (options.to) { sql += ' AND date < ?'; params.push(options.to); }
  sql += ' ORDER BY date DESC, id DESC';
  if (options.limit) { sql += ' LIMIT ?'; params.push(Number(options.limit)); }
  const [rows] = await db.query(sql, params);
  return rows;
}

async function getTransactionById(userId, id) {
  const [rows] = await db.query('SELECT * FROM expenses WHERE id = ? AND user_id = ?', [id, userId]);
  return rows[0] || null;
}

async function createTransaction(userId, { description, amount, category, date }) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [userRows] = await connection.query('SELECT balance FROM users WHERE id = ? FOR UPDATE', [userId]);
    if (!userRows.length) throw Object.assign(new Error('User not found'), { status: 404 });
    const isIncome = category.toLowerCase() === 'income';
    if (!isIncome && Number(userRows[0].balance) < Number(amount)) {
      throw Object.assign(new Error('Insufficient account balance for this expense'), { status: 400 });
    }
    const [result] = await connection.query(
      'INSERT INTO expenses (user_id, description, amount, category, date) VALUES (?, ?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP))',
      [userId, description, amount, category, date || null]
    );
    const operator = isIncome ? '+' : '-';
    await connection.query(`UPDATE users SET balance = balance ${operator} ? WHERE id = ?`, [amount, userId]);
    await connection.commit();
    return getTransactionById(userId, result.insertId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally { connection.release(); }
}

async function updateTransaction(userId, id, data) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [oldRows] = await connection.query('SELECT * FROM expenses WHERE id = ? AND user_id = ? FOR UPDATE', [id, userId]);
    if (!oldRows.length) throw Object.assign(new Error('Transaction not found'), { status: 404 });
    const old = oldRows[0];
    const [userRows] = await connection.query('SELECT balance FROM users WHERE id = ? FOR UPDATE', [userId]);
    let balance = Number(userRows[0].balance);
    const oldIncome = String(old.category).toLowerCase() === 'income';
    balance += oldIncome ? -Number(old.amount) : Number(old.amount);
    const newIncome = data.category.toLowerCase() === 'income';
    if (!newIncome && balance < Number(data.amount)) {
      throw Object.assign(new Error('Insufficient account balance for the updated expense'), { status: 400 });
    }
    balance += newIncome ? Number(data.amount) : -Number(data.amount);
    await connection.query(
      'UPDATE expenses SET description = ?, amount = ?, category = ?, date = COALESCE(?, date) WHERE id = ? AND user_id = ?',
      [data.description, data.amount, data.category, data.date || null, id, userId]
    );
    await connection.query('UPDATE users SET balance = ? WHERE id = ?', [balance.toFixed(2), userId]);
    await connection.commit();
    return getTransactionById(userId, id);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally { connection.release(); }
}

async function deleteTransaction(userId, id) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [rows] = await connection.query('SELECT * FROM expenses WHERE id = ? AND user_id = ? FOR UPDATE', [id, userId]);
    if (!rows.length) throw Object.assign(new Error('Transaction not found'), { status: 404 });
    const tx = rows[0];
    const [userRows] = await connection.query('SELECT balance FROM users WHERE id = ? FOR UPDATE', [userId]);
    const isIncome = String(tx.category).toLowerCase() === 'income';
    const newBalance = Number(userRows[0].balance) + (isIncome ? -Number(tx.amount) : Number(tx.amount));
    if (newBalance < 0) throw Object.assign(new Error('Cannot delete this transaction because it would make the account balance invalid'), { status: 400 });
    await connection.query('DELETE FROM expenses WHERE id = ? AND user_id = ?', [id, userId]);
    await connection.query('UPDATE users SET balance = ? WHERE id = ?', [newBalance.toFixed(2), userId]);
    await connection.commit();
    return tx;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally { connection.release(); }
}

async function getTotalIncome(userId, from, to) {
  let sql = "SELECT COALESCE(SUM(amount), 0) AS total FROM expenses WHERE user_id = ? AND LOWER(category) = 'income'";
  const params = [userId];
  if (from) { sql += ' AND date >= ?'; params.push(from); }
  if (to) { sql += ' AND date < ?'; params.push(to); }
  const [rows] = await db.query(sql, params); return rows[0];
}

async function getTotalExpenses(userId, from, to) {
  let sql = "SELECT COALESCE(SUM(amount), 0) AS total FROM expenses WHERE user_id = ? AND LOWER(category) <> 'income'";
  const params = [userId];
  if (from) { sql += ' AND date >= ?'; params.push(from); }
  if (to) { sql += ' AND date < ?'; params.push(to); }
  const [rows] = await db.query(sql, params); return rows[0];
}

async function filterByCategory(category, userId) {
  const [rows] = await db.query('SELECT * FROM expenses WHERE LOWER(category) = LOWER(?) AND user_id = ? ORDER BY date DESC, id DESC', [category, userId]); return rows;
}
async function filterByIncome(userId) { const [rows] = await db.query("SELECT * FROM expenses WHERE LOWER(category) = 'income' AND user_id = ? ORDER BY date DESC, id DESC", [userId]); return rows; }
async function filterByExpense(userId) { const [rows] = await db.query("SELECT * FROM expenses WHERE LOWER(category) <> 'income' AND user_id = ? ORDER BY date DESC, id DESC", [userId]); return rows; }

module.exports = { getCurrentUserBalance, getUserTransactions, getTransactionById, createTransaction, updateTransaction, deleteTransaction, getTotalIncome, getTotalExpenses, filterByCategory, filterByIncome, filterByExpense };
