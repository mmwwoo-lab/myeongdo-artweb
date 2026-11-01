/* 월촌역 문학관: 네 가지 독립 시화 제작 기능 */
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
 button.textContent='🎨 팝아트 모자이크 제작';
 button.title='선택한 시의 원문을 해당 화풍의 그림으로 제작합니다';
 button.style.cssText='font-weight:700;padding:12px 18px;background:#40289d;color:#fff;border-radius:9px;cursor:pointer';
 const selector=document.createElement('select');
 selector.setAttribute('aria-label','시화 제작 화풍');
 selector.style.cssText='padding:12px 14px;border:1px solid #aaa;border-radius:9px;background:#fff;color:#222;font-size:15px';
 const styles=[['pop_mosaic','팝아트 모자이크 제작'],['watercolor','서정 수채화 제작'],['crayon','감성 크레용화 제작'],['portrait','인물 초상화 제작']];
 styles.forEach(([value,label])=>{const option=document.createElement('option');option.value=value;option.textContent=label;selector.append(option)});
 const status=document.createElement('span');
 status.setAttribute('role','status');status.style.cssText='font-size:13px;color:#555;max-width:450px';
 status.textContent='작품을 선택한 뒤 새 시화를 그릴 수 있습니다.';
 wrap.append(selector,button,status);caption.after(wrap);
 let activeObjectUrl=null, requestId=0;
 const renderLabel=()=>styles.find(([id])=>id===selector.value)?.[1]||'시화';
 function revoke(){if(activeObjectUrl){URL.revokeObjectURL(activeObjectUrl);activeObjectUrl=null}}
 function invalidate(){requestId++;revoke();button.disabled=false;button.textContent='🎨 '+renderLabel();status.textContent='작품을 선택한 뒤 새 시화를 그릴 수 있습니다.'}
 selector.addEventListener('change',()=>{invalidate();status.textContent=renderLabel()+' 기능을 선택했습니다.'});
 tabs.addEventListener('click',invalidate);
 document.getElementById('prev')?.addEventListener('click',invalidate);
 document.getElementById('next')?.addEventListener('click',invalidate);
 button.addEventListener('click',async function(){
  const title=(document.getElementById('title')?.textContent||'').split(' · ').slice(1).join(' · ').trim();
  const poem=verse.textContent||'';
  if(!title||!poem){status.textContent='시 원문이 없습니다.';return}
  const myId=++requestId;button.disabled=true;button.textContent='그리는 중…';status.textContent=renderLabel()+' 진행 중입니다.';
  try{
   const response=await fetch('./api/popart',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title,poem,style:selector.value}),cache:'no-store'});
   if(!response.ok)throw new Error('Python 그림 API: HTTP '+response.status);
   const blob=await response.blob();
   if(!blob.type.includes('svg'))throw new Error('그림 응답 형식 오류');
   if(myId!==requestId)return;
   revoke();activeObjectUrl=URL.createObjectURL(blob);
   const img=document.createElement('img');img.alt='「'+title+'」 원문을 분석하여 Python으로 생성한 '+renderLabel()+' 시화';img.decoding='async';
   img.onload=()=>{if(myId===requestId)status.textContent='완료: '+renderLabel()+' 결과가 표시되었습니다.'};
   img.onerror=()=>{status.textContent='그림 읽기 오류. 기존 시화는 유지됩니다.'};
   img.src=activeObjectUrl;art.replaceChildren(img);
   caption.textContent='「'+title+'」 · Python '+renderLabel()+' 시화';
  }catch(e){if(myId===requestId){status.textContent='그림 생성 실패: 기존 시화를 유지합니다. ('+e.message+')';}}
  finally{if(myId===requestId){button.disabled=false;button.textContent='🎨 '+renderLabel()+' · 다시 그리기'}}
 });
 window.addEventListener('pagehide',revoke);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();