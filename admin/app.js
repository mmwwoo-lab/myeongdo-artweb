(() => {
  const $ = (id) => document.getElementById(id);
  const KEY = 'myeongdo_artweb_v7_projects';
  const LEGACY_KEY = 'myeongdo-artweb-demo-v1';
  const SAMPLE_PROJECTS = [
    {id:'sample-news',title:'만화로 보는 뉴스',owner:'명도재 이명우',template:'news',subtitle:'기사와 만화로 읽는 오늘',summary:'핵심 기사와 만화 뉴스 소개',mainText:'기사 원고를 입력해 보세요.',status:'기획',artworks:[null,null,null],artworkCaptions:['','',''],review:'',linkTitle:'기사 원문',linkUrl:'',poemArt:null,manuscript:null},
    {id:'sample-exh',title:'사계의 빛 — 한국화 초대전',owner:'명도재 이명우',template:'exhibition',subtitle:'한국화 초대전 안내',summary:'작품 6점과 평론을 갖춘 전시관',mainText:'전시 소개를 입력하세요.',status:'제작 중',artworks:[null,null,null,null,null,null],artworkCaptions:['','','','','',''],review:'작품 평론을 자동 생성하거나 직접 작성하세요.',linkTitle:'전시 안내',linkUrl:'',poemArt:null,manuscript:null}
  ];

  let projects = loadProjects();
  let manuscript = null;
  let poemArt = null;
  let artworks = emptyArtworks(6);

  const headings = {dashboard:'운영 대시보드',projects:'저장된 홈페이지 관리',create:'홈페이지 만들기',guide:'사용 안내'};
  const templateMeta = {
    news:{label:'만화로 보는 뉴스', limit:3, kind:'news', preview:'NEWS', guide:'뉴스형 구성: 기사 글쓰기 중심 · 이미지 3장', mainLabel:'기사 본문 · 만화 설명', mainPlaceholder:'기사 내용, 취재 요약, 말풍선 설명, 만화 해설 등을 작성하세요.', nav:'기사 · 만화 · 링크', showReview:false, showPoemArt:false},
    literary:{label:'명도재 이명우 · 문학관', limit:3, kind:'text', preview:'LITERARY ARCHIVE', guide:'문학관 구성: 글쓰기 중심 · 그림/작품 3장', mainLabel:'시 · 산문 · 문학 글쓰기', mainPlaceholder:'시, 산문, 작가 소개, 문학 평론을 작성하세요.', nav:'시 · 산문 · 시화', showReview:false, showPoemArt:true},
    book_launch:{label:'시집 출간 기념관', limit:3, kind:'text', preview:'BOOK LAUNCH', guide:'시집 소개형 구성: 글쓰기 중심 · 그림/작품 3장', mainLabel:'시집 소개 · 추천사 · 시 원문', mainPlaceholder:'시집 소개, 목차, 추천사, 대표 시 원문을 작성하세요.', nav:'시집 소개 · 시 · 시화', showReview:false, showPoemArt:true},
    poem_house:{label:'시가 머무는 집', limit:3, kind:'text', preview:'POEM HOUSE', guide:'시집 소개형 구성: 글쓰기 중심 · 그림/작품 3장', mainLabel:'시와 글쓰기', mainPlaceholder:'시, 해설, 감상문, 시집 안내문을 작성하세요.', nav:'시 · 글 · 시화', showReview:false, showPoemArt:true},
    exhibition:{label:'사계의 빛 — 한국화 초대전', limit:6, kind:'art', preview:'ART EXHIBITION', guide:'전시형 구성: 작품 6점 · 작품 설명 · 전체 작품 평론', mainLabel:'전시 소개 · 작가노트', mainPlaceholder:'전시 소개, 작가노트, 전시 의도를 작성하세요.', nav:'전시 소개 · 작품 · 평론', showReview:true, showPoemArt:false}
  };

  function loadProjects(){
    try{
      const raw = localStorage.getItem(KEY);
      if(!raw) return migrateLegacyProjects() || structuredClone(SAMPLE_PROJECTS);
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : structuredClone(SAMPLE_PROJECTS);
    }catch{return structuredClone(SAMPLE_PROJECTS);}
  }
  function migrateLegacyProjects(){
    try{
      const raw=localStorage.getItem(LEGACY_KEY);
      if(!raw) return null;
      const legacy=JSON.parse(raw);
      if(!Array.isArray(legacy)) return null;
      return legacy.filter(p=>p&&typeof p.title==='string').map(p=>({
        id:p.id||('legacy-'+Date.now()),title:p.title,owner:p.artist||'',
        template:p.type==='전시관'?'exhibition':p.type==='출판관'?'book_launch':p.type==='문학관'?'literary':p.type==='뉴스관'?'news':'literary',
        subtitle:p.subtitle||'',summary:p.description||'',mainText:p.mainText||'',review:p.overallReview||'',
        artworks:Array.from({length:6},(_,i)=>({dataUrl:p.artworkImages?.[i]||p.imageData&&i===0&&p.imageData||'',name:'',caption:p.artworkCaptions?.[i]||''})),
        linkTitle:p.linkTitle||'',linkUrl:p.linkUrl||'',status:p.status||'기획',manuscript:p.manuscript||null,poemArt:null
      }));
    }catch{return null;}
  }
  function saveProjects(){
    try{ localStorage.setItem(KEY, JSON.stringify(projects)); return true; }
    catch(err){ alert('저장에 실패했습니다. 브라우저 저장공간을 확인하세요.'); return false; }
  }
  function mutateProjects(next){const old=projects;projects=next;if(!saveProjects()){projects=old;return false;}renderProjectLists();return true;}
  function emptyArtworks(n){ return Array.from({length:n}, () => ({dataUrl:'', name:'', caption:''})); }
  function currentMeta(){ return templateMeta[$('template').value] || templateMeta.news; }
  function esc(s){ return String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
  function safeHttps(url){ try{ const u = new URL(url); return u.protocol === 'https:' ? u.href : ''; }catch{ return ''; } }
  function view(name){
    if(!headings[name]) name='dashboard';
    document.querySelectorAll('.view').forEach(v => v.classList.toggle('visible', v.id === 'view-' + name));
    document.querySelectorAll('[data-view]').forEach(b => b.classList.toggle('active', b.dataset.view === name));
    $('page-heading').textContent = headings[name];
    if(name === 'dashboard' || name === 'projects') renderProjectLists();
    if(name === 'create') $('title').focus({preventScroll:true});
    history.replaceState(null, '', '#' + name);
  }

  function applyTemplateMode(){
    const meta = currentMeta();
    $('template-guide').textContent = meta.guide;
    $('main-text-label').textContent = meta.mainLabel;
    $('main-text').placeholder = meta.mainPlaceholder;
    $('gallery-heading').textContent = `그림·작품 ${meta.limit}장 등록`;
    $('gallery-help').textContent = `${meta.limit}장까지 등록 가능하며, 각 작품에 설명을 붙일 수 있습니다.`;
    $('review-block').hidden = !meta.showReview;
    $('poem-art-block').hidden = !meta.showPoemArt;
    $('preview-type').textContent = meta.preview;
    $('preview-nav').textContent = meta.nav;
    renderUploadCards();
    renderPreview();
  }

  function ensureArtworkCount(){
    const limit = currentMeta().limit;
    if(artworks.length < limit){ while(artworks.length < limit) artworks.push({dataUrl:'',name:'',caption:''}); }
    if(artworks.length < 6){ while(artworks.length < 6) artworks.push({dataUrl:'',name:'',caption:''}); }
  }

  function renderUploadCards(){
    ensureArtworkCount();
    const wrap = $('artwork-upload-grid');
    wrap.className = 'upload-grid';
    wrap.replaceChildren();
    const limit = currentMeta().limit;
    for(let i=0;i<limit;i++){
      const card = document.createElement('div');
      card.className = 'upload-card';
      card.innerHTML = `
        <h5>작품 ${i+1}</h5>
        <input type="file" id="artwork-file-${i}" accept="image/jpeg,image/png,image/webp">
        <div class="inline-actions">
          <button type="button" class="subtle" id="replace-artwork-${i}">사진 선택</button>
          <button type="button" class="danger" id="remove-artwork-${i}">삭제</button>
        </div>
        <div class="upload-preview" id="upload-preview-${i}">작품 이미지 업로드</div>
        <label for="artwork-caption-${i}">작품 ${i+1} 설명</label>
        <textarea id="artwork-caption-${i}" class="caption-box" rows="3" maxlength="1000" placeholder="작품명 · 재료 · 규격 · 제작연도 · 설명"></textarea>
      `;
      wrap.append(card);
    }
    for(let i=0;i<limit;i++){
      const fileInput = $('artwork-file-'+i);
      const caption = $('artwork-caption-'+i);
      fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0]; if(!file) return;
        if(!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 500*1024){ alert('JPG·PNG·WebP 500KB 이하만 가능합니다.'); fileInput.value=''; return; }
        const dataUrl = await fileToDataUrl(file);
        artworks[i] = {...artworks[i], dataUrl, name:file.name, caption:caption.value || artworks[i].caption || ''};
        updateUploadPreview(i); renderPreview();
        $('form-feedback').textContent = `작품 ${i+1} 이미지가 등록되었습니다.`;
      });
      $('replace-artwork-'+i).addEventListener('click', () => fileInput.click());
      $('remove-artwork-'+i).addEventListener('click', () => { artworks[i] = {dataUrl:'',name:'',caption:''}; fileInput.value=''; caption.value=''; updateUploadPreview(i); renderPreview(); $('form-feedback').textContent = `작품 ${i+1} 이미지가 삭제되었습니다.`; });
      caption.addEventListener('input', () => { artworks[i].caption = caption.value; renderPreview(); });
      updateUploadPreview(i);
      caption.value = artworks[i]?.caption || '';
    }
  }

  function updateUploadPreview(i){
    const box = $('upload-preview-'+i); if(!box) return;
    box.replaceChildren();
    const item = artworks[i];
    if(item && item.dataUrl){
      const img = document.createElement('img'); img.src = item.dataUrl; img.alt = item.name || `작품 ${i+1}`;
      box.append(img);
      const small = document.createElement('small'); small.textContent = item.name || `작품 ${i+1}`; box.append(small);
    }else{
      box.textContent = '작품 이미지 업로드';
    }
  }

  async function fileToDataUrl(file){ return await new Promise((resolve,reject) => { const reader=new FileReader(); reader.onload=()=>resolve(reader.result); reader.onerror=()=>reject(reader.error); reader.readAsDataURL(file); }); }

  function renderManuscript(){
    const info = $('manuscript-info');
    const box = $('manuscript-preview');
    box.replaceChildren();
    if(!manuscript){ info.textContent = '파일 미선택 · TXT는 본문으로 불러오고, JPG는 미리보기, HWP는 첨부 보관만 지원합니다.'; return; }
    info.textContent = `선택한 파일: ${manuscript.name}`;
    if(manuscript.kind === 'jpg'){
      const img = document.createElement('img'); img.src = manuscript.dataUrl; img.alt = manuscript.name; box.append(img);
    }else if(manuscript.kind === 'txt'){
      const pre = document.createElement('div'); pre.className = 'preview-article'; pre.textContent = manuscript.text?.slice(0,800) || ''; box.append(pre);
    }else if(manuscript.kind === 'hwp'){
      const p = document.createElement('p'); p.textContent = 'HWP 파일은 원본 첨부·다운로드용으로 보관됩니다. 본문 자동 읽기는 지원하지 않습니다.'; box.append(p);
    }
  }



  function generateCritiqueText(){
    const title = $('title').value.trim() || '이번 전시';
    const owner = $('owner').value.trim() || '작가';
    const desc = $('summary').value.trim();
    const active = artworks.filter(a => a.dataUrl);
    if(!active.length){ alert('평론을 작성할 작품 이미지를 먼저 한 장 이상 등록하세요.'); return null; }
    const caps = active.map(a => a.caption).filter(Boolean).join(' · ');
    const mood = /봄|꽃|연두|새싹/.test(desc + caps) ? '맑고 생동하는 계절감' : /달|밤|고요|적막/.test(desc + caps) ? '고요하고 사색적인 울림' : /산|강|바다|하늘/.test(desc + caps) ? '넓고 깊은 자연의 호흡' : '절제된 화면과 단단한 시선';
    let text = `${title}은 ${owner}의 시선을 통해 ${mood}을 드러낸다. 화면은 형식보다 정서에 가까이 다가서며, 작품마다 빛의 결을 다르게 쌓아 올린다. 개별 이미지가 지닌 호흡은 서로 이어지며 하나의 전시 리듬을 만들고, 관람자는 그 리듬 속에서 한국화의 여백과 시간성을 차분히 만나게 된다.`;
    if(text.length > 200) text = text.slice(0, 198) + '…';
    if(text.length < 180) text += ' 전시 전체는 조형미와 서정의 균형을 보여 준다.';
    return text;
  }

  function generatePoemArtSvg(){
    const title = $('title').value.trim() || '시화';
    const owner = $('owner').value.trim() || '명도재';
    const text = ($('main-text').value.trim() || $('summary').value.trim() || '').replace(/\s+/g,' ').trim();
    if(!text){ alert('시 내용 또는 본문 글을 먼저 입력하세요.'); return null; }
    const motifs = extractPoemMotifs(text);
    const bg = motifs.palette;
    const excerpt = wrapTextForSvg(text.slice(0, 140), 18).slice(0, 6);
    const decorative = motifs.icons.map((icon,idx)=> `<text x="${120 + idx*160}" y="${310 + (idx%2)*70}" font-size="54" fill="rgba(60,72,88,.16)">${esc(icon)}</text>`).join('');
    const lines = excerpt.map((line, idx) => `<text x="80" y="${780 + idx*60}" font-size="34" fill="#243447">${esc(line)}</text>`).join('');
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1600" viewBox="0 0 900 1600">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${bg[0]}"/>
      <stop offset="50%" stop-color="${bg[1]}"/>
      <stop offset="100%" stop-color="${bg[2]}"/>
    </linearGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="22"/></filter>
  </defs>
  <rect width="900" height="1600" fill="#faf7f1"/>
  <rect x="28" y="28" width="844" height="1544" rx="28" fill="url(#bg)" opacity="0.38"/>
  <circle cx="180" cy="250" r="150" fill="${bg[0]}" opacity="0.45" filter="url(#blur)"/>
  <circle cx="700" cy="400" r="180" fill="${bg[1]}" opacity="0.35" filter="url(#blur)"/>
  <circle cx="420" cy="1180" r="230" fill="${bg[2]}" opacity="0.32" filter="url(#blur)"/>
  ${decorative}
  <text x="80" y="120" font-size="28" fill="#6b7280">9:16 수채화풍 시화</text>
  <text x="80" y="200" font-size="58" font-weight="700" fill="#1f2f3f">${esc(title)}</text>
  <text x="80" y="260" font-size="30" fill="#475569">${esc(owner)}</text>
  <text x="80" y="680" font-size="28" fill="#7c4a4a">${esc(motifs.caption)}</text>
  ${lines}
  <rect x="80" y="1220" width="740" height="210" rx="24" fill="rgba(255,255,255,0.58)" stroke="rgba(42,60,80,0.08)"/>
  <text x="110" y="1285" font-size="30" font-weight="700" fill="#1f2f3f">시의 정서</text>
  <text x="110" y="1335" font-size="28" fill="#243447">${esc(motifs.analysis1)}</text>
  <text x="110" y="1385" font-size="28" fill="#243447">${esc(motifs.analysis2)}</text>
  <rect x="725" y="1460" width="90" height="90" rx="10" fill="#b91c1c"/>
  <text x="748" y="1518" font-size="34" fill="#fff" font-weight="700">明道</text>
</svg>`;
    const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    poemArt = {svg, dataUrl, createdAt: new Date().toISOString()};
    return poemArt;
  }

  function extractPoemMotifs(text){
    const dictionary = [
      {word:'달',icon:'☾',color:['#f9e7b2','#ecd4a6','#d7c5f3'],caption:'달빛이 머무는 서정',analysis1:'달빛 이미지는 시 속의 고요와 그리움을 길게 끌어간다.',analysis2:'밝음보다 여운이 먼저 도착하는 정서가 수채화처럼 번진다.'},
      {word:'꽃',icon:'✿',color:['#f7d2d8','#fbe7c6','#d8efe3'],caption:'꽃의 이미지가 피어나는 시심',analysis1:'꽃의 이미지는 화자의 감정을 섬세하게 열어 보인다.',analysis2:'계절의 순간을 붙드는 따뜻한 시선이 화면 전체를 감싼다.'},
      {word:'가을',icon:'🍁',color:['#f0c2a3','#d8b38c','#f8e8d7'],caption:'가을빛이 스미는 정조',analysis1:'가을의 색조가 시간의 깊이와 기억의 결을 함께 드러낸다.',analysis2:'사라짐과 머묾이 한 장면 안에서 조용히 공존한다.'},
      {word:'바다',icon:'〰',color:['#cbe5ef','#a9d5e0','#d8eef2'],caption:'물결처럼 확장되는 시선',analysis1:'바다의 이미지는 감정의 폭과 리듬을 넓게 열어 준다.',analysis2:'파동처럼 반복되는 언어가 사유의 깊이를 만든다.'},
      {word:'산',icon:'⛰',color:['#d3e1cb','#dbe9d3','#f0f5ea'],caption:'산의 침묵을 닮은 여백',analysis1:'산의 이미지는 묵직한 안정감과 사유의 높이를 암시한다.',analysis2:'단단한 풍경 속에서 화자의 호흡이 천천히 깊어진다.'},
      {word:'비',icon:'☔',color:['#d7dde8','#c5d2e6','#e9eef7'],caption:'빗결이 적시는 정서',analysis1:'비의 이미지는 감정의 세밀한 파동과 내면의 밀도를 높인다.',analysis2:'젖어드는 장면마다 언어의 온도가 차분하게 살아난다.'}
    ];
    const found = dictionary.find(item => text.includes(item.word)) || {icon:'✧', color:['#eadfc9','#dce9ef','#f4e6ea'],caption:'수채로 번지는 시의 여운',analysis1:'시의 핵심 이미지는 감정의 결을 부드럽게 펼쳐 보인다.',analysis2:'화자의 시선은 여백 속에 머무르며 서정의 호흡을 만든다.'};
    const icons = [found.icon, '✧', '❀'];
    return {palette:found.color, icons, caption:found.caption, analysis1:found.analysis1, analysis2:found.analysis2};
  }

  function wrapTextForSvg(text, wordsPerLine){
    const words = text.split(' ');
    const lines=[];
    let cur='';
    for(const w of words){
      const next = cur ? cur + ' ' + w : w;
      if(next.length > wordsPerLine){ if(cur) lines.push(cur); cur = w; }
      else cur = next;
    }
    if(cur) lines.push(cur);
    return lines;
  }

  function renderPoemArt(){
    const wrap = $('poem-art-preview');
    const preview = $('preview-poem-art');
    const outer = $('preview-poem-art-wrap');
    wrap.replaceChildren(); preview.replaceChildren();
    if(!poemArt){ wrap.classList.add('empty-box'); wrap.textContent = '아직 생성된 시화가 없습니다.'; outer.hidden = true; return; }
    wrap.classList.remove('empty-box'); wrap.textContent='';
    preview.textContent=''; outer.hidden = false;
    const img1 = document.createElement('img'); img1.src = poemArt.dataUrl; img1.alt = '자동 생성 시화'; wrap.append(img1);
    const img2 = document.createElement('img'); img2.src = poemArt.dataUrl; img2.alt = '자동 생성 시화'; preview.append(img2);
  }

  function renderPreview(){
    const meta = currentMeta();
    $('preview-type').textContent = meta.preview;
    $('preview-title').textContent = $('title').value.trim() || meta.label;
    $('preview-subtitle').textContent = $('subtitle').value.trim() || '한 줄 소개';
    $('preview-owner').textContent = $('owner').value.trim() || '작가·단체명';
    $('preview-summary').textContent = $('summary').value.trim() || '짧은 소개가 여기에 표시됩니다.';
    $('preview-biography').textContent = $('biography').value.trim() || '작가 약력 또는 단체 소개를 입력하세요.';
    $('preview-contact').textContent = $('contact').value.trim() || '문의 방법을 입력하세요.';
    const linkWrap = $('preview-link');
    linkWrap.replaceChildren();
    const href = safeHttps($('link-url').value.trim());
    if(href){ const a = document.createElement('a'); a.href=href; a.target='_blank'; a.rel='noopener noreferrer'; a.className='primary'; a.textContent = $('link-title').value.trim() || '관련 사이트 열기'; linkWrap.append(a); }
    const mainText = $('main-text').value.trim() || '본문 글이 여기에 표시됩니다.';
    $('preview-main-text').textContent = mainText;
    const gallery = $('preview-art-gallery'); gallery.replaceChildren();
    const limit = meta.limit;
    for(let i=0;i<limit;i++){
      const tile = document.createElement('div'); tile.className='art-tile';
      const item = artworks[i] || {dataUrl:'',caption:''};
      if(item.dataUrl){
        const img = document.createElement('img'); img.src = item.dataUrl; img.alt = `작품 ${i+1}`; tile.append(img);
        const cap = document.createElement('div'); cap.className='preview-article'; cap.textContent = item.caption || `작품 ${i+1} 설명을 입력하세요.`; tile.append(cap);
      }else{ tile.textContent = `작품 ${i+1} 이미지 자리`; }
      gallery.append(tile);
    }
    $('preview-review').hidden = !meta.showReview;
    $('preview-review').textContent = $('overall-review').value.trim() || '전체 작품 평론이 여기에 표시됩니다.';
    renderPoemArt();
  }

  function collectFormData(){
    const limit = currentMeta().limit;
    return {
      id: $('project-id').value || ('project-' + Date.now() + '-' + Math.random().toString(36).slice(2,7)),
      title: $('title').value.trim(),
      owner: $('owner').value.trim(),
      template: $('template').value,
      subtitle: $('subtitle').value.trim(),
      biography: $('biography').value.trim(),
      contact: $('contact').value.trim(),
      summary: $('summary').value.trim(),
      mainText: $('main-text').value.trim(),
      review: $('overall-review').value.trim(),
      linkTitle: $('link-title').value.trim(),
      linkUrl: safeHttps($('link-url').value.trim()),
      status: $('status').value,
      artworks: artworks.slice(0, limit).map(a => ({...a, caption: a.caption || ''})),
      manuscript,
      poemArt
    };
  }

  function fillForm(project){
    $('project-id').value = project.id || '';
    $('title').value = project.title || '';
    $('owner').value = project.owner || '';
    $('template').value = project.template || 'news';
    $('subtitle').value = project.subtitle || '';
    $('biography').value = project.biography || '';
    $('contact').value = project.contact || '';
    $('summary').value = project.summary || '';
    $('main-text').value = project.mainText || '';
    $('overall-review').value = project.review || '';
    $('link-title').value = project.linkTitle || '';
    $('link-url').value = project.linkUrl || '';
    $('status').value = project.status || '기획';
    manuscript = project.manuscript || null;
    poemArt = project.poemArt || null;
    artworks = emptyArtworks(6);
    (project.artworks || []).slice(0,6).forEach((a, idx) => { artworks[idx] = {...artworks[idx], ...(a||{})}; });
    $('form-title').textContent = '홈페이지 수정 · '+(project.title||'');
    $('built-preview-box').hidden=true;
    applyTemplateMode();
    renderManuscript();
    renderPoemArt();
    view('create');
  }

  function clearForm(){
    $('project-form').reset();
    $('project-id').value = '';
    $('template').value = 'news';
    $('form-title').textContent = '새 홈페이지 만들기';
    manuscript = null; poemArt = null; artworks = emptyArtworks(6);
    $('built-preview-box').hidden = true;
    applyTemplateMode();
    renderManuscript();
    renderPoemArt();
    $('form-feedback').textContent = '새 입력을 시작합니다.';
  }

  function renderProjectLists(){
    $('stat-all').textContent = projects.length;
    $('stat-doing').textContent = projects.filter(p => p.status !== '완료').length;
    $('stat-done').textContent = projects.filter(p => p.status === '완료').length;
    $('stat-type').textContent = projects.length ? templateMeta[projects[projects.length-1].template]?.label || '-' : '-';
    const recentWrap = $('recent-projects'); recentWrap.replaceChildren();
    const recent = projects.slice().reverse().slice(0,4);
    if(!recent.length) recentWrap.append(emptyNode('아직 저장된 홈페이지가 없습니다.')); else recent.forEach(p => recentWrap.append(projectRow(p)));
    const filter = $('status-filter').value;
    const data = projects.filter(p => filter === '전체' || p.status === filter);
    const list = $('project-list'); list.replaceChildren();
    if(!data.length) list.append(emptyNode('해당 상태의 저장 항목이 없습니다.')); else data.slice().reverse().forEach(p => list.append(projectRow(p)));
  }

  function emptyNode(msg){ const d=document.createElement('div'); d.className='empty'; d.textContent=msg; return d; }
  function projectRow(p){
    const row = document.createElement('div'); row.className='project-row';
    const info = document.createElement('div');
    const pictureCount=(p.artworks||[]).filter(a=>a&&a.dataUrl).length;
    info.innerHTML = `<h4>${esc(p.title)}</h4><small>${esc(p.owner||'작가 미입력')} · ${esc(templateMeta[p.template]?.label || p.template||'유형 미지정')} · 등록된 이미지 ${pictureCount}장 / 최대 ${templateMeta[p.template]?.limit||3}장</small>`;
    const actions = document.createElement('div'); actions.className='row-actions';
    const tag = document.createElement('span'); tag.className='tag'; tag.textContent = p.status || '기획';
    const edit = document.createElement('button'); edit.type='button'; edit.className='subtle'; edit.textContent='다시 편집'; edit.addEventListener('click', () => fillForm(p));
    const show = document.createElement('button'); show.type='button'; show.className='subtle'; show.textContent='홈페이지 보기'; show.addEventListener('click',()=>{fillForm(p);previewBuiltPage();$('built-preview-box').scrollIntoView({behavior:'smooth',block:'start'});});
    const del = document.createElement('button'); del.type='button'; del.className='danger'; del.textContent='삭제'; del.addEventListener('click', () => { if(confirm('「'+p.title+'」 홈페이지를 삭제할까요?')){mutateProjects(projects.filter(x=>x.id!==p.id));} });
    actions.append(tag, edit, show, del); row.append(info, actions); return row;
  }

  // Self-contained 30-second generative classical-style piece. Music is based on captions, not image vision.
  function musicWidgetHtml(data){
    const moodText=((data.artworks||[]).map(a=>a?.caption||'').join(' ')+' '+(data.summary||'')+' '+(data.title||''));
    const mood=/봄|꽃|햇살|밝|노랑/.test(moodText)?'spring':/밤|달|겨울|고요|눈|그리움/.test(moodText)?'nocturne':/바다|물|강|푸른|파랑/.test(moodText)?'water':'pastoral';
    const labels={spring:'봄의 미뉴에트',nocturne:'달빛 녹턴',water:'물결의 소나티나',pastoral:'숲의 작은 왈츠'};
    return '<section class="block" id="art-music"><h2>작품과 함께 듣는 30초 음악</h2><p>'+esc(labels[mood])+' · 클래식풍 창작 기악곡 (30초)</p><button id="music-play" type="button" style="padding:12px 20px;border:0;border-radius:10px;background:#1f3042;color:white;cursor:pointer">▶ 30초 음악 듣기</button> <button id="music-stop" type="button" style="padding:12px 20px;border:0;border-radius:10px;cursor:pointer">■ 중지</button><p id="music-status" role="status">재생 버튼을 누르면 음악이 시작됩니다.</p></section><script>(function(){var mood='+JSON.stringify(mood)+',AC=window.AudioContext||window.webkitAudioContext,ctx=null,timer=null,voices=[];function stop(){if(timer){clearTimeout(timer);timer=null;}voices.forEach(function(v){try{v.stop();}catch(e){}});voices=[];if(ctx){ctx.close().catch(function(){});ctx=null;}document.getElementById("music-status").textContent="재생이 중지되었습니다.";}function play(){stop();if(!AC){document.getElementById("music-status").textContent="이 브라우저는 오디오를 지원하지 않습니다.";return;}ctx=new AC();var notes=mood==="spring"?[60,64,67,72,69,67,64,62]:mood==="nocturne"?[57,60,64,69,67,64,60,59]:mood==="water"?[62,66,69,74,71,69,66,64]:[60,64,67,69,67,64,62,60];var t=ctx.currentTime+0.1;function tone(note,start,dur,volume,wave){var o=ctx.createOscillator(),g=ctx.createGain();o.type=wave||"sine";o.frequency.value=440*Math.pow(2,(note-69)/12);g.gain.setValueAtTime(0.0001,start);g.gain.exponentialRampToValueAtTime(volume,start+0.08);g.gain.exponentialRampToValueAtTime(0.0001,start+dur);o.connect(g);g.connect(ctx.destination);o.start(start);o.stop(start+dur+0.02);voices.push(o);}for(var i=0;i<60;i++){var n=notes[i%notes.length];tone(n,t+i*0.5,0.46,0.075,"sine");if(i%3===0)tone(notes[(i+2)%notes.length]-12,t+i*0.5,1.4,0.045,"triangle");if(i%6===0)tone(notes[0]-24,t+i*0.5,2.8,0.035,"sine");}document.getElementById("music-status").textContent="재생 중 · 30초";timer=setTimeout(stop,30000);}document.getElementById("music-play").addEventListener("click",play);document.getElementById("music-stop").addEventListener("click",stop);window.addEventListener("pagehide",stop);})();</script>';
  }
  function buildHtmlDocument(data){
    const meta = templateMeta[data.template] || templateMeta.news;
    const artworksHtml = (data.artworks || []).map((a, i) => a?.dataUrl ? `<figure style="display:inline-block;vertical-align:top;width:${meta.limit===6?'30%':'31%'};min-width:160px;margin:1%"><img src="${esc(a.dataUrl)}" alt="작품 ${i+1}" style="width:100%;max-height:360px;object-fit:contain;border-radius:12px"><figcaption style="white-space:pre-wrap;margin-top:10px">${esc(a.caption || '')}</figcaption></figure>` : '').join('');
    const link = data.linkUrl ? `<p><a href="${esc(data.linkUrl)}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:11px 18px;background:#1f3042;color:#fff;border-radius:10px;text-decoration:none">${esc(data.linkTitle || '관련 사이트 열기')}</a></p>` : '';
    const poemArtHtml = data.poemArt?.dataUrl ? `<section><h2>자동 생성 시화</h2><img src="${esc(data.poemArt.dataUrl)}" alt="자동 생성 시화" style="width:100%;max-width:420px;display:block;margin:20px auto"></section>` : '';
    const reviewHtml = meta.showReview ? `<section><h2>전체 작품 평론</h2><article style="white-space:pre-wrap">${esc(data.review || '')}</article></section>` : '';
    return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(data.title)}</title><meta name="description" content="${esc((data.summary || '').slice(0,150))}"><style>*{box-sizing:border-box}body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Malgun Gothic",sans-serif;background:#faf8f3;color:#223143;line-height:1.75}header,footer{background:#1f3042;color:#fff;padding:20px 6%}header{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap}nav{display:flex;flex-wrap:wrap;gap:14px}nav a{color:#fff;text-decoration:none;padding:6px}nav a:hover,nav a:focus-visible{text-decoration:underline}section[id]{scroll-margin-top:20px}main{max-width:1100px;margin:auto;padding:48px 6%}h1{font-size:clamp(30px,5vw,56px)}article{white-space:pre-wrap;background:#fff;border-radius:16px;padding:20px;border:1px solid #ece7de}img{display:block}.hero{padding:22px 0 30px}.block{margin:26px 0}small.top{color:#8a7f6a}</style></head><body><header><strong>明道 · 명도재 아트웹</strong><nav aria-label="홈페이지 상단 메뉴"><a href="#works-intro">작품 소개</a><a href="#works-bio">작가 약력</a><a href="#works-contact">문의</a></nav></header><main><section class="hero"><small class="top">${esc(meta.label)}</small><h1>${esc(data.title)}</h1><p>${esc(data.subtitle || '')}</p><p><strong>${esc(data.owner)}</strong></p></section><section class="block" id="works-intro"><h2>작품 소개</h2><article>${esc(data.summary || '')}</article></section>${link}<section class="block"><h2>${esc(meta.kind==='art'?'전시 소개':'본문')}</h2><article>${esc(data.mainText || '')}</article></section><section class="block"><h2>${esc(meta.kind==='art'?'작품':'그림 · 작품')}</h2>${artworksHtml || '<p>등록된 작품이 없습니다.</p>'}</section>${reviewHtml}${poemArtHtml}${musicWidgetHtml(data)}<section class="block" id="works-bio"><h2>작가 약력</h2><article>${esc(data.biography || "작가 약력을 준비하고 있습니다.")}</article></section><section class="block" id="works-contact"><h2>문의</h2><article>${esc(data.contact || "문의 정보를 준비하고 있습니다.")}</article></section></main><footer>명도재 문화예술 홈페이지 제작소 · 시안</footer></body></html>`;
  }

  function previewBuiltPage(){
    const data = collectFormData();
    const html = buildHtmlDocument(data);
    $('built-preview').srcdoc = html;
    $('built-preview-box').hidden = false;
    $('form-feedback').textContent = '생성된 홈페이지 미리보기를 확인하세요.';
  }

  function downloadSite(){
    const data = collectFormData();
    const html = buildHtmlDocument(data);
    const blob = new Blob([html], {type:'text/html;charset=utf-8'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = (data.title || 'myeongdo-artweb') + '.html'; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function exportJson(){
    const blob = new Blob([JSON.stringify(projects, null, 2)], {type:'application/json'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'myeongdo-artweb-data.json'; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function downloadManuscript(){
    if(!manuscript) return;
    const href = manuscript.dataUrl || 'data:text/plain;charset=utf-8,' + encodeURIComponent(manuscript.text || '');
    const a = document.createElement('a'); a.href = href; a.download = manuscript.name || 'manuscript'; document.body.append(a); a.click(); a.remove();
  }

  // Events
  document.querySelectorAll('[data-view]').forEach(btn => btn.addEventListener('click', () => view(btn.dataset.view)));
  $('new-project-btn').addEventListener('click', () => { clearForm(); view('create'); });
  $('template').addEventListener('change', applyTemplateMode);
  $('clear-form').addEventListener('click', clearForm);
  $('status-filter').addEventListener('change', renderProjectLists);
  $('export-json').addEventListener('click', exportJson);
  $('reset-samples').addEventListener('click', () => { if(confirm('저장한 모든 홈페이지를 삭제하고 기본 예시 2개로 초기화할까요? 이 작업은 되돌릴 수 없습니다.')){ mutateProjects(structuredClone(SAMPLE_PROJECTS)); $('status-filter').value='전체'; renderProjectLists(); } });
  $('auto-critique').addEventListener('click', () => { const result=generateCritiqueText(); if(!result)return; $('overall-review').value = result; renderPreview(); $('form-feedback').textContent = '입력된 작품 설명을 바탕으로 약 200자의 평론 초안이 작성됐습니다. 이미지 자체를 판독한 AI 평론은 아닙니다.'; });
  $('generate-poem-art').addEventListener('click', () => { const result = generatePoemArtSvg(); if(result){ renderPoemArt(); $('form-feedback').textContent = '9:16 수채화풍 시화가 생성되었습니다.'; } });
  $('download-poem-art').addEventListener('click', () => { if(!poemArt){ alert('먼저 시화를 생성하세요.'); return; } const a=document.createElement('a'); a.href='data:image/svg+xml;charset=utf-8,' + encodeURIComponent(poemArt.svg); a.download = (($('title').value.trim() || 'poem-art') + '.svg'); document.body.append(a); a.click(); a.remove(); });
  $('remove-poem-art').addEventListener('click', () => { poemArt = null; renderPoemArt(); renderPreview(); $('form-feedback').textContent = '생성된 시화가 삭제되었습니다.'; });
  $('preview-site-btn').addEventListener('click', previewBuiltPage);
  $('download-site').addEventListener('click', downloadSite);
  $('download-manuscript').addEventListener('click', downloadManuscript);
  $('remove-manuscript').addEventListener('click', () => { manuscript = null; $('manuscript-file').value=''; renderManuscript(); $('form-feedback').textContent = '원고 파일이 삭제되었습니다.'; });
  $('manuscript-file').addEventListener('change', async (e) => {
    const file = e.target.files[0]; if(!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if(!['jpg','jpeg','hwp','txt'].includes(ext) || file.size > 800*1024){ alert('JPG · HWP · TXT 파일만 가능하며 800KB 이하여야 합니다.'); e.target.value=''; return; }
    const kind = ext === 'jpeg' ? 'jpg' : ext;
    const dataUrl = await fileToDataUrl(file);
    manuscript = {name:file.name, kind, dataUrl, text:''};
    if(kind === 'txt'){
      const text = await file.text(); manuscript.text = text; $('main-text').value = text.slice(0, 16000);
    }
    renderManuscript(); renderPreview(); $('form-feedback').textContent = '원고 파일이 불러와졌습니다.';
  });

  ['title','owner','subtitle','biography','contact','summary','main-text','overall-review','link-title','link-url','status'].forEach(id => $(id).addEventListener('input', renderPreview));
  $('link-url').addEventListener('change', renderPreview);
  $('project-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if(!$('title').value.trim() || !$('owner').value.trim()){ alert('홈페이지 제목과 작가·단체명을 입력하세요.'); return; }
    const data = collectFormData();
    const index = projects.findIndex(p => p.id === data.id);
    const next=projects.slice();if(index >= 0) next[index]=data; else next.push(data);
    if(mutateProjects(next)){clearForm();$('status-filter').value='전체';renderProjectLists();view('projects');}
  });

  // Init
  applyTemplateMode();
  renderManuscript();
  renderPoemArt();
  renderPreview();
  renderProjectLists();
  view(location.hash.replace('#','') || 'dashboard');
})();