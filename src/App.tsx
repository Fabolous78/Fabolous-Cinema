/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MediaItem, UserProgress, WatchStatus, RecommendationItem, AuthUser } from './types';
import { INITIAL_CATALOG } from './data/catalog';
import { Header } from './components/Header';
import { MovieCard } from './components/MovieCard';
import { FilterBar } from './components/FilterBar';
import { MediaDetailModal } from './components/MediaDetailModal';
import { RecommendationEngine } from './components/RecommendationEngine';
import { AIChatAssistant } from './components/AIChatAssistant';
import { StatsDashboard } from './components/StatsDashboard';
import { AddMediaModal } from './components/AddMediaModal';
import { LoginModal } from './components/LoginModal';
import { OrderModal } from './components/OrderModal';
import { TopRankings } from './components/TopRankings';
import { 
  Film, Tv, BookmarkCheck, Sparkles, Star, Plus, Search, 
  Clapperboard, PlayCircle, Heart, Play, ChevronRight, TrendingUp,
  MessageCircle, Mail, PhoneCall, ShieldCheck
} from 'lucide-react';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const savedAuth = localStorage.getItem('dieume_cinema_auth');
      if (savedAuth) {
        return JSON.parse(savedAuth);
      }
    } catch (e) {
      console.error('Error loading auth:', e);
    }
    return null;
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState<'movies' | 'series' | 'top' | 'tracker' | 'recommendations' | 'chat' | 'stats'>('movies');
  
  // Catalog State (Initial + LocalStorage Custom Media)
  const [catalog, setCatalog] = useState<MediaItem[]>(() => {
    try {
      const savedCustom = localStorage.getItem('cinetracker_custom_catalog');
      if (savedCustom) {
        const customItems: MediaItem[] = JSON.parse(savedCustom);
        return [...INITIAL_CATALOG, ...customItems];
      }
    } catch (e) {
      console.error('Error loading custom catalog:', e);
    }
    return INITIAL_CATALOG;
  });

  // User Progresses State (Status, Ratings, Episodes, Notes)
  const [userProgresses, setUserProgresses] = useState<Record<string, UserProgress>>(() => {
    try {
      const savedProg = localStorage.getItem('cinetracker_user_progress');
      if (savedProg) {
        return JSON.parse(savedProg);
      }
    } catch (e) {
      console.error('Error loading user progress:', e);
    }
    // Default demo progress if none exists
    return {
      'movie-1': { mediaId: 'movie-1', status: 'watching', favorite: true, rewatchCount: 0, userRating: 9 },
      'series-1': { mediaId: 'series-1', status: 'watching', favorite: true, rewatchCount: 0, currentSeason: 1, watchedEpisodes: { 's1e1': true, 's1e2': true, 's1e3': true, 's1e4': true } },
      'series-2': { mediaId: 'series-2', status: 'watching', favorite: false, rewatchCount: 0, currentSeason: 1, watchedEpisodes: { 's1e1': true, 's1e2': true } },
    };
  });

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<WatchStatus | 'all' | 'favorites'>('all');
  const [selectedGenre, setSelectedGenre] = useState('Tous les genres');
  const [selectedMood, setSelectedMood] = useState('Toutes les ambiances');
  const [sortBy, setSortBy] = useState<'rating' | 'year' | 'title'>('rating');

  // Modals State
  const [selectedMediaModal, setSelectedMediaModal] = useState<MediaItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [orderModalMedia, setOrderModalMedia] = useState<MediaItem | null>(null);

  // Sync auth state to LocalStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('dieume_cinema_auth', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('dieume_cinema_auth');
      }
    } catch (e) {
      console.error('Failed to save auth state:', e);
    }
  }, [currentUser]);

  // Sync user progresses to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('cinetracker_user_progress', JSON.stringify(userProgresses));
    } catch (e) {
      console.error('Failed to save progress:', e);
    }
  }, [userProgresses]);

  // Sync custom catalog to LocalStorage
  useEffect(() => {
    try {
      const customItems = catalog.filter((m) => m.addedBy === 'user');
      localStorage.setItem('cinetracker_custom_catalog', JSON.stringify(customItems));
    } catch (e) {
      console.error('Failed to save custom catalog:', e);
    }
  }, [catalog]);

  // Auth Handlers
  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Handler: Toggle Favorite
  const handleToggleFavorite = (mediaId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setUserProgresses((prev) => {
      const existing = prev[mediaId] || { mediaId, status: 'plan_to_watch', favorite: false, rewatchCount: 0 };
      return {
        ...prev,
        [mediaId]: {
          ...existing,
          favorite: !existing.favorite,
        },
      };
    });
  };

  // Handler: Change Watch Status
  const handleChangeStatus = (mediaId: string, status: WatchStatus, e?: React.ChangeEvent<HTMLSelectElement>) => {
    if (e) e.stopPropagation();
    if (!status) return;
    setUserProgresses((prev) => {
      const existing = prev[mediaId] || { mediaId, status: 'plan_to_watch', favorite: false, rewatchCount: 0 };
      return {
        ...prev,
        [mediaId]: {
          ...existing,
          status,
          lastWatchedDate: new Date().toISOString(),
        },
      };
    });
  };

  // Handler: Update Detailed Progress (Ratings, Review)
  const handleUpdateProgress = (mediaId: string, updates: Partial<UserProgress>) => {
    setUserProgresses((prev) => {
      const existing = prev[mediaId] || { mediaId, status: 'plan_to_watch', favorite: false, rewatchCount: 0 };
      return {
        ...prev,
        [mediaId]: {
          ...existing,
          ...updates,
        },
      };
    });
  };

  // Handler: Toggle Individual Series Episode
  const handleToggleEpisode = (mediaId: string, episodeKey: string, isWatched: boolean) => {
    setUserProgresses((prev) => {
      const existing = prev[mediaId] || { mediaId, status: 'watching', favorite: false, rewatchCount: 0, watchedEpisodes: {} };
      const newWatched = { ...(existing.watchedEpisodes || {}), [episodeKey]: isWatched };

      const media = catalog.find((m) => m.id === mediaId);
      let newStatus = existing.status;
      if (media && media.type === 'series') {
        const total = media.totalEpisodes || (media.seasonsData ? media.seasonsData.reduce((s, c) => s + c.episodeCount, 0) : 0);
        const watchedCount = Object.values(newWatched).filter(Boolean).length;
        if (total > 0 && watchedCount >= total) {
          newStatus = 'completed';
        } else if (watchedCount > 0 && existing.status !== 'completed') {
          newStatus = 'watching';
        }
      }

      return {
        ...prev,
        [mediaId]: {
          ...existing,
          status: newStatus,
          watchedEpisodes: newWatched,
          lastWatchedDate: new Date().toISOString(),
        },
      };
    });
  };

  // Handler: Bulk Mark Season Watched
  const handleMarkSeasonWatched = (mediaId: string, seasonNumber: number, allKeys: string[], isWatched: boolean) => {
    setUserProgresses((prev) => {
      const existing = prev[mediaId] || { mediaId, status: 'watching', favorite: false, rewatchCount: 0, watchedEpisodes: {} };
      const newWatched = { ...(existing.watchedEpisodes || {}) };
      allKeys.forEach((k) => {
        newWatched[k] = isWatched;
      });

      return {
        ...prev,
        [mediaId]: {
          ...existing,
          status: 'watching',
          watchedEpisodes: newWatched,
          lastWatchedDate: new Date().toISOString(),
        },
      };
    });
  };

  // Handler: Add Media manually (Admin / User)
  const handleAddMedia = (newMedia: MediaItem) => {
    setCatalog((prev) => [newMedia, ...prev]);
    setUserProgresses((prev) => ({
      ...prev,
      [newMedia.id]: { mediaId: newMedia.id, status: 'plan_to_watch', favorite: false, rewatchCount: 0 }
    }));
  };

  // Handler: Update Media (Admin)
  const handleUpdateMedia = (updatedMedia: MediaItem) => {
    setCatalog((prev) => prev.map((m) => (m.id === updatedMedia.id ? updatedMedia : m)));
    if (selectedMediaModal?.id === updatedMedia.id) {
      setSelectedMediaModal(updatedMedia);
    }
  };

  // Handler: Delete Media (Admin)
  const handleDeleteMedia = (mediaId: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette œuvre du catalogue DIEUME CINEMA ?')) {
      setCatalog((prev) => prev.filter((m) => m.id !== mediaId));
      if (selectedMediaModal?.id === mediaId) {
        setSelectedMediaModal(null);
      }
    }
  };

  // Handler: Add Media from AI Recommendation
  const handleAddMediaFromAI = (rec: RecommendationItem) => {
    const existing = catalog.find((m) => m.title.toLowerCase() === rec.title.toLowerCase());
    if (existing) {
      setUserProgresses((prev) => ({
        ...prev,
        [existing.id]: { ...(prev[existing.id] || { mediaId: existing.id, favorite: false, rewatchCount: 0 }), status: 'plan_to_watch' }
      }));
      return;
    }

    const newMedia: MediaItem = {
      id: `ai-added-${Date.now()}`,
      title: rec.title,
      type: rec.type,
      poster: rec.type === 'movie'
        ? 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop'
        : 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=800&auto=format&fit=crop',
      overview: rec.synopsis,
      genres: rec.genres,
      releaseYear: rec.releaseYear,
      rating: 8.2,
      cast: [],
      addedBy: 'user',
    };

    handleAddMedia(newMedia);
  };

  // Export / Import Backup Data
  const handleExportData = () => {
    const backupData = {
      userProgresses,
      customCatalog: catalog.filter((m) => m.addedBy === 'user'),
      exportedAt: new Date().toISOString(),
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `dieume_cinema_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.userProgresses) {
            setUserProgresses(parsed.userProgresses);
          }
          if (parsed.customCatalog && Array.isArray(parsed.customCatalog)) {
            setCatalog((prev) => [...prev, ...parsed.customCatalog]);
          }
          alert('Restauration des données réussie !');
        } catch (err) {
          alert('Fichier de sauvegarde invalide.');
        }
      };
    }
  };

  // Filter Catalog Logic
  const filteredCatalog = catalog.filter((m) => {
    // Tab Filter
    if (activeTab === 'movies' && m.type !== 'movie') return false;
    if (activeTab === 'series' && m.type !== 'series') return false;
    if (activeTab === 'tracker') {
      const prog = userProgresses[m.id];
      if (!prog || !prog.status) return false;
    }

    // Status Filter
    const userProg = userProgresses[m.id];
    if (selectedStatus === 'favorites') {
      if (!userProg?.favorite) return false;
    } else if (selectedStatus !== 'all') {
      if (userProg?.status !== selectedStatus) return false;
    }

    // Genre Filter
    if (selectedGenre !== 'Tous les genres') {
      if (!m.genres.includes(selectedGenre)) return false;
    }

    // Mood Filter
    if (selectedMood !== 'Toutes les ambiances') {
      if (!m.moods || !m.moods.includes(selectedMood)) return false;
    }

    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = m.title.toLowerCase().includes(q);
      const matchOrig = m.originalTitle?.toLowerCase().includes(q);
      const matchGenre = m.genres.some((g) => g.toLowerCase().includes(q));
      const matchDirector = m.director?.toLowerCase().includes(q);
      if (!matchTitle && !matchOrig && !matchGenre && !matchDirector) return false;
    }

    return true;
  });

  // Sort Logic
  const sortedCatalog = [...filteredCatalog].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'year') return b.releaseYear - a.releaseYear;
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  const totalSavedItems = (Object.values(userProgresses) as UserProgress[]).filter((p) => p.status || p.favorite).length;

  // Currently watching items for the Bento Grid section
  const currentlyWatching = catalog.filter((m) => userProgresses[m.id]?.status === 'watching').slice(0, 3);
  const featuredItem = catalog.find((m) => m.id === 'movie-1') || catalog[0];

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#e0e0e0] font-sans selection:bg-indigo-600 selection:text-white flex flex-col">
      
      {/* Top Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        totalSavedItems={totalSavedItems}
        currentUser={currentUser}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* VIEW 1: Movies / Series / Mon Suivi Catalog Grid */}
        {(activeTab === 'movies' || activeTab === 'series' || activeTab === 'tracker') && (
          <div className="space-y-8">
            
            {/* Bento Grid Featured Dashboard Header (Only on main Movies view when no specific search is active) */}
            {activeTab === 'movies' && !searchQuery && selectedStatus === 'all' && selectedGenre === 'Tous les genres' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade-in">
                
                {/* Bento Card 1: Main Spotlight (8 cols) */}
                <div 
                  onClick={() => setSelectedMediaModal(featuredItem)}
                  className="md:col-span-8 relative rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 group cursor-pointer min-h-[360px] flex flex-col justify-end p-8 shadow-2xl"
                >
                  <img 
                    src={featuredItem.backdrop || featuredItem.poster} 
                    alt={featuredItem.title} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
                  
                  <div className="relative z-20 space-y-3">
                    <span className="bg-indigo-600 text-white w-fit px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-md">
                      À l'affiche • Recommandation
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                      {featuredItem.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-white/70 max-w-lg leading-relaxed line-clamp-2">
                      {featuredItem.overview}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMediaModal(featuredItem);
                        }}
                        className="bg-white text-black px-6 py-2 rounded-full font-bold text-xs flex items-center gap-2 hover:bg-zinc-200 transition-colors shadow-lg"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Explorer la Fiche</span>
                      </button>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setOrderModalMedia(featuredItem);
                        }}
                        className="bg-emerald-600 text-white px-5 py-2 rounded-full font-extrabold text-xs hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 uppercase tracking-wider"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-current" />
                        <span>Commander sur WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bento Card 2: Currently Watching Stack (4 cols) */}
                <div className="md:col-span-4 bg-zinc-900 rounded-3xl border border-white/10 p-6 flex flex-col justify-between shadow-xl">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <PlayCircle className="w-4 h-4 text-indigo-400" />
                      <span>En cours de lecture</span>
                    </h3>
                    <button 
                      onClick={() => setSelectedStatus('watching')}
                      className="text-xs text-indigo-400 hover:underline font-semibold flex items-center"
                    >
                      Voir tout <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {currentlyWatching.length > 0 ? (
                      currentlyWatching.map((item) => {
                        const prog = userProgresses[item.id];
                        let watchedCount = 0;
                        let totalEps = item.totalEpisodes || 10;
                        if (prog?.watchedEpisodes) {
                          watchedCount = Object.values(prog.watchedEpisodes).filter(Boolean).length;
                        }

                        return (
                          <div 
                            key={item.id}
                            onClick={() => setSelectedMediaModal(item)}
                            className="flex gap-3 items-center p-2 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5"
                          >
                            <img 
                              src={item.poster} 
                              alt={item.title} 
                              className="w-12 h-16 bg-zinc-800 rounded-xl object-cover flex-shrink-0 border border-white/10"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-end mb-1.5">
                                <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                                <span className="text-[10px] text-white/40 font-semibold flex-shrink-0">
                                  {item.type === 'series' ? `EP ${watchedCount}/${totalEps}` : 'Film'}
                                </span>
                              </div>
                              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-indigo-500 rounded-full" 
                                  style={{ width: item.type === 'series' ? `${Math.min(100, Math.round((watchedCount / totalEps) * 100))}%` : '60%' }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-xs text-white/40 italic py-6 text-center">
                        Aucun titre en cours. Sélectionnez un film ou une série pour démarrer votre suivi !
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-[11px] text-white/40">
                    <span>Mise à jour synchronisée</span>
                    <span className="text-indigo-400 font-bold">{Object.keys(userProgresses).length} titres suivis</span>
                  </div>
                </div>

                {/* Bento Card 3: AI Recommender Teaser (5 cols) */}
                <div 
                  onClick={() => setActiveTab('recommendations')}
                  className="md:col-span-5 bg-indigo-600 rounded-3xl p-6 flex flex-col justify-between cursor-pointer hover:bg-indigo-500 transition-all shadow-xl group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-black tracking-wider bg-white/20 text-white px-2.5 py-1 rounded-full">
                        Moteur AI Gemini
                      </span>
                      <Sparkles className="w-5 h-5 text-white animate-pulse" />
                    </div>
                    <h3 className="text-xl font-extrabold text-white leading-tight">Recommandé pour vous</h3>
                    <p className="text-xs text-white/80 mt-1 italic">
                      Basé sur votre préférence pour les œuvres captivantes & votre historique
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/20">
                    <div>
                      <p className="text-base font-bold text-white">Assistant CinéAI</p>
                      <p className="text-xs text-white/70">Obtenez 3 conseils sur-mesure</p>
                    </div>
                    <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Bento Card 4: Quick Metrics (7 cols) */}
                <div 
                  onClick={() => setActiveTab('stats')}
                  className="md:col-span-7 bg-zinc-900 border border-white/10 rounded-3xl p-6 flex flex-col justify-between cursor-pointer hover:border-indigo-500/40 transition-colors shadow-xl"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-widest font-extrabold">Statistiques Globales</p>
                      <p className="text-2xl font-black text-white mt-1">48h de visionnage</p>
                      <p className="text-xs text-indigo-400 mt-0.5 font-semibold">+12% ce mois-ci par rapport au mois dernier</p>
                    </div>
                    <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400 border border-white/10">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-white/5 text-center">
                    <div className="bg-white/5 p-2.5 rounded-2xl border border-white/5">
                      <span className="text-[10px] text-white/40 block font-bold">Films Vus</span>
                      <span className="text-base font-extrabold text-white">12</span>
                    </div>
                    <div className="bg-white/5 p-2.5 rounded-2xl border border-white/5">
                      <span className="text-[10px] text-white/40 block font-bold">Séries suivies</span>
                      <span className="text-base font-extrabold text-white">5</span>
                    </div>
                    <div className="bg-white/5 p-2.5 rounded-2xl border border-white/5">
                      <span className="text-[10px] text-white/40 block font-bold">Note Moyenne</span>
                      <span className="text-base font-extrabold text-indigo-400">8.4/10</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Title Header for catalog */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
                  {activeTab === 'movies' && <><Film className="w-7 h-7 text-indigo-400" /><span>Catalogue des Films</span></>}
                  {activeTab === 'series' && <><Tv className="w-7 h-7 text-indigo-400" /><span>Séries & Saisons</span></>}
                  {activeTab === 'tracker' && <><BookmarkCheck className="w-7 h-7 text-emerald-400" /><span>Mon Suivi de Visionnage</span></>}
                </h1>
                <p className="text-xs sm:text-sm text-white/50 mt-1">
                  {activeTab === 'movies' && "Explorez notre sélection de films, gérez votre liste à voir et attribuez vos notes."}
                  {activeTab === 'series' && "Suivez votre progression épisode par épisode à travers les saisons."}
                  {activeTab === 'tracker' && "Retrouvez ici tous les films et séries que vous avez sauvegardés, en cours ou terminés."}
                </p>
              </div>

              {/* Quick Filter Info Badge */}
              <div className="text-xs font-semibold text-white/60 bg-zinc-900 border border-white/10 px-4 py-2 rounded-full w-fit">
                <span className="text-indigo-400 font-extrabold">{sortedCatalog.length}</span> résultat(s) affiché(s)
              </div>
            </div>

            {/* Filter and Search Bar */}
            <FilterBar
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              selectedGenre={selectedGenre}
              setSelectedGenre={setSelectedGenre}
              selectedMood={selectedMood}
              setSelectedMood={setSelectedMood}
              sortBy={sortBy}
              setSortBy={setSortBy}
              activeType={activeTab === 'movies' ? 'movie' : activeTab === 'series' ? 'series' : 'all'}
            />

            {/* Grid of Media Cards */}
            {sortedCatalog.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                {sortedCatalog.map((media) => (
                  <MovieCard
                    key={media.id}
                    media={media}
                    userProgress={userProgresses[media.id]}
                    onSelect={(m) => setSelectedMediaModal(m)}
                    onToggleFavorite={handleToggleFavorite}
                    onChangeStatus={handleChangeStatus}
                    onOrder={(m) => setOrderModalMedia(m)}
                    onEdit={(m) => setEditingMedia(m)}
                    onDelete={handleDeleteMedia}
                    isAdmin={isAdmin}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-zinc-900 border border-white/5 rounded-3xl p-12 text-center space-y-3 my-8">
                <div className="w-12 h-12 rounded-2xl bg-white/5 text-white/40 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-white">Aucun résultat ne correspond</h3>
                <p className="text-xs text-white/40 max-w-md mx-auto">
                  Essayez de réinitialiser vos filtres ou de modifier votre recherche pour découvrir d'autres films et séries.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedStatus('all');
                    setSelectedGenre('Tous les genres');
                    setSelectedMood('Toutes les ambiances');
                  }}
                  className="mt-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-full transition-all shadow-md"
                >
                  Réinitialiser tous les filtres
                </button>
              </div>
            )}

          </div>
        )}

        {/* VIEW 2: Top Rankings (Top Films & Top Séries) */}
        {activeTab === 'top' && (
          <TopRankings
            catalog={catalog}
            userProgresses={userProgresses}
            onSelectMedia={(m) => setSelectedMediaModal(m)}
            onOrderMedia={(m) => setOrderModalMedia(m)}
            onEditMedia={(m) => setEditingMedia(m)}
            isAdmin={isAdmin}
          />
        )}

        {/* VIEW 3: AI Recommendation Engine */}
        {activeTab === 'recommendations' && (
          <RecommendationEngine
            userHistory={(Object.values(userProgresses) as UserProgress[]).map((p) => {
              const m = catalog.find((c) => c.id === p.mediaId);
              return {
                mediaId: p.mediaId,
                title: m?.title || 'Titre',
                type: m?.type || 'movie',
                rating: p.userRating || m?.rating,
                status: p.status,
                genres: m?.genres || [],
              };
            })}
            onAddMediaFromAI={handleAddMediaFromAI}
            savedMediaTitles={catalog.map((c) => c.title)}
          />
        )}

        {/* VIEW 4: AI Chat Assistant */}
        {activeTab === 'chat' && (
          <AIChatAssistant
            userContext={{
              totalWatched: Object.keys(userProgresses).length,
              favoriteGenres: ['Science-Fiction', 'Action', 'Drame'],
            }}
          />
        )}

        {/* VIEW 5: Statistics & Viewing Metrics */}
        {activeTab === 'stats' && (
          <StatsDashboard
            catalog={catalog}
            userProgresses={userProgresses}
            onExportData={handleExportData}
            onImportData={handleImportData}
          />
        )}

      </main>

      {/* Media Detail Modal */}
      {selectedMediaModal && (
        <MediaDetailModal
          media={selectedMediaModal}
          userProgress={userProgresses[selectedMediaModal.id]}
          onClose={() => setSelectedMediaModal(null)}
          onUpdateProgress={handleUpdateProgress}
          onToggleFavorite={(id) => handleToggleFavorite(id)}
          onToggleEpisode={handleToggleEpisode}
          onMarkSeasonWatched={handleMarkSeasonWatched}
          onOrderMedia={(m) => setOrderModalMedia(m)}
          onEditMedia={(m) => setEditingMedia(m)}
          isAdmin={isAdmin}
        />
      )}

      {/* Add Custom Media Modal (Admin / User) */}
      <AddMediaModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddMedia={handleAddMedia}
      />

      {/* Edit Custom Media Modal (Admin) */}
      <AddMediaModal
        isOpen={Boolean(editingMedia)}
        onClose={() => setEditingMedia(null)}
        onAddMedia={handleAddMedia}
        onUpdateMedia={handleUpdateMedia}
        initialData={editingMedia}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />

      {/* Order Modal (WhatsApp / Email) */}
      <OrderModal
        media={orderModalMedia}
        isOpen={Boolean(orderModalMedia)}
        onClose={() => setOrderModalMedia(null)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-white/10 bg-[#0a0a0b] py-8 text-center text-xs text-white/40">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Clapperboard className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white uppercase">DIEUME CINEMA</span>
            <span>— Suivi & Commandes de Films & Séries</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-white/60">
            <a 
              href="https://wa.me/243972252806" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp: +243 972 252 806</span>
            </a>

            <a 
              href="mailto:rusakidieumerci1@gmail.com" 
              className="flex items-center gap-1 hover:text-indigo-400 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span>Mail: rusakidieumerci1@gmail.com</span>
            </a>
          </div>

          <p className="text-white/30">Propulsé par Google Gemini 3.6 Flash • Google AI Studio</p>
        </div>
      </footer>

    </div>
  );
}
