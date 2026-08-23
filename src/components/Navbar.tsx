import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  Zap,
  BookOpen,
  Map,
  BarChart3,
  Video,
  Users,
  AlertTriangle,
  Moon,
  Sun,
  Laptop,
  Languages,
  LogOut,
  User as UserIcon,
  HelpCircle,
  PlayCircle
} from 'lucide-react';
import { User, AIStatusInfo, LanguageCode } from '../types';
import { StorageService } from '../services/storageService';

interface NavbarProps {
  user: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  aiStatus: AIStatusInfo;
  onOpenAIModal: () => void;
  onOpenAuth: (defaultRole?: 'student' | 'teacher') => void;
  onLogout: () => void;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  theme: 'light' | 'dark' | 'system';
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  aiStatus,
  onOpenAIModal,
  onOpenAuth,
  onLogout,
  language,
  onLanguageChange,
  theme,
  onThemeChange,
  isDemoMode,
  onToggleDemoMode
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  interface NavItem {
    id: string;
    label: string;
    icon: any;
    badge?: string;
  }

  const studentNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: BookOpen },
    { id: 'tutor', label: 'AI Tutor', icon: Brain },
    { id: 'practice', label: 'Adaptive Practice', icon: Zap },
    { id: 'learning_map', label: 'Learning Map', icon: Map },
    { id: 'powerbot', label: 'PowerBot', icon: Video, badge: 'DNA' },
    { id: 'analytics', label: 'Progress', icon: BarChart3 },
  ];

  const teacherNavItems: NavItem[] = [
    { id: 'teacher_dashboard', label: 'Overview', icon: BookOpen },
    { id: 'classes', label: 'Classes & Students', icon: Users },
    { id: 'misconceptions', label: 'Misconceptions', icon: AlertTriangle },
    { id: 'teacher_powerbot', label: 'PowerBot Profiles', icon: Video },
  ];

  const currentNavItems = user?.role === 'teacher' ? teacherNavItems : studentNavItems;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab(user ? (user.role === 'teacher' ? 'teacher_dashboard' : 'dashboard') : 'landing')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                  Concept<span className="text-blue-600 dark:text-blue-400">Grow</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium -mt-0.5">
                Understand Better. Learn Smarter.
              </p>
            </div>
          </div>

          {/* Navigation Links for Authenticated Users */}
          {user && (
            <nav className="hidden md:flex items-center gap-1">
              {currentNavItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* AI Engine Status Button */}
            <button
              onClick={onOpenAIModal}
              title={aiStatus.connected ? `Ollama Connected (${aiStatus.configuredModel})` : 'Local AI Not Connected (Click for Setup)'}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                aiStatus.connected
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${aiStatus.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="hidden sm:inline">
                {aiStatus.connected ? 'Ollama AI' : 'Local AI Offline'}
              </span>
              <span className="sm:hidden font-mono">
                {aiStatus.connected ? 'AI ✓' : 'AI ✕'}
              </span>
            </button>

            {/* Demo Sandbox Mode Toggle */}
            <button
              onClick={onToggleDemoMode}
              title={isDemoMode ? 'Demo Sandbox Active' : 'Real User Storage'}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isDemoMode
                  ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800'
                  : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span className="hidden sm:inline">{isDemoMode ? 'Demo Sandbox' : 'Real Mode'}</span>
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Select Learning Language"
              >
                <Languages className="w-4 h-4" />
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50">
                  <button
                    onClick={() => { onLanguageChange('en'); setShowLangMenu(false); }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 ${language === 'en' ? 'text-blue-600 font-bold' : 'text-slate-700 dark:text-slate-300'}`}
                  >
                    <span>English</span>
                    {language === 'en' && '✓'}
                  </button>
                  <button
                    onClick={() => { onLanguageChange('hi'); setShowLangMenu(false); }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 ${language === 'hi' ? 'text-blue-600 font-bold' : 'text-slate-700 dark:text-slate-300'}`}
                  >
                    <span>हिन्दी (Hindi)</span>
                    {language === 'hi' && '✓'}
                  </button>
                  <button
                    onClick={() => { onLanguageChange('hinglish'); setShowLangMenu(false); }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 ${language === 'hinglish' ? 'text-blue-600 font-bold' : 'text-slate-700 dark:text-slate-300'}`}
                  >
                    <span>Hinglish (Natural)</span>
                    {language === 'hinglish' && '✓'}
                  </button>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={`Toggle Theme (Current: ${theme})`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Account Profile / Auth Buttons */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>
                  <span className="hidden sm:block text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {user.name.split(' ')[0]}
                  </span>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 uppercase">
                        {user.role} Role
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab(user.role === 'teacher' ? 'teacher_dashboard' : 'dashboard');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <UserIcon className="w-3.5 h-3.5" /> Dashboard
                    </button>

                    <button
                      onClick={() => {
                        onLogout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 border-t border-slate-100 dark:border-slate-700 mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('student')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth('student')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
