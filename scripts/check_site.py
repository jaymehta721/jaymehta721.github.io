"""Check shipped HTML resources, fragment links, and gallery images; no dependencies."""
from html.parser import HTMLParser
from pathlib import Path
import re
from urllib.parse import urlsplit

root = Path(__file__).resolve().parents[1]

class SiteParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids, self.refs, self.errors = set(), [], []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a:
            if a['id'] in self.ids:
                self.errors.append(f"Duplicate id: {a['id']}")
            self.ids.add(a['id'])
        for key in ('href', 'src'):
            if a.get(key):
                self.refs.append(a[key])
        if tag == 'img' and 'alt' not in a:
            self.errors.append('Image missing alt text')

parser = SiteParser()
parser.feed((root / 'index.html').read_text())
for ref in parser.refs:
    if ref.startswith('#'):
        if len(ref) > 1 and ref[1:] not in parser.ids:
            parser.errors.append(f'Unknown section: {ref}')
    elif not re.match(r'^[a-z]+:', ref) and not (root / urlsplit(ref).path).is_file():
        parser.errors.append(f'Missing file: {ref}')
for name in re.findall(r"\['((?:tiny-farm|foldspace|grand-prix|worms)-[^']+)'", (root / 'app.js').read_text()):
    if not (root / f'assets/images/{name}.webp').is_file():
        parser.errors.append(f'Missing gallery image: {name}')
assert not parser.errors, '\n'.join(parser.errors)
print(f'Passed: {len(parser.refs)} references, section anchors, image alternatives, and gallery assets.')
