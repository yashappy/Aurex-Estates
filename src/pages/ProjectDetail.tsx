import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Check,
  X,
  Eye,
  Calendar,
  Sparkles,
  FileDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROJECTS, getProjectFloorPlans, type FloorPlan } from '../data/projects';
import { cmsStore, type CMSProject } from '../services/cmsStore';
import { DeveloperLogo } from '../components/DeveloperLogo';

const CORPORATE_LOGO_MAP: Record<string, string> = {
  // Corporates (Route 65, Jewel, Urbana)
  'sun life': '/images/logos/corporates/sun-life.png',
  'toyota': '/images/logos/corporates/toyota.png',
  'pepsico': '/images/logos/corporates/pepsico.png',
  'pepsi': '/images/logos/corporates/pepsico.png',
  'dell': '/images/logos/corporates/dell.png',
  'zomato': '/images/logos/corporates/zomato.png',
  'ey': '/images/logos/corporates/ey.png',
  'ernst & young': '/images/logos/corporates/ey.png',
  'british airways': '/images/logos/corporates/british-airways.png',
  'genpact': '/images/logos/corporates/genpact.png',
  'huawei': '/images/logos/corporates/huawei.png',
  'philips': '/images/logos/corporates/philips.png',
  'reliance': '/images/logos/corporates/reliance.png',
  'nissan': '/images/logos/corporates/nissan.png',
  'spencer': '/images/logos/corporates/spencers.png',
  'milliman': '/images/logos/corporates/milliman.png',
  'american express': '/images/logos/corporates/american-express.png',
  'tcs': '/images/logos/corporates/tcs.png',
  'tata consultancy': '/images/logos/corporates/tcs.png',
  'hyundai': '/images/logos/corporates/hyundai.png',
  'honeywell': '/images/logos/corporates/honeywell.png',
  'fedex': '/images/logos/corporates/fedex.png',
  'ibm': '/images/logos/corporates/ibm.png',
  'cognizant': '/images/logos/corporates/cognizant.png',
  'mitsubishi': '/images/logos/corporates/mitsubishi.png',
  'state bank of india': '/images/logos/corporates/sbi.png',
  'sbi': '/images/logos/corporates/sbi.png',
  'schneider': '/images/logos/corporates/schneider.png',
  'toshiba': '/images/logos/corporates/toshiba.png',
  'bmw': '/images/logos/corporates/bmw.png',
  'sony': '/images/logos/corporates/sony.png',
  'aon': '/images/logos/corporates/aon.png',

  // Signed Retail & Anchor Brands (Atrium 57 & Commercial)
  'zudio': '/images/logos/corporates/zudio.png',
  'vishal mega mart': '/images/logos/corporates/vishal-megamart.png',
  'vishal': '/images/logos/corporates/vishal-megamart.png',
  'royal oak': '/images/logos/corporates/royaloak.png',
  'deerika': '/images/logos/corporates/deerika.png',
  'domino': '/images/logos/corporates/dominos.png',
  'subway': '/images/logos/corporates/subway.png',
  'kfc': '/images/logos/corporates/kfc.png',
  'chai point': '/images/logos/corporates/chai-point.png',
  'anytime fitness': '/images/logos/corporates/anytime-fitness.png',
  'burger singh': '/images/logos/corporates/burger-singh.png',
  'dunkin': '/images/logos/corporates/dunkin.png',
  'wow momo': '/images/logos/corporates/wow-momo.png',
  'wow! momo': '/images/logos/corporates/wow-momo.png',
  'levi': '/images/logos/corporates/levis.png',
  'puma': '/images/logos/corporates/puma.png',
  'pepe': '/images/logos/corporates/pepe-jeans.png',
  'karim': '/images/logos/corporates/karims.png',
  'nirula': '/images/logos/corporates/nirulas.png',
  'geetanjali': '/images/logos/corporates/geetanjali.png',

  // Key Economic & Corporate Anchors (Reach Buzz 114)
  'yashobhoomi': '/images/logos/corporates/yashobhoomi.png',
  'aerocity': '/images/logos/corporates/aerocity.png',
  'cybercity': '/images/logos/corporates/cybercity.png',
  'cyber city': '/images/logos/corporates/cybercity.png',
  'airport': '/images/logos/corporates/igi-airport.png',
};

const SORTED_CORPORATE_LOGO_ENTRIES = Object.entries(CORPORATE_LOGO_MAP).sort(
  (a, b) => b[0].length - a[0].length
);

const getCorporateLogo = (name: string): string | null => {
  const clean = name.toLowerCase();
  for (const [key, path] of SORTED_CORPORATE_LOGO_ENTRIES) {
    if (key.length <= 3) {
      const regex = new RegExp(`(^|[^a-z0-9])${key}([^a-z0-9]|$)`, 'i');
      if (regex.test(clean)) return path;
    } else if (clean.includes(key)) {
      return path;
    }
  }
  return null;
};

interface ProjectDetailProps {
  projectId: string;
  onBack: () => void;
  onOpenConsultation?: (projectNameOrCategory?: string) => void;
  onNavigate?: (page: any) => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({
  projectId,
  onBack,
}) => {
  // Find project by id or fallback from cmsStore
  const allCmsProjects = cmsStore.getProjects();
  const project: CMSProject =
    allCmsProjects.find(
      (p) =>
        p.id === projectId ||
        (projectId === 'westin' && p.id === 'whiteland-westin-residences') ||
        (projectId === 'westin-residences-gurugram' && p.id === 'whiteland-westin-residences') ||
        (projectId === 'the-westin-residences-gurugram' && p.id === 'whiteland-westin-residences')
    ) || allCmsProjects[0] || PROJECTS[0];

  const floorPlans: FloorPlan[] = getProjectFloorPlans(project);

  const [isFloorPlanUnlocked, setIsFloorPlanUnlocked] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(() => window.location.hash.includes('lead'));
  const [modalMode, setModalMode] = useState<'plan' | 'site-visit' | 'layout' | 'brochure'>('plan');
  const [selectedPlanForView, setSelectedPlanForView] = useState<FloorPlan | null>(null);

  // Gallery slider & Lightbox state with swipe & native pinch-to-zoom
  const galleryScrollRef = useRef<HTMLDivElement>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxCustomImage, setLightboxCustomImage] = useState<string | null>(null);
  const touchStartXRef = useRef<number>(0);
  const touchEndXRef = useRef<number>(0);

  // Form State (Name, Phone, Email)
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (window.location.hash.includes('floorplans')) {
      setTimeout(() => {
        document.getElementById('floor-plans')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, []);

  const triggerBrochureDownload = () => {
    const brochureLink = project.brochureUrl || '/brochures/westin-residences-gurugram-brochure.pdf';
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = brochureLink;
    downloadAnchor.download = `${project.name.replace(/\s+/g, '-')}-Official-Brochure.pdf`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
  };

  const handleOpenPlanModal = (plan?: FloorPlan) => {
    if (plan) setSelectedPlanForView(plan);
    if (isFloorPlanUnlocked) {
      if (plan?.image) {
        openLightboxWithImage(plan.image);
      }
      return;
    }
    setModalMode('plan');
    setFormError('');
    setIsSubmitted(false);
    setIsLeadModalOpen(true);
  };

  const handleOpenLayoutModal = () => {
    if (isFloorPlanUnlocked) {
      if (project.sitePlanImage) {
        openLightboxWithImage(project.sitePlanImage);
      }
      return;
    }
    setModalMode('layout');
    setFormError('');
    setIsSubmitted(false);
    setIsLeadModalOpen(true);
  };

  const handleOpenSiteVisitModal = () => {
    setModalMode('site-visit');
    setFormError('');
    setIsSubmitted(false);
    setIsLeadModalOpen(true);
  };

  const handleBrochureDownloadClick = () => {
    if (project.requireLeadForBrochure !== false && !isFloorPlanUnlocked) {
      setModalMode('brochure');
      setFormError('');
      setIsSubmitted(false);
      setIsLeadModalOpen(true);
    } else {
      triggerBrochureDownload();
    }
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userPhone.trim() || !userEmail.trim()) {
      setFormError('Please fill in your name, phone number, and email.');
      return;
    }

    if (userPhone.trim().length < 10) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!userEmail.includes('@') || !userEmail.includes('.')) {
      setFormError('Please enter a valid email address.');
      return;
    }

    setFormError('');
    setIsSubmitted(true);
    setIsFloorPlanUnlocked(true);

    // Record lead in CMS Store
    cmsStore.addLead({
      name: userName.trim(),
      phone: userPhone.trim(),
      email: userEmail.trim(),
      projectName: project.name,
      brochureName: project.brochureName || `${project.name} Official Brochure.pdf`,
      type: modalMode === 'brochure' ? 'brochure-download' : modalMode === 'site-visit' ? 'consultation' : 'general',
    });

    // Automatically trigger brochure download
    triggerBrochureDownload();

    setTimeout(() => {
      setIsLeadModalOpen(false);
      setIsSubmitted(false);
      if (selectedPlanForView?.image) {
        openLightboxWithImage(selectedPlanForView.image);
      }
    }, 1800);
  };

  // Gallery images list (fallback to project image if none provided)
  const gallery = project.galleryImages && project.galleryImages.length > 0
    ? project.galleryImages
    : [project.image];

  const scrollGallery = (direction: 'left' | 'right') => {
    if (galleryScrollRef.current) {
      const scrollDistance = galleryScrollRef.current.clientWidth * 0.75;
      galleryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollDistance : scrollDistance,
        behavior: 'smooth',
      });
    }
  };

  const handleGalleryScroll = () => {
    if (galleryScrollRef.current) {
      const scrollLeft = galleryScrollRef.current.scrollLeft;
      const width = galleryScrollRef.current.clientWidth;
      const index = Math.round(scrollLeft / (width * 0.75));
      setActiveGalleryIndex(Math.min(Math.max(index, 0), gallery.length - 1));
    }
  };

  // Lightbox swipe hint (first-time animated indication)
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const swipeHintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startSwipeHintTimer = () => {
    setShowSwipeHint(true);
    if (swipeHintTimerRef.current) {
      clearTimeout(swipeHintTimerRef.current);
    }
    swipeHintTimerRef.current = setTimeout(() => {
      setShowSwipeHint(false);
    }, 2400);
  };

  // Lightbox handlers (swipable & pinch-to-zoom)
  const openLightbox = (index: number) => {
    setLightboxCustomImage(null);
    setLightboxIndex(index);
    startSwipeHintTimer();
  };

  const openLightboxWithImage = (imgUrl: string) => {
    const idx = gallery.indexOf(imgUrl);
    if (idx !== -1) {
      setLightboxCustomImage(null);
      setLightboxIndex(idx);
    } else {
      setLightboxCustomImage(imgUrl);
      setLightboxIndex(0);
    }
    startSwipeHintTimer();
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    setLightboxCustomImage(null);
    setShowSwipeHint(false);
    if (swipeHintTimerRef.current) {
      clearTimeout(swipeHintTimerRef.current);
    }
  };

  const nextLightboxImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxCustomImage) return;
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev !== null ? (prev + 1) % gallery.length : 0));
    }
  };

  const prevLightboxImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxCustomImage) return;
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev !== null ? (prev - 1 + gallery.length) % gallery.length : 0));
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX;
      touchEndXRef.current = e.touches[0].clientX;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchEndXRef.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = () => {
    const diff = touchStartXRef.current - touchEndXRef.current;
    if (Math.abs(diff) > 40 && !lightboxCustomImage) {
      if (diff > 0) {
        nextLightboxImage();
      } else {
        prevLightboxImage();
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null && !lightboxCustomImage) return;
      if (e.key === 'ArrowRight') nextLightboxImage();
      if (e.key === 'ArrowLeft') prevLightboxImage();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxIndex, lightboxCustomImage]);

  const navigateToFilter = (param: 'segment' | 'status' | 'typology', value: string) => {
    const targetCategory = project.category || 'residential';
    window.location.hash = `${targetCategory}?${param}=${encodeURIComponent(value)}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const defaultWalkthroughItems = [
    {
      tag: '01 • THE RESORT',
      title: '21-Acre Urban Sanctuary',
      description:
        'Zero vehicle movement on ground level. Immersive landscaped greens, reflecting pools, cascading waterfalls, and aromatic botanical gardens.',
      image: '/images/westin/aerial-oasis.jpg',
    },
    {
      tag: '02 • HOSPITALITY',
      title: 'Marriott 5-Star Standards',
      description:
        'India’s first Westin branded residences. Bespoke 24/7 concierge, doorman welcome, valet, and on-demand housekeeping.',
      image: '/images/westin/concierge-clean.jpg',
    },
    {
      tag: '03 • THE CLUB',
      title: '1.75 Lakh Sq Ft Clubhouse',
      description:
        'Heated indoor pool, Olympic-length lap pool, private screening cinema, gymnasium, indoor badminton, and world-class spa.',
      image: '/images/westin/club-concierge.jpg',
    },
    {
      tag: '04 • ELEVATION',
      title: '13 Iconic Towers • G + 42 to 49',
      description:
        '13 iconic towers rising G+42 to 49 with 30 ft grand stilts, double-height reception lobbies, and panoramic green vistas.',
      image: '/images/westin/tower-view.jpg',
    },
  ];

  const walkthroughItems = project.walkthroughItems && project.walkthroughItems.length > 0
    ? project.walkthroughItems
    : (project.id === 'whiteland-westin-residences' ? defaultWalkthroughItems : []);

  const defaultDriveTimes = [
    { time: '15 Mins', label: 'IGI Airport T3' },
    { time: '5 Mins', label: 'Cyber City / Commercial Hub' },
    { time: '7 Mins', label: 'Golf Course Road' },
    { time: '10 Mins', label: 'Metro Station' },
  ];

  const driveTimes = project.driveTimes && project.driveTimes.length > 0
    ? project.driveTimes
    : defaultDriveTimes;

  const pillarsOfWellBeing = [
    { title: 'Sleep Well', image: '/images/westin/pillar-sleep-well.jpg' },
    { title: 'Eat Well', image: '/images/westin/pillar-eat-well.jpg' },
    { title: 'Move Well', image: '/images/westin/pillar-move-well.jpg' },
    { title: 'Feel Well', image: '/images/westin/pillar-feel-well.jpg' },
    { title: 'Work Well', image: '/images/westin/pillar-work-well.jpg' },
    { title: 'Play Well', image: '/images/westin/pillar-play-well.jpg' },
  ];

  const activeDisplayImage = lightboxCustomImage || (lightboxIndex !== null ? gallery[lightboxIndex] : null);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-brand-dark pt-16 sm:pt-20 pb-4 md:pb-6">
      {/* =========================================================================
          CYLINDRICAL PILL BACK BUTTON
      ========================================================================= */}
      <div className="max-w-site mx-auto px-4 sm:px-8 md:px-12 mb-3">
        <button
          onClick={onBack}
          aria-label="Back to projects"
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white hover:bg-gray-50 text-gray-800 text-xs font-semibold border border-gray-200/90 shadow-xs transition-all active:scale-95 hover:shadow-sm"
        >
          <ChevronLeft className="w-4 h-4 text-gray-700" />
          <span>Back</span>
        </button>
      </div>

      <div className="max-w-site mx-auto px-4 sm:px-8 md:px-12">
        {/* =========================================================================
            HERO SECTION: Architecture Image Clickable to Zoom, Whiteland Logo, Details Below
        ========================================================================= */}
        <div className="rounded-3xl overflow-hidden shadow-sm border border-gray-200 bg-white mb-6 sm:mb-8">
          {/* Main Hero Image: Clickable to Zoom & Pinch (Clean, no floating pinch badge) */}
          <div
            onClick={() => openLightboxWithImage(project.image)}
            className="relative h-[270px] sm:h-[380px] md:h-[460px] lg:h-[520px] w-full overflow-hidden bg-gray-950 cursor-pointer group select-none"
          >
            <img
              src={project.image}
              alt={`${project.name} Architecture`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Subtle luxury gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

            {/* Top Brand Logo: Whiteland Logo clearly visible on white pill */}
            <div className="absolute top-3.5 left-3.5 sm:top-5 sm:left-6 z-10">
              <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-md flex items-center justify-center border border-white/80">
                {project.id === 'whiteland-westin-residences' || project.developerId === 'whiteland' ? (
                  <img
                    src="/images/developers/whiteland.png"
                    alt="Whiteland Corporation"
                    className="h-5 sm:h-6 w-auto object-contain"
                  />
                ) : (
                  <DeveloperLogo id={project.developerId} className="h-5 sm:h-6 max-w-[120px]" />
                )}
              </div>
            </div>

            {/* Top Right: Glassmorphic Super Luxury Tag (Clickable to filter projects) */}
            <div className="absolute top-3.5 right-3.5 sm:top-5 sm:right-6 z-10">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateToFilter('segment', project.segment || 'Super Luxury');
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-black/40 hover:bg-black/60 text-white text-xs sm:text-sm font-semibold backdrop-blur-md border border-white/30 shadow-lg transition-all active:scale-95 cursor-pointer"
                title={`View all ${project.segment || 'Super Luxury'} projects`}
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="tracking-wide">{project.segment || 'Super Luxury'}</span>
              </button>
            </div>
          </div>

          {/* Details Below Hero Image: Name, Location, HRERA, Price */}
          <div className="p-4 sm:p-6 lg:p-7 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-950 mb-1.5">
                  {project.name}
                </h1>

                {/* Location & HRERA Down Below the Image */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 font-medium">
                  <span className="flex items-center gap-1 text-gray-700">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{project.location}, {project.city}</span>
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-500">RERA: {project.reraNumber}</span>
                </div>
              </div>

              {/* Price & Official Brochure Download Button */}
              <div className="flex flex-wrap items-center gap-3 pt-2 md:pt-0">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500">
                    {project.category === 'commercial' || project.category === 'plots' ? 'Investment:' : 'Price:'}
                  </span>
                  <span className="text-lg sm:text-2xl font-bold text-[#253d30] tracking-tight">
                    {project.priceDisplay}
                  </span>
                </div>

                {project.brochureUrl && (
                  <button
                    onClick={handleBrochureDownloadClick}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-brand-purple hover:bg-brand-purpleDark text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-brand-purple/30 hover:shadow-brand-purple/50 transition-all active:scale-95 shrink-0"
                    title={project.requireLeadForBrochure !== false ? 'Enter details to start brochure download' : 'Direct Download'}
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Download Brochure</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Specifications Strip: Status (clickable), Typology (clickable), Towers, Floors, Project Area, Size, Launch, Possession */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 bg-gray-50/70 text-center p-2.5 sm:p-3">
            <div
              onClick={() => navigateToFilter('status', project.status)}
              className="p-2.5 cursor-pointer hover:bg-gray-100/80 transition-colors group/stat rounded-xl"
              title={`View all ${project.status} projects`}
            >
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block mb-0.5">
                Status
              </span>
              <span className="text-xs sm:text-sm font-bold text-emerald-700 group-hover/stat:underline inline-flex items-center gap-1 justify-center">
                {project.status}
              </span>
            </div>
            <div className="p-2.5">
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block mb-0.5">
                Typology
              </span>
              <div className="text-xs sm:text-sm font-bold text-gray-900 flex items-center justify-center flex-wrap gap-1">
                {project.typologies.map((t, idx) => (
                  <span
                    key={t}
                    onClick={() => navigateToFilter('typology', t)}
                    className="hover:text-emerald-700 hover:underline cursor-pointer"
                    title={`Filter by ${t}`}
                  >
                    {t}{idx < project.typologies.length - 1 ? ',' : ''}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-2.5">
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block mb-0.5">
                {project.category === 'plots'
                  ? 'Site Area'
                  : project.category === 'commercial'
                  ? (project.totalTowers?.includes('Catchment') ? 'Catchment' : project.totalTowers?.includes('Colony') || project.totalTowers?.includes('Plotted') || project.totalTowers?.includes('Integrated') ? 'Scale' : 'Towers')
                  : 'Towers'}
              </span>
              <span className="text-xs sm:text-sm font-bold text-gray-900">
                {project.totalTowers || (project.category === 'plots' ? '~124 Acres Gated Community' : project.category === 'commercial' ? 'High Footfall Catchment' : 'Residential Towers')}
              </span>
            </div>
            <div className="p-2.5">
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block mb-0.5">
                {project.category === 'commercial' && (project.totalFloors?.includes('Storey') || project.totalFloors?.includes('Rights') || project.totalFloors?.includes('Levels')) ? 'Levels' : 'Floors'}
              </span>
              <span className="text-xs sm:text-sm font-bold text-gray-900">
                {project.totalFloors || (project.category === 'plots' ? 'Basement + Stilt + 4 Permitted' : 'G + 42')}
              </span>
            </div>
            <div className="p-2.5">
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block mb-0.5">
                Project Area
              </span>
              <span className="text-xs sm:text-sm font-bold text-gray-900">
                {project.projectArea || (project.category === 'plots' ? '~124 Acres' : '14.5 Acres')}
              </span>
            </div>
            <div className="p-2.5">
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block mb-0.5">
                Size
              </span>
              <span className="text-xs sm:text-sm font-bold text-gray-900">
                {project.sizeDisplay}
              </span>
            </div>
            <div className="p-2.5">
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block mb-0.5">
                Launch
              </span>
              <span className="text-xs sm:text-sm font-bold text-gray-900">
                {project.launchYear || '2024'}
              </span>
            </div>
            <div className="p-2.5">
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block mb-0.5">
                Possession
              </span>
              <span className="text-xs sm:text-sm font-bold text-gray-900">
                {project.completionYear || 'Ready to Move'}
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            PROJECT WALKTHROUGH (Above 6 Pillars with reference images for each)
        ========================================================================= */}
        {walkthroughItems && walkthroughItems.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-200 shadow-sm mb-6 sm:mb-8">
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-950 tracking-tight">
                Project Walkthrough
              </h2>
            </div>

            {/* 4-Column Feature Grid with High-Res Reference Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {walkthroughItems.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-[#FAF9F6] border border-gray-200/80 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group"
                >
                  {/* Reference Image clickable to zoom in lightbox */}
                  <div
                    onClick={() => openLightboxWithImage(item.image)}
                    className="relative w-full aspect-[16/10] overflow-hidden bg-gray-200 cursor-pointer"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-white/90 text-gray-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                        <Eye className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>

                  {/* Content Details */}
                  <div className="p-4 sm:p-5 flex-grow flex flex-col">
                    <span className="text-[11px] font-mono font-bold text-brand-purple block mb-1.5">
                      {item.tag}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-gray-950 tracking-tight mb-1.5 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            THE 6 PILLARS OF WELL-BEING (Westin Residences exclusive wellness concept)
        ========================================================================= */}
        {(project.id === 'whiteland-westin-residences' || project.developerId === 'whiteland') && (
          <div className="bg-[#264132] text-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-lg mb-6 sm:mb-8">
            <div className="mb-5">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
                The 6 Pillars of Well-Being
              </h2>
            </div>

            {/* Carousel: Designed Images with Clear Text */}
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-6 pb-2 scrollbar-none">
              {pillarsOfWellBeing.map((pillar, idx) => (
                <div
                  key={idx}
                  onClick={() => openLightboxWithImage(pillar.image)}
                  className="w-[200px] sm:w-[240px] md:w-[270px] shrink-0 snap-start rounded-2xl overflow-hidden bg-black/25 border border-white/15 cursor-pointer group shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="w-full aspect-[181/200] overflow-hidden bg-[#3a6456]/40">
                    <img
                      src={pillar.image}
                      alt={pillar.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            KEY PROJECT & INVESTMENT HIGHLIGHTS (All Important Details from Brochure)
        ========================================================================= */}
        {(project.keyMetrics || project.zoningLevels || project.topCorporates || project.retailAnchors) && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-200 shadow-sm mb-6 sm:mb-8 space-y-7">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-brand-purple block mb-1">
                Strategic Advantage
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-950 tracking-tight">
                Key Project Highlights
              </h2>
            </div>

            {/* 1. Market & Catchment Statistics Grid */}
            {project.keyMetrics && project.keyMetrics.length > 0 && (
              <div>
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Strategic Market & Growth Drivers
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {project.keyMetrics.map((km, idx) => (
                    <div
                      key={idx}
                      className="p-4 sm:p-5 rounded-2xl bg-gray-50/90 border border-gray-200 flex flex-col justify-between"
                    >
                      <span className="text-xl sm:text-2xl lg:text-3xl font-black text-[#253d30] tracking-tight block mb-1">
                        {km.value}
                      </span>
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-gray-900 block mb-0.5">
                          {km.label}
                        </span>
                        {km.sublabel && (
                          <span className="text-[11px] text-gray-500 font-medium leading-snug block">
                            {km.sublabel}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Architectural Zoning & Floor Distribution */}
            {project.zoningLevels && project.zoningLevels.length > 0 && (
              <div>
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Architectural Zoning & Floor Distribution
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {project.zoningLevels.map((z, idx) => (
                    <div
                      key={idx}
                      className="p-4 sm:p-5 rounded-2xl bg-[#FAF9F6] border border-gray-200/90 flex flex-col justify-between"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#253d30] text-white text-[10px] font-bold uppercase tracking-wider shrink-0">
                          {z.level}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-gray-950">
                          {z.title}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed font-normal">
                        {z.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Top Corporates / Signed Brands with Real Logos */}
            {project.topCorporates && project.topCorporates.length > 0 && (
              <div>
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500 mb-3 sm:mb-4">
                  {project.id === 'm3m-atrium-57'
                    ? 'Signed Brands & Retail Anchors'
                    : project.id === 'reach-buzz-114'
                    ? 'Key Economic & Corporate Anchors'
                    : 'Top Corporates in Vicinity'}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3">
                  {project.topCorporates.map((corp, idx) => {
                    const logo = getCorporateLogo(corp);
                    return (
                      <div
                        key={idx}
                        className="group relative flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs hover:shadow-md hover:border-gray-300 transition-all duration-300 text-center"
                      >
                        <div className="h-10 sm:h-12 w-full flex items-center justify-center mb-1.5 px-2">
                          {logo ? (
                            <img
                              src={logo}
                              alt={corp}
                              className="max-h-7 sm:max-h-8 w-auto max-w-[85%] object-contain filter group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          ) : (
                            <span className="text-xs font-bold text-gray-800">{corp}</span>
                          )}
                        </div>
                        <span className="text-[10px] sm:text-[11px] font-semibold text-gray-700 line-clamp-1 group-hover:text-gray-950 transition-colors">
                          {corp}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. Signed Brands / Immediate Catchments */}
            {project.retailAnchors && project.retailAnchors.length > 0 && (
              <div>
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500 mb-2.5">
                  {project.category === 'commercial' ? 'Signed Anchors & Immediate Catchments' : 'Vicinity Catchment'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.retailAnchors.map((anchor, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 text-xs font-semibold border border-emerald-200"
                    >
                      {anchor}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            IMAGE GALLERY: Clean Heading & Responsive Large Images on PC
        ========================================================================= */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 md:p-8 border border-gray-200/90 shadow-sm mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-950 tracking-tight">
              Image Gallery
            </h2>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium mr-1">
                {activeGalleryIndex + 1} / {gallery.length}
              </span>
              <button
                onClick={() => scrollGallery('left')}
                aria-label="Previous image"
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-all active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollGallery('right')}
                aria-label="Next image"
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-all active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Responsive Gallery Carousel: Larger on PC (md:w-[460px] lg:w-[560px]) */}
          <div
            ref={galleryScrollRef}
            onScroll={handleGalleryScroll}
            className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 sm:gap-5 pb-3 scrollbar-none"
          >
            {gallery.map((imgUrl, idx) => (
              <div
                key={idx}
                onClick={() => openLightbox(idx)}
                className="w-[240px] sm:w-[320px] md:w-[460px] lg:w-[560px] shrink-0 snap-start rounded-2xl overflow-hidden aspect-[16/10] bg-gray-100 border border-gray-200 cursor-pointer group relative shadow-xs hover:shadow-lg transition-all"
              >
                <img
                  src={imgUrl}
                  alt={`${project.name} Render ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/90 text-gray-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            FLOOR PLANS: Clean Heading (No Subtitle), Fixed Left Trim on PC
        ========================================================================= */}
        <div id="floor-plans" className="bg-white rounded-3xl p-5 sm:p-7 md:p-8 border border-gray-200/90 shadow-sm mb-6 sm:mb-8">
          <div className="mb-5">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-950 tracking-tight">
              Floor Plans
            </h2>
          </div>

          {/* Floor Plans Container (No left trim, smooth scroll, larger cards on PC) */}
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-6 pb-4 scrollbar-none px-1">
            {floorPlans.map((plan) => (
              <div
                key={plan.id}
                className="w-[250px] sm:w-[290px] md:w-[350px] lg:w-[380px] shrink-0 snap-start rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden flex flex-col justify-between"
              >
                {/* Image Container: Larger on PC (md:h-52 lg:h-60) */}
                <div className="relative h-36 sm:h-44 md:h-56 bg-gray-50 flex items-center justify-center overflow-hidden p-3">
                  <img
                    src={plan.image || project.image}
                    alt={plan.name}
                    className={`w-full h-full object-contain transition-all duration-700 ${
                      isFloorPlanUnlocked ? 'filter-none' : 'filter blur-md scale-105 opacity-60 pointer-events-none'
                    }`}
                  />

                  {/* Centered View Plan Button */}
                  {!isFloorPlanUnlocked ? (
                    <button
                      onClick={() => handleOpenPlanModal(plan)}
                      className="absolute px-5 py-2 sm:px-6 sm:py-2.5 rounded-lg bg-[#253d30] hover:bg-[#1b2d23] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-md transition-all active:scale-95 z-10"
                    >
                      View Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => openLightboxWithImage(plan.image || project.image)}
                      className="absolute px-4 py-2 rounded-lg bg-[#253d30]/90 hover:bg-[#1b2d23] text-white text-xs font-semibold tracking-wide shadow-md transition-all flex items-center gap-1.5 active:scale-95 z-10"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Fullscreen</span>
                    </button>
                  )}
                </div>

                {/* Solid Dark Green Typology Bar */}
                <div className="bg-[#253d30] text-white py-2.5 sm:py-3 px-3 sm:px-4 text-center">
                  <span className="text-xs sm:text-base font-bold tracking-wider block">
                    {plan.typology}
                  </span>
                  {plan.superArea && (
                    <span className="text-[10px] sm:text-xs text-gray-300 font-normal block mt-0.5">
                      {plan.superArea}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            PROJECT LAYOUT / MASTER PLAN: Clean Heading
        ========================================================================= */}
        <div id="project-layout" className="bg-white rounded-3xl p-5 sm:p-7 md:p-8 border border-gray-200/90 shadow-sm mb-6 sm:mb-8">
          <div className="mb-5">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-950 tracking-tight">
              Project Layout
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden max-w-2xl mx-auto">
            <div className="relative h-48 sm:h-64 md:h-80 bg-gray-50 flex items-center justify-center overflow-hidden p-2">
              <img
                src={project.sitePlanImage || project.image}
                alt={`${project.name} Master Plan`}
                className={`w-full h-full object-contain transition-all duration-700 ${
                  isFloorPlanUnlocked ? 'filter-none' : 'filter blur-md scale-105 opacity-60 pointer-events-none'
                }`}
              />

              {!isFloorPlanUnlocked ? (
                <button
                  onClick={handleOpenLayoutModal}
                  className="absolute px-6 py-2.5 rounded-lg bg-[#253d30] hover:bg-[#1b2d23] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-md transition-all active:scale-95 z-10"
                >
                  View Layout
                </button>
              ) : (
                <button
                  onClick={() => openLightboxWithImage(project.sitePlanImage || project.image)}
                  className="absolute px-4 py-2 rounded-lg bg-[#253d30]/90 hover:bg-[#1b2d23] text-white text-xs font-semibold tracking-wide shadow-md transition-all flex items-center gap-1.5 active:scale-95 z-10"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Fullscreen</span>
                </button>
              )}
            </div>

            <div className="bg-[#253d30] text-white py-2.5 px-4 text-center text-xs sm:text-sm font-bold tracking-wider">
              Project Layout
            </div>
          </div>
        </div>

        {/* =========================================================================
            LOCATION & CONNECTIVITY: Clean Heading & Clean Map (No Bottom Text Bar)
        ========================================================================= */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 md:p-8 border border-gray-200/90 shadow-sm mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-5">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-950 tracking-tight">
              Location & Connectivity
            </h2>
          </div>

          {/* High-Resolution Location Map (Clickable to Zoom, clean without helper text bar) */}
          <div
            onClick={() => openLightboxWithImage(project.locationMapImage || '/images/westin/location-map.jpg')}
            className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 mb-5 cursor-pointer group shadow-2xs hover:shadow-md transition-all"
          >
            <img
              src={project.locationMapImage || '/images/westin/location-map.jpg'}
              alt={`${project.name} Strategic Location & Connectivity Map`}
              className="w-full h-auto max-h-[460px] md:max-h-[560px] object-contain transition-transform duration-500 group-hover:scale-[1.01]"
            />
          </div>

          {/* Drive Time Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {driveTimes.map((dt, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
                <span className="text-base sm:text-lg font-black text-gray-950 block">{dt.time}</span>
                <span className="text-[10px] sm:text-[11px] text-gray-600 font-bold uppercase tracking-wider">{dt.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            PAYMENT PLAN: Clean, Minimal Table
        ========================================================================= */}
        {project.paymentPlan && project.paymentPlan.length > 0 && (
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-gray-200/90 shadow-xs mb-6 sm:mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-brand-purple" />
              <h2 className="text-lg sm:text-xl font-bold text-gray-950 tracking-tight">
                Payment Plan (Development Linked)
              </h2>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-gray-100 text-gray-800 font-bold border-b border-gray-200">
                    <th className="py-2.5 px-4">Milestone</th>
                    <th className="py-2.5 px-4 text-right">Payment (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {project.paymentPlan.map((planItem, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="py-2.5 px-4 font-semibold text-gray-900">{planItem.milestone}</td>
                      <td className="py-2.5 px-4 text-right font-extrabold text-brand-purple">{planItem.percentage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            PRIVATE VIP SITE VISIT & CONSULTATION BANNER (Clean, No Body Text, Reduced Bottom Spacing)
        ========================================================================= */}
        <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 text-white rounded-3xl p-5 sm:p-7 shadow-lg mb-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">
            Experience {project.name}
          </h3>
          <button
            onClick={handleOpenSiteVisitModal}
            className="px-6 py-3 rounded-full bg-white text-gray-950 hover:bg-gray-100 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md transition-all active:scale-95 shrink-0"
          >
            Schedule Site Visit
          </button>
        </div>
      </div>

      {/* =========================================================================
          LIGHTBOX: Swipable & Pinch-to-Zoom (Cross Button Just Above Image, Lighter Centered Arrows)
      ========================================================================= */}
      <AnimatePresence>
        {activeDisplayImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6"
            onClick={closeLightbox}
          >
            {/* Image Container with Cross Button positioned JUST above the image */}
            <div
              className="relative inline-flex flex-col items-end max-w-full max-h-[92vh] z-20"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Cross button directly above the image, right-aligned with the image */}
              <div className="w-full flex items-center justify-between pb-2 pr-0.5">
                {!lightboxCustomImage && lightboxIndex !== null ? (
                  <span className="text-white/70 text-xs font-semibold tracking-wider pl-1">
                    {lightboxIndex + 1} / {gallery.length}
                  </span>
                ) : (
                  <div />
                )}

                <button
                  onClick={closeLightbox}
                  aria-label="Close"
                  className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all active:scale-90 shadow-md backdrop-blur-xs border border-white/20"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Swipable & Pinch-Zoomable Image without permanent arrow buttons */}
              <div className="relative flex items-center justify-center w-full">
                <motion.img
                  key={activeDisplayImage}
                  initial={{ opacity: 0.8, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  src={activeDisplayImage}
                  alt="Fullscreen view"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (lightboxCustomImage) return;
                    setShowSwipeHint(false);
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    if (clickX < rect.width * 0.35) {
                      prevLightboxImage();
                    } else if (clickX > rect.width * 0.65) {
                      nextLightboxImage();
                    }
                  }}
                  style={{
                    touchAction: 'pan-x pan-y pinch-zoom',
                  }}
                  className="max-w-full max-h-[78vh] sm:max-h-[82vh] object-contain rounded-xl shadow-2xl select-none"
                  draggable={false}
                />

                {/* Subtle Animated First-Time Swipe Hint (Only appears first time, smoothly disappears) */}
                {!lightboxCustomImage && gallery.length > 1 && showSwipeHint && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
                  >
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white/95 text-xs font-semibold tracking-wider uppercase border border-white/20 shadow-xl">
                      <motion.span
                        animate={{ x: [-4, 4, -4] }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                        className="inline-flex items-center gap-1.5"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Swipe</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </motion.span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          LEAD CAPTURE MODAL: Asks Name, Phone, Email (No Icon, No Body Text, Submit Button Only)
      ========================================================================= */}
      <AnimatePresence>
        {isLeadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLeadModalOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-200 z-10"
            >
              <button
                onClick={() => setIsLeadModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Clean Heading ONLY (No icon above heading, No body text below heading) */}
              <div className="text-center mb-6 pt-2">
                <h3 className="text-xl font-bold text-gray-950">
                  {modalMode === 'brochure'
                    ? 'Download Official Brochure'
                    : modalMode === 'site-visit'
                    ? 'Schedule Site Visit'
                    : modalMode === 'layout'
                    ? 'View Project Layout'
                    : 'View Floor Plan'}
                </h3>
              </div>

              {isSubmitted ? (
                <div className="py-6 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h4 className="text-base font-bold text-gray-900">
                    {modalMode === 'brochure'
                      ? 'Brochure Download Started!'
                      : modalMode === 'site-visit'
                      ? 'Site Visit Requested!'
                      : 'Floor Plans Unlocked!'}
                  </h4>
                  <p className="text-xs text-gray-600 font-medium">
                    {modalMode === 'brochure'
                      ? 'Your official PDF brochure is downloading now. Our senior advisory desk is at your service.'
                      : modalMode === 'site-visit'
                      ? 'Thank you! Our senior luxury advisor will contact you within 15 minutes to confirm your visit.'
                      : 'All architectural plans are unlocked, and your official PDF brochure is downloading now!'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  {formError && (
                    <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 font-medium">
                      {formError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#253d30] focus:ring-1 focus:ring-[#253d30]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Mobile Number (WhatsApp Preferred) *
                    </label>
                    <div className="flex gap-2">
                      <span className="px-3 py-2.5 rounded-xl bg-gray-100 border border-gray-300 text-xs sm:text-sm font-bold text-gray-700 select-none">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="98765 43210"
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#253d30] focus:ring-1 focus:ring-[#253d30]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#253d30] focus:ring-1 focus:ring-[#253d30]"
                    />
                  </div>

                  {/* Button is strictly "Submit" */}
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-[#253d30] hover:bg-[#1b2d23] text-white text-xs uppercase tracking-wider font-bold shadow-lg transition-all active:scale-95 mt-3"
                  >
                    Submit
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
