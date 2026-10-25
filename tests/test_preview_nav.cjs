const assert=require("node:assert/strict");
const { chromium }=require("playwright");
async function main(){
 const browser=await chromium.launch({headless:true});
 try{
   const page=await browser.newPage();
   const errors=[];page.on("pageerror",e=>errors.push(e.message));
   await page.goto("http://127.0.0.1:8765/admin/#dashboard");
   const dashboardBackground=await page.locator("body").evaluate(el=>getComputedStyle(el).backgroundColor);
   assert.notEqual(dashboardBackground,"rgb(255, 255, 255)","Dashboard must keep the navy background");
   await page.locator('.side-menu [data-view="create"]:not([data-jump])').click();
   assert.equal(await page.locator("body").getAttribute("data-studio-view"),"create","Create screen must switch theme");
   for(const sel of [".main","#view-create",".form-section",".work-editor"]){
     const background=await page.locator(sel).first().evaluate(el=>getComputedStyle(el).backgroundColor);
     assert.equal(background,"rgb(255, 255, 255)",sel+" must use a pure white background");
   }
   await page.locator('.side-menu [data-jump="artist-optional"]').click();
   assert.equal(await page.locator("#artist-optional").getAttribute("open"),"","Artist navigation must open artist details");
   await page.locator('.side-menu [data-jump="artwork-list"]').click();
   assert.equal(await page.locator("#view-create").isVisible(),true,"Artwork menu must keep editor visible");
   await page.locator('.side-menu [data-jump="music-controls"]').click();
   assert.equal(await page.locator("#view-create").isVisible(),true,"Music menu must navigate editor");
   await page.locator('.side-menu [data-jump="video-controls"]').click();
   assert.equal(await page.locator("#view-create").isVisible(),true,"Video menu must navigate editor");
   await page.locator('.side-menu [data-view="projects"]').click();
   assert.equal(await page.locator("#view-projects").isVisible(),true,"Project list must open");
   await page.locator('.side-menu [data-view="guide"]').click();
   assert.equal(await page.locator("#view-guide").isVisible(),true,"Help screen must open");
   await page.locator('.side-menu [data-view="create"]:not([data-jump])').click();
   await page.fill("#title","메뉴 연결 시범 전시");
   await page.fill("#artist","작가 시연");
   await page.locator("#quick-preview").click();
   const preview=page.frameLocator("#site-preview");
   await preview.locator("#artist").waitFor({state:"attached",timeout:10000});
   const adminUrl=page.url();
   const initialFrame=await page.locator("#site-preview").evaluate(f=>f.contentWindow.location.href);
   assert.equal(initialFrame,"about:srcdoc","Exhibition preview must be srcdoc");
   // Instrument same-origin sandboxed preview to prove intended section actually receives scroll.
   await page.locator("#site-preview").evaluate(frame=>{
     const win=frame.contentWindow;
     win.Element.prototype.scrollIntoView=function(){
       this.setAttribute("data-preview-scrolled","yes");
     };
   });
   for(const id of ["artist","story","works","review","contact","top"]){
     await preview.locator('.nav a[href="#'+id+'"],.logo[href="#'+id+'"]').click();
     assert.equal(page.url(),adminUrl,"Admin URL must not change when clicking #"+id);
     assert.equal(await page.locator("#site-preview").evaluate(f=>f.contentWindow.location.href),
       "about:srcdoc","Preview iframe must not navigate to /admin/#"+id);
     assert.equal(await preview.locator("#"+id).getAttribute("data-preview-scrolled"),
       "yes","Menu #"+id+" must scroll to the correct section");
   }
   assert.deepEqual(errors,[]);
   console.log("PASS: white-background editor, 8 navigation links, six artist-gallery preview anchors remain inside iframe");
 }finally{await browser.close()}
}
main().catch(e=>{console.error(e);process.exitCode=1});
