require('dotenv').config();

process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason);
});
process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION:', error);
  process.exit(1);
});

const path=require('path');const express=require('express');const cookieParser=require('cookie-parser');const helmet=require('helmet');
const {testConnection}=require('./config/database');const {authenticatePage}=require('./middleware/auth');const errorHandler=require('./middleware/errorHandler');const requestLogger=require('./middleware/requestLogger');const notFound=require('./middleware/notFound');
const app=express();const PORT=process.env.PORT||3000;const PUBLIC=path.join(__dirname,'public');
app.disable('x-powered-by');app.set('trust proxy',1);app.use(requestLogger);app.use(helmet({contentSecurityPolicy:false}));app.use(express.json({limit:'100kb'}));app.use(express.urlencoded({extended:true,limit:'100kb'}));app.use(cookieParser());app.use(express.static(PUBLIC));

app.get('/',(req,res)=>res.redirect('/login'));
const pages={
 '/dashboard':'dashboard.html','/dashboard/transactions':'transactions.html','/dashboard/budgets':'budgets.html','/dashboard/goals':'goals.html','/dashboard/analytics':'analytics.html','/dashboard/accounts':'accounts.html','/dashboard/reports':'reports.html','/dashboard/recurring':'recurring.html','/profile':'profile.html','/settings':'settings.html'
};
for(const [url,file] of Object.entries(pages))app.get(url,authenticatePage,(req,res)=>res.sendFile(path.join(PUBLIC,file)));
app.get('/login',(req,res)=>res.sendFile(path.join(PUBLIC,'login.html')));

app.get('/api/health',async(req,res,next)=>{try{await testConnection();res.json({ok:true,service:'Chapaa Hub API',database:'connected',time:new Date().toISOString()})}catch(e){next(e)}});
app.use('/api/dashboard',require('./routes/dashboardRoutes'));
app.use('/auth',require('./routes/authRoutes'));
app.use('/expenses',require('./routes/expenseRoutes'));
app.use('/goals',require('./routes/goalRoutes'));
app.use('/budgets',require('./routes/budgetRoutes'));
app.use('/profile',require('./routes/profileRoutes'));
app.use('/settings',require('./routes/settingsRoutes'));
app.use('/analytics',require('./routes/analyticsRoutes'));
app.use('/reports',require('./routes/reportRoutes'));
app.use('/notifications',require('./routes/notificationRoutes'));
app.use('/recurring',require('./routes/recurringRoutes'));

app.use(notFound);
app.use(errorHandler);

testConnection().then(()=>app.listen(PORT,()=>console.log(`Chapaa Hub server running on http://localhost:${PORT}`))).catch(err=>{console.error('Database connection failed:',err.message);process.exit(1)});
