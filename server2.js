const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const ROOT = 'F:\\Abdul-Hadi-Web';
const PUBLIC = path.join(ROOT, 'public');
const mime = {'.html':'text/html','.css':'text/css','.js':'application/javascript','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.pdf':'application/pdf'};

const s = http.createServer((req,res)=>{
  console.log('Request:', req.url);
  let p = url.parse(req.url).pathname;
  if(p==='/'||p==='\\') p='/index.html';
  if(p.includes('..')){res.writeHead(403);return res.end('Forbidden')};
  
  // Try public folder first (for images), then root
  let filePath = path.join(PUBLIC, p);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(ROOT, p);
  }
  
  fs.readFile(filePath,(e,d)=>{
    if(e){res.writeHead(e.code==='ENOENT'?404:500);return res.end(e.code==='ENOENT'?'Not Found':'Server Error')};
    const m = mime[path.extname(filePath).toLowerCase()]||'text/plain';
    res.writeHead(200,{'Content-Type':m});
    res.end(d);
  });
});

s.listen(3000,()=>console.log('Server running on http://localhost:3000'));
s.on('error',e=>console.error('Server error:',e));
process.on('uncaughtException',e=>console.error('Uncaught:',e));
process.on('unhandledRejection',e=>console.error('Unhandled:',e));