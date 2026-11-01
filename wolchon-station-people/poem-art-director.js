/* 명도재 월촌역 3시인 문학관: 작품별 정밀 스테인드글라스 시화 디렉터
 * 각 제목에 맞춘 장면 연출표와 독립적 SVG 그림을 사용합니다.
 * 웹 브라우저에서 동작하며 외부 AI 서비스/API 키가 필요하지 않습니다.
 * 새 작품을 추가할 때 SCENES에 소재와 주요 화풍을 등록하세요.
 */
(function(){
"use strict";
const SCENES={"보리 보리 쌀":["hands","유년의 손놀이, 두 손과 붉은 노을, 그리운 어린 시절","#17375f","#e88b58"],"선물":["gift","대명동 옛 골목, 조그만 셋방, 김 꾸러미, 오래된 시간","#344b70","#f2bb75"],"낮별":["station","월촌역 지하철 입구, 커피 잔과 낮하늘의 희미한 별","#275d82","#f1cd86"],"우편함":["mail","옛 우편함과 손편지, 고요한 골목, 쓸쓸한 저녁","#385b75","#e9a75f"],"향기의 행방":["flowerfield","영천 꽃밭, 유채꽃과 작약, 웃음, 봄 소풍","#2b5578","#e9c568"],"산바람에 귀를 대고":["mountain","가창 우록 산길, 박새와 분홍 꽃망울, 맑은 산바람","#32617b","#e7b0a2"],"가을 분실물":["pocket","빈 주머니와 가을바람, 낙엽이 흐르는 거리","#1d365f","#f2a150"],"신기루":["dust","돌개바람과 먼지, 저녁노을, 흩어지는 깃털","#254985","#e5a056"],"엄마 생각":["home","아랫목에 잠든 아이들, 어머니의 따뜻한 손","#374f77","#f0b48b"],"상사화":["lily","꽃과 잎이 만나지 못하는 붉은 상사화 꽃밭","#345f7a","#e96567"],"휘날리는 태극기는":["flag","푸른 하늘에 태극기, 산 능선과 강물","#184478","#e8bf70"],"강":["river","굽이치는 강과 황금빛 수면, 저 멀리 산","#285478","#bfcfa8"],"아버지의 지게":["father","황토길을 걷는 아버지, 어깨 위 지게, 저녁 산마을","#39516a","#eab573"],"보름달":["moon","호수 위에 떠오른 보름달과 고요한 빈 배","#233568","#f1cd85"],"개망초 꽃":["daisy","하얀 개망초 꽃이 가득한 들길, 조용한 아내의 손","#3a6377","#f1d4a8"],"모란이 피던 날":["peony","붉은 모란과 미소 짓는 아내, 푸른 하늘 담긴 항아리","#385a80","#e79eae"],"나는 누구에겐가 안기고 싶다":["subway","쓸쓸한 퇴근길 지하철과 고독한 승객","#1c366a","#f2be84"],"꿈꾸는 크레파스":["crayon","빨간 크레파스, 무지개, 지붕 위 수탉, 흔들리는 그네","#3b4595","#f59c65"],"뿌리":["well","윤동주를 떠올리는 오래된 우물, 별, 바람과 나무뿌리","#1a356c","#f2c985"],"가을 타기":["autumn","포장마차와 외로운 남자, 라이터, 가로등, 보름달, 홍시","#112f77","#ed8c4a"],"하나뿐인 예쁜 딸아":["daughter","따뜻한 부녀의 정, 봄꽃과 나비, 햇살","#345b87","#f4a2b3"],"세월이 가르쳐 준 삶의 품격":["tree","오래된 나무와 넓게 뻗은 가지, 시간의 햇살","#30516c","#d6b778"],"그림자의 동행":["couple","노을길을 나란히 걷는 두 사람과 긴 그림자","#2f4379","#e6aa89"],"물안개":["mist","새벽 호수 위에 번지는 물안개와 산그림자","#2d5878","#a7c8cd"],"막걸리를 마시며":["bowl","막걸리 사발과 손, 조용한 밤 풍경","#384970","#e5cda8"],"별이 된 아들아":["sonstar","별빛 아래 두 사람의 실루엣과 따뜻한 추모","#17275d","#e9c790"]};
const S={moon:(x,y,r)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#fff0aa" stroke="#271c36" stroke-width="9"/><circle cx="${x-20}" cy="${y-15}" r="${r*.21}" fill="#e7cf96" opacity=".58"/>`,tree:(x,y)=>`<path d="M${x} 620 Q${x-22} 380 ${x+4} 240M${x+1} 365L${x-175} 210M${x} 305L${x+164} 170" fill="none" stroke="#211c34" stroke-width="24" stroke-linecap="round"/>`,person:(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})" stroke="#251b37" stroke-width="9" stroke-linejoin="round"><path d="M-85 130Q-85 28-40 10H48Q103 45 99 160L123 365H-124Z" fill="#51446d"/><path d="M-38 -12Q-67-45-55-90Q-29-143 26-121Q83-102 63-48L43 4Z" fill="#bb8a6c"/><path d="M-63 -85Q-60-149 2-155Q72-149 75-87L32-115Z" fill="#272337"/><path d="M-76 75L-132 201M70 80L128 203" fill="none" stroke="#473a59" stroke-width="35"/></g>`,house:(x,y)=>`<g stroke="#281e35" stroke-width="8"><path d="M${x-108} ${y}L${x} ${y-95}L${x+107} ${y}Z" fill="#b74d5c"/><rect x="${x-100}" y="${y}" width="200" height="160" fill="#e6a768"/><rect x="${x-38}" y="${y+63}" width="76" height="97" fill="#544368"/><rect x="${x-84}" y="${y+35}" width="40" height="49" fill="#ffe1a1"/><rect x="${x+44}" y="${y+35}" width="40" height="49" fill="#ffe1a1"/></g>`,flower:(x,y,r,col)=>`<g stroke="#352341" stroke-width="3"><path d="M${x} ${y}Q${x-22} ${y+110} ${x+6} ${y+200}" fill="none" stroke="#356952" stroke-width="8"/>${Array.from({length:7},(_,i)=>{let a=i*6.283/7;return `<ellipse cx="${x+Math.cos(a)*r*.6}" cy="${y+Math.sin(a)*r*.6}" rx="${r*.52}" ry="${r*.36}" transform="rotate(${i*360/7} ${x+Math.cos(a)*r*.6} ${y+Math.sin(a)*r*.6})" fill="${col}"/>`}).join("")}<circle cx="${x}" cy="${y}" r="${r*.22}" fill="#ffdc79"/></g>`};
const esc=(s)=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;"}[c]));
function glassPieces(seed){
 let state=seed||123456;const rng=()=>{state=(1664525*state+1013904223)>>>0;return state/4294967296};
 let out='<g opacity=".46">';
 for(let row=0;row<18;row++)for(let col=0;col<34;col++){
  let x=col*37-20,y=row*40-20,w=31+rng()*23,h=30+rng()*25;
  let p=['#244681','#51388d','#185e91','#c55a76','#ffce69','#e88753','#7d9db8'][Math.floor(rng()*7)];
  out+='<path d="M'+x+' '+y+'l'+w+' '+(rng()*8)+' -'+(rng()*13)+' '+h+' -'+(w-rng()*8)+' -'+(rng()*7)+'Z" fill="'+p+'" stroke="#14152d" stroke-width="2.5"/>';
 }
 return out+'</g>';
}
function scene(spec){
 const [kind,,dark,light]=spec;let o='';
 const hills='<path d="M0 470Q175 345 365 438T745 399T1200 416V680H0Z" fill="#193460" stroke="#211c3c" stroke-width="8"/><path d="M0 547Q285 473 525 542T1200 490V680H0Z" fill="#3a5180" stroke="#26213c" stroke-width="7"/>';
 const road='<path d="M0 568Q330 498 630 580T1200 536V680H0Z" fill="#71536e"/><path d="M40 625Q280 545 540 625T1180 580" fill="none" stroke="#f8be70" stroke-width="14" opacity=".8"/>';
 const star=(x,y,r)=>'<path d="M'+x+' '+(y-r)+'l'+(r*.26)+' '+(r*.67)+' '+(r*.72)+' '+(r*.33)+' -'+(r*.72)+' '+(r*.18)+' -'+(r*.26)+' '+(r*.82)+' -'+(r*.26)+' -'+(r*.82)+' -'+(r*.72)+' -'+(r*.18)+' '+(r*.72)+' -'+(r*.33)+'Z" fill="#ffdf89" stroke="#251c41" stroke-width="4"/>';
 const bird=(x,y)=>'<path d="M'+(x-35)+' '+y+'q26 -26 40 -6q26 -24 54 6q-40 -12 -51 8q-20 -18 -43 -8Z" fill="#151a2d" stroke="#dcd7c5" stroke-width="3"/>';
 if(['autumn','pocket','dust','station','subway','crayon'].includes(kind))o+=road;else o+=hills;
 if(['autumn','moon','mist','sonstar','well','couple','bowl','station'].includes(kind))o+=S.moon(980,125,84);
 if(['autumn','tree','mountain','daughter','pocket','father','daisy','flowerfield','lily','peony','crayon','dust','well'].includes(kind))o+=S.tree(180,315);
 if(['autumn','station','subway','couple','father','home','bowl','daughter','sonstar','hands','crayon'].includes(kind))o+=S.person(850,360,.79);
 if(['gift','home','father','mail','station','subway','autumn','bowl'].includes(kind))o+=S.house(310,365);
 if(['flowerfield','daisy','lily','peony','daughter','mountain'].includes(kind))for(let i=0;i<14;i++)o+=S.flower(55+(i*83)%1120,410+(i*57)%155,21+(i%3)*9,i%3===0?'#f6bacd':i%3===1?'#ffe3aa':'#e37791');
 if(kind==='autumn'){
  o+='<path d="M40 125Q260 25 535 104M150 133L550 198" fill="none" stroke="#221828" stroke-width="22"/>';
  o+='<circle cx="534" cy="211" r="29" fill="#f57a37" stroke="#281b32" stroke-width="8"/>';
  o+='<path d="M535 185l-12 8 14 8 15 -9Z" fill="#598454"/>'+bird(1054,350);
  o+='<path d="M554 195V573" stroke="#282134" stroke-width="18"/><circle cx="554" cy="270" r="38" fill="#ffe4a1" stroke="#c18b54" stroke-width="7"/>';
  o+='<path d="M790 531L865 503" stroke="#ecc298" stroke-width="17"/><path d="M864 503l21 -15" stroke="#efad68" stroke-width="8"/><path d="M880 475l9 -27" stroke="#ffe6a1" stroke-width="9"/>';
  o+='<path d="M75 359L305 293L500 367V548H75Z" fill="#d85b46" fill-opacity=".35" stroke="#211c33" stroke-width="12"/>';
 }
 if(kind==='hands')o+='<path d="M260 615Q280 470 350 465L392 560Q400 438 432 450L446 575Q485 486 515 503L505 636Z" fill="#f0b58c" stroke="#523757" stroke-width="10"/>';
 if(kind==='gift')for(let i=0;i<8;i++)o+='<path d="M'+(540+i*37)+' '+(495-i*16)+'l110 -24 17 32 -110 22Z" fill="'+(i%2?'#f3dd9f':'#4d665c')+'" stroke="#392840" stroke-width="5"/>';
 if(kind==='mail')o+='<rect x="650" y="335" width="220" height="240" rx="15" fill="#b85b61" stroke="#2c263d" stroke-width="12"/><path d="M683 397h153M700 444l58 57 55 -57" stroke="#f9db9e" stroke-width="10" fill="none"/>';
 if(kind==='well')o+='<ellipse cx="605" cy="520" rx="180" ry="80" fill="#75b2c1" stroke="#a9a0aa" stroke-width="22"/><path d="M430 517V630M780 516V630M600 437V365" stroke="#554755" stroke-width="19"/>'+star(650,503,23)+star(575,535,18);
 if(['moon','mist','river'].includes(kind))o+='<path d="M0 570Q200 518 370 570T710 555T1200 550V680H0Z" fill="#6bb0bb" stroke="#2b506e" stroke-width="9"/><path d="M450 593q140 -35 280 0M720 637q140 -25 305 0" stroke="#fbe5aa" stroke-width="11" fill="none"/>';
 if(kind==='flag')o+='<path d="M300 600V170M310 190Q565 105 870 200V435Q590 365 310 480Z" fill="#f7f6eb" stroke="#38374c" stroke-width="12"/><circle cx="585" cy="319" r="84" fill="#dc5157"/><path d="M501 319a84 84 0 0 0 168 0Z" fill="#3467a9"/>';
 if(kind==='peony')o+=S.flower(795,350,116,'#f2a4bb')+S.flower(590,490,82,'#ed758e');
 if(kind==='bowl')o+='<ellipse cx="508" cy="550" rx="190" ry="80" fill="#faf2d9" stroke="#9b8194" stroke-width="13"/><ellipse cx="508" cy="524" rx="168" ry="48" fill="#e4d4b3"/>';
 if(kind==='crayon')o+='<path d="M130 420Q600 -95 1060 380" fill="none" stroke="#e95267" stroke-width="26"/><path d="M144 432Q605 -43 1045 389" fill="none" stroke="#f7cf68" stroke-width="19"/><path d="M160 444Q606 2 1030 400" fill="none" stroke="#69c6a5" stroke-width="13"/>';
 if(kind==='sonstar'||kind==='station')for(let i=0;i<13;i++)o+=star(130+i*83,65+(i%4)*36,9+i%3*5);
 if(kind==='lily'||kind==='daisy'||kind==='peony'||kind==='flowerfield')for(let i=0;i<8;i++)o+=S.flower(75+i*150,465+(i%3)*37,39+(i%3)*12,kind==='lily'?'#ee4867':kind==='daisy'?'#fff8e7':'#f5a2ac');
 return o;
}

/* 세밀한 색유리 분할: 풍경과 인물의 표면 전체에 12~22px 색유리 조각을 입힘.
   시 제목을 시드로 사용해 작품마다 패턴이 다르고, 새로고침해도 동일하게 재현됨. */
function microGlass(seed){
 let s=(seed^0x9e3779b9)>>>0;
 const rand=()=>{s=(Math.imul(1664525,s)+1013904223)>>>0;return s/4294967296};
 const colors=['#fed49a','#e77b54','#493b9f','#2675bc','#f1ac72','#e4d4ff','#9ba4e6','#ffecbf'];
 let out='<g style="mix-blend-mode:soft-light" pointer-events="none">';
 for(let row=0;row<45;row++){
  for(let col=0;col<76;col++){
   const x=col*16-8,y=row*16-8;
   const x1=x+rand()*4,y1=y+rand()*4;
   const x2=x+14+rand()*4,y2=y+rand()*5;
   const x3=x+14+rand()*4,y3=y+14+rand()*5;
   const x4=x+rand()*4,y4=y+14+rand()*5;
   const midx=(x1+x3)/2,midy=(y1+y3)/2;
   const c=colors[Math.floor(rand()*colors.length)];
   const opacity=(.15+rand()*.22).toFixed(2);
   out+='<path d="M'+x1+' '+y1+'L'+x2+' '+y2+'L'+midx+' '+midy+'Z" fill="'+c+'" fill-opacity="'+opacity+'" stroke="#110f28" stroke-opacity=".55" stroke-width="1.65"/>';
   out+='<path d="M'+x2+' '+y2+'L'+x3+' '+y3+'L'+x4+' '+y4+'L'+midx+' '+midy+'Z" fill="'+colors[Math.floor(rand()*colors.length)]+'" fill-opacity=".21" stroke="#130f29" stroke-opacity=".60" stroke-width="1.7"/>';
   out+='<path d="M'+x4+' '+y4+'L'+x1+' '+y1+'L'+midx+' '+midy+'Z" fill="'+c+'" fill-opacity=".14" stroke="#120f27" stroke-opacity=".53" stroke-width="1.5"/>';
   if(rand()>.89)out+='<path d="M'+(x1+2)+' '+(y1+2)+'l'+(5+rand()*6)+' 1" stroke="#fff9d0" stroke-opacity=".65" stroke-width="1.1"/>';
  }
 }
 return out+'</g>';
}
/* 작품마다 서로 다른 핵심 장면을 보강하는 세부 오브제 */
function poeticDetails(kind){
 let o='';
 const petal=(x,y,c)=>'<path d="M'+x+' '+y+'q-14 -17 1 -28q22 12 -1 28Z" fill="'+c+'" stroke="#2e2440" stroke-width="3"/>';
 const light=(x,y)=>'<circle cx="'+x+'" cy="'+y+'" r="21" fill="#ffde93" stroke="#392441" stroke-width="6"/><circle cx="'+x+'" cy="'+y+'" r="56" fill="#fdbd69" fill-opacity=".13"/>';
 if(kind==='autumn'){for(let i=0;i<25;i++)o+=petal(58+i*43,594+(i%4)*18,i%3?'#fbb45c':'#c63b49');for(let i=0;i<8;i++)o+=light(265+i*98,377+(i%3)*32);o+='<path d="M570 500q50 -90 80 0t80 0" fill="none" stroke="#f9d898" stroke-width="6"/>';}
 if(kind==='crayon'){o+='<path d="M820 490l75 -190 29 17 -71 189Z" fill="#e8404c" stroke="#2b2140" stroke-width="8"/><path d="M895 300l15 -36 14 53Z" fill="#f5cd91" stroke="#292440" stroke-width="6"/><path d="M300 520q150 -100 320 0" fill="none" stroke="#d9c28b" stroke-width="16"/>';}
 if(kind==='subway'||kind==='station'){o+='<rect x="150" y="415" width="445" height="118" rx="18" fill="#879cbd" stroke="#28314c" stroke-width="11"/>';for(let i=0;i<5;i++)o+='<rect x="'+(179+i*80)+'" y="433" width="55" height="72" fill="#dce7e5" stroke="#34425e" stroke-width="5"/>';o+='<circle cx="261" cy="537" r="27" fill="#27283e"/><circle cx="484" cy="537" r="27" fill="#27283e"/>';}
 if(kind==='well'){o+='<path d="M430 500q190 -128 354 0" fill="none" stroke="#a4b8c5" stroke-width="16"/><path d="M600 380v155" stroke="#9a674e" stroke-width="11"/><path d="M562 525q39 41 76 0" fill="none" stroke="#ffdc7b" stroke-width="6"/>';}
 if(kind==='father'){o+='<path d="M330 465l170 -145 190 136M375 335l310 130M520 315l-5 260" stroke="#7b4c37" stroke-width="17" fill="none"/><path d="M330 465l170 -145 190 136" stroke="#e5bd83" stroke-width="5" fill="none"/>';}
 if(kind==='daughter'||kind==='couple'){o+='<path d="M550 545q55 -54 96 10" fill="none" stroke="#f9bd97" stroke-width="16"/>';for(let i=0;i<9;i++)o+=petal(95+i*126,530+(i%3)*29,i%2?'#fbaec1':'#ffe6b3');}
 if(kind==='tree'){for(let i=0;i<40;i++){const x=360+(i*83)%570,y=180+(i*43)%290;o+=petal(x,y,['#edb858','#d68556','#7eae7b','#f3d997'][i%4])}}
 if(kind==='mist')for(let i=0;i<9;i++)o+='<path d="M-40 '+(280+i*33)+'Q240 '+(220+i*33)+' 580 '+(295+i*33)+'T1240 '+(260+i*33)+'" stroke="#e2f1e9" stroke-opacity=".24" stroke-width="23" fill="none"/>';
 if(kind==='river'||kind==='moon')for(let i=0;i<24;i++)o+='<path d="M'+(50+i*48)+' '+(535+(i%4)*27)+'q35 -9 67 2" stroke="#ffe3a5" stroke-width="4" opacity=".7" fill="none"/>';
 if(kind==='home'){o+='<path d="M160 562q130 -120 255 0" fill="#e0b17c" stroke="#433047" stroke-width="9"/><circle cx="270" cy="515" r="37" fill="#dfaa89"/><circle cx="369" cy="515" r="30" fill="#e6af91"/>';}
 if(kind==='pocket'){o+='<path d="M495 358l190 0 -32 178 -146 0Z" fill="#705078" stroke="#ffd7a3" stroke-width="10"/>';for(let i=0;i<20;i++)o+=petal(50+(i*59)%1120,390+(i*67)%240,i%3?'#e98a4c':'#f9cb75');}
 if(kind==='bowl'){o+='<path d="M580 475q-55 -85 17 -123M635 475q-50 -90 20 -131" fill="none" stroke="#f8e6d2" stroke-width="10" opacity=".6"/>';}
 if(kind==='mail'){for(let i=0;i<6;i++)o+='<path d="M'+(60+i*85)+' '+(190+i*43)+'l75 -24 30 56 -74 20Z" fill="#fff1d4" stroke="#554665" stroke-width="5"/>';}
 if(kind==='flag'){o+='<path d="M502 242h67m55 0h67m-187 170h65m55 0h67" stroke="#25243a" stroke-width="12"/>';}
 if(kind==='star'||kind==='sonstar')for(let i=0;i<20;i++)o+=light(35+(i*71)%1120,74+(i*49)%330);
 return o;
}

function build(slug,index,title){
 const spec=SCENES[title];if(!spec)return null;
 const seed=Array.from(title).reduce((n,c)=>n*31+c.charCodeAt(0),17)>>>0;
 const sky='<defs><linearGradient id="gs" x2="0" y2="1"><stop stop-color="'+spec[2]+'"/><stop offset="1" stop-color="#6a5290"/></linearGradient><pattern id="fine" width="29" height="25" patternUnits="userSpaceOnUse"><path d="M0 0L29 17L0 25L13 11Z" stroke="#e4d4b6" stroke-opacity=".35" stroke-width="1" fill="none"/></pattern></defs>';
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 680" role="img" aria-label="'+esc(title+' 상세 스테인드글라스 시화')+'">'+sky+'<rect width="1200" height="680" fill="url(#gs)"/>'+glassPieces(seed)+scene(spec)+poeticDetails(spec[0])+microGlass(seed)+'<rect width="1200" height="680" fill="url(#fine)" opacity=".38"/><rect x="10" y="10" width="1180" height="660" rx="8" fill="none" stroke="#1b1830" stroke-width="17"/><rect x="22" y="22" width="1156" height="636" rx="4" fill="none" stroke="#ffcb75" stroke-width="4" opacity=".8"/></svg>';
}
function install(){
 if(!window.MyeongdoMosaic){return false;}
 const original=window.MyeongdoMosaic.render;
 window.MyeongdoMosaic.render=function(root,slug,index,title){
   const markup=build(slug,index,title);
   if(!markup){return original(root,slug,index,title);}
   if(!root)return;
   const img=document.createElement('img');img.alt=title+' — '+SCENES[title][1]+'; 스테인드글라스 모자이크 시화';
   img.loading='eager';img.decoding='async';img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(markup);root.replaceChildren(img);
 };
 window.MyeongdoArtDirector={scenes:SCENES,build:build};
 return true;
}
if(!install())window.addEventListener('DOMContentLoaded',install,{once:true});
})();