# Nano Banana secure proxy (Cloudflare Worker)
This optional server is necessary before the ArtWeb **나노바나나 8컷 그림 생성** button can call the Gemini API. GitHub Pages cannot keep API secrets.

1. Create a Cloudflare Worker and paste `worker.js` as its source.
2. In Worker settings, add a secret called `GEMINI_API_KEY` (your own Google Gemini API credential).
3. Deploy and copy its HTTPS `*.workers.dev` URL.
4. In 명도재 아트웹 > 홈페이지 만들기 > 만화로 보는 뉴스, paste the Worker URL into **나노바나나 보안 중계 서버 주소**.
5. Enter article text, generate storyboard or directly choose **나노바나나 8컷 그림 생성**.

Security:
- Never put the Gemini API key in front-end JavaScript, GitHub, or a GitHub Pages form.
- This example checks the allowed browser origin, but origin checks are NOT authentication. Before public use enable Cloudflare Turnstile, per-user authentication and rate limiting / quotas to prevent unexpected API bills.
- Eight requests are made (one per panel), which consumes image-generation credits. Output may exceed browser localStorage quota; export standalone HTML before clearing storage.
- This is a working integration example, not a claim that a Worker or Gemini credentials have been configured and deployed.
- User-provided article text is transmitted to the user's own Worker and Google when generation is used.
