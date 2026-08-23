import React, { useState, useEffect } from 'react';
import { User, UserRole, AIStatusInfo, LanguageCode } from './types';
import { AuthService } from './services/authService';
import { AIService } from './services/aiService';
import { StorageService } from './services/storageService';
import { DEMO_STUDENT, DEMO_TEACHER, DEMO_STUDENT_PROFILE, DEMO_TEACHER_PROFILE } from './data/demoData';

import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { AIEngineModal } from './components/AIEngineModal';
import { StudentDashboard } from './components/StudentDashboard';
import { AITutor } from './components/AITutor';
import { AdaptivePractice } from './components/AdaptivePractice';
import { LearningMap } from './components/LearningMap';
import { PowerBotHub } from './components/PowerBotHub';
import { ProgressAnalytics } from './components/ProgressAnalytics';
import { TeacherDashboard } from './components/TeacherDashboard';
import { ClassManager } from './components/ClassManager';
import { MisconceptionsView } from './components/MisconceptionsView';
import { StudentDetailModal } from './components/StudentDetailModal';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => AuthService.getCurrentUser());
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  
  // Navigation context state
  const [practiceConceptId, setPracticeConceptId] = useState<string | undefined>(undefined);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authDefaultRole, setAuthDefaultRole] = useState<UserRole>('student');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // AI Engine status state
  const [aiStatus, setAiStatus] = useState<AIStatusInfo>({
    connected: false,
    provider: 'Ollama (Local Open-Source)',
    baseUrl: 'http://localhost:11434',
    configuredModel: 'qwen2.5:3b',
    availableModels: ['qwen2.5:3b', 'llama3.2:3b', 'mistral']
  });

  // Check AI engine status on mount & interval
  const checkAIStatus = async () => {
    const status = await AIService.checkStatus();
    setAiStatus(status);
  };

  useEffect(() => {
    checkAIStatus();
    const interval = setInterval(checkAIStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  // Theme synchronization with html element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Initial user setup: if no user, default to demo student for instantaneous evaluation
  useEffect(() => {
    if (!currentUser) {
      AuthService.loginWithDemo('student');
      setCurrentUser(StorageService.getUser());
    }
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setActiveTab(user.role === 'teacher' ? 'teacher_dashboard' : 'dashboard');
  };

  const handleDemoLogin = (role: UserRole) => {
    const user = AuthService.loginWithDemo(role);
    setCurrentUser(user);
    setActiveTab(role === 'teacher' ? 'teacher_dashboard' : 'dashboard');
  };

  const handleLogout = () => {
    AuthService.logout();
    setCurrentUser(null);
    setActiveTab('landing');
  };

  const handleToggleDemoMode = () => {
    setIsDemoMode(!isDemoMode);
  };

  const handleNavigateToPractice = (conceptId?: string) => {
    setPracticeConceptId(conceptId);
    setActiveTab('practice');
  };

  const handleNavigateToTutor = (conceptId?: string) => {
    setActiveTab('tutor');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased transition-colors">
      
      {/* Universal Navigation Header */}
      <Navbar
        user={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        aiStatus={aiStatus}
        onOpenAIModal={() => setIsAIModalOpen(true)}
        onOpenAuth={(role = 'student') => {
          setAuthDefaultRole(role);
          setIsAuthOpen(true);
        }}
        onLogout={handleLogout}
        language={language}
        onLanguageChange={setLanguage}
        theme={theme}
        onThemeChange={setTheme}
        isDemoMode={isDemoMode}
        onToggleDemoMode={handleToggleDemoMode}
      />

      {/* Main View Body */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Landing Page for Unauthenticated Visitors */}
        {(!currentUser || activeTab === 'landing') && (
          <LandingPage
            onStartStudent={() => {
              handleDemoLogin('student');
            }}
            onStartTeacher={() => {
              handleDemoLogin('teacher');
            }}
            onOpenDemo={() => {
              handleDemoLogin('student');
            }}
            onOpenAIModal={() => setIsAIModalOpen(true)}
            aiConnected={aiStatus.connected}
          />
        )}

        {/* Student Experience */}
        {currentUser && currentUser.role === 'student' && activeTab !== 'landing' && (
          <>
            {activeTab === 'dashboard' && (
              <StudentDashboard
                user={currentUser}
                profile={StorageService.getStudentProfile(currentUser.id)}
                onNavigate={(tab, ctxId) => {
                  if (tab === 'practice') {
                    handleNavigateToPractice(ctxId);
                  } else {
                    setActiveTab(tab);
                  }
                }}
              />
            )}

            {activeTab === 'tutor' && (
              <AITutor
                onStartPractice={handleNavigateToPractice}
                aiStatus={aiStatus}
                onOpenAIModal={() => setIsAIModalOpen(true)}
                initialLanguage={language}
              />
            )}

            {activeTab === 'practice' && (
              <AdaptivePractice
                initialConceptId={practiceConceptId}
                onNavigateToMap={() => setActiveTab('learning_map')}
                onNavigateToTutor={handleNavigateToTutor}
              />
            )}

            {activeTab === 'learning_map' && (
              <LearningMap
                onSelectConcept={handleNavigateToPractice}
                onAskTutor={handleNavigateToTutor}
              />
            )}

            {activeTab === 'powerbot' && (
              <PowerBotHub
                onNavigateToPractice={handleNavigateToPractice}
              />
            )}

            {activeTab === 'analytics' && (
              <ProgressAnalytics
                onPracticeConcept={handleNavigateToPractice}
              />
            )}
          </>
        )}

        {/* Teacher Experience */}
        {currentUser && currentUser.role === 'teacher' && activeTab !== 'landing' && (
          <>
            {activeTab === 'teacher_dashboard' && (
              <TeacherDashboard
                user={currentUser}
                teacherProfile={StorageService.getTeacherProfile(currentUser.id)}
                onNavigate={(tab) => setActiveTab(tab)}
                onSelectStudent={setSelectedStudentId}
              />
            )}

            {activeTab === 'classes' && (
              <ClassManager
                onSelectStudent={setSelectedStudentId}
                onNavigateToMisconceptions={() => setActiveTab('misconceptions')}
              />
            )}

            {activeTab === 'misconceptions' && (
              <MisconceptionsView
                onNavigateToPowerBot={() => setActiveTab('teacher_powerbot')}
              />
            )}

            {activeTab === 'teacher_powerbot' && (
              <PowerBotHub
                onNavigateToPractice={handleNavigateToPractice}
              />
            )}
          </>
        )}

      </main>

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultRole={authDefaultRole}
        onSuccess={handleLoginSuccess}
        onDemoLogin={handleDemoLogin}
      />

      <AIEngineModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        aiStatus={aiStatus}
        onRefreshStatus={checkAIStatus}
      />

      <StudentDetailModal
        studentId={selectedStudentId}
        onClose={() => setSelectedStudentId(null)}
      />

    </div>
  );
};

export default App;
