#!/bin/env python3
from __future__ import annotations

import re
import shutil
import json
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Tuple


ROOT = Path(__file__).resolve().parents[1]
SRC_BLOG_DIR = ROOT / "src" / "content" / "blog"
SRC_IMG_DIR = ROOT / "src" / "assets" / "images" / "blog"
SRC_VIDEO_DIR = ROOT / "src" / "assets" / "videos" / "blog"

DST_ROOT = ROOT.parent / "neputa-note-hatenablog"
DST_ENTRIES_DIR = DST_ROOT / "draft_entries"
DST_IMG_DIR = DST_ROOT / "assets" / "images" / "blog"
DST_VIDEO_DIR = DST_ROOT / "assets" / "videos" / "blog"
DST_HERO_DIR = DST_ROOT / "assets" / "images" / "hero"
HERO_MANIFEST = DST_ROOT / "assets" / "hero-resize-manifest.json"


ALERT_MAP = {
    "info": "NOTE",
    "warning": "WARNING",
    "danger": "CAUTION",
    "success": "TIP",
}


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def parse_frontmatter(content: str) -> Tuple[str, str]:
    m = re.match(r"^---\n([\s\S]*?)\n---\n?", content)
    if not m:
        return "", content
    return m.group(1), content[m.end() :]


def get_scalar(frontmatter: str, key: str) -> str:
    m = re.search(rf"(?m)^{re.escape(key)}:\s*(.+?)\s*$", frontmatter)
    return m.group(1).strip() if m else ""


def unquote(text: str) -> str:
    if len(text) >= 2 and ((text[0] == "'" and text[-1] == "'") or (text[0] == '"' and text[-1] == '"')):
        return text[1:-1]
    return text


def get_list(frontmatter: str, key: str) -> List[str]:
    m = re.search(rf"(?ms)^{re.escape(key)}:\s*\n((?:\s*-\s*.+\n?)*)", frontmatter)
    if not m:
        return []
    values: List[str] = []
    for line in m.group(1).splitlines():
        m_item = re.match(r"^\s*-\s*(.+?)\s*$", line)
        if not m_item:
            continue
        values.append(unquote(m_item.group(1).strip()))
    return values


def normalize_date(pub_date: str) -> Tuple[str, str, str, str]:
    pub_date = unquote(pub_date)
    m = re.match(r"^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?", pub_date)
    if not m:
        raise ValueError(f"pubDate parse failed: {pub_date}")

    y = int(m.group(1))
    mo = int(m.group(2))
    d = int(m.group(3))
    hh = int(m.group(4) or 0)
    mm = int(m.group(5) or 0)
    ss = int(m.group(6) or 0)

    dt = datetime(y, mo, d, hh, mm, ss)
    iso = dt.strftime("%Y-%m-%dT%H:%M:%S+09:00")
    return iso, f"{y:04d}", f"{mo:02d}", f"{d:02d}"


def yaml_quote(value: str) -> str:
    v = value.replace("'", "''")
    return f"'{v}'"


def extract_import_map(body: str) -> Dict[str, str]:
    result: Dict[str, str] = {}
    for m in re.finditer(r"(?m)^import\s+([^\n]+?)\s+from\s+['\"]([^'\"]+)['\"]\s*$", body):
        import_expr = m.group(1).strip()
        import_src = m.group(2).strip()

        m_default = re.match(r"^([A-Za-z_][A-Za-z0-9_]*)", import_expr)
        if m_default:
            result[m_default.group(1)] = import_src
    return result


def copy_asset(src_path: Path, dst_path: Path) -> None:
    if not src_path.exists():
        return
    dst_path.parent.mkdir(parents=True, exist_ok=True)
    if not dst_path.exists():
        shutil.copy2(src_path, dst_path)


def enqueue_hero_resize(manifest: List[Dict[str, str]], src_path: Path, dst_path: Path) -> None:
    if not src_path.exists():
        return
    dst_path.parent.mkdir(parents=True, exist_ok=True)
    manifest.append({"src": str(src_path), "dst": str(dst_path)})


def alias_to_source(path_value: str) -> Path | None:
    p = path_value.strip()
    p = unquote(p)

    if p.startswith("@/images/blog/"):
        return SRC_IMG_DIR / p.replace("@/images/blog/", "", 1)
    if p.startswith("/images/blog/"):
        return SRC_IMG_DIR / p.replace("/images/blog/", "", 1)
    if p.startswith("@/videos/blog/"):
        return SRC_VIDEO_DIR / p.replace("@/videos/blog/", "", 1)
    if p.startswith("@/assets/videos/blog/"):
        return SRC_VIDEO_DIR / p.replace("@/assets/videos/blog/", "", 1)
    if p.startswith("/videos/blog/"):
        return SRC_VIDEO_DIR / p.replace("/videos/blog/", "", 1)
    return None


def source_to_dest_asset_path(src_path: Path) -> Path | None:
    try:
        rel_img = src_path.relative_to(SRC_IMG_DIR)
        return DST_IMG_DIR / rel_img
    except ValueError:
        pass

    try:
        rel_video = src_path.relative_to(SRC_VIDEO_DIR)
        return DST_VIDEO_DIR / rel_video
    except ValueError:
        pass

    return None


def relpath_from_entry(out_file: Path, dst_asset: Path) -> str:
    rel = dst_asset.relative_to(DST_ROOT)
    return str(Path("..") / Path("..") / Path("..") / rel).replace("\\", "/")


def extract_attr(attrs: str, key: str) -> str:
    m1 = re.search(rf"\b{re.escape(key)}\s*=\s*'([^']*)'", attrs)
    if m1:
        return m1.group(1)
    m2 = re.search(rf"\b{re.escape(key)}\s*=\s*\"([^\"]*)\"", attrs)
    if m2:
        return m2.group(1)
    m3 = re.search(rf"\b{re.escape(key)}\s*=\s*\{{'([^']*)'\}}", attrs)
    if m3:
        return m3.group(1)
    m4 = re.search(rf"\b{re.escape(key)}\s*=\s*\{{\"([^\"]*)\"\}}", attrs)
    if m4:
        return m4.group(1)
    return ""


def extract_braced_attr(attrs: str, key: str) -> str:
    m = re.search(rf"\b{re.escape(key)}\s*=\s*\{{([^}}]+)\}}", attrs)
    if not m:
        return ""
    return m.group(1).strip()


def replace_self_closing_component(
    body: str,
    tag_name: str,
    replacer,
) -> str:
    output: List[str] = []
    pos = 0
    opener = f"<{tag_name}"

    while True:
        start = body.find(opener, pos)
        if start == -1:
            output.append(body[pos:])
            break

        # tag boundary check
        after = start + len(opener)
        if after < len(body) and re.match(r"[A-Za-z0-9_]", body[after]):
            output.append(body[pos : start + 1])
            pos = start + 1
            continue

        output.append(body[pos:start])

        i = after
        quote = ""
        end = -1
        while i < len(body):
            ch = body[i]
            if quote:
                if ch == quote:
                    quote = ""
            else:
                if ch in ("'", '"'):
                    quote = ch
                elif ch == "/" and i + 1 < len(body) and body[i + 1] == ">":
                    end = i + 2
                    break
            i += 1

        if end == -1:
            output.append(body[start:])
            break

        attrs = body[after : end - 2]
        output.append(replacer(attrs))
        pos = end

    return "".join(output)


def unwrap_not_prose_divs(body: str) -> str:
    # Remove only wrapper div.not-prose and keep inner HTML intact.
    open_pat = re.compile(r"<div\b[^>]*\bclass\s*=\s*['\"][^'\"]*\bnot-prose\b[^'\"]*['\"][^>]*>", re.I)
    tag_pat = re.compile(r"<div\b[^>]*>|</div>", re.I)

    out: List[str] = []
    pos = 0

    while True:
        m = open_pat.search(body, pos)
        if not m:
            out.append(body[pos:])
            break

        out.append(body[pos : m.start()])
        scan = m.end()
        depth = 1
        close_start = -1
        close_end = -1

        while True:
            tm = tag_pat.search(body, scan)
            if not tm:
                out.append(body[m.start() :])
                pos = len(body)
                break

            token = tm.group(0).lower()
            if token.startswith("<div"):
                depth += 1
            else:
                depth -= 1
                if depth == 0:
                    close_start = tm.start()
                    close_end = tm.end()
                    break
            scan = tm.end()

        if close_start == -1:
            break

        out.append(body[m.end() : close_start])
        pos = close_end

    return "".join(out)


def rewrite_markdown_images(body: str, out_file: Path) -> str:
    def repl(m: re.Match[str]) -> str:
        alt = m.group(1)
        inside = m.group(2).strip()
        m_parts = re.match(r"^(\S+)(\s+.*)?$", inside)
        if not m_parts:
            return m.group(0)

        path_part = m_parts.group(1)
        suffix = m_parts.group(2) or ""
        src = alias_to_source(path_part)
        if not src:
            return m.group(0)

        dst = source_to_dest_asset_path(src)
        if not dst:
            return m.group(0)

        copy_asset(src, dst)
        rel = relpath_from_entry(out_file, dst)
        return f"![{alt}]({rel}{suffix})"

    return re.sub(r"!\[([^\]]*)\]\(([^\)]+)\)", repl, body)


def convert_components(body: str, import_map: Dict[str, str], out_file: Path) -> str:
    body = re.sub(r"(?m)^import\s+[^\n]+$", "", body)
    body = unwrap_not_prose_divs(body)

    body = re.sub(r"</?Fragment>\s*", "", body)

    def blogcard_repl(attrs: str) -> str:
        url = extract_attr(attrs, "url")
        if not url:
            return ""
        return f"[{url}:embed:cite]"

    body = replace_self_closing_component(body, "BlogCard", blogcard_repl)

    def youtube_repl(attrs: str) -> str:
        yt_id = extract_attr(attrs, "id")
        if not yt_id:
            return ""
        return f"https://www.youtube.com/watch?v={yt_id}:embed"

    body = replace_self_closing_component(body, "YouTube", youtube_repl)

    def tweet_repl(attrs: str) -> str:
        tweet_url = extract_attr(attrs, "id")
        if not tweet_url:
            return ""
        tweet_url = tweet_url.replace("https://twitter.com/", "https://x.com/")
        return f"[{tweet_url}:embed]"

    body = replace_self_closing_component(body, "Tweet", tweet_repl)

    def alert_repl(attrs: str) -> str:
        alert_type = extract_attr(attrs, "type").lower() or "info"
        content = extract_attr(attrs, "content")
        marker = ALERT_MAP.get(alert_type, "NOTE")
        content = content.strip()
        if content:
            return f"> [!{marker}]\n> {content}\n"
        return f"> [!{marker}]\n"

    body = replace_self_closing_component(body, "Alert", alert_repl)

    def image_repl(attrs: str) -> str:

        src_alias = ""
        src_var = extract_braced_attr(attrs, "src")
        if src_var and src_var in import_map:
            src_alias = import_map[src_var]
        elif src_var:
            src_alias = src_var
        else:
            src_alias = extract_attr(attrs, "src")

        src = alias_to_source(src_alias)
        if not src:
            return ""

        dst = source_to_dest_asset_path(src)
        if not dst:
            return ""

        copy_asset(src, dst)
        rel = relpath_from_entry(out_file, dst)
        alt = extract_attr(attrs, "alt") or "image"
        return f"![{alt}]({rel})"

    body = replace_self_closing_component(body, "Image", image_repl)

    def video_repl(attrs: str) -> str:

        src_alias = ""
        src_var = extract_braced_attr(attrs, "src")
        if src_var and src_var in import_map:
            src_alias = import_map[src_var]
        elif src_var:
            src_alias = src_var
        else:
            src_alias = extract_attr(attrs, "src")

        src = alias_to_source(src_alias)
        if not src:
            return ""

        dst = source_to_dest_asset_path(src)
        if not dst:
            return ""

        copy_asset(src, dst)
        rel = relpath_from_entry(out_file, dst)

        caption = extract_attr(attrs, "caption")
        if caption:
            return f"<video controls src='{rel}'></video>\n\n*{caption}*"
        return f"<video controls src='{rel}'></video>"

    body = replace_self_closing_component(body, "Video", video_repl)

    body = rewrite_markdown_images(body, out_file)

    body = re.sub(r"\n{3,}", "\n\n", body)
    return body.strip() + "\n"


def build_frontmatter(title: str, date_iso: str, custom_path: str, categories: List[str]) -> str:
    lines = [
        "---",
        f"Title: {yaml_quote(title)}",
        f"Date: {date_iso}",
        f"CustomPath: {custom_path}",
        "Category:",
    ]

    if categories:
        for c in categories:
            lines.append(f"  - {yaml_quote(c)}")
    else:
        lines.append("  - '未分類'")

    lines.append("---")
    return "\n".join(lines) + "\n\n"


def dedupe_keep_order(values: List[str]) -> List[str]:
    seen = set()
    result = []
    for v in values:
        vv = v.strip()
        key = vv.casefold()
        if not vv or key in seen:
            continue
        seen.add(key)
        result.append(vv)
    return result


def migrate_one(path: Path, hero_manifest: List[Dict[str, str]]) -> Tuple[bool, str]:
    rel = path.relative_to(SRC_BLOG_DIR)
    parts = rel.parts
    if len(parts) < 3:
        return False, f"skip (unexpected path): {path}"

    yy, mm = parts[0], parts[1]
    slug = path.stem
    out_file = DST_ENTRIES_DIR / yy / mm / f"{slug}.md"

    raw = read_text(path)
    fm, body = parse_frontmatter(raw)

    title = unquote(get_scalar(fm, "title"))
    pub_date = get_scalar(fm, "pubDate")
    hero_image = unquote(get_scalar(fm, "heroImage"))
    category = get_list(fm, "category")
    tags = get_list(fm, "tags")

    if not title:
        title = slug
    if not pub_date:
        return False, f"skip (pubDate missing): {path}"

    date_iso, py, pmo, pd = normalize_date(pub_date)
    custom_path = f"{py}/{pmo}/{pd}/{slug}"

    categories = dedupe_keep_order(category + tags)

    import_map = extract_import_map(body)
    converted_body = convert_components(body, import_map, out_file)

    hero_src = alias_to_source(hero_image)
    if hero_src:
        hero_dst = DST_HERO_DIR / yy / mm / f"{slug}.webp"
        enqueue_hero_resize(hero_manifest, hero_src, hero_dst)
        hero_rel = relpath_from_entry(out_file, hero_dst)
        converted_body = f"![{title}]({hero_rel})\n\n" + converted_body.lstrip()

    frontmatter = build_frontmatter(title, date_iso, custom_path, categories)
    output = frontmatter + converted_body
    write_text(out_file, output)

    return True, str(out_file)


def main() -> None:
    mdx_files = sorted(SRC_BLOG_DIR.rglob("*.mdx"))

    ok = 0
    skipped = 0
    errors: List[str] = []
    hero_manifest: List[Dict[str, str]] = []

    for f in mdx_files:
        try:
            migrated, info = migrate_one(f, hero_manifest)
            if migrated:
                ok += 1
            else:
                skipped += 1
                errors.append(info)
        except Exception as e:  # noqa: BLE001
            skipped += 1
            errors.append(f"error: {f}: {e}")

    print(f"migrated: {ok}")
    print(f"skipped: {skipped}")
    HERO_MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    HERO_MANIFEST.write_text(json.dumps(hero_manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"hero_manifest: {HERO_MANIFEST}")
    print(f"hero_jobs: {len(hero_manifest)}")
    if errors:
        print("--- details ---")
        for msg in errors[:200]:
            print(msg)


if __name__ == "__main__":
    main()
