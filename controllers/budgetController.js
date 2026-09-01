const m = require('../models/budgetModel');
const { cleanString, positiveAmount, id } = require('../utils/validation');

function body(req) {
  return {
    category: cleanString(req.body.category, 'Category', 80).toLowerCase(),
    limit_amount: positiveAmount(req.body.limit_amount ?? req.body.amount, 'Budget limit'),
    month: req.body.month || undefined,
  };
}

async function list(req, res) { res.json(await m.listBudgets(req.user.id, req.query.month)); }
async function alerts(req, res) { res.json(await m.alerts(req.user.id, req.query.month)); }
async function overview(req, res) { res.json(await m.overview(req.user.id, req.query.month)); }
async function get(req, res) { const b=await m.getBudget(req.user.id,id(req.params.id)); if(!b)return res.status(404).json({error:'Budget not found'}); res.json(b); }
async function create(req, res) { res.status(201).json(await m.createBudget(req.user.id, body(req))); }
async function update(req, res) { res.json(await m.updateBudget(req.user.id,id(req.params.id),body(req))); }
async function remove(req, res) { await m.deleteBudget(req.user.id,id(req.params.id)); res.json({message:'Budget deleted'}); }
module.exports={list,alerts,overview,get,create,update,remove};
