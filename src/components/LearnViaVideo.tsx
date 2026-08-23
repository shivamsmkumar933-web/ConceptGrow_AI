import React, { useState, useEffect } from 'react';
import {
  Video,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  FileText,
  Sparkles,
  Layers,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  FastForward,
  HelpCircle,
  Zap,
  BookOpen,
  ArrowRight,
  Sliders,
  Check
} from 'lucide-react';
import { TeachingProfile, PowerBotLesson, PowerBotScene, LanguageCode } from '../types';
import { AIService } from '../services/aiService';
import { StorageService } from '../services/storageService';
import { SpeechService } from '../services/speechService';
import { CONCEPTS } from '../data/curatedConcepts';

interface LearnViaVideoProps {
  initialProfileId?: string;
  initialConceptId?: string;
  onNavigateToPractice: (conceptId: string) => void;
}

export const LearnViaVideo: React.FC<LearnViaVideoProps> = ({
  initialProfileId,
  initialConceptId,
  onNavigateToPractice
}) => {
  const profiles = StorageService.getTeachingProfiles();
  const [selectedProfileId, setSelectedProfileId] = useState<string>(initialProfileId || profiles[0]?.id || 'sharma_hinglish');
  const [conceptQuery, setConceptQuery] = useState('Kirchhoff’s Current Law (KCL)');
  const [targetConceptId, setTargetConceptId] = useState<string>('kcl');
  const [loading, setLoading] = useState(false);
  const [lesson, setLesson] = useState<PowerBotLesson | null>(null);
  
  // Learning View Mode: 'video' | 'read' | 'listen' | 'visual'
  const [viewMode, setViewMode] = useState<'video' | 'read' | 'listen' | 'visual'>('video');

  // Video-Style Player State
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Interactive Visual Simulation state for KCL / Circuits
  const [simCurrentIn, setSimCurrentIn] = useState(10);
  const [simCurrentBranch1, setSimCurrentBranch1] = useState(4);
  const simCurrentBranch2 = Math.max(0, simCurrentIn - simCurrentBranch1);

  const activeProfile = profiles.find(p => p.id === selectedProfileId) || profiles[0];

  // Auto-generate lesson on initial load or profile switch
  const handleGenerate = async (queryText?: string, profileIdToUse?: string) => {
    const q = queryText || conceptQuery;
    const prof = profiles.find(p => p.id === (profileIdToUse || selectedProfileId)) || profiles[0];
    if (!q.trim() || !prof) return;

    setLoading(true);
    setLesson(null);
    SpeechService.stop();
    setIsPlaying(false);

    const res = await AIService.generatePowerBotLesson({
      conceptName: q,
      teachingProfile: prof,
      language: (prof.language.toLowerCase().includes('hin') ? 'hinglish' : 'en') as LanguageCode
    });

    setLoading(false);

    if (res.success && res.lesson) {
      setLesson(res.lesson);
      setCurrentSceneIdx(0);
      setQuizSubmitted(false);
      setSelectedQuizOption(null);
    }
  };

  useEffect(() => {
    handleGenerate();
  }, [selectedProfileId]);

  // Handle Speech Narration for current scene
  const playCurrentSceneSpeech = () => {
    if (!lesson || !lesson.scenes[currentSceneIdx]) return;
    const scene = lesson.scenes[currentSceneIdx];
    SpeechService.stop();
    setIsPlaying(true);
    SpeechService.speak(
      scene.narrationScript,
      playbackSpeed,
      activeProfile?.language?.toLowerCase().includes('hin') ? 'hi' : 'en-US'
    );
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      SpeechService.stop();
      setIsPlaying(false);
    } else {
      playCurrentSceneSpeech();
    }
  };

  const handleNextScene = () => {
    if (!lesson) return;
    SpeechService.stop();
    setIsPlaying(false);
    if (currentSceneIdx + 1 < lesson.scenes.length) {
      setCurrentSceneIdx(currentSceneIdx + 1);
    }
  };

  const handlePrevScene = () => {
    if (!lesson) return;
    SpeechService.stop();
    setIsPlaying(false);
    if (currentSceneIdx > 0) {
      setCurrentSceneIdx(currentSceneIdx - 1);
    }
  };

  const currentScene: PowerBotScene | undefined = lesson?.scenes[currentSceneIdx];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      
      {/* Header & Style Picker */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Video className="w-3.5 h-3.5" /> Mode 2: Learn Via Video
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Teaching DNA Re-Enactment Player
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Choose your instructor's Teaching DNA. PowerBot regenerates any topic into structured multi-scene lessons, interactive animated simulations, and voice narration.
          </p>
        </div>

        {/* Profile Selector */}
        <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 shrink-0 min-w-[280px]">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Selected Teaching DNA:
          </label>
          <select
            value={selectedProfileId}
            onChange={e => setSelectedProfileId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
          >
            {profiles.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.language})
              </option>
            ))}
          </select>
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
            <span>Style: {activeProfile?.explanation_style}</span>
            <span className="text-indigo-600 font-semibold">{activeProfile?.analogy_level} Analogy</span>
          </div>
        </div>
      </div>

      {/* Query Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={conceptQuery}
            onChange={e => setConceptQuery(e.target.value)}
            placeholder="Type any concept (e.g. Kirchhoff's Current Law, Differentiation, Ohm's Law)"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={() => handleGenerate()}
          disabled={loading}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Generating Lesson...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate Lesson</span>
            </>
          )}
        </button>
      </div>

      {/* View Mode Switcher Tabs */}
      <div className="flex items-center justify-center sm:justify-start gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl max-w-fit">
        <button
          onClick={() => setViewMode('video')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            viewMode === 'video'
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>Interactive Video Player</span>
        </button>

        <button
          onClick={() => setViewMode('visual')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            viewMode === 'visual'
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Visual Simulation</span>
        </button>

        <button
          onClick={() => setViewMode('read')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            viewMode === 'read'
              ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Read Structured Guide</span>
        </button>
      </div>

      {/* MAIN LESSON CONTAINER */}
      {lesson ? (
        <div>
          {/* 1. VIDEO-STYLE LESSON PLAYER */}
          {viewMode === 'video' && currentScene && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in">
              
              {/* Scene Display Canvas */}
              <div className="relative min-h-[380px] sm:min-h-[440px] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 flex flex-col justify-between overflow-hidden">
                
                {/* Subtle visual grid */}
                <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px] opacity-15 pointer-events-none" />

                {/* Scene Header */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/10 text-blue-300 text-xs font-bold backdrop-blur-xs">
                      Scene {currentSceneIdx + 1} of {lesson.scenes.length}
                    </span>
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      {currentScene.title}
                    </span>
                  </div>

                  <span className="text-xs font-mono text-slate-400">
                    Teaching DNA: {activeProfile.name}
                  </span>
                </div>

                {/* Scene Main Visual Content */}
                <div className="relative z-10 my-8 space-y-6 max-w-3xl">
                  
                  {/* Big Visual Headline */}
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                    {currentScene.title}
                  </h2>

                  {/* Bullet Highlights Animated */}
                  {currentScene.visualBullets && (
                    <div className="space-y-3">
                      {currentScene.visualBullets.map((bullet, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-sm text-slate-100 flex items-start gap-3 shadow-lg"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-relaxed font-medium">{bullet}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Formula Display if Present */}
                  {currentScene.formulaHighlight && (
                    <div className="p-4 rounded-2xl bg-blue-600/30 border border-blue-400/40 backdrop-blur-md font-mono text-lg text-blue-200 text-center font-bold tracking-wider">
                      {currentScene.formulaHighlight}
                    </div>
                  )}

                  {/* Interactive Scene Check Quiz (on Final Scene) */}
                  {currentScene.interactiveCheck && (
                    <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                        <HelpCircle className="w-4 h-4" /> Quick Check
                      </div>
                      <p className="text-sm font-semibold text-white">
                        {currentScene.interactiveCheck.question}
                      </p>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {currentScene.interactiveCheck.options.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setSelectedQuizOption(opt);
                              setQuizSubmitted(true);
                            }}
                            className={`p-3 rounded-xl text-xs font-semibold text-left border transition-all ${
                              quizSubmitted && opt === currentScene.interactiveCheck?.correct
                                ? 'bg-emerald-500/40 border-emerald-400 text-white'
                                : selectedQuizOption === opt
                                ? 'bg-blue-500/40 border-blue-400 text-white'
                                : 'bg-white/5 border-white/10 hover:bg-white/15 text-slate-200'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      {quizSubmitted && (
                        <div className="text-xs text-emerald-300 font-semibold pt-1">
                          ✓ Correct Answer: {currentScene.interactiveCheck.correct}
                        </div>
                      )}
                    </div>
                  )}

                </div>

                {/* Subtitle / Script Box */}
                <div className="relative z-10 p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                  🗣️ "{currentScene.narrationScript}"
                </div>

              </div>

              {/* Player Bottom Control Bar */}
              <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                
                {/* Playback Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTogglePlay}
                    className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                  </button>

                  <button
                    onClick={handlePrevScene}
                    disabled={currentSceneIdx === 0}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 text-slate-700 dark:text-slate-200"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleNextScene}
                    disabled={currentSceneIdx + 1 >= lesson.scenes.length}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 text-slate-700 dark:text-slate-200"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1 ml-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <span>Speed:</span>
                    {[0.75, 1.0, 1.25, 1.5].map(spd => (
                      <button
                        key={spd}
                        onClick={() => {
                          setPlaybackSpeed(spd);
                          if (isPlaying) playCurrentSceneSpeech();
                        }}
                        className={`px-2 py-1 rounded text-[11px] ${
                          playbackSpeed === spd
                            ? 'bg-blue-600 text-white font-bold'
                            : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scene Step Navigation Dots */}
                <div className="flex items-center gap-1.5">
                  {lesson.scenes.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        SpeechService.stop();
                        setIsPlaying(false);
                        setCurrentSceneIdx(idx);
                      }}
                      className={`h-2 rounded-full transition-all ${
                        currentSceneIdx === idx ? 'w-8 bg-blue-600' : 'w-2 bg-slate-300 dark:bg-slate-700'
                      }`}
                      title={s.title}
                    />
                  ))}
                </div>

                {/* Practice CTA Button */}
                <button
                  onClick={() => onNavigateToPractice(targetConceptId)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Take Practice Quiz</span>
                </button>

              </div>

            </div>
          )}

          {/* 2. VISUAL SIMULATION MODE */}
          {viewMode === 'visual' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-md space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Interactive Circuit Junction Simulation (KCL)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Adjust the incoming current and branch resistance to watch charge conservation in action.
                  </p>
                </div>
                <span className="font-mono text-xs px-2.5 py-1 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                  Σ I_in = Σ I_out
                </span>
              </div>

              {/* Visual SVG Circuit Simulation */}
              <div className="h-72 bg-slate-950 rounded-2xl relative flex items-center justify-center p-4 overflow-hidden">
                
                {/* SVG Wiring Canvas */}
                <svg className="w-full h-full" viewBox="0 0 600 300">
                  {/* Incoming Wire */}
                  <line x1="50" y1="150" x2="300" y2="150" stroke="#3b82f6" strokeWidth="8" strokeLinecap="round" />
                  {/* Outgoing Branch 1 (Top) */}
                  <line x1="300" y1="150" x2="520" y2="70" stroke="#10b981" strokeWidth="6" strokeLinecap="round" />
                  {/* Outgoing Branch 2 (Bottom) */}
                  <line x1="300" y1="150" x2="520" y2="230" stroke="#8b5cf6" strokeWidth="6" strokeLinecap="round" />

                  {/* Junction Node */}
                  <circle cx="300" cy="150" r="14" fill="#ef4444" className="animate-pulse" />
                  <text x="300" y="190" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">Node A</text>

                  {/* Labels */}
                  <text x="140" y="130" fill="#60a5fa" fontSize="14" fontWeight="bold">I_in = {simCurrentIn} A (Entering)</text>
                  <text x="440" y="55" fill="#34d399" fontSize="14" fontWeight="bold">I_1 = {simCurrentBranch1} A (Leaving)</text>
                  <text x="440" y="270" fill="#a78bfa" fontSize="14" fontWeight="bold">I_2 = {simCurrentBranch2} A (Leaving)</text>
                </svg>

              </div>

              {/* Sliders Control */}
              <div className="grid sm:grid-cols-2 gap-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Total Incoming Current (I_in):</span>
                    <span className="font-mono text-blue-600 font-bold">{simCurrentIn} Amperes</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="20"
                    value={simCurrentIn}
                    onChange={e => setSimCurrentIn(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Branch 1 Split ($I_1$):</span>
                    <span className="font-mono text-emerald-600 font-bold">{simCurrentBranch1} Amperes</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={simCurrentIn}
                    value={simCurrentBranch1}
                    onChange={e => setSimCurrentBranch1(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 space-y-1">
                <span className="font-bold block">Intuitive Conservation Principle:</span>
                <p>
                  No matter how you adjust I_in or I_1, the remaining branch I_2 dynamically balances to exactly <strong>{simCurrentBranch2} A</strong> so that (I_in - I_1 - I_2 = 0).
                </p>
              </div>

            </div>
          )}

          {/* 3. READ STRUCTURED GUIDE MODE */}
          {viewMode === 'read' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-md space-y-6 animate-in fade-in">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Teaching DNA Structured Guide • {activeProfile.name}
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {lesson.title}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Language: {lesson.language} • Target Level: Undergraduate
                </p>
              </div>

              <div className="space-y-8">
                {lesson.scenes.map((scene, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                        {idx + 1}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {scene.title}
                      </h3>
                    </div>

                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 pl-8">
                      {scene.narrationScript}
                    </p>

                    {scene.formulaHighlight && (
                      <div className="ml-8 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-xs text-blue-700 dark:text-blue-300 font-semibold">
                        {scene.formulaHighlight}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <Sparkles className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Generate a lesson to start learning with PowerBot
          </p>
        </div>
      )}

    </div>
  );
};
