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
 const png=Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/YAAAAABJRU5ErkJggg==","base64");
 await page.locator('[data-art-file]').first().setInputFiles({name:"test.png",mimeType:"image/png",buffer:png});
 await page.locator(".art-upload-preview img").first().waitFor({state:"visible",timeout:10000});
 await page.locator('[data-field="title"]').first().fill("테스트 수채화");
 const music=page.locator('[data-act="make-music"]').first(),video=page.locator('[data-act="make-video"]').first();
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
 const prompt=await page.locator('[data-music-prompt]').first().textContent();
 assert(prompt.includes("instrumental film score, Korean folk motifs, andante tempo"),"Requested music style prompt should appear");
 assert.equal(await video.isDisabled(),false,"Video button must be enabled in Chromium");
 await video.click();
 const result=page.locator('.generated-media a[download$=".webm"],.generated-media a[download$=".mp4"]').first();
 await result.waitFor({state:"visible",timeout:45000});
 const href=await result.getAttribute("href");
 assert(href.startsWith("blob:"));
 const size=await page.evaluate(async url=>(await (await fetch(url)).blob()).size,href);
 assert(size>5000,"Film file should have nonempty recorded video");
 assert((await page.locator('.generated-media video').first().getAttribute("src")).startsWith("blob:"));
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
 await page.locator("#rights-confirm").check();
 const finished=page.waitForEvent("download",{timeout:18000});
 await page.locator("#quick-finish").click();
 const dl=await finished;
 const exported=await fs.readFile(await dl.path(),"utf8");
 assert(/data:video\/(?:webm|mp4)[^"']*;base64,/.test(exported),"Completed standalone exhibition must embed registered film");
 assert(exported.includes("테스트 수채화"),"Artwork information must appear in downloaded homepage");

 assert.deepEqual(pageErrors,[],"No browser JS errors expected");
 console.log("PASS: 20s WAV with requested prompt → 20s synchronized music video → IndexedDB registration → exhibition preview → standalone HTML with embedded soundtrack video; size="+size);
 }finally{await browser.close()}
}
main().catch(err=>{console.error(err);process.exitCode=1});
