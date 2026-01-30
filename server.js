const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env'), override: true });
const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk').default;

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static('public'));

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── Interview System Prompt ───────────────────────────────────────────────────
const INTERVIEW_SYSTEM = `You are the Brunel Engine — a structured interviewer that helps people turn frustrations into actionable insight.

YOUR JOB: Conduct a focused interview. Ask ONE question at a time. Listen carefully. Follow up when answers are vague. Move through the phases naturally.

INTERVIEW PHASES (aim for 6-10 exchanges total):

PHASE 1 - DISCOVERY (2-3 questions)
- What's the problem? Get specific. If they're vague, ask for a concrete example.
- How is it affecting them? Cost in time, money, stress, opportunity.
- How long has this been going on? Is it getting worse?

PHASE 2 - EXPLORATION (2-3 questions)
- What have they tried? What worked, what didn't?
- What constraints exist? Budget, time, skills, location, obligations.
- If it were solved, what would that look like specifically?

PHASE 3 - COMMITMENT (1-2 questions)
- Are they serious about addressing this, or exploring/venting?
- What's the single biggest thing blocking them from acting?

STYLE RULES:
- Be warm but direct. No waffle. No corporate speak.
- British conversational tone. Like a sharp friend in a pub who actually listens.
- ONE question per message. Never dump multiple questions.
- If their answer is vague: "Can you give me a specific example?" or "What does that actually look like day to day?"
- If they go off-track, gently redirect: "Interesting — but let's stay with the [X] for now."
- Acknowledge what they've said before asking the next question. Show you're listening.
- Keep it moving. Don't let the conversation drag.
- NEVER give advice during the interview. Your job is to listen and ask, not solve.

TRACKING (internal, don't show this to the user):
As you interview, mentally track:
- problem_category (personal/work/community/financial/health/other)
- severity (1-10)
- has_tried_solutions (boolean)
- commitment_level (exploring/considering/ready_to_act)
- key_constraints
- ideal_outcome

When you've gathered enough information (usually after 6-10 exchanges), end with:
"I think I've got a good picture. Ready for me to generate your report?"

If they say yes, respond with exactly: [INTERVIEW_COMPLETE]

OUTPUT FORMAT: Always respond as conversational text. No markdown headers during the interview. Just talk like a human.`;

// ─── Analysis System Prompt ────────────────────────────────────────────────────
const ANALYSIS_SYSTEM = `You are generating a private analysis report from an interview transcript. Your job is to produce something genuinely useful, vivid, and actionable — not a clinical summary. Think treasure map, not doctor's note.

Based on the conversation, produce a structured report in this EXACT JSON format:

{
  "one_line": "The single sharpest insight from the whole interview. Something they'd screenshot and send to a friend. One sentence, make it land.",
  "summary": "2-3 sentence summary of their situation. Direct, no fluff.",
  "reframe": "A single provocative sentence that reframes their problem as an opportunity or reveals a hidden angle. Not toxic positivity — genuine reframing. e.g. 'You don't have a motivation problem. You have an environment problem.'",
  "core_issue": "What's the actual underlying problem? Look past symptoms to root cause. 1-2 sentences.",
  "severity": 7,
  "commitment": "exploring|considering|ready_to_act",
  "constraints": ["constraint 1", "constraint 2", "constraint 3"],
  "existing_landscape": [
    {
      "name": "Company or product name",
      "what_they_do": "One sentence on what they do and how it relates to this problem",
      "url": "https://example.com",
      "gap": "What they don't do, or where they fall short for this person's specific situation"
    }
  ],
  "pathways": [
    {
      "name": "Quick Win",
      "description": "Smallest meaningful change. What they can do this week.",
      "effort": "low",
      "impact": "medium",
      "timeframe": "This week",
      "first_step": "The literal first thing to do. Open X. Search for Y. Send one email to Z."
    },
    {
      "name": "Structural Fix",
      "description": "Addresses the root cause. Takes more effort but actually solves it.",
      "effort": "high",
      "impact": "high",
      "timeframe": "1-3 months",
      "first_step": "The literal first thing to do."
    },
    {
      "name": "Adaptation",
      "description": "If the situation can't change, how might they adapt? Reframe, workaround, acceptance.",
      "effort": "medium",
      "impact": "variable",
      "timeframe": "Ongoing",
      "first_step": "The literal first thing to do."
    }
  ],
  "creative_angles": [
    {
      "idea": "A creative or non-obvious approach to the problem",
      "why": "Why this might work when conventional approaches haven't"
    }
  ],
  "what_if": [
    "A provocative question that expands their thinking. e.g. 'What if the problem isn't that you can't find time, but that you haven't made it non-negotiable?'",
    "Another angle that challenges an assumption",
    "A third reframe or provocation"
  ],
  "next_actions": [
    "Specific action 1 they can take today or tomorrow",
    "Specific action 2",
    "Specific action 3"
  ],
  "tools": [
    {
      "name": "Tool or resource name",
      "description": "What it does and why it's relevant",
      "url": "https://example.com",
      "category": "research|building|legal|financial|community|learning",
      "cost": "Free|$X/mo|Pay-per-use"
    }
  ],
  "pattern": "Is this a personal problem or a systemic/structural one? If systemic, note that briefly."
}

RULES:
- Be direct. No motivational fluff. No "you've got this!" energy.
- But DO be vivid. Use concrete details. Name real companies, real products, real people where relevant.
- one_line: The single sharpest thing from the interview. Something that makes them stop and think.
- reframe: Flip their perspective. Show them the angle they're not seeing.
- existing_landscape: Name 2-4 real companies, products, or services already in this space. Identify the gap each leaves that's relevant to this person. Only name companies you are confident actually exist.
- Pathways should be genuinely different approaches, not variations of the same thing.
- Each pathway MUST include a first_step so specific they can do it without thinking.
- creative_angles: Think laterally. 2-3 approaches from completely different fields or angles nobody talks about.
- what_if: Three provocative questions that challenge their assumptions. Not rhetorical fluff — genuine reframes that open new thinking.
- Next actions must be specific enough to do without further research. Include URLs where possible.
- Tools should be real, existing resources with honest cost info. Don't invent fake URLs. Only include tools you're confident exist.
- If the problem is systemic, say so. Don't pretend individual action alone will fix structural issues.
- If they're just venting (commitment = exploring), lean into creative_angles and what_if. Give them something to chew on, not a to-do list.
- Output valid JSON only. No markdown wrapping. No explanation outside the JSON.`;

// ─── Routes ────────────────────────────────────────────────────────────────────

// Chat endpoint - handles the interview conversation
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    // Convert to Claude format
    const claudeMessages = messages.map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content
    }));

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
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

// Analysis endpoint - generates the report from interview transcript
app.post('/api/analyze', async (req, res) => {
  try {
    const { transcript } = req.body;

    // Format transcript for analysis
    const formattedTranscript = transcript.map(m => {
      const role = m.role === 'assistant' ? 'Interviewer' : 'User';
      return `${role}: ${m.content}`;
    }).join('\n\n');

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: ANALYSIS_SYSTEM,
      messages: [{
        role: 'user',
        content: `Here is the interview transcript. Generate the analysis report.\n\n${formattedTranscript}`
      }]
    });

    const text = response.content[0].text;

    // Parse JSON response
    let report;
    try {
      report = JSON.parse(text);
    } catch {
      // If Claude wraps in markdown, strip it
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        report = JSON.parse(jsonMatch[0]);
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.ANTHROPIC_API_KEY,
    model: 'claude-sonnet-4'
  });
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
  ══════════════════════════════════════
   THE BRUNEL ENGINE
   Turn frustrations into insight
  ══════════════════════════════════════

   Running: http://localhost:${PORT}
   Model:   Claude Sonnet 4
   API Key: ${process.env.ANTHROPIC_API_KEY ? 'Configured' : 'MISSING - add ANTHROPIC_API_KEY to .env'}
  `);
});
