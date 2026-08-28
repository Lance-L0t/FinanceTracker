const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const savingsRoute = require("./routes/savingsRoute");
const authRoute = require("./routes/authRoute");
const expenseRoute = require("./routes/expenseRoute");
const path = require("path");
const { logger, authenticate } = require("./middleware/middleware");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(logger);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/login.html"));
});

app.use("/auth", authRoute);
app.use("/expenses", expenseRoute);
app.use("/savings", savingsRoute);




app.get("/dashboard", authenticate, (req, res) => {
  res.sendFile(path.join(__dirname, "public/dashboard.html"));
});
app.get("/dashboard/transactions", authenticate, (req, res) => {
  res.sendFile(path.join(__dirname, "public/transactions.html"));
});

app.get("/dashboard/budgets", authenticate, (req, res) => {
  res.sendFile(path.join(__dirname, "public/budget.html"));
});

app.get("/dashboard/goals", authenticate, (req, res) => {
  res.sendFile(path.join(__dirname, "public/goals.html"));
});

app.get("/dashboard/savings", authenticate, (req, res) => {
  res.sendFile(path.join(__dirname, "public/savings.html"));
});
app.get("/dashboard/accounts", authenticate, (req, res) => {
  res.sendFile(path.join(__dirname, "public/accounts.html"));
});
app.get("/dashboard/analytics", authenticate, (req, res) => {
  res.sendFile(path.join(__dirname, "public/analytics.html"));
});
app.get("/dashboard/settings", authenticate, (req, res) => {
  res.sendFile(path.join(__dirname, "public/settings.html"));
});
app.get("/dashboard/reports", authenticate, (req, res) => {
  res.sendFile(path.join(__dirname, "public/reports.html"));
});



app.listen(3000, () => {
  console.log("Server is running");
});
