const assert=require("node:assert/strict");
const { chromium }=require("playwright");
async function main(){
 const browser=await chromium.launch({headless:true});
 try{
   const page=await browser.newPage();
   const errors=[];page.on("pageerror",e=>errors.push(e.message));
   await page.goto("http://127.0.0.1:8765/admin/#create");
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
   console.log("PASS: all six artist gallery preview menu links stay inside iframe and scroll to their correct sections");
 }finally{await browser.close()}
}
main().catch(e=>{console.error(e);process.exitCode=1});
