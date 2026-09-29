#!/usr/bin/env python3
"""Estimate spoken time per part from the speaker notes.

Counts words in each slide's HTML-comment notes, minus the «Источники:» line,
lines in square brackets that are stage directions («[Для себя] …») and demo
preparation, at a speaking rate (default 130 words per minute). Demo bumpers
add the minutes the plan gives them. Backup parts (file name contains
«backup») are listed but not summed into the talk.

Usage: .scripts/timing.py [slides/slides.md] [--wpm 130] [--demo 'Демо 1=6,Демо 2=4,Демо 3=4']
"""
import argparse
import pathlib
import re

SRC = re.compile(r'^src:\s*[\'"]?([^\'"#]+?)[\'"]?\s*$', re.M)
NOTE = re.compile(r'<!--(.*?)-->', re.S)


FM_LINE = re.compile(r'^[A-Za-z_][\w-]*:|^\s+|^\s*-\s|^#')


def is_frontmatter(chunk):
    lines = [l for l in chunk.strip('\n').splitlines() if l.strip()]
    return bool(lines) and re.match(r'^[A-Za-z_][\w-]*:', lines[0]) and all(FM_LINE.match(l) for l in lines)


def slides_of(path):
    """(file, frontmatter + body) per slide, following `src:` imports."""
    chunks = re.split(r'\n---\n', '\n' + path.read_text())
    out = []
    i = 1 if not chunks[0].strip() else 0
    while i < len(chunks):
        c = chunks[i]
        if is_frontmatter(c):
            m = SRC.search(c)
            body = chunks[i + 1] if i + 1 < len(chunks) else ''
            if m and not body.strip():
                out += slides_of((path.parent / m.group(1)).resolve())
            else:
                out.append((path, c + '\n' + body))
            i += 2
        else:
            out.append((path, c))
            i += 1
    return out


def spoken_words(chunk):
    words = 0
    for note in NOTE.findall(chunk):
        for line in note.splitlines():
            s = line.strip()
            if not s or s.startswith('Источники') or s.startswith('Источник:'):
                continue
            if re.match(r'^\[(Для себя|Подготовка|Режиссура)', s):
                continue
            s = re.sub(r'^\[(Алексей|Иван|Оба)\]\s*', '', s)
            words += len(re.findall(r'[\wА-Яа-яЁё’\'-]+', s))
    return words


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('deck', nargs='?', default='slides/slides.md')
    ap.add_argument('--wpm', type=float, default=130)
    ap.add_argument('--demo', default='Демо 1=6,Демо 2=4,Демо 3=4')
    a = ap.parse_args()
    demos = dict((k.strip(), float(v)) for k, v in (p.split('=') for p in a.demo.split(',')))
    rows = {}
    order = []
    for path, chunk in slides_of(pathlib.Path(a.deck).resolve()):
        key = path.stem
        if key not in rows:
            rows[key] = {'slides': 0, 'words': 0, 'demo': 0.0}
            order.append(key)
        rows[key]['slides'] += 1
        rows[key]['words'] += spoken_words(chunk)
        m = re.search(r"^num:\s*'?(Демо \d)'?", chunk, re.M)
        if m and m.group(1) in demos:
            rows[key]['demo'] += demos[m.group(1)]
    total = 0.0
    print(f"{'part':28} {'slides':>6} {'words':>6} {'min':>6}")
    for k in order:
        r = rows[k]
        mins = r['words'] / a.wpm + r['demo']
        backup = 'backup' in k
        if not backup:
            total += mins
        print(f"{k:28} {r['slides']:6d} {r['words']:6d} {mins:6.1f}{'  (backup, not summed)' if backup else ''}{f'  incl. demo {r[chr(100)+chr(101)+chr(109)+chr(111)]:.0f}' if r['demo'] else ''}")
    print(f"{'talk':28} {'':6} {'':6} {total:6.1f}  at {a.wpm:.0f} wpm")


if __name__ == '__main__':
    main()
