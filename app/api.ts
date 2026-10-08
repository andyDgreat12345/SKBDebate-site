export type User={id:string;email:string;name:string;role?:string;bio?:string;admin:boolean};
export type SavedDoc={id:string;kind:string;title:string;data:any;version:number;updated_at:string};
export async function api<T=any>(path:string,method='GET',data?:unknown):Promise<T>{const r=await fetch('/api'+path,{method,headers:method==='GET'?{}:{'Content-Type':'application/json'},body:data===undefined?undefined:JSON.stringify(data)});let result:any;try{result=await r.json()}catch{throw new Error('The service is unavailable. Please try again.')}if(!r.ok)throw new Error(result.error||'Something went wrong.');return result}
export function download(name:string,text:string,type='text/plain'){const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
export function signInPath(){return '/signin-with-chatgpt?return_to='+encodeURIComponent(location.pathname+location.hash)}
