import React, { useState } from 'react';
import {
  Users,
  AlertTriangle,
  Award,
  BookOpen,
  Plus,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Video,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { User, TeacherProfile } from '../types';
import { AnalyticsService } from '../services/analyticsService';
import { StorageService } from '../services/storageService';
import { CONCEPTS } from '../data/curatedConcepts';

interface TeacherDashboardProps {
  user: User;
  teacherProfile: TeacherProfile | null;
  onNavigate: (tab: string, contextId?: string) => void;
  onSelectStudent: (studentId: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  user,
  teacherProfile,
  onNavigate,
  onSelectStudent
}) => {
  const classes = StorageService.getClasses();
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'class-ee101');

  const activeClass = classes.find(c => c.id === selectedClassId) || classes[0];
  const classAnalytics = AnalyticsService.getClassAnalytics(selectedClassId);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-indigo-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Faculty Command Center • {user.name}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Classroom Mastery & Learning Gaps
          </h1>
          <p className="text-indigo-200 text-xs sm:text-sm leading-relaxed">
            Monitor real-time student practice attempts, identify aggregate misconceptions, and deploy PowerBot teaching profiles.
          </p>
        </div>
      </div>

      {/* Class Selector & Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Active Class:
          </label>
          <select
            value={selectedClassId}
            onChange={e => setSelectedClassId(e.target.value)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.code}) - {c.studentCount} Students
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('classes')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            Manage Roster
          </button>
          <button
            onClick={() => onNavigate('misconceptions')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center gap-1.5 transition-all"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Diagnose Misconceptions</span>
          </button>
        </div>
      </div>

      {/* 4 Aggregate Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Students */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Enrolled</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {classAnalytics.totalStudents}
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">Invite code: {activeClass?.inviteCode}</p>
          </div>
        </div>

        {/* Active Students (Last 7 Days) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active This Week</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {classAnalytics.activeStudentsCount}
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">Engaged with adaptive practice</p>
          </div>
        </div>

        {/* Students Needing Support */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Needs Support</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-500">
              {classAnalytics.studentsNeedingSupportCount}
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">Prerequisite gaps detected</p>
          </div>
        </div>

        {/* Class Avg Mastery */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Class Avg Mastery</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {classAnalytics.averageMasteryScore}%
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">Across all core concepts</p>
          </div>
        </div>

      </div>

      {/* Main Grid: Student Roster Quick View + Misconceptions Panel */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Student Roster Table */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Student Roster Performance
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Click any student to view detailed learning history</p>
            </div>
            <button
              onClick={() => onNavigate('classes')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              View Full Class ({classAnalytics.students.length})
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {classAnalytics.students.map(s => (
              <div
                key={s.id}
                onClick={() => onSelectStudent(s.id)}
                className="py-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl px-2 -mx-2 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {s.name}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {s.email} • {s.questionsAttempted} attempts
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-slate-900 dark:text-white block">
                      {s.masteryScore}%
                    </span>
                    <span className={`text-[10px] font-bold uppercase ${
                      s.status === 'at_risk' ? 'text-rose-500' : s.status === 'needs_attention' ? 'text-amber-500' : 'text-emerald-500'
                    }`}>
                      {s.status.replace('_', ' ')}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Aggregate Misconceptions Alert Card */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Classroom Misconceptions
              </h2>
            </div>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">
              {classAnalytics.misconceptions.length} Detected
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Patterns extracted from student incorrect answers across adaptive quizzes.
          </p>

          <div className="space-y-3">
            {classAnalytics.misconceptions.map(m => (
              <div
                key={m.id}
                className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950 dark:text-amber-200">
                    {m.conceptName}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200 font-bold">
                    {m.affectedStudentCount} Students
                  </span>
                </div>
                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                  "{m.misconception}"
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Root Cause: {m.rootCause}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('misconceptions')}
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all flex items-center justify-center gap-1.5"
          >
            <span>View Remediation Strategies</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
