export type UserRole = 'student' | 'teacher';

export type LanguageCode = 'en' | 'hi' | 'hinglish';

export type ExplanationMode = 'beginner' | 'standard' | 'detailed' | 'visual_analogy';

export type MasteryStatus = 'not_started' | 'developing' | 'needs_practice' | 'strong' | 'mastered';

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export type QuestionType = 'mcq' | 'short' | 'numerical' | 'conceptual';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  preferredLanguage: LanguageCode;
  educationLevel: string; // e.g. "Class 11/12", "Undergraduate B.Tech", "Competitive Exam"
  subjects: string[];
  learningGoal: string;
  streakDays: number;
  totalLearningMinutes: number;
  lastActiveDate: string;
}

export interface TeacherProfile {
  id: string;
  userId: string;
  institution: string;
  title: string;
  department: string;
  subjects: string[];
}

export interface ClassRoom {
  id: string;
  teacherId: string;
  name: string;
  subject: string;
  grade?: string;
  code?: string;
  joinCode?: string;
  inviteCode?: string;
  description?: string;
  studentCount: number;
  createdAt: string;
}

export interface ClassMembership {
  id: string;
  classId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  joinedAt: string;
}

export interface Concept {
  id: string;
  subjectId: string;
  subjectName: string;
  name: string;
  code: string;
  difficulty: QuestionDifficulty;
  description: string;
  prerequisites: string[]; // Concept IDs
  summary: string;
  formulas: string[];
  keyPoints: string[];
  tags: string[];
}

export interface GroundedSource {
  title: string;
  url: string;
  chapter: string;
  license?: string;
}

export interface PracticeQuestion {
  id: string;
  conceptId: string;
  conceptName: string;
  subject: string;
  difficulty: QuestionDifficulty;
  type: QuestionType;
  questionText: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  formulaOrRule?: string;
  hints: string[];
  prerequisiteConceptId?: string;
}

export interface PracticeAttempt {
  id: string;
  userId: string;
  questionId: string;
  conceptId: string;
  conceptName: string;
  subject: string;
  studentAnswer: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
  timestamp: string;
  difficulty: QuestionDifficulty;
  explanation: string;
}

export interface ConceptMastery {
  conceptId: string;
  conceptName: string;
  subject: string;
  status: MasteryStatus;
  score: number; // 0 to 100
  totalAttempts: number;
  correctAttempts: number;
  lastPracticed?: string;
  repeatedMistakesCount: number;
}

export interface DoubtRecord {
  id: string;
  userId: string;
  question: string;
  detectedSubject: string;
  detectedConceptId?: string;
  explanationMode: ExplanationMode;
  language: LanguageCode;
  responseText: string;
  sourcesUsed: GroundedSource[];
  timestamp: string;
}

export interface TeachingStructureStep {
  name: string;
  description: string;
}

export interface TeachingProfile {
  id: string;
  userId: string;
  name: string;
  subject: string;
  language: string;
  transcript?: string;
  teaching_structure: string[];
  analogy_level: 'High' | 'Medium' | 'Low';
  example_frequency: 'High' | 'Medium' | 'Low';
  technical_depth: 'High' | 'Medium' | 'Low';
  explanation_style: string;
  tone: string;
  pace: string;
  style_summary: string;
  created_at: string;
  isCustom?: boolean;
}

export interface VideoTraining {
  id: string;
  userId: string;
  filename: string;
  subject: string;
  concept?: string;
  processing_status: 'idle' | 'uploading' | 'extracting_audio' | 'transcribing' | 'analyzing_dna' | 'completed' | 'failed';
  transcript: string;
  created_at: string;
}

export interface PowerBotScene {
  id: number;
  type: 'intro' | 'analogy' | 'technical' | 'formula' | 'example' | 'quick_check';
  title: string;
  subtitle: string;
  content: string;
  narrationScript: string;
  visualType?: 'circuit' | 'graph' | 'flow' | 'math' | 'concept_card';
  visualData?: any;
  visualBullets?: string[];
  formulaHighlight?: string;
  interactiveCheck?: {
    question: string;
    options: string[];
    correctIndex?: number;
    correct?: string;
    explanation?: string;
  };
  quizQuestion?: {
    question: string;
    options: string[];
    answer: number;
    explanation: string;
  };
}

export interface PowerBotLesson {
  id: string;
  userId: string;
  teachingProfileId: string;
  profileName: string;
  question: string;
  conceptId?: string;
  conceptName?: string;
  scenes: PowerBotScene[];
  fullReadText: string;
  sources: GroundedSource[];
  created_at: string;
}

export interface AIStatusInfo {
  connected: boolean;
  provider: string;
  baseUrl: string;
  configuredModel: string;
  availableModels: string[];
  latencyMs?: number;
  message?: string;
  error?: string;
}

export interface LearningGapAlert {
  id?: string;
  conceptId: string;
  conceptName: string;
  prerequisiteId: string;
  prerequisiteName: string;
  reason: string;
  evidence: string;
  recommendedAction: string;
  timestamp: string;
}

export interface StudentSupportAlert {
  studentId: string;
  studentName: string;
  severity: 'low' | 'medium' | 'high';
  reason: string;
  evidence: string[];
  weakConcepts: string[];
  lastActive: string;
}

export interface MisconceptionInsight {
  conceptId: string;
  conceptName: string;
  subject: string;
  description: string;
  affectedStudentCount: number;
  prerequisiteConcept: string;
  recommendedIntervention: string;
  commonWrongAnswerExample: string;
}
