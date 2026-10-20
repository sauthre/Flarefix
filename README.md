# Flarefix — Landing Page

The public landing page for **flarefix.com**: Flarefix, the Daily News Podcast with hosts
Arjun & Meera. Tagline: *Stay Updated. Stay Unbiased.*

- `index.html` — the page (hero, latest episode, about, hosts, ethos, footer)
- `styles.css` — brand styling (black base, FLARE white / FIX red, steel-blue accent, gold tagline)

**Media:** images are served from the dedicated Netlify media site
`flarefix-assets.netlify.app` and referenced by absolute URL, so every Git deploy of
this repo is complete on its own. (Forge's GitHub connection can only push text files,
so binary images cannot be committed to this repo directly.) Master copies of the
images live with Flarefix Development.

Static site — no build step. Deployed to Netlify by Flarefix Development (Forge).
Blueprint: `../FLAREFIX-WEB-BLUEPRINT.md`.
