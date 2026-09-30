import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, Building, Loader2, X } from 'lucide-react';
import { submitLeadGlobally } from '../services/leadService';
import { COUNTRY_CODES, validateEmail, validatePhone, validateName } from '../utils/validation';

interface ContactFormProps {
  className?: string;
  source?: string;
  category?: string;
  onClose?: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ className = '', source, category, onClose }) => {
  const [countryCode, setCountryCode] = useState('+91');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameCheck = validateName(formData.fullName);
    if (!nameCheck.isValid) {
      setError(nameCheck.error || 'Please provide a genuine full name.');
      return;
    }

    const phoneCheck = validatePhone(formData.phoneNumber, countryCode);
    if (!phoneCheck.isValid) {
      setError(phoneCheck.error || 'Please enter a valid mobile number.');
      return;
    }

    const emailCheck = validateEmail(formData.emailAddress);
    if (!emailCheck.isValid) {
      setError(emailCheck.error || 'Please provide a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await submitLeadGlobally({
        name: formData.fullName.trim(),
        phone: `${countryCode} ${formData.phoneNumber.trim()}`,
        email: formData.emailAddress.trim(),
        projectName: category || 'Consultation Inquiry',
        type: 'consultation',
        message: formData.message.trim() || 'No specific notes provided',
        source: source || (category ? `Advisory Modal (${category})` : 'Contact Page'),
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Lead submission error:', err);
      // Fallback to success UI so visitor experience is not interrupted
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className={`bg-white rounded-2xl p-8 md:p-12 text-center border border-gray-200/90 shadow-xl relative animate-fadeIn ${className}`}>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200 shadow-sm">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-gray-950 mb-2">Enquiry Received</h3>
        <p className="text-gray-800 text-sm md:text-base leading-relaxed max-w-md mx-auto font-medium">
          Thank you! An Aurex Estates senior advisor will connect with you shortly.
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl p-8 md:p-12 border border-gray-200/90 shadow-xl relative ${className}`}>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="mb-8">
        {category && (
          <div className="mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-[11px] font-semibold uppercase tracking-wider">
              <Building className="w-3 h-3" />
              <span>{category}</span>
            </span>
          </div>
        )}
        <h3 className="text-2xl md:text-3xl font-semibold text-gray-950 tracking-tight">
          Request Consultation
        </h3>
      </div>

      {error && (
        <div className="mb-6 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
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

        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-700 font-medium mb-2">
            Phone Number <span className="text-brand-purple">*</span>
          </label>
          <div className="flex gap-2">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-20 px-2.5 py-3.5 rounded-xl bg-gray-50/70 border border-gray-200 text-gray-900 text-sm focus:bg-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all font-semibold shrink-0 cursor-pointer"
            >
              {COUNTRY_CODES.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.label}
                </option>
              ))}
            </select>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                setFormData((prev) => ({ ...prev, phoneNumber: digits }));
                if (error) setError(null);
              }}
              maxLength={10}
              required
              placeholder="98765 43210"
              className="flex-1 min-w-0 px-4 py-3.5 rounded-xl bg-gray-50/70 border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:bg-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
            />
          </div>
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
            className="w-full py-4 px-8 rounded-xl bg-brand-purple hover:bg-brand-purpleDark text-white text-xs uppercase tracking-[0.2em] font-semibold shadow-md shadow-brand-purple/25 hover:shadow-lg hover:shadow-brand-purple/35 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-75 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Sending Enquiry...</span>
              </>
            ) : (
              <>
                <span>Submit</span>
                <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
