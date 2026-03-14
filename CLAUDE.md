# The Brunel Engine v2.0

AI-powered structured interview and insight platform. Combines Socratic questioning, first-principles thinking, lateral provocation, and behavioral economics to help people transform frustrations into breakthrough insight.

## Architecture

**Backend** (Node.js + Express, deployed on Vercel):
- `server.js` — Express server for local dev
- `api/chat.js` — Interview conversation (Vercel function)
- `api/analyze.js` — Report generation (Vercel function)
- `api/health.js` — Health check

**Mobile App** (React Native + Expo):
- `mobile/` — Art Deco themed Android/iOS app
- `mobile/src/theme/` — Design system (colors, typography, spacing)
- `mobile/src/components/` — Reusable Art Deco UI components
- `mobile/src/screens/` — Splash, Home, Interview, Report screens
- `mobile/src/services/` — API communication layer

**Web Frontend**: `public/index.html` — Original web SPA

## Development

```bash
# Backend
npm install && cp .env.example .env  # Add ANTHROPIC_API_KEY
npm run dev                          # Port 3000

# Mobile
cd mobile && npm install
npx expo start --android
```

## Interview Methodology

v2.0 interview uses four phases built on research:
1. **Discovery** — Surface problem + psychological safety (clean language, active listening)
2. **Excavation** — Root cause via 5 Whys + first principles + assumption challenging
3. **Expansion** — Widen possibility space via appreciative inquiry, lateral thinking, bisociation
4. **Crystallisation** — Readiness via motivational interviewing + mental contrasting (WOOP)

## Analysis Frameworks

Reports apply: First Principles, Jobs to be Done, Systems Thinking, Inversion (Munger), SCAMPER, TRIZ, Bisociation (Koestler), Loss Aversion framing, Implementation Intentions (Gollwitzer).

## Key Config

- Model: `claude-sonnet-4-20250514`
- Interview: 600 token limit, 8-12 exchanges
- Analysis: 6000 token limit, structured JSON with 4 pathways + creative angles + provocations
- `ANTHROPIC_API_KEY` required, `PORT` optional (default 3000)
