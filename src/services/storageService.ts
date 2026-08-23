import {
  User,
  StudentProfile,
  TeacherProfile,
  ClassRoom,
  ClassMembership,
  PracticeAttempt,
  DoubtRecord,
  TeachingProfile,
  PowerBotLesson,
  LanguageCode
} from '../types';

import {
  DEMO_STUDENT_USER,
  DEMO_STUDENT_PROFILE,
  DEMO_TEACHER_USER,
  DEMO_TEACHER_PROFILE,
  DEMO_CLASSES,
  DEMO_CLASS_STUDENTS,
  DEMO_TEACHING_PROFILES,
  DEMO_PRACTICE_ATTEMPTS,
  DEMO_DOUBTS
} from '../data/demoData';

const PREFIX = 'cg_';

export class StorageService {
  // Demo mode toggle
  static isDemoMode(): boolean {
    try {
      return localStorage.getItem(PREFIX + 'demo_mode') === 'true';
    } catch {
      return false;
    }
  }

  static setDemoMode(enabled: boolean): void {
    try {
      localStorage.setItem(PREFIX + 'demo_mode', enabled ? 'true' : 'false');
    } catch (e) {
      console.error('Failed to set demo mode', e);
    }
  }

  // Active User
  static getUser(): User | null {
    try {
      if (this.isDemoMode()) {
        const storedRole = localStorage.getItem(PREFIX + 'demo_selected_role') || 'student';
        return storedRole === 'teacher' ? DEMO_TEACHER_USER : DEMO_STUDENT_USER;
      }
      const raw = localStorage.getItem(PREFIX + 'user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  static setUser(user: User | null): void {
    try {
      if (user) {
        localStorage.setItem(PREFIX + 'user', JSON.stringify(user));
      } else {
        localStorage.removeItem(PREFIX + 'user');
      }
    } catch (e) {
      console.error(e);
    }
  }

  static setDemoSelectedRole(role: 'student' | 'teacher'): void {
    try {
      localStorage.setItem(PREFIX + 'demo_selected_role', role);
    } catch (e) {
      console.error(e);
    }
  }

  // Student Profile
  static getStudentProfile(userId?: string): StudentProfile | null {
    try {
      if (this.isDemoMode()) {
        return DEMO_STUDENT_PROFILE;
      }
      const raw = localStorage.getItem(PREFIX + 'student_profile');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  static saveStudentProfile(profile: StudentProfile): void {
    try {
      localStorage.setItem(PREFIX + 'student_profile', JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  }

  // Teacher Profile
  static getTeacherProfile(userId?: string): TeacherProfile | null {
    try {
      if (this.isDemoMode()) {
        return DEMO_TEACHER_PROFILE;
      }
      const raw = localStorage.getItem(PREFIX + 'teacher_profile');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  static saveTeacherProfile(profile: TeacherProfile): void {
    try {
      localStorage.setItem(PREFIX + 'teacher_profile', JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  }

  // Practice Attempts
  static getPracticeAttempts(userId?: string): PracticeAttempt[] {
    try {
      if (this.isDemoMode()) {
        const demoAttemptsRaw = localStorage.getItem(PREFIX + 'demo_attempts');
        if (demoAttemptsRaw) return JSON.parse(demoAttemptsRaw);
        return DEMO_PRACTICE_ATTEMPTS;
      }
      const raw = localStorage.getItem(PREFIX + 'practice_attempts');
      const list: PracticeAttempt[] = raw ? JSON.parse(raw) : [];
      if (userId) {
        return list.filter(a => a.userId === userId);
      }
      return list;
    } catch {
      return [];
    }
  }

  static savePracticeAttempt(attempt: PracticeAttempt): void {
    try {
      if (this.isDemoMode()) {
        const attempts = this.getPracticeAttempts();
        const updated = [attempt, ...attempts];
        localStorage.setItem(PREFIX + 'demo_attempts', JSON.stringify(updated));
        return;
      }
      const raw = localStorage.getItem(PREFIX + 'practice_attempts');
      const list: PracticeAttempt[] = raw ? JSON.parse(raw) : [];
      list.unshift(attempt);
      localStorage.setItem(PREFIX + 'practice_attempts', JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  }

  // Doubts History
  static getDoubts(userId?: string): DoubtRecord[] {
    try {
      if (this.isDemoMode()) {
        const stored = localStorage.getItem(PREFIX + 'demo_doubts');
        if (stored) return JSON.parse(stored);
        return DEMO_DOUBTS;
      }
      const raw = localStorage.getItem(PREFIX + 'doubts');
      const list: DoubtRecord[] = raw ? JSON.parse(raw) : [];
      if (userId) {
        return list.filter(d => d.userId === userId);
      }
      return list;
    } catch {
      return [];
    }
  }

  static saveDoubt(doubt: DoubtRecord): void {
    try {
      if (this.isDemoMode()) {
        const doubts = this.getDoubts();
        const updated = [doubt, ...doubts];
        localStorage.setItem(PREFIX + 'demo_doubts', JSON.stringify(updated));
        return;
      }
      const raw = localStorage.getItem(PREFIX + 'doubts');
      const list: DoubtRecord[] = raw ? JSON.parse(raw) : [];
      list.unshift(doubt);
      localStorage.setItem(PREFIX + 'doubts', JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  }

  // Teaching Profiles (PowerBot)
  static getTeachingProfiles(): TeachingProfile[] {
    try {
      if (this.isDemoMode()) {
        const customRaw = localStorage.getItem(PREFIX + 'custom_teaching_profiles');
        const custom: TeachingProfile[] = customRaw ? JSON.parse(customRaw) : [];
        return [...custom, ...DEMO_TEACHING_PROFILES];
      }
      const raw = localStorage.getItem(PREFIX + 'teaching_profiles');
      const profiles: TeachingProfile[] = raw ? JSON.parse(raw) : [];
      // Always provide baseline starter profiles if user has none saved
      if (profiles.length === 0) {
        return DEMO_TEACHING_PROFILES;
      }
      return profiles;
    } catch {
      return DEMO_TEACHING_PROFILES;
    }
  }

  static saveTeachingProfile(profile: TeachingProfile): void {
    try {
      const existing = this.getTeachingProfiles();
      const filtered = existing.filter(p => p.id !== profile.id);
      const updated = [profile, ...filtered];
      localStorage.setItem(PREFIX + 'teaching_profiles', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  }

  static deleteTeachingProfile(profileId: string): void {
    try {
      const existing = this.getTeachingProfiles();
      const updated = existing.filter(p => p.id !== profileId);
      localStorage.setItem(PREFIX + 'teaching_profiles', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  }

  // PowerBot Saved Lessons
  static getPowerBotLessons(userId?: string): PowerBotLesson[] {
    try {
      const raw = localStorage.getItem(PREFIX + 'powerbot_lessons');
      const list: PowerBotLesson[] = raw ? JSON.parse(raw) : [];
      if (userId) {
        return list.filter(l => l.userId === userId);
      }
      return list;
    } catch {
      return [];
    }
  }

  static savePowerBotLesson(lesson: PowerBotLesson): void {
    try {
      const raw = localStorage.getItem(PREFIX + 'powerbot_lessons');
      const list: PowerBotLesson[] = raw ? JSON.parse(raw) : [];
      list.unshift(lesson);
      localStorage.setItem(PREFIX + 'powerbot_lessons', JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  }

  // Classes (Teacher)
  static getClasses(teacherId?: string): ClassRoom[] {
    try {
      if (this.isDemoMode()) {
        const stored = localStorage.getItem(PREFIX + 'demo_classes');
        if (stored) return JSON.parse(stored);
        return DEMO_CLASSES;
      }
      const raw = localStorage.getItem(PREFIX + 'classes');
      const list: ClassRoom[] = raw ? JSON.parse(raw) : [];
      if (teacherId) {
        return list.filter(c => c.teacherId === teacherId);
      }
      return list;
    } catch {
      return [];
    }
  }

  static saveClass(classRoom: ClassRoom): void {
    try {
      const classes = this.getClasses();
      const filtered = classes.filter(c => c.id !== classRoom.id);
      const updated = [classRoom, ...filtered];
      if (this.isDemoMode()) {
        localStorage.setItem(PREFIX + 'demo_classes', JSON.stringify(updated));
      } else {
        localStorage.setItem(PREFIX + 'classes', JSON.stringify(updated));
      }
    } catch (e) {
      console.error(e);
    }
  }

  static getClassMembers(classId: string): ClassMembership[] {
    try {
      if (this.isDemoMode()) {
        return DEMO_CLASS_STUDENTS.filter(m => m.classId === classId);
      }
      const raw = localStorage.getItem(PREFIX + 'class_members_' + classId);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  // Preferences
  static getLanguage(): LanguageCode {
    try {
      return (localStorage.getItem(PREFIX + 'language') as LanguageCode) || 'en';
    } catch {
      return 'en';
    }
  }

  static setLanguage(lang: LanguageCode): void {
    try {
      localStorage.setItem(PREFIX + 'language', lang);
    } catch (e) {
      console.error(e);
    }
  }

  static getTheme(): 'light' | 'dark' | 'system' {
    try {
      return (localStorage.getItem(PREFIX + 'theme') as 'light' | 'dark' | 'system') || 'system';
    } catch {
      return 'system';
    }
  }

  static setTheme(theme: 'light' | 'dark' | 'system'): void {
    try {
      localStorage.setItem(PREFIX + 'theme', theme);
    } catch (e) {
      console.error(e);
    }
  }

  static getAllUsers(): User[] {
    try {
      const active = this.getUser();
      const demoUsers: User[] = [
        DEMO_STUDENT_USER,
        DEMO_TEACHER_USER,
        {
          id: 'stud-2',
          email: 'priya.s@campus.edu',
          name: 'Priya Sharma',
          role: 'student',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
          createdAt: '2026-08-02T10:15:00Z'
        },
        {
          id: 'stud-3',
          email: 'rohan.m@campus.edu',
          name: 'Rohan Mehra',
          role: 'student',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          createdAt: '2026-08-03T11:20:00Z'
        },
        {
          id: 'stud-4',
          email: 'ananya.g@campus.edu',
          name: 'Ananya Gupta',
          role: 'student',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
          createdAt: '2026-08-04T09:40:00Z'
        }
      ];
      if (active && !demoUsers.some(u => u.id === active.id)) {
        demoUsers.push(active);
      }
      return demoUsers;
    } catch {
      return [DEMO_STUDENT_USER, DEMO_TEACHER_USER];
    }
  }

  // Clear real user data cleanly
  static clearAllRealData(): void {
    try {
      localStorage.removeItem(PREFIX + 'user');
      localStorage.removeItem(PREFIX + 'student_profile');
      localStorage.removeItem(PREFIX + 'teacher_profile');
      localStorage.removeItem(PREFIX + 'practice_attempts');
      localStorage.removeItem(PREFIX + 'doubts');
      localStorage.removeItem(PREFIX + 'classes');
      localStorage.removeItem(PREFIX + 'teaching_profiles');
      localStorage.removeItem(PREFIX + 'powerbot_lessons');
    } catch (e) {
      console.error(e);
    }
  }
}
