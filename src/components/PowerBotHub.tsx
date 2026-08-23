import React, { useState } from 'react';
import {
  Video,
  Sparkles,
  Upload,
  BookOpen,
  Layers,
  Trash2,
  ArrowRight,
  Plus,
  Play
} from 'lucide-react';
import { TeachingProfile } from '../types';
import { StorageService } from '../services/storageService';
import { TrainViaVideo } from './TrainViaVideo';
import { LearnViaVideo } from './LearnViaVideo';

interface PowerBotHubProps {
  onNavigateToPractice: (conceptId: string) => void;
}

export const PowerBotHub: React.FC<PowerBotHubProps> = ({
  onNavigateToPractice
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'learn' | 'train' | 'library'>('learn');
  const [selectedProfileId, setSelectedProfileId] = useState<string | undefined>(undefined);
  const [profiles, setProfiles] = useState<TeachingProfile[]>(StorageService.getTeachingProfiles());

  const handleProfileCreated = (profile: TeachingProfile) => {
    setProfiles(StorageService.getTeachingProfiles());
    setSelectedProfileId(profile.id);
    setActiveSubTab('learn');
  };

  const handleDeleteProfile = (id: string) => {
    StorageService.deleteTeachingProfile(id);
    setProfiles(StorageService.getTeachingProfiles());
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      
      {/* Sub Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
          <button
            onClick={() => setActiveSubTab('learn')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'learn'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Learn with Teaching DNA</span>
          </button>

          <button
            onClick={() => setActiveSubTab('train')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'train'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Train New Video DNA</span>
          </button>

          <button
            onClick={() => setActiveSubTab('library')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'library'
                ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Profiles Library ({profiles.length})</span>
          </button>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:flex items-center gap-1 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Flagship Video-to-Pedagogy Engine</span>
        </div>
      </div>

      {/* Tab Views */}
      {activeSubTab === 'learn' && (
        <LearnViaVideo
          initialProfileId={selectedProfileId}
          onNavigateToPractice={onNavigateToPractice}
        />
      )}

      {activeSubTab === 'train' && (
        <TrainViaVideo
          onProfileCreated={handleProfileCreated}
          onNavigateToLearn={profId => {
            setSelectedProfileId(profId);
            setActiveSubTab('learn');
          }}
        />
      )}

      {activeSubTab === 'library' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Saved Teaching DNA Profiles
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Instructor styles extracted from lecture videos and transcripts.
              </p>
            </div>
            <button
              onClick={() => setActiveSubTab('train')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Train New Profile</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profiles.map(p => (
              <div
                key={p.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-400 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      {p.language}
                    </span>
                    {p.isCustom && (
                      <button
                        onClick={() => handleDeleteProfile(p.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete Profile"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {p.name}
                    </h3>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                      {p.subject}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {p.style_summary}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                      <span className="text-slate-400 block text-[10px]">Analogy:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{p.analogy_level}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                      <span className="text-slate-400 block text-[10px]">Depth:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{p.technical_depth}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedProfileId(p.id);
                    setActiveSubTab('learn');
                  }}
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white shadow-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Learn with this Profile</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
