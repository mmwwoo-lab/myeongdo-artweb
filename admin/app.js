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
    // 상단 메뉴는 고정된 실제 앵커 링크이므로 삭제된 preview-nav를 참조하지 않습니다.
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
        if(!['image/jpeg','image/png','image/webp'].includes(file.type)){alert('JPG·PNG·WebP 이미지만 가능합니다.');fileInput.value='';return;}
        let dataUrl;try{dataUrl=await compressedArtworkData(file);}catch(err){alert('이미지 변환 실패: '+(err.message||'알 수 없는 오류'));fileInput.value='';return;}
        artworks[i] = {...artworks[i], dataUrl, name:file.name, caption:caption.value || artworks[i].caption || ''};
        updateUploadPreview(i); renderPreview();
        $('form-feedback').textContent = `작품 ${i+1} 이미지가 등록되었습니다. 큰 파일은 자동으로 360KB 이내로 축소·압축합니다.`;
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

  // Resize oversized photos before saving; the original is never modified.
  async function compressedArtworkData(file){
    const LIMIT=360*1024, MAX_EDGE=1400;
    if(file.size<=LIMIT)return fileToDataUrl(file);
    const source=await fileToDataUrl(file);
    const img=new Image();
    await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(new Error('이미지 열기 실패'));img.src=source;});
    const canvas=document.createElement('canvas');
    const scale=Math.min(1,MAX_EDGE/Math.max(img.naturalWidth,img.naturalHeight));
    let w=Math.max(1,Math.round(img.naturalWidth*scale)),hh=Math.max(1,Math.round(img.naturalHeight*scale));
    for(let shrink=0;shrink<5;shrink++){
      canvas.width=w;canvas.height=hh;
      const ctx=canvas.getContext('2d');
      if(!ctx)throw new Error('이미지 처리 불가');
      ctx.fillStyle='#ffffff';ctx.fillRect(0,0,w,hh);ctx.drawImage(img,0,0,w,hh);
      for(const q of [0.84,0.72,0.60,0.48,0.35]){
        const result=canvas.toDataURL('image/jpeg',q);
        if(Math.ceil((result.length-result.indexOf(',')-1)*3/4)<=LIMIT)return result;
      }
      w=Math.max(1,Math.round(w*0.78));hh=Math.max(1,Math.round(hh*0.78));
    }
    throw new Error('360KB 이하 압축 불가');
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
    const rawText = $('main-text').value.trim() || $('summary').value.trim() || '';
    const text = rawText.replace(/\s+/g,' ').trim();
    if(!text){ alert('시 내용 또는 본문 글을 먼저 입력하세요.'); return null; }
    const motifs = extractPoemMotifs(text);
    const scene = choosePoemScene(text, motifs);
    const size = scene.orientation === 'landscape' ? {width: 1600, height: 1000} : {width: 1000, height: 1600};
    const textLines = wrapTextForSvg(rawText.slice(0, 260), scene.orientation === 'landscape' ? 22 : 14).slice(0, scene.orientation === 'landscape' ? 8 : 12);
    const illustration = buildPoemIllustration(scene, size.width, size.height);
    const textPanel = buildPoemTextPanel({title, owner, lines: textLines, scene, width: size.width, height: size.height});
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}" viewBox="0 0 ${size.width} ${size.height}">
  <defs>
    <linearGradient id="wash" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${scene.palette[0]}"/>
      <stop offset="55%" stop-color="${scene.palette[1]}"/>
      <stop offset="100%" stop-color="${scene.palette[2]}"/>
    </linearGradient>
    <filter id="soft-blur"><feGaussianBlur stdDeviation="24"/></filter>
    <filter id="paper"><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 0.025"/></feComponentTransfer></filter>
  </defs>
  <rect width="100%" height="100%" fill="#fbf8f1"/>
  <rect x="24" y="24" width="${size.width-48}" height="${size.height-48}" rx="28" fill="url(#wash)" opacity="0.34"/>
  <rect x="0" y="0" width="100%" height="100%" filter="url(#paper)" opacity="0.8"/>
  ${illustration}
  ${textPanel}
  <rect x="${size.width-125}" y="${size.height-125}" width="90" height="90" rx="10" fill="#b91c1c"/>
  <text x="${size.width-102}" y="${size.height-67}" font-size="34" fill="#fff" font-weight="700">明道</text>
</svg>`;
    const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    poemArt = {svg, dataUrl, createdAt: new Date().toISOString(), orientation: scene.orientation, ratio: `${size.width}:${size.height}`};
    return poemArt;
  }

  function extractPoemMotifs(text){
    const dictionary = [
      {word:'달',scene:'moon',icon:'☾',color:['#f7e8bf','#e5d4f1','#d7e2f2'],caption:'달빛이 머무는 서정',analysis1:'달빛 이미지는 시 속의 고요와 그리움을 길게 끌어간다.',analysis2:'밝음보다 여운이 먼저 도착하는 정서가 수채화처럼 번진다.'},
      {word:'꽃',scene:'flower',icon:'✿',color:['#f8d5de','#f8ebc9','#d7ece1'],caption:'꽃의 이미지가 피어나는 시심',analysis1:'꽃의 이미지는 화자의 감정을 섬세하게 열어 보인다.',analysis2:'계절의 순간을 붙드는 따뜻한 시선이 화면 전체를 감싼다.'},
      {word:'가을',scene:'autumn',icon:'🍁',color:['#f0c2a3','#d7b08f','#f8e8d6'],caption:'가을빛이 스미는 정조',analysis1:'가을의 색조가 시간의 깊이와 기억의 결을 함께 드러낸다.',analysis2:'사라짐과 머묾이 한 장면 안에서 조용히 공존한다.'},
      {word:'바다',scene:'sea',icon:'〰',color:['#c9e5ef','#a5d7e5','#dff3f8'],caption:'물결처럼 확장되는 시선',analysis1:'바다의 이미지는 감정의 폭과 리듬을 넓게 열어 준다.',analysis2:'파동처럼 반복되는 언어가 사유의 깊이를 만든다.'},
      {word:'강',scene:'river',icon:'〰',color:['#d2e8ef','#b6d7e0','#e8f6f8'],caption:'물의 흐름을 닮은 사유',analysis1:'강물의 흐름은 시간과 기억의 움직임을 은유한다.',analysis2:'유연한 리듬이 화면 전체에 잔잔한 깊이를 만든다.'},
      {word:'산',scene:'mountain',icon:'⛰',color:['#d1dfc8','#dce8d3','#eff5e7'],caption:'산의 침묵을 닮은 여백',analysis1:'산의 이미지는 묵직한 안정감과 사유의 높이를 암시한다.',analysis2:'단단한 풍경 속에서 화자의 호흡이 천천히 깊어진다.'},
      {word:'비',scene:'rain',icon:'☔',color:['#d7dde8','#c5d2e6','#e9eef7'],caption:'빗결이 적시는 정서',analysis1:'비의 이미지는 감정의 세밀한 파동과 내면의 밀도를 높인다.',analysis2:'젖어드는 장면마다 언어의 온도가 차분하게 살아난다.'},
      {word:'나무',scene:'tree',icon:'❀',color:['#d9ead2','#edf4e9','#dce8ef'],caption:'나무 곁에 머무는 서정',analysis1:'나무의 형상은 견딤과 성장의 시간을 상징한다.',analysis2:'정적인 풍경 속에 살아 있는 숨결이 천천히 스민다.'},
      {word:'새',scene:'bird',icon:'✧',color:['#e8def6','#f1eacd','#dceaf4'],caption:'날아오르는 시선의 이미지',analysis1:'새의 이미지는 자유와 이동, 기다림의 정서를 동시에 품는다.',analysis2:'가벼운 선율처럼 화면에 맑은 움직임이 생긴다.'}
    ];
    const found = dictionary.find(item => text.includes(item.word)) || {scene:'abstract',icon:'✧', color:['#eadfc9','#dce9ef','#f4e6ea'],caption:'수채로 번지는 시의 여운',analysis1:'시의 핵심 이미지는 감정의 결을 부드럽게 펼쳐 보인다.',analysis2:'화자의 시선은 여백 속에 머무르며 서정의 호흡을 만든다.'};
    const icons = [found.icon, '✧', '❀'];
    return {scene:found.scene, palette:found.color, icons, caption:found.caption, analysis1:found.analysis1, analysis2:found.analysis2};
  }

  function choosePoemScene(text, motifs){
    const wideHints = /바다|강|산|하늘|들|길|평야|구름|노을|수평선|벌판/;
    const tallHints = /꽃|달|비|나무|창|별|등불|눈물|얼굴|새/;
    const orientation = wideHints.test(text) ? 'landscape' : tallHints.test(text) ? 'portrait' : text.length > 180 ? 'portrait' : 'landscape';
    return {
      ...motifs,
      orientation,
      scene: motifs.scene,
      titleLabel: orientation === 'landscape' ? '삽화형 가로 시화' : '삽화형 세로 시화'
    };
  }

  function buildPoemIllustration(scene, width, height){
    const p = scene.palette;
    const moodDots = scene.icons.map((icon, idx)=>`<text x="${width*0.12 + idx*width*0.11}" y="${height*0.18 + (idx%2)*height*0.05}" font-size="${Math.round(width*0.04)}" fill="rgba(60,72,88,.14)">${esc(icon)}</text>`).join('');
    const baseWash = `
      <circle cx="${width*0.22}" cy="${height*0.2}" r="${width*0.13}" fill="${p[0]}" opacity="0.48" filter="url(#soft-blur)"/>
      <circle cx="${width*0.72}" cy="${height*0.3}" r="${width*0.15}" fill="${p[1]}" opacity="0.33" filter="url(#soft-blur)"/>
      <circle cx="${width*0.52}" cy="${height*0.76}" r="${width*0.18}" fill="${p[2]}" opacity="0.28" filter="url(#soft-blur)"/>
      ${moodDots}`;
    const scenes = {
      mountain:`${baseWash}
        <circle cx="${width*0.78}" cy="${height*0.18}" r="${width*0.05}" fill="#f5ebc4" opacity="0.9"/>
        <path d="M0 ${height*0.58} C ${width*0.12} ${height*0.48}, ${width*0.25} ${height*0.46}, ${width*0.38} ${height*0.56} C ${width*0.48} ${height*0.42}, ${width*0.58} ${height*0.39}, ${width*0.73} ${height*0.58} C ${width*0.82} ${height*0.46}, ${width*0.92} ${height*0.5}, ${width} ${height*0.45} L ${width} ${height} L 0 ${height} Z" fill="#758c78" opacity="0.62"/>
        <path d="M0 ${height*0.68} C ${width*0.16} ${height*0.62}, ${width*0.32} ${height*0.57}, ${width*0.5} ${height*0.7} C ${width*0.66} ${height*0.58}, ${width*0.83} ${height*0.64}, ${width} ${height*0.57} L ${width} ${height} L 0 ${height} Z" fill="#90a38d" opacity="0.58"/>
        <path d="M0 ${height*0.78} C ${width*0.22} ${height*0.74}, ${width*0.48} ${height*0.72}, ${width} ${height*0.77} L ${width} ${height} L 0 ${height} Z" fill="#d9d1b8" opacity="0.7"/>`,
      sea:`${baseWash}
        <circle cx="${width*0.77}" cy="${height*0.18}" r="${width*0.055}" fill="#f6e8b2" opacity="0.92"/>
        <rect x="0" y="${height*0.57}" width="${width}" height="${height*0.43}" fill="#9fd1de" opacity="0.45"/>
        <path d="M0 ${height*0.62} Q ${width*0.1} ${height*0.58}, ${width*0.2} ${height*0.62} T ${width*0.4} ${height*0.62} T ${width*0.6} ${height*0.62} T ${width*0.8} ${height*0.62} T ${width} ${height*0.62}" stroke="#5d8fa4" stroke-width="6" fill="none" opacity="0.55"/>
        <path d="M0 ${height*0.7} Q ${width*0.1} ${height*0.66}, ${width*0.2} ${height*0.7} T ${width*0.4} ${height*0.7} T ${width*0.6} ${height*0.7} T ${width*0.8} ${height*0.7} T ${width} ${height*0.7}" stroke="#6fa0b5" stroke-width="8" fill="none" opacity="0.48"/>
        <path d="M${width*0.22} ${height*0.58} l${width*0.03} ${-height*0.09} l${width*0.04} ${height*0.08} z" fill="#b97256" opacity="0.75"/>
        <path d="M${width*0.246} ${height*0.49} l0 ${height*0.09}" stroke="#7c5c48" stroke-width="3"/>
        <path d="M${width*0.246} ${height*0.495} q${width*0.05} ${height*0.035} 0 ${height*0.07} z" fill="rgba(255,255,255,.72)"/>`,
      river:`${baseWash}
        <path d="M${width*0.28} ${height*0.04} C ${width*0.42} ${height*0.18}, ${width*0.55} ${height*0.34}, ${width*0.49} ${height*0.54} C ${width*0.43} ${height*0.72}, ${width*0.57} ${height*0.84}, ${width*0.66} ${height} L ${width} ${height} L ${width} ${height*0.72} C ${width*0.86} ${height*0.62}, ${width*0.73} ${height*0.48}, ${width*0.7} ${height*0.28} C ${width*0.68} ${height*0.16}, ${width*0.58} ${height*0.08}, ${width*0.45} 0 Z" fill="#b8dce4" opacity="0.76"/>
        <path d="M0 ${height*0.72} C ${width*0.18} ${height*0.58}, ${width*0.36} ${height*0.58}, ${width*0.58} ${height*0.72} L 0 ${height} Z" fill="#b4c7a4" opacity="0.6"/>
        <path d="M${width*0.52} ${height*0.77} C ${width*0.66} ${height*0.72}, ${width*0.84} ${height*0.74}, ${width} ${height*0.66} L ${width} ${height} L ${width*0.68} ${height} Z" fill="#c8d7bf" opacity="0.65"/>
        <path d="M${width*0.2} ${height*0.15} q${width*0.06} ${-height*0.08} ${width*0.12} 0" stroke="#6a7f57" stroke-width="6" fill="none" opacity="0.5"/>`,
      flower:`${baseWash}
        <ellipse cx="${width*0.32}" cy="${height*0.72}" rx="${width*0.13}" ry="${height*0.18}" fill="#f6d9e3" opacity="0.42"/>
        <ellipse cx="${width*0.68}" cy="${height*0.68}" rx="${width*0.16}" ry="${height*0.2}" fill="#d5efe0" opacity="0.38"/>
        <path d="M0 ${height*0.86} C ${width*0.2} ${height*0.8}, ${width*0.38} ${height*0.82}, ${width*0.56} ${height*0.86} C ${width*0.74} ${height*0.81}, ${width*0.86} ${height*0.82}, ${width} ${height*0.78} L ${width} ${height} L 0 ${height} Z" fill="#b5cda8" opacity="0.55"/>
        ${Array.from({length:5}, (_,i)=>{
          const x = width*(0.18 + i*0.14);
          const y = height*(0.68 + (i%2)*0.04);
          return `<g><path d="M${x} ${height*0.87} Q ${x+10} ${height*0.78}, ${x} ${y}" stroke="#6d9165" stroke-width="4" fill="none"/><circle cx="${x}" cy="${y}" r="${width*0.025}" fill="#f8b9c8" opacity="0.92"/><circle cx="${x-width*0.018}" cy="${y+width*0.008}" r="${width*0.018}" fill="#ffe2ec" opacity="0.9"/><circle cx="${x+width*0.018}" cy="${y+width*0.008}" r="${width*0.018}" fill="#ffd8e8" opacity="0.9"/></g>`;
        }).join('')}`,
      autumn:`${baseWash}
        <path d="M0 ${height*0.78} C ${width*0.22} ${height*0.7}, ${width*0.46} ${height*0.72}, ${width*0.64} ${height*0.82} C ${width*0.8} ${height*0.76}, ${width*0.92} ${height*0.78}, ${width} ${height*0.74} L ${width} ${height} L 0 ${height} Z" fill="#c5a27c" opacity="0.56"/>
        <path d="M${width*0.18} ${height*0.84} q${width*0.06} ${-height*0.28} ${width*0.12} ${-height*0.48}" stroke="#7a5c3e" stroke-width="10" fill="none" opacity="0.7"/>
        ${Array.from({length:9},(_,i)=>`<path d="M${width*(0.18+i*0.07)} ${height*(0.3+(i%3)*0.08)} q10 -18 20 0 q-10 22 -20 0" fill="#d98550" opacity="0.78" transform="rotate(${i*16} ${width*(0.18+i*0.07)} ${height*(0.3+(i%3)*0.08)})"/>`).join('')}`,
      rain:`${baseWash}
        <rect x="0" y="${height*0.68}" width="${width}" height="${height*0.32}" fill="#dce5ef" opacity="0.34"/>
        ${Array.from({length:42},(_,i)=>`<line x1="${(i*37)%width}" y1="${height*0.14 + (i%6)*40}" x2="${(i*37)%width - width*0.03}" y2="${height*0.24 + (i%6)*40}" stroke="#8299b6" stroke-width="3" opacity="0.38"/>`).join('')}
        <path d="M${width*0.52} ${height*0.82} q${width*0.12} ${-height*0.18} ${width*0.24} 0" stroke="#7a5866" stroke-width="8" fill="none"/>
        <path d="M${width*0.44} ${height*0.72} q${width*0.08} ${-height*0.1} ${width*0.16} 0 q${width*0.08} ${height*0.1} ${width*0.16} 0" fill="#9d6f7e" opacity="0.74"/>`,
      moon:`${baseWash}
        <circle cx="${width*0.72}" cy="${height*0.22}" r="${width*0.08}" fill="#fbf0c7" opacity="0.95"/>
        <circle cx="${width*0.75}" cy="${height*0.2}" r="${width*0.08}" fill="rgba(251,248,241,0.84)"/>
        <path d="M0 ${height*0.72} C ${width*0.18} ${height*0.66}, ${width*0.33} ${height*0.64}, ${width*0.48} ${height*0.72} C ${width*0.58} ${height*0.64}, ${width*0.74} ${height*0.63}, ${width} ${height*0.66} L ${width} ${height} L 0 ${height} Z" fill="#74809b" opacity="0.62"/>
        <path d="M0 ${height*0.82} C ${width*0.24} ${height*0.78}, ${width*0.52} ${height*0.76}, ${width} ${height*0.84} L ${width} ${height} L 0 ${height} Z" fill="#9099b3" opacity="0.4"/>
        ${Array.from({length:14},(_,i)=>`<circle cx="${(i*71)%width}" cy="${height*0.12 + (i%5)*28}" r="2.5" fill="#fff" opacity="0.75"/>`).join('')}`,
      tree:`${baseWash}
        <path d="M${width*0.34} ${height} C ${width*0.36} ${height*0.84}, ${width*0.38} ${height*0.68}, ${width*0.42} ${height*0.48}" stroke="#7c5b43" stroke-width="20" fill="none" opacity="0.7"/>
        <ellipse cx="${width*0.45}" cy="${height*0.38}" rx="${width*0.18}" ry="${height*0.16}" fill="#b8d8b3" opacity="0.68"/>
        <ellipse cx="${width*0.56}" cy="${height*0.34}" rx="${width*0.16}" ry="${height*0.14}" fill="#d6ebcc" opacity="0.54"/>
        <path d="M0 ${height*0.84} C ${width*0.26} ${height*0.8}, ${width*0.58} ${height*0.82}, ${width} ${height*0.78} L ${width} ${height} L 0 ${height} Z" fill="#cfd7bb" opacity="0.45"/>
        ${Array.from({length:8},(_,i)=>`<path d="M${width*(0.18+i*0.08)} ${height*(0.76+(i%2)*0.02)} q10 -18 20 0 q-10 18 -20 0" fill="#9cc7a2" opacity="0.72"/>`).join('')}`,
      bird:`${baseWash}
        <path d="M0 ${height*0.8} C ${width*0.18} ${height*0.74}, ${width*0.42} ${height*0.77}, ${width} ${height*0.7} L ${width} ${height} L 0 ${height} Z" fill="#d9e2d4" opacity="0.48"/>
        ${Array.from({length:6},(_,i)=>`<path d="M${width*(0.18+i*0.12)} ${height*(0.32+(i%3)*0.05)} q${width*0.02} -${height*0.03} ${width*0.04} 0 q-${width*0.02} ${height*0.02} -${width*0.04} 0" stroke="#617189" stroke-width="4" fill="none"/>`).join('')}`,
      abstract:`${baseWash}
        <path d="M0 ${height*0.76} C ${width*0.14} ${height*0.68}, ${width*0.3} ${height*0.72}, ${width*0.42} ${height*0.8} C ${width*0.58} ${height*0.66}, ${width*0.74} ${height*0.64}, ${width} ${height*0.74} L ${width} ${height} L 0 ${height} Z" fill="#c6d2d8" opacity="0.5"/>`
    };
    return scenes[scene.scene] || scenes.abstract;
  }

  function buildPoemTextPanel({title, owner, lines, scene, width, height}){
    const portrait = scene.orientation === 'portrait';
    const panelW = portrait ? width*0.76 : width*0.42;
    const panelH = portrait ? height*0.44 : height*0.66;
    const x = portrait ? width*0.12 : width*0.53;
    const y = portrait ? height*0.5 : height*0.18;
    const titleSize = portrait ? 54 : 48;
    const bodySize = portrait ? 28 : 24;
    const lineGap = portrait ? 44 : 38;
    const textY = y + 170;
    const poemLines = lines.map((line, idx)=>`<text x="${x+34}" y="${textY + idx*lineGap}" font-size="${bodySize}" fill="#243447">${esc(line)}</text>`).join('');
    return `
      <rect x="${x}" y="${y}" width="${panelW}" height="${panelH}" rx="24" fill="rgba(255,255,255,0.65)" stroke="rgba(42,60,80,0.08)"/>
      <text x="${x+34}" y="${y+44}" font-size="24" fill="#6b7280">${scene.titleLabel}</text>
      <text x="${x+34}" y="${y+104}" font-size="${titleSize}" font-weight="700" fill="#1f2f3f">${esc(title)}</text>
      <text x="${x+34}" y="${y+144}" font-size="26" fill="#536171">${esc(owner)}</text>
      ${poemLines}
      <text x="${x+34}" y="${y+panelH-76}" font-size="24" fill="#8a5757">${esc(scene.caption)}</text>
      <text x="${x+34}" y="${y+panelH-40}" font-size="22" fill="#38485a">${esc(scene.analysis1)}</text>`;
  }

  function wrapTextForSvg(text, wordsPerLine){
    const normalized = text.replace(/\r/g,'').split(/\n+/).map(v=>v.trim()).filter(Boolean).join(' ');
    const words = normalized.split(/\s+/);
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
  // Generate original 30-second tonal pieces in the browser, without external copyrighted recordings.
  function artworkMood(text){
    return /봄|꽃|햇살|밝|노랑/.test(text)?'spring':/밤|달|겨울|고요|눈|그리움/.test(text)?'nocturne':/바다|물|강|푸른|파랑/.test(text)?'water':'pastoral';
  }
  function musicPlayerHtml(item,index,summary){
    const mood=artworkMood((item.caption||'')+' '+summary);
    const title={spring:'봄의 미뉴에트',nocturne:'달빛 녹턴',water:'물결의 소나티나',pastoral:'숲의 작은 왈츠'}[mood];
    return '<div class="music-player" style="margin:12px 0;padding:12px;border:1px solid #e5e1d8;border-radius:12px;background:#faf8f3"><div style="font-size:13px;margin-bottom:6px">🎻 '+title+' · 서양 클래식풍 창작곡 30초</div><button type="button" class="music-start" style="padding:7px 12px;margin-bottom:8px;border-radius:8px;border:0;background:#24384e;color:#fff;cursor:pointer">♫ 음악 생성·듣기</button><audio controls preload="none" data-classic-mood="'+mood+'" data-work="'+index+'" style="display:block;width:100%;max-width:100%"></audio><small style="color:#665">▶ 버튼을 누르면 생성·재생됩니다. 진행바·음량 조절 가능</small></div>';
  }
  function musicRuntime(){
    return `<script>(function(){
      var players=Array.from(document.querySelectorAll('audio[data-classic-mood]'));
      function renderWav(mood,work){
        var rate=16000,seconds=30,count=rate*seconds,out=new Int16Array(count);
        var motif={spring:[60,64,67,72,69,67,64,62],nocturne:[57,60,64,69,67,64,60,59],water:[62,66,69,74,71,69,66,64],pastoral:[60,64,67,69,67,64,62,60]}[mood]||[60,64,67,72];
        var shift=(work%4)*2, tempo=mood==='nocturne'?0.75:0.5;
        function addTone(note,start,duration,vol){
          var freq=440*Math.pow(2,(note+shift-69)/12),begin=Math.round(start*rate),end=Math.min(count,Math.round((start+duration)*rate));
          for(var i=begin;i<end;i++){
            var t=(i-begin)/rate,env=Math.min(1,t/0.06)*Math.min(1,(duration-t)/0.14),v=Math.sin(2*Math.PI*freq*t)*0.65+Math.sin(2*Math.PI*freq*2*t)*0.16;
            out[i]=Math.max(-32767,Math.min(32767,out[i]+v*env*vol*32767));
          }
        }
        for(var step=0;step<Math.ceil(seconds/tempo);step++){
          var at=step*tempo,n=motif[(step+work)%motif.length],dur=Math.min(tempo*0.92,seconds-at);
          addTone(n,at,dur,0.17);
          if(step%4===0){addTone(motif[0]-12,at,Math.min(tempo*3.8,seconds-at),0.09);addTone(motif[2]-12,at,Math.min(tempo*3.8,seconds-at),0.055);}
        }
        var buf=new ArrayBuffer(44+count*2),v=new DataView(buf);
        function word(i,n){v.setUint32(i,n,true);}function short(i,n){v.setUint16(i,n,true);}
        function tag(i,t){for(var k=0;k<t.length;k++)v.setUint8(i+k,t.charCodeAt(k));}
        tag(0,'RIFF');word(4,36+count*2);tag(8,'WAVE');tag(12,'fmt ');word(16,16);short(20,1);short(22,1);
        word(24,rate);word(28,rate*2);short(32,2);short(34,16);tag(36,'data');word(40,count*2);
        for(var j=0;j<count;j++)v.setInt16(44+j*2,out[j],true);
        return URL.createObjectURL(new Blob([buf],{type:'audio/wav'}));
      }
      players.forEach(function(p){var creating=false;var btn=p.parentNode.querySelector('.music-start');if(btn)btn.addEventListener('click',function(){if(!p.src){p.src=renderWav(p.dataset.classicMood,Number(p.dataset.work)||0);p.load();}p.play().catch(function(e){console.error(e);});});
        p.addEventListener('play',function(){players.forEach(function(other){if(other!==p)other.pause();});});
        p.addEventListener('pointerdown',function(){if(p.src||creating)return;creating=true;
          try{p.src=renderWav(p.dataset.classicMood,Number(p.dataset.work)||0);p.load();}
          catch(e){console.error(e);}
          creating=false;
        });
        p.addEventListener('keydown',function(e){if(!p.src&&(e.key==='Enter'||e.key===' ')){p.src=renderWav(p.dataset.classicMood,Number(p.dataset.work)||0);p.load();}});
      });
      window.addEventListener('pagehide',function(){players.forEach(function(p){if(p.src&&p.src.startsWith('blob:'))URL.revokeObjectURL(p.src);});});
    })();<\/script>`;
  }
  function buildHtmlDocument(data){
    const meta = templateMeta[data.template] || templateMeta.news;
    const artworksHtml = (data.artworks || []).map((a, i) => a?.dataUrl ? `<figure style="display:inline-block;vertical-align:top;width:${meta.limit===6?'30%':'31%'};min-width:180px;margin:1%"><img src="${esc(a.dataUrl)}" alt="작품 ${i+1}" style="width:100%;max-height:360px;object-fit:contain;border-radius:12px"><figcaption style="white-space:pre-wrap;margin-top:10px">${esc(a.caption || '')}</figcaption>${musicPlayerHtml(a,i,data.summary||'')}</figure>` : '').join('');
    const link = data.linkUrl ? `<p><a href="${esc(data.linkUrl)}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:11px 18px;background:#1f3042;color:#fff;border-radius:10px;text-decoration:none">${esc(data.linkTitle || '관련 사이트 열기')}</a></p>` : '';
    const poemArtHtml = data.poemArt?.dataUrl ? `<section><h2>자동 생성 시화</h2><img src="${esc(data.poemArt.dataUrl)}" alt="자동 생성 시화" style="width:100%;max-width:420px;display:block;margin:20px auto"></section>` : '';
    const reviewHtml = meta.showReview ? `<section><h2>전체 작품 평론</h2><article style="white-space:pre-wrap">${esc(data.review || '')}</article></section>` : '';
    return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(data.title)}</title><meta name="description" content="${esc((data.summary || '').slice(0,150))}"><style>*{box-sizing:border-box}body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Malgun Gothic",sans-serif;background:#faf8f3;color:#223143;line-height:1.75}header,footer{background:#1f3042;color:#fff;padding:20px 6%}header{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap}nav{display:flex;flex-wrap:wrap;gap:14px}nav a{color:#fff;text-decoration:none;padding:6px}nav a:hover,nav a:focus-visible{text-decoration:underline}section[id]{scroll-margin-top:20px}main{max-width:1100px;margin:auto;padding:48px 6%}h1{font-size:clamp(30px,5vw,56px)}article{white-space:pre-wrap;background:#fff;border-radius:16px;padding:20px;border:1px solid #ece7de}img{display:block}.hero{padding:22px 0 30px}.block{margin:26px 0}small.top{color:#8a7f6a}</style></head><body><header><strong>明道 · 명도재 아트웹</strong><nav aria-label="홈페이지 상단 메뉴"><a href="#works-intro">작품 소개</a><a href="#works-bio">작가 약력</a><a href="#works-contact">문의</a></nav></header><main><section class="hero"><small class="top">${esc(meta.label)}</small><h1>${esc(data.title)}</h1><p>${esc(data.subtitle || '')}</p><p><strong>${esc(data.owner)}</strong></p></section><section class="block" id="works-intro"><h2>작품 소개</h2><article>${esc(data.summary || '')}</article></section>${link}<section class="block"><h2>${esc(meta.kind==='art'?'전시 소개':'본문')}</h2><article>${esc(data.mainText || '')}</article></section><section class="block"><h2>${esc(meta.kind==='art'?'작품':'그림 · 작품')}</h2>${artworksHtml || '<p>등록된 작품이 없습니다.</p>'}</section>${reviewHtml}${poemArtHtml}<section class="block" id="works-bio"><h2>작가 약력</h2><article>${esc(data.biography || "작가 약력을 준비하고 있습니다.")}</article></section><section class="block" id="works-contact"><h2>문의</h2><article>${esc(data.contact || "문의 정보를 준비하고 있습니다.")}</article></section></main><footer>명도재 문화예술 홈페이지 제작소 · 시안</footer>${musicRuntime()}</body></html>`;
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
  window.addEventListener('hashchange',()=>{const name=location.hash.slice(1);if(headings[name])view(name);});
  $('new-project-btn').addEventListener('click', () => { clearForm(); view('create'); });
  $('template').addEventListener('change', applyTemplateMode);
  $('clear-form').addEventListener('click', clearForm);
  $('status-filter').addEventListener('change', renderProjectLists);
  $('export-json').addEventListener('click', exportJson);
  $('reset-samples').addEventListener('click', () => { if(confirm('저장한 모든 홈페이지를 삭제하고 기본 예시 2개로 초기화할까요? 이 작업은 되돌릴 수 없습니다.')){ mutateProjects(structuredClone(SAMPLE_PROJECTS)); $('status-filter').value='전체'; renderProjectLists(); } });
  $('auto-critique').addEventListener('click', () => { const result=generateCritiqueText(); if(!result)return; $('overall-review').value = result; renderPreview(); $('form-feedback').textContent = '입력된 작품 설명을 바탕으로 약 200자의 평론 초안이 작성됐습니다. 이미지 자체를 판독한 AI 평론은 아닙니다.'; });
  $('generate-poem-art').addEventListener('click', () => { const result = generatePoemArtSvg(); if(result){ renderPoemArt(); $('form-feedback').textContent = '시의 내용을 바탕으로 가로·세로형 삽화 시화가 생성되었습니다.'; } });
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