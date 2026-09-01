const {getDashboard}=require('../models/dashboardModel');
async function data(req,res){res.json(await getDashboard(req.user.id));}
module.exports={data};
