import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { sendAIChatMessage } from '../services/api';
import { Send, Sparkles, Bot, User, Loader2 } from 'lucide-react';

interface AIChatAssistantProps {
  userContext: any;
}

export const AIChatAssistant: React.FC<AIChatAssistantProps> = ({ userContext }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: 'Bonjour ! Bienvenue sur DIEUME CINEMA 🎬. Je suis votre assistant cinématographique personnel. Posez-moi des questions sur vos films ou séries préférés, demandez-moi des conseils de visionnage pour ce soir, ou découvrez des pépites méconnues !',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const historyForApi = [...messages, userMsg].map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const reply = await sendAIChatMessage(historyForApi, userContext);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'ai',
          text: 'Désolé, une erreur est survenue lors du traitement de votre demande. Veuillez réessayer.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const QUICK_PROMPTS = [
    '🎬 Quel film regarder ce soir en couple pour se détendre ?',
    '📺 Propose 3 séries de science-fiction courtes et captivantes.',
    '🍿 Quels sont les meilleurs films avec Cillian Murphy ?',
    '✨ Explique-moi la fin d\'Inception sans jargon.',
  ];

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[78vh] animate-fade-in">
      
      {/* Header */}
      <div className="p-5 bg-black/60 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <span>CineAI Assistant</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </h3>
            <p className="text-white/40 text-xs">Expert Cinéma & Séries prêt à vous conseiller</p>
          </div>
        </div>

        <div className="hidden sm:block text-xs font-bold text-white/60 bg-white/5 px-3.5 py-1.5 rounded-full border border-white/10">
          Gemini 3.6 Flash
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-grow p-4 sm:p-6 overflow-y-auto space-y-4 bg-black/20 custom-scrollbar">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-md ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-zinc-800 text-indigo-400 border border-white/10'
              }`}
            >
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-indigo-400" />}
            </div>

            <div
              className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg'
                  : 'bg-zinc-800/90 text-white/90 border border-white/10 rounded-tl-none shadow-md'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.text}</div>
              <span className={`text-[10px] block mt-2 ${m.sender === 'user' ? 'text-indigo-200 text-right' : 'text-white/40'}`}>
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-white/60 text-xs bg-zinc-800/80 p-3.5 rounded-2xl w-fit border border-white/10">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
            <span>CineAI réfléchit à la meilleure recommandation...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-3 bg-black/40 border-t border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-bold text-white/40 uppercase flex-shrink-0">Suggestions :</span>
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="text-[11px] font-medium bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors flex-shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 bg-black/60 border-t border-white/10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Posez une question à CineAI..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow bg-white/5 border border-white/10 rounded-full px-5 py-3 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-indigo-500 transition-colors"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-3.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30 active:scale-95 transition-all disabled:opacity-40"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>
      </div>

    </div>
  );
};
