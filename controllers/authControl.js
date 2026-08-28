const { getUserByEmail, addUser } = require("../models/authModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const express = require("express");




async function registerUser(req, res) {
  const { username, email, password } = req.body;

  const encryptedPassword = bcrypt.hash(password, 10);
  const result = await addUser(username, email, encryptedPassword);
  res.status(201).json(result);
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  const result = await getUserByEmail(email);
  if (result.length === 0) {
    res.status(404).json({ error: "Invalid email or -password" });
  }

  const isValid = bcrypt.compare(password, result[0].password);

  if (isValid) {
    const token = jwt.sign(result[0], process.env.JWT_SECRET, {
      expiresIn: "5h",
    });
    console.log("Token: ", token);
    res.cookie("token", token, { httpOnly: true });
    res.redirect('/dashboard');
  } else {
    res.json({ error: "Invalid Email or password" });
  }
}


function logoutUser(req,res){
  res.clearCookie('token', {httpOnly:true});
  return res.status(200).redirect('/');
}
module.exports = { registerUser, loginUser, logoutUser };
