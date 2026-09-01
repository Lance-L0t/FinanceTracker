const router=require('express').Router();const c=require('../controllers/authController');const {authLimiter}=require('../middleware/rateLimit');
router.post('/register',authLimiter,c.register);router.post('/login',authLimiter,c.login);router.get('/logout',c.logout);module.exports=router;
