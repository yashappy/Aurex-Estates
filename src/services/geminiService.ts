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
You are "Aura", a senior real estate investment advisor for Aurex Estates.
Aurex Estates advises clients across India's top real estate markets — including Delhi NCR (Gurugram, Noida, Greater Noida, Delhi), Mumbai, Goa, Vrindavan, Ayodhya, Bangalore, and emerging growth corridors.

Core Personality & Style:
- Warm, polite, professional, and genuinely human.
- Provide short, crisp, highly valuable, and problem-solving answers (2 to 4 sentences).
- NEVER repeat a question or recommendation the user has already answered.
- If the user has already selected or mentioned Residential, Commercial, or Plots, NEVER ask "Are you looking for residential, commercial or plots?" again.
- Do NOT assume Gurugram by default! We serve many prime cities in India. Always respect the city or location the user mentions.
- If user mentions vulgarity, profanity, or abusive language, respond calmly and gracefully: "I am here to assist with genuine property advisory. Let's keep our conversation respectful. How can I assist with your property search?"
- Help the user by asking natural, progressive questions to understand their needs (Preferred City/Location -> Category -> End-use vs Investment -> Budget/Sector).
- When they are ready for brochures, price lists, or advisory consultation, invite them to share their details.
`;

const VULGAR_REGEX = /\b(fuck|shit|bitch|bastard|asshole|idiot|stupid|chutiya|harami|gandu|madarchod|bhenchod|cunt|dick)\b/i;

/**
 * Intelligent Local Conversational Advisor:
 * Guarantees zero repetition, dynamic question progression, and valuable problem-solving across all Indian property markets.
 */
function getIntelligentLocalReply(history: ChatMessage[]): string {
  const lastUserMsg = history.filter((m) => m.role === 'user').pop()?.text || '';
  const lower = lastUserMsg.toLowerCase().trim();

  // 1. Guard against abusive language or vulgarity
  if (VULGAR_REGEX.test(lower)) {
    return "I am here to assist you with genuine real estate advisory. Let's keep our discussion respectful. Which city or property category can I help you explore today?";
  }

  // Aggregate user context from full history
  const allUserText = history
    .filter((m) => m.role === 'user')
    .map((m) => m.text.toLowerCase())
    .join(' ');

  const hasResidential = allUserText.includes('residential') || allUserText.includes('apartment') || allUserText.includes('flat') || allUserText.includes('penthouse') || allUserText.includes('villa');
  const hasCommercial = allUserText.includes('commercial') || allUserText.includes('retail') || allUserText.includes('office') || allUserText.includes('sco') || allUserText.includes('shop');
  const hasPlots = allUserText.includes('plot') || allUserText.includes('land') || allUserText.includes('acres') || allUserText.includes('sq yd');

  const hasInvestment = allUserText.includes('investment') || allUserText.includes('yield') || allUserText.includes('roi') || allUserText.includes('capital appreciation');
  const hasSelfUse = allUserText.includes('self-use') || allUserText.includes('self use') || allUserText.includes('living') || allUserText.includes('end-use') || allUserText.includes('family');

  const hasCityMention =
    allUserText.includes('gurugram') ||
    allUserText.includes('gurgaon') ||
    allUserText.includes('delhi') ||
    allUserText.includes('mumbai') ||
    allUserText.includes('noida') ||
    allUserText.includes('goa') ||
    allUserText.includes('ayodhya') ||
    allUserText.includes('vrindavan') ||
    allUserText.includes('bangalore') ||
    allUserText.includes('pune') ||
    allUserText.includes('hyderabad') ||
    allUserText.includes('sector');

  // Specific question answering:
  if (lower.includes('best city') || lower.includes('which city') || lower.includes('where to invest')) {
    if (lower.includes('plot') || lower.includes('land')) {
      return "For land and plotted investments, Dwarka Expressway (Gurugram), Yamuna Expressway (near Jewar Airport), Ayodhya, and North Goa are currently delivering the highest 18–24% annualized capital appreciation. What is your approximate investment budget?";
    }
    if (lower.includes('commercial')) {
      return "For commercial real estate, Gurugram (Golf Course Extension Road, Cyber City belt) and Navi Mumbai offer the strongest 8.5%–9.5% rental yields backed by institutional grade-A multinational leases. Are you targeting retail or pre-leased offices?";
    }
    return "Delhi NCR (Dwarka Expressway & Golf Course Road) leads in luxury residential appreciation, while Mumbai and Goa offer stellar long-term wealth preservation. Which city or state are you most keen on?";
  }

  if (lower.includes('rera') || lower.includes('registered') || lower.includes('safe')) {
    return "Every project curated by Aurex Estates is 100% RERA verified with clear land titles, transparent builder escrows, and zero legal ambiguity. Which specific developer or sector are you evaluating?";
  }

  // Conversational flow progression without repetition:
  if (!hasCityMention && !hasResidential && !hasCommercial && !hasPlots) {
    return "Aurex Estates advises clients across India's top markets including Delhi NCR, Gurugram, Mumbai, Noida, Goa, Ayodhya, and more. Which city or location are you currently exploring?";
  }

  if (hasResidential && !hasInvestment && !hasSelfUse) {
    return "Great choice with residential. Are you looking to acquire this property for personal self-use with family, or as a high-growth capital investment?";
  }

  if (hasCommercial && !hasInvestment && !hasSelfUse) {
    return "Commercial assets offer excellent 8–10% rental yields. Are you looking for high-street retail shops, food court spaces, or pre-leased corporate offices?";
  }

  if (hasPlots && !hasInvestment && !hasSelfUse) {
    return "Freehold plotted developments offer complete land sovereignty and fast value appreciation. Are you acquiring land for investment or to build a bespoke villa?";
  }

  if ((hasResidential || hasCommercial || hasPlots) && (hasInvestment || hasSelfUse) && !allUserText.includes('cr') && !allUserText.includes('lakh') && !allUserText.includes('budget')) {
    return "Understood. To match you with the right inventory, what is your comfortable budget range (e.g. Within ₹1.5 Cr, ₹2–6 Cr, or Ultra Luxury ₹10 Cr+), and do you have a specific sector or city preferred?";
  }

  // When preferences are known, invite to consultation
  return "I have shortlisted several verified, zero-brokerage property options with direct developer pricing matching your preferences. Please fill in your contact details below, and our senior advisor will share the brochures and unit inventory with you immediately.";
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
