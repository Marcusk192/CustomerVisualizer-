# Kitchen style planner

A simple website where customers try kitchen styles before their design meeting.
They choose a layout and room size, a door style and colour (shown on real OS Doors kitchen photos), a worktop, handles, appliances and storage. Then they send their ideas, which arrive by email.

It is a plain static site: `index.html`, `styles.css`, `app.js`, `config.js` and the `img` folder. There is no server or database.

## Change the settings

Edit `config.js`:
- `enquiryEmail`: where enquiries are sent. They go through [FormSubmit](https://formsubmit.co). The first enquiry sends a one-off "activate" email to this address. Click the link in it, and from then on every enquiry arrives as an email.
- Text, phone number, layouts, appliances and storage options.
- **Styles and colours**: each style is a set of photos of the same kitchen in different colours. Add the photos to `img/` as `<set>_<colour>.jpg` (about 2000px wide), plus a small `<set>_<colour>-t.jpg` (about 520px). Then add the colour to the style in `config.js`.
- **Worktops**: `img/wt_<id>.jpg` (480×320).

## Put it online (free, GitHub Pages)

1. In the GitHub repository, go to **Settings → Pages**.
2. Choose **Deploy from a branch**, branch `main`, folder `/ (root)`, then Save.
3. After a minute the planner is live at `https://marcusk192.github.io/CustomerVisualizer-/`.

## Add it to Wix (single file, copy and paste)

`wix-embed.html` contains the whole planner in one file. In Wix, choose **Add (+) → Embed Code → Embed HTML**, then choose **Code**. Paste in everything from `wix-embed.html` and click Update. Make the box full width and about 760px tall.
The photos load straight from this repository on GitHub, so **the repository must be public**.
After changing `config.js`, `app.js` or `styles.css`, rebuild the file with `python3 tools/build-embed.py`, then paste it into Wix again.

## Add it to Wix (as a link to the hosted site)

In the Wix Editor, choose **Add (+) → Embed Code → Embed HTML**, choose **Code**, paste the snippet below, then click Update:

```html
<iframe src="https://marcusk192.github.io/CustomerVisualizer-/" title="Kitchen planner" style="width:100%;height:760px;border:0"></iframe>
```

Stretch the box to full width and make it about 760px tall (about 1000px tall in the mobile editor).
Or link a button straight to the planner's address.

## Try it on your computer

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Photos

The kitchen photos are OS Doors CGIs, and the worktop images come from the shared Google Drive. Check that you are allowed to use them on your website.
