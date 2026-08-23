import React, { useState } from 'react';
import {
  X,
  User,
  GraduationCap,
  Award,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Send,
  Sparkles
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { AnalyticsService } from '../services/analyticsService';
import { PracticeService } from '../services/practiceService';
import { CONCEPTS } from '../data/curatedConcepts';

interface StudentDetailModalProps {
  studentId: string | null;
  onClose: () => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  studentId,
  onClose
}) => {
  if (!studentId) return null;

  const users = StorageService.getAllUsers();
  const student = users.find(u => u.id === studentId) || {
    id: studentId,
    name: 'Aarav Patel',
    email: 'aarav.patel@college.edu',
    role: 'student' as const,
    createdAt: new Date().toISOString()
  };

  const studentProfile = StorageService.getStudentProfile(studentId);
  const metrics = AnalyticsService.getStudentMetrics(studentId);
  const gaps = PracticeService.detectLearningGaps(studentId);
  const masteries = PracticeService.getConceptMasteries();

  const [teacherNote, setTeacherNote] = useState('');
  const [noteSent, setNoteSent] = useState(false);

  const handleSendNote = () => {
    if (!teacherNote.trim()) return;
    setNoteSent(true);
    setTimeout(() => {
      setTeacherNote('');
      setNoteSent(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-lg">
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {student.name}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold uppercase">
                  {studentProfile?.educationLevel || 'Undergraduate'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {student.email} • Preferred Lang: {(studentProfile?.preferredLanguage || 'en').toUpperCase()}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Scrollable */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Quick Metric Gauges */}
          <div className="grid grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Overall Accuracy</span>
              <span className="text-base font-extrabold text-blue-600 dark:text-blue-400 mt-0.5 block">
                {metrics.overallAccuracy}%
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Mastered</span>
              <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                {metrics.masteredCount} / {CONCEPTS.length}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Attempts</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5 block">
                {metrics.totalAttempts}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Time Spent</span>
              <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5 block">
                {metrics.totalMinutes} min
              </span>
            </div>
          </div>

          {/* Diagnosed Prerequisite Gaps */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Diagnosed Learning Gaps
            </h4>

            {gaps.length > 0 ? (
              <div className="space-y-2">
                {gaps.map(g => (
                  <div
                    key={g.id}
                    className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-1"
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>Struggling with: {g.conceptName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                        Prereq: {g.prerequisiteName}
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-800 dark:text-amber-300">
                      {g.reason}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                No acute prerequisite gaps detected. Student is performing within normal distribution.
              </p>
            )}
          </div>

          {/* Recent Practice Attempts */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Verified Practice History
            </h4>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {metrics.recentAttempts.map(att => (
                <div
                  key={att.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      {att.isCorrect ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-500" />
                      )}
                      <span className="font-bold text-slate-800 dark:text-slate-200">{att.conceptName}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Response: "{att.studentAnswer}"
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {att.timeSpentSeconds || 25}s
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Teacher Guidance / Personalized Intervention Note */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Send Targeted Remediation Recommendation
              </span>
            </div>

            <div className="relative">
              <textarea
                rows={2}
                value={teacherNote}
                onChange={e => setTeacherNote(e.target.value)}
                placeholder="e.g. Review the PowerBot water pipe analogy before Friday's lab..."
                className="w-full p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-hidden resize-none"
              />
              <button
                onClick={handleSendNote}
                disabled={!teacherNote.trim() || noteSent}
                className="mt-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3 h-3" />
                <span>{noteSent ? 'Intervention Sent!' : 'Send to Student'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white rounded-xl"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
