/* 명도재 월촌역 3시인 문학관: 작품별 팝아트 시화 디렉터
 * 각 제목에 맞춘 장면 연출표와 독립적 SVG 그림을 사용합니다.
 * 웹 브라우저에서 동작하며 외부 AI 서비스/API 키가 필요하지 않습니다.
 * 새 작품을 추가할 때 SCENES에 소재와 주요 화풍을 등록하세요.
 */
(function(){
"use strict";
const SCENES={"보리 보리 쌀":["hands","유년의 손놀이, 두 손과 붉은 노을, 그리운 어린 시절","#17375f","#e88b58"],"선물":["gift","대명동 옛 골목, 조그만 셋방, 김 꾸러미, 오래된 시간","#344b70","#f2bb75"],"낮별":["station","월촌역 지하철 입구, 커피 잔과 낮하늘의 희미한 별","#275d82","#f1cd86"],"우편함":["mail","옛 우편함과 손편지, 고요한 골목, 쓸쓸한 저녁","#385b75","#e9a75f"],"향기의 행방":["flowerfield","영천 꽃밭, 유채꽃과 작약, 웃음, 봄 소풍","#2b5578","#e9c568"],"산바람에 귀를 대고":["mountain","가창 우록 산길, 박새와 분홍 꽃망울, 맑은 산바람","#32617b","#e7b0a2"],"가을 분실물":["pocket","빈 주머니와 가을바람, 낙엽이 흐르는 거리","#1d365f","#f2a150"],"신기루":["dust","돌개바람과 먼지, 저녁노을, 흩어지는 깃털","#254985","#e5a056"],"엄마 생각":["home","아랫목에 잠든 아이들, 어머니의 따뜻한 손","#374f77","#f0b48b"],"상사화":["lily","꽃과 잎이 만나지 못하는 붉은 상사화 꽃밭","#345f7a","#e96567"],"휘날리는 태극기는":["flag","푸른 하늘에 태극기, 산 능선과 강물","#184478","#e8bf70"],"강":["river","굽이치는 강과 황금빛 수면, 저 멀리 산","#285478","#bfcfa8"],"아버지의 지게":["father","황토길을 걷는 아버지, 어깨 위 지게, 저녁 산마을","#39516a","#eab573"],"보름달":["moon","호수 위에 떠오른 보름달과 고요한 빈 배","#233568","#f1cd85"],"개망초 꽃":["daisy","하얀 개망초 꽃이 가득한 들길, 조용한 아내의 손","#3a6377","#f1d4a8"],"모란이 피던 날":["peony","붉은 모란과 미소 짓는 아내, 푸른 하늘 담긴 항아리","#385a80","#e79eae"],"나는 누구에겐가 안기고 싶다":["subway","쓸쓸한 퇴근길 지하철과 고독한 승객","#1c366a","#f2be84"],"꿈꾸는 크레파스":["crayon","빨간 크레파스, 무지개, 지붕 위 수탉, 흔들리는 그네","#3b4595","#f59c65"],"뿌리":["well","윤동주를 떠올리는 오래된 우물, 별, 바람과 나무뿌리","#1a356c","#f2c985"],"가을 타기":["autumn","포장마차와 외로운 남자, 라이터, 가로등, 보름달, 홍시","#112f77","#ed8c4a"],"하나뿐인 예쁜 딸아":["daughter","따뜻한 부녀의 정, 봄꽃과 나비, 햇살","#345b87","#f4a2b3"],"세월이 가르쳐 준 삶의 품격":["tree","오래된 나무와 넓게 뻗은 가지, 시간의 햇살","#30516c","#d6b778"],"그림자의 동행":["couple","노을길을 나란히 걷는 두 사람과 긴 그림자","#2f4379","#e6aa89"],"물안개":["mist","새벽 호수 위에 번지는 물안개와 산그림자","#2d5878","#a7c8cd"],"막걸리를 마시며":["bowl","막걸리 사발과 손, 조용한 밤 풍경","#384970","#e5cda8"],"별이 된 아들아":["sonstar","별빛 아래 두 사람의 실루엣과 따뜻한 추모","#17275d","#e9c790"]};

const ANALYSIS={
"보리 보리 쌀":["손놀이·작은 주먹·치맛자락·처마·붉은 노을","그리움","어린 시절의 즐거움과 되돌아오지 않는 시간"],
"선물":["대명동 단칸방·김 꾸러미·좁은 셋방·낡은 골목","회상","얇은 선물에 쌓인 삶의 무게"],
"낮별":["월촌역 7번 출구·커피잔·꽃향기·별빛·지나간 사람","그리움","떠난 사람을 감각으로 기억하는 시간"],
"우편함":["빈 우편함·편지 봉투·접힌 종이·골목길","쓸쓸함","타인의 기쁨과 슬픔을 품은 사물"],
"향기의 행방":["영천 꽃밭·유채꽃·작약·양귀비·동행하는 시인들","기쁨","사라지는 꽃향기 대신 남는 웃음"],
"산바람에 귀를 대고":["우록 산길·박새·분홍 꽃망울·봄바람·산등성이","평온","작은 자연의 소리에 귀 기울임"],
"무경계(無境界)":["하늘·바다·수평선·구름·푸른 물결·서로 비친 풍경","관조","인위적인 경계를 넘어서는 하나의 푸름"],
"가을 분실물":["분실물 센터·빈 주머니·문틈 바람·낙엽","허전함","잃은 것이 없어도 느껴지는 계절의 결핍"],
"신기루":["돌개바람·먼지·새 깃털·지평선·노을·골목","덧없음","순간 나타났다가 사라지는 시간"],
"엄마 생각":["강아지 두 마리·아랫목·어린 동생·산나물·보리쌀·장터","그리움","어머니의 고단한 사랑과 유년의 기억"],
"상사화":["붉은 상사화·서로 만나지 못하는 꽃과 잎·빈 들길","애상","이루어지지 못한 사랑의 붉은 흔적"],
"휘날리는 태극기는":["태극기·무궁화·동해·백두산·광복의 군중","장엄","자유를 향한 역사적 기억"],
"강":["강줄기·노을·꽃잎·옥상·산 능선","그리움","지워지지 않는 이름을 품은 흐르는 물"],
"아버지의 지게":["낡은 지게·아버지의 굽은 등·산길·딸의 혼례·묘지","애틋함","삶의 무게를 대신 짊어진 아버지"],
"보름달":["외로운 둥근 달·우물·두레박·부엉이·달빛","성찰","닿을 수 없는 달을 마음속에 건져 올림"],
"개망초 꽃":["개망초 꽃·아내의 손마디·아침 이슬·산 그림자","감사","오랜 곁을 지킨 사랑을 뒤늦게 발견함"],
"모란이 피던 날":["모란꽃·웃는 아내·하늘 담긴 항아리·오월 정원","희망","익숙한 체취 속에서 피어나는 사랑"],
"나는 누구에겐가 안기고 싶다":["지하철 승강장·노선도·스마트폰·승객들·닫히는 문","고독","인파 한가운데서 더욱 선명해지는 소외"],
"꿈꾸는 크레파스":["빨간 크레파스·수탉·그네·무지개·부엉이·다람쥐·풍선·깃발","열망","나이와 현실의 한계를 뛰어넘는 꿈"],
"뿌리":["나무뿌리·우물·두레박·별·시비·사슴·새벽","추모","윤동주의 양심을 별과 물의 이미지로 기억함"],
"가을 타기":["외로운 남자·라이터·지폐·포장마차·가로등·홍시·나목·달","고독","가을의 허전함을 태워 버리고 싶은 마음"],
"하나뿐인 예쁜 딸아":["아버지와 딸·천사의 날개·새싹·함박꽃·봄비","사랑","자녀의 행복과 성장을 바라는 축복"],
"세월이 가르쳐 준 삶의 품격":["오래된 나무·열매·꽃·노을·사람의 손·산책길","관조","욕심을 덜고 깊어지는 삶"],
"그림자의 동행":["바닷가·맞잡은 손·두 사람의 긴 그림자·젖은 모래·별","애정","서로 기대어 견뎌 온 관계의 깊이"],
"물안개":["호수·물안개·두견새·날아오르는 새·바람·산 그림자","그리움","보이지 않는 사람을 안개로 떠올림"],
"막걸리를 마시며":["막걸리 사발·나무 탁자·손·밤 창문·희미한 등불","회상","버텨 온 세월을 조용히 돌아보는 시간"],
"별이 된 아들아":["부모의 뒷모습·밤하늘·별빛·기도하는 손·빈자리","애도","떠난 아들을 향한 끝없는 사랑"]
};
const glassMotifs={
"무경계(無境界)":function(){
let a='<path d="M0 390Q280 345 590 390T1200 385V680H0Z" fill="#1a83bd" stroke="#213a73" stroke-width="8"/>';
for(let i=0;i<22;i++){let x=i*59,y=450+(i%4)*49;a+='<path d="M'+x+' '+y+'q38 -23 78 0" fill="none" stroke="#d4f7ee" stroke-width="5" opacity=".76"/>';}
a+='<path d="M0 385Q350 373 620 390T1200 390" fill="none" stroke="#fff4bd" stroke-width="5"/>';
for(let i=0;i<7;i++){let x=125+i*165;a+='<path d="M'+x+' '+(170+i%3*40)+'q55 -50 100 0q38 42 100 0" fill="none" stroke="#c1dcff" stroke-width="18" opacity=".75"/>';}
return a;},
"엄마 생각":function(){let a='';for(let i=0;i<2;i++){let x=260+i*135;a+='<ellipse cx="'+x+'" cy="555" rx="72" ry="41" fill="#c5a080" stroke="#35233a" stroke-width="8"/><circle cx="'+(x+36)+'" cy="517" r="28" fill="#b99a78" stroke="#35233a" stroke-width="7"/><path d="M'+(x+48)+' 515l22 -27 12 30" fill="#b99a78" stroke="#35233a" stroke-width="6"/>';}return a;},
"꿈꾸는 크레파스":function(){return '<path d="M630 550l110 -250 30 15 -104 254Z" fill="#ee424a" stroke="#312345" stroke-width="10"/><path d="M725 305l28 -58 17 68" fill="#fce09d" stroke="#312345" stroke-width="6"/><path d="M120 480q200 -260 380 0" fill="none" stroke="#ecc04b" stroke-width="14"/><path d="M225 280l0 215M340 280l0 215M200 284q84 31 164 0" fill="none" stroke="#e9daba" stroke-width="8"/>';},
"낮별":function(){return '<rect x="130" y="480" width="270" height="45" rx="10" fill="#c58b66" stroke="#312b46" stroke-width="8"/><path d="M210 470v-50h68v50" fill="#f0e0ca" stroke="#342941" stroke-width="9"/><path d="M275 438q85 12 0 45" fill="none" stroke="#f7d19a" stroke-width="8"/>';},
"아버지의 지게":function(){return '<path d="M555 235L735 430L650 615M735 235L555 430L650 615M560 340L730 340M570 420L718 420" stroke="#805037" stroke-width="26" fill="none"/><path d="M560 340L730 340" stroke="#e5b57a" stroke-width="8"/>';},
"보름달":function(){return '<path d="M200 550q160 -60 330 0" fill="none" stroke="#6c9eb1" stroke-width="16"/><path d="M270 470v150M450 470v150" stroke="#8f7c72" stroke-width="13"/><path d="M270 515q90 -48 180 0" fill="none" stroke="#d3c2a5" stroke-width="15"/>';},
"그림자의 동행":function(){return '<path d="M0 580Q500 530 1200 590V680H0Z" fill="#c7ae94"/><path d="M450 570l-140 105M670 570l145 105" stroke="#51435a" stroke-width="25" opacity=".55"/>';},
"선물":function(){let a='';for(let i=0;i<12;i++)a+='<rect x="'+(500+i*21)+'" y="'+(530-i*6)+'" width="180" height="17" rx="3" transform="rotate(-8 '+(500+i*21)+' '+(530-i*6)+')" fill="'+(i%2?'#244d44':'#5c735a')+'" stroke="#d6c9a5" stroke-width="3"/>';return a;}
};

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
 const rnd=()=>{s=(Math.imul(1664525,s)+1013904223)>>>0;return s/4294967296};
 let out='<g pointer-events="none">';
 // 18픽셀 단위, 한 면당 두 개의 비정형 유리 조각. 윤곽은 굵게 유지.
 for(let row=0;row<39;row++)for(let col=0;col<68;col++){
  let x=col*18-8,y=row*18-8;
  let dx=11+rnd()*6,dy=11+rnd()*6;
  out+='<path d="M'+x+' '+y+'l18 0 -'+(18-dx)+' '+dy+' -'+dx+' '+(18-dy)+'Z" fill="#f7bc79" fill-opacity="'+(.025+rnd()*.065).toFixed(2)+'" stroke="#160f29" stroke-opacity=".34" stroke-width="1.2"/>';
  out+='<path d="M'+(x+18)+' '+y+'l0 18h-18l'+dx+' -'+(18-dy)+'Z" fill="#dee7ff" fill-opacity=".045" stroke="#130d24" stroke-opacity=".4" stroke-width="1.2"/>';
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


/* POP ART 2026: 각 시의 구체적인 장면 + 인쇄 망점 + 강한 색면과 윤곽.
   기존 시의 전용 사물은 보존하고 유리조각 오버레이는 사용하지 않는다. */
function popPalette(seed){
 const sets=[
 ['#1559db','#ffcd25','#fb4d68','#24d3c2','#10152b'],
 ['#3625ae','#ff9b29','#e93f8a','#1bd7db','#171539'],
 ['#0f718c','#ffda35','#fb624a','#e945a5','#152333'],
 ['#383aaf','#f9bd43','#fe4d69','#75dd8a','#171b46'],
 ['#1c4db0','#ffa842','#e84170','#8cd5ff','#151532'],
 ['#7131a5','#f8e248','#f06a34','#39bfd0','#28203d']
 ];
 return sets[seed%sets.length];
}
function popBackground(seed,p){
 let r=seed>>>0;const rand=()=>{r=(Math.imul(1664525,r)+1013904223)>>>0;return r/4294967296};
 let o='<rect width="1200" height="680" fill="'+p[0]+'"/>';
 o+='<path d="M0 0H780L220 680H0Z" fill="'+p[3]+'" opacity=".22"/>';
 o+='<path d="M700 0L1200 0V580Z" fill="'+p[1]+'" opacity=".21"/>';
 o+='<circle cx="1020" cy="130" r="200" fill="'+p[1]+'" opacity=".16" stroke="'+p[4]+'" stroke-width="16"/>';
 for(let i=0;i<17;i++){
 let x=Math.round(rand()*1200),y=Math.round(rand()*680),radius=14+rand()*36;
 o+='<path d="M'+(x-radius)+' '+y+'l'+radius+' -'+radius+' '+radius+' '+radius+' -'+radius+' '+radius+'Z" fill="'+p[1+i%3]+'" opacity=".15" stroke="'+p[4]+'" stroke-opacity=".12" stroke-width="4"/>';
 }
 return o;
}
function popDetail(title,kind,p){
 let o='',dark=p[4],gold=p[1],red=p[2],aqua=p[3],blue=p[0];
 const line=(d,col=dark,w=10)=>'<path d="'+d+'" fill="none" stroke="'+col+'" stroke-width="'+w+'" stroke-linecap="round" stroke-linejoin="round"/>';
 const circle=(x,y,r,col)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+col+'" stroke="'+dark+'" stroke-width="7"/>';
 const spark=(x,y,r,col)=>'<path d="M'+x+' '+(y-r)+'L'+(x+r*.23)+' '+(y-r*.2)+' '+(x+r)+' '+y+' '+(x+r*.23)+' '+(y+r*.2)+' '+x+' '+(y+r)+' '+(x-r*.23)+' '+(y+r*.2)+' '+(x-r)+' '+y+' '+(x-r*.23)+' '+(y-r*.2)+'Z" fill="'+col+'" stroke="'+dark+'" stroke-width="3"/>';
 const leaves=(count)=>{let z='';for(let i=0;i<count;i++){let x=45+(i*97)%1130,y=470+(i*61)%187;z+='<path d="M'+x+' '+y+'q-33 -27 0 -44q36 13 0 44Z" fill="'+(i%2?gold:red)+'" stroke="'+dark+'" stroke-width="4"/>'}return z};
 if(kind==='autumn'){
  o+='<path d="M65 320L280 230L490 325V552H65Z" fill="'+red+'" fill-opacity=".18" stroke="'+dark+'" stroke-width="13"/>';
  o+=line('M90 344H450M135 370V535M414 370V536',dark,9);
  for(let i=0;i<5;i++)o+=circle(118+i*65,383,15,gold);
  o+=leaves(18);
  o+='<path d="M550 300V625" stroke="'+dark+'" stroke-width="14"/>'+circle(550,321,31,gold);
  o+='<path d="M250 220q135 -70 325 -10" stroke="'+dark+'" stroke-width="20" fill="none"/>'+circle(510,230,27,red);
 }
 if(kind==='well'){
  o+='<path d="M130 590Q270 440 475 560" fill="none" stroke="'+gold+'" stroke-width="25"/>';
  for(let i=0;i<10;i++)o+=spark(80+(i*106)%1130,95+(i*43)%220,9+i%4*5,gold);
  o+='<path d="M300 410Q450 325 620 395" stroke="'+aqua+'" stroke-width="15" fill="none"/>';
 }
 if(kind==='crayon'){
  o+='<path d="M130 430Q445 -65 1010 340" fill="none" stroke="'+red+'" stroke-width="29"/>';
  o+='<path d="M147 440Q450 -22 990 360" fill="none" stroke="'+gold+'" stroke-width="20"/>';
  o+='<path d="M163 453Q450 16 970 370" fill="none" stroke="'+aqua+'" stroke-width="12"/>';
  o+='<path d="M820 490l60 -190 39 12 -58 193Z" fill="'+red+'" stroke="'+dark+'" stroke-width="9"/>';
 }
 if(kind==='subway'||kind==='station'){
  o+='<rect x="200" y="400" width="530" height="160" rx="17" fill="'+aqua+'" stroke="'+dark+'" stroke-width="12"/>';
  for(let i=0;i<6;i++)o+='<rect x="'+(225+i*80)+'" y="424" width="54" height="80" fill="#fef5c9" stroke="'+dark+'" stroke-width="5"/>';
  o+=line('M215 559h530',dark,15);
 }
 if(kind==='horizon'||title==='무경계(無境界)'){
  o+='<path d="M0 365Q310 343 620 367T1200 363" fill="none" stroke="'+gold+'" stroke-width="11"/>';
  o+='<path d="M0 530Q300 447 600 535T1200 500" fill="none" stroke="'+aqua+'" stroke-width="18"/>';
  for(let i=0;i<15;i++)o+=line('M'+(i*88)+' '+(555+i%3*30)+'q30 -16 63 0','#dff7ed',5);
 }
 if(kind==='flowerfield'||kind==='lily'||kind==='peony'||kind==='daisy'){
  for(let i=0;i<15;i++){let x=65+i*77,y=460+(i%4)*34;o+=circle(x,y,15+i%3*6,i%3?red:gold);o+=line('M'+x+' '+(y+18)+'l'+(i%2?12:-12)+' 110','#137f74',6)}
 }
 if(kind==='daughter'||kind==='couple'){
  o+=spark(1050,160,35,gold)+spark(910,240,17,aqua);
  o+=line('M490 555q60 -60 110 0',gold,23);
 }
 if(kind==='sonstar'){for(let i=0;i<18;i++)o+=spark(48+i*63,100+(i%5)*48,8+(i%4)*5,gold);}
 if(kind==='tree'||kind==='father'||kind==='mountain'){o+=leaves(18);o+=spark(1040,152,35,gold);}
 if(kind==='mist'||kind==='river'||kind==='moon'){
  for(let i=0;i<22;i++)o+=line('M'+(10+i*55)+' '+(535+i%4*26)+'q34 -12 64 0',i%2?gold:aqua,6);
 }
 if(kind==='bowl'){
  o+='<ellipse cx="515" cy="553" rx="210" ry="70" fill="#fff2bf" stroke="'+dark+'" stroke-width="14"/>';
  o+=line('M565 444q-57 -83 9 -130M640 444q-60 -80 6 -140','#fdf7da',12);
 }
 if(kind==='pocket'||kind==='dust')o+=leaves(20);
 if(kind==='hands'||kind==='home'||kind==='gift'||kind==='mail')o+=spark(1010,105,30,gold);
 if(kind==='flag')o+=spark(1050,105,30,gold);
 // 잡지 인쇄 스타일의 비대칭 원근, 빛살. 작품의 핵심 대상을 덮지 않도록 가장자리에 배치.
 o+='<path d="M5 110L190 170M35 210L142 234M1035 626L1180 580" fill="none" stroke="'+gold+'" stroke-width="11" opacity=".85"/>';
 return o;
}
function popPrint(seed,p){
 let v=seed>>>0;const rand=()=>{v=(Math.imul(v,1103515245)+12345)>>>0;return v/4294967296};
 let o='<g pointer-events="none">';
 // 작은 인쇄 망점을 국소적으로만 사용해 인물과 꽃의 윤곽을 가리지 않음.
 const zones=[[35,35,250,140],[810,40,260,155],[70,540,250,115],[880,530,270,100]];
 for(const [X,Y,W,H] of zones){for(let y=Y;y<Y+H;y+=12)for(let x=X;x<X+W;x+=12){const r=1.3+rand()*1.7;o+='<circle cx="'+x+'" cy="'+y+'" r="'+r.toFixed(1)+'" fill="'+p[4]+'" opacity=".26"/>';}}
 o+='</g>';return o;
}

function build(slug,index,title){
 const spec=SCENES[title]||(title==='무경계(無境界)'?['horizon','하늘과 바다, 구름과 물결','#184d87','#9fd5ef']:null);
 if(!spec)return null;
 const seed=Array.from(title).reduce((n,c)=>Math.imul(n,31)+c.charCodeAt(0),17)>>>0;
 const p=popPalette(seed);
 const defs='<defs><pattern id="popdots" patternUnits="userSpaceOnUse" width="15" height="15"><circle cx="7" cy="7" r="2.6" fill="'+p[4]+'" opacity=".34"/></pattern><clipPath id="popclip"><rect width="1200" height="680" rx="0"/></clipPath></defs>';
 let main=scene(spec)+(glassMotifs[title]?glassMotifs[title]():'')+poeticDetails(spec[0])+popDetail(title,spec[0],p);
 // 새 화면은 색유리 오버레이를 사용하지 않는 정통 팝아트 색면 일러스트레이션.
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 680" role="img" aria-label="'+esc(title+' 팝아트 시화')+'">'
 +defs+popBackground(seed,p)+'<g id="pop-main" stroke-linejoin="round" stroke-linecap="round">'+main+'</g>'
 +'<path d="M0 0H1200V680H0Z" fill="url(#popdots)" opacity=".07" pointer-events="none"/>'
 +popPrint(seed,p)
 +'<rect x="10" y="10" width="1180" height="660" fill="none" stroke="'+p[4]+'" stroke-width="20"/>'
 +'<path d="M20 20h1160M20 660h1160" stroke="'+p[1]+'" stroke-width="7"/>'
 +'</svg>';
}
function install(){
 if(!window.MyeongdoMosaic){return false;}
 const original=window.MyeongdoMosaic.render;
 window.MyeongdoMosaic.render=function(root,slug,index,title){
   const markup=build(slug,index,title);
   if(!markup){return original(root,slug,index,title);}
   if(!root)return;
   const img=document.createElement('img');img.alt=title+' — '+(ANALYSIS[title]?ANALYSIS[title][0]:title)+'; 팝아트 시화';
   img.loading='eager';img.decoding='async';img.src=URL.createObjectURL(new Blob([markup],{type:'image/svg+xml;charset=utf-8'}));img.onload=function(){URL.revokeObjectURL(img.src)};root.replaceChildren(img);
 };
 window.MyeongdoArtDirector={scenes:SCENES,analysis:ANALYSIS,build:build};
 return true;
}
if(!install())window.addEventListener('DOMContentLoaded',install,{once:true});
})();