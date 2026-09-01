const db=require('../config/database');

async function monthly(userId,months=6){
 const n=Math.min(Math.max(Number(months)||6,1),12);
 const [r]=await db.query(`SELECT DATE_FORMAT(date,'%Y-%m') month,
 COALESCE(SUM(CASE WHEN LOWER(category)='income' THEN amount ELSE 0 END),0) income,
 COALESCE(SUM(CASE WHEN LOWER(category)<>'income' THEN amount ELSE 0 END),0) expenses
 FROM expenses WHERE user_id=? AND date>=DATE_FORMAT(DATE_SUB(CURRENT_DATE,INTERVAL ${n-1} MONTH),'%Y-%m-01') GROUP BY month ORDER BY month`,[userId]);
 return r.map(x=>({...x,income:Number(x.income),expenses:Number(x.expenses),net:Number(x.income)-Number(x.expenses)}));
}
async function categories(userId,from,to){let sql="SELECT category, SUM(amount) total, COUNT(*) count FROM expenses WHERE user_id=? AND LOWER(category)<>'income'";const p=[userId];if(from){sql+=' AND date>=?';p.push(from)}if(to){sql+=' AND date<?';p.push(to)}sql+=' GROUP BY category ORDER BY total DESC';const [r]=await db.query(sql,p);return r;}
async function overview(userId){
 const [m]=await db.query(`SELECT COALESCE(SUM(CASE WHEN LOWER(category)='income' THEN amount ELSE 0 END),0) income,COALESCE(SUM(CASE WHEN LOWER(category)<>'income' THEN amount ELSE 0 END),0) expenses,COUNT(*) transactions FROM expenses WHERE user_id=? AND date>=DATE_FORMAT(CURRENT_DATE,'%Y-%m-01')`,[userId]);
 const [top]=await db.query("SELECT category,SUM(amount) total FROM expenses WHERE user_id=? AND LOWER(category)<>'income' AND date>=DATE_FORMAT(CURRENT_DATE,'%Y-%m-01') GROUP BY category ORDER BY total DESC LIMIT 1",[userId]);
 const income=Number(m[0].income),expenses=Number(m[0].expenses);
 const [goals]=await db.query("SELECT COALESCE(SUM(current_amount),0) saved,COALESCE(SUM(target_amount),0) target,COUNT(*) active FROM goals WHERE user_id=? AND status='active'",[userId]);
 const saved=Number(goals[0].saved),target=Number(goals[0].target);
 return {income,expenses,net:income-expenses,savingRate:income?Math.max(0,(income-expenses)/income*100):0,transactions:Number(m[0].transactions),topCategory:top[0]?.category||null,topCategoryAmount:Number(top[0]?.total||0),goals:{active:Number(goals[0].active),saved,target,progress:target?saved/target*100:0}};
}
async function insights(userId){
 const [rows]=await db.query("SELECT category,SUM(amount) total FROM expenses WHERE user_id=? AND LOWER(category)<>'income' AND date>=DATE_FORMAT(CURRENT_DATE,'%Y-%m-01') GROUP BY category ORDER BY total DESC",[userId]);
 const [prev]=await db.query("SELECT COALESCE(SUM(amount),0) total FROM expenses WHERE user_id=? AND LOWER(category)<>'income' AND date>=DATE_FORMAT(DATE_SUB(CURRENT_DATE,INTERVAL 1 MONTH),'%Y-%m-01') AND date<DATE_FORMAT(CURRENT_DATE,'%Y-%m-01')",[userId]);
 const [curr]=await db.query("SELECT COALESCE(SUM(amount),0) total FROM expenses WHERE user_id=? AND LOWER(category)<>'income' AND date>=DATE_FORMAT(CURRENT_DATE,'%Y-%m-01')",[userId]);
 const previous=Number(prev[0].total),current=Number(curr[0].total);const change=previous?((current-previous)/previous)*100:0;
 const list=[]; if(rows[0]) list.push({type:'top_category',title:`${rows[0].category} is your biggest expense`,message:`You have spent KSh ${Number(rows[0].total).toLocaleString('en-KE',{minimumFractionDigits:2})} on ${rows[0].category} this month.`});
 list.push({type:'month_comparison',title:change>0?'Spending is up this month':'Nice work — spending is under control',message:previous?`Your spending is ${Math.abs(change).toFixed(1)}% ${change>0?'higher':'lower'} than last month.`:'Not enough previous-month data for a comparison.'});
 return list;
}
async function health(userId){
 const o=await overview(userId);
 const budgetRows=await db.query("SELECT category,limit_amount FROM budgets WHERE user_id=? AND month_start=DATE_FORMAT(CURRENT_DATE,'%Y-%m-01')",[userId]);
 const budgets=budgetRows[0];
 const [spentRows]=await db.query("SELECT category,SUM(amount) spent FROM expenses WHERE user_id=? AND LOWER(category)<>'income' AND date>=DATE_FORMAT(CURRENT_DATE,'%Y-%m-01') GROUP BY category",[userId]);
 const spent={};spentRows.forEach(x=>spent[String(x.category).toLowerCase()]=Number(x.spent));
 let score=50;
 if(o.savingRate>=20)score+=25;else if(o.savingRate>=10)score+=15;else if(o.savingRate>0)score+=7;else score-=10;
 const budgetCount=budgets.length;const onBudget=budgets.filter(b=>(spent[String(b.category).toLowerCase()]||0)<=Number(b.limit_amount)).length;
 if(budgetCount)score+=Math.round((onBudget/budgetCount)*15);
 const goalProgress=o.goals.progress; if(goalProgress>=50)score+=10;else if(goalProgress>=20)score+=5;
 score=Math.max(0,Math.min(100,score));
 let label=score>=80?'Excellent':score>=65?'Healthy':score>=45?'Getting there':'Needs attention';
 return {score,label,factors:{savingRate:Number(o.savingRate.toFixed(1)),budgetsOnTrack:onBudget,budgetCount,goalProgress:Number(goalProgress.toFixed(1))}};
}
module.exports={monthly,categories,overview,insights,health};
