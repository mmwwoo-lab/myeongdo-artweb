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
def art(title,poem):
 text=title+' '+poem
 seed=int(hashlib.sha256(text.encode()).hexdigest()[:12],16)
 rng=random.Random(seed)
 scores={k:sum(text.count(v) for v in vs) for k,vs in WORDS.items()}
 category=max(scores,key=lambda k:scores[k]) if max(scores.values()) else 'moon'
 bg,yellow,coral,aqua,ink=PAL[seed%len(PAL)]
 o=[f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" aria-label="{escape(title,quote=True)} 팝아트 시화">']
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
   circ(x+math.cos(a)*32,y+math.sin(a)*32 if (y:=432) else 432,19,color,3)
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
 o.append(f'<rect x="8" y="8" width="1184" height="659" fill="none" stroke="{ink}" stroke-width="17"/>')
 o.append('</svg>')
 return ''.join(o)

class handler(BaseHTTPRequestHandler):
 def do_POST(self):
  try:
   length=int(self.headers.get('Content-Length','0'))
   if length<1 or length>35000:
    self.send_error(413,'Invalid request length');return
   payload=json.loads(self.rfile.read(length).decode('utf-8'))
   title=str(payload.get('title',''))[:180]
   poem=str(payload.get('poem',''))[:15000]
   if not title or not poem: self.send_error(400,'Missing poem');return
   body=art(title,poem).encode('utf-8')
   self.send_response(200)
   self.send_header('Content-Type','image/svg+xml; charset=utf-8')
   self.send_header('Cache-Control','no-store')
   self.send_header('Content-Length',str(len(body)))
   self.end_headers();self.wfile.write(body)
  except (ValueError,TypeError,UnicodeDecodeError,json.JSONDecodeError):
   self.send_error(400,'Invalid JSON input')
