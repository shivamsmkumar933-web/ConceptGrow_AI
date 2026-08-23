import React from 'react';
import {
  Flame,
  Target,
  Award,
  Clock,
  ArrowRight,
  Zap,
  Brain,
  Video,
  Map,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { User, StudentProfile } from '../types';
import { AnalyticsService } from '../services/analyticsService';
import { PracticeService } from '../services/practiceService';
import { CONCEPTS } from '../data/curatedConcepts';

interface StudentDashboardProps {
  user: User;
  profile: StudentProfile | null;
  onNavigate: (tab: string, contextId?: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  profile,
  onNavigate
}) => {
  const metrics = AnalyticsService.getStudentMetrics(user.id);
  const gaps = PracticeService.detectLearningGaps(user.id);

  const hasActivity = metrics.totalAttempts > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 text-white p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-blue-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome back, {user.name.split(' ')[0]}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to grow your understanding today?
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
            {hasActivity
              ? 'Continue your personalized learning path or practice key prerequisite concepts.'
              : 'Your learning journey starts here. Take your first adaptive practice question or ask the AI Tutor.'}
          </p>
        </div>
      </div>

      {/* Real Performance Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Streak */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Learning Streak
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-500">
              <Flame className="w-5 h-5 fill-current" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {metrics.streakDays} {metrics.streakDays === 1 ? 'Day' : 'Days'}
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {hasActivity ? 'Daily active practice' : 'Start your streak today'}
            </p>
          </div>
        </div>

        {/* Accuracy */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Practice Accuracy
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {hasActivity ? `${metrics.overallAccuracy}%` : '—'}
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {hasActivity ? `${metrics.correctAttempts} of ${metrics.totalAttempts} correct` : 'Not enough data yet'}
            </p>
          </div>
        </div>

        {/* Mastered */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Concepts Mastered
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {metrics.masteredCount} <span className="text-sm font-normal text-slate-400">/ {CONCEPTS.length}</span>
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {metrics.needsPracticeCount > 0 ? `${metrics.needsPracticeCount} need practice` : 'Progress tracking active'}
            </p>
          </div>
        </div>

        {/* Learning Time */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Learning Time
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {metrics.totalMinutes} <span className="text-sm font-normal text-slate-400">min</span>
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Total conceptual engagement
            </p>
          </div>
        </div>

      </div>

      {/* Diagnosed Learning Gaps Banner (if any) */}
      {gaps.length > 0 && (
        <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-300 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-amber-950 dark:text-amber-200">
                Prerequisite Gap Diagnosed on {gaps[0].conceptName}
              </h3>
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed max-w-2xl">
                {gaps[0].reason}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('practice', gaps[0].prerequisiteId)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-sm shrink-0 transition-all"
          >
            Review {gaps[0].prerequisiteName}
          </button>
        </div>
      )}

      {/* Main Row: Continue Learning + Quick Activities */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Continue Learning / Suggested Activity */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Today’s Suggested Activities
            </h2>
            <span className="text-xs text-slate-400 font-medium">Personalized</span>
          </div>

          <div className="space-y-3">
            
            {/* Action 1: Adaptive Practice */}
            <div
              onClick={() => onNavigate('practice', 'kcl')}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-800/40 cursor-pointer transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Adaptive Circuit Practice (KCL & Ohm's Law)
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Solve tailored questions that adapt to your accuracy level.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>

            {/* Action 2: PowerBot */}
            <div
              onClick={() => onNavigate('powerbot')}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-800/40 cursor-pointer transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      Learn with PowerBot Teaching DNA
                    </h4>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 font-bold uppercase">
                      New
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Generate multi-scene animated video lessons matching your faculty's style.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </div>

            {/* Action 3: AI Tutor Doubt */}
            <div
              onClick={() => onNavigate('tutor')}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50/50 dark:bg-slate-800/40 cursor-pointer transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Ask AI Tutor Any Doubt
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Ask in English, Hindi, or Hinglish with verified citations.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
            </div>

          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Practice History
            </h2>
            <span className="text-xs text-slate-400 font-medium">Real-time</span>
          </div>

          {metrics.recentAttempts.length > 0 ? (
            <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
              {metrics.recentAttempts.map(att => (
                <div
                  key={att.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${att.isCorrect ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span className="font-bold text-slate-800 dark:text-slate-200">{att.conceptName}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Answer: "{att.studentAnswer}" • {att.timeSpentSeconds || 20}s
                    </p>
                  </div>
                  <span className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                    att.isCorrect
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {att.isCorrect ? 'Correct' : 'Needs Review'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 space-y-2">
              <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No practice attempts recorded yet.</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Take a practice quiz to generate your progress timeline.</p>
              <button
                onClick={() => onNavigate('practice')}
                className="mt-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white"
              >
                Start First Practice
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
