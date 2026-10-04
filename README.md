# Jay Mehta — Portfolio

Unity game developer portfolio with playable projects, work experience, recommendations, and a downloadable resume.

**Website:** [jaymehta721.github.io](https://jaymehta721.github.io/)

## Publish

In **Settings → Pages**, select **Deploy from a branch**, then **main** and **/(root)**. Save the settings. Commit and push website updates to `main`; wait for the Pages deployment to finish in the Actions tab.

The website entry point is `index.html`. `.nojekyll` tells GitHub Pages to serve these static files directly. The repository page displays this README; the portfolio itself is at the website link above.

## Local preview

Run `python3 -m http.server 4173` in this folder, then open `http://localhost:4173`.

Validate changes with `python3 scripts/check_site.py`, `node --check app.js`, and `node --check site-config.js`.
