const m=require('../models/analyticsModel');
async function overview(req,res){res.json(await m.overview(req.user.id));}
async function monthly(req,res){res.json(await m.monthly(req.user.id,req.query.months));}
async function categories(req,res){res.json(await m.categories(req.user.id,req.query.from,req.query.to));}
async function insights(req,res){res.json(await m.insights(req.user.id));}
async function health(req,res){res.json(await m.health(req.user.id));}
module.exports={overview,monthly,categories,insights,health};
