const {
  filterByCategory,
  getCurrentUserBalance,
  getUserTransactions,
  addBalance,
  subtractBalance,
  addTransaction,
  getTotalIncome,
  getTotalExpenses,
  filterByIncome,
  filterByExpense,
} = require("../models/expenseModel");

async function getUserBalance(req, res) {
  try {
    const result = await getCurrentUserBalance(req.user.id);
    if (result.length === 0) {
      return res.status(404).json({ error: "Invalid User" });
    }
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
}

async function topUpBalance(req, res) {
  const result = await addBalance(req.user.id, req.body.amount);
  req.body.category = "income";
  if (result.affectedRows === 0) {
    return res.json({ error: "Something went wrong" });
  }
  const [message] = await addTransaction(
    req.user.id,
    req.body.description,
    req.body.amount,
    req.body.category,
  );
  return res.status(200).json(result, message);
}

async function deductBalance(req, res) {
  const result = await subtractBalance(req.user.id, req.body.amount);
  return res.status(200).json(result);
}

async function getAllTransactions(req, res) {
  const result = await getUserTransactions(req.user.id);
  return res.status(200).json(result);
}

async function filterTransaction(req, res) {
  const category = req.params.category.toLowerCase();
  if (category === "all categories") {
    const result = await getUserTransactions(req.user.id);
    return res.status(200).json(result);
  }
  if (category === "expense") {
    const result = await filterByExpense(req.user.id);
    return res.status(200).json(result);
  }
  if (category === "all types") {
    const result = await getUserTransactions(req.user.id);
    return res.status(200).json(result);
  }
  if (category === "income") {
    const result = await filterByIncome(category, req.user.id);
    res.json(result);
  } else {
    const result = await filterByCategory(category, req.user.id);
    return res.status(200).json(result);
  }
}

async function addNewTransaction(req, res) {

  const [result] = await addTransaction(
    req.user.id,
    req.body.description,
    req.body.amount,
    req.body.category,
  );

  if (result.affectedRows === 0) {
    return res.json({ error: "Something went wrong" });
  }
  const newResult = await subtractBalance(req.user.id, req.body.amount);
  return res.status(200).json(result, newResult);
}

async function getIncome(req, res) {
  const result = await getTotalIncome(req.user.id);
  return res.json(result);
}

async function getExpenseTotal(req, res) {
  const [result] = await getTotalExpenses(req.user.id);
  return res.json(result);
}


module.exports = {
  filterTransaction,
  getAllTransactions,
  deductBalance,
  topUpBalance,
  getUserBalance,
  addNewTransaction,
  getIncome,
  getExpenseTotal,
};
