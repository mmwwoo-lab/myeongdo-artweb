/* 월촌역 문학관 Python Pop Art UI / 시 제목+원문으로 그림 그리기 */
(function(){
"use strict";
function init(){
 const art=document.getElementById('poem-mosaic-art');
 const caption=document.getElementById('poem-mosaic-label');
 const verse=document.getElementById('verse');
 const tabs=document.getElementById('tabs');
 if(!art||!verse||!tabs||!caption)return;
 const wrap=document.createElement('div');
 wrap.className='python-art-controls';
 wrap.style.cssText='display:flex;gap:10px;justify-content:center;align-items:center;flex-wrap:wrap;margin:12px auto 18px;padding:0 12px';
 const button=document.createElement('button');
 button.type='button';
 button.textContent='🎨 파이썬 팝아트 그리기';
 button.title='현재 선택한 시의 내용으로 새 팝아트 시화를 생성합니다';
 button.style.cssText='font-weight:700;padding:12px 18px;background:#40289d;color:#fff;border-radius:9px;cursor:pointer';
 const status=document.createElement('span');
 status.setAttribute('role','status');status.style.cssText='font-size:13px;color:#555;max-width:450px';
 status.textContent='작품을 선택한 뒤 새 시화를 그릴 수 있습니다.';
 wrap.append(button,status);caption.after(wrap);
 let activeObjectUrl=null, requestId=0;
 function revoke(){if(activeObjectUrl){URL.revokeObjectURL(activeObjectUrl);activeObjectUrl=null}}
 function invalidate(){requestId++;revoke();button.disabled=false;button.textContent='🎨 파이썬 팝아트 그리기';status.textContent='작품을 선택한 뒤 새 시화를 그릴 수 있습니다.'}
 tabs.addEventListener('click',invalidate);
 document.getElementById('prev')?.addEventListener('click',invalidate);
 document.getElementById('next')?.addEventListener('click',invalidate);
 button.addEventListener('click',async function(){
  const title=(document.getElementById('title')?.textContent||'').split(' · ').slice(1).join(' · ').trim();
  const poem=verse.textContent||'';
  if(!title||!poem){status.textContent='시 원문이 없습니다.';return}
  const myId=++requestId;button.disabled=true;button.textContent='그리는 중…';status.textContent='시 속의 사물·풍경·정서를 분석하여 팝아트로 그립니다.';
  try{
   const response=await fetch('./api/popart',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title,poem}),cache:'no-store'});
   if(!response.ok)throw new Error('Python 그림 API: HTTP '+response.status);
   const blob=await response.blob();
   if(!blob.type.includes('svg'))throw new Error('그림 응답 형식 오류');
   if(myId!==requestId)return;
   revoke();activeObjectUrl=URL.createObjectURL(blob);
   const img=document.createElement('img');img.alt='「'+title+'」 원문을 분석하여 Python으로 생성한 팝아트 시화';img.decoding='async';
   img.onload=()=>{if(myId===requestId)status.textContent='완료: 시 속의 소재를 이용한 팝아트 시화입니다.'};
   img.onerror=()=>{status.textContent='그림 읽기 오류. 기존 시화는 유지됩니다.'};
   img.src=activeObjectUrl;art.replaceChildren(img);
   caption.textContent='「'+title+'」 · Python 팝아트 시화';
  }catch(e){if(myId===requestId){status.textContent='서버 그림 생성 실패: 기존 팝아트 시화를 유지합니다. ('+e.message+')';}}
  finally{if(myId===requestId){button.disabled=false;button.textContent='🎨 파이썬 팝아트 다시 그리기'}}
 });
 window.addEventListener('pagehide',revoke);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();