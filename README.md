# EA Portfolio — static version (GitHub Pages)

A version of the portfolio with no PHP and no database. It runs on GitHub Pages.

| PHP version                 | Static version                                   |
|-----------------------------|--------------------------------------------------|
| `works.php` + MySQL         | `data/works.json`                                |
| `code_preview.php`          | reads the same JSON in `scripts.js`              |
| `preview.php` + temp files  | `preview.html?id=N` (builds the page in the browser) |
| `cleanup.php`, `.htaccess`  | not needed                                       |
| `404.php`                   | `404.html` (GitHub Pages uses it automatically)  |
| `admin/`, `auth.php`        | removed: edit `data/works.json` instead          |

## Adding or editing a project
1. Put the screenshot in `uploads/`.
2. Add an entry to `data/works.json` (newest first):
   `id`, `title`, `date`, `description`, `image_url`, `technologies`, `html_code`, `css_code`, `js_code`.
   Code goes in as a JSON string. Newlines are `\n` and quotes are `\"`.
3. Commit and push. The site updates in about a minute.

## Deploying
This folder is published from the GitHub repo `ealmeida1024/ealmeida` with GitHub Pages
(Settings → Pages → Deploy from a branch → `main` / root).
Live at https://ealmeida1024.github.io/ealmeida/

If the repo is ever renamed, update the two `/ealmeida/` redirects in `404.html`.

To test locally, run `python -m http.server` in this folder and open http://localhost:8000.
Opening index.html directly (file://) won't load the projects.
