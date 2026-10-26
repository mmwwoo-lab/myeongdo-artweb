const assert=require("node:assert/strict");
const { chromium }=require("playwright");
async function main(){
 const browser=await chromium.launch({headless:true});
 try{
   const page=await browser.newPage();
   const errors=[];page.on("pageerror",e=>errors.push(e.message));
   await page.goto("http://127.0.0.1:8765/admin/#dashboard");
   const dashboardBackground=await page.locator("body").evaluate(el=>getComputedStyle(el).backgroundColor);
   assert.equal(dashboardBackground,"rgb(255, 255, 255)","Dashboard must use white background");
   for(const selector of [".sonu-panel-head h3",".sonu-checklist h3",".sonu-heading h2"]){
     const {color,background}=await page.locator(selector).first().evaluate(el=>({
       color:getComputedStyle(el).color,
       background:getComputedStyle(el).backgroundColor
     }));
     assert(!/rgb\(2(?:4[0-9]|5[0-9]), 2(?:4[0-9]|5[0-9]), 2(?:4[0-9]|5[0-9])\)/.test(color),
       selector+" requires legible dark lettering");
   }
   const overviewColors=await page.locator(".sonu-overview").evaluate(el=>{
     const w=el.querySelector(".sonu-workflow"),c=el.querySelector(".sonu-checklist");
     return [getComputedStyle(w).backgroundImage,getComputedStyle(c).backgroundImage];
   });
   assert(overviewColors.every(v=>v.includes("gradient")),"Dashboard workflow and checklist use distinct pale gradients");
   await page.locator('.side-menu [data-view="create"]:not([data-jump])').click();
   assert.equal(await page.locator("body").getAttribute("data-studio-view"),"create","Create screen must switch theme");
   const titleBackground=await page.locator(".topbar").evaluate(el=>getComputedStyle(el).backgroundColor);
   assert.equal(titleBackground,"rgb(242, 234, 255)","Website creation page title banner must use pale lavender");
   const creatorBanner=await page.locator(".quick-hero").evaluate(el=>getComputedStyle(el).backgroundImage);
   assert(creatorBanner.includes("242, 234, 255"),"Creator headline area must have lavender background");

   for(const sel of [".main","#view-create",".form-section",".work-editor"]){
     const background=await page.locator(sel).first().evaluate(el=>getComputedStyle(el).backgroundColor);
     assert.equal(background,"rgb(255, 255, 255)",sel+" must use a pure white background");
   }
   const portraitPlacement=await page.locator("#portrait-upload").evaluate(input=>({
     parentSection:input.closest(".form-section")?.querySelector(".form-section-header h2")?.textContent,
     insideCollapsedSection:!!input.closest("details"),
     visible:!!input.getClientRects().length
   }));
   assert.equal(portraitPlacement.parentSection,"전시 기본정보","Artist portrait uploader must be inside basic exhibition information");
   assert.equal(portraitPlacement.insideCollapsedSection,false,"Portrait upload must not be hidden inside optional artist details");
   assert.equal(portraitPlacement.visible,true,"Portrait picker must be visible by default");
   const artistNamePlacement=await page.locator("#artist").evaluate(input=>{
     const portrait=document.querySelector("#artist-portrait");
     const image=document.querySelector("#portrait-preview");
     const label=input.closest("label");
     return {
       samePanel:portrait.contains(input),
       order:image.compareDocumentPosition(input)&Node.DOCUMENT_POSITION_FOLLOWING,
       labelled:label?.textContent.includes("작가 이름"),
       visible:!!input.getClientRects().length
     };
   });
   assert(artistNamePlacement.samePanel,"Artist name must be inside the portrait panel");
   assert(artistNamePlacement.order,"Artist name input must follow the portrait preview");
   assert(artistNamePlacement.labelled&&artistNamePlacement.visible,"Artist name must remain labelled and visible");
   const fieldOrder=await page.locator("#view-create .form-section").first().evaluate(section=>
     Array.from(section.querySelectorAll("#title,#portrait-upload,#artist,#genre,#status")).map(x=>x.id));
   assert.deepEqual(fieldOrder,["title","portrait-upload","artist","genre","status"],
      "Basic information fields must proceed title → photo → artist name → genre/status");


   await page.locator('.side-menu [data-jump="artist-portrait"]').click();
   assert.equal(await page.locator("#portrait-upload").isVisible(),true,"Portrait navigation must reveal visible picker");
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
   const projectPalette=await page.evaluate(()=>{
     const style=id=>{
       const el=document.querySelector(id);
       const css=getComputedStyle(el);
       return {background:css.backgroundColor,color:css.color};
     };
     const upload=document.querySelector("#import-json");
     const picker=getComputedStyle(upload,"::file-selector-button");
     return {add:style("#projects-new"),filter:style("#status-filter"),
             upload:style("#import-json"),
             fileButton:{background:picker.backgroundColor,color:picker.color},
             optionCount:document.querySelector("#status-filter").options.length};
   });
   for(const name of ["add","filter","upload","fileButton"]){
     assert.equal(projectPalette[name].background,"rgb(235, 227, 250)",name+" must be pale lavender in projects view");
     assert.equal(projectPalette[name].color,"rgb(75, 54, 116)",name+" must use readable violet text");
   }
   assert.equal(projectPalette.optionCount,5,"Status menu must retain all five filtering options");
   await page.locator("#status-filter").selectOption("기획");
   assert.equal(await page.locator("#status-filter").inputValue(),"기획","Project status selection must work");
   await page.locator("#status-filter").selectOption("전체");

   await page.locator('.side-menu [data-view="guide"]').click();
   assert.equal(await page.locator("#view-guide").isVisible(),true,"Help screen must open");
   await page.locator('.side-menu [data-view="create"]:not([data-jump])').click();
   await page.fill("#title","메뉴 연결 시범 전시");
   await page.fill("#artist","작가 시연");
   // Upload an actual artist portrait, then verify both the editor preview and
   // embedded photograph in the generated independent gallery preview.
   const portraitPng=await page.evaluate(()=>{
      const canvas=document.createElement("canvas");
      canvas.width=200;canvas.height=260;
      const ctx=canvas.getContext("2d");
      ctx.fillStyle="#d3b6ee";ctx.fillRect(0,0,200,260);
      ctx.fillStyle="#5b4675";ctx.beginPath();ctx.arc(100,90,40,0,Math.PI*2);ctx.fill();
      ctx.fillRect(57,145,86,88);
      return canvas.toDataURL("image/png").split(",")[1];
   });
   await page.locator("#portrait-upload").setInputFiles({
      name:"artist-profile.png",mimeType:"image/png",buffer:Buffer.from(portraitPng,"base64")
   });
   const portrait=page.locator("#portrait-preview img");
   await portrait.waitFor({state:"visible",timeout:10000});
   assert((await portrait.getAttribute("src")).startsWith("data:image/jpeg;base64,"),
      "Uploaded artist photograph must be previewed as a processed image");

   await page.locator("#quick-preview").click();
   const preview=page.frameLocator("#site-preview");
   await preview.locator("#artist").waitFor({state:"attached",timeout:10000});
   const displayedPortrait=preview.locator("#artist img.portrait");
   await displayedPortrait.waitFor({state:"visible",timeout:10000});
   assert((await displayedPortrait.getAttribute("src")).startsWith("data:image/jpeg;base64,"),"Exported artist homepage must contain the registered portrait");
   const portraitCaption=preview.locator("#artist figure.artist-portrait-group figcaption.artist-photo-name");
   assert.equal(await portraitCaption.textContent(),"작가 시연","Artist name must appear directly under the uploaded portrait");
   const captionPlacement=await portraitCaption.evaluate(caption=>{
     const fig=caption.closest("figure");
     const img=fig?.querySelector("img.portrait");
     const photo=img?.getBoundingClientRect();
     const text=caption.getBoundingClientRect();
     return {isSibling:caption.previousElementSibling===img,below:!!photo&&text.top>=photo.bottom,visible:text.width>0&&text.height>0};
   });
   assert(captionPlacement.isSibling&&captionPlacement.below&&captionPlacement.visible,
      "Artist name must be visibly positioned below the portrait in the exported exhibition website");


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
   // Site-wide palette regression: every owned site has a white canvas and
   // interactive menus use the same light-lavender navigation tokens.
   for(const path of [
      "/","/artist-gallery/","/admin/agency.html",
      "/exhibitions/cho-honggeun-2026/","/literature/seoseokhaeng-poetry/",
      "/literature/seoseokhaeng-poetry/poet.html",
      "/culture-news/2026-10-25/"
   ]){
     const sub=await browser.newPage();
     try{
       const response=await sub.goto("http://127.0.0.1:8765"+path,{waitUntil:"domcontentloaded"});
       assert.equal(response.status(),200,"Site "+path+" must exist");
       const color=await sub.locator("body").evaluate(el=>getComputedStyle(el).backgroundColor);
       assert.equal(color,"rgb(255, 255, 255)",path+" canvas must be white");
       const first=await sub.locator("nav a").first();
       if(await first.count()){
         const background=await first.evaluate(el=>getComputedStyle(el).backgroundColor);
         assert.equal(background,"rgb(235, 227, 250)",path+" navigation must be pastel lilac");
       }
       const stylesheet=await sub.locator('link[href*="design-system.css"]').count();
       assert.equal(stylesheet,1,path+" must load central design system");
     }finally{await sub.close()}
   }

   console.log("PASS: white-background editor, 8 navigation links, six artist-gallery preview anchors remain inside iframe");
 }finally{await browser.close()}
}
main().catch(e=>{console.error(e);process.exitCode=1});
