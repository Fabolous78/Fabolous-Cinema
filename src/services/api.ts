import { RecommendationItem, RecommendationRequest } from '../types';

export async function fetchAIRecommendations(req: RecommendationRequest, userHistory: any[]): Promise<RecommendationItem[]> {
  try {
    const response = await fetch('/api/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...req, userHistory }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Impossible d\'obtenir les recommandations.');
    }

    const data = await response.json();
    return data.recommendations || [];
  } catch (error) {
    console.error('fetchAIRecommendations error:', error);
    throw error;
  }
}

export async function fetchQuickAIAnalysis(title: string, type: 'movie' | 'series') {
  try {
    const response = await fetch('/api/ai/quick-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, type }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Erreur d\'analyse.');
    }

    const data = await response.json();
    return data.analysis;
  } catch (error) {
    console.error('fetchQuickAIAnalysis error:', error);
    throw error;
  }
}

export async function sendAIChatMessage(messages: { sender: 'user' | 'ai'; text: string }[], userContext: any) {
  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, userContext }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Erreur lors du chat.');
    }

    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error('sendAIChatMessage error:', error);
    throw error;
  }
}
