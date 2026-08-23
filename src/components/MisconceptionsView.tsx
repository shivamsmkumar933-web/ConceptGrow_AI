import React, { useState } from 'react';
import {
  AlertTriangle,
  Users,
  Sparkles,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Video,
  Zap,
  Send
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { AnalyticsService } from '../services/analyticsService';
import { CONCEPTS } from '../data/curatedConcepts';

interface MisconceptionsViewProps {
  onNavigateToPowerBot: () => void;
}

export const MisconceptionsView: React.FC<MisconceptionsViewProps> = ({
  onNavigateToPowerBot
}) => {
  const classes = StorageService.getClasses();
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'class-ee101');
  const [deployedNotice, setDeployedNotice] = useState<string | null>(null);

  const classAnalytics = AnalyticsService.getClassAnalytics(selectedClassId);

  const handleDeployRemediation = (conceptName: string) => {
    setDeployedNotice(`Targeted practice set & PowerBot video recommendation dispatched to all students struggling with ${conceptName}!`);
    setTimeout(() => setDeployedNotice(null), 4000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Aggregated Class Misconceptions
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real patterns diagnosed across student quizzes with root causes and 1-click remediation.
          </p>
        </div>

        {/* Class Selector */}
        <select
          value={selectedClassId}
          onChange={e => setSelectedClassId(e.target.value)}
          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
        >
          {classes.map(c => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.code})
            </option>
          ))}
        </select>
      </div>

      {deployedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{deployedNotice}</span>
        </div>
      )}

      {/* Misconceptions Detailed Cards */}
      <div className="space-y-6">
        {classAnalytics.misconceptions.map(m => (
          <div
            key={m.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-5"
          >
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Concept: {m.conceptName}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  "{m.misconception}"
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>{m.affectedStudentCount} Students Affected</span>
                </span>
              </div>
            </div>

            {/* Diagnostics & Root Cause */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Root Cause Identified
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {m.rootCause}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 block">
                  Recommended Pedagogical Action
                </span>
                <p className="text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed font-medium">
                  {m.suggestedRemediation}
                </p>
              </div>
            </div>

            {/* Affected Students Pills */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Flagged Students:
              </span>
              <div className="flex flex-wrap gap-2">
                {m.affectedStudents.map(studentName => (
                  <span
                    key={studentName}
                    className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700"
                  >
                    {studentName}
                  </span>
                ))}
              </div>
            </div>

            {/* 1-Click Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleDeployRemediation(m.conceptName)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Deploy Targeted Quiz to Flagged Students</span>
              </button>

              <button
                onClick={onNavigateToPowerBot}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-all"
              >
                <Video className="w-3.5 h-3.5 text-indigo-600" />
                <span>Review PowerBot Lesson Model</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
