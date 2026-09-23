/**
 * Aurex Estates - AI Real Estate Property Advisory Service
 * Powered by Google Gemini API with Intelligent Human-Like Real Estate Conversational Engine
 */

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const GEMINI_API_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) || '';

const SYSTEM_INSTRUCTION = `
You are "Aura", a sophisticated, knowledgeable, and polite real estate AI assistant for Aurex Estates.
Speak naturally like an experienced human property advisor: respectful, sharp, and helpful.
Keep responses concise (1 to 2 clear sentences max). Zero marketing fluff, zero pushy sales talk.

Core Behavior:
1. When asked questions about locations (e.g. Golf Course Road, Dwarka Expressway, Southern Peripheral Road, New Gurugram, Cyber City, Goa, Ayodhya, Neemrana), developers (DLF, Godrej, Sobha, Max Estates), rental yields, RERA, market trends, or commercial vs residential, answer directly and intelligently with real market facts.
2. During the property discovery flow:
   - Category -> Purpose (Investment vs End-Use) -> Budget range -> Timeline.
3. If the user has shared their preferences or asks how to see projects/brochures, politely invite them to leave their contact details so a senior advisor can share tailored inventories.
4. If the user asks general questions after the contact form, entertain them respectfully and informatively.
5. If the user uses vulgarity or profanity, reply calmly: "I am here to assist with genuine property searches. Which property category can I help you explore?"
`;

const VULGAR_REGEX = /\b(fuck|shit|bitch|bastard|asshole|idiot|stupid|chutiya|harami|gandu|madarchod|bhenchod|cunt|dick)\b/i;

/**
 * Intelligent Local Conversational Advisor:
 * Entertains general real estate questions with human knowledge, respect, and conciseness,
 * while guiding structured inquiries (Category -> Purpose -> Budget -> Timeline).
 */
function getIntelligentLocalReply(history: ChatMessage[]): string {
  const lastUserMsg = history.filter((m) => m.role === 'user').pop()?.text || '';
  const lower = lastUserMsg.toLowerCase().trim();

  // 1. Guard against abusive language or vulgarity
  if (VULGAR_REGEX.test(lower)) {
    return "I am here to assist with genuine property searches. Which property category can I help you explore?";
  }

  // 2. Answer general questions directly and intelligently (like a knowledgeable human)
  if (lower.includes('yield') || lower.includes('roi') || lower.includes('return') || lower.includes('rental')) {
    if (lower.includes('commercial') || lower.includes('retail') || lower.includes('office')) {
      return "Grade-A commercial spaces in NCR currently offer 8% to 9.5% gross rental yields with multi-year institutional leases, while prime retail in high-density corridors can reach up to 10%.";
    }
    return "Prime residential properties in Gurugram typically deliver 3% to 4.2% gross rental yields alongside strong 12% to 18% annual capital appreciation.";
  }

  if (lower.includes('golf course') && lower.includes('dwarka')) {
    return "Golf Course Road is an established trophy belt focused on wealth preservation, while Dwarka Expressway is delivering higher capital appreciation velocity with upcoming institutional handovers.";
  }

  if (lower.includes('golf course')) {
    return "Golf Course Road remains Gurugram's premier luxury corridor, commanding ₹65,000 to ₹1,20,000+ per sq. ft. for marquee assets like DLF Camellias.";
  }

  if (lower.includes('dwarka expressway') || lower.includes('dwarka')) {
    return "Dwarka Expressway (NH-248BB) is the fastest-growing corridor in Delhi NCR, offering high capital growth potential with direct 15-minute connectivity to Delhi Airport T3.";
  }

  if (lower.includes('rera') || lower.includes('safe') || lower.includes('legal') || lower.includes('risk')) {
    return "Every project curated by Aurex Estates is strictly 100% RERA verified with clear land titles, transparent developer escrows, and zero litigation.";
  }

  if (lower.includes('dlf') || lower.includes('camellias') || lower.includes('aralias') || lower.includes('magnolias')) {
    return "DLF's Golf Drive properties represent India's most prestigious residences, trading on scarcity value with world-class amenities and global community standards.";
  }

  if (lower.includes('commercial') && (lower.includes('residential') || lower.includes('better') || lower.includes('vs'))) {
    return "Commercial real estate excels for immediate passive quarterly cash flow, whereas luxury residential historically outpaces in total capital multiplication.";
  }

  if (lower.includes('plot') || lower.includes('land') || lower.includes('sco')) {
    return "Freehold plots and SCO arcades provide 100% land ownership rights with complete architectural freedom and zero condo maintenance overheads.";
  }

  if (lower.includes('who are you') || lower.includes('what can you do') || lower.includes('help')) {
    return "I am Aura, your real estate advisory assistant at Aurex Estates. I can assist you with market intelligence, pricing trends, and curated luxury properties across India.";
  }

  // 3. Conversational Progression (if user is replying to structured discovery)
  const allUserText = history
    .filter((m) => m.role === 'user')
    .map((m) => m.text.toLowerCase())
    .join(' ');

  const hasResidential = allUserText.includes('residential') || allUserText.includes('apartment') || allUserText.includes('flat') || allUserText.includes('penthouse') || allUserText.includes('villa');
  const hasCommercial = allUserText.includes('commercial') || allUserText.includes('retail') || allUserText.includes('office') || allUserText.includes('sco') || allUserText.includes('shop');
  const hasPlots = allUserText.includes('plot') || allUserText.includes('land') || allUserText.includes('acres') || allUserText.includes('sq yd');

  const hasPurpose = allUserText.includes('invest') || allUserText.includes('end-use') || allUserText.includes('end use') || allUserText.includes('self-use') || allUserText.includes('self use') || allUserText.includes('living');
  const hasBudget = allUserText.includes('cr') || allUserText.includes('lakh') || allUserText.includes('budget') || allUserText.includes('under') || allUserText.includes('above');
  const hasTimeline = allUserText.includes('month') || allUserText.includes('soon') || allUserText.includes('immediate') || allUserText.includes('ready') || allUserText.includes('exploring') || allUserText.includes('year');

  // If general question asked:
  if (lower.includes('?') || lower.startsWith('what') || lower.startsWith('how') || lower.startsWith('why') || lower.startsWith('which') || lower.startsWith('can you') || lower.startsWith('tell me')) {
    return "Our senior advisory team actively monitors inventory and pricing across these corridors. Which specific location or project would you like more details on?";
  }

  // Progressive Question 1: Purpose (Investment vs End-Use)
  if ((hasResidential || hasCommercial || hasPlots) && !hasPurpose) {
    return "Is your purchase intended for investment or personal end-use?";
  }

  // Progressive Question 2: Budget
  if (!hasBudget) {
    return "What approximate budget range are you comfortable with?";
  }

  // Progressive Question 3: Timeline
  if (!hasTimeline) {
    return "How soon are you planning to invest?";
  }

  // Final Step: Contact request
  return "Please share your contact details below so our senior advisor can share curated property options with you directly.";
}

export async function sendChatMessageToGemini(history: ChatMessage[]): Promise<string> {
  if (GEMINI_API_KEY && GEMINI_API_KEY.trim().length > 0) {
    const models = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-flash-latest'];

    const contents = history.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents,
            systemInstruction: {
              parts: [{ text: SYSTEM_INSTRUCTION }],
            },
            generationConfig: {
              temperature: 0.65,
              maxOutputTokens: 300,
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text && text.trim().length > 0) {
            return text.trim();
          }
        }
      } catch (err) {
        console.warn(`Gemini ${model} request error:`, err);
      }
    }
  }

  // Always use the intelligent local advisor (zero repetition, respects India-wide locations, handles questions contextually)
  return getIntelligentLocalReply(history);
}
