import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  RotateCcw,
  UserCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendChatMessageToGemini, type ChatMessage } from '../services/geminiService';
import { submitLeadGlobally } from '../services/leadService';

interface UiMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  chips?: string[];
  showContactForm?: boolean;
}

interface GeminiChatbotProps {
  onNavigate?: (page: any) => void;
}

const INITIAL_GREETING: UiMessage = {
  id: 'msg-init',
  role: 'model',
  text: "Hello! I'm Aura, your real estate AI assistant.",
  timestamp: 'Just now',
  chips: ['Residential', 'Commercial', 'Plots'],
};

export const GeminiChatbot: React.FC<GeminiChatbotProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<UiMessage[]>([INITIAL_GREETING]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  // Collected Lead State
  const [collectedCategory, setCollectedCategory] = useState<string>('');
  const [collectedGoal, setCollectedGoal] = useState<string>('');
  const [collectedBudget, setCollectedBudget] = useState<string>('');
  const [collectedTimeline, setCollectedTimeline] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [isLeadSubmitted, setIsLeadSubmitted] = useState<boolean>(false);
  const [leadFormError, setLeadFormError] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [messages, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen]);

  const handleClearChat = () => {
    setMessages([INITIAL_GREETING]);
    setCollectedCategory('');
    setCollectedGoal('');
    setCollectedBudget('');
    setCollectedTimeline('');
    setClientName('');
    setClientPhone('');
    setClientEmail('');
    setIsLeadSubmitted(false);
    setLeadFormError('');
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsgId = 'user-' + Date.now();
    const newMessages: UiMessage[] = [
      ...messages,
      {
        id: userMsgId,
        role: 'user',
        text,
        timestamp: 'Just now',
      },
    ];

    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    // Track structured selections
    const lower = text.toLowerCase();
    let nextChips: string[] | undefined = undefined;
    let triggerContactForm = false;

    // Detect Category
    if (!collectedCategory && (lower.includes('commercial') || lower.includes('residential') || lower.includes('plot') || lower.includes('land'))) {
      const cat = lower.includes('commercial') ? 'Commercial' : lower.includes('residential') ? 'Residential' : 'Plots';
      setCollectedCategory(cat);
      nextChips = ['Investment', 'End-Use'];
    } 
    // Detect Goal / Purpose
    else if (!collectedGoal && (lower.includes('investment') || lower.includes('end-use') || lower.includes('end use') || lower.includes('self-use') || lower.includes('self use') || lower.includes('living'))) {
      const goal = lower.includes('investment') ? 'Investment' : 'End-Use';
      setCollectedGoal(goal);
      nextChips = ['Under ₹1.5 Cr', '₹1.5 - 5 Cr', '₹5 - 15 Cr', 'Above ₹15 Cr'];
    }
    // Detect Budget
    else if (!collectedBudget && (lower.includes('cr') || lower.includes('lakh') || lower.includes('under') || lower.includes('above') || lower.includes('budget'))) {
      setCollectedBudget(text);
      nextChips = ['Immediate / Ready to Move', '1 - 3 Months', '3 - 6 Months', 'Just Exploring'];
    }
    // Detect Timeline
    else if (!collectedTimeline && (lower.includes('immediate') || lower.includes('ready') || lower.includes('month') || lower.includes('exploring') || lower.includes('soon'))) {
      setCollectedTimeline(text);
      triggerContactForm = true;
    } else if (collectedCategory && collectedGoal && (collectedBudget || lower.includes('cr'))) {
      triggerContactForm = true;
    }

    try {
      // Build API history for Gemini
      const geminiHistory: ChatMessage[] = newMessages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const reply = await sendChatMessageToGemini(geminiHistory);

      setMessages((prev) => [
        ...prev,
        {
          id: 'model-' + Date.now(),
          role: 'model',
          text: reply,
          timestamp: 'Just now',
          chips: nextChips,
          showContactForm: triggerContactForm && !isLeadSubmitted,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: 'model-' + Date.now(),
          role: 'model',
          text: 'Thank you for sharing your preferences. Please provide your contact details below so our senior advisor can share tailored unit options with you.',
          timestamp: 'Just now',
          chips: nextChips,
          showContactForm: !isLeadSubmitted,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChipClick = (chipText: string) => {
    handleSendMessage(chipText);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      setLeadFormError('Please enter your name');
      return;
    }
    const cleanPhone = clientPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setLeadFormError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLeadFormError('');
    setIsLeadSubmitted(true);

    // Submit lead globally to Google Sheets / Excel, email alert & CMS store
    submitLeadGlobally({
      name: clientName.trim(),
      phone: clientPhone.trim(),
      email: clientEmail.trim(),
      projectName: collectedCategory ? `${collectedCategory} Advisory` : 'AI Advisory Inquiry',
      type: 'chatbot',
      source: 'AI Luxury Advisory Chatbot',
      message: `Goal: ${collectedGoal || 'Advisory'} | Budget: ${collectedBudget || 'Not specified'} | Timeline: ${collectedTimeline || 'Immediate'}`,
    });

    // Save lead to localStorage for consultation integration
    try {
      const existingLeads = JSON.parse(localStorage.getItem('aurex_chatbot_leads') || '[]');
      existingLeads.push({
        name: clientName.trim(),
        phone: clientPhone.trim(),
        email: clientEmail.trim() || undefined,
        category: collectedCategory || 'General Inquiry',
        goal: collectedGoal || 'Advisory',
        budget: collectedBudget || 'Not specified',
        timeline: collectedTimeline || 'Immediate',
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('aurex_chatbot_leads', JSON.stringify(existingLeads));
    } catch {
      // ignore local storage errors
    }

    // Add confirmation message
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: 'model-lead-confirmed-' + Date.now(),
          role: 'model',
          text: `Thank you, ${clientName.trim()}. A senior advisor will connect with you at ${clientPhone.trim()} shortly with project details.`,
          timestamp: 'Just now',
        },
      ]);
    }, 300);
  };

  return (
    <>
      {/* =========================================================================
          FLOATING TRIGGER BUTTON: Bottom-Right with Pulsing Badge
      ========================================================================= */}
      {/* =========================================================================
          FLOATING TRIGGER BUTTON: Bottom-Right with Pulsing Badge
      ========================================================================= */}
      <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 flex items-center gap-3">
        {!isOpen && hasUnread && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-brand-purple to-purple-600 text-white text-xs font-semibold shadow-lg shadow-brand-purple/30 border border-brand-purpleLight/40 cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Chat with Aura</span>
          </motion.div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Aura Chatbot"
          className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 active:scale-95 border-2 overflow-hidden ${
            isOpen
              ? 'bg-gray-900 text-white border-gray-700'
              : 'bg-gradient-to-tr from-brand-purple to-purple-600 text-white hover:from-purple-600 hover:to-brand-purpleLight border-brand-purpleLight shadow-brand-purple/35 hover:shadow-brand-purple/50'
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <img
                src="/images/aura-mascot.png"
                alt="Aura Real Estate Advisor"
                className="w-full h-full object-cover object-top scale-105"
              />
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-brand-purple border-2 border-white rounded-full shadow-xs">
                <span className="absolute inset-0 rounded-full bg-brand-purple animate-ping opacity-75" />
              </span>
            </>
          )}
        </button>
      </div>

      {/* =========================================================================
          CHATBOT MODAL WINDOW: Clean, Minimal, Uncluttered UI
      ========================================================================= */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-20 md:bottom-24 right-3 sm:right-6 z-50 w-[calc(100vw-24px)] sm:w-[400px] h-[540px] sm:h-[590px] max-h-[84vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          >
            {/* Clean Header: Aura with Online Indicator & Mascot Avatar in Brand Purple */}
            <div className="bg-gradient-to-r from-brand-purple to-purple-700 text-white px-4 py-3.5 sm:px-5 sm:py-4 flex items-center justify-between border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full border-2 border-white/60 overflow-hidden shrink-0 shadow-sm bg-black/20">
                  <img
                    src="/images/aura-mascot.png"
                    alt="Aura Mascot"
                    className="w-full h-full object-cover object-top scale-110"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-purple-800 rounded-full" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold tracking-tight">Aura</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                    <span className="text-[11px] text-purple-100 font-medium">Online</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearChat}
                  title="Clear chat"
                  aria-label="Clear chat"
                  className="w-8 h-8 rounded-full hover:bg-white/15 text-purple-100 hover:text-white flex items-center justify-center transition-colors active:scale-90"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close"
                  aria-label="Close"
                  className="w-8 h-8 rounded-full hover:bg-white/15 text-purple-100 hover:text-white flex items-center justify-center transition-colors active:scale-90"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 text-xs sm:text-sm bg-gray-50/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-2 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {msg.role === 'model' && (
                      <div className="w-7 h-7 rounded-full overflow-hidden border border-brand-purple shrink-0 mt-0.5 shadow-2xs bg-purple-100">
                        <img
                          src="/images/aura-mascot.png"
                          alt="Aura"
                          className="w-full h-full object-cover object-top scale-110"
                        />
                      </div>
                    )}

                    <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      {/* Clean Message Bubble */}
                      <div
                        className={`rounded-2xl px-4 py-3 leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-brand-purple text-white rounded-br-xs shadow-xs'
                            : 'bg-white text-gray-900 border border-gray-200/90 rounded-bl-xs shadow-2xs'
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.text}</p>
                      </div>

                      {/* Clean Interactive Option Chips */}
                      {msg.chips && msg.chips.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                          {msg.chips.map((chip, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleChipClick(chip)}
                              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-purple-50 text-gray-800 hover:text-brand-purple border border-gray-200 hover:border-brand-purple/40 text-xs font-medium shadow-2xs transition-all active:scale-95"
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      )}

                  {/* Clean Contact Form at the End */}
                  {msg.showContactForm && !isLeadSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full max-w-[95%] mt-3 p-4 rounded-2xl bg-white border border-brand-purple/20 shadow-sm"
                    >
                      <div className="flex items-center gap-2 mb-3 text-brand-purple">
                        <UserCheck className="w-4 h-4 text-brand-purple" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          Request Project Details
                        </span>
                      </div>

                      <form onSubmit={handleLeadSubmit} className="space-y-2.5">
                        <div>
                          <input
                            type="text"
                            placeholder="Name *"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-xs text-gray-900 focus:bg-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition-all"
                          />
                        </div>

                        <div>
                          <input
                            type="tel"
                            placeholder="Mobile Number *"
                            value={clientPhone}
                            onChange={(e) => setClientPhone(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-xs text-gray-900 focus:bg-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition-all"
                          />
                        </div>

                        <div>
                          <input
                            type="email"
                            placeholder="Email Address"
                            value={clientEmail}
                            onChange={(e) => setClientEmail(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-xs text-gray-900 focus:bg-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition-all"
                          />
                        </div>

                        {leadFormError && (
                          <p className="text-[11px] font-semibold text-rose-600">
                            {leadFormError}
                          </p>
                        )}

                        <button
                          type="submit"
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-purple-600 hover:from-purple-600 hover:to-brand-purpleDark text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-brand-purple/25 transition-all active:scale-95"
                        >
                          Submit
                        </button>

                        <p className="text-center text-[11px] text-gray-400 pt-0.5">
                          We don't spam.
                        </p>
                      </form>
                    </motion.div>
                  )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Loader */}
              {isLoading && (
                <div className="flex items-center gap-2 text-gray-400 text-xs pl-1">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span>Aura is typing...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Clean Footer Input Area: Input and Send button only */}
            <div className="p-3 sm:p-3.5 bg-white border-t border-gray-200 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 rounded-full bg-gray-100 border border-gray-200 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition-all disabled:opacity-60"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim() || isLoading}
                  aria-label="Send message"
                  className="w-10 h-10 rounded-full bg-brand-purple hover:bg-brand-purpleDark text-white flex items-center justify-center shadow-md shadow-brand-purple/25 transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none shrink-0"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
