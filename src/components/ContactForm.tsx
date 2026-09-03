import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, Building } from 'lucide-react';

interface ContactFormProps {
  className?: string;
  source?: string;
  category?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({ className = '', category }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    emailAddress: '',
    message: '',
  });

  useEffect(() => {
    if (category) {
      setFormData((prev) => ({
        ...prev,
        message: prev.message || `I would like to explore advisory options and available inventory for ${category}.`,
      }));
    }
  }, [category]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phoneNumber.trim() || !formData.emailAddress.trim()) {
      setError('Please provide your full name, phone number, and email address.');
      return;
    }

    setIsSubmitting(true);
    // Smooth luxury submission response
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  if (isSubmitted) {
    return (
      <div className={`bg-white rounded-2xl p-8 md:p-12 text-center border border-gray-200/90 shadow-xl animate-fadeIn ${className}`}>
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6 border border-emerald-200 shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-gray-950 mb-3">Enquiry Received</h3>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-md mx-auto mb-8 font-light">
          Thank you. Your consultation request {category ? `for ${category}` : ''} has been received. An Aurex Estates senior advisor will connect with you shortly.
        </p>
        <div className="pt-4 border-t border-gray-100 flex justify-center">
          <button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({ fullName: '', phoneNumber: '', emailAddress: '', message: '' });
            }}
            className="px-6 py-2.5 rounded-full border border-gray-300 hover:border-brand-purple text-xs uppercase tracking-widest text-gray-700 hover:text-brand-purple transition-all font-semibold"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl p-8 md:p-12 border border-gray-200/90 shadow-xl ${className}`}>
      <div className="mb-8">
        {category && (
          <div className="mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-[11px] font-semibold uppercase tracking-wider">
              <Building className="w-3 h-3" />
              <span>{category}</span>
            </span>
          </div>
        )}
        <h3 className="text-2xl md:text-3xl font-bold text-gray-950 tracking-tight">
          Request Consultation
        </h3>
      </div>

      {error && (
        <div className="mb-6 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-700 font-medium mb-2">
            Full Name <span className="text-brand-purple">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            placeholder="e.g. Vikram Malhotra"
            className="w-full px-4 py-3.5 rounded-xl bg-gray-50/70 border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:bg-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-700 font-medium mb-2">
              Phone Number <span className="text-brand-purple">*</span>
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              placeholder="+91 98765 43210"
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50/70 border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:bg-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-700 font-medium mb-2">
              Email Address <span className="text-brand-purple">*</span>
            </label>
            <input
              type="email"
              name="emailAddress"
              value={formData.emailAddress}
              onChange={handleChange}
              required
              placeholder="name@domain.com"
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50/70 border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:bg-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-700 font-medium mb-2">
            Message <span className="text-gray-400 text-[10px] tracking-normal font-normal">(Optional)</span>
          </label>
          <textarea
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            placeholder={
              category
                ? `Specific requirements for ${category} (budget, preferred corridor, or investment timeline)...`
                : 'Tell us about your property goals, preferred corridor, or investment timeline...'
            }
            className="w-full px-4 py-3.5 rounded-xl bg-gray-50/70 border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:bg-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all resize-none"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-8 rounded-xl bg-brand-purple hover:bg-brand-purpleDark text-white text-xs uppercase tracking-[0.2em] font-bold shadow-md shadow-brand-purple/25 hover:shadow-lg hover:shadow-brand-purple/35 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
            <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </form>
    </div>
  );
};
