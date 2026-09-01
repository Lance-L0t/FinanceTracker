const m=require('../models/goalModel');const {cleanString,positiveAmount}=require('../utils/validation');
async function list(req,res){res.json(await m.listGoals(req.user.id));}
async function get(req,res){const g=await m.getGoal(req.user.id,req.params.id);if(!g)return res.status(404).json({error:'Goal not found'});res.json(g);}
function body(req){const name=cleanString(req.body.name,'Goal name',120),target_amount=positiveAmount(req.body.target_amount,'Target amount');let deadline=req.body.deadline||null;if(deadline&&Number.isNaN(new Date(deadline).getTime()))throw Object.assign(new Error('Deadline is invalid'),{status:400});return {name,target_amount,description:req.body.description?String(req.body.description).trim().slice(0,255):null,deadline};}
async function create(req,res){res.status(201).json(await m.createGoal(req.user.id,body(req)));}
async function update(req,res){res.json(await m.updateGoal(req.user.id,req.params.id,body(req)));}
async function remove(req,res){await m.deleteGoal(req.user.id,req.params.id);res.json({message:'Goal deleted'});}
async function contribute(req,res){res.json(await m.contribute(req.user.id,req.params.id,positiveAmount(req.body.amount),req.body.note));}
async function withdraw(req,res){res.json(await m.withdraw(req.user.id,req.params.id,positiveAmount(req.body.amount),req.body.note));}
async function history(req,res){res.json(await m.contributions(req.user.id,req.params.id));}
module.exports={list,get,create,update,remove,contribute,withdraw,history};
