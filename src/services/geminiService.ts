/**
 * Aurex Estates - AI Real Estate Property Advisory Service
 * Powered by Live Multi-Turn AI & Intelligent Human-Like Real Estate Conversational Engine
 */

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const GEMINI_API_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) || '';

const SYSTEM_INSTRUCTION = `
You are Aura, an elite real estate advisor for Aurex Estates in India (Delhi NCR, Gurugram, Mumbai, Goa).
Speak naturally like an experienced, warm human property advisor: respectful, sharp, and helpful.
Answer the user's question directly in STRICTLY 1 to 2 clear sentences max. Zero marketing fluff, zero pushy sales talk, zero unsolicited lists or essays.
Never repeat questions if the user changes the topic or says no.
`;

const VULGAR_REGEX = /\b(fuck|shit|bitch|bastard|asshole|idiot|stupid|chutiya|harami|gandu|madarchod|bhenchod|cunt|dick)\b/i;

function trimToMaxSentences(text: string, max = 2): string {
  if (!text) return '';
  const cleaned = text.replace(/^[-*•]\s+/gm, '').replace(/\n+/g, ' ').trim();
  const sentences = cleaned.match(/[^.!?]+[.!?]+(\s|$)/g);
  if (sentences && sentences.length > max) {
    return sentences.slice(0, max).join('').trim();
  }
  return cleaned;
}

/**
 * Intelligent Local Conversational Advisor:
 * Entertains every user input with tailored, personalized, respectful human answers.
 * Guarantees zero stuck loops and natural human conversation flow.
 */
export function getIntelligentLocalReply(history: ChatMessage[]): string {
  const userMessages = history.filter((m) => m.role === 'user');
  const lastUserMsg = userMessages[userMessages.length - 1]?.text || '';
  const lower = lastUserMsg.toLowerCase().trim();

  // 1. Guard against abusive language or vulgarity
  if (VULGAR_REGEX.test(lower)) {
    return "I am here to assist with genuine property searches. Which property category or city can I help you explore today?";
  }

  // 2. Greetings and Pleasantries (Personalized & Human)
  const isGreeting = /^(hi|hello|hey|hiya|greetings|namaste|good\s*(morning|afternoon|evening|day)|wassup|yo)(\s|!|\.|$)/i.test(lower);
  if (isGreeting) {
    return "Hello! How may I help you today?";
  }

  // 3. Identity & Introduction ("tell me about you", "who are you", etc.)
  if (
    lower.includes('about you') ||
    lower.includes('who are you') ||
    lower.includes('introduce yourself') ||
    lower.includes('what do you do') ||
    lower.includes('what can you do') ||
    lower.includes('your name') ||
    lower === 'aura'
  ) {
    return "I'm Aura, your AI real estate advisor at Aurex Estates. I provide verified market insights, pricing analytics, and property guidance across Delhi NCR and key Indian corridors.";
  }

  // 4. Yash - Head Editor
  if (lower.includes('yash') || lower.includes('editor')) {
    return "Yash is the Head Editor at Aurex Advisory Desk, leading research and editorial market analysis across prime real estate corridors in Delhi NCR and India.";
  }

  // 5. Office Address & Contact
  if (lower.includes('address') || lower.includes('office') || lower.includes('location of aurex') || lower.includes('where is aurex') || lower.includes('where are you located')) {
    return "Our corporate office is at 1610, 16th Floor, Tower 4, DLF Corporate Greens, Sector 74A, Gurugram. We are open Tuesday to Sunday from 10:00 AM to 6:30 PM.";
  }

  if (lower.includes('contact') || lower.includes('phone') || lower.includes('call') || lower.includes('email') || lower.includes('mobile')) {
    return "You can reach our advisory team at +91 87967 91087 or email us at info@aurexestates.co.in.";
  }

  // 6. Courtesy & Pleasantries
  if (lower.includes('how are you') || lower.includes('how r u') || lower.includes("how's it going")) {
    return "I'm doing well, thank you! How may I assist your real estate search today?";
  }

  if (lower.includes('thank') || lower.includes('thx') || lower.includes('appreciate')) {
    return "You're most welcome! Feel free to ask if you'd like to evaluate any developer, corridor pricing, or rental yield.";
  }

  if (lower === 'ok' || lower === 'okay' || lower === 'cool' || lower === 'got it' || lower === 'great' || lower === 'noted') {
    return "Glad to hear. How can I help you further with your property search?";
  }

  // 7. User Declining / Answering "no"
  if (
    lower === 'no' ||
    lower === 'nope' ||
    lower === 'not really' ||
    lower === 'neither' ||
    lower === 'nah' ||
    lower === 'cancel' ||
    lower.startsWith('no ')
  ) {
    return "No problem at all! Feel free to ask any specific question about Gurgaon real estate, prices, developers, or areas.";
  }

  // 8. User Answering "yes" / "sure"
  if (lower === 'yes' || lower === 'yeah' || lower === 'sure' || lower === 'yep') {
    return "Great! Which location, sector, or budget range would you like us to look into?";
  }

  // 9. Rental & Lease Inquiries ("i need rent", "rental", etc.)
  if (lower.includes('rent') || lower.includes('lease') || lower.includes('tenant') || lower.includes('pg')) {
    return "While Aurex Estates focuses primarily on property acquisitions and high-yield investment assets, we also assist with luxury rentals in prime gated communities across Gurugram.";
  }

  // 10. Direct Market & Financial Questions
  // Rental Yield & ROI
  if (lower.includes('yield') || lower.includes('roi') || lower.includes('return') || lower.includes('cap rate')) {
    if (lower.includes('commercial') || lower.includes('office') || lower.includes('retail') || lower.includes('sco')) {
      return "Grade-A pre-leased commercial offices in Gurugram currently yield 8.0% to 9.2% gross returns, while prime retail can reach 9.5%–10.5%.";
    }
    if (lower.includes('residential') || lower.includes('flat') || lower.includes('apartment')) {
      return "Prime residential condominiums in Gurugram deliver 3.2% to 4.2% gross rental yields alongside strong 12% to 18% annual capital appreciation.";
    }
    return "Commercial Grade-A spaces deliver 8%–9.5% cash yields, while prime residential properties offer 3%–4% yields paired with higher long-term capital appreciation.";
  }

  // Best Place to Invest / Recommendations
  if (lower.includes('best place') || lower.includes('where to invest') || lower.includes('where should i invest') || lower.includes('recommend') || lower.includes('best corridor') || lower.includes('top project')) {
    return "For capital appreciation, Dwarka Expressway and SPR are top performers. For wealth preservation and elite tenancy, Golf Course Road remains the benchmark.";
  }

  // Corridors & Micro-Markets
  if (lower.includes('golf course road') || (lower.includes('golf course') && !lower.includes('extension'))) {
    return "Golf Course Road is Gurugram's premier corridor, commanding ₹65,000 to ₹1,20,000+ per sq ft for marquee assets like DLF Camellias and Aralias.";
  }

  if (lower.includes('golf course ext') || lower.includes('gcr ext') || lower.includes('spr') || lower.includes('southern peripheral')) {
    return "Golf Course Extension Road and SPR are Gurugram's top high-growth residential corridors, featuring luxury developments at ₹18,000 to ₹28,000 per sq ft.";
  }

  if (lower.includes('dwarka expressway') || lower.includes('dwarka') || lower.includes('nh-248bb') || lower.includes('sector 106') || lower.includes('sector 111') || lower.includes('sector 113')) {
    return "Dwarka Expressway offers direct 15-minute access to Delhi Airport T3 and high projected capital gains driven by operational infrastructure.";
  }

  if (lower.includes('new gurugram') || lower.includes('sector 82') || lower.includes('sector 84') || lower.includes('sector 92')) {
    return "New Gurugram offers accessible modern luxury condominiums and SCO commercial arcades with direct connectivity to NH-48 and the CPR interchange.";
  }

  if (lower.includes('noida') || lower.includes('jewar') || lower.includes('yamuna expressway') || lower.includes('sector 150') || lower.includes('greater noida')) {
    return "Noida Sector 150 and the Yamuna Expressway near Jewar Airport are seeing strong appreciation driven by upcoming airport and highway connectivity.";
  }

  if (lower.includes('goa') || lower.includes('assagao') || lower.includes('siolim') || lower.includes('anjuna')) {
    return "North Goa luxury holiday villas in Assagao and Siolim deliver 8% to 12% rental yields alongside strong lifestyle demand from HNIs.";
  }

  if (lower.includes('ayodhya') || lower.includes('vrindavan') || lower.includes('neemrana')) {
    return "Spiritual and industrial satellite corridors like Ayodhya and Vrindavan offer accessible ticket sizes (₹25L–₹75L) with tourist-driven rental growth.";
  }

  if (lower.includes('mumbai') || lower.includes('worli') || lower.includes('bandra') || lower.includes('navi mumbai')) {
    return "Mumbai remains India's highest-value financial market, with coastal road expansion and Navi Mumbai Airport driving key micro-market growth.";
  }

  if (lower.includes('gurgaon') || lower.includes('gurugram')) {
    return "Gurugram leads North India in institutional infrastructure and luxury residential demand across Dwarka Expressway, Golf Course Road, and SPR.";
  }

  // Developers & Specific Projects
  if (lower.includes('dlf') || lower.includes('camellias') || lower.includes('aralias') || lower.includes('magnolias') || lower.includes('privana') || lower.includes('alameda')) {
    return "DLF represents India's gold standard in master-planned communities, commanding superior liquidity and consistent price premiums in Gurugram.";
  }

  if (lower.includes('godrej') || lower.includes('sobha') || lower.includes('max estates') || lower.includes('elan') || lower.includes('m3m') || lower.includes('central park')) {
    return "Top institutional developers like Godrej, Sobha, and Max Estates offer exceptional construction quality, timely delivery, and strong resale velocity in NCR.";
  }

  // Legal, Safety & RERA
  if (lower.includes('rera') || lower.includes('safe') || lower.includes('legal') || lower.includes('title') || lower.includes('escrow') || lower.includes('risk')) {
    return "Every project advised by Aurex Estates is strictly 100% RERA compliant with verified land titles, transparent builder escrows, and clear approvals.";
  }

  // Property Types (Plots, Commercial, Residential)
  if (lower.includes('plot') || lower.includes('land') || lower.includes('sco')) {
    return "Freehold plots and SCO commercial arcades offer 100% undivided land ownership rights and flexible multi-floor monetization.";
  }

  if (lower.includes('commercial') && (lower.includes('residential') || lower.includes('vs') || lower.includes('better') || lower.includes('difference'))) {
    return "Commercial assets excel for quarterly cash yields of 8–9%, while residential luxury historically delivers stronger multi-year capital compounding.";
  }

  // 11. General Open-Ended Question Fallback
  if (
    lower.includes('?') ||
    lower.startsWith('what') ||
    lower.startsWith('how') ||
    lower.startsWith('why') ||
    lower.startsWith('which') ||
    lower.startsWith('where') ||
    lower.startsWith('is ') ||
    lower.startsWith('can you') ||
    lower.startsWith('tell me')
  ) {
    const topic = lastUserMsg.replace(/[?.,!]/g, '').trim();
    return `Regarding ${topic}, our advisory desk tracks verified micro-market pricing and developer inventory daily. How can I best assist you with this?`;
  }

  // 12. Intelligent Contextual Default
  return "We advise clients across residential luxury, commercial yields, and strategic land. How can I best guide your property search today?";
}

/**
 * Send Chat Message:
 * 1. Checks intelligent local human advisor for instant, high-accuracy answers.
 * 2. Queries live LLM with strict 1-2 sentence brevity for open questions.
 * 3. Trims responses to ensure zero extra unasked fluff.
 */
export async function sendChatMessageToGemini(history: ChatMessage[]): Promise<string> {
  const userMessages = history.filter((m) => m.role === 'user');
  const lastUserMsg = userMessages[userMessages.length - 1]?.text || '';
  const lower = lastUserMsg.toLowerCase().trim();

  // Instant response for greetings
  const isGreeting = /^(hi|hello|hey|hiya|greetings|namaste|good\s*(morning|afternoon|evening|day)|wassup|yo)(\s|!|\.|$)/i.test(lower);
  if (isGreeting) {
    return "Hello! How may I help you today?";
  }

  // Check intelligent local answer first for high-frequency topics
  const localAnswer = getIntelligentLocalReply(history);
  const isDefaultFallback = localAnswer.includes("How can I best guide your property search today?") || localAnswer.includes("Regarding");

  // If local answer is a specific high-confidence match, return it directly
  if (!isDefaultFallback) {
    return localAnswer;
  }

  // 1. Try Live Pollinations AI with strict sentence constraint
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const formattedMessages = [
      {
        role: 'system',
        content:
          'You are Aura, real estate advisor for Aurex Estates in India. Answer the user question directly in STRICTLY 1 to 2 concise sentences. Do NOT give extra unasked information, recommendations, or lists. Be warm, professional, and concise. Zero fluff.',
      },
      ...history.slice(-4).map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text,
      })),
    ];

    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: formattedMessages,
        model: 'openai',
        seed: 42,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const text = await response.text();
      if (text && text.trim().length > 0 && !text.includes('Error') && !text.includes('503')) {
        return trimToMaxSentences(text.trim(), 2);
      }
    }
  } catch {
    // Network or timeout, proceed to Gemini or fallback
  }

  // 2. Try Gemini API if key is present
  if (GEMINI_API_KEY && GEMINI_API_KEY.trim().length > 0) {
    const models = [
      'gemini-flash-lite-latest',
      'gemini-3.6-flash',
      'gemini-3.1-flash-lite',
      'gemini-3.5-flash',
    ];

    const contents = history.slice(-4).map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    for (const model of models) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

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
              temperature: 0.6,
              maxOutputTokens: 120,
            },
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text && text.trim().length > 0) {
            return trimToMaxSentences(text.trim(), 2);
          }
        }
      } catch {
        // Continue to next model on error or timeout
      }
    }
  }

  // 3. Fallback: Intelligent local human advisor
  return localAnswer;
}
