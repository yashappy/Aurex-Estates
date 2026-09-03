import React, { useEffect } from 'react';
import { X, FileText } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/50 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl my-8 bg-white rounded-2xl p-8 md:p-10 border border-gray-200 shadow-2xl text-gray-900">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 p-2 transition-colors focus:outline-none"
          aria-label="Close Terms and Conditions"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-brand-purple/10 text-brand-purple flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-gray-950">Terms & Conditions</h3>
            <p className="text-xs text-gray-500">Aurex Estates • Advisory Protocol</p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-gray-600 font-light leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
          <p>
            Welcome to the official website of <strong>Aurex Estates</strong>. By accessing or utilizing our advisory platform, you agree to comply with the terms and conditions outlined herein.
          </p>

          <h4 className="text-sm font-semibold text-gray-950 uppercase tracking-wider pt-2">
            1. Advisory Nature of Services
          </h4>
          <p>
            Aurex Estates provides strategic consulting, market intelligence, and advisory guidance for real estate investments and luxury acquisitions. All market insights, corridor analyses, and assessments are intended for informational guidance and strategic decision support.
          </p>

          <h4 className="text-sm font-semibold text-gray-950 uppercase tracking-wider pt-2">
            2. Intellectual Property
          </h4>
          <p>
            The branding, editorial copy, design layout, and curated content published on this website are the proprietary property of Aurex Estates. Unauthorized reproduction or commercial distribution without written consent is strictly prohibited.
          </p>

          <h4 className="text-sm font-semibold text-gray-950 uppercase tracking-wider pt-2">
            3. Disclaimer & Independent Due Diligence
          </h4>
          <p>
            While Aurex Estates exercises meticulous diligence in curating developer relationships and market statistics, property investments carry inherent market variables. Clients are encouraged to perform independent legal and financial due diligence in conjunction with our advisory counsel.
          </p>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-150 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-brand-purple hover:bg-brand-purpleDark text-white text-xs uppercase tracking-wider font-semibold transition-all"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
