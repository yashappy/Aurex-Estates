// SEO Structure Analyzer and Real Estate LSI Keyword Intelligence

export interface LSIKeywordResult {
  keyword: string;
  relevance: 'high' | 'medium';
  intent: 'commercial' | 'informational' | 'transactional';
}

export interface SEOAnalysis {
  score: number;
  wordCount: number;
  h1: string;
  h2s: string[];
  h3s: string[];
  pCount: number;
  keywordDensity: number;
  hasMetaTitle: boolean;
  hasMetaDescription: boolean;
  recommendations: string[];
}

export function generateLSIKeywords(seedKeyword: string, category: string = 'residential'): LSIKeywordResult[] {
  const seed = (seedKeyword || '').trim();
  const cleanSeed = seed.length > 0 ? seed : 'luxury real estate gurugram';
  
  const baseModifiers = [
    { suffix: 'price list & payment plan 2026', intent: 'transactional', relevance: 'high' },
    { suffix: 'floor plans & layout specifications', intent: 'commercial', relevance: 'high' },
    { suffix: 'official brochure pdf download', intent: 'transactional', relevance: 'high' },
    { suffix: 'rera registered status & possession date', intent: 'informational', relevance: 'high' },
    { suffix: 'rental yield & capital appreciation outlook', intent: 'commercial', relevance: 'high' },
    { suffix: 'prime location & corridor connectivity', intent: 'informational', relevance: 'medium' },
    { suffix: 'ultra luxury penthouses & high-floor inventory', intent: 'transactional', relevance: 'high' },
    { suffix: 'investment advisory & verified resale deals', intent: 'commercial', relevance: 'high' },
    { suffix: 'developer track record & construction updates', intent: 'informational', relevance: 'medium' },
    { suffix: 'comparative market analysis vs golf course road', intent: 'commercial', relevance: 'high' },
  ];

  if (category === 'commercial') {
    baseModifiers[0] = { suffix: 'grade-A pre-leased office suites price', intent: 'transactional', relevance: 'high' };
    baseModifiers[1] = { suffix: 'institutional rental yield 8.5% - 9.2%', intent: 'commercial', relevance: 'high' };
    baseModifiers[6] = { suffix: 'retail shop front & high-street commercial', intent: 'transactional', relevance: 'high' };
    baseModifiers[9] = { suffix: 'multinational corporate headquarters floor plate', intent: 'commercial', relevance: 'high' };
  } else if (category === 'plots') {
    baseModifiers[0] = { suffix: 'freehold gated villa plots price per sq yd', intent: 'transactional', relevance: 'high' };
    baseModifiers[1] = { suffix: 'clear title registry & immediate possession', intent: 'transactional', relevance: 'high' };
    baseModifiers[6] = { suffix: 'low density plotted development master plan', intent: 'informational', relevance: 'medium' };
    baseModifiers[7] = { suffix: 'far & ground coverage sanction norms', intent: 'commercial', relevance: 'high' };
  }

  return baseModifiers.map((mod) => ({
    keyword: `${cleanSeed} ${mod.suffix}`,
    relevance: mod.relevance as 'high' | 'medium',
    intent: mod.intent as 'commercial' | 'informational' | 'transactional',
  }));
}

export function analyzeSEO(content: {
  title: string;
  description: string;
  focusKeyword?: string;
  metaTitle?: string;
  metaDescription?: string;
  highlights?: string[];
  amenities?: string[];
}): SEOAnalysis {
  const focus = (content.focusKeyword || '').toLowerCase().trim();
  const text = `${content.title} ${content.description} ${(content.highlights || []).join(' ')} ${(content.amenities || []).join(' ')}`;
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  let keywordMatches = 0;
  if (focus) {
    const regex = new RegExp(`\\b${focus.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    keywordMatches = (text.match(regex) || []).length;
  }
  const keywordDensity = wordCount > 0 ? Number(((keywordMatches / wordCount) * 100).toFixed(2)) : 0;

  const h1 = content.title || 'Untitled';
  const h2s = [
    'Property Overview & Executive Summary',
    'Pricing & Investment Typologies',
    'Key Project Highlights & Differentiators',
    'Architectural Amenities & Lifestyle Features',
    'Official Verified Brochure',
  ];
  const h3s = ['Floor Plans & Dimension Specs', 'Location Advantages & Travel Radii', 'Advisory Desk Consultation'];

  const hasMetaTitle = Boolean(content.metaTitle && content.metaTitle.trim().length >= 30);
  const hasMetaDescription = Boolean(content.metaDescription && content.metaDescription.trim().length >= 70);

  let score = 50;
  const recommendations: string[] = [];

  if (wordCount >= 200) {
    score += 15;
  } else {
    recommendations.push(`Expand description (currently ${wordCount} words, aim for 200+ words).`);
  }

  if (focus) {
    if (keywordMatches >= 2 && keywordDensity <= 3.5) {
      score += 15;
    } else if (keywordMatches === 0) {
      recommendations.push(`Include your focus keyword "${focus}" naturally in the description and highlights.`);
    } else if (keywordDensity > 3.5) {
      recommendations.push(`Keyword density is high (${keywordDensity}%). Avoid keyword stuffing.`);
    }
  } else {
    recommendations.push('Add a target focus keyword to track SEO performance.');
  }

  if (hasMetaTitle) {
    score += 10;
  } else {
    recommendations.push('Set a customized Meta Title between 40-65 characters.');
  }

  if (hasMetaDescription) {
    score += 10;
  } else {
    recommendations.push('Write a compelling Meta Description between 120-160 characters for search engines.');
  }

  return {
    score: Math.min(score, 100),
    wordCount,
    h1,
    h2s,
    h3s,
    pCount: Math.max(1, Math.round(wordCount / 45)),
    keywordDensity,
    hasMetaTitle,
    hasMetaDescription,
    recommendations,
  };
}
