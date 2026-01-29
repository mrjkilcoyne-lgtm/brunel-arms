module.exports = function handler(req, res) {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.ANTHROPIC_API_KEY,
    model: 'claude-sonnet-4'
  });
};
