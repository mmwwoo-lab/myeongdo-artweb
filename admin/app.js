/* 명도재 아트웹 스튜디오 — 공개 시연용. 고객 개인정보 저장 금지. */
(() => {
  'use strict';
  const KEY='myeongdo-artweb-demo-v1';
  const EXAMPLES=[
    {id:'sample1',title:'사계의 빛 — 한국화 초대전',artist:'명도재 예술연구소',type:'전시관',subtitle:'자연을 바라보며 나를 돌아보다',description:'먹빛과 여백 속에서 계절의 빛을 만나는 가상의 전시입니다.',status:'제작 중'},
    {id:'sample2',title:'시가 머무는 집',artist:'명도재 문학연구소',type:'문학관',subtitle:'시와 삶의 작은 기록',description:'시와 산문으로 만나는 디지털 문학 공간입니다.',status:'검수'},
    {id:'sample3',title:'시집 출간 기념관',artist:'명도재 출판기획',type:'출판관',subtitle:'책장을 넘기며 만나는 시의 세계',description:'신간 소개와 작가 이야기를 담은 예시입니다.',status:'완료'}
  ];
  const $=id=>document.getElementById(id);
  const clone=arr=>arr.map(obj=>({...obj}));
  function load(){try{const raw=localStorage.getItem(KEY);if(!raw)return clone(EXAMPLES);const parsed=JSON.parse(raw);return Array.isArray(parsed)?parsed.filter(valid).slice(0,200):clone(EXAMPLES)}catch{return clone(EXAMPLES)}}
  function valid(p){return p&&typeof p==='object'&&typeof p.id==='string'&&typeof p.title==='string'&&typeof p.artist==='string'}
  let projects=load();
  let imageData='';
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(projects));return true;}catch{alert('저장에 실패했습니다. 브라우저 저장 설정을 확인하세요.');return false;}};
  const el=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n;};
  const field=(id)=>$(id).value.trim();
  const headings={dashboard:'운영 대시보드',projects:'저장된 홈페이지 관리',create:'홈페이지 만들기',guide:'사용 안내'};
  function view(name){if(!headings[name])name='dashboard';document.querySelectorAll('.view').forEach(x=>x.classList.toggle('visible',x.id==='view-'+name));document.querySelectorAll('[data-view]').forEach(x=>x.classList.toggle('active',x.dataset.view===name));$('page-heading').textContent=headings[name]||'대시보드';if(name==='dashboard'||name==='projects')render();if(location.hash!=='#'+name)history.replaceState(null,'','#'+name);window.scrollTo({top:0,behavior:'auto'});if(name==='create'){$('title').focus({preventScroll:true});}}
  document.querySelectorAll('[data-view]').forEach(x=>x.addEventListener('click',()=>view(x.dataset.view)));
  window.addEventListener('hashchange',()=>{const name=location.hash.slice(1);if(headings[name])view(name);});
  document.querySelectorAll('[data-go]').forEach(x=>x.addEventListener('click',()=>{clearForm();view(x.dataset.go)}));
  function row(p){const wrap=el('div','project-row');const info=el('div');info.append(el('h3','',p.title),el('small','',`${p.artist} · ${p.type||'전시관'}`));const actions=el('div','row-actions');actions.append(el('span','tag',p.status||'기획'));const edit=el('button','subtle','다시 편집');edit.addEventListener('click',()=>editProject(p.id));const del=el('button','danger','삭제');del.addEventListener('click',()=>removeProject(p.id));actions.append(edit,del);wrap.append(info,actions);return wrap;}
  function render(){ $('stat-all').textContent=projects.length;$('stat-doing').textContent=projects.filter(x=>x.status!=='완료').length;$('stat-done').textContent=projects.filter(x=>x.status==='완료').length;
    const recent=$('recent-projects');recent.replaceChildren(...(projects.length?projects.slice(-4).reverse().map(row):[el('div','empty','등록된 프로젝트가 없습니다.') ]));
    const filter=$('status-filter').value;const data=projects.filter(p=>filter==='전체'||p.status===filter);const list=$('project-list');list.replaceChildren(...(data.length?data.slice().reverse().map(row):[el('div','empty','해당 상태의 프로젝트가 없습니다.') ]));
  }
  $('status-filter').addEventListener('change',render);
  function editProject(id){const p=projects.find(x=>x.id===id);if(!p)return;$('project-id').value=p.id;for(const k of ['title','artist','type','subtitle','description','status'])$(k).value=p[k]||'';$('link-title').value=p.linkTitle||'';$('link-url').value=p.linkUrl||'';$('image-url').value=p.imageUrl||'';imageData=p.imageData||'';$('artwork-file').value='';$('manuscript-file').value='';$('form-title').textContent='프로젝트 수정';updatePreview();view('create');}
  function removeProject(id){if(!confirm('이 예시 프로젝트를 삭제할까요?'))return;const previous=projects;projects=projects.filter(x=>x.id!==id);if(!save())projects=previous;render();}
  function clearForm(){imageData='';if($('built-preview-box'))$('built-preview-box').hidden=true;$('project-form').reset();$('project-id').value='';$('form-title').textContent='새 홈페이지 만들기';updatePreview();}
  $('clear-form').addEventListener('click',clearForm);
  $('project-form').addEventListener('submit',e=>{e.preventDefault();const title=field('title'),artist=field('artist');if(!title||!artist){alert('홈페이지 제목과 작가 이름을 입력하세요.');return;}
    const current=$('project-id').value;const obj={id:current||('demo-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7)),title,artist,type:field('type'),subtitle:field('subtitle'),description:field('description'),imageUrl:safeImageURL(field('image-url')),imageData,linkTitle:field('link-title'),linkUrl:safeLinkURL(field('link-url')),status:field('status')};const idx=projects.findIndex(p=>p.id===current);const previous=clone(projects);if(idx>=0)projects[idx]=obj;else projects.push(obj);if(!save()){projects=previous;return;}clearForm();view('projects');alert('홈페이지가 저장되었습니다. 목록에서 다시 편집할 수 있습니다.');});
  const types={'전시관':'ART EXHIBITION','문학관':'LITERARY ARCHIVE','작가관':'ARTIST PORTFOLIO','출판관':'BOOK & PUBLISHING'};
  function safeLinkURL(raw){try{const u=new URL(raw);return u.protocol==='https:'?u.href:'';}catch{return '';}}
  function safeImageURL(raw){try{const u=new URL(raw);return u.protocol==='https:'?u.href:'';}catch{return '';}}
  function updatePreview(){$('preview-title').textContent=field('title')||'나만의 온라인 미술관';$('preview-artist').textContent=field('artist')||'작가·단체명';$('preview-subtitle').textContent=field('subtitle')||'문화예술 홈페이지를 만드는 첫걸음';$('preview-description').textContent=field('description')||'작품의 이야기가 이곳에 담깁니다.';$('preview-type').textContent=types[field('type')]||'ART EXHIBITION';const area=$('preview-image');area.replaceChildren();const src=imageData||safeImageURL(field('image-url'));area.hidden=!src;if(src){const pic=document.createElement('img');pic.src=src;pic.alt='대표 작품 이미지';pic.style.cssText='width:100%;max-height:340px;object-fit:contain;border-radius:8px';area.append(pic);}const linkArea=$('preview-link');linkArea.replaceChildren();const href=safeLinkURL(field('link-url'));if(href){const a=document.createElement('a');a.href=href;a.target='_blank';a.rel='noopener noreferrer';a.textContent=field('link-title')||'관련 사이트 열기';a.style.cssText='display:inline-block;margin-top:14px;padding:9px 16px;background:#27485b;color:white;border-radius:8px;text-decoration:none';linkArea.append(a);}}
  ['title','artist','type','subtitle','description','image-url','link-title','link-url'].forEach(k=>$(k).addEventListener('input',updatePreview));
  $('export-btn').addEventListener('click',()=>{const blob=new Blob([JSON.stringify({version:1,exportedAt:new Date().toISOString(),projects},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='myeongdo-artweb-demo-projects.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
  $('reset-btn').addEventListener('click',()=>{if(!confirm('시연 데이터를 기본 예시로 초기화할까요?'))return;const previous=projects;projects=clone(EXAMPLES);if(!save())projects=previous;render();});

  // 독립 실행 가능한 고객 홈페이지 시안 다운로드 (외부 업로드·발행 기능 아님)
  function escapeHTML(value){return String(value??'').replace(/[&<>"']/g, ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
  function exportHTML(){
    const title=field('title')||'문화예술 홈페이지';
    const artist=field('artist')||'작가 이름';
    const subtitle=field('subtitle');
    const description=field('description');
    const kind=field('type');
    const imageUrl=imageData||safeImageURL(field('image-url'));
    const linkUrl=safeLinkURL(field('link-url'));
    const linkBlock=linkUrl?'<p><a href="'+escapeHTML(linkUrl)+'" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:11px 18px;background:#29485c;color:white;border-radius:7px;text-decoration:none">'+escapeHTML(field('link-title')||'관련 사이트 열기')+'</a></p>':'';
    const imageBlock=imageUrl?'<figure><img src="'+escapeHTML(imageUrl)+'" alt="대표 작품" style="max-width:100%;max-height:500px;object-fit:contain"><figcaption>대표 작품</figcaption></figure>':'';
    const template=`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHTML(title)}</title><meta name="description" content="${escapeHTML(description.slice(0,150))}"><style>*{box-sizing:border-box}body{margin:0;font-family:system-ui,'Malgun Gothic',sans-serif;background:#faf8f3;color:#253444;line-height:1.8}header,footer{background:#1b2c42;color:white;padding:20px 7%}header{font-weight:700}main{max-width:950px;margin:auto;padding:70px 6%}h1{font-size:clamp(2rem,5vw,3.6rem);line-height:1.3}small{letter-spacing:2px;color:#946e50}article{white-space:pre-wrap;overflow-wrap:anywhere;margin-top:50px;padding:25px;background:white;border:1px solid #ece6db;border-radius:12px}footer{text-align:center;font-size:12px}</style></head><body><header>明道 · 문화예술 홈페이지</header><main><small>${escapeHTML(kind)}</small><h1>${escapeHTML(title)}</h1><h2>${escapeHTML(subtitle)}</h2><p>작가·단체: ${escapeHTML(artist)}</p>${imageBlock}${linkBlock}<article>${escapeHTML(description||'작품 소개를 준비하고 있습니다.')}</article></main><footer>명도재 아트웹 스튜디오 · 제작 시안</footer></body></html>`;
    const url=URL.createObjectURL(new Blob([template],{type:'text/html;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download='myeongdo-artweb-preview.html';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
  }
  $('artwork-file').addEventListener('change',async e=>{
    const file=e.target.files[0];if(!file)return;
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>400*1024){alert('JPG·PNG·WebP 사진만 지원하며 파일 크기는 400KB 이하여야 합니다.');e.target.value='';return;}
    try{
      const data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(new Error('파일 읽기 실패'));reader.readAsDataURL(file);});
      imageData=data;$('image-url').value='';updatePreview();$('form-feedback').textContent='작품 사진 '+file.name+' 불러오기 완료. 미리보기와 다운로드에 포함됩니다.';
    }catch(err){alert('이미지 파일을 불러오지 못했습니다.');}
  });
  $('remove-artwork').addEventListener('click',()=>{imageData='';$('artwork-file').value='';updatePreview();$('form-feedback').textContent='선택한 작품 사진을 삭제했습니다.';});
  $('manuscript-file').addEventListener('change',async e=>{
    const file=e.target.files[0];if(!file)return;
    if(!/\.(txt|md)$/i.test(file.name)||file.size>100*1024){alert('100KB 이하 TXT 또는 MD 원고만 지원합니다.');e.target.value='';return;}
    try{
      const text=await file.text();$('description').value=text.slice(0,1600);updatePreview();$('form-feedback').textContent='원고 '+file.name+' 불러오기 완료. 글자 수 제한에 따라 최대 1,600자만 반영됩니다.';
    }catch{alert('원고 파일을 읽지 못했습니다.');}
  });
  $('download-site')?.addEventListener('click',exportHTML);
  $('build-site').addEventListener('click',()=>{
    if(!$('project-form').reportValidity())return;
    // 미리보기는 프로젝트를 저장하지 않습니다. 저장은 별도의 명시적인 버튼으로만 처리합니다.
    const title=field('title'),artist=field('artist'),kind=field('type'),subtitle=field('subtitle'),description=field('description');
    const imageUrl=imageData||safeImageURL(field('image-url'));
    const linkUrl=safeLinkURL(field('link-url'));
    const linkButton=linkUrl?'<p><a href="'+escapeHTML(linkUrl)+'" target="_blank" rel="noopener noreferrer">'+escapeHTML(field('link-title')||'관련 사이트 열기')+'</a></p>':'';
    const pic=imageUrl?'<img src="'+escapeHTML(imageUrl)+'" alt="대표 작품" style="max-width:100%;max-height:540px;object-fit:contain">':'';
    const site='<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+escapeHTML(title)+'</title><style>body{margin:0;background:#fbf8f1;color:#283b50;font:16px/1.8 system-ui,sans-serif}header,footer{background:#1b2c42;color:#fff;padding:20px 6%}main{max-width:960px;margin:auto;padding:65px 6%}h1{font-size:clamp(30px,5vw,56px)}article{white-space:pre-wrap;margin:36px 0;padding:25px;background:white;border-radius:14px}img{display:block;margin:20px auto}small{color:#8a644a}</style><header>明道 · 명도재 아트웹</header><main><small>'+escapeHTML(kind)+'</small><h1>'+escapeHTML(title)+'</h1><h2>'+escapeHTML(subtitle)+'</h2><p>작가 · '+escapeHTML(artist)+'</p>'+pic+linkButton+'<article>'+escapeHTML(description||'작품 소개 준비 중')+'</article></main><footer>명도재 문화예술 홈페이지 제작소 · 미리보기</footer></html>';
    const frame=$('built-preview'),box=$('built-preview-box');
    frame.srcdoc=site;box.hidden=false;
    $('form-feedback').textContent='미리보기가 생성되었습니다. 저장하려면 ‘이 홈페이지 저장하기’를 누르세요.';
    box.scrollIntoView({behavior:'smooth',block:'nearest'});
  });

  // 입력 중 오류 및 저장 성공 여부를 화면에서 명확하게 안내
  $('project-form').addEventListener('input',()=>{const n=$('form-feedback');if(n)n.textContent='입력 중 · 오른쪽 화면에 내용이 반영됩니다.';});
  render();updatePreview();
  const requested=location.hash.slice(1);if(headings[requested])view(requested);
})();
