const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env'), override: true });
const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk').default;
const { INTERVIEW_SYSTEM, ANALYSIS_SYSTEM } = require('./prompts');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static('public'));

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── Routes ────────────────────────────────────────────────────────────────────

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages must be a non-empty array' });
    }

    const claudeMessages = messages.map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content
    }));

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      system: INTERVIEW_SYSTEM,
      messages: claudeMessages
    });

    const text = response.content[0].text;
    res.json({ response: text });
  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({ error: 'Failed to get response. Check your API key.' });
  }
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { transcript } = req.body;

    if (!transcript || !Array.isArray(transcript) || transcript.length === 0) {
      return res.status(400).json({ error: 'transcript must be a non-empty array' });
    }

    const formattedTranscript = transcript.map(m => {
      const role = m.role === 'assistant' ? 'Interviewer' : 'User';
      return `${role}: ${m.content}`;
    }).join('\n\n');

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 6000,
      system: ANALYSIS_SYSTEM,
      messages: [{
        role: 'user',
        content: `Here is the interview transcript. Apply all analytical frameworks. Generate the deepest, most useful analysis report you can.\n\n${formattedTranscript}`
      }]
    });

    const text = response.content[0].text;

    let report;
    try {
      report = JSON.parse(text);
    } catch {
      const firstBrace = text.indexOf('{');
      const lastBrace = text.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace > firstBrace) {
        report = JSON.parse(text.slice(firstBrace, lastBrace + 1));
      } else {
        console.error('Raw response:', text);
        throw new Error('Failed to parse analysis');
      }
    }

    res.json(report);
  } catch (error) {
    console.error('Analysis error:', error.message);
    res.status(500).json({ error: 'Failed to generate analysis.' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.ANTHROPIC_API_KEY,
    model: 'claude-sonnet-4',
    version: '2.0.0'
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║        THE BRUNEL ENGINE v2.0            ║
  ║   Turn frustrations into insight         ║
  ╠══════════════════════════════════════════╣
  ║                                          ║
  ║   Running: http://localhost:${PORT}         ║
  ║   Model:   Claude Sonnet 4               ║
  ║   API Key: ${process.env.ANTHROPIC_API_KEY ? 'Configured ✓' : 'MISSING — add to .env'}           ║
  ║                                          ║
  ║   Interview: Socratic + First Principles  ║
  ║   Analysis:  SCAMPER + TRIZ + Behavioral  ║
  ╚══════════════════════════════════════════╝
  `);
});
