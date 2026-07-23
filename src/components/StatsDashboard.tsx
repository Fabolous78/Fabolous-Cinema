import React from 'react';
import { MediaItem, UserProgress } from '../types';
import { 
  BarChart3, Clock, Film, Tv, Award, Star, Download, Upload, 
  PieChart
} from 'lucide-react';

interface StatsDashboardProps {
  catalog: MediaItem[];
  userProgresses: Record<string, UserProgress>;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  catalog,
  userProgresses,
  onExportData,
  onImportData,
}) => {
  const progressesArray = Object.values(userProgresses) as UserProgress[];

  // Calculate Movie stats
  const completedMovies = catalog.filter((m) => m.type === 'movie' && userProgresses[m.id]?.status === 'completed');
  let totalMovieMinutes = 0;
  completedMovies.forEach((m) => {
    totalMovieMinutes += m.runtime || 120;
  });

  // Calculate Series stats
  let totalSeriesEpisodesWatched = 0;
  let totalSeriesMinutes = 0;
  catalog.filter((m) => m.type === 'series').forEach((m) => {
    const prog = userProgresses[m.id];
    if (prog?.watchedEpisodes) {
      const watchedKeys = Object.keys(prog.watchedEpisodes).filter((k) => prog.watchedEpisodes![k]);
      totalSeriesEpisodesWatched += watchedKeys.length;
      
      // Calculate minutes based on episode duration
      if (m.seasonsData) {
        m.seasonsData.forEach((s) => {
          s.episodes.forEach((e) => {
            const k = `s${s.seasonNumber}e${e.episodeNumber}`;
            if (prog.watchedEpisodes![k]) {
              totalSeriesMinutes += e.durationMinutes || 45;
            }
          });
        });
      } else {
        totalSeriesMinutes += watchedKeys.length * 45;
      }
    }
  });

  const totalMinutes = totalMovieMinutes + totalSeriesMinutes;
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  // Average Rating
  const ratedItems = progressesArray.filter((p) => p.userRating && p.userRating > 0);
  const avgUserRating = ratedItems.length > 0 
    ? (ratedItems.reduce((acc, curr) => acc + (curr.userRating || 0), 0) / ratedItems.length).toFixed(1)
    : 'N/A';

  // Genre Distribution
  const genreCounts: Record<string, number> = {};
  catalog.forEach((m) => {
    if (userProgresses[m.id]?.status === 'completed' || userProgresses[m.id]?.status === 'watching') {
      m.genres.forEach((g) => {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
      });
    }
  });

  const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Achievements Calculation
  const BADGES = [
    { title: 'Premier Pas', desc: 'Avoir ajouté au moins 1 titre à votre suivi', unlocked: progressesArray.length >= 1, icon: '🎬' },
    { title: 'Cinéphile Passionné', desc: 'Avoir regardé au moins 5 films complets', unlocked: completedMovies.length >= 5, icon: '🍿' },
    { title: 'Marathonneur', desc: 'Avoir regardé plus de 20 épisodes de séries', unlocked: totalSeriesEpisodesWatched >= 20, icon: '⚡' },
    { title: 'Critique Éclairé', desc: 'Avoir noté au moins 3 œuvres', unlocked: ratedItems.length >= 3, icon: '⭐' },
    { title: 'Cinéma XL', desc: 'Avoir cumulé plus de 24 heures de visionnage', unlocked: totalHours >= 24, icon: '🏆' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Title & Backup Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900 p-6 rounded-3xl border border-white/10 shadow-xl">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
            <span>Tableau de Bord & Statistiques</span>
          </h2>
          <p className="text-xs text-white/50 mt-1">
            Analyse détaillée de vos habitudes de visionnage et progression globale.
          </p>
        </div>

        {/* Data Import/Export */}
        <div className="flex items-center gap-2">
          <button
            onClick={onExportData}
            className="flex items-center gap-1.5 px-4 py-2 bg-black/60 hover:bg-black/80 text-white border border-white/10 font-bold text-xs rounded-full transition-all"
            title="Exporter une sauvegarde JSON de vos données"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Sauvegarder JSON</span>
          </button>

          <label className="flex items-center gap-1.5 px-4 py-2 bg-black/60 hover:bg-black/80 text-white border border-white/10 font-bold text-xs rounded-full cursor-pointer transition-all">
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>Restaurer JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={onImportData}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* KPI Cards Grid (Bento Metric Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-zinc-900 border border-white/10 p-6 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 w-fit mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-white/40 uppercase tracking-wider block">Temps visionné</span>
          <div className="text-2xl font-extrabold text-white mt-1">
            {totalHours}h <span className="text-indigo-400 text-lg">{remainingMinutes}m</span>
          </div>
          <p className="text-[11px] text-white/40 mt-1">{totalMovieMinutes}m (films) + {totalSeriesMinutes}m (séries)</p>
        </div>

        <div className="bg-zinc-900 border border-white/10 p-6 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 w-fit mb-3">
            <Film className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-white/40 uppercase tracking-wider block">Films Terminés</span>
          <div className="text-2xl font-extrabold text-white mt-1">
            {completedMovies.length} <span className="text-white/40 text-xs font-normal">films</span>
          </div>
          <p className="text-[11px] text-white/40 mt-1">Sur l'ensemble du catalogue</p>
        </div>

        <div className="bg-zinc-900 border border-white/10 p-6 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 w-fit mb-3">
            <Tv className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-white/40 uppercase tracking-wider block">Épisodes de Séries Vus</span>
          <div className="text-2xl font-extrabold text-white mt-1">
            {totalSeriesEpisodesWatched} <span className="text-white/40 text-xs font-normal">épisodes</span>
          </div>
          <p className="text-[11px] text-white/40 mt-1">Suivis épisode par épisode</p>
        </div>

        <div className="bg-zinc-900 border border-white/10 p-6 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 w-fit mb-3">
            <Star className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-white/40 uppercase tracking-wider block">Note Moyenne Donnée</span>
          <div className="text-2xl font-extrabold text-white mt-1">
            {avgUserRating} <span className="text-white/40 text-xs font-normal">/ 10</span>
          </div>
          <p className="text-[11px] text-white/40 mt-1">{ratedItems.length} titres notés</p>
        </div>

      </div>

      {/* Genre Distribution & Badges Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Genre Breakdown */}
        <div className="bg-zinc-900 border border-white/10 p-6 rounded-3xl shadow-xl space-y-4">
          <h3 className="font-extrabold text-white text-base flex items-center gap-2">
            <PieChart className="w-5 h-5 text-indigo-400" />
            <span>Vos Genres les Plus Visionnés</span>
          </h3>

          {sortedGenres.length === 0 ? (
            <p className="text-xs text-white/40 italic py-4">
              Marquez des films ou séries comme "En cours" ou "Terminé" pour afficher votre répartition de genres.
            </p>
          ) : (
            <div className="space-y-3.5 pt-2">
              {sortedGenres.map(([genre, count]) => {
                const maxCount = sortedGenres[0][1];
                const pct = Math.round((count / maxCount) * 100);

                return (
                  <div key={genre} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-white">{genre}</span>
                      <span className="text-indigo-400">{count} œuvre(s)</span>
                    </div>
                    <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Badges / Achievements */}
        <div className="bg-zinc-900 border border-white/10 p-6 rounded-3xl shadow-xl space-y-4">
          <h3 className="font-extrabold text-white text-base flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Trophées & Badges Débloqués</span>
          </h3>

          <div className="space-y-3 pt-1">
            {BADGES.map((b, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                  b.unlocked
                    ? 'bg-black/60 border-indigo-500/40 text-white'
                    : 'bg-black/20 border-white/5 text-white/40 opacity-60'
                }`}
              >
                <div className="text-2xl p-2.5 rounded-xl bg-zinc-800 border border-white/10 flex-shrink-0">
                  {b.icon}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-white">{b.title}</h4>
                    {b.unlocked && (
                      <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/20 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                        Débloqué
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-white/50 mt-0.5">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
