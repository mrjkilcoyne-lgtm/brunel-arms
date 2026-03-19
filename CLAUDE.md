# The Brunel Engine v2.0

AI-powered structured interview and insight platform. Combines Socratic questioning, first-principles thinking, lateral provocation, and behavioral economics to help people transform frustrations into breakthrough insight.

## Architecture

### Backend (Node.js + Express, deployed on Vercel)

- `server.js` — Express server for local dev. Route handlers for `/api/chat`, `/api/analyze`, `/api/health`. Serves static files from `public/`.
- `api/chat.js` — Vercel serverless function for interview conversation. Accepts `{ messages }` POST body, returns `{ response }`.
- `api/analyze.js` — Vercel serverless function for report generation. Accepts `{ transcript }` POST body, returns parsed JSON report. Has fallback JSON extraction if Claude's response isn't clean JSON.
- `api/health.js` — Health check endpoint. Returns `{ status, hasApiKey, model }`.
- `prompts/` — Shared system prompts consumed by both `server.js` and `api/*.js`.
  - `interview.js` — Interview system prompt (Socratic method, phases, style rules)
  - `analysis.js` — Analysis system prompt (frameworks, JSON output format, rules)
  - `index.js` — Barrel export
- `vercel.json` — Rewrites API routes and sets function timeouts (chat: 30s, analyze: 60s).

### Web Frontend

- `public/index.html` — Single-page application (no framework, vanilla JS). Contains all HTML, CSS, and JavaScript in one file. Implements:
  - Hash-based routing (`#welcome`, `#tools`, `#showcase`, `#pricing`, `#interview`, `#report`)
  - Screen management (welcome, interview, loading, report, error, tools, showcase, pricing)
  - Interview chat UI with typing indicators
  - Full report rendering with sections for one-line insight, reframe, pathways, creative angles, provocations, what-if questions, tools, pattern detection
  - URL sanitization (`sanitizeUrl()`) to prevent XSS via `javascript:` URLs in LLM output
  - Upgrade CTAs (Deep Dive report, 1:1 with Matt)
- Design: Playfair Display (headings) + Source Sans 3 (body). Color scheme: ink/gold/cream.

### Mobile App (React Native + Expo)

Art Deco themed Android/iOS app in `mobile/`.

**Entry point:** `mobile/App.tsx` — Manages screen state (splash -> home -> interview -> report) and font loading. No navigation library used; screens are conditionally rendered.

**Theme system** (`mobile/src/theme/`):
- `colors.ts` — Dark palette (midnight/charcoal/slate) with gold/silver/bronze metallics and jewel tone accents. Includes gradient arrays for LinearGradient.
- `typography.ts` — Type scale using Josefin Sans (geometric display) and Playfair Display (elegant serif). Predefined styles: hero, title, heading, body, button, chat, quote, data.
- `spacing.ts` — 4px base unit, 8px primary scale. Includes `radius` and `layout` constants.
- `index.ts` — Barrel export.

**Components** (`mobile/src/components/`):
- `DecoButton.tsx` — Primary/secondary/ghost button variants with gold accent lines. Props: `title`, `onPress`, `variant`, `loading`, `disabled`, `icon`.
- `DecoCard.tsx` — Elevated card with optional title (flanked by dashes) and gold top accent.
- `DecoTextInput.tsx` — Multiline input with gold focus border and integrated send button.
- `DecoElements.tsx` — SVG decorative elements: `DecoDivider` (diamond motif), `DecoCorner` (stepped bracket), `DecoSunburst` (radiating lines), `DecoChevronBar` (ziggurat), `DecoFan` (palmette), `DecoFrame` (corner-accented wrapper).
- `index.ts` — Barrel export.

**Screens** (`mobile/src/screens/`):
- `SplashScreen.tsx` — Animated sequence: sunburst -> title -> divider -> tagline -> fade out. Uses `Animated` API.
- `HomeScreen.tsx` — Landing with process steps (Discovery/Exploration/Insight), philosophy quote, and "Begin Session" CTA.
- `InterviewScreen.tsx` — Chat interface with phase indicator (Discovery/Exploration/Synthesis based on message count). Detects `[INTERVIEW_COMPLETE]` signal.
- `ReportScreen.tsx` — Renders full analysis report with sections for one-line, reframe, summary, blind spots, pathways, creative angles, provocations, what-if, landscape, next actions, tools, pattern, parting shot.
- `index.ts` — Barrel export.

**Services** (`mobile/src/services/`):
- `api.ts` — API client with `sendMessage()`, `generateAnalysis()`, `checkHealth()`. Exports `Message` and `AnalysisReport` TypeScript interfaces. Base URL configurable via `EXPO_PUBLIC_API_URL` env var (defaults to `http://10.0.2.2:3000` for Android emulator).

**Assets** (`mobile/assets/`):
- App icons (adaptive Android icons, favicon, splash)
- Fonts: Josefin Sans (Light, Regular, Medium, SemiBold, Bold) and Playfair Display (Regular, Medium, Bold, Italic)

## Development

```bash
# Backend
npm install && cp .env.example .env  # Add ANTHROPIC_API_KEY
npm run dev                          # Port 3000 (uses --watch for auto-reload)
npm start                            # Port 3000 (production)

# Mobile
cd mobile && npm install
npx expo start --android             # or --ios, --web
# To point at a deployed backend:
EXPO_PUBLIC_API_URL=https://your-api.vercel.app npx expo start

# Quality
npm test                             # Node.js test runner (test/**/*.test.js)
npm run lint                         # ESLint
npm run format                       # Prettier (write)
npm run format:check                 # Prettier (check only)
```

### Environment Variables

- `ANTHROPIC_API_KEY` — Required. Get from https://console.anthropic.com/
- `PORT` — Optional, defaults to 3000
- `EXPO_PUBLIC_API_URL` — Optional. Mobile app API base URL (defaults to Android emulator localhost)

### Dependencies

**Backend:** `@anthropic-ai/sdk`, `express`, `cors`, `dotenv`
**Dev:** `eslint`, `@eslint/js`, `prettier`

**Mobile:** `expo` (~55), `react` (19.2), `react-native` (0.83), `@react-navigation/native` + `native-stack`, `expo-font`, `expo-haptics`, `expo-linear-gradient`, `expo-status-bar`, `react-native-reanimated`, `react-native-safe-area-context`, `react-native-screens`, `react-native-svg`

## Quality & Testing

- **Tests:** `test/api.test.js` — Uses Node.js built-in test runner (`node:test`). Tests prompt exports, health endpoint, and request validation for chat/analyze endpoints.
- **Linting:** ESLint flat config (`eslint.config.js`). Covers backend JS only (mobile and public excluded).
- **Formatting:** Prettier (`.prettierrc`). Single quotes, trailing commas, 100 char width.
- **Node version:** `.nvmrc` pins to Node 22. `engines` field requires >=18.

Run all checks: `npm run lint && npm test`

## Key Conventions

### Code Style
- CommonJS (`require`) in backend; ESM/TypeScript in mobile
- Functional React components with TypeScript interfaces for props
- `StyleSheet.create()` for all React Native styles
- Barrel exports via `index.ts` files in `components/`, `screens/`, `theme/`

### API Contract
- Interview: `POST /api/chat` with `{ messages: [{role, content}] }` -> `{ response: string }`
- Analysis: `POST /api/analyze` with `{ transcript: [{role, content}] }` -> JSON report object
- Health: `GET /api/health` -> `{ status, hasApiKey, model }`
- Interview completion signal: the assistant response contains `[INTERVIEW_COMPLETE]`
- Both POST endpoints validate request bodies and return 400 for missing/empty arrays

### Report JSON Structure
The analysis endpoint returns a structured JSON with these top-level fields:
`one_line`, `summary`, `reframe`, `core_issue`, `severity` (1-10), `commitment` (exploring|considering|ready_to_act), `constraints[]`, `blind_spots[]`, `existing_landscape[]`, `pathways[]` (4 fixed: Quick Win, Structural Fix, Adaptation, Moonshot), `creative_angles[]`, `provocations[]`, `what_if[]`, `next_actions[]`, `commitment_device`, `tools[]`, `pattern`, `parting_shot`

### Design System
- **Web:** CSS custom properties (--ink, --gold, --cream). Playfair Display + Source Sans 3.
- **Mobile:** Art Deco theme. Dark midnight background with gold metallic accents. Josefin Sans (display/geometric) + Playfair Display (body/serif). 4px base spacing unit.

## Common Tasks

### Modifying interview behavior
Edit `prompts/interview.js`. Changes apply to both local dev (`server.js`) and Vercel deployment (`api/chat.js`) since they share the module.

### Modifying report output
Edit `prompts/analysis.js`. The JSON schema in this prompt defines the report structure. If you add/remove fields, also update:
1. The `renderReport()` function in `public/index.html`
2. The `AnalysisReport` interface in `mobile/src/services/api.ts`
3. The `ReportScreen` component in `mobile/src/screens/ReportScreen.tsx`

### Adding a new report section
1. Add the field to the JSON schema in `prompts/analysis.js`
2. Add rendering logic to `renderReport()` in `public/index.html`
3. Add the field to `AnalysisReport` in `mobile/src/services/api.ts`
4. Add a UI section in `mobile/src/screens/ReportScreen.tsx`

### Adding a new mobile screen
1. Create `mobile/src/screens/NewScreen.tsx`
2. Export from `mobile/src/screens/index.ts`
3. Add screen type to the `Screen` union in `mobile/App.tsx`
4. Add conditional render and navigation handler in `App.tsx`

### Deploying
The backend deploys on Vercel. The `api/` directory contains serverless functions, `public/` is served as static. Push to the connected branch and Vercel auto-deploys. No CI/CD pipeline is configured beyond Vercel's built-in.

## Gotchas

- **`public/index.html` is a 1900-line monolith** — All CSS, HTML, and JS in one file. No build step. Be careful with large edits; search for section comments (`─── Section ───`) to navigate.
- **Mobile API URL** — Defaults to `http://10.0.2.2:3000` (Android emulator -> host). For iOS simulator, use `http://localhost:3000`. For production, set `EXPO_PUBLIC_API_URL`.
- **LLM output is untrusted** — The analysis endpoint receives free-form JSON from Claude. URLs in the report are sanitized in the web frontend (`sanitizeUrl()`), but the mobile app trusts `Linking.openURL()` directly — consider adding validation there too.
- **No authentication** — All API endpoints are open. Rate limiting and auth should be added before any paid tier launches.
- **Vercel function cold starts** — The analyze endpoint has a 60s timeout but complex reports may take 15-20s on first call.

## Interview Methodology

v2.0 interview uses four phases built on research:
1. **Discovery** (2-3 questions) — Surface problem + psychological safety (clean language, narrative therapy, OARS ratio)
2. **Excavation** (2-3 questions) — Root cause via 5 Whys + first principles + assumption challenging
3. **Expansion** (2-3 questions) — Widen possibility space via appreciative inquiry, lateral thinking, bisociation, JTBD, de Bono's PO
4. **Crystallisation** (1-2 questions) — Readiness via motivational interviewing + mental contrasting (WOOP)

Target: 8-12 exchanges total. One question per message. Reflect before asking. Never give advice.

## Analysis Frameworks

Reports apply: First Principles, Jobs to be Done, Systems Thinking, Inversion (Munger), Constraint Analysis, Pattern Recognition, SCAMPER, TRIZ, Bisociation (Koestler), Loss Aversion framing, Narrative Therapy, Fresh Start Effect, Implementation Intentions (Gollwitzer), OARS (Miller & Rollnick).

## Key Config

- Model: `claude-sonnet-4-20250514`
- Interview: 600 max_tokens, 8-12 exchanges
- Analysis: 6000 max_tokens, structured JSON output
- Vercel function timeouts: chat 30s, analyze 60s
- `ANTHROPIC_API_KEY` required, `PORT` optional (default 3000)

## Claude Code Hooks

`.claude/settings.json` configures a `SessionStart` hook that runs `npm install` on session start.
