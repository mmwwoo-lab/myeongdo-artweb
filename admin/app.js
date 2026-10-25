(() => {
  const $ = (id) => document.getElementById(id);
  const KEY = 'myeongdo_artweb_v7_projects';
  const SAMPLE_PROJECTS = [
    {
      id:'sample-news', title:'만화로 보는 뉴스', owner:'명도재 이명우', template:'news', subtitle:'기사와 만화로 읽는 오늘',
      biography:'기자 겸 콘텐츠 기획자', contact:'이메일 문의 준비 중', summary:'핵심 기사와 만화 뉴스 소개',
      mainText:'기사 원고를 입력해 보세요.', status:'기획', musicMode:'auto', comicPanels:12,
      artworks:[{dataUrl:'',name:'',caption:''},{dataUrl:'',name:'',caption:''},{dataUrl:'',name:'',caption:''}],
      review:'', linkTitle:'기사 원문', linkUrl:'', poemArt:null, manuscript:null, newsComic:null
    },
    {
      id:'sample-exh', title:'사계의 빛 — 한국화 초대전', owner:'명도재 이명우', template:'exhibition', subtitle:'한국화 초대전 안내',
      biography:'한국화 작업과 전시를 이어가는 작가 소개를 입력하세요.', contact:'문의 정보를 입력하세요.', summary:'작품 6점과 평론을 갖춘 전시관',
      mainText:'전시 소개와 작가노트를 입력하세요.', status:'제작 중', musicMode:'auto', comicPanels:12,
      artworks:Array.from({length:6},()=>({dataUrl:'',name:'',caption:''})), review:'작품 평론을 자동 생성하거나 직접 작성하세요.',
      linkTitle:'전시 안내', linkUrl:'', poemArt:null, manuscript:null, newsComic:null
    }
  ];

  const templateMeta = {
    news:{label:'만화로 보는 뉴스', limit:3, kind:'news', preview:'NEWS', guide:'뉴스형 구성: 기사 글쓰기, 만화 이미지 3장, 3열 4행 뉴스 만화 구성', mainLabel:'기사 본문 · 취재 내용', mainPlaceholder:'기사 내용, 취재 요약, 말풍선 설명, 만화 해설 등을 작성하세요.', showReview:false, showPoemArt:false, showNewsComic:true},
    culture_paper:{label:'명도재 이명우의 대구문화예술신문', limit:8, kind:'news', preview:'DAEGU CULTURE NEWSPAPER', guide:'문화예술신문 구성: 기사 본문 · 2열×4행 8컷 만화 · 칼럼 · 관련 사이트', mainLabel:'문화예술 기사 · 신문 본문', mainPlaceholder:'대구문화예술 소식 기사 본문, 취재 내용, 출처를 입력하세요.', showReview:false, showPoemArt:false, showNewsComic:true},
    culture_news_studio:{label:'명도재 이명우의 대구문화예술 뉴스 신문 만들기', limit:8, kind:'news', preview:'DAEGU CULTURE & ARTS NEWS', guide:'대구 문화예술 기사 4건 · 기사별 8컷 만화 시안 · 전문 칼럼을 구성하는 신문 제작실 (고정 발행시간 없음)', mainLabel:'신문 머리기사 및 편집장 글', mainPlaceholder:'오늘의 주요 문화예술 뉴스와 편집장 글을 작성하세요.', showReview:false, showPoemArt:false, showNewsComic:true},
    literary:{label:'명도재 이명우 · 문학관', limit:3, kind:'text', preview:'LITERARY ARCHIVE', guide:'문학관 구성: 글쓰기 중심, 그림/작품 3장, 자동 시화 지원', mainLabel:'시 · 산문 · 문학 글쓰기', mainPlaceholder:'시, 산문, 작가 소개, 문학 평론을 작성하세요.', showReview:false, showPoemArt:true, showNewsComic:false},
    book_launch:{label:'시집 출간 기념관', limit:3, kind:'text', preview:'BOOK LAUNCH', guide:'시집 소개형 구성: 시집 소개, 대표 시, 이미지 3장, 자동 시화 지원', mainLabel:'시집 소개 · 추천사 · 시 원문', mainPlaceholder:'시집 소개, 목차, 추천사, 대표 시 원문을 작성하세요.', showReview:false, showPoemArt:true, showNewsComic:false},
    poem_house:{label:'시가 머무는 집', limit:3, kind:'text', preview:'POEM HOUSE', guide:'시와 문학 글 중심 구성, 그림/작품 3장, 자동 시화 지원', mainLabel:'시와 글쓰기', mainPlaceholder:'시, 해설, 감상문, 시집 안내문을 작성하세요.', showReview:false, showPoemArt:true, showNewsComic:false},
    exhibition:{label:'사계의 빛 — 한국화 초대전', limit:6, kind:'art', preview:'ART EXHIBITION', guide:'전시형 구성: 작품 6점, 작품 설명, 약 200자 평론, 작품별 음악', mainLabel:'전시 소개 · 작가노트', mainPlaceholder:'전시 소개, 작가노트, 전시 의도를 작성하세요.', showReview:true, showPoemArt:false, showNewsComic:false}
  };

  let projects = loadProjects();
  let manuscript = null;
  let poemArt = null;
  let newsComic = null;
  let artworks = emptyArtworks(8);

  const headings = {dashboard:'운영 대시보드',projects:'저장된 홈페이지 관리',create:'홈페이지 만들기',guide:'사용 안내'};

  function structuredSamples(){ return JSON.parse(JSON.stringify(SAMPLE_PROJECTS)); }
  function emptyArtworks(n){ return Array.from({length:n},()=>({dataUrl:'',name:'',caption:'',analysis:null})); }
  function currentMeta(){ return templateMeta[$('template').value] || templateMeta.news; }
  function esc(s){ return String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
  function safeHttps(url){ try{ const u=new URL(url); return u.protocol==='https:' ? u.href : ''; }catch{return '';} }

  function loadProjects(){
    try{
      const raw = localStorage.getItem(KEY);
      if(!raw) return structuredSamples();
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : structuredSamples();
    }catch{return structuredSamples();}
  }
  function saveProjects(){
    try{ localStorage.setItem(KEY, JSON.stringify(projects)); return true; }
    catch(err){ alert('저장에 실패했습니다. 브라우저 저장공간을 확인하세요.'); return false; }
  }
  function mutateProjects(next){ const old=projects; projects=next; if(!saveProjects()){projects=old; return false;} renderProjectLists(); return true; }

  function view(name){
    if(!headings[name]) name='dashboard';
    document.querySelectorAll('.view').forEach(v => v.classList.toggle('visible', v.id === 'view-' + name));
    document.querySelectorAll('[data-view]').forEach(b => b.classList.toggle('active', b.dataset.view === name));
    $('page-heading').textContent = headings[name];
    if(name === 'dashboard' || name === 'projects') renderProjectLists();
    if(name === 'create') $('title').focus({preventScroll:true});
    history.replaceState(null, '', '#' + name);
  }

  function configureTypeSpecificEditor(){
    const type=$('template').value;
    const isNews=['news','culture_paper','culture_news_studio'].includes(type);
    const isArt=type==='exhibition';
    const isBook=type==='book_launch';
    const isPoetry=['literary','book_launch','poem_house'].includes(type);
    const isStudio=type==='culture_news_studio';
    // All fields remain in the DOM so previously saved information is not lost when switching types.
    if(type==='news'){
      const labels={'summary':'기사 요약','main-text':'기사 본문','link-title':'기사 링크 버튼 이름','link-url':'기사 링크 주소 (HTTPS)'};
      for(const [id,label] of Object.entries(labels)){const el=document.querySelector('label[for="'+id+'"]');if(el)el.textContent=label;}
      $('summary').placeholder='기사의 핵심 내용을 간단하게 요약하세요.';
      $('main-text').placeholder='기사 내용 또는 취재 내용을 입력하세요. 링크만으로 원문을 자동으로 가져오지는 않습니다.';
      $('link-url').placeholder='https://news.example.com/article';
      $('link-title').placeholder='기사 원문 보기';
    }else{
      const labels={'summary':'짧은 소개','main-text':currentMeta().mainLabel,'link-title':'연결 버튼 이름','link-url':'연결할 웹사이트 주소 (HTTPS)'};
      for(const [id,label] of Object.entries(labels)){const el=document.querySelector('label[for="'+id+'"]');if(el)el.textContent=label;}
    }
    const fields={
      biography:!isNews,contact:true,subtitle:true,summary:true,
      'main-text':!isStudio,
      'manuscript-file':isPoetry||isNews
    };
    for(const [id,visible] of Object.entries(fields)){
      const input=$(id);if(!input)continue;
      const label=document.querySelector('label[for="'+id+'"]');
      if(label)label.hidden=!visible;
      input.hidden=!visible;
      if(id==='manuscript-file'){
        const panel=input.closest('.panel-inner');
        if(panel)panel.hidden=!visible;
      }
    }
    $('settings-block').hidden=!(isNews||isArt);
    const music=$('music-mode'),comic=$('comic-panels');
    const musicLabel=music.closest('label'),comicLabel=comic.closest('label');
    if(musicLabel)musicLabel.hidden=!isArt;
    if(comicLabel)comicLabel.hidden=!isNews;
    const note=$('settings-block').querySelector('.field-help');
    if(note)note.hidden=!isArt;
    const gallery=$('artwork-upload-grid').closest('.panel-inner');
    gallery.hidden=isStudio;
    const panelLabel=isArt?'작품 사진·그림':isNews?'기사 만화·취재 이미지':isBook?'시집 표지·삽화':'시화·삽화 이미지';
    $('gallery-heading').textContent=panelLabel+' · 최대 '+currentMeta().limit+'장';
    $('gallery-help').textContent='이미지는 자동 축소·압축됩니다. 필요한 사진만 등록하세요.';
    $('main-text-label').textContent=type==='news'?'기사 본문':currentMeta().mainLabel;
    $('summary').placeholder=type==='news'?'기사 요약을 입력하세요':isArt?'전시 개요와 관람 포인트':isNews?'오늘의 주요 문화예술 소식 요약':isBook?'시집 소개와 출간 취지':'시인의 작품 세계와 문학 소개';
    $('title').placeholder=isArt?'전시 제목을 입력하세요':isNews?'신문·기사 제목을 입력하세요':isBook?'시집 제목을 입력하세요':'시·문학관 제목을 입력하세요';
    const typeLabel=document.getElementById('type-workflow-title');
    if(typeLabel)typeLabel.textContent=isStudio?'① 기사 4건 입력 → ② 만화 구성 → ③ 저장':isNews?'① 기사 입력 → ② 8컷 만화 → ③ 저장':isArt?'① 작가 소개 → ② 작품 등록 → ③ 음악 감상':isBook?'① 시집 소개 → ② 대표 시와 시화 → ③ 저장':'① 시 원문 입력 → ② 시화 생성 → ③ 저장';
    const pv=$('preview-site');
    pv.dataset.layout=isArt?'gallery':isNews?'newspaper':isBook?'book':'poetry';
    $('preview-review-wrap').hidden=!isArt;
    $('preview-poem-art-wrap').hidden=!isPoetry||!poemArt;
    $('preview-news-comic-wrap').hidden=!isNews||!newsComic;
  }

  function applyTemplateMode(){
    const meta = currentMeta();
    $('template-guide').textContent = meta.guide;
    $('main-text-label').textContent = meta.mainLabel;
    $('main-text').placeholder = meta.mainPlaceholder;
    $('gallery-heading').textContent = `그림·작품 ${meta.limit}장 등록`;
    $('gallery-help').textContent = `${meta.limit}장까지 등록 가능하며, 큰 파일은 자동 축소·압축됩니다.`;
    $('review-block').hidden = !meta.showReview;
    $('poem-art-block').hidden = !meta.showPoemArt;
    $('news-comic-block').hidden = !meta.showNewsComic;
    $('culture-studio-block').hidden = $('template').value !== 'culture_news_studio';
    $('preview-type').textContent = meta.preview;
    renderUploadCards();
    configureTypeSpecificEditor();
    renderPreview();
  }

  function ensureArtworkCount(){ while(artworks.length < 8) artworks.push({dataUrl:'',name:'',caption:'',analysis:null}); }

  async function fileToDataUrl(file){
    return await new Promise((resolve,reject)=>{ const reader=new FileReader(); reader.onload=()=>resolve(reader.result); reader.onerror=()=>reject(reader.error); reader.readAsDataURL(file); });
  }

  async function compressedArtworkData(file){
    const LIMIT=360*1024;
    const MAX_EDGE=1600;
    const supported=['image/jpeg','image/png','image/webp'];
    if(!supported.includes(file.type)) throw new Error('JPG·PNG·WebP만 가능합니다.');
    const src = await fileToDataUrl(file);
    if(file.size <= LIMIT) return src;
    const img = new Image();
    await new Promise((resolve,reject)=>{ img.onload=resolve; img.onerror=()=>reject(new Error('이미지 열기 실패')); img.src=src; });
    const canvas = document.createElement('canvas');
    let ratio = Math.min(1, MAX_EDGE / Math.max(img.naturalWidth, img.naturalHeight));
    let w = Math.max(1, Math.round(img.naturalWidth*ratio));
    let h = Math.max(1, Math.round(img.naturalHeight*ratio));
    for(let round=0; round<6; round++){
      canvas.width=w; canvas.height=h;
      const ctx = canvas.getContext('2d');
      if(!ctx) throw new Error('캔버스 사용 불가');
      ctx.fillStyle='#ffffff'; ctx.fillRect(0,0,w,h); ctx.drawImage(img,0,0,w,h);
      for(const q of [0.86,0.76,0.66,0.56,0.46,0.36]){
        const out = canvas.toDataURL('image/jpeg', q);
        const size = Math.ceil((out.length - out.indexOf(',') - 1) * 3 / 4);
        if(size <= LIMIT) return out;
      }
      w=Math.max(1, Math.round(w*0.85));
      h=Math.max(1, Math.round(h*0.85));
    }
    throw new Error('자동 압축에 실패했습니다. 더 작은 이미지를 사용해 주세요.');
  }

  async function analyzeArtworkMood(dataUrl, caption, manualMode){
    if(manualMode && manualMode !== 'auto') return {mood: manualMode, label: moodLabel(manualMode), brightness: 0, saturation: 0, hue: 0};
    const img = new Image();
    await new Promise((resolve,reject)=>{ img.onload=resolve; img.onerror=()=>reject(new Error('이미지 분석 실패')); img.src=dataUrl; });
    const canvas=document.createElement('canvas');
    const w = 48, h = 48; canvas.width=w; canvas.height=h;
    const ctx=canvas.getContext('2d'); if(!ctx) return {mood:'lyrical', label:moodLabel('lyrical'), brightness:0,saturation:0,hue:0};
    ctx.drawImage(img,0,0,w,h);
    const pixels=ctx.getImageData(0,0,w,h).data;
    let r=0,g=0,b=0,count=0;
    for(let i=0;i<pixels.length;i+=4){ r+=pixels[i]; g+=pixels[i+1]; b+=pixels[i+2]; count++; }
    r/=count; g/=count; b/=count;
    const brightness=(r+g+b)/3;
    const max=Math.max(r,g,b), min=Math.min(r,g,b);
    const delta=max-min;
    const saturation=max===0?0:delta/max*100;
    let hue=0;
    if(delta!==0){
      if(max===r) hue=((g-b)/delta)%6;
      else if(max===g) hue=(b-r)/delta+2;
      else hue=(r-g)/delta+4;
      hue=Math.round(hue*60); if(hue<0) hue+=360;
    }
    const text=(caption||'').toLowerCase();
    let mood='lyrical';
    if(/장엄|웅장|역사|산맥|궁전|성당|장군/.test(text) || (brightness<120 && saturation<40)) mood='majestic';
    else if(/봄|꽃|햇살|청춘|산뜻|새벽/.test(text) || (brightness>170 && saturation>40)) mood='fresh';
    else if(/바다|강|호수|명상|고요|평온/.test(text) || ((hue>160 && hue<260) && brightness>110)) mood='calm';
    else if(/달|밤|그리움|비|이별|쓸쓸/.test(text) || brightness<150) mood='lyrical';
    return {mood, label:moodLabel(mood), brightness:Math.round(brightness), saturation:Math.round(saturation), hue:Math.round(hue)};
  }

  function moodLabel(key){ return ({lyrical:'애절한 경음악', majestic:'장엄한 경음악', fresh:'산뜻한 경음악', calm:'고요한 경음악'})[key] || '애절한 경음악'; }
  function moodTitle(key){ return ({lyrical:'달빛 서정곡', majestic:'장엄한 행진곡', fresh:'봄의 미뉴에트', calm:'호수의 세레나데'})[key] || '달빛 서정곡'; }

  function renderUploadCards(){
    ensureArtworkCount();
    const wrap=$('artwork-upload-grid'); wrap.className='upload-grid'; wrap.replaceChildren();
    const limit=currentMeta().limit;
    for(let i=0;i<limit;i++){
      const card=document.createElement('div'); card.className='upload-card';
      card.innerHTML=`
        <h5>작품 ${i+1}</h5>
        <input type="file" id="artwork-file-${i}" accept="image/jpeg,image/png,image/webp">
        <div class="inline-actions">
          <button type="button" class="subtle" id="replace-artwork-${i}">사진 선택</button>
          <button type="button" class="danger" id="remove-artwork-${i}">삭제</button>
        </div>
        <div class="upload-preview" id="upload-preview-${i}">작품 이미지 업로드</div>
        <div class="artwork-meta-fields">
          <label>작품명<input type="text" id="artwork-title-${i}" maxlength="140" placeholder="작품 제목"></label>
          <label>제작연도<input type="text" id="artwork-year-${i}" maxlength="40" placeholder="2026"></label>
          <label>재료·기법<input type="text" id="artwork-material-${i}" maxlength="120" placeholder="수채화 / 종이에 채색"></label>
          <label>크기<input type="text" id="artwork-size-${i}" maxlength="80" placeholder="53 × 45.5 cm"></label>
        </div>
        <div class="artwork-media-fields"><label>음악 링크 (HTTPS)<input id="artwork-musicUrl-${i}" type="url" placeholder="https://..."></label><label>영상 링크 (HTTPS)<input id="artwork-videoUrl-${i}" type="url" placeholder="https://..."></label></div>
        <label for="artwork-caption-${i}">작품 해설</label>
        <textarea id="artwork-caption-${i}" class="caption-box" rows="3" maxlength="1000" placeholder="작품의 의미, 표현기법과 감상 포인트"></textarea>
        <div class="analysis-mini" id="artwork-analysis-${i}">분위기 분석 대기 중</div>`;
      wrap.append(card);
    }
    for(let i=0;i<limit;i++){
      const fileInput=$('artwork-file-'+i), caption=$('artwork-caption-'+i);
      fileInput.addEventListener('change', async (e)=>{
        const file=e.target.files[0]; if(!file) return;
        try{
          const dataUrl=await compressedArtworkData(file);
          const analysis=await analyzeArtworkMood(dataUrl, caption.value || '', $('music-mode').value);
          artworks[i]={...artworks[i], dataUrl, name:file.name, caption:caption.value || artworks[i].caption || '', analysis};
          updateUploadPreview(i); renderPreview();
          $('form-feedback').textContent=`작품 ${i+1} 이미지가 등록되었습니다. 큰 파일은 자동으로 축소·압축했습니다.`;
        }catch(err){ alert(err.message || '이미지 등록 실패'); fileInput.value=''; }
      });
      $('replace-artwork-'+i).addEventListener('click', ()=>fileInput.click());
      $('remove-artwork-'+i).addEventListener('click', ()=>{
        artworks[i]={dataUrl:'',name:'',caption:'',analysis:null}; fileInput.value=''; caption.value=''; for(const key of ['title','year','material','size','musicUrl','videoUrl'])$('artwork-'+key+'-'+i).value='';
        updateUploadPreview(i); renderPreview(); $('form-feedback').textContent=`작품 ${i+1} 이미지가 삭제되었습니다.`;
      });
      caption.addEventListener('input', async ()=>{
        artworks[i].caption=caption.value;
        if(artworks[i].dataUrl){ artworks[i].analysis=await analyzeArtworkMood(artworks[i].dataUrl, caption.value, $('music-mode').value); }
        updateUploadPreview(i); renderPreview();
      });
      caption.value=artworks[i]?.caption || '';
      for(const key of ['title','year','material','size','musicUrl','videoUrl']){
        const inp=$('artwork-'+key+'-'+i);
        inp.value=artworks[i]?.[key] || '';
        inp.addEventListener('input',()=>{
          artworks[i][key]=inp.value.trim();
          renderPreview();
        });
      }
      updateUploadPreview(i);
    }
  }

  function updateUploadPreview(i){
    const box=$('upload-preview-'+i); const analysisBox=$('artwork-analysis-'+i); if(!box) return;
    box.replaceChildren();
    const item=artworks[i];
    if(item && item.dataUrl){
      const img=document.createElement('img'); img.src=item.dataUrl; img.alt=item.name||`작품 ${i+1}`; box.append(img);
      const small=document.createElement('small'); small.textContent=item.name || `작품 ${i+1}`; box.append(small);
      if(item.analysis) analysisBox.textContent=`음악 분위기: ${item.analysis.label} · 밝기 ${item.analysis.brightness} · 채도 ${item.analysis.saturation}`;
      else analysisBox.textContent='분위기 분석 대기 중';
    }else{ box.textContent='작품 이미지 업로드'; analysisBox.textContent='분위기 분석 대기 중'; }
  }

  function renderManuscript(){
    const info=$('manuscript-info'); const box=$('manuscript-preview'); box.replaceChildren();
    if(!manuscript){ info.textContent='파일 미선택 · TXT는 본문으로 불러오고, JPG는 미리보기, HWP는 첨부 보관용입니다.'; return; }
    info.textContent=`선택한 파일: ${manuscript.name}`;
    if(manuscript.kind==='jpg'){
      const img=document.createElement('img'); img.src=manuscript.dataUrl; img.alt=manuscript.name; box.append(img);
    }else if(manuscript.kind==='txt'){
      const pre=document.createElement('div'); pre.className='preview-article'; pre.textContent=manuscript.text?.slice(0,800) || ''; box.append(pre);
    }else{
      const p=document.createElement('p'); p.textContent='HWP 파일은 첨부·다운로드용으로만 보관됩니다.'; box.append(p);
    }
  }

  function generateCritiqueText(){
    const title=$('title').value.trim()||'이번 전시';
    const owner=$('owner').value.trim()||'작가';
    const active=artworks.filter(a=>a.dataUrl);
    if(!active.length){ alert('작품 이미지를 먼저 등록하세요.'); return null; }
    const caps=active.map(a=>a.caption).filter(Boolean).join(' · ');
    const mood=/봄|꽃|연두|햇살/.test(caps)?'맑고 생동하는 계절감':/달|밤|그리움|비|고요/.test(caps)?'고요하고 사색적인 울림':/산|강|바다|하늘|역사/.test(caps)?'넓고 깊은 공간감':'절제된 화면과 단단한 시선';
    let text=`${title}은 ${owner}의 시선을 통해 ${mood}을 드러낸다. 화면은 기교보다 정서에 가까이 다가서며, 작품마다 다른 색의 호흡을 쌓아 하나의 전시 리듬을 만든다. 관람자는 그 여백 속에서 빛과 시간, 기억의 결을 차분히 만나게 된다.`;
    if(text.length>200) text=text.slice(0,198)+'…';
    return text;
  }

  function generateNewsComicData(){
    const title=$('title').value.trim() || '뉴스 제목';
    const summary=$('summary').value.trim();
    const body=$('main-text').value.trim();
    const url=safeHttps($('link-url').value.trim());
    if(!summary && !body){alert('기사 요약 또는 기사 본문을 입력하세요. 기사 링크만으로 원문을 자동 읽을 수는 없습니다.');return null;}
    const panelCount=Number($('comic-panels').value||8);
    const text=[summary,body].filter(Boolean).join(' ').replace(/\r/g,'').replace(/\n+/g,' ');
    const units=text.split(/(?<=[.!?。！？])\s+/).map(v=>v.trim()).filter(Boolean);
    if(!units.length)units.push(text);
    const previous=newsComic && newsComic.title===title?newsComic:null;
    const panels=Array.from({length:panelCount},(_,i)=>{
      const part=units[Math.min(units.length-1,Math.floor(i*units.length/panelCount))]||text;
      return {image:previous?.panels?.[i]?.image||'',index:i+1,scene:'기사 장면 '+(i+1)+': '+part.slice(0,90),bubble:part.slice(0,42)+(part.length>42?'…':''),caption:i===panelCount-1?(url?'기사 원문: '+url:'기사의 맥락과 출처를 확인해 주세요.'):'기사 내용을 시각적으로 재구성한 장면'};
    });
    newsComic={panelCount,title,source:url,panels};
    return newsComic;
  }

  async function nanoImageRequest(endpoint,prompt){
    const url=new URL(endpoint);
    if(url.protocol!=='https:' || url.username || url.password || !/^https?:$/.test(url.protocol))throw new Error('HTTPS 보안 중계 주소를 입력하세요.');
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),90000);
    try{
      const response=await fetch(url.href,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt}),signal:controller.signal});
      if(!response.ok){let info='';try{info=(await response.json()).error||'';}catch{}throw new Error('이미지 생성 서버 오류 ('+response.status+') '+info);}
      const data=await response.json();
      if(!/^data:image\/(png|jpeg|webp);base64,[a-zA-Z0-9+/=]+$/.test(data.image||''))throw new Error('서버 이미지 형식이 올바르지 않습니다.');
      return data.image;
    }finally{clearTimeout(timer);}
  }
  async function generateNanoComic(){
    const input=$('nano-endpoint').value.trim();
    if(!input){alert('나노바나나 보안 중계 서버 주소를 입력하세요. API 비밀키를 웹페이지에 입력하면 안 됩니다.');return;}
    if($('comic-panels').value!=='8')$('comic-panels').value='8';
    let comic=generateNewsComicData();if(!comic)return;
    const button=$('generate-nano-comic');button.disabled=true;
    const original=button.textContent;let done=0;
    const style='현장감 있는 한국 신문 뉴스 만화 삽화, 사실적인 인물 비례, 생동감 있는 수채화 채색, 객관적 보도 분위기, 정중한 연출, 이미지 내부에는 글씨/말풍선/자막을 넣지 말 것, 실제 취재 사진인 듯 오해될 표현이나 특정 인물의 확인되지 않은 행동은 피할 것.';
    const endpoint=input.replace(/\/$/,'');
    try{
      newsComic=comic;
      for(let i=0;i<comic.panels.length;i++){
        const panel=comic.panels[i];
        button.textContent='그림 생성 중 '+(i+1)+'/8';
        $('form-feedback').textContent='나노바나나 '+(i+1)+'번째 컷 작업 중 — 완료 '+done+'/8';
        const prompt=style+' 공통 주제: '+comic.title+'. 장면 '+(i+1)+'/8: '+panel.scene+'. 다양한 시점과 구성, 두 열 네 행 만화 중 한 컷에 어울리는 4:3 가로 구도.';
        try{panel.image=await nanoImageRequest(endpoint,prompt);done++;}
        catch(err){panel.error=String(err.message||err);$('form-feedback').textContent=(i+1)+'컷 실패: '+panel.error;}
        renderNewsComic();
      }
      $('form-feedback').textContent=done+'/8컷 그림이 생성되었습니다. 저장과 HTML 다운로드에서 생성 그림을 사용할 수 있습니다.'+(done<8?' 실패한 컷은 연결 상태를 확인해 주세요.':'');
    }finally{button.disabled=false;button.textContent=original;renderNewsComic();renderPreview();}
  }

  function renderNewsComic(){
    const wrap=$('news-comic-preview'); const preview=$('preview-news-comic'); const outer=$('preview-news-comic-wrap');
    wrap.replaceChildren(); preview.replaceChildren();
    if(!newsComic){ wrap.classList.add('empty-box'); wrap.textContent='아직 생성된 뉴스 만화가 없습니다.'; outer.hidden=true; return; }
    wrap.classList.remove('empty-box'); wrap.textContent=''; outer.hidden=false;
    const grid1=document.createElement('div'); grid1.className='news-grid'+(newsComic.panelCount===8?' two':'');
    const grid2=document.createElement('div'); grid2.className='news-grid'+(newsComic.panelCount===8?' two':'');
    newsComic.panels.forEach(panel=>{ const c1=makeComicCard(panel); const c2=makeComicCard(panel); grid1.append(c1); grid2.append(c2); });
    wrap.append(grid1); preview.append(grid2);
  }
  function makeComicCard(panel){
    const card=document.createElement('div'); card.className='comic-card';
    card.innerHTML=`<h5>${panel.index}컷</h5>${panel.image?'<img class="comic-generated-image" alt="AI 생성 뉴스 만화 '+panel.index+'컷" src="'+esc(panel.image)+'">':'<div class="comic-scene">'+esc(panel.scene)+'</div>'}<div class="bubble">${esc(panel.bubble)}</div><div class="status-mini">${esc(panel.caption)}</div>`;
    return card;
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
    const dataUrl='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
    poemArt={svg,dataUrl,createdAt:new Date().toISOString(),orientation:scene.orientation,ratio:`${size.width}:${size.height}`};
    return poemArt;
  }

  function extractPoemMotifs(text){
    const dictionary=[
      {word:'달',scene:'moon',icon:'☾',color:['#f7e8bf','#e5d4f1','#d7e2f2'],caption:'달빛이 머무는 서정',analysis1:'달빛의 이미지는 고요와 그리움을 길게 끌어간다.'},
      {word:'꽃',scene:'flower',icon:'✿',color:['#f8d5de','#f8ebc9','#d7ece1'],caption:'꽃의 이미지가 피어나는 시심',analysis1:'꽃은 감정의 개화를 부드럽게 드러낸다.'},
      {word:'가을',scene:'autumn',icon:'🍁',color:['#f0c2a3','#d7b08f','#f8e8d6'],caption:'가을빛이 스미는 정조',analysis1:'가을의 색조가 시간의 깊이와 기억의 결을 드러낸다.'},
      {word:'바다',scene:'sea',icon:'〰',color:['#c9e5ef','#a5d7e5','#dff3f8'],caption:'물결처럼 확장되는 시선',analysis1:'바다는 감정의 폭과 리듬을 넓게 열어 준다.'},
      {word:'강',scene:'river',icon:'〰',color:['#d2e8ef','#b6d7e0','#e8f6f8'],caption:'물의 흐름을 닮은 사유',analysis1:'강물의 흐름은 시간과 기억의 움직임을 은유한다.'},
      {word:'산',scene:'mountain',icon:'⛰',color:['#d1dfc8','#dce8d3','#eff5e7'],caption:'산의 침묵을 닮은 여백',analysis1:'산의 이미지는 안정감과 사유의 높이를 암시한다.'},
      {word:'비',scene:'rain',icon:'☔',color:['#d7dde8','#c5d2e6','#e9eef7'],caption:'빗결이 적시는 정서',analysis1:'비의 이미지는 감정의 세밀한 파동을 높인다.'},
      {word:'나무',scene:'tree',icon:'❀',color:['#d9ead2','#edf4e9','#dce8ef'],caption:'나무 곁에 머무는 서정',analysis1:'나무는 견딤과 성장의 시간을 상징한다.'},
      {word:'새',scene:'bird',icon:'✧',color:['#e8def6','#f1eacd','#dceaf4'],caption:'날아오르는 시선의 이미지',analysis1:'새의 이미지는 자유와 기다림의 정서를 함께 품는다.'}
    ];
    const found=dictionary.find(item=>text.includes(item.word)) || {scene:'abstract',icon:'✧',color:['#eadfc9','#dce9ef','#f4e6ea'],caption:'수채로 번지는 시의 여운',analysis1:'시의 핵심 이미지는 감정의 결을 부드럽게 펼쳐 보인다.'};
    return {scene:found.scene,palette:found.color,icons:[found.icon,'✧','❀'],caption:found.caption,analysis1:found.analysis1};
  }
  function choosePoemScene(text,motifs){
    const wideHints=/바다|강|산|하늘|들|길|평야|구름|노을|수평선|벌판/;
    const tallHints=/꽃|달|비|나무|창|별|등불|눈물|얼굴|새/;
    const orientation=wideHints.test(text)?'landscape':tallHints.test(text)?'portrait':text.length>180?'portrait':'landscape';
    return {...motifs,orientation,titleLabel:orientation==='landscape'?'삽화형 가로 시화':'삽화형 세로 시화'};
  }
  function buildPoemIllustration(scene,width,height){
    const p=scene.palette;
    const moodDots=scene.icons.map((icon,idx)=>`<text x="${width*0.12 + idx*width*0.11}" y="${height*0.18 + (idx%2)*height*0.05}" font-size="${Math.round(width*0.04)}" fill="rgba(60,72,88,.14)">${esc(icon)}</text>`).join('');
    const baseWash=`<circle cx="${width*0.22}" cy="${height*0.2}" r="${width*0.13}" fill="${p[0]}" opacity="0.48" filter="url(#soft-blur)"/><circle cx="${width*0.72}" cy="${height*0.3}" r="${width*0.15}" fill="${p[1]}" opacity="0.33" filter="url(#soft-blur)"/><circle cx="${width*0.52}" cy="${height*0.76}" r="${width*0.18}" fill="${p[2]}" opacity="0.28" filter="url(#soft-blur)"/>${moodDots}`;
    const scenes={
      mountain:`${baseWash}<circle cx="${width*0.78}" cy="${height*0.18}" r="${width*0.05}" fill="#f5ebc4" opacity="0.9"/><path d="M0 ${height*0.58} C ${width*0.12} ${height*0.48}, ${width*0.25} ${height*0.46}, ${width*0.38} ${height*0.56} C ${width*0.48} ${height*0.42}, ${width*0.58} ${height*0.39}, ${width*0.73} ${height*0.58} C ${width*0.82} ${height*0.46}, ${width*0.92} ${height*0.5}, ${width} ${height*0.45} L ${width} ${height} L 0 ${height} Z" fill="#758c78" opacity="0.62"/><path d="M0 ${height*0.68} C ${width*0.16} ${height*0.62}, ${width*0.32} ${height*0.57}, ${width*0.5} ${height*0.7} C ${width*0.66} ${height*0.58}, ${width*0.83} ${height*0.64}, ${width} ${height*0.57} L ${width} ${height} L 0 ${height} Z" fill="#90a38d" opacity="0.58"/>`,
      sea:`${baseWash}<circle cx="${width*0.77}" cy="${height*0.18}" r="${width*0.055}" fill="#f6e8b2" opacity="0.92"/><rect x="0" y="${height*0.57}" width="${width}" height="${height*0.43}" fill="#9fd1de" opacity="0.45"/><path d="M0 ${height*0.62} Q ${width*0.1} ${height*0.58}, ${width*0.2} ${height*0.62} T ${width*0.4} ${height*0.62} T ${width*0.6} ${height*0.62} T ${width*0.8} ${height*0.62} T ${width} ${height*0.62}" stroke="#5d8fa4" stroke-width="6" fill="none" opacity="0.55"/>`,
      river:`${baseWash}<path d="M${width*0.28} ${height*0.04} C ${width*0.42} ${height*0.18}, ${width*0.55} ${height*0.34}, ${width*0.49} ${height*0.54} C ${width*0.43} ${height*0.72}, ${width*0.57} ${height*0.84}, ${width*0.66} ${height} L ${width} ${height} L ${width} ${height*0.72} C ${width*0.86} ${height*0.62}, ${width*0.73} ${height*0.48}, ${width*0.7} ${height*0.28} C ${width*0.68} ${height*0.16}, ${width*0.58} ${height*0.08}, ${width*0.45} 0 Z" fill="#b8dce4" opacity="0.76"/>`,
      flower:`${baseWash}<path d="M0 ${height*0.86} C ${width*0.2} ${height*0.8}, ${width*0.38} ${height*0.82}, ${width*0.56} ${height*0.86} C ${width*0.74} ${height*0.81}, ${width*0.86} ${height*0.82}, ${width} ${height*0.78} L ${width} ${height} L 0 ${height} Z" fill="#b5cda8" opacity="0.55"/>${Array.from({length:5},(_,i)=>{const x=width*(0.18+i*0.14);const y=height*(0.68+(i%2)*0.04);return `<g><path d="M${x} ${height*0.87} Q ${x+10} ${height*0.78}, ${x} ${y}" stroke="#6d9165" stroke-width="4" fill="none"/><circle cx="${x}" cy="${y}" r="${width*0.025}" fill="#f8b9c8" opacity="0.92"/></g>`;}).join('')}`,
      autumn:`${baseWash}<path d="M0 ${height*0.78} C ${width*0.22} ${height*0.7}, ${width*0.46} ${height*0.72}, ${width*0.64} ${height*0.82} C ${width*0.8} ${height*0.76}, ${width*0.92} ${height*0.78}, ${width} ${height*0.74} L ${width} ${height} L 0 ${height} Z" fill="#c5a27c" opacity="0.56"/>`,
      rain:`${baseWash}${Array.from({length:42},(_,i)=>`<line x1="${(i*37)%width}" y1="${height*0.14 + (i%6)*40}" x2="${(i*37)%width - width*0.03}" y2="${height*0.24 + (i%6)*40}" stroke="#8299b6" stroke-width="3" opacity="0.38"/>`).join('')}`,
      moon:`${baseWash}<circle cx="${width*0.72}" cy="${height*0.22}" r="${width*0.08}" fill="#fbf0c7" opacity="0.95"/><circle cx="${width*0.75}" cy="${height*0.2}" r="${width*0.08}" fill="rgba(251,248,241,0.84)"/><path d="M0 ${height*0.72} C ${width*0.18} ${height*0.66}, ${width*0.33} ${height*0.64}, ${width*0.48} ${height*0.72} C ${width*0.58} ${height*0.64}, ${width*0.74} ${height*0.63}, ${width} ${height*0.66} L ${width} ${height} L 0 ${height} Z" fill="#74809b" opacity="0.62"/>`,
      tree:`${baseWash}<path d="M${width*0.34} ${height} C ${width*0.36} ${height*0.84}, ${width*0.38} ${height*0.68}, ${width*0.42} ${height*0.48}" stroke="#7c5b43" stroke-width="20" fill="none" opacity="0.7"/><ellipse cx="${width*0.45}" cy="${height*0.38}" rx="${width*0.18}" ry="${height*0.16}" fill="#b8d8b3" opacity="0.68"/>`,
      bird:`${baseWash}${Array.from({length:6},(_,i)=>`<path d="M${width*(0.18+i*0.12)} ${height*(0.32+(i%3)*0.05)} q${width*0.02} -${height*0.03} ${width*0.04} 0 q-${width*0.02} ${height*0.02} -${width*0.04} 0" stroke="#617189" stroke-width="4" fill="none"/>`).join('')}`,
      abstract:`${baseWash}<path d="M0 ${height*0.76} C ${width*0.14} ${height*0.68}, ${width*0.3} ${height*0.72}, ${width*0.42} ${height*0.8} C ${width*0.58} ${height*0.66}, ${width*0.74} ${height*0.64}, ${width} ${height*0.74} L ${width} ${height} L 0 ${height} Z" fill="#c6d2d8" opacity="0.5"/>`
    };
    return scenes[scene.scene] || scenes.abstract;
  }
  function buildPoemTextPanel({title,owner,lines,scene,width,height}){
    const portrait=scene.orientation==='portrait';
    const panelW=portrait?width*0.76:width*0.42;
    const panelH=portrait?height*0.44:height*0.66;
    const x=portrait?width*0.12:width*0.53;
    const y=portrait?height*0.5:height*0.18;
    const titleSize=portrait?54:48; const bodySize=portrait?28:24; const lineGap=portrait?44:38;
    const poemLines=lines.map((line,idx)=>`<text x="${x+34}" y="${y+170 + idx*lineGap}" font-size="${bodySize}" fill="#243447">${esc(line)}</text>`).join('');
    return `<rect x="${x}" y="${y}" width="${panelW}" height="${panelH}" rx="24" fill="rgba(255,255,255,0.68)" stroke="rgba(42,60,80,0.08)"/><text x="${x+34}" y="${y+44}" font-size="24" fill="#6b7280">${scene.titleLabel}</text><text x="${x+34}" y="${y+104}" font-size="${titleSize}" font-weight="700" fill="#1f2f3f">${esc(title)}</text><text x="${x+34}" y="${y+144}" font-size="26" fill="#536171">${esc(owner)}</text>${poemLines}<text x="${x+34}" y="${y+panelH-40}" font-size="22" fill="#38485a">${esc(scene.analysis1)}</text>`;
  }
  function wrapTextForSvg(text, maxLen){
    const normalized=text.replace(/\r/g,'').split(/\n+/).map(v=>v.trim()).filter(Boolean).join(' ');
    const words=normalized.split(/\s+/); const lines=[]; let cur='';
    for(const w of words){ const next=cur ? cur+' '+w : w; if(next.length>maxLen){ if(cur) lines.push(cur); cur=w; } else cur=next; }
    if(cur) lines.push(cur); return lines;
  }

  function renderPoemArt(){
    const wrap=$('poem-art-preview'); const preview=$('preview-poem-art'); const outer=$('preview-poem-art-wrap');
    wrap.replaceChildren(); preview.replaceChildren();
    if(!poemArt){ wrap.classList.add('empty-box'); wrap.textContent='아직 생성된 시화가 없습니다.'; outer.hidden=true; return; }
    wrap.classList.remove('empty-box'); wrap.textContent=''; outer.hidden=false;
    const img1=document.createElement('img'); img1.src=poemArt.dataUrl; img1.alt='자동 생성 시화'; wrap.append(img1);
    const img2=document.createElement('img'); img2.src=poemArt.dataUrl; img2.alt='자동 생성 시화'; preview.append(img2);
  }

  function renderPreview(){
    const meta=currentMeta();
    $('preview-type').textContent=meta.preview;
    $('preview-title').textContent=$('title').value.trim() || meta.label;
    $('preview-subtitle').textContent=$('subtitle').value.trim() || '한 줄 소개';
    $('preview-owner').textContent=$('owner').value.trim() || '작가·단체명';
    $('preview-summary').textContent=$('summary').value.trim() || '짧은 소개가 여기에 표시됩니다.';
    $('preview-main-text').textContent=$('main-text').value.trim() || '본문 글이 여기에 표시됩니다.';
    $('preview-biography').textContent=$('biography').value.trim() || '작가 약력 또는 소개를 입력하세요.';
    $('preview-contact').textContent=$('contact').value.trim() || '문의 정보를 입력하세요.';
    const linkWrap=$('preview-link'); linkWrap.replaceChildren(); const href=safeHttps($('link-url').value.trim());
    if(href){ const a=document.createElement('a'); a.href=href; a.target='_blank'; a.rel='noopener noreferrer'; a.className='primary'; a.textContent=$('link-title').value.trim() || ($('template').value==='news'?'기사 원문 보기':'관련 사이트 열기'); linkWrap.append(a); if($('template').value==='news'){const note=document.createElement('small');note.className='field-help';note.textContent='기사 출처 링크 · 원문은 새 창에서 확인';linkWrap.append(note);} }
    const gallery=$('preview-art-gallery'); gallery.replaceChildren();
    const limit=meta.limit;
    for(let i=0;i<limit;i++){
      const item=artworks[i] || {dataUrl:'',caption:'',analysis:null};
      const tile=document.createElement('div'); tile.className='art-tile';
      if(item.dataUrl){
        const img=document.createElement('img'); img.src=item.dataUrl; img.alt=`작품 ${i+1}`; tile.append(img);
        const cap=document.createElement('div'); cap.className='preview-article'; cap.textContent=item.caption || `작품 ${i+1} 설명을 입력하세요.`; tile.append(cap);
        const note=document.createElement('div'); note.className='music-note'; note.textContent=item.analysis ? `${moodTitle(item.analysis.mood)} · ${item.analysis.label}` : '작품 감상용 30초 음악이 생성됩니다.'; tile.append(note);
      }else tile.textContent=`작품 ${i+1} 이미지 자리`;
      gallery.append(tile);
    }
    $('preview-review-wrap').hidden=!meta.showReview;
    $('preview-review').textContent=$('overall-review').value.trim() || '전체 작품 평론이 여기에 표시됩니다.';
    renderPoemArt(); renderNewsComic();
  }

  function redirectTargetStatus(){
    const enabled=$('external-redirect').checked;
    const target=safeHttps($('link-url').value.trim());
    const status=$('redirect-status');
    if(!enabled){status.textContent='자동 이동 꺼짐 · 원문/외부 링크 버튼만 사용';return;}
    if(!target){status.textContent='HTTPS 목적지 주소를 입력해야 자동 이동합니다.';return;}
    status.textContent='내보낸 HTML에서만 이동합니다: '+target;
  }
  function collectFormData(){
    const limit=currentMeta().limit;
    return {
      id:$('project-id').value || ('project-' + Date.now() + '-' + Math.random().toString(36).slice(2,7)),
      title:$('title').value.trim(), owner:$('owner').value.trim(), template:$('template').value,
      subtitle:$('subtitle').value.trim(), biography:$('biography').value.trim(), contact:$('contact').value.trim(),
      summary:$('summary').value.trim(), mainText:$('main-text').value.trim(), review:$('overall-review').value.trim(),
      linkTitle:$('link-title').value.trim(), linkUrl:safeHttps($('link-url').value.trim()), externalRedirect:$('external-redirect').checked, status:$('status').value,
      musicMode:$('music-mode').value, comicPanels:Number($('comic-panels').value||12), artworks:artworks.slice(0,limit).map(a=>({...a})),
      cultureArticles:Array.from({length:4},(_,i)=>({title:$('culture-title-'+i).value.trim(),article:$('culture-article-'+i).value.trim(),column:$('culture-column-'+i).value.trim(),source:$('culture-source-'+i).value.trim()})),
      manuscript, poemArt, newsComic
    };
  }

  function fillForm(project){
    $('project-id').value=project.id || '';
    $('title').value=project.title || '';
    $('owner').value=project.owner || '';
    $('template').value=project.template || 'news';
    $('subtitle').value=project.subtitle || '';
    $('biography').value=project.biography || '';
    $('contact').value=project.contact || '';
    $('summary').value=project.summary || '';
    $('main-text').value=project.mainText || '';
    $('overall-review').value=project.review || '';
    $('link-title').value=project.linkTitle || '';
    $('link-url').value=project.linkUrl || '';
    $('external-redirect').checked=Boolean(project.externalRedirect); redirectTargetStatus();
    $('status').value=project.status || '기획';
    $('music-mode').value=project.musicMode || 'auto';
    $('comic-panels').value=String(project.comicPanels || 12);
    for(let i=0;i<4;i++){const item=project.cultureArticles?.[i]||{};for(const [field,key] of [['title','title'],['article','article'],['column','column'],['source','source']])$('culture-'+field+'-'+i).value=item[key]||'';}
    manuscript=project.manuscript || null; poemArt=project.poemArt || null; newsComic=project.newsComic || null;
    artworks=emptyArtworks(8); (project.artworks || []).slice(0,8).forEach((a,idx)=>{ artworks[idx]={...artworks[idx], ...(a||{})}; });
    $('form-title').textContent='홈페이지 수정 · ' + (project.title || '');
    $('built-preview-box').hidden=true;
    $('main-text-count').textContent=$('main-text').value.length.toLocaleString('ko-KR');
    applyTemplateMode(); renderManuscript(); renderPoemArt(); renderNewsComic(); view('create');
  }

  function clearForm(){
    $('project-form').reset(); $('project-id').value=''; $('template').value='exhibition'; $('music-mode').value='auto'; $('comic-panels').value='12';
    $('form-title').textContent='새 홈페이지 만들기'; manuscript=null; poemArt=null; newsComic=null; artworks=emptyArtworks(6);
    $('built-preview-box').hidden=true; $('main-text-count').textContent='0'; $('external-redirect').checked=false; redirectTargetStatus(); applyTemplateMode(); renderManuscript(); renderPoemArt(); renderNewsComic(); $('form-feedback').textContent='새 입력을 시작합니다.';
  }

  function projectRow(project){
    const row=document.createElement('div'); row.className='project-row';
    const count=(project.artworks || []).filter(a=>a && a.dataUrl).length;
    const info=document.createElement('div');
    info.innerHTML=`<h4>${esc(project.title)}</h4><small>${esc(project.owner || '작가 미입력')} · ${esc(templateMeta[project.template]?.label || project.template)} · 등록된 이미지 ${count}장 / 최대 ${templateMeta[project.template]?.limit || 3}장</small>`;
    const actions=document.createElement('div'); actions.className='row-actions';
    const tag=document.createElement('span'); tag.className='tag'; tag.textContent=project.status || '기획';
    const edit=document.createElement('button'); edit.type='button'; edit.className='subtle'; edit.textContent='다시 편집'; edit.addEventListener('click',()=>fillForm(project));
    const show=document.createElement('button'); show.type='button'; show.className='subtle'; show.textContent='홈페이지 보기'; show.addEventListener('click',()=>{ fillForm(project); previewBuiltPage(); });
    const del=document.createElement('button'); del.type='button'; del.className='danger'; del.textContent='삭제'; del.addEventListener('click',()=>{ if(confirm(`「${project.title}」 홈페이지를 삭제할까요?`)){ mutateProjects(projects.filter(p=>p.id!==project.id)); }});
    actions.append(tag,edit,show,del); row.append(info,actions); return row;
  }
  function emptyNode(msg){ const d=document.createElement('div'); d.className='empty'; d.textContent=msg; return d; }

  function renderProjectLists(){
    $('stat-all').textContent=projects.length;
    $('stat-doing').textContent=projects.filter(p=>p.status !== '완료').length;
    $('stat-done').textContent=projects.filter(p=>p.status === '완료').length;
    $('stat-type').textContent=projects.length ? (templateMeta[projects[projects.length-1].template]?.label || '-') : '-';
    const recentWrap=$('recent-projects'); recentWrap.replaceChildren();
    const recent=projects.slice().reverse().slice(0,4);
    if(!recent.length) recentWrap.append(emptyNode('아직 저장된 홈페이지가 없습니다.')); else recent.forEach(p=>recentWrap.append(projectRow(p)));
    const filter=$('status-filter').value;
    const data=projects.filter(p=>filter==='전체' || p.status===filter);
    const list=$('project-list'); list.replaceChildren();
    if(!data.length) list.append(emptyNode('해당 상태의 저장 항목이 없습니다.')); else data.slice().reverse().forEach(p=>list.append(projectRow(p)));
  }

  function exportRedirectScript(data){
    if(!data.externalRedirect)return '';
    const target=safeHttps(data.linkUrl||'');
    if(!target)return '';
    // Guard against redirect loops and keep the studio's preview isolated.
    const encoded=JSON.stringify(target).replace(/</g,'\\u003c');
    return '<script>(function(){try{const target='+encoded+';const here=new URL(location.href);const dest=new URL(target);if(location.protocol===\'file:\')return;if(here.origin===dest.origin&&here.pathname===dest.pathname&&here.search===dest.search)return;location.replace(dest.href)}catch(e){}})();<\\/script>';
  }
  function buildHtmlDocument(data){
    const meta=templateMeta[data.template] || templateMeta.news;
    const pageTheme=meta.kind==='art'?'gallery':meta.kind==='news'?'newspaper':data.template==='book_launch'?'book':'poetry';
    const artworks=(data.artworks || []).filter(a=>a && a.dataUrl);
    const biography=data.biography || '작가 약력을 준비하고 있습니다.';
    const contact=data.contact || '문의 정보를 준비하고 있습니다.';
    const link=data.linkUrl ? `<p><a href="${esc(data.linkUrl)}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:11px 18px;background:#1f3042;color:#fff;border-radius:10px;text-decoration:none">${esc(data.linkTitle || '관련 사이트 열기')}</a></p>` : '';
    const poemArtHtml=data.poemArt?.dataUrl ? `<section class="block"><h2>자동 생성 시화</h2><img src="${esc(data.poemArt.dataUrl)}" alt="자동 생성 시화" style="width:100%;max-width:480px;display:block;margin:20px auto;border-radius:18px"></section>` : '';
    const reviewHtml=meta.showReview ? `<section class="block"><h2>전체 작품 평론</h2><article>${esc(data.review || '')}</article></section>` : '';
    const cultureHtml=data.template==='culture_news_studio' ? '<section class="block"><h2>오늘의 문화예술 기사 4선</h2>'+ (data.cultureArticles||[]).map((a,i)=>a.title||a.article||a.column ? '<section class="block"><h3>'+esc((i+1)+'. '+(a.title||'문화예술 소식'))+'</h3><article>'+esc(a.article||'원고 작성 중')+'</article><p><small>출처: '+esc(a.source||'출처 확인 필요')+'</small></p><h4>문화칼럼</h4><article>'+esc(a.column||'칼럼 작성 중')+'</article></section>' : '').join('')+'</section>' : '';
    const comicHtml=(meta.showNewsComic && data.newsComic) ? `<section class="block"><h2>그림으로 보는 뉴스 만화</h2><div class="comic-grid ${data.newsComic.panelCount===8?'two':''}">${data.newsComic.panels.map(panel=>`<div class="comic-card"><h4>${panel.index}컷</h4>${panel.image?`<img src="${esc(panel.image)}" alt="${panel.index}컷 뉴스 만화" class="comic-generated-image">`:`<div class="scene-box">${esc(panel.scene)}</div>`}<div class="bubble-box">${esc(panel.bubble)}</div><small>${esc(panel.caption)}</small></div>`).join('')}</div></section>` : '';
    const artworksHtml=artworks.map((a,i)=>`<figure class="art-card"><img src="${esc(a.dataUrl)}" alt="작품 ${i+1}"><figcaption><strong>${esc(a.title||'작품 '+(i+1))}</strong><div class="work-meta">${esc([a.year,a.material,a.size].filter(Boolean).join(' · '))}</div><p>${esc(a.caption||'')}</p></figcaption><div class="music-label">${esc(moodTitle((a.analysis && a.analysis.mood) || 'lyrical'))} · ${esc(((a.analysis && a.analysis.label) || moodLabel('lyrical')))}</div><button class="music-generate" type="button" data-mood="${esc((a.analysis && a.analysis.mood) || data.musicMode || 'lyrical')}" data-work="${i}">♫ 음악 생성·듣기</button><audio controls preload="none" data-mood="${esc((a.analysis && a.analysis.mood) || data.musicMode || 'lyrical')}" data-work="${i}"></audio></figure>`).join('');
    if(meta.kind==='art') {
      const exhibitionCards=artworks.map((a,i)=>`<figure class="work"><div class="work-image"><a href="${esc(a.dataUrl)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(a.title||'작품 '+(i+1))} 확대"><img loading="lazy" src="${esc(a.dataUrl)}" alt="${esc(a.title||'작품 '+(i+1))}"></a></div><figcaption><span class="work-number">WORK ${String(i+1).padStart(2,'0')}</span><h3>${esc(a.title||'작품 '+(i+1))}</h3><p class="material">${esc([a.year,a.material,a.size].filter(Boolean).join(' · '))}</p><p class="commentary">${esc(a.caption||'')}</p><div class="artwork-media-links">${safeHttps(a.musicUrl)?'<a href="'+esc(safeHttps(a.musicUrl))+'" target="_blank" rel="noopener noreferrer">♫ 등록된 음악 감상 ↗</a>':''}${safeHttps(a.videoUrl)?'<a href="'+esc(safeHttps(a.videoUrl))+'" target="_blank" rel="noopener noreferrer">▶ 영상 감상 ↗</a>':''}</div><div class="music"><span>ARTWORK MUSIC · BROWSER DEMO</span><button class="music-generate" type="button" data-mood="${esc((a.analysis&&a.analysis.mood)||data.musicMode||'lyrical')}" data-work="${i}">♫ 감상 음악 생성·재생</button><audio controls preload="none" data-mood="${esc((a.analysis&&a.analysis.mood)||data.musicMode||'lyrical')}" data-work="${i}"></audio></div></figcaption></figure>`).join('');
      return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${esc((data.summary||'').slice(0,150))}"><title>${esc(data.title)} | MYEONGDOJAE</title><style>
      *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#f7f4ed;color:#27372d;font-family:system-ui,'Malgun Gothic',sans-serif;line-height:1.8}a{color:inherit}header{background:#fffdf9;border-bottom:1px solid #e4ded1;padding:17px max(24px,calc((100vw - 1100px)/2));display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;align-items:center}header strong{font-family:Georgia,serif;letter-spacing:.12em}nav{display:flex;gap:18px;font-size:13px}nav a{text-decoration:none}nav a:hover{color:#a07850}
      .hero{text-align:center;padding:85px 22px;background:linear-gradient(125deg,#d9e0d6,#f5efe3 60%,#e5dacc)}.hero small,.kicker{color:#98754f;letter-spacing:.2em;font-weight:700;font-size:11px}.hero h1{font:normal clamp(34px,6vw,70px)/1.25 Georgia,'Noto Serif KR',serif;margin:20px 0}.hero p{font-size:17px;color:#546359}.hero .artist{font-weight:700}
      main{max-width:1100px;margin:auto;padding:32px 23px}section{padding:38px 0;border-bottom:1px solid #e5dfd4}section h2{font:normal 31px Georgia,'Noto Serif KR',serif;margin:9px 0 20px}.copy{white-space:pre-wrap;color:#4e5b50;max-width:880px}.works{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px}.work{margin:0;border:1px solid #e4ddd0;background:#fffdf9}.work-image{background:#eae5dc;aspect-ratio:4/3;display:grid;place-items:center;overflow:hidden}.work-image img{display:block;width:100%;height:100%;object-fit:contain}.work figcaption{padding:22px}.work-number,.music>span{display:block;color:#9f7951;font-size:11px;letter-spacing:.15em}.work h3{font:normal 25px Georgia,'Noto Serif KR',serif;margin:6px 0}.material{font-size:13px;color:#7b7467}.commentary{white-space:pre-wrap}.artwork-media-links{display:flex;gap:10px;flex-wrap:wrap;margin:14px 0}.artwork-media-links a{font-size:13px;color:#75563b;border:1px solid #ab967c;padding:7px 11px;text-decoration:none}.music{margin-top:20px;padding-top:13px;border-top:1px solid #e7dfd0}.music-generate{cursor:pointer;background:#304638;color:#fff;border:none;padding:10px 14px;margin:12px 0;border-radius:3px}.music audio{width:100%}.button{display:inline-block;padding:10px 17px;border:1px solid #a58560;text-decoration:none;color:#675136}footer{text-align:center;background:#27382f;color:#faf6ec;padding:36px}.hint{font-size:13px;color:#6b726b}@media(max-width:700px){.works{grid-template-columns:1fr}.hero{padding:64px 18px}section h2{font-size:26px}}
      </style></head><body>${exportRedirectScript(data)}<header><strong>MYEONGDOJAE · 明道</strong><nav><a href="#artist">작가 소개</a><a href="#works">작품 감상</a><a href="#review">전시 평론</a><a href="#contact">안내</a></nav></header><div class="hero"><small>MYEONGDOJAE · ARTIST EXHIBITION</small><h1>${esc(data.title)}</h1><p>${esc(data.subtitle||'작품과 음악이 만나는 디지털 미술관')}</p><p class="artist">${esc(data.owner)}</p></div><main><section id="artist"><div class="kicker">ABOUT THE ARTIST</div><h2>작가 소개</h2><div class="copy">${esc(biography)}</div></section><section id="intro"><div class="kicker">EXHIBITION STORY</div><h2>전시 이야기</h2><div class="copy">${esc([data.summary,data.mainText].filter(Boolean).join('\\n\\n'))}</div>${link}</section><section id="works"><div class="kicker">ARTWORK & MUSIC</div><h2>작품과 음악 감상</h2><p class="hint">작품 이미지를 누르면 크게 감상할 수 있습니다. 작품별 음악 버튼은 브라우저에서 간단한 기악 음향을 생성합니다.</p><div class="works">${exhibitionCards||'<p>아직 등록된 작품이 없습니다.</p>'}</div></section><section id="review"><div class="kicker">CURATORIAL REVIEW</div><h2>미술평론</h2><div class="copy">${esc(data.review||'전시 평론 준비 중')}</div></section><section id="contact"><div class="kicker">INFORMATION</div><h2>전시 안내 · 문의</h2><div class="copy">${esc(contact)}</div></section></main><footer>© 2026 MYEONGDOJAE · 명도재 이명우</footer>${musicRuntime()}</body></html>`;
    }
    return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(data.title)}</title><meta name="description" content="${esc((data.summary || '').slice(0,150))}"><style>*{box-sizing:border-box}body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Malgun Gothic",sans-serif;background:#faf8f3;color:#223143;line-height:1.75}header,footer{background:#1f3042;color:#fff;padding:20px 6%}header{display:flex;justify-content:space-between;gap:20px;align-items:center;flex-wrap:wrap}nav{display:flex;gap:14px;flex-wrap:wrap}nav a{color:#fff;text-decoration:none}nav a:hover{text-decoration:underline}main{max-width:1180px;margin:auto;padding:48px 6%}body.newspaper{background:#f7f4ed;color:#252525}body.newspaper h1{font-family:Georgia,serif;border-bottom:4px double #262626;padding-bottom:18px}body.newspaper header{background:#272727}body.gallery{background:#f7f4ee}body.gallery .art-grid{grid-template-columns:repeat(2,minmax(0,1fr))}body.gallery .art-card img{max-height:520px}.work-meta{font-size:13px;color:#74685b;margin-top:5px}.art-card figcaption p{white-space:pre-wrap;margin:9px 0}body.poetry{background:#f6f3eb}body.poetry .hero{max-width:770px;margin:auto;text-align:center}body.poetry article{font-family:serif;font-size:1.1rem;line-height:2.1}body.book{background:#f4f0e8}body.book .hero{border-left:6px solid #9a745c;padding-left:24px}h1{font-size:clamp(30px,5vw,56px)}article{white-space:pre-wrap;background:#fff;border-radius:16px;padding:20px;border:1px solid #ece7de}.hero{padding:22px 0 30px}.block{margin:28px 0}.art-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.art-card,.comic-card{background:#fff;border:1px solid #e8e1d3;border-radius:18px;padding:14px}.art-card img{width:100%;max-height:360px;object-fit:contain;border-radius:14px;display:block;background:#f8f5ef}.art-card figcaption{white-space:pre-wrap;margin-top:10px}.music-label{margin-top:10px;font-size:13px;color:#475569}.art-card audio{display:block;width:100%;margin-top:8px}.music-generate{margin-top:10px;border:0;border-radius:10px;padding:10px 14px;background:#24384e;color:#fff;cursor:pointer}.comic-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.comic-grid.two{grid-template-columns:repeat(2,minmax(0,1fr))}.comic-generated-image{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:10px;display:block}.scene-box{min-height:86px;padding:12px;border-radius:12px;background:#e8eef6}.bubble-box{margin-top:10px;padding:12px;border-radius:18px;background:#fff;border:1px solid #dbe3ee;position:relative}.bubble-box:before{content:'';position:absolute;left:16px;top:-8px;border-left:8px solid transparent;border-right:8px solid transparent;border-bottom:8px solid #fff}@media(max-width:980px){.art-grid,.comic-grid{grid-template-columns:1fr 1fr}}@media(max-width:640px){.art-grid,.comic-grid{grid-template-columns:1fr}}</style></head><body class="${pageTheme}">${exportRedirectScript(data)}<header><strong>明道 · 명도재 아트웹</strong><nav><a href="#intro">작품 소개</a><a href="#bio">작가 약력</a><a href="#contact">문의</a></nav></header><main><section class="hero"><small>${esc(meta.label)}</small><h1>${esc(data.title)}</h1><p>${esc(data.subtitle || '')}</p><p><strong>${esc(data.owner)}</strong></p></section><section id="intro" class="block"><h2>소개</h2><article>${esc(data.summary || '')}</article></section>${link}<section class="block"><h2>${esc(meta.kind==='art'?'전시 소개':'본문')}</h2><article>${esc(data.mainText || '')}</article></section>${cultureHtml}${comicHtml}<section class="block"><h2>${esc(meta.kind==='art'?'작품':'그림 · 작품')}</h2><div class="art-grid">${artworksHtml || '<p>등록된 작품이 없습니다.</p>'}</div></section>${reviewHtml}${poemArtHtml}<section id="bio" class="block"><h2>작가 약력</h2><article>${esc(biography)}</article></section><section id="contact" class="block"><h2>문의</h2><article>${esc(contact)}</article></section></main><footer>명도재 문화예술 홈페이지 제작소 · 시안</footer>${musicRuntime()}</body></html>`;
  }

  function musicRuntime(){
    return `<script>(function(){
      function patternForMood(mood){
        return {lyrical:[57,60,64,69,67,64,60,59], majestic:[48,55,60,64,67,64,60,55], fresh:[60,64,67,72,69,67,64,62], calm:[55,59,62,67,64,62,59,57]}[mood]||[57,60,64,69,67,64,60,59];
      }
      function makeWav(mood,work){
        var rate=16000,seconds=28,count=rate*seconds,out=new Int16Array(count), motif=patternForMood(mood), shift=(work%4)*2;
        var tempo=mood==='majestic'?0.68:mood==='fresh'?0.42:mood==='calm'?0.62:0.58;
        function addTone(note,start,dur,vol){
          var freq=440*Math.pow(2,(note+shift-69)/12), begin=Math.round(start*rate), end=Math.min(count,Math.round((start+dur)*rate));
          for(var i=begin;i<end;i++){
            var t=(i-begin)/rate, env=Math.min(1,t/0.06)*Math.min(1,(dur-t)/0.18);
            var tone=Math.sin(2*Math.PI*freq*t)*0.7 + Math.sin(2*Math.PI*freq*2*t)*0.15;
            out[i]=Math.max(-32767,Math.min(32767,out[i] + tone*env*vol*32767));
          }
        }
        for(var step=0;step<Math.ceil(seconds/tempo);step++){
          var at=step*tempo, note=motif[step%motif.length], dur=Math.min(tempo*0.92, seconds-at);
          addTone(note,at,dur,0.16);
          if(step%4===0){ addTone(motif[0]-12,at,Math.min(tempo*3.6,seconds-at),0.08); addTone(motif[2]-12,at,Math.min(tempo*3.6,seconds-at),0.05); }
        }
        var buf=new ArrayBuffer(44+count*2), view=new DataView(buf);
        function word(i,n){view.setUint32(i,n,true);} function short(i,n){view.setUint16(i,n,true);} function tag(i,t){ for(var k=0;k<t.length;k++) view.setUint8(i+k,t.charCodeAt(k)); }
        tag(0,'RIFF'); word(4,36+count*2); tag(8,'WAVE'); tag(12,'fmt '); word(16,16); short(20,1); short(22,1); word(24,rate); word(28,rate*2); short(32,2); short(34,16); tag(36,'data'); word(40,count*2);
        for(var j=0;j<count;j++) view.setInt16(44+j*2,out[j],true);
        return URL.createObjectURL(new Blob([buf],{type:'audio/wav'}));
      }
      var audios=Array.from(document.querySelectorAll('audio[data-mood]'));
      audios.forEach(function(audio){
        var btn=audio.parentNode.querySelector('.music-generate'); var creating=false;
        function prepare(){ if(audio.src || creating) return; creating=true; try{ audio.src=makeWav(audio.dataset.mood, Number(audio.dataset.work)||0); audio.load(); }catch(e){ console.error(e);} creating=false; }
        if(btn) btn.addEventListener('click', function(){ prepare(); audio.play().catch(function(err){console.error(err);}); });
        audio.addEventListener('play', function(){ audios.forEach(function(other){ if(other!==audio) other.pause(); }); if(!audio.src) prepare(); });
      });
      window.addEventListener('pagehide', function(){ audios.forEach(function(audio){ if(audio.src && audio.src.indexOf('blob:')===0) URL.revokeObjectURL(audio.src); }); });
    })();<\/script>`;
  }

  function previewBuiltPage(){
    const data=collectFormData();
    const html=buildHtmlDocument(data);
    $('built-preview').srcdoc=html; $('built-preview-box').hidden=false; $('built-preview-box').scrollIntoView({behavior:'smooth',block:'start'});
    $('form-feedback').textContent='생성된 홈페이지 미리보기를 확인하세요. 음악 조절바는 아래 iframe 안에서 확인할 수 있습니다.';
  }
  function downloadSite(){
    const data=collectFormData(); const html=buildHtmlDocument(data); const blob=new Blob([html],{type:'text/html;charset=utf-8'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=(data.title || 'myeongdo-artweb') + '.html'; document.body.append(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  }
  function exportJson(){ const blob=new Blob([JSON.stringify(projects,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='myeongdo-artweb-data.json'; document.body.append(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(a.href),1000); }
  function downloadManuscript(){ if(!manuscript) return; const href=manuscript.dataUrl || 'data:text/plain;charset=utf-8,' + encodeURIComponent(manuscript.text || ''); const a=document.createElement('a'); a.href=href; a.download=manuscript.name || 'manuscript'; document.body.append(a); a.click(); a.remove(); }

  document.querySelectorAll('[data-view]').forEach(btn=>btn.addEventListener('click',()=>view(btn.dataset.view)));
  window.addEventListener('hashchange',()=>{ const name=location.hash.slice(1); if(headings[name]) view(name); });
  // A simple-first editing experience; advanced editing never discards saved data.
  let editorMode='simple';
  function setEditorMode(mode){
    editorMode=mode==='advanced'?'advanced':'simple';
    $('project-form').classList.toggle('studio-simple',editorMode==='simple');
    $('mode-simple').classList.toggle('mode-active',editorMode==='simple');
    $('mode-advanced').classList.toggle('mode-active',editorMode==='advanced');
    $('mode-simple').setAttribute('aria-pressed',String(editorMode==='simple'));
    $('mode-advanced').setAttribute('aria-pressed',String(editorMode==='advanced'));
    const more=['status','manuscript-file','link-url','music-mode','comic-panels'];
    if(editorMode==='simple'){
      const needsAdvanced=$('template').value==='news' && $('link-url').value.trim();
      if(needsAdvanced)$('form-feedback').textContent='기사 링크는 상세 설정에서 언제든 수정할 수 있습니다.';
    }
  }
  $('mode-simple').addEventListener('click',()=>setEditorMode('simple'));
  $('mode-advanced').addEventListener('click',()=>setEditorMode('advanced'));
  $('preview-refresh').addEventListener('click',()=>{renderPreview();$('form-feedback').textContent='최신 입력으로 미리보기를 갱신했습니다.';});
  $('external-redirect').addEventListener('change',redirectTargetStatus);
  $('link-url').addEventListener('input',redirectTargetStatus);
  redirectTargetStatus();
  $('main-text').addEventListener('input',()=>{$('main-text-count').textContent=$('main-text').value.length.toLocaleString('ko-KR');});
  $('new-project-btn').addEventListener('click',()=>{ clearForm(); view('create'); });
  $('hero-create-btn').addEventListener('click',()=>{ clearForm(); view('create'); });
  document.querySelectorAll('[data-studio-template]').forEach(button=>button.addEventListener('click',()=>{
    clearForm();
    const type=button.dataset.studioTemplate;
    if(templateMeta[type]){
      $('template').value=type;
      if(type==='news'||type==='culture_news_studio')$('comic-panels').value='8';
      applyTemplateMode();
    }
    view('create');
  }));
  $('template').addEventListener('change',()=>{if($('template').value==='news'){$('comic-panels').value='8';if(!$('link-title').value.trim())$('link-title').value='기사 원문 보기';}if($('template').value==='culture_news_studio'){$('comic-panels').value='8';if(!$('title').value.trim())$('title').value='명도재 이명우의 대구문화예술 뉴스 신문';if(!$('owner').value.trim())$('owner').value='명도재 이명우';if(!$('subtitle').value.trim())$('subtitle').value='대구 문화예술의 현장을 기사와 만화와 칼럼으로 읽다';}else if($('template').value==='culture_paper'){$('comic-panels').value='8';if(!$('title').value.trim())$('title').value='명도재 이명우의 대구문화예술신문';if(!$('owner').value.trim())$('owner').value='명도재 이명우';if(!$('summary').value.trim())$('summary').value='10월 23일자 발행! 대구국제아트페어, 앤디 워홀전, 고야 판화전, 학생동아리 한마당 소식을 기사·8컷 만화·칼럼으로 만나보세요.';if(!$('link-url').value.trim())$('link-url').value='https://myeongdo-daegu-culture.korea8014lee.chatgpt.site';if(!$('link-title').value.trim())$('link-title').value='대구문화예술신문 읽기';}applyTemplateMode();});
  $('clear-form').addEventListener('click',clearForm);
  $('status-filter').addEventListener('change',renderProjectLists);
  $('export-json').addEventListener('click',exportJson);
  $('reset-samples').addEventListener('click',()=>{ if(confirm('저장한 모든 홈페이지를 삭제하고 기본 예시로 초기화할까요?')){ mutateProjects(structuredSamples()); $('status-filter').value='전체'; }});
  $('auto-critique').addEventListener('click',()=>{ const result=generateCritiqueText(); if(!result) return; $('overall-review').value=result; renderPreview(); $('form-feedback').textContent='작품 설명과 분위기를 바탕으로 약 200자의 평론 초안을 작성했습니다.'; });
  $('generate-poem-art').addEventListener('click',()=>{ const result=generatePoemArtSvg(); if(result){ renderPoemArt(); renderPreview(); $('form-feedback').textContent='시의 내용을 분석한 삽화형 시화가 생성되었습니다. 세로형·가로형 비율은 내용에 따라 자동 선택됩니다.'; }});
  $('download-poem-art').addEventListener('click',()=>{ if(!poemArt){ alert('먼저 시화를 생성하세요.'); return; } const a=document.createElement('a'); a.href='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(poemArt.svg); a.download=(($('title').value.trim() || 'poem-art') + '.svg'); document.body.append(a); a.click(); a.remove(); });
  $('remove-poem-art').addEventListener('click',()=>{ poemArt=null; renderPoemArt(); renderPreview(); $('form-feedback').textContent='생성된 시화가 삭제되었습니다.'; });
  $('generate-nano-comic').addEventListener('click',()=>generateNanoComic().catch(e=>{alert('그림 생성 오류: '+e.message);$('generate-nano-comic').disabled=false;}));
  $('generate-news-comic').addEventListener('click',()=>{ const result=generateNewsComicData(); if(result){ renderNewsComic(); renderPreview(); $('form-feedback').textContent=`${result.panelCount}컷 뉴스 만화 시안이 생성되었습니다.`; }});
  $('remove-news-comic').addEventListener('click',()=>{ newsComic=null; renderNewsComic(); renderPreview(); $('form-feedback').textContent='뉴스 만화가 삭제되었습니다.'; });
  $('preview-site-btn').addEventListener('click',previewBuiltPage);
  $('download-site').addEventListener('click',downloadSite);
  $('download-manuscript').addEventListener('click',downloadManuscript);
  $('remove-manuscript').addEventListener('click',()=>{ manuscript=null; $('manuscript-file').value=''; renderManuscript(); $('form-feedback').textContent='원고 파일이 삭제되었습니다.'; });
  $('manuscript-file').addEventListener('change', async (e)=>{
    const file=e.target.files[0]; if(!file) return; const ext=file.name.split('.').pop().toLowerCase();
    if(!['jpg','jpeg','hwp','txt'].includes(ext) || file.size>800*1024){ alert('JPG · HWP · TXT 파일만 가능하며 800KB 이하여야 합니다.'); e.target.value=''; return; }
    const kind=ext==='jpeg' ? 'jpg' : ext; const dataUrl=await fileToDataUrl(file); manuscript={name:file.name,kind,dataUrl,text:''};
    if(kind==='txt'){ const text=await file.text(); manuscript.text=text; $('main-text').value=text.slice(0,20000); }
    renderManuscript(); renderPreview(); $('form-feedback').textContent='원고 파일이 불러와졌습니다.';
  });

  ['title','owner','subtitle','biography','contact','summary','main-text','overall-review','link-title','link-url','status'].forEach(id=>$(id).addEventListener('input',renderPreview));
  $('music-mode').addEventListener('change', async ()=>{
    for(let i=0;i<artworks.length;i++) if(artworks[i].dataUrl) artworks[i].analysis=await analyzeArtworkMood(artworks[i].dataUrl, artworks[i].caption || '', $('music-mode').value);
    renderUploadCards(); renderPreview();
  });
  $('comic-panels').addEventListener('change',()=>{ if(newsComic) generateNewsComicData(); renderNewsComic(); renderPreview(); });

  $('project-form').addEventListener('submit',(e)=>{
    e.preventDefault();
    if(!$('title').value.trim() || !$('owner').value.trim()){ alert('홈페이지 제목과 작가·단체명을 입력하세요.'); return; }
    const data=collectFormData();
    const next=projects.slice(); const index=next.findIndex(p=>p.id===data.id); if(index>=0) next[index]=data; else next.push(data);
    if(mutateProjects(next)){ $('status-filter').value='전체'; $('form-feedback').textContent='홈페이지가 저장되었습니다.'; clearForm(); view('projects'); }
  });

  applyTemplateMode(); setEditorMode('simple'); renderManuscript(); renderPoemArt(); renderNewsComic(); renderPreview(); renderProjectLists(); view(location.hash.replace('#','') || 'dashboard');
})();