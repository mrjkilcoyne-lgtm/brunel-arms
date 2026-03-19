const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

// ─── Shared Prompt Tests ─────────────────────────────────────────────────────

describe('prompts', () => {
  it('exports INTERVIEW_SYSTEM and ANALYSIS_SYSTEM', () => {
    const { INTERVIEW_SYSTEM, ANALYSIS_SYSTEM } = require('../prompts');
    assert.ok(typeof INTERVIEW_SYSTEM === 'string');
    assert.ok(typeof ANALYSIS_SYSTEM === 'string');
    assert.ok(INTERVIEW_SYSTEM.length > 100);
    assert.ok(ANALYSIS_SYSTEM.length > 100);
  });

  it('INTERVIEW_SYSTEM contains required phases', () => {
    const { INTERVIEW_SYSTEM } = require('../prompts');
    assert.ok(INTERVIEW_SYSTEM.includes('PHASE 1'));
    assert.ok(INTERVIEW_SYSTEM.includes('PHASE 2'));
    assert.ok(INTERVIEW_SYSTEM.includes('PHASE 3'));
    assert.ok(INTERVIEW_SYSTEM.includes('PHASE 4'));
    assert.ok(INTERVIEW_SYSTEM.includes('[INTERVIEW_COMPLETE]'));
  });

  it('ANALYSIS_SYSTEM requires valid JSON output', () => {
    const { ANALYSIS_SYSTEM } = require('../prompts');
    assert.ok(ANALYSIS_SYSTEM.includes('one_line'));
    assert.ok(ANALYSIS_SYSTEM.includes('pathways'));
    assert.ok(ANALYSIS_SYSTEM.includes('Output valid JSON only'));
  });
});

// ─── API Handler Tests ───────────────────────────────────────────────────────

function mockReq(method, body) {
  return { method, body };
}

function mockRes() {
  const res = {
    statusCode: 200,
    body: null,
    status(code) { res.statusCode = code; return res; },
    json(data) { res.body = data; return res; },
  };
  return res;
}

describe('api/health', () => {
  it('returns status ok', () => {
    const handler = require('../api/health');
    const res = mockRes();
    handler(mockReq('GET'), res);
    assert.equal(res.body.status, 'ok');
    assert.ok('hasApiKey' in res.body);
  });
});

describe('api/chat', () => {
  it('rejects non-POST requests', async () => {
    const handler = require('../api/chat');
    const res = mockRes();
    await handler(mockReq('GET'), res);
    assert.equal(res.statusCode, 405);
  });

  it('rejects missing messages', async () => {
    const handler = require('../api/chat');
    const res = mockRes();
    await handler(mockReq('POST', {}), res);
    assert.equal(res.statusCode, 400);
    assert.ok(res.body.error.includes('messages'));
  });

  it('rejects empty messages array', async () => {
    const handler = require('../api/chat');
    const res = mockRes();
    await handler(mockReq('POST', { messages: [] }), res);
    assert.equal(res.statusCode, 400);
  });
});

describe('api/analyze', () => {
  it('rejects non-POST requests', async () => {
    const handler = require('../api/analyze');
    const res = mockRes();
    await handler(mockReq('GET'), res);
    assert.equal(res.statusCode, 405);
  });

  it('rejects missing transcript', async () => {
    const handler = require('../api/analyze');
    const res = mockRes();
    await handler(mockReq('POST', {}), res);
    assert.equal(res.statusCode, 400);
    assert.ok(res.body.error.includes('transcript'));
  });

  it('rejects empty transcript array', async () => {
    const handler = require('../api/analyze');
    const res = mockRes();
    await handler(mockReq('POST', { transcript: [] }), res);
    assert.equal(res.statusCode, 400);
  });
});
