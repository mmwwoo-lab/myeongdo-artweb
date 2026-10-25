#!/usr/bin/env python3
"""Check all committed HTML documents for missing local links, images and anchors."""
from __future__ import annotations
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
SKIP_SCHEMES = {"http", "https", "mailto", "tel", "data", "javascript"}


class Links(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.urls = []
        self.ids = set()

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get("id"):
            self.ids.add(attrs["id"])
        for key in ("href", "src", "poster"):
            value = attrs.get(key)
            if value:
                self.urls.append((tag, key, value.strip()))


def check() -> int:
    errors, warnings, checks = [], [], 0
    pages = list(ROOT.rglob("*.html"))
    for source in pages:
        if ".git" in source.parts:
            continue
        parsed = Links()
        try:
            parsed.feed(source.read_text(encoding="utf-8"))
        except Exception as exc:
            errors.append(f"{source.relative_to(ROOT)}: cannot parse HTML: {exc}")
            continue
        for tag, attribute, value in parsed.urls:
            if not value:
                continue
            parts = urlsplit(value)
            if parts.scheme.lower() in SKIP_SCHEMES or value.startswith("//"):
                continue
            if parts.scheme:
                warnings.append(f"{source.relative_to(ROOT)}: unrecognized URL scheme {value!r}")
                continue
            checks += 1
            target = unquote(parts.path)
            if not target:
                if parts.fragment and parts.fragment not in parsed.ids:
                    warnings.append(f"{source.relative_to(ROOT)}: missing in-page anchor #{parts.fragment}")
                continue
            rel = Path(target.lstrip("/")) if target.startswith("/") else (source.parent / target)
            resolved = rel.resolve()
            if not resolved.is_relative_to(ROOT.resolve()):
                errors.append(f"{source.relative_to(ROOT)}: link escapes repository: {value!r}")
                continue
            if resolved.is_dir():
                resolved = resolved / "index.html"
            if not resolved.is_file():
                errors.append(f"{source.relative_to(ROOT)}: missing {attribute} {value!r}")
    print(f"Audited {len(pages)} HTML files and {checks} local references")
    for msg in warnings:
        print("WARN", msg)
    for msg in errors:
        print("ERROR", msg)
    if errors:
        return 1
    print("All local document, image, stylesheet and script paths resolve.")
    return 0


if __name__ == "__main__":
    sys.exit(check())
