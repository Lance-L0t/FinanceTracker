const crypto = require('crypto');
module.exports = (req,res,next)=>{
  const requestId = crypto.randomUUID();
  req.requestId = requestId;
  res.setHeader('X-Request-ID', requestId);
  const started = Date.now();
  res.on('finish',()=>console.log(`[${requestId.slice(0,8)}] ${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now()-started}ms`));
  next();
};
