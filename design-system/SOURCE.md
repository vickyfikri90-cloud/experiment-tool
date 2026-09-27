# Source of this folder

This folder is an exported snapshot of the **Experiment Tool** design system artifact on claude.ai
(https://claude.ai/code/artifact/c6e8bd0e-b33c-4555-9843-03dc8925fce1), taken 2026-09-27.

- Start with `README.md`. It has the usage rules, then a generated "Consuming this system" section and an index of cards in `api/`.
- `tokens.css` is every token as a CSS variable, and `tokens.json` is the same data as JSON.
- `components/bundle.js` + `components/bundle.css` contain all 19 controls as `window.ExperimentKit.<Name>`. Types are in `components/index.d.ts`.
- `components/<Name>/preview.html` opens in a browser as a working demo. The only local change from the artifact is that each preview loads `../../tokens.css`, `../bundle.css` and `../bundle.js`.

The design system is edited on claude.ai, not here. Edits made in this folder are overwritten on the next export. To refresh, ask Claude to export the design system into `design-system/` again.

The kit's source code lives in `../Components/`. The bundle is built from those files (plus the same additions).
