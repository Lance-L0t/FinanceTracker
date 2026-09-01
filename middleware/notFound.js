module.exports = (req,res)=>{
  if(req.path.startsWith('/api') || req.path.startsWith('/expenses') || req.path.startsWith('/goals') || req.path.startsWith('/budgets') || req.path.startsWith('/analytics') || req.path.startsWith('/reports') || req.path.startsWith('/recurring') || req.path.startsWith('/notifications') || req.path.startsWith('/settings')) return res.status(404).json({error:'Route not found',requestId:req.requestId});
  res.status(404).sendFile(require('path').join(__dirname,'../public/404.html'));
};
