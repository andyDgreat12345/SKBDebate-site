import {build,preview} from 'vite';
import react from '@vitejs/plugin-react';
import {tutorRoute} from '../server/tutor';

const codespace=process.env.CODESPACE_NAME;
const domain=process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN||'app.github.dev';
const cloudHost=codespace?`${codespace}-5173.${domain}`:undefined;
const origins=new Set(['http://localhost:5173','http://127.0.0.1:5173',...(cloudHost?[`https://${cloudHost}`]:[])]);
// Only whitelisted server values are passed to the adapter. Never write the secret to disk.
const env={LOCAL_DEV:'true',DEEPSEEK_API_KEY:process.env.DEEPSEEK_API_KEY,DEEPSEEK_MODEL:process.env.DEEPSEEK_MODEL||'deepseek-flash'};
console.log('Building the browser preview…');
await build({configFile:false,plugins:[react()],build:{outDir:'.lab-dist',target:'safari15',rollupOptions:{input:'lab.html'},copyPublicDir:false}});
const server=await preview({configFile:false,build:{outDir:'.lab-dist'},plugins:[{name:'local-teaching-api',configurePreviewServer(vite){
  vite.middlewares.use(async(req,res,next)=>{
    const path=(req.url||'/').split('?')[0];
    if(path==='/'||path==='/index.html'){
      res.statusCode=302;res.setHeader('Location','/lab.html');res.setHeader('Cache-Control','no-store');res.end();return;
    }
    if(!path.startsWith('/api/'))return next();
    const send=(status:number,error:string)=>{res.statusCode=status;res.setHeader('Content-Type','application/json');res.end(JSON.stringify({error}));};
    if(path!=='/api/tutor')return send(404,'Only the teaching tutor API is available in this workspace.');
    if(req.headers['sec-fetch-site']==='cross-site'||(req.headers.origin&&!origins.has(req.headers.origin)))return send(403,'Cross-origin requests are not allowed.');
    if(req.method!=='GET'&&req.method!=='POST')return send(405,'Method not allowed.');
    if(req.method==='POST'&&!req.headers['content-type']?.startsWith('application/json'))return send(415,'Use a JSON request.');
    const cancel=new AbortController();res.on('close',()=>{if(!res.writableEnded)cancel.abort();});
    try{
      const chunks:Buffer[]=[];let size=0;
      for await(const chunk of req){size+=Buffer.byteLength(chunk);if(size>30000)return send(413,'Question context is too large.');chunks.push(Buffer.from(chunk));}
      const response=await tutorRoute(new Request('http://localhost:5173/api/tutor',{method:req.method,signal:cancel.signal,headers:{'Content-Type':'application/json'},...(req.method==='POST'?{body:Buffer.concat(chunks).toString('utf8')}:{})}),env);
      res.statusCode=response.status;response.headers.forEach((value,key)=>res.setHeader(key,value));res.end(await response.text());
    }catch{if(!res.destroyed)send(503,'Tutor unavailable. Please try again.');}
  });
}}],preview:{host:'0.0.0.0',port:5173,strictPort:true,allowedHosts:cloudHost?[cloudHost]:[]}});
console.log(`Teaching Lab: ${cloudHost?`https://${cloudHost}`:'http://127.0.0.1:5173'}/lab.html`);
console.log(env.DEEPSEEK_API_KEY?'DeepSeek key is present. Submit one question to test it.':'DeepSeek key is missing. Add the Codespaces secret and restart the Codespace.');
console.log('Keep the forwarded port Private. This is a development experiment, not a public hosting server.');
