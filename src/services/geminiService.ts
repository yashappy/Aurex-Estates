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
You are "Aura", a sophisticated, knowledgeable, and polite real estate AI advisor for Aurex Estates in India (Delhi NCR, Gurugram, Mumbai, Goa).
Speak naturally like an experienced, warm human property advisor: respectful, sharp, and helpful.
Answer whatever question, greeting, or comment the user types naturally and directly.
Keep responses concise (1 to 2 clear sentences max). Zero marketing fluff, zero pushy sales talk.
Never repeat the same question if the user changes the topic, says no, or asks something else.
`;

const VULGAR_REGEX = /\b(fuck|shit|bitch|bastard|asshole|idiot|stupid|chutiya|harami|gandu|madarchod|bhenchod|cunt|dick)\b/i;

/**
 * Intelligent Local Conversational Advisor:
 * Entertains every user input with tailored, personalized, respectful human answers.
 * Guarantees zero stuck loops and natural human conversation flow.
 */
function getIntelligentLocalReply(history: ChatMessage[]): string {
  const userMessages = history.filter((m) => m.role === 'user');
  const lastUserMsg = userMessages[userMessages.length - 1]?.text || '';
  const secondLastUserMsg = userMessages[userMessages.length - 2]?.text || '';
  const lower = lastUserMsg.toLowerCase().trim();

  // 1. Guard against abusive language or vulgarity
  if (VULGAR_REGEX.test(lower)) {
    return "I am here to assist with genuine property searches. Which property category or city can I help you explore today?";
  }

  // 2. Greetings and Pleasantries (Personalized & Human)
  const isGreeting = /^(hi|hello|hey|hiya|greetings|namaste|good\s*(morning|afternoon|evening|day)|wassup|yo)(\s|!|\.|$)/i.test(lower);
  if (isGreeting) {
    if (secondLastUserMsg && /^(hi|hello|hey)/i.test(secondLastUserMsg.toLowerCase().trim())) {
      return "Hello again! How can I assist you with your property plans today? Feel free to ask any question or tell me what you're looking for.";
    }
    return "Hello! Wonderful to connect with you. I'm here to assist with genuine property advisory, market pricing, and investment trends across India. Which category are you planning to explore today?";
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
    return "I'm Aura, your AI real estate advisor at Aurex Estates. I provide unbiased market insights, rental yield analytics, and verified property shortlists across Delhi NCR, Mumbai, Goa, and key emerging corridors. How can I help with your property search?";
  }

  // 4. Courtesy & Pleasantries
  if (lower.includes('how are you') || lower.includes('how r u') || lower.includes("how's it going")) {
    return "I'm doing well, thank you! Ready to help you evaluate India's most promising real estate opportunities. What property goals are you currently considering?";
  }

  if (lower.includes('thank') || lower.includes('thx') || lower.includes('appreciate')) {
    return "You're most welcome! Feel free to ask if you'd like to analyze any specific developer, micro-market pricing, or investment yield.";
  }

  if (lower === 'ok' || lower === 'okay' || lower === 'cool' || lower === 'got it' || lower === 'great' || lower === 'noted') {
    return "Glad to hear. Are you exploring residential luxury, commercial yields, or freehold plots?";
  }

  // 5. User Declining / Answering "no"
  if (
    lower === 'no' ||
    lower === 'nope' ||
    lower === 'not really' ||
    lower === 'neither' ||
    lower === 'nah' ||
    lower === 'cancel' ||
    lower.startsWith('no ')
  ) {
    return "No problem at all! Feel free to ask any question about Gurgaon real estate, prices, developers, or areas, and I'll be glad to help.";
  }

  // 6. User Answering "yes" / "sure"
  if (lower === 'yes' || lower === 'yeah' || lower === 'sure' || lower === 'yep') {
    return "Great! Which location, sector, or budget range would you like us to look into?";
  }

  // 7. Rental & Lease Inquiries ("i need rent", "rental", etc.)
  if (lower.includes('rent') || lower.includes('lease') || lower.includes('tenant') || lower.includes('pg')) {
    return "Understood! While Aurex Estates focuses primarily on property acquisitions and high-yield investment assets, we also assist with luxury rentals in prime gated communities. Which sector and monthly rent budget are you considering?";
  }

  // 8. Direct Market & Financial Questions
  // Rental Yield & ROI
  if (lower.includes('yield') || lower.includes('roi') || lower.includes('return') || lower.includes('cap rate')) {
    if (lower.includes('commercial') || lower.includes('office') || lower.includes('retail') || lower.includes('sco')) {
      return "Grade-A pre-leased commercial offices in Gurugram currently yield 8.0% to 9.2% gross returns with institutional 9-year lease structures. Prime high-street retail spaces can reach 9.5%–10.5%.";
    }
    if (lower.includes('residential') || lower.includes('flat') || lower.includes('apartment')) {
      return "Prime residential properties in Gurugram typically deliver 3.2% to 4.2% gross rental yields alongside strong 12% to 18% annual capital appreciation.";
    }
    return "In NCR, commercial Grade-A spaces deliver 8%–9.5% annual cash yields, while prime residential properties offer 3%–4% yields paired with superior long-term capital appreciation.";
  }

  // Best Place to Invest / Recommendations
  if (lower.includes('best place') || lower.includes('where to invest') || lower.includes('where should i invest') || lower.includes('recommend') || lower.includes('best corridor') || lower.includes('top project')) {
    return "For high-alpha capital appreciation, Dwarka Expressway (Gurugram) and the Jewar Airport corridor are top picks. For stable wealth preservation and blue-chip tenancy, Golf Course Road and Extension Road remain gold standards. Which investment horizon do you prefer?";
  }

  // Corridors & Micro-Markets
  if (lower.includes('golf course road') || (lower.includes('golf course') && !lower.includes('extension'))) {
    return "Golf Course Road is Gurugram's billionaire corridor, commanding ₹65,000 to ₹1,20,000+ per sq ft for marquee assets like DLF Camellias and Aralias. It functions as a finite luxury store of value.";
  }

  if (lower.includes('golf course ext') || lower.includes('gcr ext') || lower.includes('spr') || lower.includes('southern peripheral')) {
    return "Golf Course Extension Road and SPR are Gurugram's premier high-growth residential corridors, featuring world-class luxury developments at ₹18,000 to ₹28,000 per sq ft.";
  }

  if (lower.includes('dwarka expressway') || lower.includes('dwarka') || lower.includes('nh-248bb') || lower.includes('sector 106') || lower.includes('sector 111') || lower.includes('sector 113')) {
    return "Dwarka Expressway is Delhi NCR's fastest-growing corridor, offering direct 15-minute access to Delhi Airport T3 and high projected capital gains over the next 3 to 5 years.";
  }

  if (lower.includes('new gurugram') || lower.includes('sector 82') || lower.includes('sector 84') || lower.includes('sector 92')) {
    return "New Gurugram offers accessible modern luxury condominiums and SCO commercial arcades with direct connectivity to NH-48 and the CPR cloverleaf interchange.";
  }

  if (lower.includes('noida') || lower.includes('jewar') || lower.includes('yamuna expressway') || lower.includes('sector 150') || lower.includes('greater noida')) {
    return "Noida's Sector 150 and the Yamuna Expressway corridor near the upcoming Jewar International Airport are seeing substantial capital appreciation driven by major infrastructure milestones.";
  }

  if (lower.includes('goa') || lower.includes('assagao') || lower.includes('siolim') || lower.includes('anjuna')) {
    return "North Goa luxury villas (Assagao, Siolim) deliver 8% to 12% managed holiday rental yields alongside strong lifestyle demand from HNIs and NRIs.";
  }

  if (lower.includes('ayodhya') || lower.includes('vrindavan') || lower.includes('neemrana')) {
    return "Spiritual and industrial satellite corridors like Ayodhya, Vrindavan, and Neemrana offer lower capital ticket sizes (₹25L–₹75L) with fast tourist-driven rental velocity.";
  }

  if (lower.includes('mumbai') || lower.includes('worli') || lower.includes('bandra') || lower.includes('navi mumbai')) {
    return "Mumbai remains India's premier high-value financial market, with coastal road expansion boosting South Mumbai connectivity and the new Navi Mumbai Airport driving trans-harbour growth.";
  }

  if (lower.includes('gurgaon') || lower.includes('gurugram')) {
    return "Gurugram leads North India in institutional infrastructure, corporate headquarters, and luxury living. Are you interested in Dwarka Expressway, Golf Course Road, or Southern Peripheral Road?";
  }

  // Developers & Specific Projects
  if (lower.includes('dlf') || lower.includes('camellias') || lower.includes('aralias') || lower.includes('magnolias') || lower.includes('privana') || lower.includes('alameda')) {
    return "DLF represents India's gold standard in master-planned luxury communities. Developments like The Camellias and Privana command superior liquidity and consistent price premiums.";
  }

  if (lower.includes('godrej') || lower.includes('sobha') || lower.includes('max estates') || lower.includes('elan') || lower.includes('m3m') || lower.includes('central park')) {
    return "Top institutional developers like Godrej, Sobha, and Max Estates offer exceptional construction quality, timely delivery track records, and high resale velocity across NCR.";
  }

  // Legal, Safety & RERA
  if (lower.includes('rera') || lower.includes('safe') || lower.includes('legal') || lower.includes('title') || lower.includes('escrow') || lower.includes('risk')) {
    return "Every project advised by Aurex Estates is strictly 100% RERA compliant with clear, verified land titles, transparent builder escrows, and zero legal ambiguity.";
  }

  // Property Types (Plots, Commercial, Residential)
  if (lower.includes('plot') || lower.includes('land') || lower.includes('sco')) {
    return "Freehold plots and SCO commercial arcades offer 100% undivided land ownership rights, zero condominium maintenance overheads, and flexible multi-floor monetization.";
  }

  if (lower.includes('commercial') && (lower.includes('residential') || lower.includes('vs') || lower.includes('better') || lower.includes('difference'))) {
    return "Commercial assets excel for immediate quarterly cash flow and predictable 8–9% yields, while residential luxury historically delivers larger multi-year capital compounding.";
  }

  // 9. Pricing & Budget Specific Mentions
  const budgetMatch = lower.match(/(\d+(\.\d+)?)\s*(cr|crore|lakh|lacs|lac|k)/i);
  if (budgetMatch) {
    const val = budgetMatch[0];
    return `A budget of ${val} opens up prime options across top NCR corridors. What timeline are you targeting for your investment?`;
  }

  // 10. Direct Discovery Step Selection (ONLY triggers when user is explicitly answering category / purpose / budget / timeline)
  const isDirectCategory =
    lower === 'residential' ||
    lower === 'commercial' ||
    lower === 'plots' ||
    (lower.startsWith('residential') && lower.length < 25) ||
    (lower.startsWith('commercial') && lower.length < 25) ||
    (lower.startsWith('plots') && lower.length < 25);

  if (isDirectCategory) {
    return "Understood! Is your purchase intended primarily for capital investment or personal family end-use?";
  }

  const isDirectPurpose =
    lower === 'investment' ||
    lower === 'end-use' ||
    lower === 'end use' ||
    lower === 'self-use' ||
    lower === 'self use' ||
    (lower.includes('invest') && lower.length < 20);

  if (isDirectPurpose) {
    return "Got it! What approximate budget range are you comfortable planning around?";
  }

  const isDirectBudget =
    lower.includes('cr') ||
    lower.includes('lakh') ||
    lower.includes('under') ||
    lower.includes('above') ||
    lower.includes('budget');

  if (isDirectBudget) {
    return "Understood. A budget in that range gives you prime options across Gurugram and NCR. How soon are you planning to make an acquisition?";
  }

  const isDirectTimeline =
    lower.includes('immediate') ||
    lower.includes('ready') ||
    lower.includes('month') ||
    lower.includes('exploring') ||
    lower.includes('soon');

  if (isDirectTimeline) {
    return "Perfect. Please share your contact details below so our senior advisor can share verified inventory brochures with you directly.";
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
    return `Regarding ${topic}, our advisory desk tracks verified micro-market data and builder inventories on this daily. Which specific location or project would you like me to focus on?`;
  }

  // 12. Intelligent Contextual Default
  return `Thank you for sharing that. We advise clients across residential luxury, commercial yields, and strategic land. How can I best guide your property search today?`;
}

/**
 * Send Chat Message:
 * 1. Queries live unmetered LLM (Pollinations AI) with full multi-turn conversational history.
 * 2. If Gemini API key is configured, also attempts Google Gemini.
 * 3. Seamlessly falls back to rich, non-looping local conversational engine.
 */
export async function sendChatMessageToGemini(history: ChatMessage[]): Promise<string> {
  // 1. Try Live Pollinations AI (Instant multi-turn real human AI)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const formattedMessages = [
      {
        role: 'system',
        content:
          'You are Aura, an elite, knowledgeable, and polite real estate AI advisor for Aurex Estates in India (Delhi NCR, Gurugram, Mumbai, Goa). Talk like a warm, experienced human property expert. Answer whatever question, comment, or greeting the user types naturally and directly in strictly 1-2 concise sentences. Never repeat questions if the user changes the topic or says no. Zero marketing fluff.',
      },
      ...history.slice(-6).map((m) => ({
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
        return text.trim();
      }
    }
  } catch {
    // Network or timeout, proceed to fallback
  }

  // 2. Try Gemini API if key is present
  if (GEMINI_API_KEY && GEMINI_API_KEY.trim().length > 0) {
    const models = [
      'gemini-flash-lite-latest',
      'gemini-3.6-flash',
      'gemini-3.1-flash-lite',
      'gemini-3.5-flash',
    ];

    const contents = history.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    for (const model of models) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

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
              temperature: 0.7,
              maxOutputTokens: 250,
            },
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text && text.trim().length > 0) {
            return text.trim();
          }
        }
      } catch {
        // Continue to next model on error or timeout
      }
    }
  }

  // 3. Fallback: Intelligent, non-looping local human advisor
  return getIntelligentLocalReply(history);
}
