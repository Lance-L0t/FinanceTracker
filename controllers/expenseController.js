const model = require("../models/expenseModel");
const budgetModel = require("../models/budgetModel");
const settingsModel = require("../models/settingsModel");
const notificationModel = require("../models/notificationModel");
const {
  cleanString,
  positiveAmount,
  optionalDate,
} = require("../utils/validation");
async function getUserBalance(req, res) {
  res.json(await model.getCurrentUserBalance(req.user.id));
}
async function getAllTransactions(req, res) {
  const limit = req.query.limit
    ? Math.min(Number(req.query.limit), 200)
    : undefined;
  res.json(await model.getUserTransactions(req.user.id, { limit }));
}
async function getTransaction(req, res) {
  const row = await model.getTransactionById(req.user.id, req.params.id);
  if (!row) return res.status(404).json({ error: "Transaction not found" });
  res.json(row);
}
async function addNewTransaction(req, res) {
  const description = cleanString(req.body.description, "Description"),
    amount = positiveAmount(req.body.amount),
    category = cleanString(req.body.category, "Category", 80).toLowerCase(),
    date = optionalDate(req.body.date, "Date");
  const row = await model.createTransaction(req.user.id, {
    description,
    amount,
    category,
    date,
  });
  await notifyBudgetHits(req.user.id, category);
  res.status(201).json(row);
}
async function updateTransaction(req, res) {
  const description = cleanString(req.body.description, "Description"),
    amount = positiveAmount(req.body.amount),
    category = cleanString(req.body.category, "Category", 80).toLowerCase(),
    date = optionalDate(req.body.date, "Date");
  const row = await model.updateTransaction(req.user.id, req.params.id, {
      description,
      amount,
      category,
      date,
    });
  await notifyBudgetHits(req.user.id, category);
  res.json(row);
}
async function notifyBudgetHits(userId, category) {
  if (category === "income") return;
  const settings = await settingsModel.get(userId);
  if (!settings.budget_alerts) return;
  const budgets = await budgetModel.alerts(userId);
  for (const budget of budgets) {
    if (budget.category.toLowerCase() !== category || budget.usage_percentage < 80) continue;
    const reached = budget.usage_percentage >= 100;
    const title = `${budget.category} budget ${reached ? "limit reached" : "nearly reached"}`;
    await notificationModel.createOnce(userId, "budget", title,
      `${budget.category} spending is ${budget.usage_percentage}% of its monthly limit.`);
  }
}
async function deleteTransaction(req, res) {
  await model.deleteTransaction(req.user.id, req.params.id);
  res.json({ message: "Transaction deleted" });
}
async function topUpBalance(req, res) {
  const description = cleanString(
      req.body.description || "Account top up",
      "Description",
    ),
    amount = positiveAmount(req.body.amount);
  const row = await model.createTransaction(req.user.id, {
    description,
    amount,
    category: "income",
  });
  res.status(201).json({ message: "Money added", transaction: row });
}
async function deductBalance(req, res) {
  const amount = positiveAmount(req.body.amount);
  const row = await model.createTransaction(req.user.id, {
    description: cleanString(
      req.body.description || "Balance deduction",
      "Description",
    ),
    amount,
    category: cleanString(req.body.category || "other", "Category", 80),
  });
  res.status(201).json(row);
}
async function getIncome(req, res) {
  res.json(await model.getTotalIncome(req.user.id));
}
async function getExpenseTotal(req, res) {
  res.json(await model.getTotalExpenses(req.user.id));
}
async function filterTransaction(req, res) {
  const category = decodeURIComponent(req.params.category).toLowerCase();
  if (category === "all categories" || category === "all types")
    return res.json(await model.getUserTransactions(req.user.id));
  if (category === "income")
    return res.json(await model.filterByIncome(req.user.id));
  if (category === "expense")
    return res.json(await model.filterByExpense(req.user.id));
  return res.json(await model.filterByCategory(category, req.user.id));
}
module.exports = {
  getUserBalance,
  getAllTransactions,
  getTransaction,
  addNewTransaction,
  updateTransaction,
  deleteTransaction,
  topUpBalance,
  deductBalance,
  getIncome,
  getExpenseTotal,
  filterTransaction,
};
