import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));

const PORT = 3000;

// Shared Gemini instance getter
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is missing from environment variables.');
  }
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API Route: Recommendations
app.post('/api/recommendations', async (req, res) => {
  try {
    const { favoriteGenres = [], currentMood = '', preferredType = 'all', maxRuntime, customPrompt = '', userHistory = [] } = req.body;
    const ai = getGenAI();

    const historySummary = userHistory.length > 0 
      ? userHistory.map((item: any) => `- ${item.title} (${item.type === 'movie' ? 'Film' : 'Série'}) - Note/Statut: ${item.rating ? item.rating + '/10' : item.status}`).join('\n')
      : 'Aucun historique renseigné pour le moment.';

    const systemInstruction = `Tu es un expert mondial en cinéma et séries télévisées (CinéAI). 
Ta mission est de recommander 5 à 7 films ou séries parfaitement adaptés aux goûts de l'utilisateur.
Toutes tes réponses doivent être exclusivement rédigées en français soigné, chaleureux et passionné.
Pour chaque recommandation, fournis un argumentaire ("whyRecommended") convaincant et personnalisé qui explique POURQUOI ce titre correspond à sa demande.
Indique un pourcentage de correspondance ("matchPercentage") réaliste entre 75 et 99%.`;

    const promptText = `Recommande 6 films ou séries d'exception selon les critères suivants :
- Genres préférés : ${favoriteGenres.join(', ') || 'Tous les genres'}
- Ambiance / Mood recherché : ${currentMood || 'Indifférent'}
- Type préféré : ${preferredType === 'movie' ? 'Seulement des films' : preferredType === 'series' ? 'Seulement des séries' : 'Films et Séries'}
${maxRuntime ? `- Durée maximale conseillée : ${maxRuntime} minutes` : ''}
${customPrompt ? `- Consigne spécifique de l'utilisateur : "${customPrompt}"` : ''}

Historique de l'utilisateur :
${historySummary}

Retourne exactement un tableau JSON avec les champs suivants pour chaque élément :
- title: string (Nom exact du film ou de la série)
- type: "movie" ou "series"
- releaseYear: number
- genres: array of strings (en français)
- matchPercentage: number (75 à 99)
- synopsis: string (résumé captivant de 2-3 phrases en français)
- whyRecommended: string (explication personnalisée enthousiasmante de 2 phrases)
- recommendedForMood: string (l'ambiance clé qui correspond)
- similarTo: string (nom d'une œuvre célèbre similaire)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              type: { type: Type.STRING },
              releaseYear: { type: Type.INTEGER },
              genres: { type: Type.ARRAY, items: { type: Type.STRING } },
              matchPercentage: { type: Type.INTEGER },
              synopsis: { type: Type.STRING },
              whyRecommended: { type: Type.STRING },
              recommendedForMood: { type: Type.STRING },
              similarTo: { type: Type.STRING },
            },
            required: ['title', 'type', 'releaseYear', 'genres', 'matchPercentage', 'synopsis', 'whyRecommended']
          }
        }
      }
    });

    const text = response.text || '[]';
    const jsonOutput = JSON.parse(text);
    return res.json({ recommendations: jsonOutput });
  } catch (error: any) {
    console.error('Error generating recommendations:', error);
    return res.status(500).json({ error: error.message || 'Erreur lors de la génération des recommandations AI.' });
  }
});

// API Route: Quick Analysis for a title
app.post('/api/ai/quick-analysis', async (req, res) => {
  try {
    const { title, type } = req.body;
    const ai = getGenAI();

    const promptText = `Fais une analyse synthétique et captivante sans spoiler pour le film ou la série : "${title}" (${type === 'movie' ? 'Film' : 'Série'}).
Réponds en français avec un format JSON strict :
{
  "summary": "Résumé ultra-punchy en 2 phrases",
  "idealAudience": "À qui s'adresse cette œuvre",
  "bingeWorthiness": "Note de 1 à 10 ou appréciation (ex: 9/10 - Addictif)",
  "pacing": "Rythme (ex: Frénétique, Contemplatif, Montée en puissance)",
  "verdict": "Verdict du critique CinéAI en 2 phrases"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const jsonOutput = JSON.parse(response.text || '{}');
    return res.json({ analysis: jsonOutput });
  } catch (error: any) {
    console.error('Error in quick analysis:', error);
    return res.status(500).json({ error: error.message || 'Erreur lors de l\'analyse AI.' });
  }
});

// API Route: AI Assistant Chat
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { messages = [], userContext = {} } = req.body;
    const ai = getGenAI();

    const systemInstruction = `Tu es CinéAI, l'assistant cinématographique et télévisuel ultime.
Tu es passionné, érudit, chaleureux et plein d'esprit.
Tu connais tous les films, séries, acteurs, réalisateurs, répliques cultes, bandes-son et anecdotes.
L'utilisateur s'adresse à toi en français.
Propose des réponses concises, structurées et agréables avec des émoticônes bien choisies.
Tu peux suggérer des œuvres spécifiques, donner ton avis sans spoiler, ou aider l'utilisateur à choisir quoi regarder ce soir.
Contexte utilisateur : Préfère les genres (${userContext.favoriteGenres?.join(', ') || 'Variables'}), ${userContext.totalWatched || 0} éléments suivis dans sa vidéothèque.`;

    // Format chat history
    const formattedPrompt = messages.map((m: any) => `${m.sender === 'user' ? 'Utilisateur' : 'CinéAI'}: ${m.text}`).join('\n\n');

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: formattedPrompt,
      config: {
        systemInstruction
      }
    });

    return res.json({ reply: response.text });
  } catch (error: any) {
    console.error('Error in AI Chat:', error);
    return res.status(500).json({ error: error.message || 'Erreur lors du chat AI.' });
  }
});

async function startServer() {
  // Vite middleware for development mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
