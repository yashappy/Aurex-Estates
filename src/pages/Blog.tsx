import React, { useState } from 'react';
import {
  ArrowUpRight,
  Clock,
  User,
  Sparkles,
  Share2,
  Check,
  ArrowLeft,
  MessageCircle,
  ChevronRight,
  Bookmark,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { BLOG_POSTS } from '../data/blogPosts';
import type { BlogPost } from '../data/blogPosts';

const LinkedinIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);

const TwitterIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

interface BlogProps {
  onOpenConsultation: (topic?: string) => void;
  onNavigate: (page: 'home' | 'about' | 'contact' | 'privacy' | 'career' | 'residential' | 'commercial' | 'plots' | 'blog') => void;
}

/**
 * Render Markdown-like formatted paragraph (Supports ## Heading, **bold**, *italic*, [text](url))
 */
const FormattedParagraph: React.FC<{ text: string }> = ({ text }) => {
  if (text.startsWith('### ')) {
    return <h4 className="text-base sm:text-lg font-bold text-gray-950 mt-6 mb-2 tracking-tight">{text.slice(4)}</h4>;
  }
  if (text.startsWith('## ')) {
    return <h3 className="text-xl sm:text-2xl font-bold text-gray-950 mt-8 mb-3 tracking-tight">{text.slice(3)}</h3>;
  }
  if (text.startsWith('# ')) {
    return <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950 mt-10 mb-4 tracking-tight">{text.slice(2)}</h2>;
  }
  if (text.startsWith('> ')) {
    return (
      <blockquote className="border-l-4 border-brand-purple pl-4 py-1 my-4 italic text-gray-700 bg-brand-purple/5 rounded-r-xl">
        {text.slice(2)}
      </blockquote>
    );
  }

  // Parse links [text](url) and bold **text** and italic *text*
  const parts: (string | React.ReactNode)[] = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const label = match[1];
    const url = match[2];
    parts.push(
      <a
        key={match.index}
        href={url}
        target={url.startsWith('http') ? '_blank' : '_self'}
        rel="noopener noreferrer"
        className="text-brand-purple font-semibold underline underline-offset-2 hover:text-brand-purpleDark transition-colors"
      >
        {label}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return (
    <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4 font-normal">
      {parts.map((p, i) => {
        if (typeof p !== 'string') return p;
        // Simple bold parser
        if (p.includes('**')) {
          const subParts = p.split('**');
          return subParts.map((sub, j) =>
            j % 2 === 1 ? <strong key={`${i}-${j}`} className="font-semibold text-gray-950">{sub}</strong> : sub
          );
        }
        return p;
      })}
    </p>
  );
};

export const Blog: React.FC<BlogProps> = ({ onOpenConsultation, onNavigate: _onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [readingPost, setReadingPost] = useState<BlogPost | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const categories = ['All', 'Market Intelligence', 'Investment Advisory', 'Luxury Living', 'Micro-Market Analysis'];

  const filteredPosts = selectedCategory === 'All'
    ? BLOG_POSTS
    : BLOG_POSTS.filter((post) => post.category === selectedCategory);

  const handleShare = (post: BlogPost, platform?: 'whatsapp' | 'linkedin' | 'twitter') => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title);

    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${title}%20${url}`, '_blank');
      return;
    }
    if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
      return;
    }
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${title}&url=${url}`, '_blank');
      return;
    }

    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // =========================================================================
  // VIEW A: DEDICATED FULL EDITORIAL ARTICLE VIEW (Redesigned per Reference)
  // =========================================================================
  if (readingPost) {
    const relatedPosts = BLOG_POSTS.filter((p) => p.id !== readingPost.id).slice(0, 3);
    const trendingPosts = BLOG_POSTS.slice(0, 4);

    return (
      <div className="min-h-screen bg-[#FDFCFB] text-brand-dark pt-20 sm:pt-24 pb-28 md:pb-20">
        {/* Top Breadcrumbs & Back Navigation */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200/80 pb-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <button
                onClick={() => setReadingPost(null)}
                className="inline-flex items-center gap-1.5 text-gray-600 hover:text-brand-purple font-medium transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Market Trends & Analysis</span>
              </button>
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <span className="text-brand-purple font-semibold">{readingPost.category}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleShare(readingPost)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-700 hover:border-brand-purple hover:text-brand-purple shadow-xs transition-all"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Report</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Article Container (Two Column Editorial per Reference Screenshot) */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Article Header & Byline */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-purple bg-brand-purple/10 px-3 py-1 rounded-full">
                {readingPost.category}
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                {readingPost.readTime}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-950 tracking-tight leading-snug mb-4">
              {readingPost.title}
            </h1>

            {/* Author Byline with LinkedIn Icon */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-3.5 border-y border-gray-200/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-purple/15 text-brand-purple flex items-center justify-center font-bold text-sm shrink-0 border border-brand-purple/30">
                  <User className="w-5 h-5 text-brand-purple" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-gray-900">{readingPost.author?.name || 'Yash'}</span>
                    {/* LinkedIn icon beside writer name */}
                    <a
                      href={readingPost.author?.linkedin || 'https://www.linkedin.com/in/yashappy'}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Connect with ${readingPost.author?.name || 'Yash'} on LinkedIn`}
                      className="inline-flex items-center justify-center w-5 h-5 rounded-sm text-[#0077b5] hover:opacity-80 transition-opacity ml-0.5"
                    >
                      <LinkedinIcon className="w-4 h-4 fill-[#0077b5]" />
                    </a>
                  </div>
                  <p className="text-xs text-gray-500">{readingPost.author?.role || 'Head Editor'} • {readingPost.date}</p>
                </div>
              </div>

              {/* Quick Social Share Icons */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-medium mr-1 hidden sm:inline">Share:</span>
                <button
                  onClick={() => handleShare(readingPost, 'whatsapp')}
                  title="Share on WhatsApp"
                  className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition-transform active:scale-95 shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare(readingPost, 'linkedin')}
                  title="Share on LinkedIn"
                  className="w-8 h-8 rounded-full bg-[#0077b5] hover:bg-[#006097] text-white flex items-center justify-center transition-transform active:scale-95 shadow-xs"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare(readingPost, 'twitter')}
                  title="Share on X"
                  className="w-8 h-8 rounded-full bg-gray-900 hover:bg-black text-white flex items-center justify-center transition-transform active:scale-95 shadow-xs"
                >
                  <TwitterIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-lg border border-gray-200/90 mb-10 h-72 sm:h-96 md:h-[460px]">
            <img
              src={readingPost.image}
              alt={readingPost.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          {/* Two-Column Editorial Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Main Article Column (~70%) */}
            <div className="lg:col-span-8 space-y-8">
              {/* Executive Summary / Key Takeaways Box */}
              <div className="bg-brand-purple/5 border border-brand-purple/20 rounded-2xl p-6 sm:p-7 shadow-xs">
                <h3 className="text-xs uppercase tracking-widest font-bold text-brand-purple mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-purple" />
                  <span>Executive Summary &amp; Key Takeaways</span>
                </h3>
                <ul className="space-y-3">
                  {readingPost.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="text-xs sm:text-sm text-gray-800 leading-relaxed flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-brand-purple shrink-0 mt-2" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Table of Contents / In This Post Quick Jump Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 border border-gray-200">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-2.5 flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-brand-purple" />
                  <span>In This Market Analysis</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  <a
                    href="#market-thesis"
                    className="text-xs text-brand-purple font-medium hover:underline bg-white px-3 py-1.5 rounded-lg border border-gray-200"
                  >
                    1. Macro Investment Thesis
                  </a>
                  <a
                    href="#pricing-dynamics"
                    className="text-xs text-brand-purple font-medium hover:underline bg-white px-3 py-1.5 rounded-lg border border-gray-200"
                  >
                    2. Pricing &amp; Rental Dynamics
                  </a>
                  <a
                    href="#advisory-outlook"
                    className="text-xs text-brand-purple font-medium hover:underline bg-white px-3 py-1.5 rounded-lg border border-gray-200"
                  >
                    3. Advisory Recommendations
                  </a>
                </div>
              </div>

              {/* Article Body Content (Supports rich markdown elements) */}
              <div className="prose prose-lg max-w-none text-gray-700">
                <div id="market-thesis">
                  {readingPost.content.map((paragraph, idx) => (
                    <FormattedParagraph key={idx} text={paragraph} />
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="pt-6 border-t border-gray-200 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-gray-500 mr-2">Topics:</span>
                {readingPost.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium px-3.5 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200/80 hover:bg-brand-purple/10 hover:text-brand-purple transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Share On Bottom Bar */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Found this market analysis valuable?</h4>
                  <p className="text-xs text-gray-500">Share with family office partners or co-investors.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShare(readingPost, 'whatsapp')}
                    className="px-3.5 py-2 rounded-xl bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-600 transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={() => handleShare(readingPost, 'linkedin')}
                    className="px-3.5 py-2 rounded-xl bg-[#0077b5] text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-[#006097] transition-colors shadow-xs"
                  >
                    <LinkedinIcon className="w-3.5 h-3.5" />
                    <span>LinkedIn</span>
                  </button>
                  <button
                    onClick={() => handleShare(readingPost)}
                    className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Related Articles Section */}
              <div className="pt-6">
                <h3 className="text-xl font-bold text-gray-950 mb-5">Related Market Analyses</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {relatedPosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => {
                        setReadingPost(post);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col"
                    >
                      <div className="h-36 overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-brand-purple uppercase tracking-wider block mb-1">
                            {post.category}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-brand-purple transition-colors mb-2 leading-snug">
                            {post.title}
                          </h4>
                        </div>
                        <span className="text-[11px] text-gray-400 font-medium">{post.readTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sticky Sidebar (~30%) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="sticky top-24 space-y-6">
                {/* Advisory Consultation Card */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-brand-purple to-purple-800 text-white shadow-xl shadow-brand-purple/20">
                  <h4 className="text-base font-bold tracking-tight mb-2">
                    Private Real Estate Briefing
                  </h4>
                  <p className="text-xs text-purple-100 font-light leading-relaxed mb-5">
                    Consult directly with our research advisors for off-market inventory, yield analyses, and developer terms.
                  </p>
                  <button
                    onClick={() => onOpenConsultation(readingPost.title)}
                    className="w-full py-3 rounded-xl bg-white hover:bg-gray-100 text-brand-purple font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Book Private Briefing</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Recent Reviews & Top Picks (per Reference Screenshot) */}
                <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-sm">
                  <h4 className="text-sm font-bold text-gray-950 uppercase tracking-wider mb-4 pb-2 border-b border-gray-150">
                    Recent Reviews &amp; Top Picks
                  </h4>
                  <div className="space-y-4">
                    {trendingPosts.map((trend) => (
                      <div
                        key={trend.id}
                        onClick={() => {
                          setReadingPost(trend);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <img
                          src={trend.image}
                          alt={trend.title}
                          className="w-16 h-14 rounded-xl object-cover shrink-0 border border-gray-200 group-hover:opacity-90 transition-opacity"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-bold text-gray-900 group-hover:text-brand-purple transition-colors line-clamp-2 leading-snug">
                            {trend.title}
                          </h5>
                          <span className="text-[10px] text-gray-400 mt-1 block">
                            {trend.date} • {trend.readTime}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Corridor Exploration Tags */}
                <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-sm">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">
                    Top Corridors to Explore
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {['Golf Course Road', 'Dwarka Expressway', 'Cyber City', 'SPR Gurugram', 'Worli Mumbai', 'North Goa', 'Yamuna Expressway'].map((corr) => (
                      <span
                        key={corr}
                        className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-[11px] font-medium hover:bg-brand-purple hover:text-white transition-colors cursor-pointer"
                      >
                        {corr}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW B: MAIN BLOG DIRECTORY
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-brand-dark pt-20 sm:pt-24 pb-28 md:pb-20">
      {/* Blog Hero Header: Clean, Updated Title, Removed Old Unbiased Text */}
      <div className="bg-white border-b border-gray-200/90 py-10 sm:py-14 px-4 sm:px-8 md:px-12 shadow-xs">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-950 mb-3">
            Market Trends &amp; Analysis
          </h1>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/25'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Featured First Article (if 'All' selected) */}
        {selectedCategory === 'All' && filteredPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => setReadingPost(filteredPosts[0])}
            className="mb-10 rounded-3xl bg-white border border-gray-200/90 shadow-md overflow-hidden group cursor-pointer grid grid-cols-1 lg:grid-cols-12 hover:shadow-xl transition-all duration-300"
          >
            <div className="lg:col-span-7 relative h-72 lg:h-auto overflow-hidden">
              <img
                src={filteredPosts[0].image}
                alt={filteredPosts[0].title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
              <div className="absolute top-4 left-4 bg-brand-purple text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                Featured Analysis
              </div>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 text-xs text-gray-500 mb-3">
                  <span className="font-semibold text-brand-purple uppercase tracking-wider">
                    {filteredPosts[0].category}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {filteredPosts[0].readTime}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 tracking-tight mb-3 group-hover:text-brand-purple transition-colors">
                  {filteredPosts[0].title}
                </h2>

                <p className="text-sm text-gray-600 font-light leading-relaxed mb-6">
                  {filteredPosts[0].excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-150 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                  <User className="w-3.5 h-3.5 text-brand-purple" />
                  <span>{filteredPosts[0].author.name}</span>
                  {/* LinkedIn Icon */}
                  <span className="text-[#0077b5] inline-flex items-center">
                    <LinkedinIcon className="w-3.5 h-3.5 fill-[#0077b5]" />
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-purple uppercase tracking-wider group-hover:translate-x-0.5 transition-transform">
                  Read Article
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Regular Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {(selectedCategory === 'All' ? filteredPosts.slice(1) : filteredPosts).map((post) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              onClick={() => setReadingPost(post)}
              className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-xs overflow-hidden flex flex-col group cursor-pointer hover:shadow-lg transition-all duration-300"
            >
              {/* Image Banner */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-3.5 left-3.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/20">
                  {post.category}
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-2">
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-gray-950 tracking-tight group-hover:text-brand-purple transition-colors mb-2.5 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 font-light line-clamp-3 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-brand-purple">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <User className="w-3.5 h-3.5 text-brand-purple" />
                    <span className="text-xs">{post.author.name}</span>
                    <span className="text-[#0077b5] inline-flex items-center">
                      <LinkedinIcon className="w-3 h-3 fill-[#0077b5]" />
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 uppercase tracking-wider">
                    Read Report
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};
