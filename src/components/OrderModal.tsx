import React, { useState } from 'react';
import { MediaItem } from '../types';
import { X, MessageCircle, Mail, Film, Tv, CheckCircle2, ShoppingCart, Info } from 'lucide-react';

interface OrderModalProps {
  media: MediaItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({ media, isOpen, onClose }) => {
  if (!isOpen || !media) return null;

  const [format, setFormat] = useState<'hd' | 'full_hd' | 'usb' | 'download'>('full_hd');
  const [clientNote, setClientNote] = useState('');

  const WHATSAPP_NUMBER = '+243972252806';
  const WHATSAPP_CLEAN = '243972252806';
  const ADMIN_EMAIL = 'rusakidieumerci1@gmail.com';

  const formatLabels = {
    hd: 'HD (720p)',
    full_hd: 'Full HD (1080p)',
    usb: 'Copie sur Clé USB / Disque',
    download: 'Lien de téléchargement direct',
  };

  const getOrderMessage = () => {
    let msg = `Bonjour DIEUME CINEMA,\n\nJe souhaite commander le produit suivant :\n- Titre : ${media.title}\n- Type : ${media.type === 'movie' ? 'Film' : 'Série'}\n- Année : ${media.releaseYear}\n- Format souhaité : ${formatLabels[format]}`;
    if (clientNote.trim()) {
      msg += `\n- Note/Précisions : ${clientNote.trim()}`;
    }
    msg += `\n\nMerci de me confirmer la disponibilité !`;
    return msg;
  };

  const handleWhatsAppOrder = () => {
    const text = encodeURIComponent(getOrderMessage());
    const waUrl = `https://wa.me/${WHATSAPP_CLEAN}?text=${text}`;
    window.open(waUrl, '_blank');
  };

  const handleEmailOrder = () => {
    const subject = encodeURIComponent(`Commande DIEUME CINEMA : ${media.title}`);
    const body = encodeURIComponent(getOrderMessage());
    const mailUrl = `mailto:${ADMIN_EMAIL}?subject=${subject}&body=${body}`;
    window.open(mailUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white/60 hover:text-white border border-white/10 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <div className="p-2.5 rounded-2xl bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-600/30">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white">Commander l'œuvre</h2>
            <p className="text-xs text-white/50">Commandez directement via WhatsApp ou Email</p>
          </div>
        </div>

        {/* Media Preview Card */}
        <div className="flex items-center gap-4 bg-black/60 p-3.5 rounded-2xl border border-white/10 my-4">
          <img
            src={media.poster}
            alt={media.title}
            className="w-16 h-24 object-cover rounded-xl border border-white/10 shadow-md flex-shrink-0"
          />
          <div className="overflow-hidden text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-indigo-600/80 text-white font-bold text-[10px] rounded-full uppercase">
                {media.type === 'movie' ? 'Film' : 'Série'}
              </span>
              <span className="text-xs text-white/60 font-semibold">{media.releaseYear}</span>
            </div>
            <h3 className="font-extrabold text-sm line-clamp-1">{media.title}</h3>
            <p className="text-xs text-white/50 line-clamp-2 mt-0.5 leading-snug">
              {media.overview}
            </p>
          </div>
        </div>

        {/* Format Selector */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-white/80 mb-1.5">
              Format / Mode de livraison souhaité
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['full_hd', 'hd', 'usb', 'download'] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setFormat(fmt)}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between ${
                    format === fmt
                      ? 'bg-indigo-600/30 border-indigo-500 text-white'
                      : 'bg-black/40 border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <span>{formatLabels[fmt]}</span>
                  {format === fmt && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label className="block text-xs font-bold text-white/80 mb-1">
              Note ou précision complémentaire (Optionnel)
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Je souhaite aussi la saison 2 si disponible..."
              value={clientNote}
              onChange={(e) => setClientNote(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Contact Info Banner */}
        <div className="my-4 p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200 flex items-start gap-2">
          <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
          <span>
            Numéro officiel : <strong className="text-white">{WHATSAPP_NUMBER}</strong> | Email : <strong className="text-white">{ADMIN_EMAIL}</strong>
          </span>
        </div>

        {/* Order Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleWhatsAppOrder}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-emerald-600/30 transition-all uppercase tracking-wider"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>WhatsApp (+243 972 252 806)</span>
          </button>

          <button
            onClick={handleEmailOrder}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-indigo-600/30 transition-all uppercase tracking-wider"
          >
            <Mail className="w-4 h-4" />
            <span>Envoyer par Mail</span>
          </button>
        </div>

      </div>
    </div>
  );
};
