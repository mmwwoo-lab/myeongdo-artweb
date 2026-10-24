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
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(projects));return true;}catch{alert('저장에 실패했습니다. 브라우저 저장 설정을 확인하세요.');return false;}};
  const el=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n;};
  const field=(id)=>$(id).value.trim();
  const headings={dashboard:'운영 대시보드',projects:'프로젝트 관리',create:'홈페이지 만들기',guide:'사용 안내'};
  function view(name){document.querySelectorAll('.view').forEach(x=>x.classList.toggle('visible',x.id==='view-'+name));document.querySelectorAll('[data-view]').forEach(x=>x.classList.toggle('active',x.dataset.view===name));$('page-heading').textContent=headings[name]||'대시보드';if(name==='dashboard'||name==='projects')render();window.scrollTo({top:0,behavior:'smooth'});}
  document.querySelectorAll('[data-view]').forEach(x=>x.addEventListener('click',()=>view(x.dataset.view)));
  document.querySelectorAll('[data-go]').forEach(x=>x.addEventListener('click',()=>{clearForm();view(x.dataset.go)}));
  function row(p){const wrap=el('div','project-row');const info=el('div');info.append(el('h3','',p.title),el('small','',`${p.artist} · ${p.type||'전시관'}`));const actions=el('div','row-actions');actions.append(el('span','tag',p.status||'기획'));const edit=el('button','subtle','수정');edit.addEventListener('click',()=>editProject(p.id));const del=el('button','danger','삭제');del.addEventListener('click',()=>removeProject(p.id));actions.append(edit,del);wrap.append(info,actions);return wrap;}
  function render(){ $('stat-all').textContent=projects.length;$('stat-doing').textContent=projects.filter(x=>x.status!=='완료').length;$('stat-done').textContent=projects.filter(x=>x.status==='완료').length;
    const recent=$('recent-projects');recent.replaceChildren(...(projects.length?projects.slice(-4).reverse().map(row):[el('div','empty','등록된 프로젝트가 없습니다.') ]));
    const filter=$('status-filter').value;const data=projects.filter(p=>filter==='전체'||p.status===filter);const list=$('project-list');list.replaceChildren(...(data.length?data.slice().reverse().map(row):[el('div','empty','해당 상태의 프로젝트가 없습니다.') ]));
  }
  $('status-filter').addEventListener('change',render);
  function editProject(id){const p=projects.find(x=>x.id===id);if(!p)return;$('project-id').value=p.id;for(const k of ['title','artist','type','subtitle','description','status'])$(k).value=p[k]||'';$('form-title').textContent='프로젝트 수정';updatePreview();view('create');}
  function removeProject(id){if(!confirm('이 예시 프로젝트를 삭제할까요?'))return;const previous=projects;projects=projects.filter(x=>x.id!==id);if(!save())projects=previous;render();}
  function clearForm(){$('project-form').reset();$('project-id').value='';$('form-title').textContent='새 홈페이지 만들기';updatePreview();}
  $('clear-form').addEventListener('click',clearForm);
  $('project-form').addEventListener('submit',e=>{e.preventDefault();const title=field('title'),artist=field('artist');if(!title||!artist){alert('홈페이지 제목과 작가 이름을 입력하세요.');return;}
    const current=$('project-id').value;const obj={id:current||('demo-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7)),title,artist,type:field('type'),subtitle:field('subtitle'),description:field('description'),status:field('status')};const idx=projects.findIndex(p=>p.id===current);const previous=clone(projects);if(idx>=0)projects[idx]=obj;else projects.push(obj);if(!save()){projects=previous;return;}clearForm();view('projects');});
  const types={'전시관':'ART EXHIBITION','문학관':'LITERARY ARCHIVE','작가관':'ARTIST PORTFOLIO','출판관':'BOOK & PUBLISHING'};
  function updatePreview(){$('preview-title').textContent=field('title')||'나만의 온라인 미술관';$('preview-artist').textContent=field('artist')||'작가·단체명';$('preview-subtitle').textContent=field('subtitle')||'문화예술 홈페이지를 만드는 첫걸음';$('preview-description').textContent=field('description')||'작품의 이야기가 이곳에 담깁니다.';$('preview-type').textContent=types[field('type')]||'ART EXHIBITION';}
  ['title','artist','type','subtitle','description'].forEach(k=>$(k).addEventListener('input',updatePreview));
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
    const template=`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHTML(title)}</title><meta name="description" content="${escapeHTML(description.slice(0,150))}"><style>*{box-sizing:border-box}body{margin:0;font-family:system-ui,'Malgun Gothic',sans-serif;background:#faf8f3;color:#253444;line-height:1.8}header,footer{background:#1b2c42;color:white;padding:20px 7%}header{font-weight:700}main{max-width:950px;margin:auto;padding:70px 6%}h1{font-size:clamp(2rem,5vw,3.6rem);line-height:1.3}small{letter-spacing:2px;color:#946e50}article{white-space:pre-wrap;overflow-wrap:anywhere;margin-top:50px;padding:25px;background:white;border:1px solid #ece6db;border-radius:12px}footer{text-align:center;font-size:12px}</style></head><body><header>明道 · 문화예술 홈페이지</header><main><small>${escapeHTML(kind)}</small><h1>${escapeHTML(title)}</h1><h2>${escapeHTML(subtitle)}</h2><p>작가·단체: ${escapeHTML(artist)}</p><article>${escapeHTML(description||'작품 소개를 준비하고 있습니다.')}</article></main><footer>명도재 아트웹 스튜디오 · 제작 시안</footer></body></html>`;
    const url=URL.createObjectURL(new Blob([template],{type:'text/html;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download='myeongdo-artweb-preview.html';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
  }
  $('download-site')?.addEventListener('click',exportHTML);
  render();updatePreview();
})();
