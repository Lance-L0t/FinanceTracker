const { getUserSavings, addToSavings } =require('../controllers/savingsControl');
const express = require('express');
const { authenticate, checkSavingsInfo, checkGoalsInfo } = require('../middleware/middleware');
const { getUserGoals, addGoal } = require('../controllers/goalsControl');

const router = express.Router();

router.get('/', authenticate , getUserSavings);
router.post('/', authenticate, checkSavingsInfo, addToSavings);
router.get('/goals', authenticate, getUserGoals);
router.post('/goals', authenticate, checkGoalsInfo, addGoal);

module.exports = router;