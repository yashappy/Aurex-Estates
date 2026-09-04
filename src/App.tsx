import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { Career } from './pages/Career';
import { ConsultationModal } from './components/ConsultationModal';
import { TermsModal } from './components/TermsModal';

type Page = 'home' | 'about' | 'contact' | 'privacy' | 'career';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [consultationCategory, setConsultationCategory] = useState<string | undefined>(undefined);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  // Sync with browser URL hash for clean direct linking & back button support
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'about') {
        setCurrentPage('about');
      } else if (hash === 'contact') {
        setCurrentPage('contact');
      } else if (hash === 'privacy') {
        setCurrentPage('privacy');
      } else if (hash === 'career' || hash === 'careers') {
        setCurrentPage('career');
      } else if (hash === 'consultation') {
        setIsConsultationOpen(true);
      } else {
        setCurrentPage('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '' : page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenConsultation = (category?: string) => {
    setConsultationCategory(category);
    setIsConsultationOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-warmWhite text-brand-dark antialiased font-sans selection:bg-brand-purple selection:text-white">
      {/* Sticky Glassmorphism Header */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenConsultation={() => handleOpenConsultation()}
      />

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
      </main>

      {/* Sophisticated Light Luxury Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenTerms={() => setIsTermsOpen(true)}
      />

      {/* Consultation Modal with Category Support */}
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
    </div>
  );
};

export default App;
