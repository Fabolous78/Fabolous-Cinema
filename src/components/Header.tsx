import React from 'react';
import { AuthUser } from '../types';
import { 
  Film, Tv, Trophy, Sparkles, MessageSquare, BarChart3, Plus, BookmarkCheck, Search, 
  Clapperboard, User, ShieldCheck, LogOut, KeyRound
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'movies' | 'series' | 'top' | 'tracker' | 'recommendations' | 'chat' | 'stats';
  setActiveTab: (tab: 'movies' | 'series' | 'top' | 'tracker' | 'recommendations' | 'chat' | 'stats') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenAddModal: () => void;
  totalSavedItems: number;
  currentUser: AuthUser | null;
  onOpenLoginModal: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onOpenAddModal,
  totalSavedItems,
  currentUser,
  onOpenLoginModal,
  onLogout,
}) => {
  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0b]/90 backdrop-blur-md border-b border-white/10 text-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('movies')}
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
            id="brand-logo"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform duration-300">
              <div className="w-5 h-5 bg-white rounded-sm rotate-45 flex items-center justify-center">
                <Clapperboard className="w-3.5 h-3.5 text-indigo-600 -rotate-45" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white uppercase">
                  DIEUME CINEMA
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full hidden sm:inline-block">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-white/40 font-normal hidden sm:block">Vos films, séries & commandes directes</p>
            </div>
          </div>

          {/* Navigation Links (Desktop Bento Pills) */}
          <nav className="hidden xl:flex items-center gap-1 bg-zinc-900/90 p-1.5 rounded-full border border-white/10">
            <button
              id="nav-tab-movies"
              onClick={() => setActiveTab('movies')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full font-bold text-xs transition-all duration-200 ${
                activeTab === 'movies'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Films</span>
            </button>

            <button
              id="nav-tab-series"
              onClick={() => setActiveTab('series')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full font-bold text-xs transition-all duration-200 ${
                activeTab === 'series'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Séries</span>
            </button>

            <button
              id="nav-tab-top"
              onClick={() => setActiveTab('top')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full font-bold text-xs transition-all duration-200 ${
                activeTab === 'top'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-amber-400 hover:text-amber-300 hover:bg-white/5'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Top Classements</span>
            </button>

            <button
              id="nav-tab-tracker"
              onClick={() => setActiveTab('tracker')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full font-bold text-xs transition-all duration-200 relative ${
                activeTab === 'tracker'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookmarkCheck className="w-3.5 h-3.5 text-indigo-300" />
              <span>Mon Suivi</span>
              {totalSavedItems > 0 && (
                <span className="ml-0.5 px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-[10px] font-bold">
                  {totalSavedItems}
                </span>
              )}
            </button>

            <button
              id="nav-tab-recommendations"
              onClick={() => setActiveTab('recommendations')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full font-bold text-xs transition-all duration-200 ${
                activeTab === 'recommendations'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-300 animate-pulse" />
              <span>Recomms AI</span>
            </button>

            <button
              id="nav-tab-chat"
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full font-bold text-xs transition-all duration-200 ${
                activeTab === 'chat'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
              <span>Assistant AI</span>
            </button>

            <button
              id="nav-tab-stats"
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full font-bold text-xs transition-all duration-200 ${
                activeTab === 'stats'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Stats</span>
            </button>
          </nav>

          {/* User Auth Badge & Search / Add Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative hidden md:block w-36 lg:w-48">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                id="header-search-input"
                type="text"
                placeholder="Chercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Auth Button or User Badge */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-black/60 p-1 rounded-full border border-white/10">
                {isAdmin ? (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold">
                    <KeyRound className="w-3 h-3 text-amber-400" />
                    <span>ADMIN</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-bold max-w-[120px] truncate">
                    <User className="w-3 h-3 text-indigo-400" />
                    <span className="truncate">{currentUser.email || 'Client'}</span>
                  </span>
                )}

                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                  title="Se Déconnecter"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-full border border-white/10 transition-all shadow-md"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Connexion</span>
              </button>
            )}

            {/* Add button for Admin or user */}
            <button
              id="add-media-button"
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-full shadow-lg shadow-indigo-600/30 active:scale-95 transition-all"
              title={isAdmin ? "Ajouter une œuvre (Admin)" : "Ajouter une œuvre"}
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span className="hidden sm:inline">{isAdmin ? '+ Œuvre' : 'Ajouter'}</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex xl:hidden overflow-x-auto gap-1.5 py-2.5 border-t border-white/10 no-scrollbar">
          <button
            onClick={() => setActiveTab('movies')}
            className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full font-bold text-xs whitespace-nowrap transition-colors ${
              activeTab === 'movies' ? 'bg-indigo-600 text-white' : 'text-white/60 hover:bg-white/5'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Films</span>
          </button>
          <button
            onClick={() => setActiveTab('series')}
            className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full font-bold text-xs whitespace-nowrap transition-colors ${
              activeTab === 'series' ? 'bg-indigo-600 text-white' : 'text-white/60 hover:bg-white/5'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Séries</span>
          </button>
          <button
            onClick={() => setActiveTab('top')}
            className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full font-bold text-xs whitespace-nowrap transition-colors ${
              activeTab === 'top' ? 'bg-indigo-600 text-white' : 'text-amber-400 hover:bg-white/5'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Top Classements</span>
          </button>
          <button
            onClick={() => setActiveTab('tracker')}
            className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full font-bold text-xs whitespace-nowrap transition-colors ${
              activeTab === 'tracker' ? 'bg-indigo-600 text-white' : 'text-white/60 hover:bg-white/5'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5 text-indigo-300" />
            <span>Mon Suivi ({totalSavedItems})</span>
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full font-bold text-xs whitespace-nowrap transition-colors ${
              activeTab === 'recommendations' ? 'bg-indigo-600 text-white' : 'text-indigo-400 hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>AI Recomms</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full font-bold text-xs whitespace-nowrap transition-colors ${
              activeTab === 'chat' ? 'bg-indigo-600 text-white' : 'text-white/60 hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
            <span>Assistant AI</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full font-bold text-xs whitespace-nowrap transition-colors ${
              activeTab === 'stats' ? 'bg-indigo-600 text-white' : 'text-white/60 hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Stats</span>
          </button>
        </div>

      </div>
    </header>
  );
};
