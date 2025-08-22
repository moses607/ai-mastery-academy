# AI Mastery Academy — GitHub Pages Deployment

This package is prepped for **GitHub Pages**. You can publish without any build tools.

## Quickest method (no Actions, just clicks)
1. Create a new repo on GitHub (e.g., `ai-mastery-academy`), set **Public**.
2. Upload all files from this folder (including `.nojekyll`), or use the commands below.
3. Go to **Settings → Pages**:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` (or `master`) and `/ (root)`
   - Click **Save**.
4. Wait ~1 minute. Your site will be live at `https://<username>.github.io/<repo>/`.

> If you own a custom domain, edit the `CNAME` file in this repo to your domain (e.g., `aimasteryacademy.com`), commit, then add the same domain in **Settings → Pages** and point your DNS with a CNAME to `<username>.github.io`.

## Optional: Command‑line upload (copy/paste)
```bash
# 1) Create and enter a project folder
mkdir ai-mastery-academy && cd ai-mastery-academy

# 2) Initialize git
git init
git branch -M main

# 3) Copy all files into this folder (unzipped contents)
#    If you already unzipped here, skip this step.

# 4) Commit and push
git add .
git commit -m "Initial commit: site for GitHub Pages"
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git
git push -u origin main

# 5) Enable Pages in Settings → Pages as described above
```

## Optional: Use GitHub Actions (auto deploy to `gh-pages`)
If you prefer a dedicated `gh-pages` branch, create `.github/workflows/pages.yml` with:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ "main" ]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: "."
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Then go to **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Files in this package
- `index.html` — multilingual landing page + FAQ bot (auto-open in 2s)
- `course.html` — course template (video/audio areas, curriculum, quiz) + FAQ bot
- `assets/favicon.svg`
- `.nojekyll` — disables Jekyll processing (keeps underscore files/folders intact)
- `CNAME` — set to your custom domain (edit or delete if not using a custom domain)
- `_redirects`, `netlify.toml` — harmless here, used for Netlify deployments

## After publishing
- Test language selector (EN/ES/FR/HI/ZH/AR) and RTL for Arabic.
- Test course links: `course.html?id=beginners|genai|business`.
- The FAQ bot opens automatically and falls back to your email `cherryfran84@yahoo.com`.
