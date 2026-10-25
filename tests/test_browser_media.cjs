const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const { chromium } = require("playwright");

async function main() {
 const browser = await chromium.launch({headless:true,args:["--use-fake-ui-for-media-stream","--autoplay-policy=no-user-gesture-required"]});
 try{
  const page=await browser.newPage({acceptDownloads:true});
 const pageErrors=[];page.on("pageerror",err=>pageErrors.push(err.message));
 await page.goto("http://127.0.0.1:8765/admin/#create",{waitUntil:"domcontentloaded"});
 await page.fill("#title","수채화 테스트 전시");
 await page.fill("#artist","시연 작가");
 const fixture=await page.evaluate(()=>{
   const canvas=document.createElement("canvas");canvas.width=600;canvas.height=420;
   const g=canvas.getContext("2d");
   const grad=g.createLinearGradient(0,0,600,420);
   grad.addColorStop(0,"#1d5577");grad.addColorStop(.55,"#f3d5ae");grad.addColorStop(1,"#724b75");
   g.fillStyle=grad;g.fillRect(0,0,600,420);
   for(let i=0;i<8;i++){
      g.fillStyle=i%2?"#d8e9c5":"#c46a54";
      g.beginPath();g.arc(60+i*68,110+i%3*80,28+i*2,0,Math.PI*2);g.fill();
   }
   return canvas.toDataURL("image/png").split(",")[1];
 });
 const png=Buffer.from(fixture,"base64");
 await page.locator('[data-art-file]').first().setInputFiles({name:"test.png",mimeType:"image/png",buffer:png});
 await page.locator(".art-upload-preview img").first().waitFor({state:"visible",timeout:10000});
 await page.locator('[data-field="title"]').first().fill("테스트 수채화");
 const music=page.locator('[data-act="make-music"]').first(),video=page.locator('[data-act="make-video"]').first();
 const mediaColors=await page.evaluate(()=>{
   const button=(type)=>{const el=document.querySelector('[data-act="make-'+type+'"]');const css=getComputedStyle(el);return {background:css.backgroundColor,color:css.color}};
   const ordinary=getComputedStyle(document.querySelector("#add-artwork")).backgroundColor;
   return {music:button("music"),video:button("video"),ordinary};
 });
 for(const [name,style] of Object.entries({music:mediaColors.music,video:mediaColors.video})){
   assert.equal(style.background,"rgb(224, 245, 199)",name+" button must be pastel lime");
   assert.equal(style.color,"rgb(0, 0, 0)",name+" button text must be pure black");
 }
 assert.equal(mediaColors.ordinary,"rgb(232, 221, 252)","Other buttons must remain pastel lavender");
 assert.equal(await music.isDisabled(),false,"Music button must be enabled once artwork registered");
 await music.click();
 const wav=page.locator('.generated-media a[download$=".wav"]').first();
 await wav.waitFor({state:"visible",timeout:10000});
 assert((await page.locator('.generated-media audio').first().getAttribute("src")).startsWith("blob:"));
 const musicCheck=await page.evaluate(async()=>{
   const src=document.querySelector(".generated-media audio").src;
   const data=new DataView(await (await fetch(src)).arrayBuffer());
   return {rate:data.getUint32(24,true),bytes:data.getUint32(40,true),total:data.byteLength}
 });
 assert.equal(musicCheck.rate,16000,"WAV sample rate");
 assert.equal(musicCheck.bytes,16000*20*2,"Instrumental WAV must be exactly 20 seconds");
 assert.equal(musicCheck.total,44+16000*20*2,"WAV header and data length");
 const audioQuality=await page.evaluate(async()=>{
   const url=document.querySelector(".generated-media audio").src;
   const dv=new DataView(await (await fetch(url)).arrayBuffer());
   let rms=0,peak=0;
   for(let i=0;i<320000;i+=16){
     const v=dv.getInt16(44+i*2,true)/32768;
     rms+=v*v;peak=Math.max(peak,Math.abs(v));
   }
   return {rms:Math.sqrt(rms/(320000/16)),peak};
 });
 assert(audioQuality.rms>.009,"Piano soundtrack must contain audible audio");
 assert(audioQuality.peak<.99,"Piano soundtrack must avoid hard clipping");
 const prompt=await page.locator('[data-music-prompt]').first().textContent();
 assert(prompt.includes("Solo classical piano instrumental, gentle lyrical piano light music"),"Classical piano light-music prompt should appear");
 assert(prompt.includes("no drums, no strings, no brass"),"Piano-only arrangement prompt should exclude orchestral percussion and brass");
 assert.equal(await video.isDisabled(),false,"Video button must be enabled in Chromium");
 await video.click();
 const result=page.locator('.generated-media a[download$=".webm"],.generated-media a[download$=".mp4"]').first();
 await result.waitFor({state:"visible",timeout:45000});
 const href=await result.getAttribute("href");
 assert(href.startsWith("blob:"));
 const size=await page.evaluate(async url=>(await (await fetch(url)).blob()).size,href);
 assert(size>5000,"Film file should have nonempty recorded video");
 assert((await page.locator('.generated-media video').first().getAttribute("src")).startsWith("blob:")); 
 const motion=await page.evaluate(async()=>{
   const video=document.querySelector(".generated-media video");
   await new Promise((resolve,reject)=>{
     if(video.readyState>=1)return resolve();
     video.addEventListener("loadedmetadata",resolve,{once:true});
     video.addEventListener("error",()=>reject(Error("Recorded video could not be decoded")),{once:true});
     video.load();
   });
   const preview=document.createElement("canvas");preview.width=128;preview.height=72;
   const c=preview.getContext("2d");
   async function frameAt(second){
     await new Promise((resolve,reject)=>{
       const fail=setTimeout(()=>reject(Error("Video frame seek timed out")),8000);
       video.addEventListener("seeked",()=>{clearTimeout(fail);resolve()},{once:true});
       video.currentTime=second;
     });
     c.drawImage(video,0,0,128,72);
     return c.getImageData(0,0,128,72).data;
   }
   const first=await frameAt(3.1),later=await frameAt(11.4);
   let diff=0;
   // Inspect art frame, not just the timer/progress indicator.
   for(let y=6;y<64;y+=2)for(let x=4;x<82;x+=2){
     const i=(y*128+x)*4;
     diff+=Math.abs(first[i]-later[i])+Math.abs(first[i+1]-later[i+1])+Math.abs(first[i+2]-later[i+2]);
   }
   return {diff,duration:video.duration};
 });
 console.log("Recorded artwork camera movement pixel difference:",motion.diff);
 assert(motion.diff>1000,"Slow camera moves must visibly change artwork frames");
 assert(motion.duration>=19,"Film should remain approximately 20 seconds");

 await page.waitForFunction(()=>{const p=JSON.parse(localStorage.getItem("myeongdo_exhibition_studio_v1")||"[]")[0];return Boolean(p?.artworks?.[0]?.localVideoReady)},null,{timeout:10000});
 const saved=await page.evaluate(async()=>{
   const project=JSON.parse(localStorage.getItem("myeongdo_exhibition_studio_v1"))[0];
   const db=await new Promise((resolve,reject)=>{const req=indexedDB.open("myeongdo-artwork-films-v1",1);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)});
   const b=await new Promise(resolve=>{const tx=db.transaction("films","readonly");const req=tx.objectStore("films").get(project.artworks[0].id);req.onsuccess=()=>resolve(req.result)});
   db.close();return {ready:project.artworks[0].localVideoReady,bytes:b?.size||0};
 });
 assert.equal(saved.ready,true,"Music video must be automatically registered to project");
 assert(saved.bytes>5000,"Recorded movie must persist in IndexedDB");
 await page.locator("#quick-preview").click();
 await page.waitForFunction(()=>document.querySelector("#site-preview").srcdoc.includes("blob:"),null,{timeout:8000});
 // iframe srcdoc must not resolve local section links against the /admin/ URL.
 await page.frameLocator("#site-preview").locator("#artist").waitFor({state:"attached"});
 const adminUrl=page.url();
 const links=["artist","story","works","review","contact","top"];
 for(const id of links){
   await page.frameLocator("#site-preview").locator('.nav a[href="#'+id+'"],.logo[href="#'+id+'"]').click();
   await page.waitForTimeout(100);
   assert.equal(page.url(),adminUrl,"Preview menu #"+id+" must not modify admin URL");
   const frameURL=await page.locator("#site-preview").evaluate(el=>el.contentWindow.location.href);
   assert.equal(frameURL,"about:srcdoc","Preview menu #"+id+" must stay inside the loaded exhibition iframe");
   assert.equal(await page.frameLocator("#site-preview").locator("#"+id).count(),1,"Preview target #"+id+" must exist");
 }

 await page.locator("#rights-confirm").check();
 const finished=page.waitForEvent("download",{timeout:18000});
 await page.locator("#quick-finish").click();
 const dl=await finished;
 const exported=await fs.readFile(await dl.path(),"utf8");
 assert(/data:video\/(?:webm|mp4)[^"']*;base64,/.test(exported),"Completed standalone exhibition must embed registered film");
 assert(exported.includes("테스트 수채화"),"Artwork information must appear in downloaded homepage");

 assert.deepEqual(pageErrors,[],"No browser JS errors expected");
 console.log("PASS: 20s solo piano soundtrack → measurable cinematic pan-tilt-zoom frame motion → 20s music video → IndexedDB registration → exhibition preview → standalone HTML with embedded soundtrack video; size="+size);
 }finally{await browser.close()}
}
main().catch(err=>{console.error(err);process.exitCode=1});
