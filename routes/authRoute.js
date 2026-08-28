const express = require("express");
const { checkUserInfo , checkRegInfo} = require("../middleware/middleware");
const { loginUser , registerUser, logoutUser} = require("../controllers/authControl");
const path = require("path");
const router = express.Router();



router.post("/login", checkUserInfo,  loginUser);
router.post("/register", checkRegInfo, registerUser);
router.get('/logout', logoutUser)


module.exports = router