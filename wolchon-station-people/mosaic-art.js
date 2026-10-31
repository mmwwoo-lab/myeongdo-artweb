/* 명도재 월촌역 사람들 — 작품별 독립 모자이크 시화 렌더러.
   각 작품의 이미지와 색채를 다른 SVG로 그리며, 외부 이미지 호스팅에 의존하지 않습니다. */
(function(){
"use strict";
const pal=[["#092d6b","#8c19a6","#ffe122","#fa3b65","#00cdb6"],["#113e6c","#7644bd","#ffdf49","#ff7744","#14b6ba"],["#14228b","#a92fde","#ffcf1a","#ff4f9c","#22d7ed"],["#123d79","#bf2f92","#ffc52e","#ff614d","#13d8ac"],["#063f7c","#8521d4","#ffdd18","#ff3d93","#23cb5a"],["#093678","#1567cc","#ffcb24","#ff5791","#19c7a5"],["#153c75","#a220c3","#ffc122","#ff552d","#00c5af"],["#102e91","#e027aa","#ffdf1e","#ff6723","#10cfdd"],["#333b82","#c82e9c","#ffd143","#16c9bd","#f07e41"],["#233480","#cf194f","#ffe123","#f63464","#19c4b5"],["#103998","#334ee3","#ffe221","#f72a62","#f9f9f1"],["#073d8b","#1292b8","#ffd642","#eb3c99","#54eab2"],["#232e68","#c05b37","#ffd263","#e27387","#5bbca4"],["#171a59","#543ea6","#ffe29b","#e4a4e7","#75cee0"],["#17447f","#b9498c","#f8e5a0","#f37e98","#81c98a"],["#103a75","#a02fde","#ffbc32","#fa3292","#10d5b0"],["#194c7a","#6659de","#ffe031","#ff862e","#0ed3bd"],["#153289","#9731d6","#ffdb28","#fc58a3","#28c3ed"],["#064a8b","#17b8c9","#ffdf7c","#f15ab7","#6af1cd"],["#202f76","#be3698","#ffc62b","#e95b2f","#3bdfae"]];
const cases={
"lee-seongdu":["hands","gift","star","mail","flowers","birds"],
"jeon-jinsik":["pocket","mirage","mother","lily","flag","river","father","moon","fleabane"],
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
 case"father":z+=hills(p)+P("M135 520L240 340L395 522M145 355L395 355M165 355L355 525M370 355L165 525","none","#573a3c",24)+P("M135 520L240 340L395 522M145 355L395 355M165 355L355 525M370 355L165 525","none","#e3b66b",7)+human(570,275,1.06,p[1])+P("M445 330Q530 255 620 327L675 485L550 515Z",b,"#f8d57d",9)+P("M0 595Q400 460 900 585T1200 535","none",a,11);break;
 case"moon":z+=hills(p)+C(880,147,115,"#ffe9aa")+C(880,147,108,"#fff6d2")+P("M190 650Q160 480 350 425T580 320","none",v,12)+E(900,570,240,72,"#5a9eaf")+E(900,565,140,29,"#f5e0a1")+P("M520 560L610 490L730 530L650 600Z",p[1],"#f5d687",7)+P("M605 500L625 325","none",a,13)+C(632,319,23,a);break;
 case"fleabane":z+=hills(p);for(let i=0;i<20;i++){let x=70+i*57,y=350+(i%4)*63;z+=P("M"+x+" "+(y+160)+"Q"+(x-18)+" "+(y+70)+" "+x+" "+y,"none","#316c5a",8)+blossom(x,y,19+(i%3)*7,i%3===0?"#fcece2":i%3===1?"#f8dba5":"#e7b9df")}z+=P("M650 640Q660 445 770 360L850 540Z","#e5a77c","#6d587d",8)+C(1030,165,86,a);break;
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

/* 세부 풍경 보강: 원근감 있는 공간, 손에 잡히는 생활 사물, 꽃·나뭇잎·도시·빛의 리듬을 묘사한다. */
function house(x,y,s,wall,roof){
 return '<g transform="translate('+x+' '+y+') scale('+s+')">'+
 P("M-75 0L0 -62L75 0Z",roof,"#241f42",7)+R(-66,0,132,103,wall,4)+R(-10,34,30,69,"#423153",4)+
 R(-49,21,27,27,"#ffe3a4",3)+R(27,21,27,27,"#ffe3a4",3)+
 P("M-35 21V48M41 21V48","none","#493463",4)+
 P("M-73 102H73","none","#342b47",8)+"</g>"
}
function lantern(x,y,s,color){
 return '<g transform="translate('+x+' '+y+') scale('+s+')">'+
 P("M0 -30V-14","none","#ffd96a",4)+
 P("M-18 -13Q0 -33 18 -13L22 19Q0 36 -22 19Z",color,"#372844",5)+
 P("M-18 4H20","none","#ffe2a5",3)+
 C(0,0,5,"#fff1ac")+"</g>"
}
function leaf(x,y,s,angle,color){
 return '<g transform="translate('+x+' '+y+') rotate('+angle+') scale('+s+')">'+
 P("M0 0Q-45 -62 0 -97Q50 -58 0 0Z",color,"#3c294d",4)+P("M0 0L0 -88M0 -30L-20 -45M0 -52L23 -65","none","#ffe4a4",3)+"</g>"
}
function frameScene(k,p){
 let z="",a=p[2],b=p[3],v=p[4],deep=p[0],indigo=p[1];
 // 공통: 멀리 겹치는 산, 금빛 길, 조각유리로 만든 원경 마을
 for(let i=0;i<9;i++){
   let x=35+i*155,y=410+(i%3)*18;
   z+=P("M"+(x-100)+" "+(y+23)+"L"+x+" "+(y-55)+"L"+(x+95)+" "+(y+23)+"Z",i%2?indigo:deep,"#132744",5);
 }
 z+=P("M0 560Q245 475 480 555T960 525T1200 565","none","#f8d46a",8);
 const city=["hands","gift","star","mail","pocket","mirage","flag"];
 const water=["river","mist","bowl","couple"];
 if(city.includes(k)){
  for(let i=0;i<7;i++)z+=house(85+i*172,415+(i%2)*21,.48,i%2?a:"#cce0ca",i%2?b:indigo);
 }else{
  for(let i=0;i<8;i++){let x=30+i*160;z+=P("M"+x+" 585Q"+(x+30)+" 480 "+(x+12)+" 396","none","#203f4b",6);z+=blossom(x+12,397,18+i%3*5,[a,b,"#f9e5a9"][i%3])}
 }
 if(k==='father'){for(let i=0;i<5;i++)z+=house(50+i*220,412,.56,i%2?'#f3dba6':'#97b6b8',i%2?indigo:b);z+=P("M0 610Q280 480 550 564T1200 573","none",a,13);}
 if(k==='moon'){for(let i=0;i<12;i++)z+=star(75+i*94,100+(i%4)*48,10+i%3*4,i%2?a:"#fff6bc");z+=P("M0 595Q550 450 1200 583","none","#9ad3da",14);}
 if(k==='fleabane'){for(let i=0;i<18;i++)z+=blossom(52+i*64,465+(i%4)*27,22+i%3*5,i%2?"#fff9e9":"#dba8e7");}
 if(water.includes(k)){
  for(let i=0;i<18;i++){let x=23+i*69,y=568+(i%3)*22;z+=P("M"+x+" "+y+"q26 -12 50 0","none",i%3?a:"#f5de9a",4)}
 }
 if(["flowers","lily","daughter","birds","tree"].includes(k)){
  for(let i=0;i<12;i++){let x=20+i*110,y=525+(i%4)*31;z+=blossom(x,y,20+(i%3)*7,[a,b,"#fff1d8","#e83a8e"][i%4])}
 }
 return z;
}
function jewelDetails(k,p){
 let z="",a=p[2],b=p[3],v=p[4],deep=p[0],indigo=p[1],white="#fff3c6";
 switch(k){
 case "hands":
  z+=P("M0 575Q245 440 465 535T1200 550","none","#f6c446",9);
  for(let i=0;i<8;i++)z+=leaf(70+i*130,455+(i%3)*35,.55,(i*37)%120,i%2?a:b);
  z+=lantern(170,190,1.6,b)+lantern(360,146,1,a);break;
 case "gift":
  for(let i=0;i<7;i++){let x=110+i*115;z+=R(x,487,90,22,i%2?a:b,3)+P("M"+x+" 487l10 -20h90l-10 20","none",white,4)}
  z+=P("M120 580Q450 475 1050 550","none",a,10)+lantern(960,183,1.9,b);break;
 case "star":
  z+=P("M20 455L1130 435","none","#ffd95e",14);
  for(let i=0;i<9;i++)z+=star(90+i*112,180+(i%3)*36,12+i%4*5,i%2?a:white);
  for(let i=0;i<5;i++)z+=human(230+i*145,445+i%2*15,.37,i%2?b:v);
  z+=P("M0 490L1200 525","none","#f2c469",12);break;
 case "mail":
  for(let i=0;i<7;i++){let x=60+i*140;z+=P("M"+x+" "+(160+i%3*45)+"l45 -20l23 38l-45 20Z",i%2?white:b,"#2a344d",5)}
  z+=P("M140 585Q610 510 1150 603","none",a,11)+star(1030,125,28,white);break;
 case "flowers":
  for(let i=0;i<11;i++)z+=blossom(75+i*107,300+(i%4)*58,32+i%3*9,["#f7379d","#fff0e3","#fd7829","#b965f3"][i%4]);
  z+=lantern(955,210,1.3,a)+lantern(1090,248,.9,b);break;
 case "birds":
  for(let i=0;i<15;i++)z+=bird(110+i*66,180+(i%4)*28,14+i%5*4);
  for(let i=0;i<6;i++)z+=leaf(130+i*200,515,.9,i*33,b);
  z+=C(1010,130,65,a);break;
 case "pocket":
  for(let i=0;i<10;i++)z+=leaf(130+i*101,235+(i%4)*76,.7,28+i*32,i%2?a:b);
  z+=P("M265 615Q565 475 920 560","none",white,10);break;
 case "mirage":
  for(let i=0;i<9;i++)z+=P("M"+(70+i*115)+" "+(205+i%3*42)+"q70 -34 100 35t110 6","none",i%2?a:v,6);
  for(let i=0;i<6;i++)z+=leaf(110+i*174,525,.7,i*31,b);break;
 case "mother":
  for(let i=0;i<6;i++)z+=house(60+i*220,420,.6,"#f3cc8d",i%2?b:deep);
  z+=P("M130 590Q500 515 1040 609","none",white,10);
  for(let i=0;i<4;i++)z+=C(660+i*22,415-i*14,13,a);break;
 case "lily":
  for(let i=0;i<10;i++)z+=blossom(100+i*115,300+(i%3)*30,35+(i%3)*8,["#e7287e","#ffdd95","#ff4c65"][i%3]);
  for(let i=0;i<6;i++)z+=leaf(120+i*175,570,.85,42+i*29,v);break;
 case "flag":
  for(let i=0;i<8;i++)z+=human(82+i*150,492+(i%3)*14,.38,i%2?b:deep);
  for(let i=0;i<12;i++)z+=star(55+i*99,188+(i%4)*45,11+(i%3)*5,i%2?a:white);
  z+=P("M85 510Q600 450 1150 550","none",a,12);break;
 case "river":
  for(let i=0;i<8;i++)z+=house(60+i*155,387+(i%2)*23,.55,"#f2d9aa",i%2?b:deep);
  for(let i=0;i<16;i++){let x=55+i*71;z+=P("M"+x+" "+(520+i%3*30)+"q45 -19 75 0","none",i%2?a:white,7)}
  z+=star(990,150,40,a);break;
 case "father":
  for(let i=0;i<7;i++)z+=leaf(80+i*163,540,.8,i*37,i%2?a:b);
  z+=lantern(1000,170,1.4,a)+lantern(1120,220,.9,b);
  z+=P("M140 575L410 575","none",white,11);break;
 case "moon":
  for(let i=0;i<22;i++)z+=star(46+i*52,195+(i%5)*54,8+i%4*3,i%2?white:b);
  for(let i=0;i<7;i++)z+=P("M"+(620+i*73)+" "+(570+i%2*24)+"q42 -16 79 0","none",white,6);
  z+=lantern(240,200,.8,a);break;
 case "fleabane":
  for(let i=0;i<18;i++)z+=blossom(35+i*68,365+(i%4)*52,17+i%3*7,["#fff9ea","#ffe29e","#f4afd1"][i%3]);
  for(let i=0;i<8;i++)z+=leaf(105+i*145,564,.54,i*32,v);
  z+=star(1065,155,48,white);break;
 case "daughter":
  for(let i=0;i<16;i++)z+=blossom(90+i*69,440+(i%4)*42,25+(i%3)*12,["#fb5b9f","#fff1cd","#ffbb3a","#bb6afb"][i%4]);
  z+=star(1040,155,50,white);
  for(let i=0;i<7;i++)z+=leaf(110+i*175,560,.6,20+i*40,v);break;
 case "tree":
  for(let i=0;i<14;i++)z+=leaf(170+i*69,170+(i%4)*53,.9,25+i*39,["#e63d76","#ffc532","#7bd799","#9e67e1"][i%4]);
  for(let i=0;i<8;i++)z+=star(70+i*145,530+(i%3)*20,11+i%4*3,white);break;
 case "couple":
  for(let i=0;i<10;i++)z+=star(80+i*115,165+(i%4)*38,12+i%3*5,white);
  z+=P("M555 458Q600 428 636 469","none",white,9);
  for(let i=0;i<8;i++)z+=leaf(45+i*160,595,.65,i*23,b);break;
 case "mist":
  for(let i=0;i<13;i++)z+=P("M-80 "+(205+i*29)+"q420 -104 760 0t640 -24","none",i%2?white:v,5);
  z+=C(980,157,60,white)+bird(830,182,45);
  for(let i=0;i<5;i++)z+=leaf(120+i*225,580,.55,i*48,b);break;
 case "bowl":
  for(let i=0;i<7;i++)z+=house(85+i*164,405,.56,"#f9dcb2",i%2?indigo:deep);
  z+=lantern(215,185,1.4,b)+lantern(985,210,1.5,a);
  for(let i=0;i<8;i++)z+=P("M"+(215+i*105)+" 580q40 -20 73 0","none",white,8);break;
 }
 return z;
}
function build(slug,index,title){
 const offset=(cases[slug]||[]);const n=Math.max(0,Math.min(offset.length-1,Number(index)||0));const theme=offset[n];const serial=Object.keys(cases).slice(0,Object.keys(cases).indexOf(slug)).reduce((v,s)=>v+cases[s].length,0)+n;const p=pal[serial]||pal[0];
 const base='<defs><linearGradient id="sky" x2="1" y2="1"><stop stop-color="'+p[0]+'"/><stop offset=".48" stop-color="'+p[1]+'"/><stop offset="1" stop-color="'+p[2]+'"/></linearGradient><linearGradient id="train" x2="1" y2=".2"><stop stop-color="'+p[4]+'"/><stop offset=".55" stop-color="'+p[1]+'"/><stop offset="1" stop-color="'+p[0]+'"/></linearGradient><pattern id="mosa" width="79" height="69" patternUnits="userSpaceOnUse"><path d="M0 0H48L79 25V69H36L0 43Z" fill="'+p[2]+'" opacity=".16"/><path d="M0 0 48 0 36 39 0 43Z" fill="'+p[3]+'" opacity=".25"/><path d="M48 0 79 25 36 39Z" fill="'+p[4]+'" opacity=".3"/><path d="M36 39 79 25 79 69H36Z" fill="'+p[1]+'" opacity=".25"/><path d="M0 0H48L79 25V69H36L0 43Z M48 0 36 39 79 25 M36 39V69" stroke="#f4c77b" stroke-width="2" fill="none" opacity=".64"/></pattern><pattern id="facets" width="43" height="41" patternUnits="userSpaceOnUse"><path d="M0 0 43 0 24 19 43 41H0L24 19Z" fill="none" stroke="#eccc78" stroke-width="1.3" opacity=".48"/></pattern><radialGradient id="glow"><stop stop-color="#fff6b7" stop-opacity=".3"/><stop offset="1" stop-color="#fff6b7" stop-opacity="0"/></radialGradient></defs>';
 const bg=R(0,0,1200,680,'url(#sky)')+C(200,170,340,'url(#glow)')+richGlass(serial,p)+P("M0 125Q270 25 435 125T800 100T1200 115","none",p[2],19)+P("M0 370Q340 210 650 360T1200 270V680H0Z",p[0])+P("M0 520Q410 380 715 490T1200 425V680H0Z",p[4])+R(0,0,1200,680,"url(#mosa)");
 const signature='<path d="M22 19H1178V661H22Z" fill="none" stroke="#ffe8ae" stroke-width="7" opacity=".87"/>';
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 680" role="img" aria-label="'+String(title).replace(/&/g,"&amp;").replace(/"/g,"&quot;")+'을 주제로 한 모자이크 디지털 시화">'+base+bg+'<g>'+frameScene(theme,p)+'</g><g>'+motif(theme,p)+'</g><g>'+jewelDetails(theme,p)+'</g>'+R(0,0,1200,680,'url(#facets)')+glassShimmers(serial)+signature+'</svg>';
}
function render(root,slug,index,title){if(!root)return;root.innerHTML="";const img=document.createElement("img");img.alt=(title||"작품")+" — 작품별 색채 모자이크 디지털 시화";img.loading="eager";img.decoding="async";img.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(build(slug,index,title));root.appendChild(img)}
window.MyeongdoMosaic={render:render,build:build};
})();