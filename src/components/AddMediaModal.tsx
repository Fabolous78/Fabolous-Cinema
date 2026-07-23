import React, { useState, useEffect } from 'react';
import { MediaItem, MediaType } from '../types';
import { GENRE_OPTIONS } from '../data/catalog';
import { X, Plus, Film, Tv, Upload, Image as ImageIcon, Edit3, CheckCircle2 } from 'lucide-react';

interface AddMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMedia: (media: MediaItem) => void;
  onUpdateMedia?: (media: MediaItem) => void;
  initialData?: MediaItem | null;
}

export const AddMediaModal: React.FC<AddMediaModalProps> = ({
  isOpen,
  onClose,
  onAddMedia,
  onUpdateMedia,
  initialData,
}) => {
  if (!isOpen) return null;

  const isEditing = Boolean(initialData);

  const [title, setTitle] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  const [type, setType] = useState<MediaType>('movie');
  const [releaseYear, setReleaseYear] = useState<number>(new Date().getFullYear());
  const [rating, setRating] = useState<number>(8.0);
  const [overview, setOverview] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['Drame']);
  const [director, setDirector] = useState('');
  const [castStr, setCastStr] = useState('');
  const [runtime, setRuntime] = useState<number>(120);
  const [totalSeasons, setTotalSeasons] = useState<number>(1);
  const [totalEpisodes, setTotalEpisodes] = useState<number>(10);
  const [poster, setPoster] = useState('');
  const [backdrop, setBackdrop] = useState('');
  const [trailerUrl, setTrailerUrl] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setOriginalTitle(initialData.originalTitle || '');
      setType(initialData.type || 'movie');
      setReleaseYear(initialData.releaseYear || new Date().getFullYear());
      setRating(initialData.rating || 8.0);
      setOverview(initialData.overview || '');
      setSelectedGenres(initialData.genres && initialData.genres.length > 0 ? initialData.genres : ['Drame']);
      setDirector(initialData.director || initialData.creator || '');
      setCastStr(initialData.cast ? initialData.cast.join(', ') : '');
      setRuntime(initialData.runtime || 120);
      setTotalSeasons(initialData.totalSeasons || 1);
      setTotalEpisodes(initialData.totalEpisodes || 10);
      setPoster(initialData.poster || '');
      setBackdrop(initialData.backdrop || '');
      setTrailerUrl(initialData.trailerUrl || '');
    } else {
      // Reset defaults for creation
      setTitle('');
      setOriginalTitle('');
      setType('movie');
      setReleaseYear(new Date().getFullYear());
      setRating(8.0);
      setOverview('');
      setSelectedGenres(['Drame']);
      setDirector('');
      setCastStr('');
      setRuntime(120);
      setTotalSeasons(1);
      setTotalEpisodes(10);
      setPoster('');
      setBackdrop('');
      setTrailerUrl('');
    }
  }, [initialData]);

  const toggleGenre = (g: string) => {
    if (selectedGenres.includes(g)) {
      setSelectedGenres(selectedGenres.filter((item) => item !== g));
    } else {
      setSelectedGenres([...selectedGenres, g]);
    }
  };

  const handlePosterFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPoster(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackdropFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setBackdrop(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const defaultPoster = type === 'movie'
      ? 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop'
      : 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=800&auto=format&fit=crop';

    const mediaPayload: MediaItem = {
      id: isEditing && initialData ? initialData.id : `custom-${Date.now()}`,
      title: title.trim(),
      originalTitle: originalTitle.trim() || undefined,
      type,
      poster: poster.trim() || defaultPoster,
      backdrop: backdrop.trim() || undefined,
      overview: overview.trim() || 'Aucun synopsis fourni.',
      genres: selectedGenres.length > 0 ? selectedGenres : ['Drame'],
      releaseYear: Number(releaseYear) || new Date().getFullYear(),
      rating: Number(rating) || 7.5,
      director: type === 'movie' ? (director.trim() || undefined) : undefined,
      creator: type === 'series' ? (director.trim() || undefined) : undefined,
      cast: castStr ? castStr.split(',').map((s) => s.trim()) : [],
      runtime: type === 'movie' ? Number(runtime) : undefined,
      totalSeasons: type === 'series' ? Number(totalSeasons) : undefined,
      totalEpisodes: type === 'series' ? Number(totalEpisodes) : undefined,
      trailerUrl: trailerUrl.trim() || undefined,
      addedBy: isEditing && initialData ? initialData.addedBy : 'user',
      seasonsData: initialData?.seasonsData,
    };

    if (isEditing && onUpdateMedia) {
      onUpdateMedia(mediaPayload);
    } else {
      onAddMedia(mediaPayload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30">
              {isEditing ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5 stroke-[3]" />}
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg">
                {isEditing ? 'Modifier l\'Œuvre (Mode Admin)' : 'Ajouter une Œuvre (Mode Admin)'}
              </h3>
              <p className="text-xs text-white/50">
                {isEditing ? 'Mettez à jour les photos, la description et les détails de la série/film' : 'Ajoutez une nouvelle série ou un film au catalogue DIEUME CINEMA'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/40 text-white/60 hover:text-white border border-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-1 space-y-4 overflow-y-auto mt-4 custom-scrollbar flex-grow">
          
          {/* Type Toggle */}
          <div>
            <label className="block text-xs font-bold uppercase text-white/40 mb-2">Type de contenu</label>
            <div className="grid grid-cols-2 gap-3 max-w-xs">
              <button
                type="button"
                onClick={() => setType('movie')}
                className={`py-2.5 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  type === 'movie'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-black/40 text-white/50 border border-white/10'
                }`}
              >
                <Film className="w-4 h-4 text-amber-400" />
                <span>Film</span>
              </button>

              <button
                type="button"
                onClick={() => setType('series')}
                className={`py-2.5 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  type === 'series'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-black/40 text-white/50 border border-white/10'
                }`}
              >
                <Tv className="w-4 h-4 text-sky-400" />
                <span>Série</span>
              </button>
            </div>
          </div>

          {/* Title & Original Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">Titre principal *</label>
              <input
                type="text"
                required
                placeholder="Ex: Le Parrain ou Breaking Bad"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">Titre original (Optionnel)</label>
              <input
                type="text"
                placeholder="Ex: The Godfather"
                value={originalTitle}
                onChange={(e) => setOriginalTitle(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Photo Poster Section (URL + File Upload) */}
          <div className="bg-black/40 p-4 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-white flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-indigo-400" />
                <span>Affiche / Photo du Film ou Série (Poster)</span>
              </label>
              {poster && (
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Photo intégrée
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              {/* Poster Preview */}
              <div className="w-24 h-36 bg-zinc-950 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center mx-auto sm:mx-0">
                {poster ? (
                  <img src={poster} alt="Aperçu poster" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] text-white/30 text-center p-2">Aucune photo</span>
                )}
              </div>

              {/* Inputs */}
              <div className="sm:col-span-2 space-y-2">
                <div>
                  <span className="block text-[11px] text-white/50 mb-1">Importer une photo depuis l'appareil :</span>
                  <label className="flex items-center justify-center gap-2 px-3 py-2 bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-200 border border-indigo-500/30 rounded-xl cursor-pointer text-xs font-bold transition-all">
                    <Upload className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Choisir un fichier image...</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePosterFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="relative">
                  <span className="block text-[11px] text-white/50 mb-1">Ou coller l'URL d'une image web :</span>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={poster}
                    onChange={(e) => setPoster(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Photo Backdrop Section */}
          <div className="bg-black/40 p-4 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-white flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-indigo-400" />
                <span>Image de Fond / Banner (Backdrop - Optionnel)</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              <div className="w-full h-20 bg-zinc-950 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center">
                {backdrop ? (
                  <img src={backdrop} alt="Aperçu fond" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] text-white/30 text-center p-2">Aucun fond</span>
                )}
              </div>

              <div className="sm:col-span-2 space-y-2">
                <label className="flex items-center justify-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white/80 border border-white/10 rounded-xl cursor-pointer text-xs font-bold transition-all">
                  <Upload className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Importer image de fond...</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBackdropFileUpload}
                    className="hidden"
                  />
                </label>

                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={backdrop}
                  onChange={(e) => setBackdrop(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Description / Overview */}
          <div>
            <label className="block text-xs font-bold text-white/80 mb-1">Description / Synopsis complet *</label>
            <textarea
              rows={4}
              required
              placeholder="Rédigez ou collez le résumé détaillé du film ou de la série..."
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Release Year, Rating, Runtime/Seasons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">Année de sortie</label>
              <input
                type="number"
                value={releaseYear}
                onChange={(e) => setReleaseYear(Number(e.target.value))}
                className="w-full bg-black/60 border border-white/10 rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">Note globale (0-10)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full bg-black/60 border border-white/10 rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {type === 'movie' ? (
              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Durée (minutes)</label>
                <input
                  type="number"
                  value={runtime}
                  onChange={(e) => setRuntime(Number(e.target.value))}
                  className="w-full bg-black/60 border border-white/10 rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Nombre de saisons</label>
                <input
                  type="number"
                  value={totalSeasons}
                  onChange={(e) => setTotalSeasons(Number(e.target.value))}
                  className="w-full bg-black/60 border border-white/10 rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}
          </div>

          {/* Genres selection */}
          <div>
            <label className="block text-xs font-bold text-white/80 mb-2">Genres</label>
            <div className="flex flex-wrap gap-2">
              {GENRE_OPTIONS.filter((g) => g !== 'Tous les genres').map((g) => {
                const isSelected = selectedGenres.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleGenre(g)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-black/40 text-white/50 border border-white/10'
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Director & Cast */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">Réalisateur / Créateur</label>
              <input
                type="text"
                placeholder="Ex: Christopher Nolan ou Vince Gilligan"
                value={director}
                onChange={(e) => setDirector(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">Acteurs principaux (Séparés par virgule)</label>
              <input
                type="text"
                placeholder="Ex: Leonardo DiCaprio, Tom Hardy"
                value={castStr}
                onChange={(e) => setCastStr(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Trailer URL */}
          <div>
            <label className="block text-xs font-bold text-white/80 mb-1">Lien Bande-Annonce YouTube (Embed URL - Optionnel)</label>
            <input
              type="url"
              placeholder="https://www.youtube.com/embed/..."
              value={trailerUrl}
              onChange={(e) => setTrailerUrl(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-white/10 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-black/40 hover:bg-black/60 text-white/80 font-bold text-xs rounded-full border border-white/10"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-full shadow-lg shadow-indigo-600/30 transition-all uppercase tracking-wider"
            >
              {isEditing ? 'Enregistrer les modifications' : 'Ajouter au Catalogue'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
