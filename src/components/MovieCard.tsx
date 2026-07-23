import React from 'react';
import { MediaItem, UserProgress, WatchStatus } from '../types';
import { Star, Heart, CheckCircle2, PlayCircle, Clock, Tv, Film, ShoppingCart, Edit3, Trash2 } from 'lucide-react';

interface MovieCardProps {
  media: MediaItem;
  userProgress?: UserProgress;
  onSelect: (media: MediaItem) => void;
  onToggleFavorite: (mediaId: string, e: React.MouseEvent) => void;
  onChangeStatus: (mediaId: string, status: WatchStatus, e: React.ChangeEvent<HTMLSelectElement>) => void;
  onOrder?: (media: MediaItem, e: React.MouseEvent) => void;
  onEdit?: (media: MediaItem, e: React.MouseEvent) => void;
  onDelete?: (mediaId: string, e: React.MouseEvent) => void;
  isAdmin?: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  media,
  userProgress,
  onSelect,
  onToggleFavorite,
  onChangeStatus,
  onOrder,
  onEdit,
  onDelete,
  isAdmin = false,
}) => {
  const isFavorite = userProgress?.favorite || false;
  const status = userProgress?.status;

  // Calculate watched episodes percentage for series
  let watchedCount = 0;
  let totalEpisodes = media.totalEpisodes || 0;
  if (media.type === 'series' && userProgress?.watchedEpisodes) {
    watchedCount = Object.values(userProgress.watchedEpisodes).filter(Boolean).length;
    if (totalEpisodes === 0 && media.seasonsData) {
      totalEpisodes = media.seasonsData.reduce((sum, s) => sum + s.episodeCount, 0);
    }
  }
  const progressPercent = totalEpisodes > 0 ? Math.min(100, Math.round((watchedCount / totalEpisodes) * 100)) : 0;

  const getStatusBadge = (st?: WatchStatus) => {
    switch (st) {
      case 'watching':
        return <span className="bg-indigo-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md flex items-center gap-1 border border-indigo-400/40"><PlayCircle className="w-3 h-3" /> En cours</span>;
      case 'completed':
        return <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md flex items-center gap-1 border border-emerald-400/40"><CheckCircle2 className="w-3 h-3" /> Terminé</span>;
      case 'plan_to_watch':
        return <span className="bg-amber-500/90 text-black text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md flex items-center gap-1 border border-amber-400/40"><Clock className="w-3 h-3" /> À voir</span>;
      case 'on_hold':
        return <span className="bg-purple-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md">En pause</span>;
      case 'dropped':
        return <span className="bg-rose-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md">Abandonné</span>;
      default:
        return null;
    }
  };

  return (
    <div 
      id={`media-card-${media.id}`}
      onClick={() => onSelect(media)}
      className="group relative bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-indigo-500/30 transition-all duration-300 cursor-pointer flex flex-col h-full transform hover:-translate-y-1.5"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-950">
        <img
          src={media.poster}
          alt={media.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top Badges overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1 z-10">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="bg-black/60 text-white/90 text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-md flex items-center gap-1">
              {media.type === 'movie' ? <Film className="w-2.5 h-2.5 text-indigo-400" /> : <Tv className="w-2.5 h-2.5 text-indigo-400" />}
              {media.type === 'movie' ? 'Film' : 'Série'}
            </span>
            {status && getStatusBadge(status)}
          </div>

          <div className="flex items-center gap-1">
            {isAdmin && (
              <>
                {onEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(media, e);
                    }}
                    className="p-1.5 rounded-full bg-amber-600/90 text-white backdrop-blur-md hover:bg-amber-500 transition-colors shadow-md"
                    title="Modifier l'œuvre (Admin)"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(media.id, e);
                    }}
                    className="p-1.5 rounded-full bg-rose-600/90 text-white backdrop-blur-md hover:bg-rose-500 transition-colors shadow-md"
                    title="Supprimer (Admin)"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </>
            )}

            <button
              onClick={(e) => onToggleFavorite(media.id, e)}
              className={`p-2 rounded-full backdrop-blur-md transition-all ${
                isFavorite 
                  ? 'bg-rose-600/90 text-white shadow-md shadow-rose-600/40 scale-105' 
                  : 'bg-black/40 text-white/60 hover:text-rose-400 hover:bg-black/60'
              }`}
              title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current text-white' : ''}`} />
            </button>
          </div>
        </div>

        {/* Rating Badge Bottom Right of Poster */}
        <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md border border-white/10 text-amber-300 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{media.rating.toFixed(1)}</span>
        </div>

        {/* User rating if rated */}
        {userProgress?.userRating !== undefined && userProgress.userRating > 0 && (
          <div className="absolute bottom-3 left-3 bg-indigo-950/90 backdrop-blur-md border border-indigo-500/50 text-indigo-300 px-2.5 py-1 rounded-full text-[10px] font-bold">
            <span>Avis: {userProgress.userRating}/10</span>
          </div>
        )}
      </div>

      {/* Series Progress Bar */}
      {media.type === 'series' && totalEpisodes > 0 && (
        <div className="w-full bg-black h-1.5 relative">
          <div 
            className="h-full bg-indigo-500 transition-all duration-300" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Media Details Footer */}
      <div className="p-4 flex flex-col justify-between flex-grow gap-2.5 bg-zinc-900">
        <div>
          <div className="flex items-center justify-between gap-1 text-[11px] text-white/40 font-medium mb-1">
            <span>{media.releaseYear}</span>
            <span>
              {media.type === 'movie' 
                ? `${media.runtime || 120} min` 
                : `${media.totalSeasons || 1} saison${(media.totalSeasons || 1) > 1 ? 's' : ''}`
              }
            </span>
          </div>
          
          <h3 className="font-bold text-sm text-white line-clamp-1 group-hover:text-indigo-400 transition-colors">
            {media.title}
          </h3>

          <p className="text-white/50 text-xs line-clamp-2 mt-1 leading-relaxed">
            {media.overview}
          </p>
        </div>

        {/* Quick Order & Follow Actions */}
        <div className="pt-2.5 border-t border-white/5 flex items-center justify-between gap-2 mt-auto">
          {onOrder && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOrder(media, e);
              }}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[10px] rounded-xl flex items-center gap-1 shadow-md shadow-emerald-600/20 active:scale-95 transition-all uppercase tracking-wider"
              title="Commander par WhatsApp ou Email"
            >
              <ShoppingCart className="w-3 h-3" />
              <span>Commander</span>
            </button>
          )}

          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <select
              value={status || ''}
              onChange={(e) => onChangeStatus(media.id, e.target.value as WatchStatus, e)}
              className="bg-black/60 border border-white/10 text-white/80 text-[10px] font-bold rounded-xl px-2 py-1 focus:outline-none focus:border-indigo-500 cursor-pointer transition-colors"
            >
              <option value="">+ Suivre</option>
              <option value="plan_to_watch">À voir</option>
              <option value="watching">En cours</option>
              <option value="completed">Terminé</option>
              <option value="on_hold">En pause</option>
              <option value="dropped">Abandonné</option>
            </select>
          </div>
        </div>

      </div>
    </div>
  );
};
