import React, { useEffect } from 'react';
import { X, Shield } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
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
          aria-label="Close Privacy Policy"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-brand-purple/10 text-brand-purple flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-gray-950">Privacy Policy</h3>
            <p className="text-xs text-gray-500">Effective as of 2026 • Aurex Estates</p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-gray-600 font-light leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
          <p>
            At <strong>Aurex Estates</strong>, your privacy and financial discretion are fundamental to how we operate. As a private real estate advisory firm, we maintain strict confidentiality regarding all client communications, asset inquiries, and personal details.
          </p>

          <h4 className="text-sm font-semibold text-gray-950 uppercase tracking-wider pt-2">
            1. Information Collection
          </h4>
          <p>
            We collect personal identification information (such as your full name, email address, and phone number) solely when you voluntarily submit a consultation request through our website or direct channels.
          </p>

          <h4 className="text-sm font-semibold text-gray-950 uppercase tracking-wider pt-2">
            2. Purpose of Use
          </h4>
          <p>
            Your information is used strictly to understand your advisory requirements, provide market intelligence, and schedule consultations with our senior advisors. We never distribute, sell, lease, or monetize client data to third-party marketing companies or bulk property brokers.
          </p>

          <h4 className="text-sm font-semibold text-gray-950 uppercase tracking-wider pt-2">
            3. Confidentiality & Security
          </h4>
          <p>
            All consultations, portfolio data, and communications are held in strict confidence. We implement industry-standard administrative and technical safeguards to secure your personal data.
          </p>

          <h4 className="text-sm font-semibold text-gray-950 uppercase tracking-wider pt-2">
            4. Contact Us
          </h4>
          <p>
            For questions regarding this policy or your personal data, contact us directly at{' '}
            <a href="mailto:info@aurexestates.co.in" className="text-brand-purple underline font-medium">
              info@aurexestates.co.in
            </a>{' '}
            or visit our corporate office at DLF Corporate Greens, Gurugram.
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
