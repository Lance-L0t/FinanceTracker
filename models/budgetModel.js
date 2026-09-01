const db = require('../config/database');

function monthStart(value) {
  if (value && /^\d{4}-\d{2}$/.test(value)) return `${value}-01`;
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

async function listBudgets(userId, month) {
  const m = monthStart(month);
  const [rows] = await db.query(
    'SELECT * FROM budgets WHERE user_id=? AND month_start=? ORDER BY category',
    [userId, m]
  );
  return rows;
}

async function getBudget(userId, id) {
  const [rows] = await db.query('SELECT * FROM budgets WHERE id=? AND user_id=?', [id, userId]);
  return rows[0] || null;
}

async function createBudget(userId, data) {
  const m = monthStart(data.month);
  const [result] = await db.query(
    'INSERT INTO budgets(user_id,category,limit_amount,month_start) VALUES(?,?,?,?)',
    [userId, data.category, data.limit_amount, m]
  );
  return getBudget(userId, result.insertId);
}

async function updateBudget(userId, id, data) {
  const old = await getBudget(userId, id);
  if (!old) throw Object.assign(new Error('Budget not found'), { status: 404 });
  const oldMonth = String(old.month_start).slice(0, 7);
  await db.query(
    'UPDATE budgets SET category=?,limit_amount=?,month_start=? WHERE id=? AND user_id=?',
    [data.category, data.limit_amount, monthStart(data.month || oldMonth), id, userId]
  );
  return getBudget(userId, id);
}

async function deleteBudget(userId, id) {
  const [result] = await db.query('DELETE FROM budgets WHERE id=? AND user_id=?', [id, userId]);
  if (!result.affectedRows) throw Object.assign(new Error('Budget not found'), { status: 404 });
}

async function alerts(userId, month) {
  const m = monthStart(month);
  const [rows] = await db.query(
    `SELECT
      b.id,
      b.category,
      b.limit_amount,
      COALESCE(SUM(CASE WHEN LOWER(e.category) <> 'income' THEN e.amount ELSE 0 END), 0) AS spent
     FROM budgets b
     LEFT JOIN expenses e
       ON e.user_id = b.user_id
       AND LOWER(e.category) = LOWER(b.category)
       AND e.date >= b.month_start
       AND e.date < DATE_ADD(b.month_start, INTERVAL 1 MONTH)
     WHERE b.user_id=? AND b.month_start=?
     GROUP BY b.id,b.category,b.limit_amount
     ORDER BY (
       COALESCE(SUM(CASE WHEN LOWER(e.category) <> 'income' THEN e.amount ELSE 0 END),0)
       / NULLIF(b.limit_amount,0)
     ) DESC`,
    [userId, m]
  );

  return rows.map((row) => {
    const limit = Number(row.limit_amount || 0);
    const spent = Number(row.spent || 0);
    const percentage = limit ? (spent / limit) * 100 : 0;
    return {
      ...row,
      limit_amount: limit,
      spent,
      usage_percentage: Number(percentage.toFixed(1)),
      level: percentage >= 100 ? 'over' : percentage >= 80 ? 'warning' : 'ok',
    };
  });
}

async function overview(userId, month) {
  const m = monthStart(month);
  const [rows] = await db.query(
    'SELECT COALESCE(SUM(limit_amount),0) AS total_budget FROM budgets WHERE user_id=? AND month_start=?',
    [userId, m]
  );
  return { total_budget: Number(rows[0]?.total_budget || 0) };
}

module.exports = {
  listBudgets,
  getBudget,
  createBudget,
  updateBudget,
  deleteBudget,
  alerts,
  overview,
  monthStart,
};
