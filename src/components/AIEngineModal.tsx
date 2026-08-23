import React, { useState } from 'react';
import {
  X,
  Cpu,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  Terminal,
  Server,
  Zap,
  ExternalLink
} from 'lucide-react';
import { AIStatusInfo } from '../types';
import { AIService } from '../services/aiService';

interface AIEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
  aiStatus: AIStatusInfo;
  onRefreshStatus: () => void;
}

export const AIEngineModal: React.FC<AIEngineModalProps> = ({
  isOpen,
  onClose,
  aiStatus,
  onRefreshStatus
}) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleTestConnection = async () => {
    setChecking(true);
    await onRefreshStatus();
    setChecking(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${aiStatus.connected ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'}`}>
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Local AI Engine Status
                {aiStatus.connected ? (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Connected
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Offline / Standby
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                100% Free, Private Open-Source AI via Ollama
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

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Status Overview Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">AI Provider:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {aiStatus.provider}
                </span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Base URL:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">
                  {aiStatus.baseUrl}
                </span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Configured Model:</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {aiStatus.configuredModel}
                </span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Latency:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {aiStatus.latencyMs ? `${aiStatus.latencyMs} ms` : 'N/A'}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {aiStatus.connected
                  ? 'Ready for dynamic AI Tutor and PowerBot lesson generation.'
                  : 'Curated question bank, RAG knowledge, and interactive lessons remain fully functional.'}
              </span>
              <button
                onClick={handleTestConnection}
                disabled={checking}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
                {checking ? 'Testing...' : 'Test Connection'}
              </button>
            </div>
          </div>

          {/* Quick Setup Instructions */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-blue-600" /> Fast 3-Step Setup for Local AI
            </h3>

            <div className="space-y-2.5 text-xs">
              
              {/* Step 1 */}
              <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    1. Install Ollama (Free on Mac, Windows, Linux)
                  </span>
                  <a
                    href="https://ollama.com/download"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1 text-[11px]"
                  >
                    Download Ollama <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Ollama runs open-weight AI models locally on your CPU/GPU without sending data outside your machine.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    2. Pull lightweight model in your terminal:
                  </span>
                  <button
                    onClick={() => copyToClipboard('ollama run qwen2.5:3b', 'cmd1')}
                    className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
                  >
                    {copied === 'cmd1' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copied === 'cmd1' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <code className="block bg-slate-900 text-emerald-400 p-2 rounded-lg font-mono text-[11px]">
                  ollama run qwen2.5:3b
                </code>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-1">
                  Other great options: <code className="text-slate-700 dark:text-slate-300">ollama run llama3.2:3b</code> or <code className="text-slate-700 dark:text-slate-300">ollama run mistral</code>
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">
                  3. Start Ollama service & click Test Connection
                </span>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Ollama listens on <code className="text-slate-700 dark:text-slate-300 font-mono">http://localhost:11434</code> automatically.
                </p>
              </div>

            </div>
          </div>

          {/* Privacy & Zero-Cost Guarantee */}
          <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 flex items-start gap-2.5 text-xs text-blue-900 dark:text-blue-200">
            <Zap className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p>
              <strong>Zero Paid API Keys Required:</strong> ConceptGrow AI does not rely on paid commercial API quotas that expire. All non-AI features (adaptive practice, curriculum maps, teaching profile flows) work 100% out of the box.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-xl shadow-xs"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
