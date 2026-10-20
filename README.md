# 6th Grade Math Practice

A dependency-free browser app with Geometry and Factoring sections, mixed sessions, randomized SVG geometry, guided retries, multiplication partial products, adaptive difficulty, and device-local mastery history.

Factoring includes All Factors, Common Factors, and Greatest Common Factor practice with expandable teaching examples, hints, worked solutions, and progress tracking. Easy uses positive integers 1–36, Medium 1–84, and Hard 1–144. Factor lists use large selectable number buttons; GCF uses a numeric answer. Tests cover every number through 144 and all 20,736 ordered pairs, including 1, primes, and perfect squares.

## Run

From this directory: `npm start`, then open http://127.0.0.1:5173.

## Verify

`npm run check` checks JavaScript syntax. `npm test` checks 3,400 randomized problems across all modes and difficulty levels, using independent Heron/formula checks, along with unit parsing, misconception feedback, adaptation, and storage round trips.

## Files

- `dist/math.js`: generators and answer validation
- `dist/diagrams.js`: responsive SVG rendering
- `dist/progress.js`: storage, recent mastery, adaptation
- `dist/app.js`: navigation and practice sessions
- `dist/style.css`: desktop and mobile layouts

Scores record the first submitted attempt per question. Retries do not inflate attempted/correct counts. Mastery weights the latest 12 attempts, and saved progress stays on the current browser/device. Changing topic or session settings starts a new session; prior attempts remain in progress. No student data is sent to a server.

The interface is touch-first, with 52px controls, visible topic tiles, and iPad portrait/landscape layouts. The Calculator button opens a movable left/right floating panel with basic arithmetic, decimals, sign change, backspace, and answer transfer. Calculations run one operation at a time. Its value lasts until the page is refreshed. Physical keyboards support digits, operators, Enter or =, Backspace, Delete (clear), and Escape (close) while the panel is focused.

## GitHub Pages

The public app is hosted at https://martinb35.github.io/AvaMath2/.
Every push to `main` runs syntax checks and tests, then deploys only `dist/` through `.github/workflows/pages.yml`. The workflow can also be run manually from GitHub Actions. Repository Settings → Pages must use GitHub Actions as the source. No Node server is needed on the host; progress remains local to each browser and hosting origin.
