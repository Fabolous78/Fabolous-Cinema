import React from 'react';
import { WatchStatus } from '../types';
import { GENRE_OPTIONS, MOOD_OPTIONS } from '../data/catalog';
import { Filter, ArrowUpDown, Heart, CheckCircle2, PlayCircle, Clock } from 'lucide-react';

interface FilterBarProps {
  selectedStatus: WatchStatus | 'all' | 'favorites';
  setSelectedStatus: (status: WatchStatus | 'all' | 'favorites') => void;
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  selectedMood: string;
  setSelectedMood: (mood: string) => void;
  sortBy: 'rating' | 'year' | 'title';
  setSortBy: (sort: 'rating' | 'year' | 'title') => void;
  activeType: 'movie' | 'series' | 'all';
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedStatus,
  setSelectedStatus,
  selectedGenre,
  setSelectedGenre,
  selectedMood,
  setSelectedMood,
  sortBy,
  setSortBy,
  activeType,
}) => {
  return (
    <div className="bg-zinc-900 border border-white/5 rounded-3xl p-5 shadow-xl space-y-4">
      
      {/* Top row: Status filter chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[11px] font-bold text-white/40 uppercase mr-1 flex items-center gap-1.5 flex-shrink-0">
          <Filter className="w-3.5 h-3.5 text-indigo-400" />
          <span>Statut :</span>
        </span>

        <button
          onClick={() => setSelectedStatus('all')}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            selectedStatus === 'all'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-black/40 text-white/70 border border-white/10 hover:text-white hover:bg-white/5'
          }`}
        >
          Tous les titres
        </button>

        <button
          onClick={() => setSelectedStatus('watching')}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            selectedStatus === 'watching'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-black/40 text-indigo-300 border border-white/10 hover:bg-white/5'
          }`}
        >
          <PlayCircle className="w-3.5 h-3.5" />
          <span>En cours</span>
        </button>

        <button
          onClick={() => setSelectedStatus('plan_to_watch')}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            selectedStatus === 'plan_to_watch'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-black/40 text-amber-300 border border-white/10 hover:bg-white/5'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>À voir</span>
        </button>

        <button
          onClick={() => setSelectedStatus('completed')}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            selectedStatus === 'completed'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'bg-black/40 text-emerald-400 border border-white/10 hover:bg-white/5'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Terminés</span>
        </button>

        <button
          onClick={() => setSelectedStatus('favorites')}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            selectedStatus === 'favorites'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
              : 'bg-black/40 text-rose-400 border border-white/10 hover:bg-white/5'
          }`}
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>Favoris</span>
        </button>
      </div>

      {/* Bottom row: Genre, Mood and Sort dropdowns */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5 border-t border-white/5">
        
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Genre select */}
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="bg-black/60 border border-white/10 text-white/80 text-xs font-bold rounded-full px-4 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            {GENRE_OPTIONS.map((g) => (
              <option key={g} value={g} className="bg-zinc-900 text-white">{g}</option>
            ))}
          </select>

          {/* Mood select */}
          <select
            value={selectedMood}
            onChange={(e) => setSelectedMood(e.target.value)}
            className="bg-black/60 border border-white/10 text-white/80 text-xs font-bold rounded-full px-4 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            {MOOD_OPTIONS.map((m) => (
              <option key={m} value={m} className="bg-zinc-900 text-white">{m}</option>
            ))}
          </select>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40 font-semibold flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" />
            Trier :
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'rating' | 'year' | 'title')}
            className="bg-black/60 border border-white/10 text-white/80 text-xs font-bold rounded-full px-4 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="rating" className="bg-zinc-900 text-white">⭐ Note Globale</option>
            <option value="year" className="bg-zinc-900 text-white">📅 Année de sortie</option>
            <option value="title" className="bg-zinc-900 text-white">🔤 Titre (A-Z)</option>
          </select>
        </div>

      </div>

    </div>
  );
};
