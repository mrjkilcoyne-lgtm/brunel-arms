# Brunel Engine

AI-powered structured interview and analysis platform. Users go through a conversational interview about their problem, then receive a detailed actionable report.

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: Vanilla HTML/CSS/JS (single-page app in `public/index.html`)
- **AI**: Anthropic Claude API (`@anthropic-ai/sdk`)
- **Deployment**: Vercel (serverless functions in `api/`)

## Project Structure

```
server.js           # Express server (local dev) - interview + analysis endpoints
api/chat.js         # Vercel function: interview conversation
api/analyze.js      # Vercel function: report generation from transcript
api/health.js       # Vercel function: health check
public/index.html   # Complete frontend SPA (embedded CSS/JS)
```

## Development

```bash
npm install
cp .env.example .env  # Add your ANTHROPIC_API_KEY
npm run dev            # Starts with --watch on port 3000
```

## Key Concepts

- **Interview flow**: 3 phases (Discovery, Exploration, Commitment), 6-10 exchanges, one question at a time
- **Report output**: JSON with pathways (Quick Win, Structural Fix, Adaptation), creative angles, what-if questions, tools, next actions
- **Chat endpoint** (`/api/chat`): Sends message history, returns single Claude response (500 token limit)
- **Analyze endpoint** (`/api/analyze`): Sends full transcript, returns structured JSON report (4000 token limit)
- Model: `claude-sonnet-4-20250514`

## Environment Variables

- `ANTHROPIC_API_KEY` - Required. Get from https://console.anthropic.com/
- `PORT` - Optional. Defaults to 3000.
