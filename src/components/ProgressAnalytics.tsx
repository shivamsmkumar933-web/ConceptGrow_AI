import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Target,
  Award,
  Clock,
  Flame,
  AlertTriangle,
  Zap,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { AnalyticsService } from '../services/analyticsService';
import { PracticeService } from '../services/practiceService';
import { StorageService } from '../services/storageService';
import { CONCEPTS } from '../data/curatedConcepts';

interface ProgressAnalyticsProps {
  onPracticeConcept: (conceptId: string) => void;
}

export const ProgressAnalytics: React.FC<ProgressAnalyticsProps> = ({
  onPracticeConcept
}) => {
  const user = StorageService.getUser();
  const metrics = AnalyticsService.getStudentMetrics(user?.id);
  const masteries = PracticeService.getConceptMasteries();
  const gaps = PracticeService.detectLearningGaps(user?.id);

  const masteredCount = metrics.masteredCount;
  const strongCount = metrics.strongCount;
  const developingCount = metrics.developingCount;
  const needsPracticeCount = metrics.needsPracticeCount;
  const notStartedCount = Math.max(0, CONCEPTS.length - (masteredCount + strongCount + developingCount + needsPracticeCount));

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Progress & Mastery Analytics
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real performance tracking computed deterministically from verified practice attempts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            Total Attempts: {metrics.totalAttempts}
          </span>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Overall Accuracy</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 block">
            {metrics.totalAttempts > 0 ? `${metrics.overallAccuracy}%` : '—'}
          </span>
          <p className="text-[11px] text-slate-500">{metrics.correctAttempts} / {metrics.totalAttempts} correct</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Learning Streak</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-500 block">
            {metrics.streakDays} Days
          </span>
          <p className="text-[11px] text-slate-500">Active consistency</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Mastered Concepts</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 block">
            {masteredCount} / {CONCEPTS.length}
          </span>
          <p className="text-[11px] text-slate-500">{Math.round((masteredCount / CONCEPTS.length) * 100)}% of curriculum</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Time Spent</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 block">
            {metrics.totalMinutes} min
          </span>
          <p className="text-[11px] text-slate-500">Focused learning time</p>
        </div>
      </div>

      {/* Mastery Breakdown Distribution Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Curriculum Mastery Distribution
        </h2>

        {/* Stacked Percentage Bar */}
        <div className="h-5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex shadow-inner">
          <div style={{ width: `${(masteredCount / CONCEPTS.length) * 100}%` }} className="bg-emerald-500 h-full transition-all" title="Mastered" />
          <div style={{ width: `${(strongCount / CONCEPTS.length) * 100}%` }} className="bg-blue-500 h-full transition-all" title="Strong" />
          <div style={{ width: `${(developingCount / CONCEPTS.length) * 100}%` }} className="bg-indigo-400 h-full transition-all" title="Developing" />
          <div style={{ width: `${(needsPracticeCount / CONCEPTS.length) * 100}%` }} className="bg-amber-500 h-full transition-all" title="Needs Practice" />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs pt-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-400">Mastered ({masteredCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-slate-600 dark:text-slate-400">Strong ({strongCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-indigo-400" />
            <span className="text-slate-600 dark:text-slate-400">Developing ({developingCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-slate-600 dark:text-slate-400">Needs Practice ({needsPracticeCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700" />
            <span className="text-slate-600 dark:text-slate-400">Not Started ({notStartedCount})</span>
          </div>
        </div>
      </div>

      {/* Detailed Concept Breakdown Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Concept-by-Concept Performance
          </h2>
          <span className="text-xs text-slate-400">Dynamic tracking</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Concept Name</th>
                <th className="py-3.5 px-4">Subject</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Accuracy</th>
                <th className="py-3.5 px-4">Attempts</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {CONCEPTS.map(c => {
                const m = masteries[c.id];
                return (
                  <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-6 font-semibold text-slate-900 dark:text-white">
                      {c.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {c.subjectName}
                    </td>
                    <td className="py-3.5 px-4 capitalize font-bold">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        m?.status === 'mastered'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : m?.status === 'needs_practice'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {m?.status.replace('_', ' ') || 'not started'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {m ? `${m.score}%` : '0%'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                      {m?.totalAttempts || 0}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => onPracticeConcept(c.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 transition-colors"
                      >
                        Practice
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
