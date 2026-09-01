module.exports = (err,req,res,next)=>{
  console.error(`[${req.requestId||'no-id'}]`,err);
  if(res.headersSent) return next(err);
  let status=Number(err.status)||500;
  let message=err.message||'Something went wrong on the server.';
  if(err.code==='ER_DUP_ENTRY'){status=409;message='That record already exists.';}
  if(err.code==='ER_NO_REFERENCED_ROW_2'){status=400;message='The referenced record does not exist.';}
  if(err.code==='ER_BAD_FIELD_ERROR' || err.code==='ER_NO_SUCH_TABLE'){status=500;message='Database schema is out of date. Run sql/schema.sql and restart the server.';}
  res.status(status).json({error:message,requestId:req.requestId});
};
