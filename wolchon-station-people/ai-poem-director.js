/* 명도재 AI 시화 감독 시스템 · 시 원문 분석 / 구도 설계 / 관리자 승인
   API key stays on Vercel server. The editor token is not saved in browser storage.
   The separate local Python SVG illustrator remains unchanged.
*/
(function(){
"use strict";
function setup(){
 const art=document.getElementById("poem-mosaic-art");
 const verse=document.getElementById("verse");
 const name=document.getElementById("title");
 const caption=document.getElementById("poem-mosaic-label");
 if(!art||!verse||!name||!caption)return;
 const wrap=document.createElement("section");
 wrap.setAttribute("aria-label","AI 시화 제작 도구");
 wrap.style.cssText="margin:18px auto 20px;padding:18px;max-width:1080px;border:1px solid #d7cdbb;border-radius:14px;background:#fffdf8;color:#23312e;box-shadow:0 4px 24px #17271c0b";
 const title=document.createElement("h3"); title.textContent="🎨 AI 시화 제작";
 title.style.cssText="margin:0 0 8px;font-size:1.12rem";
 const controls=document.createElement("div");controls.style.cssText="display:flex;flex-wrap:wrap;gap:8px;align-items:center";
 const styles=[["pop","팝아트"],["watercolor","수채화"],["emotion","감성화"],["portrait","초상화"]];
 const select=document.createElement("select");select.setAttribute("aria-label","AI 시화 화풍");
 select.style.cssText="padding:11px;min-width:108px;max-width:100%;border:1px solid #aab8ad;border-radius:9px;background:#fff;color:#223";
 styles.forEach(([value,label])=>{let o=document.createElement("option");o.value=value;o.textContent=label;select.append(o)});
 const planBtn=document.createElement("button");planBtn.type="button";planBtn.textContent="① 시 분석·구도 설계";
 const generateBtn=document.createElement("button");generateBtn.type="button";generateBtn.textContent="② AI 그림 생성 (유료)";
 const nextBtn=document.createElement("button");nextBtn.type="button";nextBtn.textContent="구도 다시 설계";
 const approveBtn=document.createElement("button");approveBtn.type="button";approveBtn.textContent="③ 후보 승인";approveBtn.disabled=true;
 const downloadBtn=document.createElement("button");downloadBtn.type="button";downloadBtn.textContent="④ 승인 그림 저장";downloadBtn.disabled=true;
 for(const btn of [planBtn,generateBtn,nextBtn,approveBtn,downloadBtn]){
  btn.style.cssText="padding:11px 13px;border-radius:9px;border:1px solid #adb6ad;background:#edf2e9;color:#23362e;font-weight:600;cursor:pointer";
 }
 generateBtn.style.background="#203f35";generateBtn.style.color="white";
 const tokenInput=document.createElement("input");tokenInput.type="password";tokenInput.autocomplete="off";
 tokenInput.placeholder="관리자 토큰 (서버 인증용)";tokenInput.setAttribute("aria-label","관리자 인증 토큰");
 tokenInput.style.cssText="width:220px;max-width:100%;padding:11px;border:1px solid #abb8ae;border-radius:9px";
 controls.append(select,planBtn,nextBtn,tokenInput,generateBtn,approveBtn,downloadBtn);
 const state=document.createElement("p");state.setAttribute("role","status");state.style.cssText="font-size:14px;line-height:1.6;min-height:20px;color:#3b594d";
 state.textContent="";
 const planning=document.createElement("div");planning.style.cssText="display:grid;gap:7px;font-size:14px;line-height:1.75";
 const preview=document.createElement("div");preview.style.cssText="margin-top:10px";
 wrap.append(title,controls,state,planning,preview);
 // Place after entire figure, not inside the poem art image container.
 const figure=art.closest("figure");
 (figure||caption).after(wrap);
 let variant=0,planned=null,approved=false,currentUrl=null,activeController=null,requestSeq=0,renderedFor="";
 const currentPoem=()=>{
  const raw=name.textContent||"";
  const t=raw.includes(" · ")?raw.split(" · ").slice(1).join(" · ").trim():raw.trim();
  return {title:t,poem:verse.textContent||""};
 };
 const update=()=>{approveBtn.disabled=!currentUrl||approved;downloadBtn.disabled=!currentUrl||!approved};
 function clearCandidate(){
  if(activeController)activeController.abort();
  activeController=null;requestSeq++;
  if(currentUrl){URL.revokeObjectURL(currentUrl);currentUrl=null}
  preview.replaceChildren();approved=false;renderedFor="";update();
 }
 function invalidate(){
  variant=0;planned=null;planning.replaceChildren();clearCandidate();
  state.textContent="";
 }
 const poemTabs=document.getElementById("tabs");
 poemTabs?.addEventListener("click",invalidate);
 for(const id of ["prev","next"])document.getElementById(id)?.addEventListener("click",invalidate);
 select.addEventListener("change",invalidate);
 async function call(action){
  const p=currentPoem();if(!p.title||!p.poem)throw new Error("선택한 시 원문이 없습니다.");
  const controller=new AbortController();activeController=controller;
  const seq=++requestSeq;
  const headers={"Content-Type":"application/json"};
  if(action==="generate")headers["X-MDO-ART-ADMIN-TOKEN"]=tokenInput.value.trim();
  const response=await fetch("./api/poem-director",{method:"POST",headers,cache:"no-store",signal:controller.signal,
   body:JSON.stringify({...p,style:select.value,action,variant})});
  let body;
  try{body=await response.json()}catch(e){throw new Error("서버가 JSON 결과를 반환하지 않았습니다.");}
  if(!response.ok)throw new Error(body.error||"서버 응답 "+response.status);
  if(seq!==requestSeq)throw new DOMException("무효한 요청","AbortError");
  return {body,key:p.title+"|"+select.value+"|"+variant};
 }
 function showPlan(p){
  planning.replaceChildren();
  const lines=[
   "중심 정서: "+p.mood,
   "전경: "+(p.foreground.join(" · ")||"시의 주요 이미지"),
   "중경: "+(p.midground.join(" · ")||"시의 흐름"),
   "원경: "+(p.background.join(" · ")||"공간과 빛"),
   "전체 시화 소재: "+(p.motifs.join(", ")||"원문 이미지"),
   "구도 유형: "+((p.variant%8)+1)+"/8 · "+p.style_name
  ];
  for(const txt of lines){let el=document.createElement("p");el.style.margin="1px 0";el.textContent=txt;planning.append(el);}
 }
 planBtn.addEventListener("click",async()=>{
  clearCandidate();state.textContent="시의 내용과 미술 구도를 분석하고 있습니다.";planBtn.disabled=true;
  try{const {body}=await call("plan");planned=body.plan;showPlan(planned);state.textContent="구도 설계 완료";}
  catch(err){if(err.name!=="AbortError")state.textContent="분석 오류: "+err.message;}
  finally{planBtn.disabled=false;}
 });
 nextBtn.addEventListener("click",()=>{
  variant++;planned=null;clearCandidate();
  state.textContent="새 구도 "+(variant%8+1)+"/8을 설계합니다.";
  planBtn.click();
 });
 generateBtn.addEventListener("click",async()=>{
  if(!tokenInput.value.trim()){state.textContent="관리자 인증이 필요합니다.";return;}
  if(!planned){state.textContent="먼저 ‘시 분석·구도 설계’를 실행하세요.";return;}
  clearCandidate();state.textContent="AI가 실제 이미지를 제작하고 있습니다. 이미지 API의 생성 요금이 적용됩니다.";
  generateBtn.disabled=true;
  try{
   const {body,key}=await call("generate");
   if(!body.image_base64||body.mime!=="image/jpeg")throw new Error("지원되지 않는 이미지 결과입니다.");
   const raw=atob(body.image_base64);
   const bytes=new Uint8Array(raw.length);
   for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);
   currentUrl=URL.createObjectURL(new Blob([bytes],{type:"image/jpeg"}));
   const img=document.createElement("img");img.src=currentUrl;img.alt=body.plan.title+" · "+body.plan.style_name+" AI 시화 후보";
   img.style.cssText="display:block;width:100%;max-height:580px;object-fit:contain;border-radius:8px";
   preview.replaceChildren(img);showPlan(body.plan);renderedFor=key;
   state.textContent="시화 후보 생성 완료";
   update();
  }catch(err){if(err.name!=="AbortError")state.textContent="생성 실패: "+err.message;}
  finally{generateBtn.disabled=false;}
 });
 approveBtn.addEventListener("click",()=>{
  if(!currentUrl||!renderedFor)return;
  approved=true;update();state.textContent="시화 후보 승인 완료";
 });
 downloadBtn.addEventListener("click",()=>{
  if(!approved||!currentUrl)return;
  const a=document.createElement("a");a.href=currentUrl;
  a.download=(currentPoem().title||"시화").replace(/[\\/:*?"<>|]/g,"_")+"_"+select.value+"_구도"+(variant+1)+".jpg";
  document.body.append(a);a.click();a.remove();
 });
 window.addEventListener("pagehide",()=>{if(activeController)activeController.abort();if(currentUrl)URL.revokeObjectURL(currentUrl);});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",setup,{once:true});
else setup();
})();