/* 명도재 월촌역 승인 작품 · 바로가기 및 이미지 대체 준비
   현재 승인된 그림의 원본 파일이 아직 서버에 없으면 기존 시화를 표시한다.
*/
(function(){
"use strict";
function init(){
 const art=document.getElementById("poem-mosaic-art");
 const tabs=document.getElementById("tabs");
 const label=document.getElementById("poem-mosaic-label");
 if(!art||!tabs||!label)return;
 const approvedTitle="가을 타기";
 const requested=new URLSearchParams(window.location.search).get("poem");
 if(requested){const match=[...tabs.querySelectorAll("button")].find(b=>b.textContent.trim()===requested);
 if(match && match.getAttribute("aria-pressed")!=="true")match.click();}
 const isJeon=/jeon-jinsik\.html$/i.test(location.pathname);
 if(!isJeon)return;
 const note=document.createElement("p");note.style.cssText="padding:8px 14px;margin:7px 0;background:#f8efda;color:#5f4b2e;border:1px solid #e2cfa6;border-radius:7px;font-size:13px;line-height:1.6";
 note.setAttribute("aria-live","polite");
 const fig=art.closest("figure");(fig||label).after(note);
 const imgPath="./assets/approved-jeon-jinsik-autumn.jpg";
 let current=0,checked=false,assetAvailable=false;
 function display(){
  const active=document.getElementById("title")?.textContent?.split(" · ").slice(1).join(" · ").trim();
  note.hidden=active!==approvedTitle;
  if(active!==approvedTitle)return;
  note.textContent=assetAvailable?"명도재 AI 시화 감독 시스템 · 승인된 대표 시화":"명도재 AI 시화 감독 시스템 · 승인 기록 완료 (원본 이미지의 서버 등록 대기)";
  if(assetAvailable){
   const img=document.createElement("img");img.src=imgPath;img.alt="전진식 「가을 타기」 최종 승인 AI 시화";
   img.decoding="async";img.loading="eager";
   art.replaceChildren(img);label.textContent="「가을 타기」 · 최종 승인 시화";
  }
 }
 // The approved image must be a permanent file under assets, never a transient preview link.
 const probe=new Image();
 probe.onload=()=>{assetAvailable=true;checked=true;display()};
 probe.onerror=()=>{assetAvailable=false;checked=true;display()};
 probe.src=imgPath;
 tabs.addEventListener("click",()=>setTimeout(display,0));
 for(const id of ["prev","next"])document.getElementById(id)?.addEventListener("click",()=>setTimeout(display,0));
 display();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();