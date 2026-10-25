const assert = require("node:assert/strict");
const { chromium } = require("playwright");

async function main() {
 const browser = await chromium.launch({headless:true,args:["--use-fake-ui-for-media-stream","--autoplay-policy=no-user-gesture-required"]});
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
 assert.equal(await video.isDisabled(),false,"Video button must be enabled in Chromium");
 await video.click();
 const result=page.locator('.generated-media a[download$=".webm"],.generated-media a[download$=".mp4"]').first();
 await result.waitFor({state:"visible",timeout:22000});
 const href=await result.getAttribute("href");
 assert(href.startsWith("blob:"));
 const size=await page.evaluate(async url=>(await (await fetch(url)).blob()).size,href);
 assert(size>5000,"Film file should have nonempty recorded video");
 assert((await page.locator('.generated-media video').first().getAttribute("src")).startsWith("blob:"));
 assert.deepEqual(pageErrors,[],"No browser JS errors expected");
 console.log("PASS: image upload → WAV generation + preview → recorded video + preview; size="+size);
 await browser.close();
}
main().catch(err=>{console.error(err);process.exitCode=1});
