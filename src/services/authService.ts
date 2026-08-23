import { User, UserRole, StudentProfile, TeacherProfile } from '../types';
import { StorageService } from './storageService';

export class AuthService {
  static getCurrentUser(): User | null {
    return StorageService.getUser();
  }

  static loginWithDemo(role: UserRole = 'student'): User {
    StorageService.setDemoSelectedRole(role);
    const user = StorageService.getUser();
    return user || this.login(role === 'teacher' ? 'prof.verma@conceptgrow.ai' : 'student.demo@conceptgrow.ai', role);
  }

  static login(email: string, role: UserRole = 'student'): User {
    const user: User = {
      id: 'user-' + Date.now().toString(36),
      email: email.trim(),
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Student Learner',
      role,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      createdAt: new Date().toISOString()
    };

    StorageService.setUser(user);

    // Bootstrap initial profiles if not present
    if (role === 'student') {
      const existing = StorageService.getStudentProfile(user.id);
      if (!existing) {
        const studentProfile: StudentProfile = {
          id: 'sp-' + Date.now().toString(36),
          userId: user.id,
          preferredLanguage: 'en',
          educationLevel: 'Undergraduate Engineering',
          subjects: ['Basic Electrical Engineering', 'Mathematics'],
          learningGoal: 'Master core foundational concepts and ace practice assessments',
          streakDays: 1,
          totalLearningMinutes: 0,
          lastActiveDate: new Date().toISOString().split('T')[0]
        };
        StorageService.saveStudentProfile(studentProfile);
      }
    } else {
      const existingTeacher = StorageService.getTeacherProfile(user.id);
      if (!existingTeacher) {
        const teacherProfile: TeacherProfile = {
          id: 'tp-' + Date.now().toString(36),
          userId: user.id,
          institution: 'Department of Higher Education',
          title: 'Course Instructor',
          department: 'Science & Engineering',
          subjects: ['Basic Electrical Engineering', 'Mathematics', 'Physics']
        };
        StorageService.saveTeacherProfile(teacherProfile);
      }
    }

    return user;
  }

  static signup(params: {
    name: string;
    email: string;
    role: UserRole;
    preferredLanguage?: string;
    educationLevel?: string;
    institution?: string;
    subjects?: string[];
  }): User {
    const user: User = {
      id: 'user-' + Date.now().toString(36),
      email: params.email.trim(),
      name: params.name.trim(),
      role: params.role,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      createdAt: new Date().toISOString()
    };

    StorageService.setUser(user);

    if (params.role === 'student') {
      const studentProfile: StudentProfile = {
        id: 'sp-' + Date.now().toString(36),
        userId: user.id,
        preferredLanguage: (params.preferredLanguage as any) || 'en',
        educationLevel: params.educationLevel || 'Class 11/12 or B.Tech',
        subjects: params.subjects || ['Basic Electrical Engineering', 'Mathematics'],
        learningGoal: 'Build step-by-step conceptual clarity without getting stuck',
        streakDays: 1,
        totalLearningMinutes: 0,
        lastActiveDate: new Date().toISOString().split('T')[0]
      };
      StorageService.saveStudentProfile(studentProfile);
    } else {
      const teacherProfile: TeacherProfile = {
        id: 'tp-' + Date.now().toString(36),
        userId: user.id,
        institution: params.institution || 'Engineering Institute',
        title: 'Faculty / Lecturer',
        department: 'Science & Engineering',
        subjects: params.subjects || ['Basic Electrical Engineering', 'Mathematics']
      };
      StorageService.saveTeacherProfile(teacherProfile);
    }

    return user;
  }

  static logout(): void {
    StorageService.setUser(null);
  }
}
