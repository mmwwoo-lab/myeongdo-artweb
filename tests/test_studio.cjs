/** MYEONGDOJAE public studio browser-behavior smoke checks using jsdom. */
const fs = require("node:fs");
const assert = require("node:assert/strict");
const {JSDOM} = require("jsdom");

async function main() {
  const html = fs.readFileSync("admin/index.html", "utf8");
  const js = fs.readFileSync("admin/app.js", "utf8");
  const dom = new JSDOM(html, {
    url: "https://mmwwoo-lab.github.io/myeongdo-artweb/admin/#create",
    runScripts: "outside-only",
    pretendToBeVisual: true
  });
  const w = dom.window;
  w.scrollTo = () => {};
  w.HTMLElement.prototype.scrollIntoView = function () {};
  w.confirm = () => true;
  w.alert = message => { throw Error("Unexpected alert: " + message); };
  let blobCount=0;
  w.URL.createObjectURL = blob => { assert(blob.size > 1000, "Generated media should contain data"); return "blob:https://example.com/"+(++blobCount); };
  w.URL.revokeObjectURL = () => {};
  w.localStorage.setItem("myeongdo_exhibition_studio_v1", JSON.stringify([{
    id: "demo-exhibition", title: "테스트 전시", artist: "시연 작가",
    genre: "수채화", status: "제작 중", rightsConfirmed: true,
    artworks: [{
      id: "demo-work", title: "샘플 작품", year: "2026",
      material: "watercolor", size: "40×30 cm",
      caption: "테스트용 그림", critique: "색채와 빛의 표현",
      dataUrl: "data:image/jpeg;base64,/9j/2Q==",
      videoUrl: "", musicUrl: ""
    }]
  }]));
  w.eval(js);
  const $ = id => w.document.getElementById(id);
  assert($("view-create").classList.contains("visible"), "Deep link #create must show editor");
  assert($("artwork-list").children.length === 1, "Default artwork card must render");
  assert($("start-create") && $("add-artwork"), "Create and artwork controls must exist");

  w.document.querySelector('[data-view="projects"]').click();
  assert($("project-list").textContent.includes("테스트 전시"), "Saved exhibition must be listed");
  $("project-list").querySelector("button").click();
  assert($("artist").value === "시연 작가", "Editor must load stored artist");
  assert($("artwork-list").textContent.includes("이미지 등록 완료"), "Video/image status must be shown");
  const musicButton = $("artwork-list").querySelector('[data-act="make-music"]');
  const videoButton = $("artwork-list").querySelector('[data-act="make-video"]');
  assert(musicButton && videoButton, "Per-artwork media buttons must be rendered");
  assert(!musicButton.disabled, "Music must be enabled for registered artwork");
  musicButton.click();
  assert($("artwork-list").textContent.includes("음악 생성 완료"), "WAV music creation must update status");
  assert($("artwork-list").querySelector('a[download$=".wav"]'), "Generated WAV must be downloadable");
  assert($("artwork-list").querySelector("audio[src^='blob:']"), "Generated WAV must be previewable");
  assert(videoButton.disabled, "Unsupported MediaRecorder environments must not show active video creation");


  $("artwork-list").querySelector('[data-field="videoUrl"]').value = "https://example.com/media/artwork-01.mp4";
  $("artwork-list").querySelector('[data-field="videoUrl"]').dispatchEvent(new w.Event("input", {bubbles:true}));
  assert($("video-stats").textContent.includes("공개 영상 URL 등록 1점"), "Video count must react to URL");
  $("exhibition-video-url").value = "https://example.com/media/exhibition-film.mp4";
  $("exhibition-video-url").dispatchEvent(new w.Event("input",{bubbles:true}));
  $("preview-project").click();
  await new Promise(resolve=>setTimeout(resolve,80));
  assert(!$("preview-panel").hidden, "Preview must become visible");
  assert($("site-preview").srcdoc.includes("artwork-01.mp4"), "Individual video must be in exported HTML");
  assert($("site-preview").srcdoc.includes("exhibition-film.mp4"), "Exhibition film must be in exported HTML");
  $("save-project").click();
  const saved = JSON.parse(w.localStorage.getItem("myeongdo_exhibition_studio_v1"));
  assert(saved[0].artworks[0].videoUrl.endsWith("artwork-01.mp4"), "Video URL must be stored");
  assert(saved[0].exhibitionVideoUrl.endsWith("exhibition-film.mp4"), "Full film URL must be stored");

  $("artwork-list").querySelector('[data-field="videoUrl"]').value = "";
  $("artwork-list").querySelector('[data-field="videoUrl"]').dispatchEvent(new w.Event("input",{bubbles:true}));
  const manifest = {
    format: "MYEONGDOJAE-VIDEO-MANIFEST", version: 1,
    projectId: "demo-exhibition", artist: "시연 작가", exhibition: "테스트 전시",
    videos: [{
      artworkId:"demo-work", artworkTitle:"샘플 작품",
      videoFile:"videos/artwork-01.mp4", videoUrl:"https://example.com/media/artwork-01.mp4",
      status:"영상 제작 완료"
    }]
  };
  const input = $("video-manifest-import");
  Object.defineProperty(input, "files", {
    configurable:true, value:[{size:512,text:async () => JSON.stringify(manifest)}]
  });
  input.dispatchEvent(new w.Event("change", {bubbles:true}));
  await new Promise(resolve=>setTimeout(resolve,15));
  assert($("video-import-result").textContent.includes("1개 작품"), "Python video manifest must import");
  assert($("artwork-list").textContent.includes("영상 URL 등록됨"), "Imported video should be visible");

  const artistHTML = fs.readFileSync("artist-gallery/index.html", "utf8");
  assert(!artistHTML.includes("카마 잭코프스카"), "Removed Kama page must not return");
  const root = fs.readFileSync("index.html", "utf8");
  assert(!root.includes("./artist-gallery/?artist="), "Main artist cards must open source exhibitions");
  assert(root.includes("https://sonu-kwon-dohoon.sino1000.chatgpt.site/"), "Kwon live exhibition link must be present");

  console.log("PASS: deep link, artwork music WAV generation, video capability detection, save, film preview, manifest import and artist links");
  w.close();
}
main().catch(e=>{ console.error(e); process.exitCode=1; });
