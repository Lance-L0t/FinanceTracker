const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send("You are not authenticated");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).send("Invalid or expired token");
  }
}

function checkUserInfo(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password || email.trim() === "" || password.trim() === "") {
    return res.status(404).json({ error: "No data is sent" });
  }

  req.body.email = email.trim();
  req.body.password = password.trim();
  return next();
}

function checkRegInfo(req, res, next) {
  const { username, email, password } = req.body;


  if (
    !username ||
    !email ||
    !password ||
    email.trim() === "" ||
    password.trim() === "" ||
    username.trim() === ""
  ) {
    return res.status(404).json({ error: "No data is sent" });
  }

  req.body.email = email.trim();
  req.body.password = password.trim();
  return next();
}

function logger(req, res, next) {
  console.log(req.method, req.url);
  next();
}

function checkTransactionInfo(req, res, next) {
  const { description, amount, category } = req.body;
  if (
    !description ||
    !amount ||
    !category ||
    description.trim() === "" ||
    Number.isNaN(amount) ||
    category.trim() === ""
  ) {
    return res.json({ error: "Invalid Transaction details" });
  }
  req.body.description = description.trim();
  req.body.amount = Number(amount);
  req.body.category = category.trim();
  next();
}

function checkSavingsInfo(req, res, next) {
  const { type, amount } = req.body;
  if (!type || !amount || type.trim() === "" || Number.isNaN(amount)) {
    res.json({ error: "Invalid savings details" });
  }
  req.body.type = type.trim();
  req.body.amount = Number(amount);
  next();
}


function checkGoalsInfo(req, res, next) {
  const { name, target_amount, current_amount, deadline} = req.body;
  
  if (!name || !target_amount || !current_amount || !deadline || name.trim() === "" || Number.isNaN(target_amount) || Number.isNaN(current_amount)) {
    res.json({ error: "Invalid savings-goal details" });
  }
  req.body.name = name.trim();
  req.body.target_amount = Number(target_amount);
  req.body.current_amount = Number(current_amount);
  next();
}

module.exports = {
  logger,
  authenticate,
  checkUserInfo,
  checkRegInfo,
  checkTransactionInfo,
  checkSavingsInfo,
  checkGoalsInfo
};
