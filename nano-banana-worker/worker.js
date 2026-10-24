// Cloudflare Worker example. Set GEMINI_API_KEY in Worker secrets, never in the browser.
// Restrict origins, add bot protection / per-user quotas before public production use.
const ORIGIN = 'https://mmwwoo-lab.github.io';
const MODEL = 'gemini-2.5-flash-image';
function cors(){return {'Access-Control-Allow-Origin':ORIGIN,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Vary':'Origin'};}
export default {
  async fetch(request,env){
    const origin=request.headers.get('Origin')||'';
    if(origin!==ORIGIN)return new Response('Forbidden',{status:403});
    if(request.method==='OPTIONS')return new Response(null,{status:204,headers:cors()});
    if(request.method!=='POST')return new Response('Method Not Allowed',{status:405,headers:cors()});
    if(!env.GEMINI_API_KEY)return Response.json({error:'서버 비밀키 설정 필요'},{status:503,headers:cors()});
    let body;
    try{body=await request.json();}catch{return Response.json({error:'Invalid JSON'},{status:400,headers:cors()});}
    const prompt=String(body.prompt||'').slice(0,3000);
    if(prompt.length<12)return Response.json({error:'Prompt required'},{status:400,headers:cors()});
    try{
      const upstream=await fetch('https://generativelanguage.googleapis.com/v1beta/models/'+MODEL+':generateContent',{
        method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':env.GEMINI_API_KEY},
        body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{responseModalities:['TEXT','IMAGE'],imageConfig:{aspectRatio:'4:3'}}})
      });
      const data=await upstream.json();
      if(!upstream.ok)return Response.json({error:data.error?.message||'Gemini API failed'},{status:502,headers:cors()});
      const image=data.candidates?.flatMap(c=>c.content?.parts||[]).find(p=>p.inlineData?.data)?.inlineData;
      if(!image)return Response.json({error:'이미지가 생성되지 않았습니다.'},{status:502,headers:cors()});
      if(!['image/png','image/jpeg','image/webp'].includes(image.mimeType))return Response.json({error:'Unsupported image MIME'},{status:502,headers:cors()});
      return Response.json({image:'data:'+image.mimeType+';base64,'+image.data},{headers:cors()});
    }catch(err){return Response.json({error:'이미지 서비스 연결 실패'},{status:502,headers:cors()});}
  }
};
