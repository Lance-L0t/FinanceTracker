function cleanString(value,field,max=255){
  if(typeof value!=='string'||!value.trim()){const e=new Error(`${field} is required`);e.status=400;throw e;}
  const v=value.trim();if(v.length>max){const e=new Error(`${field} must be ${max} characters or fewer`);e.status=400;throw e;}return v;
}
function positiveAmount(value,field='Amount'){const n=Number(value);if(!Number.isFinite(n)||n<=0||n>999999999){const e=new Error(`${field} must be a positive number`);e.status=400;throw e;}return Number(n.toFixed(2));}
function optionalDate(value,field='Date'){if(value===undefined||value===null||value==='')return null;const d=new Date(value);if(Number.isNaN(d.getTime())){const e=new Error(`${field} is invalid`);e.status=400;throw e;}return value;}
function integerId(value,field='ID'){const n=Number(value);if(!Number.isInteger(n)||n<1){const e=new Error(`${field} is invalid`);e.status=400;throw e;}return n;}
function booleanValue(value,defaultValue=false){if(value===undefined||value===null||value==='')return defaultValue;if(typeof value==='boolean')return value;if(['true','1','on','yes'].includes(String(value).toLowerCase()))return true;if(['false','0','off','no'].includes(String(value).toLowerCase()))return false;return defaultValue;}
module.exports={cleanString,positiveAmount,optionalDate,id:integerId,booleanValue};
