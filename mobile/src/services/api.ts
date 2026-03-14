/**
 * THE BRUNEL ENGINE — API Service
 *
 * Handles communication with the backend.
 * Configure API_BASE_URL for your deployment.
 */

// Change this to your deployed backend URL
const API_BASE_URL = 'http://10.0.2.2:3000'; // Android emulator -> host machine

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface AnalysisReport {
  one_line: string;
  summary: string;
  reframe: string;
  core_issue: string;
  severity: number;
  commitment: 'exploring' | 'considering' | 'ready_to_act';
  constraints: string[];
  blind_spots: string[];
  existing_landscape: Array<{
    name: string;
    what_they_do: string;
    url: string;
    gap: string;
  }>;
  pathways: Array<{
    name: string;
    description: string;
    effort: string;
    impact: string;
    timeframe: string;
    first_step: string;
    mental_model: string;
  }>;
  creative_angles: Array<{
    idea: string;
    why: string;
    analogy: string;
  }>;
  provocations: string[];
  what_if: string[];
  next_actions: string[];
  tools: Array<{
    name: string;
    description: string;
    url: string;
    category: string;
    cost: string;
  }>;
  commitment_device: string;
  pattern: string;
  parting_shot: string;
}

export async function sendMessage(messages: Message[]): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    throw new Error(`Chat request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.response;
}

export async function generateAnalysis(transcript: Message[]): Promise<AnalysisReport> {
  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcript }),
  });

  if (!response.ok) {
    throw new Error(`Analysis request failed: ${response.status}`);
  }

  return response.json();
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    const data = await response.json();
    return data.status === 'ok' && data.hasApiKey;
  } catch {
    return false;
  }
}
