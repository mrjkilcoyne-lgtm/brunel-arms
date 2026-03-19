# The Brunel Engine v2.0

AI-powered structured interview and insight platform. Combines Socratic questioning, first-principles thinking, lateral provocation, and behavioral economics to help people transform frustrations into breakthrough insight.

## Architecture

### Backend (Node.js + Express, deployed on Vercel)

- `server.js` — Express server for local dev. Contains duplicated system prompts and route handlers for `/api/chat`, `/api/analyze`, `/api/health`. Serves static files from `public/`.
- `api/chat.js` — Vercel serverless function for interview conversation. Contains the full `INTERVIEW_SYSTEM` prompt. Accepts `{ messages }` POST body, returns `{ response }`.
- `api/analyze.js` — Vercel serverless function for report generation. Contains the full `ANALYSIS_SYSTEM` prompt. Accepts `{ transcript }` POST body, returns parsed JSON report. Has fallback JSON extraction via regex if Claude's response isn't clean JSON.
- `api/health.js` — Health check endpoint. Returns `{ status, hasApiKey, model }`.
- `vercel.json` — Rewrites API routes and sets function timeouts (chat: 30s, analyze: 60s).

**Important:** The system prompts in `server.js` and `api/*.js` are duplicated. When modifying prompts, update both locations.

### Web Frontend

- `public/index.html` — Single-page application (no framework, vanilla JS). Contains all HTML, CSS, and JavaScript in one file. Implements:
  - Hash-based routing (`#welcome`, `#tools`, `#showcase`, `#pricing`, `#interview`, `#report`)
  - Screen management (welcome, interview, loading, report, error, tools, showcase, pricing)
  - Interview chat UI with typing indicators
  - Full report rendering with sections for one-line insight, reframe, pathways, creative angles, provocations, what-if questions, tools, pattern detection
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
- `api.ts` — API client with `sendMessage()`, `generateAnalysis()`, `checkHealth()`. Exports `Message` and `AnalysisReport` TypeScript interfaces. Default base URL: `http://10.0.2.2:3000` (Android emulator -> host).

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
```

### Environment Variables

- `ANTHROPIC_API_KEY` — Required. Get from https://console.anthropic.com/
- `PORT` — Optional, defaults to 3000

### Dependencies

**Backend:** `@anthropic-ai/sdk`, `express`, `cors`, `dotenv`

**Mobile:** `expo` (~55), `react` (19.2), `react-native` (0.83), `@react-navigation/native` + `native-stack`, `expo-font`, `expo-haptics`, `expo-linear-gradient`, `expo-status-bar`, `react-native-reanimated`, `react-native-safe-area-context`, `react-native-screens`, `react-native-svg`

### No Tests or Linting

There are no test files, test scripts, linting configs, or CI/CD pipelines in this project.

## Key Conventions

### Code Style
- CommonJS (`require`) in backend; ESM/TypeScript in mobile
- No semicolons enforcement; both styles present
- Functional React components with TypeScript interfaces for props
- `StyleSheet.create()` for all React Native styles
- Barrel exports via `index.ts` files in `components/`, `screens/`, `theme/`

### API Contract
- Interview: `POST /api/chat` with `{ messages: [{role, content}] }` -> `{ response: string }`
- Analysis: `POST /api/analyze` with `{ transcript: [{role, content}] }` -> JSON report object
- Health: `GET /api/health` -> `{ status, hasApiKey, model }`
- Interview completion signal: the assistant response contains `[INTERVIEW_COMPLETE]`

### Report JSON Structure
The analysis endpoint returns a structured JSON with these top-level fields:
`one_line`, `summary`, `reframe`, `core_issue`, `severity` (1-10), `commitment` (exploring|considering|ready_to_act), `constraints[]`, `blind_spots[]`, `existing_landscape[]`, `pathways[]` (4 fixed: Quick Win, Structural Fix, Adaptation, Moonshot), `creative_angles[]`, `provocations[]`, `what_if[]`, `next_actions[]`, `commitment_device`, `tools[]`, `pattern`, `parting_shot`

### Design System
- **Web:** CSS custom properties (--ink, --gold, --cream). Playfair Display + Source Sans 3.
- **Mobile:** Art Deco theme. Dark midnight background with gold metallic accents. Josefin Sans (display/geometric) + Playfair Display (body/serif). 4px base spacing unit.

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
