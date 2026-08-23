import React, { useState } from 'react';
import {
  Map,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Zap,
  Brain,
  ShieldCheck,
  Sparkles,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import { Concept, MasteryStatus } from '../types';
import { CONCEPTS, SUBJECTS } from '../data/curatedConcepts';
import { PracticeService } from '../services/practiceService';

interface LearningMapProps {
  onSelectConcept: (conceptId: string) => void;
  onAskTutor: (conceptId: string) => void;
}

export const LearningMap: React.FC<LearningMapProps> = ({
  onSelectConcept,
  onAskTutor
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState('electrical_engineering');
  const [activeConceptId, setActiveConceptId] = useState<string>('kcl');

  const masteries = PracticeService.getConceptMasteries();
  const subjectConcepts = CONCEPTS.filter(c => c.subjectId === selectedSubjectId);
  const activeConcept = CONCEPTS.find(c => c.id === activeConceptId) || subjectConcepts[0];
  const activeMastery = activeConcept ? masteries[activeConcept.id] : null;

  const getStatusColor = (status: MasteryStatus) => {
    switch (status) {
      case 'mastered':
        return 'bg-emerald-500 text-white border-emerald-600 shadow-emerald-500/20';
      case 'strong':
        return 'bg-blue-500 text-white border-blue-600 shadow-blue-500/20';
      case 'needs_practice':
        return 'bg-amber-500 text-white border-amber-600 shadow-amber-500/20';
      case 'developing':
        return 'bg-indigo-400 text-white border-indigo-500 shadow-indigo-400/20';
      default:
        return 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600';
    }
  };

  const getStatusBadge = (status: MasteryStatus) => {
    switch (status) {
      case 'mastered':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Mastered</span>;
      case 'strong':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">Strong</span>;
      case 'needs_practice':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">Needs Practice</span>;
      case 'developing':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">Developing</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400">Not Started</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <Map className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Interactive Concept Learning Map
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Visual dependency tree tracking your real mastery progression and prerequisite links.
          </p>
        </div>

        {/* Subject Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
          {SUBJECTS.map(s => (
            <button
              key={s.id}
              onClick={() => {
                setSelectedSubjectId(s.id);
                const firstConcept = CONCEPTS.find(c => c.subjectId === s.id);
                if (firstConcept) setActiveConceptId(firstConcept.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedSubjectId === s.id
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Interactive Graph + Details Sidebar */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Visual Graph Canvas */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs relative min-h-[460px] flex flex-col justify-between">
          
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pb-4 border-b border-slate-100 dark:border-slate-800">
            <span className="font-semibold uppercase tracking-wider">Dependency Hierarchy (Prerequisites flow left-to-right)</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Mastered</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Gap Alert</span>
            </div>
          </div>

          {/* Interactive Visual Graph Nodes */}
          <div className="py-8 space-y-8 relative">
            
            {subjectConcepts.map((concept, index) => {
              const m = masteries[concept.id];
              const isSelected = activeConceptId === concept.id;
              const hasPrereqs = concept.prerequisites.length > 0;

              return (
                <div key={concept.id} className="relative">
                  
                  {/* Prerequisite Indicator Arrow */}
                  {hasPrereqs && (
                    <div className="absolute -top-5 left-8 text-slate-400 text-[10px] flex items-center gap-1 font-mono">
                      <span>↓ Requires {concept.prerequisites.map(p => CONCEPTS.find(c => c.id === p)?.name.split(' ')[0]).join(', ')}</span>
                    </div>
                  )}

                  <div
                    onClick={() => setActiveConceptId(concept.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 shadow-md ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-md border ${getStatusColor(m?.status || 'not_started')}`}>
                        {m?.status === 'mastered' ? '✓' : index + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            {concept.name}
                          </h3>
                          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                            {concept.code}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {concept.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {getStatusBadge(m?.status || 'not_started')}
                      <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                    </div>
                  </div>

                </div>
              );
            })}

          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Click any node to inspect prerequisite gaps, formulas, and actions.</span>
          </div>

        </div>

        {/* Selected Concept Detail Drawer */}
        {activeConcept && (
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-5">
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {activeConcept.subjectName}
                </span>
                {getStatusBadge(activeMastery?.status || 'not_started')}
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {activeConcept.name}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {activeConcept.description}
              </p>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Accuracy</span>
                <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {activeMastery ? `${activeMastery.score}%` : '0%'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Attempts</span>
                <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {activeMastery?.totalAttempts || 0}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Difficulty</span>
                <span className="text-sm font-extrabold capitalize text-indigo-600 dark:text-indigo-400">
                  {activeConcept.difficulty}
                </span>
              </div>
            </div>

            {/* Prerequisites Section */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600" /> Prerequisite Dependencies
              </h4>
              {activeConcept.prerequisites.length > 0 ? (
                <div className="space-y-1.5">
                  {activeConcept.prerequisites.map(prereqId => {
                    const prereq = CONCEPTS.find(c => c.id === prereqId);
                    const pm = masteries[prereqId];
                    return (
                      <div key={prereqId} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{prereq?.name}</span>
                        {getStatusBadge(pm?.status || 'not_started')}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                  Foundational entry concept (no prior prerequisites required).
                </p>
              )}
            </div>

            {/* Core Formulas */}
            {activeConcept.formulas && activeConcept.formulas.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Governing Formulas
                </h4>
                <div className="space-y-1">
                  {activeConcept.formulas.map((f, i) => (
                    <div key={i} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-xs text-blue-700 dark:text-blue-300">
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="pt-2 grid grid-cols-2 gap-3">
              <button
                onClick={() => onSelectConcept(activeConcept.id)}
                className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-all"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Practice Now</span>
              </button>
              <button
                onClick={() => onAskTutor(activeConcept.id)}
                className="py-2.5 px-4 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center gap-1.5 transition-all"
              >
                <Brain className="w-3.5 h-3.5 text-blue-600" />
                <span>Ask AI Tutor</span>
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
