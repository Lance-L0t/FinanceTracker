const m=require('../models/settingsModel');const {booleanValue}=require('../utils/validation');
async function get(req,res){res.json(await m.get(req.user.id));}
async function update(req,res){const data={...req.body};for(const k of ['email_notifications','budget_alerts','goal_reminders','monthly_reminders'])if(data[k]!==undefined)data[k]=booleanValue(data[k]);if(data.theme&&!['light','dark'].includes(data.theme))return res.status(400).json({error:'Theme must be light or dark'});res.json(await m.update(req.user.id,data));}
module.exports={get,update};
