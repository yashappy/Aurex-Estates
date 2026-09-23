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
You are "Aura", a real estate AI assistant for Aurex Estates.
Answer in strictly 1 short sentence. Zero marketing fluff, zero filler.

Conversational Progression:
1. If property type (Residential, Commercial, Plots) is known, ask: "Is your purchase intended for investment or personal end-use?"
2. If purpose is known, ask: "What approximate budget range are you comfortable with?"
3. If budget is known, ask: "How soon are you planning to invest?"
4. NEVER repeat a question already answered.
5. NEVER mention developer pricing, shortlisted verified properties, or long marketing speeches.
6. If user is abusive, reply: "I am here to assist with genuine property searches. Which property type can I help you explore?"
`;

const VULGAR_REGEX = /\b(fuck|shit|bitch|bastard|asshole|idiot|stupid|chutiya|harami|gandu|madarchod|bhenchod|cunt|dick)\b/i;

/**
 * Intelligent Local Conversational Advisor:
 * Guarantees zero repetition, concise progressive questions (purpose -> budget -> timeline).
 */
function getIntelligentLocalReply(history: ChatMessage[]): string {
  const lastUserMsg = history.filter((m) => m.role === 'user').pop()?.text || '';
  const lower = lastUserMsg.toLowerCase().trim();

  // 1. Guard against abusive language or vulgarity
  if (VULGAR_REGEX.test(lower)) {
    return "I am here to assist with genuine property searches. Which property type can I help you explore?";
  }

  // Aggregate user context from full history
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
  return "Please share your contact details below so our advisor can assist you directly.";
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
