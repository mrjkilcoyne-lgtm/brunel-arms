const Anthropic = require('@anthropic-ai/sdk').default;
const ANALYSIS_SYSTEM = require('../prompts/analysis');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
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
      // Try to extract JSON object — find the first { and last } to avoid
      // matching partial/nested objects from the greedy [\s\S]* pattern
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
};
