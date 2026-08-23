export interface SpeechStatus {
  isPlaying: boolean;
  isPaused: boolean;
  currentRate: number;
  currentText: string;
}

type SpeechListener = (status: SpeechStatus) => void;

export class SpeechService {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static utterance: SpeechSynthesisUtterance | null = null;
  private static listeners: Set<SpeechListener> = new Set();
  private static status: SpeechStatus = {
    isPlaying: false,
    isPaused: false,
    currentRate: 1.0,
    currentText: ''
  };

  static isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  static subscribe(listener: SpeechListener): () => void {
    this.listeners.add(listener);
    listener({ ...this.status });
    return () => {
      this.listeners.delete(listener);
    };
  }

  private static notify(): void {
    this.listeners.forEach(fn => fn({ ...this.status }));
  }

  static speak(text: string, rate: number = 1.0, lang: string = 'en-US'): void {
    if (!this.synth) return;

    this.stop();

    if (!text || text.trim().length === 0) return;

    // Clean text of markdown asterisks and hashtags for smooth auditory flow
    const cleanText = text
      .replace(/[*_#`$]/g, '')
      .replace(/\\[a-zA-Z]+/g, ' ')
      .replace(/https?:\/\/\S+/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = rate;
    utterance.pitch = 1.0;

    // Attempt to match appropriate language voice
    const voices = this.synth.getVoices();
    if (lang === 'hi' || lang === 'hinglish') {
      const hindiVoice = voices.find(v => v.lang.startsWith('hi') || v.name.toLowerCase().includes('india') || v.lang.includes('IN'));
      if (hindiVoice) utterance.voice = hindiVoice;
    } else {
      const engVoice = voices.find(v => (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('David')))) || voices.find(v => v.lang.startsWith('en'));
      if (engVoice) utterance.voice = engVoice;
    }

    utterance.onstart = () => {
      this.status = {
        isPlaying: true,
        isPaused: false,
        currentRate: rate,
        currentText: text
      };
      this.notify();
    };

    utterance.onend = () => {
      this.status = {
        isPlaying: false,
        isPaused: false,
        currentRate: rate,
        currentText: ''
      };
      this.notify();
    };

    utterance.onerror = () => {
      this.status = {
        isPlaying: false,
        isPaused: false,
        currentRate: rate,
        currentText: ''
      };
      this.notify();
    };

    this.utterance = utterance;
    this.synth.speak(utterance);
  }

  static pause(): void {
    if (!this.synth || !this.status.isPlaying) return;
    this.synth.pause();
    this.status.isPaused = true;
    this.notify();
  }

  static resume(): void {
    if (!this.synth || !this.status.isPaused) return;
    this.synth.resume();
    this.status.isPaused = false;
    this.notify();
  }

  static stop(): void {
    if (!this.synth) return;
    this.synth.cancel();
    this.status = {
      isPlaying: false,
      isPaused: false,
      currentRate: this.status.currentRate,
      currentText: ''
    };
    this.notify();
  }

  static setRate(rate: number): void {
    this.status.currentRate = rate;
    if (this.status.isPlaying && this.status.currentText) {
      const currentText = this.status.currentText;
      this.speak(currentText, rate);
    } else {
      this.notify();
    }
  }

  static getStatus(): SpeechStatus {
    return { ...this.status };
  }
}
