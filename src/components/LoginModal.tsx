import React, { useState } from 'react';
import { AuthUser } from '../types';
import { X, ShieldCheck, Mail, Lock, User, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: AuthUser) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'client' | 'admin'>('client');
  
  // Client state
  const [clientEmail, setClientEmail] = useState('');
  
  // Admin state
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientEmail.trim() || !clientEmail.includes('@')) {
      setErrorMsg('Veuillez entrer une adresse e-mail valide.');
      return;
    }
    setErrorMsg(null);
    setSuccessMsg('Connexion client réussie !');
    setTimeout(() => {
      onLogin({
        role: 'client',
        email: clientEmail.trim(),
      });
      onClose();
    }, 600);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validate Admin credentials: Username "Admin", Password "9678"
    if (adminUsername.trim() === 'Admin' && adminPassword === '9678') {
      setSuccessMsg('Connexion administrateur réussie ! Bienvenue Admin.');
      setTimeout(() => {
        onLogin({
          role: 'admin',
          username: 'Admin',
        });
        onClose();
      }, 600);
    } else {
      setErrorMsg('Identifiants incorrects ! Vérifiez le nom d\'utilisateur (Admin) et le mot de passe.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white/60 hover:text-white border border-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center pb-4 border-b border-white/10">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto mb-3 shadow-lg">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
          </div>
          <h2 className="text-xl font-extrabold text-white uppercase tracking-wider">
            Espace Connexion
          </h2>
          <p className="text-xs text-white/50 mt-1">
            Connectez-vous à DIEUME CINEMA en tant que Client ou Administrateur
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-2 my-4 bg-black/50 p-1.5 rounded-2xl border border-white/10">
          <button
            type="button"
            onClick={() => {
              setActiveTab('client');
              setErrorMsg(null);
            }}
            className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'client'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Mode Client</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              setErrorMsg(null);
            }}
            className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'admin'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-300" />
            <span>Mode Admin</span>
          </button>
        </div>

        {/* Messages */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Client Form */}
        {activeTab === 'client' && (
          <form onSubmit={handleClientSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>Adresse Email Client</span>
              </label>
              <input
                type="email"
                required
                placeholder="votre.email@exemple.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[11px] text-white/40 mt-1.5">
                Connectez-vous pour suivre vos visionnages et commander vos contenus.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-indigo-600/30 transition-all uppercase tracking-wider"
            >
              Se Connecter comme Client
            </button>
          </form>
        )}

        {/* Admin Form */}
        {activeTab === 'admin' && (
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Nom d'utilisateur Administrateur</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Admin"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/80 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Mot de passe</span>
              </label>
              <input
                type="password"
                required
                placeholder="••••"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-amber-500"
              />
              <p className="text-[10px] text-amber-400/80 mt-1.5 italic">
                Identifiants requis : Nom d'utilisateur = Admin | Mot de passe = 9678
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-amber-600/30 transition-all uppercase tracking-wider"
            >
              Se Connecter comme Admin
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
