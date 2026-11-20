"""Build wix-embed.html: the whole planner in one file to paste into Wix (Add > Embed Code > Embed HTML).
Photos are loaded from the repository's img folder through the jsDelivr CDN (the repository must be public).
Run: python3 tools/build-embed.py"""
import pathlib, re
root = pathlib.Path(__file__).resolve().parent.parent
IMAGE_BASE = 'https://cdn.jsdelivr.net/gh/Marcusk192/CustomerVisualizer-@main/img/'
css = (root / 'styles.css').read_text()
config = re.sub(r"imageBase: '[^']*'", f"imageBase: '{IMAGE_BASE}'", (root / 'config.js').read_text())
app = (root / 'app.js').read_text()
html = (root / 'index.html').read_text()
body = re.search(r'<body>(.*)</body>', html, re.S).group(1).strip()
out = f"""<!-- Kitchen style planner: paste all of this into Wix > Add > Embed Code > Embed HTML (choose "Code").
     Settings (email, text, styles) are in the PLANNER_CONFIG section below. -->
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
{css}
</style>
{body}
<script>
{config}
</script>
<script>
{app}
</script>
"""
(root / 'wix-embed.html').write_text(out)
print(f'wix-embed.html: {len(out):,} characters')
