# Le Ancour

A responsive informational website using plain HTML and CSS, with local artwork and locally hosted Bona Nova heading fonts. No dependencies, credentials, or build step are required.

## Run

From this repository, run `python3 -m http.server 8000 --bind 0.0.0.0` and open port 8000 in your development environment. Stop with Ctrl+C.

## Customize

- `index.html`: content and section navigation.
- `styles.css`: responsive layout, colours, and typography.
- `script.js`: subtle scroll reveals, with reduced-motion and no-JavaScript fallbacks.
- `assets/`: SVG artwork and favicon.

Company information describes Le Ancour Holdings Inc., its founder Jackie Le, and its investment focus. The supplied contact@yourdomain address remains a visibly marked placeholder. Footer social media labels are intentionally noninteractive. The supplied logo and founder portrait are referenced from leancour.carrd.co; that host must be accessible for the images to load.

## Validate and deploy

Check mobile and desktop layouts, follow the section links, and verify the artwork loads. There is no automated test suite. Upload the files to any static website host; no compilation is needed.

Bona Nova is distributed under the SIL Open Font License; see `assets/fonts/OFL.txt`. The text palette uses #3B56B8 for headings and accents, with #BAC5FF and #96C0FF for footer text on navy. Section backgrounds blend mist blue (#DBE3FA), powder blue (#CBD7F1), and lavender (#D4DAF5), with a navy footer.
