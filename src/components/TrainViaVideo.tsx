import React, { useState } from 'react';
import {
  Upload,
  Video,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Layers,
  ArrowRight,
  Save,
  Trash2,
  Edit3,
  Play,
  Volume2
} from 'lucide-react';
import { TeachingProfile } from '../types';
import { AIService } from '../services/aiService';
import { StorageService } from '../services/storageService';

interface TrainViaVideoProps {
  onProfileCreated: (profile: TeachingProfile) => void;
  onNavigateToLearn: (profileId: string) => void;
}

export const TrainViaVideo: React.FC<TrainViaVideoProps> = ({
  onProfileCreated,
  onNavigateToLearn
}) => {
  const [profileName, setProfileName] = useState('Prof. Sharma (Hinglish Analogy Style)');
  const [subject, setSubject] = useState('Basic Electrical Engineering');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState(`Namaste dosto! Aaj hum Kirchhoff's Current Law samjhenge bilkul basic se.
Dekho, sabse pehle ek visual analogy socho: ek water pipe junction.
Agar ek 3-way T-junction par 10 litre per second paani enter kar raha hai, aur ek pipe se 6 L/s nikal raha hai, to dusre pipe se compulsory kitna nikalna padega?
Bilkul sahi, 4 L/s! Kyunki paani junction par gayab nahi ho sakta.

Same rule circuit me charge ke liye hota hai:
Conservation of Charge bolta hai ki junction par total incoming current hamesha outgoing current ke barabar hoga.
Formula dekho: Sum of I_in = Sum of I_out.
Yaani Sigma I = 0.
Chalo ek numerical solve karte hain: Agar Node A par 8A enter hua aur 3A leave hua, to remaining branch me 5A leave karega.
Ab ek quick sawal ka jawab do comment me!`);

  const [processingStage, setProcessingStage] = useState<'idle' | 'transcribing' | 'analyzing' | 'completed'>('idle');
  const [analyzedDna, setAnalyzedDna] = useState<TeachingProfile | null>(null);
  const [isEditingDna, setIsEditingDna] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setVideoPreviewUrl(URL.createObjectURL(file));
      setProfileName(file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ') + ' Teaching DNA');
    }
  };

  const handleAnalyze = async () => {
    if (!transcript.trim()) return;

    setProcessingStage('analyzing');
    setAnalyzedDna(null);
    setSavedSuccess(false);

    const user = StorageService.getUser();
    const res = await AIService.analyzeTeachingStyle({
      transcript,
      subject,
      profileName
    });

    setProcessingStage('completed');

    if (res.success && res.teachingDna) {
      const fullProfile: TeachingProfile = {
        id: 'tp-' + Date.now().toString(36),
        userId: user?.id || 'guest',
        name: profileName || 'Custom Faculty Teaching DNA',
        subject: subject || 'Science & Engineering',
        language: res.teachingDna.language || 'Hinglish',
        transcript,
        teaching_structure: res.teachingDna.teaching_structure || [
          'Core Intuition & Big Picture',
          'Vivid Everyday Analogy',
          'Technical Formulation',
          'Governing Law & Formulas',
          'Step-by-Step Calculation',
          'Quick Check'
        ],
        analogy_level: res.teachingDna.analogy_level || 'High',
        example_frequency: res.teachingDna.example_frequency || 'High',
        technical_depth: res.teachingDna.technical_depth || 'Medium',
        explanation_style: res.teachingDna.explanation_style || 'Analogy-First & Step-by-Step',
        tone: res.teachingDna.tone || 'Encouraging & Enthusiastic',
        pace: res.teachingDna.pace || 'Methodical',
        style_summary: res.teachingDna.style_summary || 'Emphasizes physical intuition with water-flow analogies before transitioning to mathematical rigor.',
        created_at: new Date().toISOString(),
        isCustom: true
      };

      setAnalyzedDna(fullProfile);
    }
  };

  const handleSaveProfile = () => {
    if (!analyzedDna) return;
    StorageService.saveTeachingProfile(analyzedDna);
    setSavedSuccess(true);
    onProfileCreated(analyzedDna);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Video className="w-3.5 h-3.5" /> Mode 1: Train Via Video
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Teaching Style Analysis & DNA Extraction
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Upload an educational lecture video or paste its transcript. PowerBot breaks down the instructor’s pedagogical pattern into a reusable <strong>Teaching DNA Profile</strong>.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Column: Upload & Transcript Fallback */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Video Drag and Drop */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-600" />
              <span>1. Upload Faculty Lecture Video</span>
            </h3>

            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-500 rounded-2xl p-6 text-center transition-colors cursor-pointer relative bg-slate-50/50 dark:bg-slate-800/40">
              <input
                type="file"
                accept="video/*,audio/*"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                  <Video className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {selectedFile ? selectedFile.name : 'Drag & drop educational video here or click to browse'}
                </p>
                <p className="text-[11px] text-slate-400">
                  Supports MP4, WebM, MOV, or audio lecture files.
                </p>
              </div>
            </div>

            {videoPreviewUrl && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-black">
                <video src={videoPreviewUrl} controls className="w-full max-h-48 object-cover" />
              </div>
            )}
          </div>

          {/* Transcript Fallback / Editor */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>2. Lecture Transcript</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold">
                Editable Fallback
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              You can review, paste, or refine the educational lecture transcript below.
            </p>

            <textarea
              rows={8}
              value={transcript}
              onChange={e => setTranscript(e.target.value)}
              placeholder="Paste or type lecture transcript here..."
              className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/70 text-xs text-slate-900 dark:text-white font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500 leading-relaxed resize-y"
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Profile Name
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={e => setProfileName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Subject Area
                </label>
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                >
                  <option value="Basic Electrical Engineering">Basic Electrical Engineering</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={processingStage === 'analyzing' || !transcript.trim()}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50 transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              {processingStage === 'analyzing' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Extracting Teaching DNA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Teaching DNA</span>
                </>
              )}
            </button>

          </div>

        </div>

        {/* Right Column: Teaching DNA Result Card */}
        <div className="lg:col-span-6">
          {analyzedDna ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-md space-y-6 animate-in fade-in">
              
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {analyzedDna.name}
                    </h3>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                      Teaching DNA Profile Generated
                    </p>
                  </div>
                </div>

                <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold uppercase">
                  Verified
                </span>
              </div>

              {/* DNA Attributes Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Explanation Style</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 block">
                    {analyzedDna.explanation_style}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Language Match</span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5 block">
                    {analyzedDna.language}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Analogy Level</span>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 block">
                    {analyzedDna.analogy_level}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Technical Depth</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 block">
                    {analyzedDna.technical_depth}
                  </span>
                </div>
              </div>

              {/* Teaching Structure Flow */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-600" /> Extracted Pedagogical Flow
                </h4>
                <div className="space-y-1.5">
                  {analyzedDna.teaching_structure.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-3 text-xs"
                    >
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 flex items-center justify-center font-bold text-[10px] shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Style Summary */}
              <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                  Teaching Persona Summary
                </span>
                <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                  {analyzedDna.style_summary}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={handleSaveProfile}
                  disabled={savedSuccess}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white transition-all shadow-md flex items-center justify-center gap-1.5 ${
                    savedSuccess
                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                      : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
                  }`}
                >
                  {savedSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Saved to Profile Library!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Teaching Profile</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onNavigateToLearn(analyzedDna.id)}
                  className="py-2.5 px-4 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
                >
                  <span>Learn with this Style</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ) : (
            <div className="h-full min-h-[380px] bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="max-w-xs space-y-1">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Ready to Extract Teaching DNA
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Upload a video or use the sample transcript to see the pedagogical flow and profile metrics appear here.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
