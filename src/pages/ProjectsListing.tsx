import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  ArrowUpRight,
  MapPin,
  Check,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CITIES,
  RESIDENTIAL_TYPOLOGIES,
  COMMERCIAL_TYPOLOGIES,
  PLOTS_TYPOLOGIES,
  SEGMENTS,
  STATUSES,
  PRICE_RANGES,
} from '../data/projects';
import { cmsStore } from '../services/cmsStore';
import type {
  Project,
  ProjectCategory,
  ProjectSegment,
  ProjectStatus,
  ProjectCity,
  PriceRangeOption,
} from '../data/projects';
import { DEVELOPERS } from '../data/developers';
import { DeveloperLogo } from '../components/DeveloperLogo';

interface ProjectsListingProps {
  initialCategory: ProjectCategory;
  onOpenConsultation: (projectNameOrCategory?: string) => void;
  onSelectProject: (projectId: string) => void;
}

type FilterCategoryKey =
  | 'price'
  | 'segment'
  | 'status'
  | 'typology'
  | 'city'
  | 'developer'
  | 'all'
  | null;

export const ProjectsListing: React.FC<ProjectsListingProps> = ({
  initialCategory,
  onOpenConsultation: _onOpenConsultation,
  onSelectProject,
}) => {
  const activeCategory = initialCategory;
  const [allProjects, setAllProjects] = useState(() => cmsStore.getProjects());

  useEffect(() => {
    const unsub = cmsStore.subscribe(() => {
      setAllProjects(cmsStore.getProjects());
    });
    return () => {
      unsub();
    };
  }, []);

  // Helper to read initial filter params from window.location.hash
  const getInitialHashFilter = (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    const hash = window.location.hash;
    const qIndex = hash.indexOf('?');
    if (qIndex === -1) return null;
    const params = new URLSearchParams(hash.slice(qIndex + 1));
    return params.get(key);
  };

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<ProjectCity | 'All'>('All');
  const [selectedSegment, setSelectedSegment] = useState<ProjectSegment | 'All'>(() => {
    const seg = getInitialHashFilter('segment');
    if (seg && (SEGMENTS as readonly string[]).includes(seg)) return seg as ProjectSegment;
    return 'All';
  });
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | 'All'>(() => {
    const stat = getInitialHashFilter('status');
    if (stat && (STATUSES as readonly string[]).includes(stat)) return stat as ProjectStatus;
    return 'All';
  });
  const [selectedTypologies, setSelectedTypologies] = useState<string[]>(() => {
    const typo = getInitialHashFilter('typology');
    return typo ? [typo] : [];
  });
  const [selectedDevelopers, setSelectedDevelopers] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRangeOption>(PRICE_RANGES[0]);

  // Sync with URL hash filter changes
  React.useEffect(() => {
    const handleHashFilterChange = () => {
      const seg = getInitialHashFilter('segment');
      if (seg && (SEGMENTS as readonly string[]).includes(seg)) {
        setSelectedSegment(seg as ProjectSegment);
      }
      const stat = getInitialHashFilter('status');
      if (stat && (STATUSES as readonly string[]).includes(stat)) {
        setSelectedStatus(stat as ProjectStatus);
      }
      const typo = getInitialHashFilter('typology');
      if (typo) {
        setSelectedTypologies([typo]);
      }
    };
    window.addEventListener('hashchange', handleHashFilterChange);
    return () => window.removeEventListener('hashchange', handleHashFilterChange);
  }, []);

  // Price Slider State (in Lakhs: 50L to 19000L = 190 Cr)
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(19000);

  // Helper to format lakhs to human readable text
  const formatLakhs = (lakhs: number): string => {
    if (lakhs >= 19000) return '₹190 Cr+';
    if (lakhs >= 100) {
      const cr = lakhs / 100;
      return `₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(1)} Cr`;
    }
    return `₹${lakhs} Lakh`;
  };

  // Slider progress percentage for floating real-time thumb tooltip
  const sliderPct = Math.min(100, Math.max(0, ((maxPrice - 50) / (19000 - 50)) * 100));

  const handleSliderChange = (val: number) => {
    setMaxPrice(val);
    setSelectedPriceRange({ label: `Up to ${formatLakhs(val)}`, minLakhs: minPrice, maxLakhs: val });
  };

  // Pagination State (Show 6 projects per page)
  const ITEMS_PER_PAGE = 6;
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);
  const projectsListTopRef = React.useRef<HTMLDivElement>(null);

  // Automatically reset to page 1 whenever filters, category, or search changes
  React.useEffect(() => {
    setCurrentPageNum(1);
  }, [
    activeCategory,
    searchQuery,
    selectedCity,
    selectedSegment,
    selectedStatus,
    selectedTypologies,
    selectedDevelopers,
    minPrice,
    maxPrice,
  ]);

  // UI State: Category-specific modal / popup
  const [activeCategoryModal, setActiveCategoryModal] = useState<FilterCategoryKey>(() => {
    if (typeof window === 'undefined') return null;
    const h = window.location.hash;
    if (h.includes('filter-price')) return 'price';
    if (h.includes('filter-segment')) return 'segment';
    if (h.includes('filter-status')) return 'status';
    if (h.includes('filter-typology')) return 'typology';
    if (h.includes('filter-city')) return 'city';
    if (h.includes('filter-developer')) return 'developer';
    if (h.includes('filter')) return 'all';
    return null;
  });

  // Desktop Accordion State (collapsible categories)
  const [openSidebarCategories, setOpenSidebarCategories] = useState<Record<string, boolean>>({
    price: true,
    segment: true,
    status: true,
    typology: false,
    city: false,
    developer: false,
  });

  const toggleSidebarCategory = (catKey: string) => {
    setOpenSidebarCategories((prev) => ({
      ...prev,
      [catKey]: !prev[catKey],
    }));
  };

  // Dynamic available typologies based on category
  const availableTypologies = useMemo(() => {
    if (activeCategory === 'residential') return RESIDENTIAL_TYPOLOGIES;
    if (activeCategory === 'commercial') return COMMERCIAL_TYPOLOGIES;
    return PLOTS_TYPOLOGIES;
  }, [activeCategory]);

  // Handle typology toggle
  const toggleTypology = (typology: string) => {
    setSelectedTypologies((prev) =>
      prev.includes(typology) ? prev.filter((t) => t !== typology) : [...prev, typology]
    );
  };

  // Handle developer toggle
  const toggleDeveloper = (devName: string) => {
    setSelectedDevelopers((prev) =>
      prev.includes(devName) ? prev.filter((d) => d !== devName) : [...prev, devName]
    );
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCity('All');
    setSelectedSegment('All');
    setSelectedStatus('All');
    setSelectedTypologies([]);
    setSelectedDevelopers([]);
    setSelectedPriceRange(PRICE_RANGES[0]);
    setMinPrice(0);
    setMaxPrice(19000);
    setCurrentPageNum(1);
  };

  // Active filter count for badge indicator
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCity !== 'All') count++;
    if (selectedSegment !== 'All') count++;
    if (selectedStatus !== 'All') count++;
    if (selectedTypologies.length > 0) count += selectedTypologies.length;
    if (selectedDevelopers.length > 0) count += selectedDevelopers.length;
    if (minPrice > 0 || maxPrice < 19000 || selectedPriceRange.label !== 'All Budgets') count++;
    if (searchQuery.trim().length > 0) count++;
    return count;
  }, [
    selectedCity,
    selectedSegment,
    selectedStatus,
    selectedTypologies,
    selectedDevelopers,
    selectedPriceRange,
    minPrice,
    maxPrice,
    searchQuery,
  ]);

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return allProjects.filter((project) => {
      // 1. Category filter
      if (project.category !== activeCategory) return false;

      // 2. City filter
      if (selectedCity !== 'All' && project.city !== selectedCity) return false;

      // 3. Segment filter:
      // Affordable (within 1.5 Cr), Luxury (1.5 - 6 Cr), Super Luxury (7 - 15 Cr), Ultra Luxury (> 15 Cr)
      if (selectedSegment !== 'All') {
        if (selectedSegment === 'Affordable') {
          const isAffordable = project.segment === 'Affordable' || project.priceMax <= 150;
          if (!isAffordable) return false;
        } else if (selectedSegment === 'Luxury') {
          const isLuxury = project.segment === 'Luxury' || (project.priceMin >= 150 && project.priceMax <= 650);
          if (!isLuxury) return false;
        } else if (selectedSegment === 'Super Luxury') {
          const isSuperLuxury =
            project.segment === 'Super Luxury' ||
            (project.priceMin >= 700 && project.priceMax <= 1500) ||
            (project.priceMax >= 700 && project.priceMax <= 1500 && project.priceMin < 1500);
          if (!isSuperLuxury) return false;
        } else if (selectedSegment === 'Ultra Luxury') {
          const isUltraLuxury = project.segment === 'Ultra Luxury' || project.priceMax > 1500;
          if (!isUltraLuxury) return false;
        }
      }

      // 4. Status filter (Resell, Ready to Move, Under Construction, Pre-launch)
      if (selectedStatus !== 'All' && project.status !== selectedStatus) return false;

      // 5. Typology filter
      if (selectedTypologies.length > 0) {
        const hasMatchingTypology = project.typologies.some((projTyp) =>
          selectedTypologies.some((selTyp) => {
            if (projTyp === selTyp) return true;
            if (projTyp.startsWith(selTyp)) return true;
            return false;
          })
        );
        if (!hasMatchingTypology) return false;
      }

      // 6. Developer filter
      if (selectedDevelopers.length > 0) {
        if (!selectedDevelopers.includes(project.developer)) return false;
      }

      // 7. Price filter (Interactive Slider & Presets)
      if (minPrice > 0 || maxPrice < 19000) {
        const overlapsMin = project.priceMin <= maxPrice;
        const overlapsMax = project.priceMax >= minPrice;
        if (!overlapsMin || !overlapsMax) return false;
      }

      // 8. Search query
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = project.name.toLowerCase().includes(query);
        const matchDev = project.developer.toLowerCase().includes(query);
        const matchLoc = project.location.toLowerCase().includes(query);
        const matchCity = project.city.toLowerCase().includes(query);
        const matchTypology = project.typologies.some((t) => t.toLowerCase().includes(query));
        const matchStatus = project.status.toLowerCase().includes(query);
        if (!matchName && !matchDev && !matchLoc && !matchCity && !matchTypology && !matchStatus) {
          return false;
        }
      }

      return true;
    });
  }, [
    activeCategory,
    selectedCity,
    selectedSegment,
    selectedStatus,
    selectedTypologies,
    selectedDevelopers,
    minPrice,
    maxPrice,
    searchQuery,
  ]);

  const getWhatsAppProjectLink = (project: Project) => {
    const text = `Hi Aurex Estates, I am interested in advisory for ${project.name} by ${project.developer} in ${project.location}, ${project.city}. Please share complete floor plans and investment analysis.`;
    return `https://wa.me/918796791087?text=${encodeURIComponent(text)}`;
  };

  const pageTitle =
    activeCategory === 'residential'
      ? 'Residential Projects'
      : activeCategory === 'commercial'
      ? 'Commercial Projects'
      : 'Plots';

  // Pagination Calculations (Show 6 projects per view)
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE) || 1;
  const safeCurrentPage = Math.min(Math.max(1, currentPageNum), totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProjects = useMemo(() => {
    return filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProjects, startIndex]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPageNum(newPage);
    if (projectsListTopRef.current) {
      const topOffset = projectsListTopRef.current.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: Math.max(0, topOffset), behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-brand-dark pt-16 sm:pt-20 pb-24 md:pb-16 overflow-x-hidden w-full">
      {/* Top Header: Exactly aligned with Header logo on left and WhatsApp chat on right */}
      <div className="bg-white border-b border-gray-200/80 py-2.5 sm:py-3 shadow-xs">
        <div className="max-w-site mx-auto px-4 sm:px-8 md:px-12 flex items-center justify-between">
          <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-gray-950">
            {pageTitle}
          </h1>
          <span className="text-xs sm:text-sm font-semibold text-gray-700">
            <strong className="text-gray-950 font-bold">{filteredProjects.length}</strong> Properties Available
          </span>
        </div>
      </div>

      {/* Main Content Layout with Desktop Left Sidebar Filter (Exactly aligned with max-w-site & header) */}
      <div className="max-w-site mx-auto px-4 sm:px-8 md:px-12 mt-4 sm:mt-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* =========================================================================
              DESKTOP LEFT SIDEBAR (Sticky, Accordion Category Filters with Single-Word Titles)
          ========================================================================= */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-thin bg-white rounded-3xl p-5 border border-gray-200/90 shadow-sm space-y-4">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-150">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-purple" />
                <h2 className="text-sm font-bold text-gray-950 uppercase tracking-wide">Filters</h2>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-brand-purple text-white text-[10px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              {activeFilterCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-gray-700 hover:text-red-600 transition-colors"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* 1. Quick Keyword Search */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-800 block mb-1.5">
                Search
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-gray-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Project, developer, area..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-gray-50 border border-gray-250 text-xs font-medium text-gray-950 placeholder:text-gray-500 focus:bg-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* 2. Category: Price (One word, real-time slider and clean presets without segment) */}
            <div className="border border-gray-200/90 rounded-2xl overflow-hidden bg-gray-50/50">
              <button
                onClick={() => toggleSidebarCategory('price')}
                className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-gray-100/70 transition-colors"
              >
                <div>
                  <span className="text-xs font-bold text-gray-900 block">Price</span>
                  {(minPrice > 0 || maxPrice < 19000) && (
                    <span className="text-[10px] font-semibold text-brand-purple block truncate max-w-[170px]">
                      {minPrice === 0 ? `Up to ${formatLakhs(maxPrice)}` : `${formatLakhs(minPrice)} - ${formatLakhs(maxPrice)}`}
                    </span>
                  )}
                </div>
                {openSidebarCategories.price ? (
                  <ChevronUp className="w-4 h-4 text-gray-700" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-700" />
                )}
              </button>

              {openSidebarCategories.price && (
                <div className="p-3 pt-2 space-y-3 border-t border-gray-200/60 bg-white">
                  {/* Price Slider with real-time value */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-gray-800">
                      <span>Max Budget</span>
                      <span className="text-brand-purple text-xs font-extrabold">{formatLakhs(maxPrice)}</span>
                    </div>

                    <div className="relative pt-6 pb-1">
                      {/* Real-time floating value tooltip */}
                      <div
                        style={{ left: `calc(${sliderPct}% + ${(50 - sliderPct) * 0.18}px)` }}
                        className="absolute top-0 -translate-x-1/2 bg-brand-purple text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap pointer-events-none flex items-center gap-1 z-10"
                      >
                        <span>{formatLakhs(maxPrice)}</span>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-brand-purple rotate-45" />
                      </div>

                      <input
                        type="range"
                        min={50}
                        max={19000}
                        step={10}
                        value={maxPrice}
                        onInput={(e) => handleSliderChange(Number((e.target as HTMLInputElement).value))}
                        onChange={(e) => handleSliderChange(Number(e.target.value))}
                        className="custom-range-slider w-full h-2 rounded-lg appearance-none cursor-pointer"
                        style={{
                          touchAction: 'none',
                          background: `linear-gradient(to right, #8B2BE2 0%, #8B2BE2 ${sliderPct}%, #E5E7EB ${sliderPct}%, #E5E7EB 100%)`,
                        }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-gray-600 font-semibold">
                      <span>₹50 Lakh</span>
                      <span>₹190 Cr+</span>
                    </div>
                  </div>

                  {/* Clean Presets without segment names */}
                  <div className="space-y-1 pt-1 border-t border-gray-150">
                    {PRICE_RANGES.map((range) => {
                      const isSelected = selectedPriceRange.label === range.label;
                      return (
                        <button
                          key={range.label}
                          onClick={() => {
                            setSelectedPriceRange(range);
                            setMinPrice(range.minLakhs);
                            setMaxPrice(range.maxLakhs);
                          }}
                          className={`w-full py-1.5 px-3 text-xs font-semibold rounded-xl border text-left transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-brand-purple text-white border-brand-purple shadow-sm'
                              : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <span className="truncate">{range.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Category: Segment (One word, pure segment names without price) */}
            <div className="border border-gray-200/90 rounded-2xl overflow-hidden bg-gray-50/50">
              <button
                onClick={() => toggleSidebarCategory('segment')}
                className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-gray-100/70 transition-colors"
              >
                <div>
                  <span className="text-xs font-bold text-gray-900 block">Segment</span>
                  {selectedSegment !== 'All' && (
                    <span className="text-[10px] font-semibold text-brand-purple block">
                      {selectedSegment}
                    </span>
                  )}
                </div>
                {openSidebarCategories.segment ? (
                  <ChevronUp className="w-4 h-4 text-gray-700" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-700" />
                )}
              </button>

              {openSidebarCategories.segment && (
                <div className="p-3 pt-1 space-y-1.5 border-t border-gray-200/60 bg-white">
                  <button
                    onClick={() => setSelectedSegment('All')}
                    className={`w-full py-2 px-3 text-xs font-semibold rounded-xl border text-left flex items-center justify-between transition-all ${
                      selectedSegment === 'All'
                        ? 'bg-brand-purple text-white border-brand-purple shadow-sm'
                        : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span>All Segments</span>
                    {selectedSegment === 'All' && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                  {SEGMENTS.map((seg) => {
                    const isSelected = selectedSegment === seg;
                    return (
                      <button
                        key={seg}
                        onClick={() => setSelectedSegment(seg)}
                        className={`w-full py-2 px-3 text-xs font-semibold rounded-xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-brand-purple text-white border-brand-purple shadow-sm'
                            : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <span>{seg}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 4. Category: Status (One word) */}
            <div className="border border-gray-200/90 rounded-2xl overflow-hidden bg-gray-50/50">
              <button
                onClick={() => toggleSidebarCategory('status')}
                className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-gray-100/70 transition-colors"
              >
                <div>
                  <span className="text-xs font-bold text-gray-900 block">Status</span>
                  {selectedStatus !== 'All' && (
                    <span className="text-[10px] font-semibold text-brand-purple block">
                      {selectedStatus}
                    </span>
                  )}
                </div>
                {openSidebarCategories.status ? (
                  <ChevronUp className="w-4 h-4 text-gray-700" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-700" />
                )}
              </button>

              {openSidebarCategories.status && (
                <div className="p-3 pt-1 space-y-1.5 border-t border-gray-200/60 bg-white">
                  <button
                    onClick={() => setSelectedStatus('All')}
                    className={`w-full py-2 px-3 text-xs font-semibold rounded-xl border text-left flex items-center justify-between transition-all ${
                      selectedStatus === 'All'
                        ? 'bg-brand-purple text-white border-brand-purple shadow-sm'
                        : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span>All Status</span>
                    {selectedStatus === 'All' && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                  {STATUSES.map((status) => {
                    const isSelected = selectedStatus === status;
                    return (
                      <button
                        key={status}
                        onClick={() => setSelectedStatus(status)}
                        className={`w-full py-2 px-3 text-xs font-semibold rounded-xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-brand-purple text-white border-brand-purple shadow-sm'
                            : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <span>{status}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 5. Category: Typology (One word) */}
            <div className="border border-gray-200/90 rounded-2xl overflow-hidden bg-gray-50/50">
              <button
                onClick={() => toggleSidebarCategory('typology')}
                className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-gray-100/70 transition-colors"
              >
                <div>
                  <span className="text-xs font-bold text-gray-900 block">Typology</span>
                  {selectedTypologies.length > 0 && (
                    <span className="text-[10px] font-semibold text-brand-purple block">
                      {selectedTypologies.length} selected
                    </span>
                  )}
                </div>
                {openSidebarCategories.typology ? (
                  <ChevronUp className="w-4 h-4 text-gray-700" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-700" />
                )}
              </button>

              {openSidebarCategories.typology && (
                <div className="p-3 pt-1 border-t border-gray-200/60 bg-white">
                  <div className="flex flex-wrap gap-1.5">
                    {availableTypologies.map((typology) => {
                      const isSelected = selectedTypologies.includes(typology);
                      return (
                        <button
                          key={typology}
                          onClick={() => toggleTypology(typology)}
                          className={`px-2.5 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                            isSelected
                              ? 'bg-brand-purple text-white border-brand-purple shadow-sm'
                              : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {typology}
                        </button>
                      );
                    })}
                  </div>
                  {selectedTypologies.length > 0 && (
                    <button
                      onClick={() => setSelectedTypologies([])}
                      className="mt-2 text-[11px] font-bold text-brand-purple hover:underline"
                    >
                      Clear Typology
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 6. Category: City (One word) */}
            <div className="border border-gray-200/90 rounded-2xl overflow-hidden bg-gray-50/50">
              <button
                onClick={() => toggleSidebarCategory('city')}
                className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-gray-100/70 transition-colors"
              >
                <div>
                  <span className="text-xs font-bold text-gray-900 block">City</span>
                  {selectedCity !== 'All' && (
                    <span className="text-[10px] font-semibold text-brand-purple block">
                      {selectedCity}
                    </span>
                  )}
                </div>
                {openSidebarCategories.city ? (
                  <ChevronUp className="w-4 h-4 text-gray-700" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-700" />
                )}
              </button>

              {openSidebarCategories.city && (
                <div className="p-3 pt-1 space-y-1.5 border-t border-gray-200/60 bg-white">
                  <button
                    onClick={() => setSelectedCity('All')}
                    className={`w-full py-1.5 px-3 text-xs font-semibold rounded-xl border text-left flex items-center justify-between transition-all ${
                      selectedCity === 'All'
                        ? 'bg-brand-purple text-white border-brand-purple shadow-sm'
                        : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span>All Cities</span>
                    {selectedCity === 'All' && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                  {CITIES.map((city) => {
                    const isSelected = selectedCity === city;
                    return (
                      <button
                        key={city}
                        onClick={() => setSelectedCity(city)}
                        className={`w-full py-1.5 px-3 text-xs font-semibold rounded-xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-brand-purple text-white border-brand-purple shadow-sm'
                            : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <span>{city}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 7. Category: Developer (One word, LOGOS ONLY) */}
            <div className="border border-gray-200/90 rounded-2xl overflow-hidden bg-gray-50/50">
              <button
                onClick={() => toggleSidebarCategory('developer')}
                className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-gray-100/70 transition-colors"
              >
                <div>
                  <span className="text-xs font-bold text-gray-900 block">Developer</span>
                  {selectedDevelopers.length > 0 && (
                    <span className="text-[10px] font-semibold text-brand-purple block">
                      {selectedDevelopers.length} selected
                    </span>
                  )}
                </div>
                {openSidebarCategories.developer ? (
                  <ChevronUp className="w-4 h-4 text-gray-700" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-700" />
                )}
              </button>

              {openSidebarCategories.developer && (
                <div className="p-3 pt-1 border-t border-gray-200/60 bg-white">
                  <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1 scrollbar-thin">
                    {DEVELOPERS.map((dev) => {
                      const isSelected = selectedDevelopers.includes(dev.name);
                      return (
                        <button
                          key={dev.id}
                          onClick={() => toggleDeveloper(dev.name)}
                          className={`relative h-13 p-1.5 rounded-xl border flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-purple-50/80 border-brand-purple ring-2 ring-brand-purple/20 shadow-sm'
                              : 'bg-white border-gray-250 hover:border-gray-400 hover:bg-gray-50/80 shadow-xs'
                          }`}
                          title={dev.name}
                        >
                          <DeveloperLogo id={dev.id} className="h-6 w-auto max-w-[85px] object-contain mx-auto" />
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-brand-purple text-white flex items-center justify-center shadow-xs">
                              <Check className="w-2 h-2" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {selectedDevelopers.length > 0 && (
                    <button
                      onClick={() => setSelectedDevelopers([])}
                      className="mt-2 text-[11px] font-bold text-brand-purple hover:underline"
                    >
                      Clear Developers
                    </button>
                  )}
                </div>
              )}
            </div>
          </aside>

          {/* =========================================================================
              RIGHT CONTENT AREA (Search Bar + Category Strip + Cards Grid)
          ========================================================================= */}
          <main className="min-w-0 w-full lg:col-span-8 xl:col-span-9 space-y-3">
            {/* MOBILE & TABLET TOP FILTER BAR (Category-First with Single-Word Titles) */}
            <div className="lg:hidden space-y-2.5 bg-white p-3 rounded-2xl border border-gray-200 shadow-sm sticky top-14 sm:top-16 z-20 min-w-0 w-full overflow-hidden">
              {/* Pushed-up Search Bar */}
              <div className="relative w-full">
                <Search className="w-4 h-4 text-gray-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search project, developer (e.g. DLF, Whiteland)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-gray-50 border border-gray-250 text-xs font-medium text-gray-950 placeholder:text-gray-500 focus:bg-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Horizontal Scrollable CATEGORY Chips Strip (Single-Word Labels) */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5 px-0.5 min-w-0 w-full">
                {/* 1. All Filters Drawer Trigger */}
                <button
                  onClick={() => setActiveCategoryModal('all')}
                  className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    activeFilterCount > 0
                      ? 'bg-brand-purple text-white border-brand-purple shadow-sm'
                      : 'bg-gray-100 text-gray-900 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-white text-brand-purple text-[10px] font-bold flex items-center justify-center ml-0.5">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* 2. Category: Price (Single word, no range word) */}
                <button
                  onClick={() => setActiveCategoryModal('price')}
                  className={`shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    minPrice > 0 || maxPrice < 19000
                      ? 'bg-brand-purple text-white border-brand-purple shadow-sm'
                      : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span>
                    {minPrice > 0 || maxPrice < 19000
                      ? minPrice === 0
                        ? `Price: Up to ${formatLakhs(maxPrice)}`
                        : `Price: ${formatLakhs(minPrice)} - ${formatLakhs(maxPrice)}`
                      : 'Price'}
                  </span>
                  <ChevronDown className="w-3 h-3 opacity-75" />
                </button>

                {/* 3. Category: Segment (Single word) */}
                <button
                  onClick={() => setActiveCategoryModal('segment')}
                  className={`shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    selectedSegment !== 'All'
                      ? 'bg-brand-purple text-white border-brand-purple shadow-sm'
                      : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span>{selectedSegment !== 'All' ? `Segment: ${selectedSegment}` : 'Segment'}</span>
                  <ChevronDown className="w-3 h-3 opacity-75" />
                </button>

                {/* 4. Category: Status (Single word) */}
                <button
                  onClick={() => setActiveCategoryModal('status')}
                  className={`shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    selectedStatus !== 'All'
                      ? 'bg-brand-purple text-white border-brand-purple shadow-sm'
                      : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span>{selectedStatus !== 'All' ? `Status: ${selectedStatus}` : 'Status'}</span>
                  <ChevronDown className="w-3 h-3 opacity-75" />
                </button>

                {/* 5. Category: Typology (Single word) */}
                <button
                  onClick={() => setActiveCategoryModal('typology')}
                  className={`shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    selectedTypologies.length > 0
                      ? 'bg-brand-purple text-white border-brand-purple shadow-sm'
                      : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span>
                    {selectedTypologies.length > 0
                      ? `Typology (${selectedTypologies.length})`
                      : 'Typology'}
                  </span>
                  <ChevronDown className="w-3 h-3 opacity-75" />
                </button>

                {/* 6. Category: City (Single word) */}
                <button
                  onClick={() => setActiveCategoryModal('city')}
                  className={`shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    selectedCity !== 'All'
                      ? 'bg-brand-purple text-white border-brand-purple shadow-sm'
                      : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span>{selectedCity !== 'All' ? `City: ${selectedCity}` : 'City'}</span>
                  <ChevronDown className="w-3 h-3 opacity-75" />
                </button>

                {/* 7. Category: Developer (Single word) */}
                <button
                  onClick={() => setActiveCategoryModal('developer')}
                  className={`shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    selectedDevelopers.length > 0
                      ? 'bg-brand-purple text-white border-brand-purple shadow-sm'
                      : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span>
                    {selectedDevelopers.length > 0
                      ? `Developer (${selectedDevelopers.length})`
                      : 'Developer'}
                  </span>
                  <ChevronDown className="w-3 h-3 opacity-75" />
                </button>
              </div>
            </div>

            {/* Anchor ref for smooth pagination scrolling */}
            <div ref={projectsListTopRef} />

            {/* Active Filter Chips (No repetitive count text) */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 py-1">
                <span className="text-xs text-gray-700 font-bold">Active:</span>

                  {(minPrice > 0 || maxPrice < 19000) && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-purple/10 border border-brand-purple/30 text-brand-purple text-xs font-bold">
                      {minPrice === 0 ? `Price: Up to ${formatLakhs(maxPrice)}` : `Price: ${formatLakhs(minPrice)} - ${formatLakhs(maxPrice)}`}
                      <button
                        onClick={() => {
                          setMinPrice(0);
                          setMaxPrice(19000);
                          setSelectedPriceRange(PRICE_RANGES[0]);
                        }}
                        className="hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedSegment !== 'All' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-purple/10 border border-brand-purple/30 text-brand-purple text-xs font-bold">
                      {selectedSegment}
                      <button onClick={() => setSelectedSegment('All')} className="hover:text-red-600">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedStatus !== 'All' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-purple/10 border border-brand-purple/30 text-brand-purple text-xs font-bold">
                      {selectedStatus}
                      <button onClick={() => setSelectedStatus('All')} className="hover:text-red-600">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedCity !== 'All' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-purple/10 border border-brand-purple/30 text-brand-purple text-xs font-bold">
                      {selectedCity}
                      <button onClick={() => setSelectedCity('All')} className="hover:text-red-600">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedTypologies.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-purple/10 border border-brand-purple/30 text-brand-purple text-xs font-bold"
                    >
                      {t}
                      <button onClick={() => toggleTypology(t)} className="hover:text-red-600">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {selectedDevelopers.map((d) => (
                    <span
                      key={d}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-purple/10 border border-brand-purple/30 text-brand-purple text-xs font-bold"
                    >
                      {d}
                      <button onClick={() => toggleDeveloper(d)} className="hover:text-red-600">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  <button
                    onClick={handleResetFilters}
                    className="text-xs text-gray-700 hover:text-red-600 underline font-bold ml-1"
                  >
                    Reset All
                  </button>
                </div>
              )}

            {/* Project Cards Grid */}
            {filteredProjects.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm max-w-xl mx-auto my-8">
                <h3 className="text-xl font-bold text-gray-950 mb-2">No Matching Properties Found</h3>
                <p className="text-sm text-gray-700 mb-6 font-medium">
                  No projects match your current filters. Try expanding your price range, city, or status selection.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-full bg-brand-purple text-white text-xs uppercase tracking-wider font-bold hover:bg-brand-purpleDark transition-colors shadow-md"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
                {paginatedProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="luxury-card bg-white rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300"
                  >
                    {/* Hero Card Image */}
                    <div
                      className="relative h-52 sm:h-56 w-full overflow-hidden img-zoom-container cursor-pointer"
                      onClick={() => onSelectProject(project.id)}
                    >
                      <img
                        src={project.image}
                        alt={project.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30" />

                      {/* Prominent Status & Segment Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStatus(project.status);
                          }}
                          className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md cursor-pointer transition-transform active:scale-95 hover:opacity-90 ${
                            project.status === 'Resell'
                              ? 'bg-amber-500 text-white'
                              : project.status === 'Ready to Move'
                              ? 'bg-emerald-600 text-white'
                              : project.status === 'Under Construction'
                              ? 'bg-blue-600 text-white'
                              : 'bg-brand-purple text-white'
                          }`}
                        >
                          {project.status}
                        </span>

                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSegment(project.segment);
                          }}
                          className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border border-white/20 cursor-pointer transition-transform active:scale-95"
                        >
                          {project.segment}
                        </span>
                      </div>

                      {/* Bottom Image Overlay: Clean visible price (no 'Price on Request', no redundant 'View Project' button) */}
                      <div className="absolute bottom-3 left-3.5 right-3.5 z-10 flex items-end justify-between">
                        <span className="text-lg sm:text-xl font-bold text-white tracking-tight text-shadow-subtle">
                          {project.priceDisplay}
                        </span>
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Developer Name & Location */}
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">
                            {project.developer}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] text-gray-800 font-semibold">
                            <MapPin className="w-3.5 h-3.5 text-gray-700 shrink-0" />
                            {project.city}
                          </span>
                        </div>

                        {/* Project Title */}
                        <h3
                          onClick={() => onSelectProject(project.id)}
                          className="text-base sm:text-lg font-bold text-gray-950 tracking-tight group-hover:text-brand-purple transition-colors cursor-pointer mb-1"
                        >
                          {project.name}
                        </h3>

                        {/* Location */}
                        <p className="text-xs text-gray-700 font-medium mb-3 truncate">
                          {project.location}
                        </p>

                        {/* Typologies Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {project.typologies.slice(0, 3).map((typology) => (
                            <span
                              key={typology}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTypologies([typology]);
                              }}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-gray-100 hover:bg-brand-purple/15 hover:text-brand-purple hover:border-brand-purple/40 text-gray-800 border border-gray-250 cursor-pointer transition-colors"
                            >
                              {typology}
                            </span>
                          ))}
                          {project.typologies.length > 3 && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-lg bg-gray-100 text-gray-700">
                              +{project.typologies.length - 3}
                            </span>
                          )}
                        </div>

                        {/* Size Metric */}
                        <div className="text-xs text-gray-800 font-medium pb-3 border-b border-gray-150 flex items-center justify-between">
                          <span className="text-gray-700 font-semibold">Size:</span>
                          <span className="font-bold text-gray-950">{project.sizeDisplay}</span>
                        </div>
                      </div>

                      {/* Action Buttons: WhatsApp & View Details (Prominently Highlighted, single line on all screens) */}
                      <div className="pt-3.5 grid grid-cols-2 gap-2">
                        <a
                          href={getWhatsAppProjectLink(project)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] xl:text-xs font-bold transition-all duration-200 active:scale-95 shadow-sm whitespace-nowrap overflow-hidden"
                        >
                          <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                          <span className="whitespace-nowrap">WhatsApp</span>
                        </a>

                        <button
                          onClick={() => onSelectProject(project.id)}
                          className="inline-flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purpleDark text-white text-[11px] xl:text-xs font-bold shadow-md shadow-brand-purple/20 transition-all duration-200 active:scale-95 whitespace-nowrap overflow-hidden"
                        >
                          <span className="whitespace-nowrap">View Details</span>
                          <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination Controls: Counting & Angular Buttons */}
            {filteredProjects.length > ITEMS_PER_PAGE && (
              <div className="mt-8 pt-6 border-t border-gray-200/80 flex justify-center items-center">
                {/* Numbered Pagination with Angular Buttons: < 1 2 3 4 5 > */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {/* Prev Angular Button */}
                  <button
                    onClick={() => handlePageChange(safeCurrentPage - 1)}
                    disabled={safeCurrentPage <= 1}
                    className={`inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-xs font-bold border transition-all ${
                      safeCurrentPage <= 1
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50'
                        : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50 hover:border-brand-purple active:scale-95'
                    }`}
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Page Numbers (1, 2, 3, 4, 5...) */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    const isActive = pageNum === safeCurrentPage;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center transition-all ${
                          isActive
                            ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/30 ring-2 ring-brand-purple/20'
                            : 'bg-white text-gray-800 border border-gray-250 hover:bg-gray-50 hover:border-brand-purple active:scale-95'
                        }`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {/* Next Angular Button */}
                  <button
                    onClick={() => handlePageChange(safeCurrentPage + 1)}
                    disabled={safeCurrentPage >= totalPages}
                    className={`inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-xs font-bold border transition-all ${
                      safeCurrentPage >= totalPages
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50'
                        : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50 hover:border-brand-purple active:scale-95'
                    }`}
                    aria-label="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* =========================================================================
          CATEGORY-FIRST FILTER MODAL (Bottom Sheet Drawer on Mobile/Tablet)
          Clear segregation between categories, all category titles (including Developer) visible,
          buttery smooth real-time slider with dynamic floating value bubble.
      ========================================================================= */}
      <AnimatePresence>
        {activeCategoryModal !== null && (
          <div className="fixed inset-0 z-[60] flex items-end justify-center lg:hidden w-full max-w-full overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCategoryModal(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              className="relative w-full max-w-lg mx-auto bg-white rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-gray-200"
            >
              {/* Header */}
              <div className="px-4 sm:px-5 py-3.5 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10 w-full">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-brand-purple" />
                  <h2 className="text-base font-bold text-gray-950">
                    {activeCategoryModal === 'price' && 'Select Price'}
                    {activeCategoryModal === 'segment' && 'Select Segment'}
                    {activeCategoryModal === 'status' && 'Select Status'}
                    {activeCategoryModal === 'typology' && 'Select Typology'}
                    {activeCategoryModal === 'city' && 'Select City'}
                    {activeCategoryModal === 'developer' && 'Select Developer'}
                    {activeCategoryModal === 'all' && 'Filters'}
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleResetFilters}
                    className="text-xs text-gray-700 hover:text-brand-purple font-bold"
                  >
                    Reset All
                  </button>
                  <button
                    onClick={() => setActiveCategoryModal(null)}
                    className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable Body: Clear Segregation between categories */}
              <div className="p-3.5 sm:p-5 overflow-y-auto space-y-3.5 scrollbar-thin w-full">
                {/* 1. Price Category Section */}
                {(activeCategoryModal === 'price' || activeCategoryModal === 'all') && (
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-gray-50/80 border border-gray-200 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-gray-900">
                        Price
                      </span>
                      <span className="text-xs font-bold text-brand-purple">
                        {minPrice === 0 && maxPrice >= 19000 ? 'All Budgets' : `Up to ${formatLakhs(maxPrice)}`}
                      </span>
                    </div>

                    {/* Price Slider Box with real-time dynamic floating thumb bubble */}
                    <div className="p-3.5 bg-white rounded-2xl border border-gray-200 space-y-2 shadow-xs">
                      <div className="flex items-center justify-between text-xs font-bold text-gray-900">
                        <span>Max Budget</span>
                        <span className="text-brand-purple font-extrabold text-sm">{formatLakhs(maxPrice)}</span>
                      </div>

                      <div className="relative pt-7 pb-1">
                        {/* Dynamic real-time floating tooltip directly on thumb */}
                        <div
                          style={{ left: `calc(${sliderPct}% + ${(50 - sliderPct) * 0.18}px)` }}
                          className="absolute top-0 -translate-x-1/2 bg-brand-purple text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap pointer-events-none flex items-center gap-1 z-10"
                        >
                          <span>{formatLakhs(maxPrice)}</span>
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-brand-purple rotate-45" />
                        </div>

                        <input
                          type="range"
                          min={50}
                          max={19000}
                          step={10}
                          value={maxPrice}
                          onInput={(e) => handleSliderChange(Number((e.target as HTMLInputElement).value))}
                          onChange={(e) => handleSliderChange(Number(e.target.value))}
                          className="custom-range-slider w-full h-2.5 rounded-lg appearance-none cursor-pointer"
                          style={{
                            touchAction: 'none',
                            background: `linear-gradient(to right, #8B2BE2 0%, #8B2BE2 ${sliderPct}%, #E5E7EB ${sliderPct}%, #E5E7EB 100%)`,
                          }}
                        />
                      </div>

                      <div className="flex justify-between text-[10px] text-gray-600 font-semibold">
                        <span>₹50 Lakh</span>
                        <span>₹190 Cr+</span>
                      </div>
                    </div>

                    {/* Presets without segment names */}
                    <div className="grid grid-cols-1 gap-1.5 pt-1">
                      {PRICE_RANGES.map((range) => {
                        const isSelected = selectedPriceRange.label === range.label;
                        return (
                          <button
                            key={range.label}
                            onClick={() => {
                              setSelectedPriceRange(range);
                              setMinPrice(range.minLakhs);
                              setMaxPrice(range.maxLakhs);
                              if (activeCategoryModal === 'price') setActiveCategoryModal(null);
                            }}
                            className={`py-2.5 px-3.5 text-xs font-bold rounded-xl border text-left flex items-center justify-between transition-all ${
                              isSelected
                                ? 'bg-brand-purple text-white border-brand-purple shadow-sm'
                                : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            <span>{range.label}</span>
                            {isSelected && <Check className="w-4 h-4 shrink-0 ml-2" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. Segment Category Section */}
                {(activeCategoryModal === 'segment' || activeCategoryModal === 'all') && (
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-gray-50/80 border border-gray-200 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-gray-900">
                        Segment
                      </span>
                      {selectedSegment !== 'All' && (
                        <span className="text-xs font-bold text-brand-purple">{selectedSegment}</span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedSegment('All');
                          if (activeCategoryModal === 'segment') setActiveCategoryModal(null);
                        }}
                        className={`py-2.5 px-3.5 text-xs font-bold rounded-xl border text-left flex items-center justify-between transition-all ${
                          selectedSegment === 'All'
                            ? 'bg-brand-purple text-white border-brand-purple shadow-sm'
                            : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <span>All Segments</span>
                        {selectedSegment === 'All' && <Check className="w-4 h-4 shrink-0" />}
                      </button>
                      {SEGMENTS.map((seg) => {
                        const isSelected = selectedSegment === seg;
                        return (
                          <button
                            key={seg}
                            onClick={() => {
                              setSelectedSegment(seg);
                              if (activeCategoryModal === 'segment') setActiveCategoryModal(null);
                            }}
                            className={`py-2.5 px-3.5 text-xs font-bold rounded-xl border text-left flex items-center justify-between transition-all ${
                              isSelected
                                ? 'bg-brand-purple text-white border-brand-purple shadow-sm'
                                : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            <span>{seg}</span>
                            {isSelected && <Check className="w-4 h-4 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. Status Category Section */}
                {(activeCategoryModal === 'status' || activeCategoryModal === 'all') && (
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-gray-50/80 border border-gray-200 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-gray-900">
                        Status
                      </span>
                      {selectedStatus !== 'All' && (
                        <span className="text-xs font-bold text-brand-purple">{selectedStatus}</span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setSelectedStatus('All');
                          if (activeCategoryModal === 'status') setActiveCategoryModal(null);
                        }}
                        className={`py-2.5 px-3 text-xs font-bold rounded-xl border text-center transition-all ${
                          selectedStatus === 'All'
                            ? 'bg-brand-purple text-white border-brand-purple shadow-sm'
                            : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        All Status
                      </button>
                      {STATUSES.map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setSelectedStatus(status);
                            if (activeCategoryModal === 'status') setActiveCategoryModal(null);
                          }}
                          className={`py-2.5 px-3 text-xs font-bold rounded-xl border text-center transition-all ${
                            selectedStatus === status
                              ? 'bg-brand-purple text-white border-brand-purple shadow-sm'
                              : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Typology Category Section */}
                {(activeCategoryModal === 'typology' || activeCategoryModal === 'all') && (
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-gray-50/80 border border-gray-200 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-gray-900">
                        Typology
                      </span>
                      {selectedTypologies.length > 0 && (
                        <button
                          onClick={() => setSelectedTypologies([])}
                          className="text-[11px] text-brand-purple font-bold underline"
                        >
                          Clear ({selectedTypologies.length})
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {availableTypologies.map((typology) => {
                        const isSelected = selectedTypologies.includes(typology);
                        return (
                          <button
                            key={typology}
                            onClick={() => toggleTypology(typology)}
                            className={`px-3 py-2 text-xs font-bold rounded-xl border flex items-center gap-1.5 transition-all ${
                              isSelected
                                ? 'bg-brand-purple text-white border-brand-purple shadow-sm'
                                : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                            <span>{typology}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 5. City Category Section */}
                {(activeCategoryModal === 'city' || activeCategoryModal === 'all') && (
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-gray-50/80 border border-gray-200 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-gray-900">
                        City
                      </span>
                      {selectedCity !== 'All' && (
                        <span className="text-xs font-bold text-brand-purple">{selectedCity}</span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setSelectedCity('All');
                          if (activeCategoryModal === 'city') setActiveCategoryModal(null);
                        }}
                        className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all ${
                          selectedCity === 'All'
                            ? 'bg-brand-purple text-white border-brand-purple'
                            : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        All Cities
                      </button>
                      {CITIES.map((city) => (
                        <button
                          key={city}
                          onClick={() => {
                            setSelectedCity(city);
                            if (activeCategoryModal === 'city') setActiveCategoryModal(null);
                          }}
                          className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all ${
                            selectedCity === city
                              ? 'bg-brand-purple text-white border-brand-purple'
                              : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. Developer Category Section (SHOWS LOGOS NOT NAMES, CLEAR SEGREGATION) */}
                {(activeCategoryModal === 'developer' || activeCategoryModal === 'all') && (
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-gray-50/80 border border-gray-200 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-gray-900">
                        Developer
                      </span>
                      {selectedDevelopers.length > 0 && (
                        <button
                          onClick={() => setSelectedDevelopers([])}
                          className="text-[11px] text-brand-purple font-bold underline"
                        >
                          Clear ({selectedDevelopers.length})
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto p-1 scrollbar-thin">
                      {DEVELOPERS.map((dev) => {
                        const isSelected = selectedDevelopers.includes(dev.name);
                        return (
                          <button
                            key={dev.id}
                            onClick={() => toggleDeveloper(dev.name)}
                            className={`relative h-14 sm:h-16 p-2 rounded-2xl border flex items-center justify-center transition-all ${
                              isSelected
                                ? 'bg-purple-50/80 border-brand-purple ring-2 ring-brand-purple/30 shadow-sm'
                                : 'bg-white border-gray-250 hover:border-gray-400 hover:bg-gray-50/80 shadow-xs'
                            }`}
                            title={dev.name}
                          >
                            <DeveloperLogo id={dev.id} className="h-7 sm:h-8 w-auto max-w-[105px] object-contain mx-auto" />
                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-brand-purple text-white flex items-center justify-center shadow-xs">
                                <Check className="w-2.5 h-2.5" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Sticky Footer */}
              <div className="p-3.5 px-4 sm:px-5 border-t border-gray-200 bg-white flex items-center justify-between gap-3 sticky bottom-0 w-full">
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-gray-700 hover:text-red-600 underline shrink-0"
                >
                  Reset All
                </button>
                <button
                  onClick={() => setActiveCategoryModal(null)}
                  className="px-5 py-2.5 rounded-full bg-brand-purple hover:bg-brand-purpleDark text-white text-xs uppercase tracking-wider font-bold shadow-lg shadow-brand-purple/30 transition-all flex items-center gap-1.5 shrink-0"
                >
                  <span>Show {filteredProjects.length} Properties</span>
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
