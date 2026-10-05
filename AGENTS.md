# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Prototype direction

- The hero animation should feel like a classic characterful animated-studio ident: the lowercase `o` has weight, anticipation, squash-and-stretch, and lands on neighboring letters.
- The typography must remain editorial and mature. Do not add faces, eyes, limbs, or childish decoration.
- Each impacted letter visibly compresses by about 9%, rebounds slightly above its original height, and then settles into the final `portfolio` wordmark while keeping its baseline fixed.
- Use the supplied per-letter SVG assets and `portfolio.svg` as the coordinate source of truth; never replace the wordmark with live type.
- The last `o` lands upright first, then relaxes into the final slanted glyph position against `i`.
- Keep the page continuous with ordinary scrolling. Do not restore the lightning tear, masks, split halves, black gap, sticky transition, or rising overlay.
- The travelling `o` drops from above onto `p`, traverses the exact visible tops p → o → r → t → f → o → l, then makes a higher lateral rebound from `l`, lands upright beside `i`, pauses briefly, and only then tilts into its exact final position against `i`.
- Keep the travelling `o` organic rather than metronomic: use a short anticipation, varied arc heights and durations, gentle deceleration near each apex, and smooth acceleration into contact. After the final tilt, explicitly lock it to the exact Figma transform so it cannot drift.
- The initial fall from above to `p` must be one uninterrupted accelerating tween with no intermediate waypoint or easing restart, so it never appears to hang in mid-air.
- Use a compact living lightning-bolt cursor on precise hover devices only, with a light pink fairy-dust trail; preserve the system text cursor on editable fields and disable the custom cursor for reduced motion.
- Hero tags follow Figma node 1705:397: 496×54, 262×54, and 293×54 at a 1910px design width, with centered EasyFlex 32px text.
- Keep each hero-tag label in its own inner span and optically center it on both axes; compensate EasyFlex's visible-glyph metrics with a 1px downward offset without moving the colored pill itself.
- Position hero pills and labels absolutely from Figma 1705:397 rather than through flex math: pills at design x 379/888/1163 and y 1186, labels at y 1199 with full pill widths and centered text.
- Header follows Figma 1705:397: 77px top position at 1910px design width, title-cased labels, and supplied source SVGs at 26×43 (paperclip), 46×43 (folder), and 22×44 (phone). Preserve the visible dot over the `i` in `digital designer`.
