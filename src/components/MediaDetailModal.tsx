import React, { useState } from 'react';
import { MediaItem, UserProgress, WatchStatus } from '../types';
import { EpisodeTracker } from './EpisodeTracker';
import { fetchQuickAIAnalysis } from '../services/api';
import { 
  X, Star, Heart, Clock, Film, Tv, Sparkles, CheckCircle2, 
  Save, Clapperboard, Flame, Loader2, ShoppingCart, MessageCircle, Mail, Edit3
} from 'lucide-react';

interface MediaDetailModalProps {
  media: MediaItem | null;
  userProgress?: UserProgress;
  onClose: () => void;
  onUpdateProgress: (mediaId: string, updates: Partial<UserProgress>) => void;
  onToggleFavorite: (mediaId: string) => void;
  onToggleEpisode: (mediaId: string, episodeKey: string, isWatched: boolean) => void;
  onMarkSeasonWatched: (mediaId: string, seasonNumber: number, allKeys: string[], isWatched: boolean) => void;
  onOrderMedia?: (media: MediaItem) => void;
  onEditMedia?: (media: MediaItem) => void;
  isAdmin?: boolean;
}

export const MediaDetailModal: React.FC<MediaDetailModalProps> = ({
  media,
  userProgress,
  onClose,
  onUpdateProgress,
  onToggleFavorite,
  onToggleEpisode,
  onMarkSeasonWatched,
  onOrderMedia,
  onEditMedia,
  isAdmin = false,
}) => {
  if (!media) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'episodes' | 'trailer'>('overview');
  const [userRating, setUserRating] = useState<number>(userProgress?.userRating || 0);
  const [userReview, setUserReview] = useState<string>(userProgress?.userReview || '');
  const [isSaved, setIsSaved] = useState(false);

  // AI Quick Analysis state
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const isFavorite = userProgress?.favorite || false;
  const status = userProgress?.status;

  const handleSaveUserReview = () => {
    onUpdateProgress(media.id, {
      userRating,
      userReview,
      lastWatchedDate: new Date().toISOString(),
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleRunAiAnalysis = async () => {
    setLoadingAi(true);
    setAiError(null);
    try {
      const data = await fetchQuickAIAnalysis(media.title, media.type);
      setAiAnalysis(data);
    } catch (err: any) {
      setAiError(err.message || 'Erreur d\'analyse AI');
    } finally {
      setLoadingAi(false);
    }
  };

  const handleDirectWhatsApp = () => {
    const text = encodeURIComponent(`Bonjour DIEUME CINEMA, Je souhaite commander : ${media.title} (${media.releaseYear})`);
    window.open(`https://wa.me/243972252806?text=${text}`, '_blank');
  };

  const handleDirectEmail = () => {
    const subject = encodeURIComponent(`Commande DIEUME CINEMA : ${media.title}`);
    const body = encodeURIComponent(`Bonjour DIEUME CINEMA,\n\nJe souhaite commander :\nTitre : ${media.title}\nAnnée : ${media.releaseYear}\n\nMerci !`);
    window.open(`mailto:rusakidieumerci1@gmail.com?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 text-white/70 hover:text-white border border-white/10 transition-all shadow-lg"
          title="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Backdrop Header */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-black flex-shrink-0">
          <img
            src={media.backdrop || media.poster}
            alt={media.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-transparent" />
          
          {/* Overlay Content */}
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 flex flex-col sm:flex-row items-end gap-4">
            <img
              src={media.poster}
              alt={media.title}
              className="w-24 sm:w-36 aspect-[2/3] object-cover rounded-2xl border-2 border-white/10 shadow-2xl hidden xs:block flex-shrink-0"
            />

            <div className="flex-grow text-white">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-3 py-0.5 bg-indigo-600 text-white font-bold text-xs rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
                  {media.type === 'movie' ? <Film className="w-3 h-3" /> : <Tv className="w-3 h-3" />}
                  {media.type === 'movie' ? 'Film' : 'Série'}
                </span>
                <span className="text-xs font-semibold text-white/80 bg-black/60 px-3 py-0.5 rounded-full border border-white/10">
                  {media.releaseYear}
                </span>
                <span className="text-xs font-semibold text-white/80 bg-black/60 px-3 py-0.5 rounded-full border border-white/10 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-indigo-400" />
                  {media.type === 'movie' ? `${media.runtime || 120} min` : `${media.totalSeasons || 1} saison(s)`}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight line-clamp-1">
                {media.title}
              </h2>
              {media.originalTitle && media.originalTitle !== media.title && (
                <p className="text-xs text-white/50 italic">Titre original : {media.originalTitle}</p>
              )}

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2">
                <div className="flex items-center gap-1.5 bg-black/80 px-3 py-1 rounded-full border border-white/10 text-amber-300 font-bold text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{media.rating.toFixed(1)}/10</span>
                </div>

                <button
                  onClick={() => onToggleFavorite(media.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold transition-all border ${
                    isFavorite
                      ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/30'
                      : 'bg-black/60 text-white/80 hover:text-white border-white/10'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
                  <span>{isFavorite ? 'Favori' : 'Ajouter aux favoris'}</span>
                </button>

                {isAdmin && onEditMedia && (
                  <button
                    onClick={() => onEditMedia(media)}
                    className="flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/30 transition-all border border-amber-400/40"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Modifier (Admin)</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order Bar Banner inside Modal */}
        <div className="bg-emerald-950/60 border-y border-emerald-500/30 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-emerald-200 text-xs">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="font-semibold">Commander cette œuvre sur DIEUME CINEMA :</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleDirectWhatsApp}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-full shadow-md shadow-emerald-600/30 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handleDirectEmail}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-full shadow-md shadow-indigo-600/30 transition-all"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-white/10 bg-zinc-900 flex-shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Aperçu & Avis
          </button>

          {media.type === 'series' && (
            <button
              onClick={() => setActiveTab('episodes')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'episodes'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Épisodes ({media.totalEpisodes || 'Détails'})
            </button>
          )}

          {media.trailerUrl && (
            <button
              onClick={() => setActiveTab('trailer')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'trailer'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Bande-Annonce
            </button>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-grow custom-scrollbar">
          
          {activeTab === 'overview' && (
            <>
              {/* Synopsis & Meta */}
              <div>
                <h3 className="text-xs uppercase font-bold text-indigo-400 tracking-wider mb-2">Synopsis & Description</h3>
                <p className="text-sm text-white/80 leading-relaxed bg-black/40 p-4 rounded-2xl border border-white/5 whitespace-pre-line">
                  {media.overview}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {media.director && (
                    <div className="bg-black/40 p-3.5 rounded-2xl border border-white/5">
                      <span className="text-xs text-white/40 block font-medium">Réalisation</span>
                      <span className="text-sm font-bold text-white">{media.director}</span>
                    </div>
                  )}
                  {media.creator && (
                    <div className="bg-black/40 p-3.5 rounded-2xl border border-white/5">
                      <span className="text-xs text-white/40 block font-medium">Création</span>
                      <span className="text-sm font-bold text-white">{media.creator}</span>
                    </div>
                  )}
                  {media.cast && media.cast.length > 0 && (
                    <div className="bg-black/40 p-3.5 rounded-2xl border border-white/5 sm:col-span-2">
                      <span className="text-xs text-white/40 block font-medium">Distribution</span>
                      <span className="text-sm font-semibold text-white/90">{media.cast.join(', ')}</span>
                    </div>
                  )}
                </div>

                {/* Genres & Moods */}
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <span className="text-xs text-white/40 font-bold mr-1">Genres :</span>
                  {media.genres.map((g) => (
                    <span key={g} className="text-xs font-semibold bg-black/60 text-white/80 px-3 py-1 rounded-full border border-white/10">
                      {g}
                    </span>
                  ))}
                  {media.moods && media.moods.map((m) => (
                    <span key={m} className="text-xs font-semibold bg-indigo-950/60 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-indigo-400" />
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Status & User Progress Controls */}
              <div className="bg-black/60 p-5 rounded-3xl border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clapperboard className="w-4 h-4 text-indigo-400" />
                  <span>Mon Suivi Personnel</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Status Dropdown */}
                  <div>
                    <label className="block text-xs text-white/60 font-semibold mb-1">Statut de visionnage</label>
                    <select
                      value={status || 'plan_to_watch'}
                      onChange={(e) => onUpdateProgress(media.id, { status: e.target.value as WatchStatus })}
                      className="w-full bg-zinc-900 border border-white/10 text-white text-xs font-bold rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="plan_to_watch">À voir (Dans ma liste)</option>
                      <option value="watching">En cours de visionnage</option>
                      <option value="completed">Terminé</option>
                      <option value="on_hold">En pause</option>
                      <option value="dropped">Abandonné</option>
                    </select>
                  </div>

                  {/* Rating Selector */}
                  <div>
                    <label className="block text-xs text-white/60 font-semibold mb-1">Ma note attribuée ({userRating}/10)</label>
                    <div className="flex items-center gap-1 bg-zinc-900 p-2 rounded-xl border border-white/10 overflow-x-auto">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setUserRating(star)}
                          className={`p-1 text-xs font-bold rounded transition-colors ${
                            star <= userRating ? 'text-amber-400' : 'text-white/20 hover:text-white/40'
                          }`}
                        >
                          <Star className={`w-4 h-4 ${star <= userRating ? 'fill-current' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Personal Review textarea */}
                <div>
                  <label className="block text-xs text-white/60 font-semibold mb-1">Critique / Notes personnelles</label>
                  <textarea
                    rows={3}
                    placeholder="Écrivez vos impressions, votre scène préférée ou votre avis sur ce titre..."
                    value={userReview}
                    onChange={(e) => setUserReview(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={handleSaveUserReview}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-full shadow-lg shadow-indigo-600/30 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Enregistrer mes notes</span>
                  </button>

                  {isSaved && (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 animate-fade-in">
                      <CheckCircle2 className="w-4 h-4" />
                      Enregistré avec succès !
                    </span>
                  )}
                </div>
              </div>

              {/* AI Quick Analysis Section */}
              <div className="bg-zinc-900 p-5 rounded-3xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Analyse Express CineAI</h4>
                      <p className="text-[11px] text-white/40">Obtenez un avis sans spoiler généré par l'IA Gemini</p>
                    </div>
                  </div>

                  {!aiAnalysis && (
                    <button
                      onClick={handleRunAiAnalysis}
                      disabled={loadingAi}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-full shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
                    >
                      {loadingAi ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Analyse en cours...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          <span>Analyser l'œuvre</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {aiError && (
                  <p className="text-xs text-rose-400 bg-rose-950/40 p-3 rounded-2xl border border-rose-500/30">{aiError}</p>
                )}

                {aiAnalysis && (
                  <div className="mt-3 space-y-3 bg-black/60 p-4 rounded-2xl border border-white/10 text-white/90 animate-fade-in">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">En résumé :</span>
                      <p className="text-xs text-white/80 mt-0.5">{aiAnalysis.summary}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div className="bg-zinc-900 p-3 rounded-xl border border-white/5">
                        <span className="text-white/40 block text-[10px] font-medium">Public Cible :</span>
                        <span className="font-semibold text-indigo-300">{aiAnalysis.idealAudience}</span>
                      </div>
                      <div className="bg-zinc-900 p-3 rounded-xl border border-white/5">
                        <span className="text-white/40 block text-[10px] font-medium">Potentiel Addictif :</span>
                        <span className="font-semibold text-amber-300">{aiAnalysis.bingeWorthiness}</span>
                      </div>
                      <div className="bg-zinc-900 p-3 rounded-xl border border-white/5">
                        <span className="text-white/40 block text-[10px] font-medium">Rythme :</span>
                        <span className="font-semibold text-sky-300">{aiAnalysis.pacing}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Verdict CineAI :</span>
                      <p className="text-xs italic text-white/90 mt-0.5">"{aiAnalysis.verdict}"</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'episodes' && media.type === 'series' && (
            <EpisodeTracker
              media={media}
              userProgress={userProgress || { mediaId: media.id, status: 'watching', favorite: false, rewatchCount: 0 }}
              onToggleEpisode={onToggleEpisode}
              onMarkSeasonWatched={onMarkSeasonWatched}
            />
          )}

          {activeTab === 'trailer' && media.trailerUrl && (
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl">
              <iframe
                src={media.trailerUrl}
                title={`Bande-annonce ${media.title}`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
