import React, { useState } from 'react';
import { RecommendationItem } from '../types';
import { GENRE_OPTIONS, MOOD_OPTIONS } from '../data/catalog';
import { fetchAIRecommendations } from '../services/api';
import { 
  Sparkles, Flame, Film, Tv, Check, Plus, Loader2, RefreshCw, 
  ThumbsUp, Compass
} from 'lucide-react';

interface RecommendationEngineProps {
  userHistory: any[];
  onAddMediaFromAI: (item: RecommendationItem) => void;
  savedMediaTitles: string[];
}

export const RecommendationEngine: React.FC<RecommendationEngineProps> = ({
  userHistory,
  onAddMediaFromAI,
  savedMediaTitles,
}) => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['Science-Fiction', 'Action']);
  const [selectedMood, setSelectedMood] = useState<string>('Épique');
  const [preferredType, setPreferredType] = useState<'movie' | 'series' | 'all'>('all');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addedTitles, setAddedTitles] = useState<Record<string, boolean>>({});

  const toggleGenre = (genre: string) => {
    if (genre === 'Tous les genres') {
      setSelectedGenres([]);
      return;
    }
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await fetchAIRecommendations(
        {
          favoriteGenres: selectedGenres,
          currentMood: selectedMood === 'Toutes les ambiances' ? '' : selectedMood,
          preferredType,
          customPrompt,
        },
        userHistory
      );
      setRecommendations(items);
    } catch (err: any) {
      setError(err.message || 'Impossible d\'obtenir les recommandations.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = (rec: RecommendationItem) => {
    onAddMediaFromAI(rec);
    setAddedTitles((prev) => ({ ...prev, [rec.title]: true }));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Hero Banner Header */}
      <div className="relative bg-zinc-900 border border-white/10 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Moteur d'Intelligence Artificielle CineAI</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Recommandations Personnalisées sur Mesure
          </h2>
          <p className="text-white/60 text-xs sm:text-sm mt-2 leading-relaxed">
            Grâce à l'analyse de vos goûts et de votre historique de visionnage, CineAI sélectionne les pépites de films et séries qui correspondent exactement à votre humeur du moment.
          </p>
        </div>
      </div>

      {/* Interactive Controls Form */}
      <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 space-y-6 shadow-xl">
        
        {/* Type Preference Selector */}
        <div>
          <label className="block text-xs uppercase font-bold text-white/40 tracking-wider mb-2">
            Type de contenu recherché
          </label>
          <div className="grid grid-cols-3 gap-2 max-w-md">
            <button
              onClick={() => setPreferredType('all')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-full text-xs font-bold transition-all ${
                preferredType === 'all'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-black/40 text-white/60 border border-white/10 hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Tout</span>
            </button>
            <button
              onClick={() => setPreferredType('movie')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-full text-xs font-bold transition-all ${
                preferredType === 'movie'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-black/40 text-white/60 border border-white/10 hover:text-white'
              }`}
            >
              <Film className="w-4 h-4 text-amber-400" />
              <span>Films seulement</span>
            </button>
            <button
              onClick={() => setPreferredType('series')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-full text-xs font-bold transition-all ${
                preferredType === 'series'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-black/40 text-white/60 border border-white/10 hover:text-white'
              }`}
            >
              <Tv className="w-4 h-4 text-sky-400" />
              <span>Séries seulement</span>
            </button>
          </div>
        </div>

        {/* Mood Selector */}
        <div>
          <label className="block text-xs uppercase font-bold text-white/40 tracking-wider mb-2 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-indigo-400" />
            <span>Quelle est votre humeur / mood actuel ?</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {MOOD_OPTIONS.map((mood) => {
              const isSelected = selectedMood === mood;
              return (
                <button
                  key={mood}
                  onClick={() => setSelectedMood(mood)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-black/40 text-white/70 border border-white/10 hover:border-white/20'
                  }`}
                >
                  {mood}
                </button>
              );
            })}
          </div>
        </div>

        {/* Genres Selector */}
        <div>
          <label className="block text-xs uppercase font-bold text-white/40 tracking-wider mb-2">
            Genres favoris
          </label>
          <div className="flex flex-wrap gap-2">
            {GENRE_OPTIONS.filter((g) => g !== 'Tous les genres').map((genre) => {
              const isSelected = selectedGenres.includes(genre);
              return (
                <button
                  key={genre}
                  onClick={() => toggleGenre(genre)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-black/40 text-white/50 border border-white/10 hover:text-white'
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Prompt Instruction */}
        <div>
          <label className="block text-xs uppercase font-bold text-white/40 tracking-wider mb-2">
            Consigne spécifique (Optionnelle)
          </label>
          <input
            type="text"
            placeholder="Ex: Un thriller psychologique britannique des années 2020 avec une fin bluffante..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="w-full bg-black/60 border border-white/10 rounded-2xl p-3.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm rounded-full shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>CineAI analyse les œuvres et calcule le match...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Générer mes recommandations IA</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-rose-950/50 border border-rose-500/50 text-rose-300 p-4 rounded-3xl text-xs">
          <p className="font-bold">Erreur de génération :</p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {/* Results Grid */}
      {recommendations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <ThumbsUp className="w-5 h-5 text-amber-400" />
              <span>Vos Recommandations Personnalisées ({recommendations.length})</span>
            </h3>

            <button
              onClick={handleGenerate}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 bg-zinc-900 px-4 py-2 rounded-full border border-white/10"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regénérer</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec, idx) => {
              const isAlreadyAdded = savedMediaTitles.includes(rec.title) || addedTitles[rec.title];

              return (
                <div
                  key={idx}
                  className="bg-zinc-900 border border-white/10 rounded-3xl p-6 shadow-xl hover:border-indigo-500/30 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div>
                    {/* Header: Title + Match Badge */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-1">
                          {rec.type === 'movie' ? <Film className="w-3 h-3 text-indigo-400" /> : <Tv className="w-3 h-3 text-indigo-400" />}
                          {rec.type === 'movie' ? 'Film' : 'Série'} • {rec.releaseYear}
                        </span>
                        <h4 className="font-bold text-base text-white group-hover:text-indigo-400 transition-colors">
                          {rec.title}
                        </h4>
                      </div>

                      <div className="bg-emerald-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-full shadow-md flex-shrink-0">
                        {rec.matchPercentage}% Match
                      </div>
                    </div>

                    {/* Genres */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {rec.genres.map((g) => (
                        <span key={g} className="text-[9px] font-bold bg-black/60 text-white/70 px-2.5 py-0.5 rounded-full border border-white/5">
                          {g}
                        </span>
                      ))}
                    </div>

                    {/* Synopsis */}
                    <p className="text-xs text-white/70 leading-relaxed line-clamp-3 bg-black/40 p-3.5 rounded-2xl border border-white/5">
                      {rec.synopsis}
                    </p>

                    {/* Why Recommended AI note */}
                    <div className="mt-3 p-3.5 bg-indigo-950/40 rounded-2xl border border-indigo-500/30">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-300 block mb-0.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        Pourquoi ce choix pour vous :
                      </span>
                      <p className="text-xs italic text-indigo-200/90">{rec.whyRecommended}</p>
                    </div>
                  </div>

                  {/* Add to my list button */}
                  <div className="pt-2 border-t border-white/5">
                    <button
                      onClick={() => handleAddClick(rec)}
                      disabled={isAlreadyAdded}
                      className={`w-full py-2.5 px-3 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                        isAlreadyAdded
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 cursor-default'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                      }`}
                    >
                      {isAlreadyAdded ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>Dans ma bibliothèque</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Ajouter à mon suivi</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
