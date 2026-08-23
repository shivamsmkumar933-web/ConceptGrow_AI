import {
  PracticeQuestion,
  PracticeAttempt,
  ConceptMastery,
  LearningGapAlert,
  QuestionDifficulty,
  MasteryStatus
} from '../types';
import { CONCEPTS } from '../data/curatedConcepts';
import { PRACTICE_QUESTIONS } from '../data/questionBank';
import { StorageService } from './storageService';

export class PracticeService {
  static getQuestionsForConcept(conceptId: string, difficulty?: QuestionDifficulty): PracticeQuestion[] {
    let list = PRACTICE_QUESTIONS.filter(q => q.conceptId === conceptId);
    if (difficulty) {
      const filtered = list.filter(q => q.difficulty === difficulty);
      if (filtered.length > 0) return filtered;
    }
    return list;
  }

  static getConceptMasteries(userId?: string): Record<string, ConceptMastery> {
    const attempts = StorageService.getPracticeAttempts(userId);
    const masteries: Record<string, ConceptMastery> = {};

    CONCEPTS.forEach(concept => {
      const conceptAttempts = attempts.filter(a => a.conceptId === concept.id);
      const total = conceptAttempts.length;
      const correct = conceptAttempts.filter(a => a.isCorrect).length;
      const wrong = total - correct;
      const accuracy = total > 0 ? (correct / total) * 100 : 0;

      // Check for repeated mistakes
      let repeatedMistakes = 0;
      for (let i = 0; i < Math.min(conceptAttempts.length, 5); i++) {
        if (!conceptAttempts[i].isCorrect) repeatedMistakes++;
      }

      let status: MasteryStatus = 'not_started';
      if (total === 0) {
        status = 'not_started';
      } else if (total < 3) {
        status = 'developing';
      } else if (accuracy < 60 || repeatedMistakes >= 2) {
        status = 'needs_practice';
      } else if (accuracy >= 85 && total >= 3) {
        status = 'mastered';
      } else {
        status = 'strong';
      }

      masteries[concept.id] = {
        conceptId: concept.id,
        conceptName: concept.name,
        subject: concept.subjectName,
        status,
        score: Math.round(accuracy),
        totalAttempts: total,
        correctAttempts: correct,
        lastPracticed: conceptAttempts[0]?.timestamp,
        repeatedMistakesCount: repeatedMistakes
      };
    });

    return masteries;
  }

  static recordAttempt(params: {
    userId: string;
    question: PracticeQuestion;
    studentAnswer: string;
    isCorrect: boolean;
    timeSpentSeconds: number;
  }): PracticeAttempt {
    const attempt: PracticeAttempt = {
      id: 'att-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      userId: params.userId,
      questionId: params.question.id,
      conceptId: params.question.conceptId,
      conceptName: params.question.conceptName,
      subject: params.question.subject,
      studentAnswer: params.studentAnswer,
      isCorrect: params.isCorrect,
      timeSpentSeconds: params.timeSpentSeconds,
      timestamp: new Date().toISOString(),
      difficulty: params.question.difficulty,
      explanation: params.question.explanation
    };

    StorageService.savePracticeAttempt(attempt);
    return attempt;
  }

  // Detect Learning Gaps based on prerequisite dependency graph
  static detectLearningGaps(userId?: string): LearningGapAlert[] {
    const masteries = this.getConceptMasteries(userId);
    const alerts: LearningGapAlert[] = [];

    CONCEPTS.forEach(concept => {
      const mastery = masteries[concept.id];
      if (!mastery || mastery.totalAttempts === 0) return;

      // If student is struggling on this concept
      if (mastery.status === 'needs_practice' || (mastery.totalAttempts >= 2 && mastery.score < 60)) {
        // Check if any prerequisite is weak or not started
        concept.prerequisites.forEach(prereqId => {
          const prereqMastery = masteries[prereqId];
          const prereqConcept = CONCEPTS.find(c => c.id === prereqId);
          if (!prereqConcept) return;

          if (!prereqMastery || prereqMastery.status === 'not_started') {
            alerts.push({
              conceptId: concept.id,
              conceptName: concept.name,
              prerequisiteId: prereqId,
              prerequisiteName: prereqConcept.name,
              reason: `Struggling on ${concept.name} without completing foundational prerequisite ${prereqConcept.name}.`,
              evidence: `Accuracy on ${concept.name} is ${mastery.score}% (${mastery.correctAttempts}/${mastery.totalAttempts}), but prerequisite ${prereqConcept.name} has not been practiced.`,
              recommendedAction: `Review and practice ${prereqConcept.name} first to build a solid intuition.`,
              timestamp: new Date().toISOString()
            });
          } else if (prereqMastery.status === 'needs_practice' || prereqMastery.score < 60) {
            alerts.push({
              conceptId: concept.id,
              conceptName: concept.name,
              prerequisiteId: prereqId,
              prerequisiteName: prereqConcept.name,
              reason: `Weak prerequisite detected: ${prereqConcept.name} is also below mastery threshold.`,
              evidence: `Low accuracy on both ${concept.name} (${mastery.score}%) and prerequisite ${prereqConcept.name} (${prereqMastery.score}%).`,
              recommendedAction: `Strengthen ${prereqConcept.name} to unlock confident problem-solving in ${concept.name}.`,
              timestamp: new Date().toISOString()
            });
          }
        });
      }
    });

    return alerts;
  }

  // Next adaptive difficulty
  static getRecommendedDifficulty(conceptId: string, userId?: string): QuestionDifficulty {
    const masteries = this.getConceptMasteries(userId);
    const mastery = masteries[conceptId];

    if (!mastery || mastery.totalAttempts < 2) return 'easy';
    if (mastery.score >= 80) return 'hard';
    if (mastery.score >= 50) return 'medium';
    return 'easy';
  }
}
