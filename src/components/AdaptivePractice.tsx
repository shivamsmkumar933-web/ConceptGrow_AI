import React, { useState, useEffect } from 'react';
import {
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  Award,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  Filter,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PracticeQuestion, PracticeAttempt, Concept, QuestionDifficulty } from '../types';
import { CONCEPTS } from '../data/curatedConcepts';
import { PracticeService } from '../services/practiceService';
import { StorageService } from '../services/storageService';

interface AdaptivePracticeProps {
  initialConceptId?: string;
  onNavigateToMap: () => void;
  onNavigateToTutor: (conceptId: string) => void;
}

export const AdaptivePractice: React.FC<AdaptivePracticeProps> = ({
  initialConceptId,
  onNavigateToMap,
  onNavigateToTutor
}) => {
  const [selectedConceptId, setSelectedConceptId] = useState<string>(initialConceptId || CONCEPTS[4].id); // Default to KCL
  const [currentQuestions, setCurrentQuestions] = useState<PracticeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [recentAttempts, setRecentAttempts] = useState<PracticeAttempt[]>([]);
  const [gapWarning, setGapWarning] = useState<{ conceptName: string; prereqName: string } | null>(null);

  const currentConcept = CONCEPTS.find(c => c.id === selectedConceptId) || CONCEPTS[0];

  // Load questions adaptively
  useEffect(() => {
    const user = StorageService.getUser();
    const recommendedDiff = PracticeService.getRecommendedDifficulty(selectedConceptId, user?.id);
    const questions = PracticeService.getQuestionsForConcept(selectedConceptId, recommendedDiff);
    setCurrentQuestions(questions.length > 0 ? questions : PracticeService.getQuestionsForConcept(selectedConceptId));
    setCurrentIndex(0);
    resetQuestionState();
  }, [selectedConceptId]);

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (timerActive) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const resetQuestionState = () => {
    setSelectedOption('');
    setTextAnswer('');
    setIsSubmitted(false);
    setIsCorrect(null);
    setShowHint(false);
    setTimerSeconds(0);
    setTimerActive(true);
    setGapWarning(null);
  };

  const currentQ: PracticeQuestion | undefined = currentQuestions[currentIndex];

  const handleSubmit = () => {
    if (!currentQ || isSubmitted) return;

    const answer = currentQ.type === 'mcq' || currentQ.options ? selectedOption : textAnswer.trim();
    if (!answer) return;

    setTimerActive(false);
    setIsSubmitted(true);

    const isMatch = answer.toLowerCase().trim() === currentQ.correctAnswer.toLowerCase().trim();
    setIsCorrect(isMatch);

    const user = StorageService.getUser();
    const attempt = PracticeService.recordAttempt({
      userId: user?.id || 'guest',
      question: currentQ,
      studentAnswer: answer,
      isCorrect: isMatch,
      timeSpentSeconds: timerSeconds
    });

    setRecentAttempts(prev => [attempt, ...prev]);

    if (isMatch) {
      // Confetti celebration
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.8 }
      });
    } else {
      // Check for learning gap trigger
      const gaps = PracticeService.detectLearningGaps(user?.id);
      const relevantGap = gaps.find(g => g.conceptId === selectedConceptId);
      if (relevantGap) {
        setGapWarning({
          conceptName: relevantGap.conceptName,
          prereqName: relevantGap.prerequisiteName
        });
      }
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < currentQuestions.length) {
      setCurrentIndex(currentIndex + 1);
      resetQuestionState();
    } else {
      // Re-query next adaptive difficulty
      const user = StorageService.getUser();
      const nextDiff = PracticeService.getRecommendedDifficulty(selectedConceptId, user?.id);
      const nextQuestions = PracticeService.getQuestionsForConcept(selectedConceptId, nextDiff);
      setCurrentQuestions(nextQuestions);
      setCurrentIndex(0);
      resetQuestionState();
    }
  };

  const masteries = PracticeService.getConceptMasteries();
  const activeMastery = masteries[selectedConceptId];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      
      {/* Header & Concept Picker */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Zap className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Adaptive Practice Engine
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Dynamic difficulty adjustments based on real attempt accuracy.
          </p>
        </div>

        {/* Concept Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
            Topic:
          </label>
          <select
            value={selectedConceptId}
            onChange={e => setSelectedConceptId(e.target.value)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-hidden"
          >
            {CONCEPTS.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Concept Status & Mastery Gauge */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Mastery Status
          </span>
          <span className="text-sm font-extrabold capitalize text-blue-600 dark:text-blue-400 mt-0.5 block">
            {activeMastery?.status.replace('_', ' ') || 'Not Started'}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Accuracy Score
          </span>
          <span className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5 block">
            {activeMastery ? `${activeMastery.score}%` : '0%'}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Total Attempts
          </span>
          <span className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5 block">
            {activeMastery?.totalAttempts || 0}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Current Difficulty
          </span>
          <span className="text-sm font-extrabold uppercase text-indigo-600 dark:text-indigo-400 mt-0.5 block">
            {currentQ?.difficulty || 'Medium'}
          </span>
        </div>
      </div>

      {/* Prerequisite Learning Gap Alert */}
      {gapWarning && (
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 shadow-xs flex items-start gap-3.5">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
              Prerequisite Gap Diagnosed
            </h4>
            <p className="text-xs text-amber-800 dark:text-amber-300">
              You may benefit from reviewing <strong>{gapWarning.prereqName}</strong> before continuing with <strong>{gapWarning.conceptName}</strong>. Master foundational junction splits to solve KCL without errors!
            </p>
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => onNavigateToTutor(selectedConceptId)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white"
              >
                Ask AI Tutor for Intuitive Analogy
              </button>
              <button
                onClick={onNavigateToMap}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-amber-300 dark:border-amber-700"
              >
                View Learning Dependency Map
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Question Card */}
      {currentQ ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
          
          {/* Card Top Meta */}
          <div className="px-6 py-4 bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                {currentQ.subject}
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Question {currentIndex + 1} of {currentQuestions.length}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs font-mono text-slate-600 dark:text-slate-300">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{timerSeconds}s</span>
              </div>
              <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded ${
                currentQ.difficulty === 'easy'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : currentQ.difficulty === 'medium'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
              }`}>
                {currentQ.difficulty}
              </span>
            </div>
          </div>

          {/* Question Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
              {currentQ.questionText}
            </h2>

            {/* Options for MCQ */}
            {currentQ.options && currentQ.options.length > 0 ? (
              <div className="space-y-2.5">
                {currentQ.options.map((opt, i) => {
                  const isChosen = selectedOption === opt;
                  let optStyle = 'bg-slate-50/70 border-slate-200 dark:bg-slate-800/60 dark:border-slate-700 hover:border-blue-400';
                  
                  if (isSubmitted) {
                    if (opt === currentQ.correctAnswer) {
                      optStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 dark:bg-emerald-950/70 dark:border-emerald-500 dark:text-emerald-200 font-semibold';
                    } else if (isChosen && !isCorrect) {
                      optStyle = 'bg-rose-50 border-rose-500 text-rose-900 dark:bg-rose-950/70 dark:border-rose-500 dark:text-rose-200';
                    }
                  } else if (isChosen) {
                    optStyle = 'bg-blue-50 border-blue-500 text-blue-900 dark:bg-blue-950/70 dark:border-blue-500 dark:text-blue-200 font-semibold shadow-xs';
                  }

                  return (
                    <button
                      key={i}
                      disabled={isSubmitted}
                      onClick={() => setSelectedOption(opt)}
                      className={`w-full text-left p-4 rounded-2xl border text-sm transition-all flex items-center justify-between gap-3 ${optStyle}`}
                    >
                      <span>{opt}</span>
                      {isSubmitted && opt === currentQ.correctAnswer && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}
                      {isSubmitted && isChosen && !isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              // Text or Numerical Input
              <div className="space-y-2">
                <input
                  type="text"
                  disabled={isSubmitted}
                  placeholder="Enter your exact answer (e.g. 8 A or No)"
                  value={textAnswer}
                  onChange={e => setTextAnswer(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/70 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Hint Box */}
            {showHint && currentQ.hints && currentQ.hints.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2 animate-in fade-in">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">Pedagogical Hint:</span>
                  <span>{currentQ.hints[0]}</span>
                </div>
              </div>
            )}

            {/* Post-Submission Explanation */}
            {isSubmitted && (
              <div className={`p-5 rounded-2xl border space-y-2.5 animate-in fade-in ${
                isCorrect
                  ? 'bg-emerald-50/80 border-emerald-200 dark:bg-emerald-950/50 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                  : 'bg-rose-50/80 border-rose-200 dark:bg-rose-950/50 dark:border-rose-800 text-rose-950 dark:text-rose-200'
              }`}>
                <div className="flex items-center gap-2 font-bold text-sm">
                  {isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <XCircle className="w-5 h-5 text-rose-600" />}
                  <span>{isCorrect ? 'Outstanding! Correct.' : 'Incorrect attempt.'}</span>
                </div>
                
                <p className="text-xs leading-relaxed">
                  {currentQ.explanation}
                </p>

                {currentQ.formulaOrRule && (
                  <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/70 font-mono text-xs border border-slate-200/50 dark:border-slate-700/50">
                    Rule: {currentQ.formulaOrRule}
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Action Footer */}
          <div className="px-6 py-4 bg-slate-50/80 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-amber-600 flex items-center gap-1.5"
            >
              <Lightbulb className="w-4 h-4" />
              <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
            </button>

            {!isSubmitted ? (
              <button
                onClick={handleSubmit}
                disabled={!(currentQ.type === 'mcq' || currentQ.options ? selectedOption : textAnswer.trim())}
                className="px-6 py-2.5 rounded-xl font-semibold text-xs text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md shadow-blue-500/20"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20 flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">All questions for this difficulty completed!</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Select another concept or refresh to review.</p>
        </div>
      )}

    </div>
  );
};
