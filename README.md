# 6th Grade Math Practice

A dependency-free browser app with Geometry and Factoring sections, mixed sessions, randomized SVG geometry, guided retries, multiplication partial products, adaptive difficulty, and device-local mastery history.

Factoring includes All Factors, Common Factors, and Greatest Common Factor practice with expandable teaching examples, hints, worked solutions, and progress tracking. Easy uses positive integers 1–36, Medium 1–84, and Hard 1–144. Factor lists use large selectable number buttons; GCF uses a numeric answer. Tests cover every number through 144 and all 20,736 ordered pairs, including 1, primes, and perfect squares.

## Unit 2: Rates & Ratios

Seven topics share the existing session controls, hints, feedback, summary, and local progress history: Understanding Ratios, Equivalent Ratios, Proportional Word Problems, GCF, LCM, LCM Word Problems, and Factors vs. Multiples.

- **Learn:** explanations and worked examples open alongside interactive questions.
- **Practice:** unlimited questions for a selected topic or an adaptive topic mix. After three unhinted first-try successes in a topic, adaptive difficulty rises; after two consecutive misses, it falls. Repeated misses also show an initial hint. The topic mix favors recent mistakes and revisits every topic on a regular schedule.
- **Quiz:** ten shuffled questions covering all seven topics, including three proportional word problems, both equivalent-ratio formats, and a common-factor selection followed by GCF. Scores count the first submitted answer; retries do not change that score. The completion screen breaks down results by topic.
- **Practice My Mistakes:** replays saved missed questions, including their original visuals. A correct first answer on a later encounter resolves that saved mistake. Questions and mistakes survive reloads in the existing device-local history.

Ratio inputs accept spaces around the colon. Numeric answers accept decimals and fractions; cycle problems require a 12-hour clock time with AM/PM. Lists accept comma-separated positive whole numbers in any order. The interface uses keyboard-accessible selection buttons and labeled object groups, with controls at least 52px tall.

`dist/rates.js` contains randomized generators, validation, quiz balance, adaptive selection, and mistake helpers. `dist/rates-ui.js` renders Unit 2 controls and inputs, while `dist/rates.css` adds scoped layouts. `rates-tests.mjs` independently checks all question variants and difficulty levels, numeric/clock parsing, misconception feedback, weighting, deduplication, and persistence. `rates-session-tests.mjs` exercises the real shared controller through complete quizzes, retries, saved mistakes, unlimited practice, and switching back to existing sections.

## Chapter 4: Fraction Multiplication

Three separate topics cover Lessons 2–4: **Multiply Fractions and Whole Numbers**, **Multiply Fractions**, and **Multiply Mixed Numbers**. Randomized problems include both whole-number operand orders, whole and mixed results, occasional whole operands in fraction practice, and three fractions on Hard. Fractions have vertical bars; mixed numbers keep the whole part alongside the fraction.

- **Easy:** denominators through 8, many divide-first opportunities, two-factor fraction products, and one small mixed number times a fraction.
- **Medium:** denominators through 12, more non-whole results, and a mix of one or two mixed operands with whole parts through 5.
- **Hard:** denominators through 16, whole operands through 36 in Lesson 2, frequent three-factor products in Lesson 3, and two mixed operands with whole parts through 9 in Lesson 4.
- **Adaptive:** uses the existing shared session behavior: four recent unhinted first-try successes raise the level; two misses among the last three lower it and provide an initial hint.

The existing 5/10/20-question and unlimited sessions, first-try scoring, retries, hints, worked explanations, summaries, and device-local mastery apply to all three topics. Teaching covers the standard whole-times-numerator method, divide-first shortcuts, cross-cancellation, simplification, and mixed/improper conversion.

Answers accept `6`, `3/4`, and `2 1/3`, including spaces around fraction slashes. Comparison uses exact integer arithmetic, not decimal tolerance. Zero denominators, malformed input, decimals, and integer parts outside JavaScript's safe integer range are rejected without counting an attempt. Equivalent unreduced fractions receive a simplification prompt and can be retried; reduced improper fractions are accepted and explanations show the equivalent mixed number.

`dist/fractions.js` provides generation, parsing, exact validation, and fraction rendering; `dist/fractions.css` provides scoped layouts. `fractions-tests.mjs` checks randomized patterns, worksheet arithmetic, cancellation, parsing, exact comparison, and simplification. `rates-session-tests.mjs` also exercises fraction navigation, session controls, hints, retries, Adaptive behavior, summaries, and persistence through the real shared controller.

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
