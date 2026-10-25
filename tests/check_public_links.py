#!/usr/bin/env python3
"""Check listed public destinations from a GitHub Actions runner.

External sites can block bots or restrict regional access: this is an
observational check, not proof that a link works for every visitor.
"""
from __future__ import annotations
from concurrent.futures import ThreadPoolExecutor
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

LINKS = {
    "명도재 메인": "https://mmwwoo-lab.github.io/myeongdo-artweb/",
    "명도재 창작실": "https://mmwwoo-lab.github.io/myeongdo-artweb/admin/#create",
    "작가별 전시 안내": "https://mmwwoo-lab.github.io/myeongdo-artweb/artist-gallery/",
    "조홍근 초대전": "https://mmwwoo-lab.github.io/myeongdo-artweb/exhibitions/cho-honggeun-2026/",
    "문화예술 소식지": "https://mmwwoo-lab.github.io/myeongdo-artweb/culture-news/",
    "서석행 문학관": "https://mmwwoo-lab.github.io/myeongdo-artweb/literature/seoseokhaeng-poetry/",
    "SONU 협업 전시": "https://sonu-art-collaboration.sino1000.chatgpt.site/",
    "권도훈 원본 전시": "https://sonu-kwon-dohoon.sino1000.chatgpt.site/",
    "차정보 원본 전시": "https://sonu-cha-jeongbo.sino1000.chatgpt.site/",
    "로만 원본 전시": "https://sonu-roman-review.sino1000.chatgpt.site/",
    "조홍근 원본": "https://cho-honggeun-exhibition-2026.korea8014lee.chatgpt.site/",
}

def check(pair):
    label, url = pair
    for method in ("HEAD", "GET"):
        try:
            req = Request(url, method=method, headers={"User-Agent": "Mozilla/5.0 (compatible; MYEONGDOJAE-LinkAudit/1.0)"})
            with urlopen(req, timeout=10) as response:
                return label, response.status, response.geturl()
        except HTTPError as e:
            if method == "HEAD" and e.code in (403, 405, 429):
                continue
            return label, f"HTTP {e.code}", url
        except (URLError, TimeoutError, OSError) as e:
            if method == "HEAD":
                continue
            return label, f"확인 불가 ({str(e)[:70]})", url
    return label, "확인 불가", url


def main():
    with ThreadPoolExecutor(max_workers=8) as pool:
        results = list(pool.map(check, LINKS.items()))
    ok = 0
    print("PUBLIC LINK CHECK (network-specific, nonblocking)")
    for label, status, target in results:
        success = isinstance(status, int) and 200 <= status < 400
        ok += bool(success)
        print(("OK " if success else "CHECK ") + label + ": " + str(status) + " " + target)
    print(f"HTTP-reachable destinations: {ok}/{len(results)}")
    print("Bot blocking, network filtering and external ownership require separate browser verification.")


if __name__ == "__main__":
    main()
