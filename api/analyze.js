const Anthropic = require('@anthropic-ai/sdk').default;

const ANALYSIS_SYSTEM = `You are generating a private analysis report from an interview transcript.

Based on the conversation, produce a structured report in this EXACT JSON format:

{
  "summary": "2-3 sentence summary of their situation. Direct, no fluff.",
  "core_issue": "What's the actual underlying problem? Look past symptoms to root cause. 1-2 sentences.",
  "severity": 7,
  "commitment": "exploring|considering|ready_to_act",
  "constraints": ["constraint 1", "constraint 2", "constraint 3"],
  "pathways": [
    {
      "name": "Quick Win",
      "description": "Smallest meaningful change. What they can do this week.",
      "effort": "low",
      "impact": "medium",
      "timeframe": "This week"
    },
    {
      "name": "Structural Fix",
      "description": "Addresses the root cause. Takes more effort but actually solves it.",
      "effort": "high",
      "impact": "high",
      "timeframe": "1-3 months"
    },
    {
      "name": "Adaptation",
      "description": "If the situation can't change, how might they adapt? Reframe, workaround, acceptance.",
      "effort": "medium",
      "impact": "variable",
      "timeframe": "Ongoing"
    }
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
      "category": "research|building|legal|financial|community|learning"
    }
  ],
  "pattern": "Is this a personal problem or a systemic/structural one? If systemic, note that briefly."
}

RULES:
- Be direct. No motivational fluff. No "you've got this!" energy.
- Pathways should be genuinely different approaches, not variations of the same thing.
- Next actions must be specific enough to do without further research.
- Tools should be real, existing resources. Don't invent fake URLs. Only include tools you're confident exist.
- If the problem is systemic, say so. Don't pretend individual action alone will fix structural issues.
- If they're just venting (commitment = exploring), acknowledge that and adjust pathways accordingly. More reflective, less action-oriented.
- Output valid JSON only. No markdown wrapping. No explanation outside the JSON.`;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const { transcript } = req.body;

    const formattedTranscript = transcript.map(m => {
      const role = m.role === 'assistant' ? 'Interviewer' : 'User';
      return `${role}: ${m.content}`;
    }).join('\n\n');

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: ANALYSIS_SYSTEM,
      messages: [{
        role: 'user',
        content: `Here is the interview transcript. Generate the analysis report.\n\n${formattedTranscript}`
      }]
    });

    const text = response.content[0].text;

    let report;
    try {
      report = JSON.parse(text);
    } catch {
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
};
