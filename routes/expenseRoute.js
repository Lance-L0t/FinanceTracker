const express = require("express");
const router = express.Router();
const {
  authenticate,
  checkTransactionInfo,
} = require("../middleware/middleware");
const {
  filterTransaction,
  getAllTransactions,
  deductBalance,
  getUserBalance,
  addNewTransaction,
  topUpBalance,
  getIncome,
  getExpenseTotal,
} = require("../controllers/expenseControl");

router.get("/", authenticate, getAllTransactions);
router.get("/income", authenticate, getIncome);
router.get("/user", authenticate, getUserBalance);
router.get('/total', authenticate, getExpenseTotal);
router.post("/topup", authenticate, topUpBalance);
router.post(
  "/newExpense",
  authenticate,
  checkTransactionInfo,
  addNewTransaction,
);
router.post("/deduct", authenticate, deductBalance);
router.get('/filter/:category', authenticate, filterTransaction)


module.exports = router;
