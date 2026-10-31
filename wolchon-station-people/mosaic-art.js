/* 명도재 월촌역 사람들 — 작품별 독립 모자이크 시화 렌더러.
   각 작품의 이미지와 색채를 다른 SVG로 그리며, 외부 이미지 호스팅에 의존하지 않습니다. */
(function(){
"use strict";
const pal=[["#092d6b","#8c19a6","#ffe122","#fa3b65","#00cdb6"],["#113e6c","#7644bd","#ffdf49","#ff7744","#14b6ba"],["#14228b","#a92fde","#ffcf1a","#ff4f9c","#22d7ed"],["#123d79","#bf2f92","#ffc52e","#ff614d","#13d8ac"],["#063f7c","#8521d4","#ffdd18","#ff3d93","#23cb5a"],["#093678","#1567cc","#ffcb24","#ff5791","#19c7a5"],["#153c75","#a220c3","#ffc122","#ff552d","#00c5af"],["#102e91","#e027aa","#ffdf1e","#ff6723","#10cfdd"],["#333b82","#c82e9c","#ffd143","#16c9bd","#f07e41"],["#233480","#cf194f","#ffe123","#f63464","#19c4b5"],["#103998","#334ee3","#ffe221","#f72a62","#f9f9f1"],["#073d8b","#1292b8","#ffd642","#eb3c99","#54eab2"],["#103a75","#a02fde","#ffbc32","#fa3292","#10d5b0"],["#194c7a","#6659de","#ffe031","#ff862e","#0ed3bd"],["#153289","#9731d6","#ffdb28","#fc58a3","#28c3ed"],["#064a8b","#17b8c9","#ffdf7c","#f15ab7","#6af1cd"],["#202f76","#be3698","#ffc62b","#e95b2f","#3bdfae"]];
const cases={
"lee-seongdu":["hands","gift","star","mail","flowers","birds"],
"jeon-jinsik":["pocket","mirage","mother","lily","flag","river"],
"gwak-uiyeong":["daughter","tree","couple","mist","bowl"]
};
const el=(tag,attrs,children)=>{const a=Object.keys(attrs||{}).map(k=>" "+k+'="'+String(attrs[k]).replace(/"/g,"&quot;")+'"').join("");return "<"+tag+a+">"+(children||"")+"</"+tag+">"};
const C=(x,y,r,f,stroke)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+f+'"'+(stroke?' stroke="'+stroke+'" stroke-width="6"':'')+'/>';
const E=(x,y,rx,ry,f)=>'<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'" fill="'+f+'"/>';
const P=(d,f,s,w)=>'<path d="'+d+'" fill="'+(f||"none")+'"'+(s?' stroke="'+s+'" stroke-width="'+(w||8)+'" stroke-linejoin="round" stroke-linecap="round"':'')+'/>';
const R=(x,y,w,h,f,rx)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(rx||0)+'" fill="'+f+'"/>';
const star=(x,y,r,color)=>{let d="";for(let i=0;i<10;i++){let a=-Math.PI/2+i*Math.PI/5;let rr=i%2?r*.4:r;d+=(i?"L":"M")+(x+rr*Math.cos(a)).toFixed(1)+" "+(y+rr*Math.sin(a)).toFixed(1)}return P(d+"Z",color,"#f1d78c",3)};
function blossom(x,y,s,col){let a="";for(let i=0;i<7;i++){let t=i*Math.PI*2/7; a+=E(x+Math.cos(t)*s*.6,y+Math.sin(t)*s*.6,s*.42,s*.29,col)}return a+C(x,y,s*.22,"#f7d572")}
function bird(x,y,s){return P("M"+(x-s)+" "+y+" Q"+(x-s*.25)+" "+(y-s*.7)+" "+x+" "+y+" Q"+(x+s*.25)+" "+(y-s*.7)+" "+(x+s)+" "+y,"none","#1b4c4b",5)}
function human(x,y,s,jacket){return '<g transform="translate('+x+' '+y+') scale('+s+')">'+C(0,0,26,"#e9bd92")+P("M-34 26Q0 7 34 26L51 170H-49Z",jacket,"#eac57e",4)+P("M-25 165L-29 239M24 165L27 239","none","#243c46",18)+P("M-29 44L-60 112M30 44L64 112","none","#e9bd92",13)+"</g>"}
function train(){let s=P("M350 255L980 185Q1050 184 1080 248L1090 515L350 445Z","url(#train)","#f2ce84",12);s+=P("M380 291L480 278V415L380 408Z","#fbd184","#dca95d",7);s+=P("M510 272L645 257V437L510 419Z","#f3bf72","#ddad6c",7);s+=P("M672 249L808 233V455L672 440Z","#f7d88c","#ddad6c",7);s+=P("M843 228L970 213V476L843 459Z","#fbd98f","#ddad6c",7);s+=R(1022,408,36,26,"#ffe4a1",10);return s}
function hills(p){return P("M0 410Q180 300 360 391T720 378T1200 354V680H0Z",p[4])+P("M0 545Q300 440 600 552T1200 490V680H0Z",p[1])}
function motif(k,p){
 const a=p[2],b=p[3],v=p[4],light="#ffe4ab",dark="#204743";let z="";
 switch(k){
 case"hands": z+=C(950,155,94,b)+P("M20 540Q280 400 550 445T1200 360V680H0Z",v);z+=P("M330 578Q280 515 299 453L327 432L340 482L352 365Q352 342 369 346L384 487L398 343Q412 327 425 354L423 480L454 376Q472 364 484 390L458 505L490 456Q511 447 513 474L468 579Z","#f3bc91","#a55e6a",8);z+=P("M700 589Q630 536 649 470L680 461L691 504L701 381Q716 354 732 382L745 499L771 414Q790 401 799 430L776 513L815 476Q836 470 844 494L795 593Z","#eeb28a","#a35e6c",8);break;
 case"gift":z+=hills(p)+R(165,205,460,325,"#e8d6aa",6)+P("M135 205L404 118L663 202Z",p[1]) +R(245,300,110,230,p[0])+R(445,302,115,230,p[0]);for(let i=0;i<9;i++){z+=P("M"+(620+i*25)+" "+(390+i*11)+"l135 -22l14 48l-133 18Z",i%2?a:v,"#fff0bb",2)}z+=P("M711 460L801 438L860 475L768 500Z",b);break;
 case"star":z+=train()+P("M0 460L1200 520V680H0Z",p[1]);z+=star(230,200,95,a)+star(730,102,37,light)+star(870,135,23,b);z+=human(260,395,.8,b);break;
 case"mail":z+=hills(p)+R(220,222,640,325,light,20)+P("M220 227L535 426L860 227","none",p[1],14)+P("M220 545L466 351M860 545L605 351","none",p[3],13)+R(875,200,130,300,p[1],18)+R(900,238,80,52,light,8)+star(945,320,45,a);break;
 case"flowers":z+=hills(p);for(let i=0;i<18;i++){let x=75+i*60,y=390+((i*53)%160),sz=22+((i*17)%22);z+=P("M"+x+" "+(y+160)+"Q"+(x+16)+" "+(y+70)+" "+x+" "+y,"none","#24604e",6)+blossom(x,y,sz,[a,b,"#ee94a9","#fce6a8"][i%4])}z+=C(960,165,74,a);break;
 case"birds":z+=hills(p)+P("M130 620Q290 480 410 310T560 130","none",dark,15);for(let i=0;i<12;i++)z+=blossom(300+(i*38)%350,195+(i*39)%230,16+(i%3)*5,i%2?"#e99ab8":light);for(let i=0;i<7;i++)z+=bird(740+i*65,160+(i*39)%120,25+i*3);break;
 case"pocket":z+=hills(p)+P("M380 165H780L745 485Q565 645 412 482Z",p[1],"#ffe2a0",12)+P("M420 220Q575 290 740 220","none",light,12);for(let i=0;i<13;i++){let x=90+i*85,y=170+((i*47)%320);z+=P("M"+x+" "+y+"q38 -37 45 7q-30 27 -45 -7Z",i%2?b:a,"#ffe2ac",3)}break;
 case"mirage":z+=C(890,225,105,a)+hills(p);for(let i=0;i<7;i++){let x=125+i*115;z+=P("M"+x+" "+(475-i*20)+"q90 -82 153 -8t140 -4","none",[b,a,v][i%3],14)}z+=bird(635,150,65);break;
 case"mother":z+=hills(p)+human(565,252,1.16,p[1])+human(350,409,.65,b)+human(825,416,.63,a)+P("M585 340L710 345L732 425L610 430Z",light,"#cc875e",10)+R(610,352,105,32,p[4],9)+C(630,303,18,light);break;
 case"lily":z+=hills(p);for(let i=0;i<8;i++){let x=140+i*136,y=350+(i%3)*65;z+=P("M"+x+" 665Q"+(x-34)+" "+(y+135)+" "+x+" "+y,"none","#22614f",9);for(let j=0;j<9;j++){let theta=j*2*Math.PI/9;let xx=x+Math.cos(theta)*55, yy=y+Math.sin(theta)*35;z+=P("M"+x+" "+y+"Q"+(x+Math.cos(theta)*30)+" "+(y+Math.sin(theta)*16)+" "+xx+" "+yy,"none","#df405d",10)}z+=C(x,y,11,light)}break;
 case"flag":z+=hills(p)+P("M340 140V630","none",light,17)+P("M348 150Q610 98 893 153L870 450Q590 387 347 457Z","#f7f3e2","#aab2a8",10)+P("M610 270a100 100 0 1 0 1 0", "none");z+=P("M565 284a76 76 0 1 1 152 0q-76 76 -152 0Z","#db4b5d")+P("M565 284q76 -76 152 0a76 76 0 0 1 -152 0Z","#3865a5");for(let x of [435,735])for(let y of [225,360])z+=R(x,y,68,14,dark,3)+R(x,y+23,68,14,dark,3);break;
 case"river":z+=hills(p)+P("M410 670Q270 550 565 460T840 340T1050 140L1200 160L1200 680Z","#a0cfc4","#efdbba",8);for(let i=0;i<9;i++)z+=P("M"+(420+i*75)+" "+(545+i*10)+"q80 -42 130 -10","none",i%2?light:"#4f9fa3",9);z+=C(1020,120,68,a);break;
 case"daughter":z+=hills(p)+P("M592 630Q560 470 600 240","none",dark,16)+blossom(610,230,150,"#ee83a3")+blossom(385,435,65,light)+blossom(885,420,78,"#f5ba63")+P("M800 245q80 -90 140 -5q-70 85 -140 5Z",p[1])+P("M800 250q-75 95 -141 -1q75 -74 141 1Z",b)+P("M800 247l-14 75","none",dark,5);break;
 case"tree":z+=hills(p)+P("M590 650L582 345L535 215M588 368L680 260M582 411L465 304","none","#544b44",28);for(let i=0;i<18;i++){let theta=i*2*Math.PI/18;z+=C(576+Math.cos(theta)*140,270+Math.sin(theta)*108,44,i%3===0?a:i%3===1?v:b)}z+=C(587,277,90,"#82a78b");break;
 case"couple":z+=P("M0 510Q600 350 1200 470V680H0Z",p[4])+C(1020,158,90,a)+human(480,325,1.03,p[1])+human(680,335,.98,b)+P("M458 645L350 676H568L510 550Z","#382f54")+P("M662 650L610 680H780L708 547Z","#403351");break;
 case"mist":z+=hills(p)+P("M0 505Q260 430 470 500T930 485T1200 510V680H0Z","#6fa4a4");for(let i=0;i<6;i++){let y=220+i*66;z+=P("M-70 "+y+"Q260 "+(y-90)+" 555 "+y+"T1270 "+(y-40),"none",i%2?"#e9e3d5":"#bcd6d1",27)}z+=bird(780,195,55)+bird(905,215,42);break;
 case"bowl":z+=hills(p)+C(990,185,105,a)+E(585,514,300,85,"#5c5157")+P("M290 490Q310 640 585 645Q860 630 879 490Z","#f5f0df","#baa786",12)+E(585,489,290,71,"#e8e5cc")+E(585,492,255,49,"#f2edd8")+P("M520 325q-50 -75 25 -145M610 345q-50 -70 25 -145","none","#dfd6ca",18);break;
 }
 return z;
}

/* 촘촘하고 불규칙한 색유리 조각: 작품마다 고정된 패턴으로 재현한다. */
function richGlass(seed,p){
 let state=(1234567+seed*80173)>>>0;
 const rand=()=>{state=(1664525*state+1013904223)>>>0;return state/4294967296};
 let s='<g opacity=".82">';
 const step=39;
 for(let row=-1;row<19;row++)for(let col=-1;col<32;col++){
   let x=col*step,y=row*step;
   let jx=3+rand()*11,jy=3+rand()*11;
   let w=step+rand()*9,h=step+rand()*8;
   let corner=5+rand()*14;
   let color=p[Math.floor(rand()*p.length)];
   let alpha=(.21+rand()*.37).toFixed(2);
   let d="M"+(x+jx)+" "+y+"L"+(x+w)+" "+(y+rand()*8)+"L"+(x+w-corner/3)+" "+(y+h)+"L"+(x+rand()*9)+" "+(y+h-corner/4)+"Z";
   s+='<path d="'+d+'" fill="'+color+'" fill-opacity="'+alpha+'" stroke="#161a3b" stroke-opacity=".68" stroke-width="2.5"/>';
   if(rand()>.82)s+='<path d="M'+(x+7)+' '+(y+6)+'L'+(x+w*.68)+' '+(y+6)+'" stroke="#fff7d1" stroke-opacity=".48" stroke-width="2.3"/>';
 }
 return s+'</g>';
}
function glassShimmers(seed){
 let v=(77823+seed*91357)>>>0;
 const rnd=()=>{v=(1103515245*v+12345)>>>0;return v/4294967296};
 let out='<g fill="none" stroke="#fffbe5" stroke-linecap="round">';
 for(let i=0;i<44;i++){
  let x=(25+rnd()*1150).toFixed(1), y=(25+rnd()*630).toFixed(1), r=2+rnd()*12;
  out+='<path d="M'+(x-r)+' '+y+'h'+(2*r)+'M'+x+' '+(y-r)+'v'+(2*r)+'" stroke-width="'+(i%3===0?2.8:1.2)+'" opacity="'+(.30+rnd()*.58).toFixed(2)+'"/>';
 }
 return out+'</g>';
}
function build(slug,index,title){
 const offset=(cases[slug]||[]);const n=Math.max(0,Math.min(offset.length-1,Number(index)||0));const theme=offset[n];const serial=Object.keys(cases).slice(0,Object.keys(cases).indexOf(slug)).reduce((v,s)=>v+cases[s].length,0)+n;const p=pal[serial]||pal[0];
 const base='<defs><linearGradient id="sky" x2="1" y2="1"><stop stop-color="'+p[0]+'"/><stop offset=".48" stop-color="'+p[1]+'"/><stop offset="1" stop-color="'+p[2]+'"/></linearGradient><linearGradient id="train" x2="1" y2=".2"><stop stop-color="'+p[4]+'"/><stop offset=".55" stop-color="'+p[1]+'"/><stop offset="1" stop-color="'+p[0]+'"/></linearGradient><pattern id="mosa" width="79" height="69" patternUnits="userSpaceOnUse"><path d="M0 0H48L79 25V69H36L0 43Z" fill="'+p[2]+'" opacity=".16"/><path d="M0 0 48 0 36 39 0 43Z" fill="'+p[3]+'" opacity=".25"/><path d="M48 0 79 25 36 39Z" fill="'+p[4]+'" opacity=".3"/><path d="M36 39 79 25 79 69H36Z" fill="'+p[1]+'" opacity=".25"/><path d="M0 0H48L79 25V69H36L0 43Z M48 0 36 39 79 25 M36 39V69" stroke="#f4c77b" stroke-width="2" fill="none" opacity=".64"/></pattern><pattern id="facets" width="43" height="41" patternUnits="userSpaceOnUse"><path d="M0 0 43 0 24 19 43 41H0L24 19Z" fill="none" stroke="#eccc78" stroke-width="1.3" opacity=".48"/></pattern><radialGradient id="glow"><stop stop-color="#fff6b7" stop-opacity=".3"/><stop offset="1" stop-color="#fff6b7" stop-opacity="0"/></radialGradient></defs>';
 const bg=R(0,0,1200,680,'url(#sky)')+C(200,170,340,'url(#glow)')+richGlass(serial,p)+P("M0 125Q270 25 435 125T800 100T1200 115","none",p[2],19)+P("M0 370Q340 210 650 360T1200 270V680H0Z",p[0])+P("M0 520Q410 380 715 490T1200 425V680H0Z",p[4])+R(0,0,1200,680,"url(#mosa)");
 const signature='<path d="M22 19H1178V661H22Z" fill="none" stroke="#ffe8ae" stroke-width="7" opacity=".87"/>';
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 680" role="img" aria-label="'+String(title).replace(/&/g,"&amp;").replace(/"/g,"&quot;")+'을 주제로 한 모자이크 디지털 시화">'+base+bg+'<g>'+motif(theme,p)+'</g>'+R(0,0,1200,680,'url(#facets)')+glassShimmers(serial)+signature+'</svg>';
}
function render(root,slug,index,title){if(!root)return;root.innerHTML="";const img=document.createElement("img");img.alt=(title||"작품")+" — 작품별 색채 모자이크 디지털 시화";img.loading="eager";img.decoding="async";img.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(build(slug,index,title));root.appendChild(img)}
window.MyeongdoMosaic={render:render,build:build};
})();