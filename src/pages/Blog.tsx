import React, { useState } from 'react';
import { BookOpen, ArrowUpRight, Clock, User, X, Sparkles, Share2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BLOG_POSTS } from '../data/blogPosts';
import type { BlogPost } from '../data/blogPosts';

interface BlogProps {
  onOpenConsultation: (topic?: string) => void;
  onNavigate: (page: 'home' | 'about' | 'contact' | 'privacy' | 'career' | 'residential' | 'commercial' | 'plots' | 'blog') => void;
}

export const Blog: React.FC<BlogProps> = ({ onOpenConsultation, onNavigate: _onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [readingPost, setReadingPost] = useState<BlogPost | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const categories = ['All', 'Market Intelligence', 'Investment Advisory', 'Luxury Living', 'Micro-Market Analysis'];

  const filteredPosts = selectedCategory === 'All'
    ? BLOG_POSTS
    : BLOG_POSTS.filter((post) => post.category === selectedCategory);

  const handleShare = (post: BlogPost) => {
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

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-brand-dark pt-20 sm:pt-24 pb-28 md:pb-20">
      {/* Blog Hero Header */}
      <div className="bg-white border-b border-gray-200/90 py-10 sm:py-14 px-4 sm:px-8 md:px-12 shadow-sm">
        <div className="max-w-site mx-auto text-center max-w-3xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-brand-purple bg-brand-purple/10 px-3.5 py-1 rounded-full mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            Aurex Research Desk
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-gray-950 mb-4">
            Market Intelligence & Insights
          </h1>
          <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed">
            Unbiased research, micro-market pricing analyses, yield metrics, and wealth advisory strategies for discerning property investors across Delhi NCR and Mumbai.
          </p>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
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
      <div className="max-w-site mx-auto px-4 sm:px-8 md:px-12 mt-10">
        {/* Featured First Article (if 'All' selected) */}
        {selectedCategory === 'All' && filteredPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => setReadingPost(filteredPosts[0])}
            className="mb-10 rounded-3xl bg-white border border-gray-200/90 shadow-lg overflow-hidden group cursor-pointer grid grid-cols-1 lg:grid-cols-12 hover:shadow-2xl transition-all duration-300"
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

                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-950 tracking-tight mb-3 group-hover:text-brand-purple transition-colors">
                  {filteredPosts[0].title}
                </h2>

                <p className="text-sm text-gray-600 font-light leading-relaxed mb-6">
                  {filteredPosts[0].excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-150 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                  <User className="w-3.5 h-3.5 text-brand-purple" />
                  <span>{filteredPosts[0].author.name}</span>
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
              className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-sm overflow-hidden flex flex-col group cursor-pointer hover:shadow-xl transition-all duration-300"
            >
              {/* Image Banner */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
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

                  <h3 className="text-lg sm:text-xl font-semibold text-gray-950 tracking-tight group-hover:text-brand-purple transition-colors mb-2.5 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 font-light line-clamp-3 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-brand-purple">
                  <span className="uppercase tracking-wider">Read Full Report</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* =========================================================================
          FULL ARTICLE READER MODAL
      ========================================================================= */}
      <AnimatePresence>
        {readingPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReadingPost(null)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 z-10 my-auto max-h-[90vh] flex flex-col"
            >
              {/* Header Image */}
              <div className="relative h-60 sm:h-72 w-full shrink-0 overflow-hidden">
                <img
                  src={readingPost.image}
                  alt={readingPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />

                <button
                  onClick={() => setReadingPost(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-5 left-6 right-6 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-brand-purple text-white inline-block mb-2">
                    {readingPost.category}
                  </span>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight leading-tight">
                    {readingPost.title}
                  </h2>
                </div>
              </div>

              {/* Scrollable Article Text */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
                {/* Meta Row */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-150 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-brand-purple" />
                    <div>
                      <p className="font-semibold text-gray-900">{readingPost.author.name}</p>
                      <p className="text-[11px] text-gray-500">{readingPost.author.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span>{readingPost.readTime}</span>
                    <button
                      onClick={() => handleShare(readingPost)}
                      className="p-1.5 rounded-full bg-gray-100 hover:bg-brand-purple hover:text-white transition-colors"
                      title="Share article"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Key Takeaways Box */}
                <div className="bg-brand-purple/5 border border-brand-purple/20 rounded-2xl p-5">
                  <h4 className="text-xs uppercase tracking-widest font-bold text-brand-purple mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Executive Summary / Key Takeaways
                  </h4>
                  <ul className="space-y-2">
                    {readingPost.keyTakeaways.map((takeaway, idx) => (
                      <li key={idx} className="text-xs sm:text-sm text-gray-700 font-light flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-purple shrink-0 mt-1.5" />
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Article Body Paragraphs */}
                <div className="space-y-4 text-sm sm:text-base text-gray-700 font-light leading-relaxed">
                  {readingPost.content.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-150">
                  {readingPost.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reader Sticky Bottom CTA */}
              <div className="p-4 px-6 border-t border-gray-200 bg-gray-50/90 flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-0">
                <p className="text-xs text-gray-600 font-light text-center sm:text-left">
                  Have questions about this market thesis? Consult directly with our research team.
                </p>
                <button
                  onClick={() => {
                    const title = readingPost.title;
                    setReadingPost(null);
                    onOpenConsultation(title);
                  }}
                  className="shrink-0 px-6 py-2.5 rounded-full bg-brand-purple hover:bg-brand-purpleDark text-white text-xs uppercase tracking-wider font-semibold shadow-md shadow-brand-purple/25 transition-all flex items-center gap-1.5"
                >
                  <span>Book Private Briefing</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
