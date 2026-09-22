import { PROJECTS as INITIAL_PROJECTS, type Project } from '../data/projects';
import { BLOG_POSTS as INITIAL_POSTS, type BlogPost } from '../data/blogPosts';

export interface CMSProject extends Project {
  requireLeadForBrochure?: boolean;
}

export interface PageContent {
  home: {
    heroTag: string;
    heroTitle: string;
    heroSubtitle: string;
    advisoryHeading: string;
    categoriesTitle: string;
    categoriesSubtitle: string;
  };
  about: {
    heroTitle: string;
    heroSubtitle: string;
    missionTitle: string;
    missionText: string;
    visionTitle: string;
    visionText: string;
  };
  contact: {
    phone: string;
    email: string;
    address: string;
    whatsappNumber: string;
  };
}

export interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'pdf';
  url: string; // Base64 data URL or relative web path
  size?: string;
  uploadedAt: string;
}

export interface LeadSubmission {
  id: string;
  name: string;
  phone: string;
  email: string;
  projectName?: string;
  brochureName?: string;
  type: 'brochure-download' | 'consultation' | 'general';
  timestamp: string;
}

const STORAGE_KEYS = {
  PROJECTS: 'aurex_cms_projects_v4',
  POSTS: 'aurex_cms_posts_v2',
  PAGE_CONTENT: 'aurex_cms_pages_v2',
  MEDIA: 'aurex_cms_media_v2',
  LEADS: 'aurex_cms_leads_v2',
};

export const DEFAULT_PAGE_CONTENT: PageContent = {
  home: {
    heroTag: 'STRATEGIC REAL ESTATE ADVISORY',
    heroTitle: 'Not Your Average Broker. Your Growth Partner.',
    heroSubtitle: 'Institutional discipline, corridor intelligence, and bespoke acquisition advisory for high-net-worth investors across Delhi NCR.',
    advisoryHeading: 'Our Advisory Process',
    categoriesTitle: 'Strategic Real Estate Asset Portfolios.',
    categoriesSubtitle: 'Tailored advisory across Delhi NCR’s core property asset classes. Click any asset below to submit your requirements directly to our senior advisory desk.',
  },
  about: {
    heroTitle: 'Fiduciary Clarity in a Fragmented Market.',
    heroSubtitle: 'Born from a conviction that capital allocators deserve uncompromising transparency, rigorous asset vetting, and multi-decade wealth preservation.',
    missionTitle: 'Purpose in Every Decision',
    missionText: 'To dismantle the high-pressure sales culture of traditional real estate brokerage. We exist to provide institutional-grade deal analysis, genuine fiduciary alignment, and stress-tested property portfolios.',
    visionTitle: 'A New Standard of Advisory',
    visionText: 'To be the most trusted real estate investment advisory in Northern India, distinguished by research integrity, discreet private wealth advisory, and client capital protection.',
  },
  contact: {
    phone: '+91 87967 91087',
    email: 'info@aurexestates.co.in',
    address: '1610, 16th Floor, Tower 4, DLF Corporate Greens, Sector 74A, Gurugram, Haryana - 122004',
    whatsappNumber: '+918796791087',
  },
};

type Listener = () => void;
const listeners = new Set<Listener>();

const notifyListeners = () => {
  listeners.forEach((fn) => fn());
};

export const cmsStore = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  // ==================== PROJECTS ====================
  getProjects(): CMSProject[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading projects from CMS storage', e);
    }
    // Default seed
    return INITIAL_PROJECTS.map((p) => ({
      ...p,
      requireLeadForBrochure: p.requireLeadForBrochure !== undefined ? p.requireLeadForBrochure : true,
    }));
  },

  saveProject(project: CMSProject): void {
    const projects = this.getProjects();
    const idx = projects.findIndex((p) => p.id === project.id);
    let updated: CMSProject[];
    if (idx >= 0) {
      updated = [...projects];
      updated[idx] = { ...project };
    } else {
      updated = [project, ...projects];
    }
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
    notifyListeners();
  },

  deleteProject(projectId: string): void {
    const projects = this.getProjects().filter((p) => p.id !== projectId);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    notifyListeners();
  },

  getProjectById(projectId: string): CMSProject | undefined {
    return this.getProjects().find((p) => p.id === projectId);
  },

  // ==================== BLOG POSTS ====================
  getBlogPosts(): BlogPost[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.POSTS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading posts from CMS storage', e);
    }
    return INITIAL_POSTS;
  },

  saveBlogPost(post: BlogPost): void {
    const posts = this.getBlogPosts();
    const idx = posts.findIndex((p) => p.id === post.id);
    let updated: BlogPost[];
    if (idx >= 0) {
      updated = [...posts];
      updated[idx] = { ...post };
    } else {
      updated = [post, ...posts];
    }
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updated));
    notifyListeners();
  },

  deleteBlogPost(postId: string): void {
    const posts = this.getBlogPosts().filter((p) => p.id !== postId);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    notifyListeners();
  },

  // ==================== PAGE CONTENT ====================
  getPageContent(): PageContent {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PAGE_CONTENT);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading page content from CMS storage', e);
    }
    return DEFAULT_PAGE_CONTENT;
  },

  savePageContent(content: PageContent): void {
    localStorage.setItem(STORAGE_KEYS.PAGE_CONTENT, JSON.stringify(content));
    notifyListeners();
  },

  // ==================== MEDIA LIBRARY ====================
  getMediaLibrary(): MediaItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MEDIA);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading media library from CMS storage', e);
    }
    return [
      {
        id: 'media-aurrum-pdf',
        name: '4S The Aurrum Official Brochure.pdf',
        type: 'pdf',
        url: '/brochures/4s-the-aurrum-brochure.pdf',
        size: '8.6 MB',
        uploadedAt: '2026-09-22',
      },
      {
        id: 'media-cocoa-pdf',
        name: 'Cocoa County Official Brochure.pdf',
        type: 'pdf',
        url: '/brochures/cocoa-county-brochure.pdf',
        size: '4.3 MB',
        uploadedAt: '2026-09-22',
      },
      {
        id: 'media-alameda-pdf',
        name: 'DLF Alameda Official Brochure.pdf',
        type: 'pdf',
        url: '/brochures/dlf-alameda-brochure.pdf',
        size: '2.0 MB',
        uploadedAt: '2026-09-22',
      },
      {
        id: 'media-gardencity-pdf',
        name: 'DLF Gardencity Official Brochure.pdf',
        type: 'pdf',
        url: '/brochures/dlf-gardencity-brochure.pdf',
        size: '2.6 MB',
        uploadedAt: '2026-09-22',
      },
      {
        id: 'media-meridien-pdf',
        name: 'Godrej Meridien Official Brochure.pdf',
        type: 'pdf',
        url: '/brochures/godrej-meridien-brochure.pdf',
        size: '4.4 MB',
        uploadedAt: '2026-09-22',
      },
      {
        id: 'media-atrium57-pdf',
        name: 'M3M Atrium 57 Official Brochure.pdf',
        type: 'pdf',
        url: '/brochures/m3m-atrium-57-brochure.pdf',
        size: '6.8 MB',
        uploadedAt: '2026-09-22',
      },
      {
        id: 'media-jewel-pdf',
        name: 'M3M Jewel Official Brochure.pdf',
        type: 'pdf',
        url: '/brochures/m3m-jewel-brochure.pdf',
        size: '6.1 MB',
        uploadedAt: '2026-09-22',
      },
      {
        id: 'media-monarch-pdf',
        name: "Suncity's Monarch Official Brochure.pdf",
        type: 'pdf',
        url: '/brochures/suncity-monarch-brochure.pdf',
        size: '6.6 MB',
        uploadedAt: '2026-09-22',
      },
      {
        id: 'media-westin-pdf',
        name: 'The Westin Residences Official Brochure.pdf',
        type: 'pdf',
        url: '/brochures/westin-residences-gurugram-brochure.pdf',
        size: '11.9 MB',
        uploadedAt: '2026-09-22',
      },
    ];
  },

  addMediaItem(item: Omit<MediaItem, 'id' | 'uploadedAt'>): MediaItem {
    const library = this.getMediaLibrary();
    const newItem: MediaItem = {
      ...item,
      id: `media-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      uploadedAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newItem, ...library];
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(updated));
    notifyListeners();
    return newItem;
  },

  deleteMediaItem(id: string): void {
    const library = this.getMediaLibrary().filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(library));
    notifyListeners();
  },

  // ==================== LEADS & DOWNLOADS LOG ====================
  getLeads(): LeadSubmission[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LEADS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading leads from CMS storage', e);
    }
    return [];
  },

  addLead(lead: Omit<LeadSubmission, 'id' | 'timestamp'>): LeadSubmission {
    const leads = this.getLeads();
    const newLead: LeadSubmission = {
      ...lead,
      id: `lead-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    };
    const updated = [newLead, ...leads];
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(updated));
    notifyListeners();
    return newLead;
  },

  deleteLead(id: string): void {
    const leads = this.getLeads().filter((l) => l.id !== id);
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
    notifyListeners();
  },

  // ==================== BACKUP & RESTORE ====================
  exportDatabaseJSON(): string {
    const exportPayload = {
      version: 2,
      exportDate: new Date().toISOString(),
      projects: this.getProjects(),
      posts: this.getBlogPosts(),
      pageContent: this.getPageContent(),
      media: this.getMediaLibrary(),
      leads: this.getLeads(),
    };
    return JSON.stringify(exportPayload, null, 2);
  },

  importDatabaseJSON(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.projects && Array.isArray(parsed.projects)) {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(parsed.projects));
      }
      if (parsed.posts && Array.isArray(parsed.posts)) {
        localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(parsed.posts));
      }
      if (parsed.pageContent) {
        localStorage.setItem(STORAGE_KEYS.PAGE_CONTENT, JSON.stringify(parsed.pageContent));
      }
      if (parsed.media && Array.isArray(parsed.media)) {
        localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(parsed.media));
      }
      if (parsed.leads && Array.isArray(parsed.leads)) {
        localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(parsed.leads));
      }
      notifyListeners();
      return true;
    } catch (e) {
      console.error('Failed to import database JSON', e);
      return false;
    }
  },

  resetToDefaults(): void {
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.POSTS);
    localStorage.removeItem(STORAGE_KEYS.PAGE_CONTENT);
    localStorage.removeItem(STORAGE_KEYS.MEDIA);
    notifyListeners();
  },
};
