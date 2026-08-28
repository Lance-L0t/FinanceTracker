const db = require("../config/database");

async function getCurrentUserBalance(userId) {
  const [result] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
  return result;
}

async function addBalance(userId, amount) {
  const result = await db.query(
    "UPDATE users SET balance = balance + ? WHERE id = ?",
    [amount, userId],
  );
  return result;
}

async function subtractBalance(userId, amount) {
  const result = await db.query(
    "UPDATE users SET balance = balance - ? WHERE id = ?",
    [amount, userId],
  );
  return result;
}

async function getUserTransactions(userId) {
  const [result] = await db.query("SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC", [
    userId,
  ]);
  return result;
}

async function filterByCategory(category, userId) {
  const [result] = await db.query(
    `SELECT * FROM expenses WHERE category = ? AND user_id = ? ORDER BY date DESC`,
    [category ,userId],
  );
  return result;
}

async function addTransaction(userId, description, amount, category) {
  const result = await db.query(
    "INSERT INTO expenses(description, amount, category, user_id) VALUES(?,?,?,?)",
    [description, amount, category, userId],
  );
  return result;
}

async function getTotalIncome(userId) {
  const [[result]] = await db.query(
    "SELECT SUM(amount) AS total FROM expenses WHERE user_id = ? AND category = 'income'",
    [userId],
  );

  return result;
}

async function getTotalExpenses(userId) {
    const [result] = await db.query(
        `SELECT SUM(amount) AS total
         FROM expenses
         WHERE user_id = ?
         AND category != 'income'`,
        [userId]
    );
    return result;
}

async function getMonthlyExpenses(userId) {
    const [result] = await db.query("SELECT SUM(amount) AS monthly_total FROM expenses WHERE user_id = ? AND MONTH(date) = MONTH(CURRENT_DATE) AND YEAR(date) = YEAR(CURRENT_DATE);");
    return result;
}

async function filterByIncome(category, userId) {
  const [result] = await db.query("SELECT * FROM expenses WHERE category = ? AND user_id = ? ORDER BY date DESC", [category, userId]);
  return result;
}

async function filterByExpense(userId) {
  const [result] = await db.query("SELECT * FROM expenses WHERE category != ? AND user_id = ? ORDER BY date DESC", [ 'income', userId]);
  return result;
}

module.exports = {
  filterByCategory,
  getCurrentUserBalance,
  getUserTransactions,
  addBalance,
  subtractBalance,
  addTransaction,
  getTotalIncome,
  getTotalExpenses,
  getMonthlyExpenses,
  filterByCategory,
  filterByExpense,
  filterByIncome,
};
