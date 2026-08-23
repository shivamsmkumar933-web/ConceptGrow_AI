import { AIStatusInfo, GroundedSource, LanguageCode, ExplanationMode, TeachingProfile, PowerBotLesson } from '../types';

export class AIService {
  static async checkStatus(): Promise<AIStatusInfo> {
    try {
      const res = await fetch('/api/ai/status');
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      return await res.json();
    } catch (e: any) {
      return {
        connected: false,
        provider: 'Ollama (Local Open-Source)',
        baseUrl: 'http://localhost:11434',
        configuredModel: 'qwen2.5:3b',
        availableModels: [],
        error: e.message || 'Server unreachable',
        message: 'Could not connect to Ollama local engine. Ensure `ollama serve` is running.'
      };
    }
  }

  static async askDoubt(params: {
    question: string;
    language?: LanguageCode;
    explanationMode?: ExplanationMode;
    studentLevel?: string;
    conceptContext?: string;
  }): Promise<{
    success: boolean;
    explanation: string;
    sourcesUsed: GroundedSource[];
    modelUsed?: string;
    durationMs?: number;
    error?: string;
    fallbackContent?: string | null;
  }> {
    try {
      const res = await fetch('/api/ai/doubt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });

      const data = await res.json();
      return data;
    } catch (e: any) {
      return {
        success: false,
        explanation: '',
        sourcesUsed: [],
        error: e.message || 'Network error connecting to local AI server'
      };
    }
  }

  static async analyzeTeachingStyle(params: {
    transcript: string;
    subject?: string;
    profileName?: string;
  }): Promise<{
    success: boolean;
    teachingDna?: Partial<TeachingProfile>;
    error?: string;
    modelUsed?: string;
    notice?: string;
  }> {
    try {
      const res = await fetch('/api/ai/analyze-style', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });

      const data = await res.json();
      return data;
    } catch (e: any) {
      return {
        success: false,
        error: e.message || 'Error communicating with style analysis engine'
      };
    }
  }

  static async generatePowerBotLesson(params: {
    question?: string;
    concept?: string;
    conceptName?: string;
    teachingProfile: TeachingProfile;
    language?: LanguageCode;
  }): Promise<{
    success: boolean;
    lesson?: any;
    sourcesUsed?: GroundedSource[];
    error?: string;
    source?: string;
  }> {
    try {
      const res = await fetch('/api/ai/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });

      const data = await res.json();
      return data;
    } catch (e: any) {
      return {
        success: false,
        error: e.message || 'Error generating PowerBot lesson'
      };
    }
  }

  static async generateAdaptivePractice(params: {
    conceptId: string;
    conceptName?: string;
    difficulty?: string;
    count?: number;
  }): Promise<{
    success: boolean;
    questions?: any[];
    error?: string;
  }> {
    try {
      const res = await fetch('/api/ai/generate-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });

      const data = await res.json();
      return data;
    } catch (e: any) {
      return {
        success: false,
        error: e.message || 'Failed to call practice generator'
      };
    }
  }
}
