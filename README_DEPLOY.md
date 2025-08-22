# AI Mastery Academy — Static Site (No Manus Needed)

This zip contains everything you need to host your site anywhere as a static website.

## Files
- `index.html` — multilingual landing page + auto-opening FAQ bot
- `course.html` — reusable course template (video, audio, curriculum, quiz) + FAQ bot
- `assets/favicon.svg` — simple brand icon
- `_redirects` + `netlify.toml` — optional, for clean hosting on Netlify/Vercel

## Quick Deploy Options
### 1) Netlify (easiest — drag & drop)
- Go to Netlify Drop and drag this **entire folder or zip**.
- Netlify gives you a live URL instantly.
- Add your domain later if you want.

### 2) GitHub Pages (free)
- Create a repo, commit these files, enable GitHub Pages in Settings → Pages → Deploy from branch.
- Your site will be live at `https://<username>.github.io/<repo>/`.

### 3) Vercel (free)
- Import this folder as a new project.
- Accept defaults → get a live URL.

## Notes
- Update your contact email inside both files if needed (search for `CONTACT_EMAIL`).
- Add your own videos/audio by replacing the `src` values in `course.html`.
- To add more languages, extend the `i18n` object in `index.html` (copy an existing language block).
- If you use Netlify, `_redirects` and `netlify.toml` are already prepared.
