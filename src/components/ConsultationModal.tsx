import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { ContactForm } from './ContactForm';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({ isOpen, onClose, category }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/55 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-11 right-0 md:-right-11 text-white hover:text-brand-purple p-2 transition-colors focus:outline-none"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        <ContactForm className="bg-white" category={category} />
      </div>
    </div>
  );
};
