import React, { useRef } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Trash2,
  Check,
  Home,
  BookOpen,
  Building2,
  Briefcase,
  Phone,
  Compass,
  Globe,
  MapPin,
} from 'lucide-react';
import type { PageContent } from '../services/cmsStore';

export type PageKey =
  | 'home'
  | 'about'
  | 'residential'
  | 'commercial'
  | 'plots'
  | 'career'
  | 'contact'
  | 'header'
  | 'footer'
  | string;

interface WebpageContainerEditorProps {
  pageKey: PageKey;
  pageContent: PageContent;
  setPageContent: React.Dispatch<React.SetStateAction<PageContent>>;
  onSave: () => void;
  onBack: () => void;
  showToast: (msg: string) => void;
}

export const WebpageContainerEditor: React.FC<WebpageContainerEditorProps> = ({
  pageKey,
  pageContent,
  setPageContent,
  onSave,
  onBack,
  showToast,
}) => {
  const imageUploadRef = useRef<HTMLInputElement>(null);
  const activeUploadTargetRef = useRef<string>('');

  const triggerUpload = (target: string) => {
    activeUploadTargetRef.current = target;
    imageUploadRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const target = activeUploadTargetRef.current;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      if (target === 'header.logoUrl') {
        setPageContent((prev) => ({
          ...prev,
          header: { ...(prev.header || {}), logoUrl: dataUrl } as any,
        }));
      } else if (target === 'home.heroImage') {
        setPageContent((prev) => ({
          ...prev,
          home: { ...prev.home, heroImage: dataUrl },
        }));
      }
      showToast(`Image uploaded for ${target}. Click "Save & Publish Live" to persist.`);
    };
    reader.readAsDataURL(file);
  };

  const pageTitles: Record<PageKey, { name: string; route: string; iconType: string }> = {
    home: { name: 'Home Page', route: '/', iconType: 'home' },
    about: { name: 'About Us', route: '/about', iconType: 'about' },
    residential: { name: 'Residential Portfolios', route: '/residential', iconType: 'residential' },
    commercial: { name: 'Commercial Assets', route: '/commercial', iconType: 'commercial' },
    plots: { name: 'Plots & Plotted Lands', route: '/plots', iconType: 'plots' },
    career: { name: 'Careers & Culture', route: '/career', iconType: 'career' },
    contact: { name: 'Contact & Advisory Desk', route: '/contact', iconType: 'contact' },
    header: { name: 'Header & Navigation Bar', route: 'Global Layout', iconType: 'header' },
    footer: { name: 'Footer & Global Brand', route: 'Global Layout', iconType: 'footer' },
  };

  const currentMeta = pageTitles[pageKey] || { name: 'Webpage', route: '/', iconType: 'home' };

  return (
    <div className="space-y-6">
      <input
        type="file"
        ref={imageUploadRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Sticky Top Action Bar */}
      <div className="p-4 rounded-2xl bg-[#282C35] border border-white/10 flex flex-wrap items-center justify-between gap-4 sticky top-20 z-10 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
            title="Return to Pages Directory"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-white capitalize flex items-center gap-2">
              <span className="p-1 rounded bg-brand-purple/20 text-brand-purpleLight">
                {currentMeta.iconType === 'home' && <Home className="w-4 h-4" />}
                {currentMeta.iconType === 'about' && <BookOpen className="w-4 h-4" />}
                {currentMeta.iconType === 'residential' && <Building2 className="w-4 h-4" />}
                {currentMeta.iconType === 'commercial' && <Building2 className="w-4 h-4 text-indigo-400" />}
                {currentMeta.iconType === 'plots' && <MapPin className="w-4 h-4 text-emerald-400" />}
                {currentMeta.iconType === 'career' && <Briefcase className="w-4 h-4 text-amber-400" />}
                {currentMeta.iconType === 'contact' && <Phone className="w-4 h-4 text-blue-400" />}
                {currentMeta.iconType === 'header' && <Compass className="w-4 h-4 text-pink-400" />}
                {currentMeta.iconType === 'footer' && <Globe className="w-4 h-4 text-teal-400" />}
              </span>
              <span>{currentMeta.name} Containers</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-brand-purple/20 text-brand-purpleLight border border-brand-purple/40">
                {currentMeta.route}
              </span>
            </h2>
            <p className="text-[11px] text-gray-400">
              Granular container editor with explicit tag recognition (H1, H2, Paragraph, Buttons, Images).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentMeta.route.startsWith('/') && (
            <a
              href={`https://aurexestates.co.in${currentMeta.route}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-semibold transition-all border border-white/10"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
              <span>View Live</span>
            </a>
          )}

          <button
            type="button"
            onClick={onSave}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Save & Publish Live</span>
          </button>
        </div>
      </div>

      {/* 1. HOME PAGE CONTAINERS */}
      {pageKey === 'home' && (
        <div className="space-y-6">
          {/* SEO & Meta Container */}
          <div className="p-6 rounded-2xl bg-[#2E333E] border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Page Metadata & Search Engine Indexing
                </h4>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                🔍 [Meta Title & Description Tags]
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-300">Page Meta Title</label>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                    🏷️ [Meta Title Tag &lt;title&gt;]
                  </span>
                </div>
                <input
                  type="text"
                  value={pageContent.home.metaTitle || ''}
                  onChange={(e) =>
                    setPageContent((prev) => ({
                      ...prev,
                      home: { ...prev.home, metaTitle: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-300">Social Hero Image Asset</label>
                  <span className="text-[10px] font-mono text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded">
                    🖼️ [Image Asset]
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src={pageContent.home.heroImage || '/camellias.jpg'}
                    alt="Hero"
                    className="w-10 h-10 rounded-lg object-cover border border-white/15 shrink-0"
                  />
                  <input
                    type="text"
                    value={pageContent.home.heroImage || ''}
                    onChange={(e) =>
                      setPageContent((prev) => ({
                        ...prev,
                        home: { ...prev.home, heroImage: e.target.value },
                      }))
                    }
                    className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-brand-purple"
                  />
                  <button
                    type="button"
                    onClick={() => triggerUpload('home.heroImage')}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all shrink-0"
                  >
                    Upload
                  </button>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-300">Meta Description</label>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                    📝 [Meta Description Tag]
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={pageContent.home.metaDescription || ''}
                  onChange={(e) =>
                    setPageContent((prev) => ({
                      ...prev,
                      home: { ...prev.home, metaDescription: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-brand-purple"
                />
              </div>
            </div>
          </div>

          {/* Container 1: Hero Banner */}
          <div className="p-6 rounded-2xl bg-[#2E333E] border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider text-purple-400">
                Container 1: Hero Banner & Tagline
              </h4>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30">
                Hero Container
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-300">Eyebrow Tagline</label>
                  <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded">
                    🏷️ [H1 Tag - Eyebrow]
                  </span>
                </div>
                <input
                  type="text"
                  value={pageContent.home.heroTag}
                  onChange={(e) =>
                    setPageContent((prev) => ({
                      ...prev,
                      home: { ...prev.home, heroTag: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-300">Hero Main Title</label>
                  <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded">
                    🏷️ [H1 Tag - Primary Heading]
                  </span>
                </div>
                <input
                  type="text"
                  value={pageContent.home.heroTitle}
                  onChange={(e) =>
                    setPageContent((prev) => ({
                      ...prev,
                      home: { ...prev.home, heroTitle: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-300">Hero Body Subtitle</label>
                  <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded">
                    🏷️ [Paragraph &lt;p&gt; - Body Text]
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={pageContent.home.heroSubtitle}
                  onChange={(e) =>
                    setPageContent((prev) => ({
                      ...prev,
                      home: { ...prev.home, heroSubtitle: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-brand-purple"
                />
              </div>
            </div>
          </div>

          {/* Container 2: Key Stats Counters */}
          <div className="p-6 rounded-2xl bg-[#2E333E] border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider text-purple-400">
                  Container 2: Key Stats Counters ({pageContent.home.stats?.length || 0})
                </h4>
                <p className="text-[11px] text-gray-400">
                  Recognized as H2 tags and metric value paragraph blocks.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newStat = { value: '100+', label: 'Stat Metric', sublabel: 'Prime Corridor' };
                  setPageContent((prev) => ({
                    ...prev,
                    home: { ...prev.home, stats: [...(prev.home.stats || []), newStat] },
                  }));
                  showToast('New stat added. Click "Save & Publish Live" to persist.');
                }}
                className="px-3 py-1.5 rounded-xl bg-brand-purple text-white text-xs font-bold transition-all shadow-md shadow-brand-purple/20"
              >
                + Add Stat
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pageContent.home.stats?.map((stat, sIdx) => (
                <div key={sIdx} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded">
                      🏷️ [H2 Tag - Stat Value]
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setPageContent((prev) => ({
                          ...prev,
                          home: {
                            ...prev.home,
                            stats: (prev.home.stats || []).filter((_, i) => i !== sIdx),
                          },
                        }));
                        showToast('Stat removed.');
                      }}
                      className="text-gray-500 hover:text-rose-400 p-1"
                      title="Delete stat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => {
                      const newStats = [...(pageContent.home.stats || [])];
                      newStats[sIdx] = { ...newStats[sIdx], value: e.target.value };
                      setPageContent((prev) => ({ ...prev, home: { ...prev.home, stats: newStats } }));
                    }}
                    placeholder="Value (e.g. ₹5,000+ Cr)"
                    className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-white text-xs font-bold"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded">
                      🏷️ [Paragraph &lt;p&gt; - Stat Label]
                    </span>
                  </div>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => {
                      const newStats = [...(pageContent.home.stats || [])];
                      newStats[sIdx] = { ...newStats[sIdx], label: e.target.value };
                      setPageContent((prev) => ({ ...prev, home: { ...prev.home, stats: newStats } }));
                    }}
                    placeholder="Label (e.g. Transaction Advisory)"
                    className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-white text-xs"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Container 3: Advisory Process & Portfolio Titles */}
          <div className="p-6 rounded-2xl bg-[#2E333E] border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider text-purple-400">
                Container 3: Advisory Methodology & Categories Showcase
              </h4>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/10 text-blue-300 border border-blue-500/30">
                🏷️ [H2 Tag - Section Headings]
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Advisory Process Heading
                </label>
                <input
                  type="text"
                  value={pageContent.home.advisoryHeading}
                  onChange={(e) =>
                    setPageContent((prev) => ({
                      ...prev,
                      home: { ...prev.home, advisoryHeading: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Categories Portfolio Title
                </label>
                <input
                  type="text"
                  value={pageContent.home.categoriesTitle}
                  onChange={(e) =>
                    setPageContent((prev) => ({
                      ...prev,
                      home: { ...prev.home, categoriesTitle: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Categories Subtitle
                </label>
                <textarea
                  rows={2}
                  value={pageContent.home.categoriesSubtitle || ''}
                  onChange={(e) =>
                    setPageContent((prev) => ({
                      ...prev,
                      home: { ...prev.home, categoriesSubtitle: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-brand-purple"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ABOUT US PAGE */}
      {pageKey === 'about' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#2E333E] border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Page Metadata & SEO</h4>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded">
                🔍 [Meta Tags]
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Meta Title</label>
                <input
                  type="text"
                  value={pageContent.about.metaTitle || ''}
                  onChange={(e) =>
                    setPageContent((prev) => ({
                      ...prev,
                      about: { ...prev.about, metaTitle: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Meta Description</label>
                <textarea
                  rows={2}
                  value={pageContent.about.metaDescription || ''}
                  onChange={(e) =>
                    setPageContent((prev) => ({
                      ...prev,
                      about: { ...prev.about, metaDescription: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#2E333E] border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider text-purple-400">
                Container 1: About Hero & Fiduciary Statement
              </h4>
              <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded">
                🏷️ [H1 Tag & Paragraph]
              </span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Hero Title [H1 Tag]</label>
              <input
                type="text"
                value={pageContent.about.heroTitle}
                onChange={(e) =>
                  setPageContent((prev) => ({
                    ...prev,
                    about: { ...prev.about, heroTitle: e.target.value },
                  }))
                }
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Hero Narrative [Paragraph &lt;p&gt;]</label>
              <textarea
                rows={3}
                value={pageContent.about.heroSubtitle}
                onChange={(e) =>
                  setPageContent((prev) => ({
                    ...prev,
                    about: { ...prev.about, heroSubtitle: e.target.value },
                  }))
                }
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#2E333E] border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider text-purple-400">
                Container 2: Mission & Vision Pillars
              </h4>
              <span className="text-[10px] font-mono text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded">
                🏷️ [H2 Tags & Paragraphs]
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Mission Title [H2 Tag]</label>
                <input
                  type="text"
                  value={pageContent.about.missionTitle}
                  onChange={(e) =>
                    setPageContent((prev) => ({
                      ...prev,
                      about: { ...prev.about, missionTitle: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                />
                <label className="block text-xs font-semibold text-gray-300 mt-2.5 mb-1.5">Mission Text [Paragraph &lt;p&gt;]</label>
                <textarea
                  rows={3}
                  value={pageContent.about.missionText}
                  onChange={(e) =>
                    setPageContent((prev) => ({
                      ...prev,
                      about: { ...prev.about, missionText: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Vision Title [H2 Tag]</label>
                <input
                  type="text"
                  value={pageContent.about.visionTitle}
                  onChange={(e) =>
                    setPageContent((prev) => ({
                      ...prev,
                      about: { ...prev.about, visionTitle: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                />
                <label className="block text-xs font-semibold text-gray-300 mt-2.5 mb-1.5">Vision Text [Paragraph &lt;p&gt;]</label>
                <textarea
                  rows={3}
                  value={pageContent.about.visionText}
                  onChange={(e) =>
                    setPageContent((prev) => ({
                      ...prev,
                      about: { ...prev.about, visionText: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. RESIDENTIAL, COMMERCIAL, PLOTS PAGES */}
      {(pageKey === 'residential' || pageKey === 'commercial' || pageKey === 'plots') && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#2E333E] border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Page Metadata & SEO</h4>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded">
                🔍 [Meta Tags]
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Meta Title</label>
                <input
                  type="text"
                  value={pageContent[pageKey].metaTitle || ''}
                  onChange={(e) =>
                    setPageContent((prev) => ({
                      ...prev,
                      [pageKey]: { ...prev[pageKey], metaTitle: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Meta Description</label>
                <textarea
                  rows={2}
                  value={pageContent[pageKey].metaDescription || ''}
                  onChange={(e) =>
                    setPageContent((prev) => ({
                      ...prev,
                      [pageKey]: { ...prev[pageKey], metaDescription: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#2E333E] border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider text-purple-400 capitalize">
                Container 1: {pageKey} Hero & Tagline
              </h4>
              <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded">
                🏷️ [H1 Tag & H2 Tagline]
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Hero Title [H1 Tag]</label>
                <input
                  type="text"
                  value={pageContent[pageKey].heroTitle}
                  onChange={(e) =>
                    setPageContent((prev) => ({
                      ...prev,
                      [pageKey]: { ...prev[pageKey], heroTitle: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Category Tagline [H2 Tag]</label>
                <input
                  type="text"
                  value={pageContent[pageKey].tagline}
                  onChange={(e) =>
                    setPageContent((prev) => ({
                      ...prev,
                      [pageKey]: { ...prev[pageKey], tagline: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Subtitle [Paragraph &lt;p&gt;]</label>
                <textarea
                  rows={3}
                  value={pageContent[pageKey].heroSubtitle}
                  onChange={(e) =>
                    setPageContent((prev) => ({
                      ...prev,
                      [pageKey]: { ...prev[pageKey], heroSubtitle: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. CAREERS & CULTURE */}
      {pageKey === 'career' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#2E333E] border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider text-purple-400">
                Container 1: Careers Culture Hero
              </h4>
              <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded">
                🏷️ [H1 Tag & Paragraph]
              </span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Hero Title [H1 Tag]</label>
              <input
                type="text"
                value={pageContent.career.heroTitle}
                onChange={(e) =>
                  setPageContent((prev) => ({
                    ...prev,
                    career: { ...prev.career, heroTitle: e.target.value },
                  }))
                }
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Hero Subtitle [Paragraph &lt;p&gt;]</label>
              <textarea
                rows={2}
                value={pageContent.career.heroSubtitle}
                onChange={(e) =>
                  setPageContent((prev) => ({
                    ...prev,
                    career: { ...prev.career, heroSubtitle: e.target.value },
                  }))
                }
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#2E333E] border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider text-purple-400">
                Container 2: Job Openings ({pageContent.career.openings?.length || 0})
              </h4>
              <button
                type="button"
                onClick={() => {
                  const newJob = {
                    id: `job-${Date.now()}`,
                    title: 'New Position',
                    department: 'Advisory',
                    location: 'Gurugram',
                    type: 'Full-time',
                    description: 'Role overview and requirements.',
                  };
                  setPageContent((prev) => ({
                    ...prev,
                    career: { ...prev.career, openings: [newJob, ...(prev.career.openings || [])] },
                  }));
                  showToast('New position added. Click "Save & Publish Live" to persist.');
                }}
                className="px-3 py-1.5 rounded-xl bg-brand-purple text-white text-xs font-bold"
              >
                + Add Position
              </button>
            </div>

            <div className="space-y-3">
              {pageContent.career.openings?.map((job) => (
                <div key={job.id} className="p-4 rounded-xl bg-white/5 border border-white/10 grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                  <div>
                    <label className="block text-[10px] text-gray-400">Job Title</label>
                    <input
                      type="text"
                      value={job.title}
                      onChange={(e) => {
                        const newOpenings = pageContent.career.openings.map((j) =>
                          j.id === job.id ? { ...j, title: e.target.value } : j
                        );
                        setPageContent((prev) => ({ ...prev, career: { ...prev.career, openings: newOpenings } }));
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-white text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400">Department</label>
                    <input
                      type="text"
                      value={job.department}
                      onChange={(e) => {
                        const newOpenings = pageContent.career.openings.map((j) =>
                          j.id === job.id ? { ...j, department: e.target.value } : j
                        );
                        setPageContent((prev) => ({ ...prev, career: { ...prev.career, openings: newOpenings } }));
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400">Location</label>
                    <input
                      type="text"
                      value={job.location}
                      onChange={(e) => {
                        const newOpenings = pageContent.career.openings.map((j) =>
                          j.id === job.id ? { ...j, location: e.target.value } : j
                        );
                        setPageContent((prev) => ({ ...prev, career: { ...prev.career, openings: newOpenings } }));
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-white text-xs"
                    />
                  </div>
                  <div className="flex items-center gap-2 justify-end pt-3 md:pt-0">
                    <button
                      type="button"
                      onClick={() => {
                        setPageContent((prev) => ({
                          ...prev,
                          career: {
                            ...prev.career,
                            openings: prev.career.openings.filter((j) => j.id !== job.id),
                          },
                        }));
                        showToast('Position removed.');
                      }}
                      className="p-2 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/10"
                      title="Delete position"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. CONTACT & EXCEL WEBHOOK */}
      {pageKey === 'contact' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#2E333E] border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider text-purple-400">
                Container 1: Direct Corporate Contact Details
              </h4>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded">
                🏷️ [Official Contacts]
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Phone Number</label>
                <input
                  type="text"
                  value={pageContent.contact.phone}
                  onChange={(e) =>
                    setPageContent((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, phone: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Official Email</label>
                <input
                  type="email"
                  value={pageContent.contact.email}
                  onChange={(e) =>
                    setPageContent((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, email: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">WhatsApp Direct Number</label>
                <input
                  type="text"
                  value={pageContent.contact.whatsappNumber}
                  onChange={(e) =>
                    setPageContent((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, whatsappNumber: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">HARERA Registration ID</label>
                <input
                  type="text"
                  value={pageContent.contact.reraNumber}
                  onChange={(e) =>
                    setPageContent((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, reraNumber: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Registered Office Address</label>
                <input
                  type="text"
                  value={pageContent.contact.address}
                  onChange={(e) =>
                    setPageContent((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, address: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Excel Webhook Container */}
          <div className="p-6 rounded-2xl bg-[#2E333E] border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Container 2: Google Sheets & Excel Live Webhook
                </h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded">
                📊 [Excel Sync]
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Every captured lead from the website and AI Chatbot is dispatched live to this webhook endpoint.
            </p>
            <input
              type="url"
              value={pageContent.contact.googleSheetsWebhook || ''}
              onChange={(e) =>
                setPageContent((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, googleSheetsWebhook: e.target.value },
                }))
              }
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-emerald-500/30 text-white text-xs font-mono"
            />
          </div>
        </div>
      )}

      {/* 6. HEADER & NAVIGATION (GLOBAL LAYOUT) */}
      {pageKey === 'header' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#2E333E] border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider text-purple-400">
                Container 1: Brand Logo & Identity
              </h4>
              <span className="text-[10px] font-mono text-pink-300 bg-pink-500/10 px-2 py-0.5 rounded">
                🖼️ [Image Asset]
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Brand Logo URL</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={pageContent.header?.logoUrl || '/aurex-logo-dark-trimmed.png'}
                    onChange={(e) =>
                      setPageContent((prev) => ({
                        ...prev,
                        header: { ...(prev.header || {}), logoUrl: e.target.value } as any,
                      }))
                    }
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => triggerUpload('header.logoUrl')}
                    className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all shrink-0"
                  >
                    Upload File
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <img
                  src={pageContent.header?.logoUrl || '/aurex-logo-dark-trimmed.png'}
                  alt="Logo Preview"
                  className="h-9 w-auto object-contain bg-white/10 p-1.5 rounded-lg border border-white/10"
                />
                <div>
                  <p className="text-xs font-bold text-white">Live Logo Preview</p>
                  <p className="text-[10px] text-gray-400">Renders on all desktop and mobile headers</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#2E333E] border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider text-purple-400">
                Container 2: Consultation CTA Button Placement
              </h4>
              <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded">
                🔘 [CTA Button]
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Button Text</label>
                <input
                  type="text"
                  value={pageContent.header?.ctaButtonText || 'Book a Consultation'}
                  onChange={(e) =>
                    setPageContent((prev) => ({
                      ...prev,
                      header: { ...(prev.header || {}), ctaButtonText: e.target.value } as any,
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Target Destination Link</label>
                <input
                  type="text"
                  value={pageContent.header?.ctaButtonLink || '#contact'}
                  onChange={(e) =>
                    setPageContent((prev) => ({
                      ...prev,
                      header: { ...(prev.header || {}), ctaButtonLink: e.target.value } as any,
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Button Placement / Visibility</label>
                <select
                  value={pageContent.header?.showCtaButton !== false ? 'show' : 'hide'}
                  onChange={(e) =>
                    setPageContent((prev) => ({
                      ...prev,
                      header: { ...(prev.header || {}), showCtaButton: e.target.value === 'show' } as any,
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                >
                  <option value="show" className="bg-[#12121a]">Show in Top Header (Right)</option>
                  <option value="hide" className="bg-[#12121a]">Hidden / Disabled</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#2E333E] border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider text-purple-400">
                Container 3: WhatsApp Action Icon & Placement
              </h4>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded">
                💬 [Placement Options]
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">WhatsApp Placement</label>
                <select
                  value={pageContent.header?.whatsAppPlacement || 'floating-bottom-right'}
                  onChange={(e) =>
                    setPageContent((prev) => ({
                      ...prev,
                      header: { ...(prev.header || {}), whatsAppPlacement: e.target.value as any } as any,
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                >
                  <option value="floating-bottom-right" className="bg-[#12121a]">Floating Bottom-Right (Recommended)</option>
                  <option value="header-bar" className="bg-[#12121a]">Top Header Bar (Next to Navigation)</option>
                  <option value="both" className="bg-[#12121a]">Both Top Header & Floating</option>
                  <option value="hidden" className="bg-[#12121a]">Hidden / Disabled</option>
                </select>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-[#25D366] text-[#25D366] bg-[#25D366]/10 flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Direct WhatsApp Sync</p>
                  <p className="text-[10px] text-gray-400">Opens WhatsApp chat with verified Aurex advisory desk</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. FOOTER & GLOBAL BRAND */}
      {pageKey === 'footer' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#2E333E] border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider text-purple-400">
                Container 1: Footer Legal Notices & Compliance Disclaimers
              </h4>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded">
                🏷️ [Paragraph &lt;p&gt; Tags]
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Copyright Notice [Paragraph &lt;p&gt;]</label>
                <input
                  type="text"
                  value={pageContent.footer?.copyrightText || '© 2026 Aurex Estates. All Rights Reserved.'}
                  onChange={(e) =>
                    setPageContent((prev) => ({
                      ...prev,
                      footer: { ...(prev.footer || {}), copyrightText: e.target.value } as any,
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  RERA Compliance & Transparency Disclaimer [Paragraph &lt;p&gt;]
                </label>
                <textarea
                  rows={2}
                  value={pageContent.footer?.disclaimerText || ''}
                  onChange={(e) =>
                    setPageContent((prev) => ({
                      ...prev,
                      footer: { ...(prev.footer || {}), disclaimerText: e.target.value } as any,
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Action Save Bar */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold"
        >
          ← Back to Pages Directory
        </button>

        <button
          type="button"
          onClick={onSave}
          className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all active:scale-95 flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Save All Changes Live</span>
        </button>
      </div>
    </div>
  );
};
