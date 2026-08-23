import {
  User,
  StudentProfile,
  TeacherProfile,
  ClassRoom,
  ClassMembership,
  TeachingProfile,
  PracticeAttempt,
  ConceptMastery,
  DoubtRecord
} from '../types';

export const DEMO_STUDENT_USER: User = {
  id: 'demo-student-101',
  email: 'student.demo@conceptgrow.ai',
  name: 'Aarav Patel',
  role: 'student',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  createdAt: '2026-08-01T09:00:00Z'
};

export const DEMO_STUDENT_PROFILE: StudentProfile = {
  id: 'profile-student-101',
  userId: 'demo-student-101',
  preferredLanguage: 'hinglish',
  educationLevel: 'B.Tech 1st Year (Electrical)',
  subjects: ['Basic Electrical Engineering', 'Mathematics', 'Physics'],
  learningGoal: 'Master Circuit Analysis & Calculus for Mid-term Exams',
  streakDays: 4,
  totalLearningMinutes: 185,
  lastActiveDate: '2026-08-23'
};

export const DEMO_TEACHER_USER: User = {
  id: 'demo-teacher-201',
  email: 'prof.verma@conceptgrow.ai',
  name: 'Prof. Rajesh Verma',
  role: 'teacher',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  createdAt: '2026-07-15T08:00:00Z'
};

export const DEMO_TEACHER_PROFILE: TeacherProfile = {
  id: 'profile-teacher-201',
  userId: 'demo-teacher-201',
  institution: 'National Institute of Engineering',
  title: 'Associate Professor',
  department: 'Electrical & Electronics Engineering',
  subjects: ['Basic Electrical Engineering', 'Network Theory']
};

export const DEMO_STUDENT = DEMO_STUDENT_USER;
export const DEMO_TEACHER = DEMO_TEACHER_USER;

export const DEMO_CLASSES: ClassRoom[] = [
  {
    id: 'class-ee-101',
    teacherId: 'demo-teacher-201',
    name: 'EE101: Basic Circuit Theory',
    code: 'EE101',
    subject: 'Basic Electrical Engineering',
    grade: 'Undergraduate 1st Year',
    joinCode: 'CIRC-409',
    inviteCode: 'CIRC-409',
    description: 'Foundations of Circuit Theory: Ohm’s Law, KCL, KVL, Nodal & Mesh Analysis.',
    studentCount: 24,
    createdAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 'class-math-202',
    teacherId: 'demo-teacher-201',
    name: 'MATH101: Engineering Calculus',
    code: 'MATH101',
    subject: 'Mathematics',
    grade: 'Undergraduate 1st Year',
    joinCode: 'CALC-812',
    inviteCode: 'CALC-812',
    description: 'Differential & Integral Calculus for engineering models.',
    studentCount: 28,
    createdAt: '2026-08-05T11:00:00Z'
  }
];

export const DEMO_CLASS_STUDENTS: ClassMembership[] = [
  {
    id: 'mem-1',
    classId: 'class-ee-101',
    studentId: 'demo-student-101',
    studentName: 'Aarav Patel',
    studentEmail: 'student.demo@conceptgrow.ai',
    joinedAt: '2026-08-02T10:00:00Z'
  },
  {
    id: 'mem-2',
    classId: 'class-ee-101',
    studentId: 'stud-2',
    studentName: 'Priya Sharma',
    studentEmail: 'priya.s@campus.edu',
    joinedAt: '2026-08-02T10:15:00Z'
  },
  {
    id: 'mem-3',
    classId: 'class-ee-101',
    studentId: 'stud-3',
    studentName: 'Rohan Mehra',
    studentEmail: 'rohan.m@campus.edu',
    joinedAt: '2026-08-03T11:20:00Z'
  },
  {
    id: 'mem-4',
    classId: 'class-ee-101',
    studentId: 'stud-4',
    studentName: 'Ananya Gupta',
    studentEmail: 'ananya.g@campus.edu',
    joinedAt: '2026-08-04T09:40:00Z'
  }
];

export const DEMO_TEACHING_PROFILES: TeachingProfile[] = [
  {
    id: 'prof-sharma-dna',
    userId: 'system',
    name: 'Prof. Sharma (Hinglish Intuition & Analogies)',
    subject: 'Basic Electrical Engineering',
    language: 'Hinglish',
    teaching_structure: [
      'Core Intuition & Big Picture',
      'Vivid Water Pipe & Everyday Analogy',
      'Technical Definition & Principles',
      'Governing Law & Formula',
      'Step-by-Step Circuit Calculation',
      'Common Misconception Warning',
      'Quick Concept Check'
    ],
    analogy_level: 'High',
    example_frequency: 'High',
    technical_depth: 'Medium',
    explanation_style: 'Analogy-First & Conversational Hinglish',
    tone: 'Encouraging & Enthusiastic',
    pace: 'Methodical & Engaging',
    style_summary: 'Begins with an everyday visual analogy in Hinglish, establishes why the concept matters physically, then walks through formulas with zero jargon before testing with a quick challenge.',
    created_at: '2026-08-10T12:00:00Z'
  },
  {
    id: 'dr-alistair-dna',
    userId: 'system',
    name: 'Dr. Alistair Vance (Rigorous Step-by-Step)',
    subject: 'Basic Electrical Engineering & Physics',
    language: 'English',
    teaching_structure: [
      'Formal First-Principles Statement',
      'Conservation Law Proof',
      'Sign Convention Rigor',
      'System Equations Derivation',
      'Edge-Case Numerical Example',
      'Self-Verification Check'
    ],
    analogy_level: 'Low',
    example_frequency: 'Medium',
    technical_depth: 'High',
    explanation_style: 'Mathematical Rigor & Nodal Derivation',
    tone: 'Academic & Precise',
    pace: 'Steady & Deep',
    style_summary: 'Emphasizes mathematical foundations, formal sign conventions, and conservation theorem proofs. Ideal for students preparing for competitive and deep analytical tests.',
    created_at: '2026-08-12T14:00:00Z'
  },
  {
    id: 'dr-neha-math-dna',
    userId: 'system',
    name: 'Dr. Neha Rao (Visual Calculus Master)',
    subject: 'Mathematics',
    language: 'English',
    teaching_structure: [
      'Geometric Geometric Intuition',
      'Tangent Line Slope Animation',
      'Algebraic Limit Definition',
      'Core Power/Chain Rules',
      'Visual Graph Sketching',
      'Mastery Quick Problem'
    ],
    analogy_level: 'High',
    example_frequency: 'High',
    technical_depth: 'Medium',
    explanation_style: 'Geometric & Visual Intuition',
    tone: 'Supportive & Clear',
    pace: 'Paced & Visual',
    style_summary: 'Transforms abstract calculus limits into tangible slope and area animations. Excellent for students who struggle with formulas without seeing curves.',
    created_at: '2026-08-15T09:30:00Z'
  }
];

export const DEMO_PRACTICE_ATTEMPTS: PracticeAttempt[] = [
  {
    id: 'att-1',
    userId: 'demo-student-101',
    questionId: 'q-junc-1',
    conceptId: 'circuit_junctions',
    conceptName: 'Circuit Junctions & Branch Nodes',
    subject: 'Basic Electrical Engineering',
    studentAnswer: 'A point where at least three circuit branches connect together.',
    isCorrect: true,
    timeSpentSeconds: 24,
    timestamp: '2026-08-20T14:10:00Z',
    difficulty: 'easy',
    explanation: 'Correctly identified essential node definition.'
  },
  {
    id: 'att-2',
    userId: 'demo-student-101',
    questionId: 'q-junc-2',
    conceptId: 'circuit_junctions',
    conceptName: 'Circuit Junctions & Branch Nodes',
    subject: 'Basic Electrical Engineering',
    studentAnswer: 'No',
    isCorrect: true,
    timeSpentSeconds: 15,
    timestamp: '2026-08-20T14:15:00Z',
    difficulty: 'easy',
    explanation: 'Correctly understood zero-capacitance node behavior.'
  },
  {
    id: 'att-3',
    userId: 'demo-student-101',
    questionId: 'q-kcl-1',
    conceptId: 'kcl',
    conceptName: 'Kirchhoff’s Current Law (KCL)',
    subject: 'Basic Electrical Engineering',
    studentAnswer: '8 A',
    isCorrect: true,
    timeSpentSeconds: 32,
    timestamp: '2026-08-21T10:05:00Z',
    difficulty: 'easy',
    explanation: 'Successfully calculated 5A + 3A = 8A.'
  },
  {
    id: 'att-4',
    userId: 'demo-student-101',
    questionId: 'q-kcl-2',
    conceptId: 'kcl',
    conceptName: 'Kirchhoff’s Current Law (KCL)',
    subject: 'Basic Electrical Engineering',
    studentAnswer: '19 A leaving the node',
    isCorrect: false,
    timeSpentSeconds: 58,
    timestamp: '2026-08-22T16:20:00Z',
    difficulty: 'medium',
    explanation: 'Confused entering and leaving signs (added all 4 branches instead of balancing in=out).'
  },
  {
    id: 'att-5',
    userId: 'demo-student-101',
    questionId: 'q-kcl-3',
    conceptId: 'kcl',
    conceptName: 'Kirchhoff’s Current Law (KCL)',
    subject: 'Basic Electrical Engineering',
    studentAnswer: '7 A leaving',
    isCorrect: false,
    timeSpentSeconds: 74,
    timestamp: '2026-08-23T09:12:00Z',
    difficulty: 'hard',
    explanation: 'Missed subtracting the known 4A leaving branch from 7A net entering.'
  },
  {
    id: 'att-6',
    userId: 'demo-student-101',
    questionId: 'q-diff-1',
    conceptId: 'differentiation',
    conceptName: 'Differentiation & Instantaneous Rates',
    subject: 'Mathematics',
    studentAnswer: '12x^3 - 10x',
    isCorrect: true,
    timeSpentSeconds: 28,
    timestamp: '2026-08-22T11:00:00Z',
    difficulty: 'easy',
    explanation: 'Correctly applied polynomial power rule.'
  }
];

export const DEMO_DOUBTS: DoubtRecord[] = [
  {
    id: 'doubt-demo-1',
    userId: 'demo-student-101',
    question: 'Sir current junction par split kaise hota hai and sign convention me galti kyun hoti hai?',
    detectedSubject: 'Basic Electrical Engineering',
    detectedConceptId: 'kcl',
    explanationMode: 'visual_analogy',
    language: 'hinglish',
    responseText: `1. 💡 Simple Core Idea:
Circuit junction ek water pipe T-joint jaisa hai—jitna paani enter karega, utna hi different pipes se bahar niklega. Charge kahin jama nahi ho sakta!

2. 🌊 Intuitive Analogy:
Imagine karo ek 3-way highway junction. Agar 10 cars enter hui aur 6 cars left gayi, to remaining 4 cars ko compulsory right hi jana padega.

3. 📐 Formula & Sign Convention:
Σ I_in = Σ I_out  (Entering = +, Leaving = -)

4. 📝 Quick Rule to Avoid Mistake:
Junction par ek boundary circle banao: Arrow pointing IN is (+), Arrow pointing OUT is (-).
Sum hamesha ZERO hona chahiye!`,
    sourcesUsed: [
      {
        title: 'OpenStax University Physics Vol 2 - Direct-Current Circuits',
        url: 'https://openstax.org/books/university-physics-volume-2/pages/10-3-kirchhoffs-rules',
        chapter: '10.3 Kirchhoff’s Rules'
      }
    ],
    timestamp: '2026-08-22T16:25:00Z'
  }
];
