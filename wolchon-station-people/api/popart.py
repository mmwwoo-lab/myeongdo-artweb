"""월촌역 문학관: 시 원문을 분석하여 팝아트 SVG를 그리는 Python 엔진.
Vercel Python Serverless Function: POST /api/popart (JSON: title, poem).
외부 유료 API나 라이브러리가 필요하지 않습니다.
"""
from http.server import BaseHTTPRequestHandler
from html import escape
import hashlib, json, math, random, re

W,H=1200,675
PAL=[
 ('#1466ed','#ffda2d','#ff5579','#28cfbe','#17152f'),
 ('#2f38d4','#ffa32b','#f4447e','#6fdef1','#231639'),
 ('#185ab2','#fced39','#ff664a','#61d6a5','#19203d'),
 ('#633cb9','#ffd148','#f04b69','#22c5db','#211538')
]
WORDS={
 'autumn':['가을','홍시','단풍','낙엽','라이터','포장마차'],
 'well':['우물','두레박','뿌리','윤동주','별을 헤아'],
 'sea':['바다','수평선','모래','하늘'],
 'flower':['모란','상사화','개망초','유채꽃','꽃','새싹'],
 'city':['지하철','월촌역','가로등','골목','우편함'],
 'river':['강물','호수','물안개','물결','못물'],
 'family':['아버지','엄마','어머니','아내','딸아','아들아'],
 'moon':['달','별','밤하늘']
}
def mosaic_finish(seed, width=W, height=H, tile=13):
 """2단계: 팝아트 전체에 작은 색유리 모자이크 면과 줄눈을 추가한다.

 조각의 채색은 반투명으로 처리해 1단계의 인물·사물 윤곽을 보존한다.
 동일 시 원문은 동일한 조각 패턴을 만든다.
 """
 rng=random.Random(seed ^ 0xA53C91)
 out=['<g aria-label="2단계 미세 모자이크 마감" pointer-events="none">']
 colors=('#fff5c8','#ffce6a','#52d7f0','#fc81aa','#9e83dc')
 for y in range(0,height,tile):
  for x in range(0,width,tile):
   j=round(tile*(.28+.30*rng.random()),1)
   col=colors[rng.randrange(len(colors))]
   opacity=.07+.08*rng.random()
   # 선이 한 방향으로만 정렬되지 않도록 조각을 2개의 다각형으로 분할
   out.append(f'<path d="M{x} {y}l{tile} 0 -{j} {tile} -{tile-j} 0Z" fill="{col}" fill-opacity="{opacity:.2f}" stroke="#13132a" stroke-opacity=".35" stroke-width=".95"/>')
   out.append(f'<path d="M{x+tile} {y}v{tile}h-{j}Z" fill="{colors[(x//tile+y//tile)%len(colors)]}" fill-opacity=".06" stroke="#13132a" stroke-opacity=".35" stroke-width=".9"/>')
 out.append('</g>')
 return ''.join(out)

STYLES={'pop_mosaic':'팝아트·모자이크','watercolor':'수채화','crayon':'크레용화','portrait':'인물화'}

def style_finish(style, seed):
 """시화의 기본 도상을 유지하며 각 화풍에 따라 색면과 표면 효과를 다르게 처리."""
 rng=random.Random(seed ^ 0xF3A11)
 out=[]
 if style=='watercolor':
  out.append('<g aria-label="수채화 물 번짐과 투명 색층" pointer-events="none">')
  colors=['#f6dab8','#bedadd','#ecc6d6','#d0cde7','#fae7bf']
  for i in range(145):
   x=rng.randrange(W); y=rng.randrange(H); r=rng.randrange(20,135)
   out.append(f'<ellipse cx="{x}" cy="{y}" rx="{r}" ry="{r*.65:.1f}" fill="{colors[i%5]}" opacity=".065"/>')
  for i in range(80):
   x=rng.randrange(W); y=rng.randrange(H)
   out.append(f'<path d="M{x} {y}q50 -22 105 4" stroke="#f7f3ea" stroke-opacity=".28" stroke-width="3" fill="none"/>')
  out.append('</g>')
 elif style=='crayon':
  out.append('<g aria-label="크레용 종이 결 및 중첩 선묘" pointer-events="none">')
  colors=['#fce05e','#ff6f77','#b78ee8','#66cfdd','#fff2d0']
  for i in range(1150):
   x=rng.randrange(W);y=rng.randrange(H); length=rng.randrange(5,27)
   out.append(f'<path d="M{x} {y}l{length} {-length//3}" stroke="{colors[i%5]}" stroke-width="{rng.choice([2,3,4])}" stroke-opacity=".42" stroke-linecap="round"/>')
  out.append('</g>')
 elif style=='portrait':
  # 원문에서 특정 인물의 실존 얼굴은 추정하지 않는다. 상징적 인물 초상을 그린다.
  out.append('<g aria-label="상징적 인물화 초상" transform="translate(690 65)">')
  out.append('<path d="M35 600Q-12 424 95 359Q173 311 278 357Q383 420 365 600Z" fill="#514b87" stroke="#26203c" stroke-width="13"/>')
  out.append('<path d="M115 170Q103 68 199 39Q310 42 320 157L300 306Q260 372 190 353Q111 334 115 170Z" fill="#e5aa86" stroke="#30263a" stroke-width="11"/>')
  out.append('<path d="M95 185Q70 40 199 18Q336 12 340 157L299 120Q222 146 170 104Q144 152 95 185Z" fill="#25243d" stroke="#242039" stroke-width="9"/>')
  out.append('<path d="M148 206q27 -16 57 0M240 205q29 -15 54 2M215 220l-13 55 22 9M180 309q45 16 83 -4" stroke="#603e42" stroke-width="7" fill="none" stroke-linecap="round"/>')
  out.append('<path d="M132 362l58 90 47 -86M278 359l-44 93" stroke="#eec8ac" stroke-width="11" fill="none"/>')
  out.append('</g>')
 return ''.join(out)

def art(title,poem,style='pop_mosaic'):
 if style not in STYLES: raise ValueError('Unknown style')
 text=title+' '+poem
 seed=int(hashlib.sha256(text.encode()).hexdigest()[:12],16)
 rng=random.Random(seed)
 scores={k:sum(text.count(v) for v in vs) for k,vs in WORDS.items()}
 category=max(scores,key=lambda k:scores[k]) if max(scores.values()) else 'moon'
 bg,yellow,coral,aqua,ink=PAL[seed%len(PAL)]
 o=[f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" aria-label="{escape(title,quote=True)} 팝아트 및 미세 모자이크 시화">']
 o+=['<defs><pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="2.4" fill="'+ink+'" opacity=".32"/></pattern></defs>',
    f'<rect width="{W}" height="{H}" fill="{bg}"/>',
    f'<path d="M0 0H780L170 675H0Z" fill="{aqua}" opacity=".36"/>',
    f'<path d="M500 0H1200V470L1020 250Z" fill="{coral}" opacity=".22"/>']
 def path(d,fill,stroke=ink,sw=7):
  o.append(f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round" stroke-linecap="round"/>')
 def circ(x,y,r,col,sw=6):
  o.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r:.1f}" fill="{col}" stroke="{ink}" stroke-width="{sw}"/>')
 def line(d,col=ink,sw=8):path(d,'none',col,sw)
 def star(x,y,r):
  d=' '.join(('M' if i==0 else 'L')+f'{x+math.cos(-math.pi/2+i*math.pi/5)*(r if i%2==0 else r*.46):.1f} {y+math.sin(-math.pi/2+i*math.pi/5)*(r if i%2==0 else r*.46):.1f}' for i in range(10))+'Z'
  path(d,yellow,ink,3)
 def plant(x,y,color=coral):
  line(f'M{x} 670Q{x-22} 532 {x} 440','#145e65',7)
  for i in range(8):
   a=i*math.pi/4
   circ(x+math.cos(a)*32,432+math.sin(a)*32,19,color,3)
  circ(x,432,14,yellow,3)
 def figure(x,y,scale=1):
  o.append(f'<g transform="translate({x} {y}) scale({scale})">')
  path('M-100 125Q-125 20-57 0H45Q112 37 111 145L145 320H-135Z','#45357e',ink,10)
  path('M-51-22Q-84-107-10-144Q74-146 77-62L42 2Z','#e9a577',ink,9)
  path('M-72-87Q-42-165 33-144Q76-129 78-89L26-120Z',ink,ink,8)
  line('M-72 80L-141 175M82 80L144 177','#302453',30)
  o.append('</g>')
 # 원경: 강·산·빛의 기하학적 구조
 path('M0 430Q230 325 438 420T860 380T1200 410V675H0Z','#2e4082',ink,8)
 path('M0 545Q280 475 540 530T1200 505V675H0Z',aqua,ink,8)
 if category in ('moon','autumn','river','well','sea'):circ(983,130,86,yellow,10)
 if category in ('city','autumn'):
  for i in range(10):
   x=45+i*116; h=105+(i*31)%140
   path(f'M{x} 498V{498-h}h91V498Z',coral if i%3==0 else '#7461b0',ink,5)
   for j in range(3):
    for z in range(2):
     o.append(f'<rect x="{x+15+z*33}" y="{515-h+j*35}" width="17" height="20" fill="{yellow}" stroke="{ink}" stroke-width="2"/>')
 if category in ('autumn','family','city','well'):figure(860,365,.85)
 if category=='autumn':
  path('M90 373L290 280L492 373V568H90Z','#ff7257',ink,13)
  path('M110 394H475V548H110Z','#ffe16a',ink,8)
  for i in range(4):circ(140+i*95,394,16,yellow)
  line('M100 178Q270 100 548 152M220 180L430 245',ink,22)
  circ(499,235,31,coral)
  line('M585 335V660',ink,15);circ(585,330,29,yellow)
  for i in range(32):
   x=35+(i*79)%1150;y=518+(i*53)%135
   path(f'M{x} {y}q-24 -18 0 -34q29 19 0 34Z',coral if i%2 else yellow,ink,3)
 elif category=='well':
  path('M290 525Q525 388 770 520L725 635H335Z','#96959b',ink,15)
  path('M342 524Q535 456 719 523','#50bed4',ink,8)
  line('M365 520V290M710 520V290M365 290Q525 200 710 290',ink,14)
  line('M527 280V530','#ffdb84',9)
  for i in range(19):star(80+(i*89)%1030,65+(i*43)%325,8+i%4*5)
  for i in range(9):line(f'M{30+i*115} 665q40 -70 28 -140','#8e4a3a',9)
 elif category=='sea':
  for i in range(17):
   y=480+i*12
   line(f'M0 {y}Q300 {y-34} 590 {y}T1200 {y}',yellow if i%3==0 else '#a0f3ec',3)
 elif category=='flower':
  for i in range(22):plant(35+i*54,460+(i%3)*10,coral if i%3 else yellow)
 elif category=='family':
  figure(320,395,.65);line('M446 588Q550 535 643 585','#ffddb2',18)
 elif category=='city':
  path('M85 415H660V548H85Z','#2cd3d1',ink,13)
  for i in range(6):
   x=115+i*87;o.append(f'<rect x="{x}" y="438" width="55" height="70" fill="#fcedb2" stroke="{ink}" stroke-width="6"/>')
 elif category=='river':
  for i in range(28):line(f'M{(i*52)%1190} {510+(i%5)*28}q35 -17 77 0',yellow if i%2 else '#e0f7ee',5)
 for i in range(100):
  x=rng.randrange(12,1188);y=rng.randrange(20,655)
  if (x<250 and y<185) or (x>935 and y>515):
   circ(x,y,rng.uniform(1.3,3.7),ink,0)
 for i in range(14):star(25+(i*89)%1100,30+(i%4)*35,6+(i%3)*4)
 if style=='pop_mosaic': o.append(mosaic_finish(seed))
 else: o.append(style_finish(style,seed))
 o.append(f'<rect x="8" y="8" width="1184" height="659" fill="none" stroke="{ink}" stroke-width="17"/>')
 o.append('</svg>')
 return ''.join(o)


# 화풍별 독립된 장면 엔진: 같은 시라도 구도, 팔레트, 도형 배치가 다릅니다.
def styled_art(title, poem, style):
    seed=int(hashlib.sha256((title+'\n'+poem).encode('utf-8')).hexdigest()[:14],16)
    rng=random.Random(seed)
    text=title+' '+poem
    symbol_scores={
        'autumn':sum(text.count(w) for w in ('가을','홍시','단풍','낙엽','감나무','라이터')),
        'water':sum(text.count(w) for w in ('바다','강','물','우물','안개','호수','두레박')),
        'flowers':sum(text.count(w) for w in ('꽃','모란','상사화','개망초','유채','봄')),
        'city':sum(text.count(w) for w in ('지하철','월촌역','포장마차','가로등','골목')),
        'stars':sum(text.count(w) for w in ('별','달','밤','하늘')),
        'family':sum(text.count(w) for w in ('엄마','아버지','아내','딸','아들','사람'))
    }
    themes=sorted(symbol_scores,key=lambda key:symbol_scores[key],reverse=True)
    if symbol_scores[themes[0]]==0: themes=['stars','flowers','water']
    label={'watercolor':'수채화','crayon':'감성화','portrait':'초상화'}[style]
    o=[f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" aria-label="{escape(title,quote=True)} {label}">']
    def add(t):o.append(t)
    def shape(d, fill, edge='none',width=2,opacity=1):
        add(f'<path d="{d}" fill="{fill}" stroke="{edge}" stroke-width="{width}" opacity="{opacity}"/>')
    def circle(x,y,r,fill,edge='none',width=2,opacity=1):
        add(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r:.1f}" fill="{fill}" stroke="{edge}" stroke-width="{width}" opacity="{opacity}"/>')
    if style=='watercolor':
        # 넓은 하늘과 호수를 중심으로 한 여백 많은 수평적 원경, 옅은 파스텔
        sky,land,accent,stroke='#f8f2ec','#aabec3','#d9aa99','#77909a'
        add('<defs><linearGradient id="wash" x2="0" y2="1"><stop stop-color="#e6e9f3"/><stop offset=".52" stop-color="#f6e0d9"/><stop offset="1" stop-color="#c0d8d7"/></linearGradient><filter id="soft"><feGaussianBlur stdDeviation="13"/></filter></defs>')
        add(f'<rect width="{W}" height="{H}" fill="url(#wash)"/>')
        for i in range(55):
            x=rng.randrange(-80,1200);y=rng.randrange(30,680);rx=rng.randrange(35,160)
            c=rng.choice(('#c3cadb','#e3b9ad','#a2bcc5','#dacdbe','#b7c5b5'))
            add(f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{rx*.37:.1f}" fill="{c}" opacity=".12" filter="url(#soft)"/>')
        shape('M0 390Q160 280 340 373T680 357T1200 380V675H0Z','#a4b7bd',opacity=.38)
        shape('M0 492Q220 443 430 495T880 480T1200 458V675H0Z','#a8cbd2',opacity=.56)
        circle(850,267,66,'#f7dfb9',opacity=.75)
        for i in range(34):
            y=500+i*5;x=(i*101)%1120
            shape(f'M{x} {y}q42 -12 84 0','none','#fdf4e9',2,.5)
        if 'autumn' in themes[:2]:
            shape('M-25 0Q130 120 200 280M70 100Q255 55 390 140','none','#79877b',9,.6)
            for i in range(65):
                x=rng.randrange(15,490);y=rng.randrange(12,320);r=rng.randrange(5,18)
                circle(x,y,r,rng.choice(('#cf9d73','#c9a278','#d8aa86')),opacity=.42)
        if 'flowers' in themes[:2]:
            for i in range(20):
                x=38+i*56;y=540+rng.randrange(0,105)
                shape(f'M{x} 675Q{x-7} 620 {x} {y}','none','#8ba69a',2,.75)
                circle(x,y,12,rng.choice(('#d8aab0','#dfc6d2','#f3d8b6')),opacity=.75)
        if 'city' in themes[:2]:
            for i in range(12):
                x=45+i*102;h=rng.randrange(50,110)
                add(f'<rect x="{x}" y="{465-h}" width="71" height="{h}" fill="#b6b8c2" opacity=".38"/>')
        if 'stars' in themes[:2]:
            for i in range(14):circle(rng.randrange(60,1150),rng.randrange(55,300),rng.randrange(2,6),'#fff4e2',opacity=.8)
        # 수채 물감 종이결
        for i in range(80):
            x=rng.randrange(1200);y=rng.randrange(675)
            shape(f'M{x} {y}q24 -12 56 0','none','#ffffff',1,.24)
    elif style=='crayon':
        # 비대칭 사선 구성, 동화책의 상상 세계와 발랄한 색색의 굵은 선
        add('<rect width="1200" height="675" fill="#fff3d5"/>')
        shape('M0 0H720L190 675H0Z','#ffe47d')
        shape('M500 0H1200V675H800Z','#b3e2ee')
        shape('M0 550Q280 460 520 565T1200 525V675H0Z','#a8cb7d','#4f7c65',7)
        circle(980,136,85,'#f6aa4c','#ad5c4c',8)
        for i in range(20):
            x=rng.randrange(50,1140);y=rng.randrange(80,480)
            if i%3==0:
                shape(f'M{x} {y-15}l16 30h-32Z',rng.choice(('#ed6679','#9bcff0','#d1a4e3')),'#64518b',4)
        if 'autumn' in themes[:2]:
            shape('M70 630Q90 380 240 105M190 295Q320 110 480 190','none','#906a56',23)
            for i in range(40):
                x=rng.randrange(45,590);y=rng.randrange(45,380)
                circle(x,y,rng.randrange(9,23),rng.choice(('#e48d4f','#f4b94d','#e77768')),'#a87a62',2)
        if 'water' in themes[:2]:
            for i in range(9):
                y=405+i*25
                shape(f'M0 {y}Q200 {y-75} 400 {y}T800 {y}T1200 {y}','none',rng.choice(('#55bed5','#80a9cc','#4a95bd')),8)
        if 'flowers' in themes[:2]:
            for i in range(12):
                x=60+i*94;y=490+(i%3)*29
                shape(f'M{x} 675V{y}','none','#668c52',6)
                for j in range(5):
                    a=j*math.tau/5;circle(x+math.cos(a)*20,y+math.sin(a)*20,14,'#f685a4','#ac6985',3)
        if 'city' in themes[:2]:
            for i in range(9):
                x=24+i*140;h=110+(i*27)%170
                add(f'<rect x="{x}" y="{550-h}" width="110" height="{h}" rx="5" fill="{rng.choice(("#91a8d9","#de9c9d","#8ec5c8"))}" stroke="#726585" stroke-width="5"/>')
        # 크레용 획: 규칙적인 필터가 아니라 겹친 거친 손그림 스트로크
        strokes=('#ed6480','#6c9ccc','#e6ac4a','#85af88','#b68dce')
        for i in range(700):
            x=rng.randrange(W);y=rng.randrange(H);n=rng.randrange(5,32)
            shape(f'M{x} {y}l{n} {-n//3}','none',strokes[i%5],rng.choice((1.6,2.5,3)),rng.uniform(.15,.38))
        shape('M14 14H1186V661H14Z','none','#d6a76c',8)
    else:
        # 초상화: 배경에 시의 대표 사물을 배치하고 인물을 크게 독립된 중심 구성
        add('<defs><linearGradient id="night" x2="1" y2="1"><stop stop-color="#222d46"/><stop offset=".63" stop-color="#595174"/><stop offset="1" stop-color="#957178"/></linearGradient><radialGradient id="skin"><stop stop-color="#f2c39b"/><stop offset="1" stop-color="#bd8169"/></radialGradient></defs>')
        add('<rect width="1200" height="675" fill="url(#night)"/>')
        circle(930,168,96,'#e8d1a0',opacity=.75)
        shape('M550 675Q580 400 795 380Q1010 360 1075 675Z','#3b314c','#151727',13)
        shape('M730 390Q650 284 680 157Q735 48 846 86Q975 108 957 254Q921 387 839 405Z','url(#skin)','#272333',13)
        shape('M685 223Q636 65 809 48Q971 31 984 215L932 147Q842 167 779 122Q734 183 685 223Z','#29283c','#131522',13)
        shape('M747 245q34 -16 66 0M870 240q37 -15 62 2','none','#4e363f',8)
        shape('M831 256l-18 64 21 11M782 349q51 21 90 0','none','#8a554e',7)
        shape('M753 405l91 120 80 -125','none','#b48c7d',12)
        # 인물화 배경 상징: 인물과 함께 의미가 드러나도록 배치
        if 'autumn' in themes[:2]:
            shape('M0 10Q250 80 450 20M80 0L190 185','none','#5d4039',18)
            for i in range(22):
                x=rng.randrange(50,560);y=rng.randrange(18,330)
                circle(x,y,rng.randrange(8,20),rng.choice(('#c8794f','#dfa75d','#ad5e60')),opacity=.9)
        if 'water' in themes[:2]:
            shape('M0 440Q235 370 490 440T650 435V675H0Z','#356d84',opacity=.8)
            for i in range(15):
                y=480+i*12;shape(f'M15 {y}q90 -30 195 0T435 {y}','none','#c5d2ca',3,.65)
        if 'flowers' in themes[:2]:
            for i in range(11):
                x=60+(i*51)%470;y=330+(i*61)%230
                circle(x,y,22,rng.choice(('#dba9b6','#f1d8a9','#eb8d9e')),'#886374',3)
        if 'city' in themes[:2]:
            for i in range(8):
                x=25+i*65;h=135+(i*31)%130
                add(f'<rect x="{x}" y="{480-h}" width="48" height="{h}" fill="#826681" stroke="#343147" stroke-width="4"/>')
        if 'stars' in themes[:2]:
            for i in range(18):
                x=rng.randrange(35,540);y=rng.randrange(45,340)
                circle(x,y,rng.randrange(2,6),'#f6dca2')
        shape('M12 12H1188V663H12Z','none','#bd9b83',8)
    add('</svg>')
    return ''.join(o)


class handler(BaseHTTPRequestHandler):
 def do_POST(self):
  try:
   length=int(self.headers.get('Content-Length','0'))
   if length<1 or length>35000:
    self.send_error(413,'Invalid request length');return
   payload=json.loads(self.rfile.read(length).decode('utf-8'))
   style=str(payload.get('style','pop_mosaic'))
   title=str(payload.get('title',''))[:180]
   poem=str(payload.get('poem',''))[:15000]
   if not title or not poem: self.send_error(400,'Missing poem');return
   if style not in STYLES: self.send_error(400,'Unsupported art style');return
   body=(art(title,poem,style) if style=='pop_mosaic' else styled_art(title,poem,style)).encode('utf-8')
   self.send_response(200)
   self.send_header('Content-Type','image/svg+xml; charset=utf-8')
   self.send_header('Cache-Control','no-store')
   self.send_header('Content-Length',str(len(body)))
   self.end_headers();self.wfile.write(body)
  except (ValueError,TypeError,UnicodeDecodeError,json.JSONDecodeError):
   self.send_error(400,'Invalid JSON input')
