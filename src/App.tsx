import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { Career } from './pages/Career';
import { ProjectsListing } from './pages/ProjectsListing';
import { ProjectDetail } from './pages/ProjectDetail';
import { Blog } from './pages/Blog';
import { ConsultationModal } from './components/ConsultationModal';
import { TermsModal } from './components/TermsModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { GeminiChatbot } from './components/GeminiChatbot';
import { AdminCMS } from './pages/AdminCMS';
import { Tools } from './pages/Tools';
import { PROJECTS } from './data/projects';

export type Page =
  | 'home'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'career'
  | 'residential'
  | 'commercial'
  | 'plots'
  | 'blog'
  | 'project-detail'
  | 'tools'
  | 'admin';

const isAdminSubdomain = typeof window !== 'undefined' && (
  window.location.hostname.toLowerCase().startsWith('admin.') ||
  window.location.hostname.toLowerCase() === 'admin'
);

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname.toLowerCase();
      if (hostname.startsWith('admin.') || hostname === 'admin') return 'admin';
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const pathname = window.location.pathname.replace(/^\//, '').toLowerCase();
      const route = hash || pathname;
      if (route === 'admin' || route === 'cms') return 'admin';
    }
    return 'home';
  });
  const [selectedProjectId, setSelectedProjectId] = useState<string>('dlf-camellias');
  const [previousCategory, setPreviousCategory] = useState<'residential' | 'commercial' | 'plots'>('residential');
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [consultationCategory, setConsultationCategory] = useState<string | undefined>(undefined);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  // Sync with browser URL hash & path for clean direct linking & back button support
  useEffect(() => {
    const handleHashChange = () => {
      const hostname = window.location.hostname.toLowerCase();
      const isAdminHost = hostname.startsWith('admin.') || hostname === 'admin';

      const rawHash = window.location.hash.replace('#', '');
      const hash = rawHash.toLowerCase();
      const pathname = window.location.pathname.replace(/^\//, '').toLowerCase();
      const route = hash || pathname;

      if (route.startsWith('project/')) {
        const rawPId = (rawHash ? rawHash.slice(8) : pathname.slice(8)).split('/')[0];
        const normalizedId =
          rawPId === 'westin' ||
          rawPId === 'westin-residences' ||
          rawPId === 'the-westin-residences' ||
          rawPId === 'the-westin-residences-gurugram' ||
          rawPId === 'westin-residences-gurugram'
            ? 'whiteland-westin-residences'
            : rawPId;
        setSelectedProjectId(normalizedId);
        const found = PROJECTS.find((p) => p.id === normalizedId);
        if (found && (found.category === 'residential' || found.category === 'commercial' || found.category === 'plots')) {
          setPreviousCategory(found.category);
        }
        setCurrentPage('project-detail');
      } else if (route === 'about') {
        setCurrentPage('about');
      } else if (route === 'contact') {
        setCurrentPage('contact');
      } else if (route === 'privacy') {
        setCurrentPage('privacy');
      } else if (route === 'career' || route === 'careers') {
        setCurrentPage('career');
      } else if (route.startsWith('residential')) {
        setCurrentPage('residential');
        setPreviousCategory('residential');
      } else if (route.startsWith('commercial')) {
        setCurrentPage('commercial');
        setPreviousCategory('commercial');
      } else if (route.startsWith('plots')) {
        setCurrentPage('plots');
        setPreviousCategory('plots');
      } else if (route === 'blog' || route === 'insights') {
        setCurrentPage('blog');
      } else if (route === 'tools' || route === 'calculators' || route === 'calculator') {
        setCurrentPage('tools');
      } else if (route === 'admin' || route === 'cms') {
        setCurrentPage('admin');
      } else if (route === 'consultation') {
        setIsConsultationOpen(true);
      } else if (isAdminHost && (!route || route === 'home')) {
        setCurrentPage('admin');
      } else {
        setCurrentPage('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  const handleNavigate = (page: Page) => {
    if (page === 'home' && isAdminSubdomain) {
      window.location.href = 'https://aurexestates.co.in';
      return;
    }
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '' : page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProject = (projectId: string) => {
    if (currentPage === 'residential' || currentPage === 'commercial' || currentPage === 'plots') {
      setPreviousCategory(currentPage);
    }
    setSelectedProjectId(projectId);
    setCurrentPage('project-detail');
    window.location.hash = `project/${projectId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenConsultation = (categoryOrProject?: string) => {
    setConsultationCategory(categoryOrProject);
    setIsConsultationOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-warmWhite text-brand-dark antialiased font-sans selection:bg-brand-purple selection:text-white pb-16 md:pb-0">
      {/* Sticky Glassmorphism Header */}
      {currentPage !== 'admin' && (
        <Header
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onOpenConsultation={() => handleOpenConsultation()}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-grow">
        {currentPage === 'home' && (
          <Home
            onOpenConsultation={handleOpenConsultation}
            onNavigate={handleNavigate}
          />
        )}
        {currentPage === 'about' && (
          <About
            onOpenConsultation={() => handleOpenConsultation()}
            onNavigate={handleNavigate}
          />
        )}
        {currentPage === 'contact' && (
          <Contact />
        )}
        {currentPage === 'privacy' && (
          <PrivacyPolicy
            onNavigate={handleNavigate}
            onOpenConsultation={() => handleOpenConsultation()}
          />
        )}
        {currentPage === 'career' && (
          <Career
            onNavigate={handleNavigate}
            onOpenConsultation={() => handleOpenConsultation()}
          />
        )}
        {currentPage === 'residential' && (
          <ProjectsListing
            key={currentPage}
            initialCategory="residential"
            onOpenConsultation={handleOpenConsultation}
            onSelectProject={handleSelectProject}
          />
        )}
        {currentPage === 'commercial' && (
          <ProjectsListing
            key={currentPage}
            initialCategory="commercial"
            onOpenConsultation={handleOpenConsultation}
            onSelectProject={handleSelectProject}
          />
        )}
        {currentPage === 'plots' && (
          <ProjectsListing
            key={currentPage}
            initialCategory="plots"
            onOpenConsultation={handleOpenConsultation}
            onSelectProject={handleSelectProject}
          />
        )}
        {currentPage === 'project-detail' && (
          <ProjectDetail
            projectId={selectedProjectId}
            onBack={() => handleNavigate(previousCategory)}
            onOpenConsultation={handleOpenConsultation}
            onNavigate={handleNavigate}
          />
        )}
        {currentPage === 'blog' && (
          <Blog
            onOpenConsultation={handleOpenConsultation}
            onNavigate={handleNavigate}
          />
        )}
        {currentPage === 'tools' && (
          <Tools
            onNavigateProjects={(cat) => handleNavigate(cat || 'residential')}
            onOpenConsultation={handleOpenConsultation}
          />
        )}
        {currentPage === 'admin' && (
          <AdminCMS
            onNavigate={handleNavigate}
            onSelectProject={handleSelectProject}
          />
        )}
      </main>

      {/* Sophisticated Light Luxury Footer */}
      {currentPage !== 'admin' && (
        <Footer
          onNavigate={handleNavigate}
          onOpenTerms={() => setIsTermsOpen(true)}
        />
      )}

      {/* Mobile App-Style Bottom Navigation Bar (Hidden in Admin CMS) */}
      {currentPage !== 'admin' && (
        <MobileBottomNav
          currentPage={currentPage}
          onNavigate={handleNavigate}
        />
      )}

      {/* Consultation Modal with Category/Project Support */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => {
          setIsConsultationOpen(false);
          setConsultationCategory(undefined);
        }}
        category={consultationCategory}
      />

      {/* Terms Modal */}
      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />

      {/* Floating Gemini AI Property Advisor Chatbot */}
      {currentPage !== 'admin' && <GeminiChatbot onNavigate={handleNavigate} />}
    </div>
  );
};

export default App;
