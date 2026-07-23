import React, { useState } from 'react';
import { MediaItem, UserProgress } from '../types';
import { Trophy, Film, Tv, Star, ShoppingCart, Eye, Edit3, Flame, Award, Sparkles } from 'lucide-react';

interface TopRankingsProps {
  catalog: MediaItem[];
  userProgresses: Record<string, UserProgress>;
  onSelectMedia: (media: MediaItem) => void;
  onOrderMedia: (media: MediaItem) => void;
  onEditMedia?: (media: MediaItem) => void;
  isAdmin?: boolean;
}

export const TopRankings: React.FC<TopRankingsProps> = ({
  catalog,
  userProgresses,
  onSelectMedia,
  onOrderMedia,
  onEditMedia,
  isAdmin = false,
}) => {
  const [subTab, setSubTab] = useState<'top_movies' | 'top_series' | 'all'>('top_movies');

  // Filter based on tab
  const filteredItems = catalog.filter((item) => {
    if (subTab === 'top_movies') return item.type === 'movie';
    if (subTab === 'top_series') return item.type === 'series';
    return true;
  });

  // Sort descending by rating
  const sortedItems = [...filteredItems].sort((a, b) => b.rating - a.rating);

  const getRankBadge = (index: number) => {
    if (index === 0) {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-black font-extrabold text-xs rounded-full shadow-lg shadow-amber-500/30">
          <Trophy className="w-4 h-4 fill-current text-black" />
          <span>#1 N°1 Incontournable</span>
        </span>
      );
    }
    if (index === 1) {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 bg-zinc-300 text-black font-extrabold text-xs rounded-full shadow-md">
          <Award className="w-4 h-4 text-black" />
          <span>#2 Médaille d'Argent</span>
        </span>
      );
    }
    if (index === 2) {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-700 text-white font-extrabold text-xs rounded-full shadow-md">
          <Award className="w-4 h-4 text-amber-300" />
          <span>#3 Médaille de Bronze</span>
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-black/60 text-white/80 border border-white/10 font-bold text-xs rounded-full">
        #{index + 1}
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Section Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-zinc-900 to-zinc-900 border border-white/10 p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold text-xs mb-3">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Classements Officiels DIEUME CINEMA</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
              Le Top des Films & Séries
            </h1>
            <p className="text-xs sm:text-sm text-white/60 mt-1.5 max-w-2xl leading-relaxed">
              Découvrez les chefs-d'œuvre et séries incontournables les mieux notés. Sélectionnez votre titre et commandez en un clic par WhatsApp ou Mail !
            </p>
          </div>

          {/* Sub Navigation Pills */}
          <div className="flex items-center gap-2 bg-black/60 p-1.5 rounded-full border border-white/10 self-start md:self-auto">
            <button
              onClick={() => setSubTab('top_movies')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs transition-all ${
                subTab === 'top_movies'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Film className="w-4 h-4 text-amber-400" />
              <span>Top Films</span>
            </button>

            <button
              onClick={() => setSubTab('top_series')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs transition-all ${
                subTab === 'top_series'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Tv className="w-4 h-4 text-sky-400" />
              <span>Top Séries</span>
            </button>

            <button
              onClick={() => setSubTab('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs transition-all ${
                subTab === 'all'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-indigo-300" />
              <span>Tout le Top</span>
            </button>
          </div>
        </div>
      </div>

      {/* Ranked Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedItems.map((media, index) => (
          <div
            key={media.id}
            className={`group bg-zinc-900 border rounded-3xl p-5 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
              index === 0
                ? 'border-amber-500/50 bg-gradient-to-b from-amber-950/20 to-zinc-900'
                : index === 1
                ? 'border-zinc-400/30'
                : index === 2
                ? 'border-amber-700/30'
                : 'border-white/10'
            }`}
          >
            {/* Top Rank Header */}
            <div className="flex items-center justify-between gap-2 mb-3 z-10">
              {getRankBadge(index)}

              <div className="flex items-center gap-1.5 bg-black/80 px-2.5 py-1 rounded-full border border-white/10 text-amber-300 font-extrabold text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{media.rating.toFixed(1)}/10</span>
              </div>
            </div>

            {/* Poster & Overview Layout */}
            <div className="flex gap-4 my-2">
              <div 
                onClick={() => onSelectMedia(media)}
                className="relative w-28 h-40 rounded-2xl overflow-hidden border border-white/10 shadow-lg cursor-pointer flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={media.poster}
                  alt={media.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors" />
              </div>

              <div className="flex flex-col justify-between flex-grow overflow-hidden">
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/50 mb-1">
                    <span className="uppercase tracking-wider">{media.type === 'movie' ? 'Film' : 'Série'}</span>
                    <span>•</span>
                    <span>{media.releaseYear}</span>
                  </div>

                  <h3 
                    onClick={() => onSelectMedia(media)}
                    className="font-extrabold text-base text-white line-clamp-1 cursor-pointer hover:text-indigo-400 transition-colors"
                  >
                    {media.title}
                  </h3>

                  <p className="text-xs text-white/60 line-clamp-3 mt-1 leading-relaxed">
                    {media.overview}
                  </p>
                </div>

                {/* Genre badges */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {media.genres.slice(0, 2).map((g) => (
                    <span key={g} className="text-[9px] font-bold bg-white/5 text-white/70 px-2 py-0.5 rounded-md border border-white/5">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 mt-2 border-t border-white/10 flex items-center justify-between gap-2 z-10">
              <button
                onClick={() => onOrderMedia(media)}
                className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Commander</span>
              </button>

              <button
                onClick={() => onSelectMedia(media)}
                className="p-2.5 bg-black/60 hover:bg-black/80 text-white/80 hover:text-white border border-white/10 rounded-xl transition-all"
                title="Aperçu & Détails"
              >
                <Eye className="w-4 h-4" />
              </button>

              {isAdmin && onEditMedia && (
                <button
                  onClick={() => onEditMedia(media)}
                  className="p-2.5 bg-amber-600/80 hover:bg-amber-500 text-white border border-amber-500/40 rounded-xl transition-all"
                  title="Modifier l'œuvre (Admin)"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
