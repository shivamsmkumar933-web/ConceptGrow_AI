import {
  StudentSupportAlert,
  MisconceptionInsight,
  PracticeAttempt
} from '../types';
import { StorageService } from './storageService';
import { PracticeService } from './practiceService';
import { CONCEPTS } from '../data/curatedConcepts';

export interface StudentRosterItem {
  id: string;
  name: string;
  email: string;
  masteryScore: number;
  questionsAttempted: number;
  status: 'mastered' | 'strong' | 'needs_attention' | 'at_risk';
  lastActive: string;
}

export interface MisconceptionCardItem {
  id: string;
  conceptName: string;
  misconception: string;
  rootCause: string;
  affectedStudentCount: number;
  affectedStudents: string[];
  suggestedRemediation: string;
}

export class AnalyticsService {
  static getStudentMetrics(userId?: string) {
    const attempts = StorageService.getPracticeAttempts(userId);
    const masteries = PracticeService.getConceptMasteries(userId);
    const profile = StorageService.getStudentProfile(userId);

    const totalAttempts = attempts.length;
    const correctAttempts = attempts.filter(a => a.isCorrect).length;
    const overallAccuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

    let masteredCount = 0;
    let strongCount = 0;
    let needsPracticeCount = 0;
    let developingCount = 0;

    Object.values(masteries).forEach(m => {
      if (m.status === 'mastered') masteredCount++;
      else if (m.status === 'strong') strongCount++;
      else if (m.status === 'needs_practice') needsPracticeCount++;
      else if (m.status === 'developing') developingCount++;
    });

    const totalMinutes = profile?.totalLearningMinutes || Math.round(attempts.reduce((acc, curr) => acc + (curr.timeSpentSeconds || 30), 0) / 60);

    return {
      streakDays: profile?.streakDays || (totalAttempts > 0 ? 1 : 0),
      totalAttempts,
      correctAttempts,
      overallAccuracy,
      masteredCount,
      strongCount,
      needsPracticeCount,
      developingCount,
      totalMinutes,
      masteries,
      recentAttempts: attempts.slice(0, 10)
    };
  }

  static getClassAnalytics(classId: string) {
    const members = StorageService.getClassMembers(classId);
    const classes = StorageService.getClasses();
    const currentClass = classes.find(c => c.id === classId) || classes[0];

    const students: StudentRosterItem[] = [
      {
        id: 'demo-student-101',
        name: 'Aarav Patel',
        email: 'student.demo@conceptgrow.ai',
        masteryScore: 68,
        questionsAttempted: 6,
        status: 'needs_attention',
        lastActive: '10 mins ago'
      },
      {
        id: 'stud-2',
        name: 'Priya Sharma',
        email: 'priya.s@campus.edu',
        masteryScore: 92,
        questionsAttempted: 14,
        status: 'mastered',
        lastActive: 'Today'
      },
      {
        id: 'stud-3',
        name: 'Rohan Mehra',
        email: 'rohan.m@campus.edu',
        masteryScore: 48,
        questionsAttempted: 8,
        status: 'at_risk',
        lastActive: 'Yesterday'
      },
      {
        id: 'stud-4',
        name: 'Ananya Gupta',
        email: 'ananya.g@campus.edu',
        masteryScore: 78,
        questionsAttempted: 11,
        status: 'strong',
        lastActive: '2 days ago'
      }
    ];

    const misconceptions: MisconceptionCardItem[] = [
      {
        id: 'misc-1',
        conceptName: 'Kirchhoff’s Current Law (KCL)',
        misconception: 'Adding entering and leaving branch currents directly without algebraic sign convention',
        rootCause: 'Confusion between scalar magnitude additions and algebraic direction sum = 0',
        affectedStudentCount: 3,
        affectedStudents: ['Aarav Patel', 'Rohan Mehra', 'Ananya Gupta'],
        suggestedRemediation: 'Review the PowerBot Water Pipe Analogy and apply junction node boundary circle checks.'
      },
      {
        id: 'misc-2',
        conceptName: 'Differentiation & Instantaneous Rates',
        misconception: 'Retaining constants as derivatives rather than zero during rate of change calculation',
        rootCause: 'Treating d/dx as a multiplier rather than an instantaneous slope operator',
        affectedStudentCount: 2,
        affectedStudents: ['Rohan Mehra', 'Aarav Patel'],
        suggestedRemediation: 'Geometric graph visualization of flat horizontal functions having slope = 0.'
      }
    ];

    const totalStudents = currentClass?.studentCount || students.length;
    const activeStudentsCount = students.length;
    const studentsNeedingSupportCount = students.filter(s => s.status === 'at_risk' || s.status === 'needs_attention').length;
    const averageMasteryScore = Math.round(students.reduce((acc, curr) => acc + curr.masteryScore, 0) / students.length);

    return {
      totalStudents,
      activeStudentsCount,
      studentsNeedingSupportCount,
      averageMasteryScore,
      students,
      misconceptions
    };
  }

  static getTeacherClassInsights(classId: string) {
    return this.getClassAnalytics(classId);
  }
}
