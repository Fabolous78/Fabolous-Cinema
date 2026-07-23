import React, { useState } from 'react';
import { MediaItem, UserProgress } from '../types';
import { CheckSquare, Square, CheckCircle2, Clock, Calendar, Sparkles } from 'lucide-react';

interface EpisodeTrackerProps {
  media: MediaItem;
  userProgress: UserProgress;
  onToggleEpisode: (mediaId: string, episodeKey: string, isWatched: boolean) => void;
  onMarkSeasonWatched: (mediaId: string, seasonNumber: number, allKeys: string[], isWatched: boolean) => void;
}

export const EpisodeTracker: React.FC<EpisodeTrackerProps> = ({
  media,
  userProgress,
  onToggleEpisode,
  onMarkSeasonWatched,
}) => {
  const [selectedSeasonNum, setSelectedSeasonNum] = useState<number>(1);

  if (!media.seasonsData || media.seasonsData.length === 0) {
    return (
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center text-slate-400">
        <p>Les épisodes détaillés de cette série ne sont pas encore répertoriés.</p>
        <p className="text-xs text-slate-500 mt-1">Vous pouvez marquer la série globale comme "En cours" ou "Terminé".</p>
      </div>
    );
  }

  const currentSeason = media.seasonsData.find((s) => s.seasonNumber === selectedSeasonNum) || media.seasonsData[0];
  const watchedEpisodes = userProgress?.watchedEpisodes || {};

  // Check how many episodes in current season are watched
  const currentSeasonKeys = currentSeason.episodes.map((e) => `s${currentSeason.seasonNumber}e${e.episodeNumber}`);
  const watchedSeasonCount = currentSeasonKeys.filter((key) => watchedEpisodes[key]).length;
  const isSeasonFullyWatched = watchedSeasonCount === currentSeason.episodes.length && currentSeason.episodes.length > 0;

  // Calculate total time watched for this series
  let totalMinutesWatched = 0;
  media.seasonsData.forEach((s) => {
    s.episodes.forEach((e) => {
      const key = `s${s.seasonNumber}e${e.episodeNumber}`;
      if (watchedEpisodes[key]) {
        totalMinutesWatched += e.durationMinutes || 45;
      }
    });
  });

  const hoursWatched = Math.floor(totalMinutesWatched / 60);
  const minutesWatched = totalMinutesWatched % 60;

  return (
    <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-4 sm:p-6 text-slate-200">
      
      {/* Header & Total Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
            <span>Suivi des Épisodes</span>
            <span className="text-xs bg-sky-500/20 text-sky-300 font-bold px-2 py-0.5 rounded-full border border-sky-500/30">
              {media.totalSeasons || media.seasonsData.length} Saisons
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Cochez les épisodes au fur et à mesure de votre visionnage.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          <Clock className="w-4 h-4 text-amber-400" />
          <div className="text-xs">
            <span className="text-slate-400">Temps visionné : </span>
            <span className="font-bold text-amber-300">{hoursWatched}h {minutesWatched}m</span>
          </div>
        </div>
      </div>

      {/* Season Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto my-4 pb-2 no-scrollbar">
        {media.seasonsData.map((s) => {
          const seasonKeys = s.episodes.map((e) => `s${s.seasonNumber}e${e.episodeNumber}`);
          const count = seasonKeys.filter((k) => watchedEpisodes[k]).length;
          const isDone = count === s.episodeCount && s.episodeCount > 0;

          return (
            <button
              key={s.seasonNumber}
              onClick={() => setSelectedSeasonNum(s.seasonNumber)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedSeasonNum === s.seasonNumber
                  ? 'bg-gradient-to-r from-sky-600 to-amber-600 text-white shadow-md shadow-sky-900/30'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-850 hover:text-white border border-slate-800'
              }`}
            >
              <span>{s.name}</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                isDone ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
              }`}>
                {count}/{s.episodeCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Current Season Summary & Bulk Action */}
      <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800/80 flex items-center justify-between gap-3 mb-4">
        <div>
          <h4 className="font-bold text-sm text-slate-200">{currentSeason.name}</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            {watchedSeasonCount} sur {currentSeason.episodeCount} épisodes vus ({Math.round((watchedSeasonCount / currentSeason.episodeCount) * 100)}%)
          </p>
        </div>

        <button
          onClick={() => onMarkSeasonWatched(media.id, currentSeason.seasonNumber, currentSeasonKeys, !isSeasonFullyWatched)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            isSeasonFullyWatched
              ? 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/30'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{isSeasonFullyWatched ? 'Décocher la saison' : 'Tout marquer vu'}</span>
        </button>
      </div>

      {/* Episode Checklist */}
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
        {currentSeason.episodes.map((ep) => {
          const episodeKey = `s${currentSeason.seasonNumber}e${ep.episodeNumber}`;
          const isWatched = !!watchedEpisodes[episodeKey];

          return (
            <div
              key={ep.episodeNumber}
              onClick={() => onToggleEpisode(media.id, episodeKey, !isWatched)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                isWatched
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200'
                  : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700 text-slate-300'
              }`}
            >
              <button className="mt-0.5 flex-shrink-0">
                {isWatched ? (
                  <CheckSquare className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                ) : (
                  <Square className="w-5 h-5 text-slate-500 hover:text-slate-300" />
                )}
              </button>

              <div className="flex-grow">
                <div className="flex items-center justify-between gap-2">
                  <span className={`font-bold text-xs ${isWatched ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                    Épisode {ep.episodeNumber} : {ep.title}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    <Clock className="w-3 h-3 text-amber-400" />
                    {ep.durationMinutes || 45} min
                  </span>
                </div>

                {ep.overview && (
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {ep.overview}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
