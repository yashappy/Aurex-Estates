import React, { useState, useEffect, useRef } from 'react';
import {
  Building2,
  FileText,
  Edit3,
  Image as ImageIcon,
  Users,
  Download,
  Upload,
  Plus,
  Trash2,
  Check,
  Search,
  ArrowLeft,
  FileDown,
  Lock,
  Copy,
  Eye,
  EyeOff,
  LogOut,
  Globe,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Link2,
  RefreshCw,
  FileCheck,
} from 'lucide-react';
import {
  cmsStore,
  type CMSProject,
  type CMSBlogPost,
  type PageContent,
  type MediaItem,
  type LeadSubmission,
} from '../services/cmsStore';
import { generateLSIKeywords, analyzeSEO, type LSIKeywordResult } from '../utils/seoHelper';
import { FORMS_CONFIG } from '../config/forms';
import { WebpageContainerEditor } from '../components/WebpageContainerEditor';
import type { Page } from '../App';

interface AdminCMSProps {
  onNavigate: (page: Page) => void;
  onSelectProject?: (projectId: string) => void;
}

type CMSTab = 'projects' | 'posts' | 'pages' | 'media' | 'leads' | 'seo';
type PageKey = 'home' | 'about' | 'residential' | 'commercial' | 'plots' | 'career' | 'contact' | 'header' | 'footer';
type ViewMode = 'list' | 'edit-project' | 'edit-post' | 'preview-project' | 'preview-post' | 'edit-page';

// Location formatter: displays only sector and city name (e.g. Sector 106, Gurugram)
const formatLocationShort = (location: string, city: string = 'Gurugram') => {
  if (!location) return city;
  const sectorMatch = location.match(/Sector[s]?\s*[\d\w\s&,]+/i);
  if (sectorMatch) {
    const sectorPart = sectorMatch[0].split(',')[0].trim();
    return `${sectorPart}, ${city}`;
  }
  const firstPart = location.split(',')[0].trim();
  if (firstPart.toLowerCase().includes(city.toLowerCase())) {
    return firstPart;
  }
  return `${firstPart}, ${city}`;
};

export const AdminCMS: React.FC<AdminCMSProps> = ({ onNavigate, onSelectProject }) => {
  // Navigation & View Modes
  const [activeTab, setActiveTab] = useState<CMSTab>('projects');
  const [selectedPageKey, setSelectedPageKey] = useState<PageKey>('home');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // Core CMS Data
  const [projects, setProjects] = useState<CMSProject[]>([]);
  const [posts, setPosts] = useState<CMSBlogPost[]>([]);
  const [pageContent, setPageContent] = useState<PageContent>(cmsStore.getPageContent());
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>([]);
  const [leads, setLeads] = useState<LeadSubmission[]>([]);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('aurex_cms_auth') === 'true';
  });
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Filters & Search
  const [projectSearch, setProjectSearch] = useState('');
  const [projectCatFilter, setProjectCatFilter] = useState<'all' | 'residential' | 'commercial' | 'plots'>('all');
  const [projectStatusFilter, setProjectStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  const [postSearch, setPostSearch] = useState('');
  const [postStatusFilter, setPostStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  const [leadSearch, setLeadSearch] = useState('');
  const [leadTypeFilter, setLeadTypeFilter] = useState<string>('all');

  // Active item being edited (Full Page Editor)
  const [editingProject, setEditingProject] = useState<CMSProject | null>(null);
  const [editingPost, setEditingPost] = useState<CMSBlogPost | null>(null);

  // Project Editor Sub-section Tab
  const [projectEditorSection, setProjectEditorSection] = useState<
    'basic' | 'pricing' | 'media' | 'brochure' | 'content' | 'floorplans' | 'seo'
  >('basic');

  // Internal Link Generator State
  const [linkAnchorText, setLinkAnchorText] = useState('');
  const [linkTargetUrl, setLinkTargetUrl] = useState('/residential');

  // Gallery Add Image Input
  const [newGalleryImageUrl, setNewGalleryImageUrl] = useState('');

  // SEO Global Desk State
  const [globalSeedKeyword, setGlobalSeedKeyword] = useState('luxury apartments dwarka expressway gurugram');
  const [globalLsiCategory, setGlobalLsiCategory] = useState<'residential' | 'commercial' | 'plots'>('residential');

  // Hidden File Inputs
  const galleryImageUploadRef = useRef<HTMLInputElement>(null);
  const brochureUploadRef = useRef<HTMLInputElement>(null);
  const blogImageUploadRef = useRef<HTMLInputElement>(null);
  const mediaLibraryUploadRef = useRef<HTMLInputElement>(null);
  const jsonImportRef = useRef<HTMLInputElement>(null);

  // File to Base64 utility
  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync state with cmsStore
  const refreshData = () => {
    setProjects(cmsStore.getProjects());
    setPosts(cmsStore.getBlogPosts());
    setPageContent(cmsStore.getPageContent());
    setMediaLibrary(cmsStore.getMediaLibrary());
    setLeads(cmsStore.getLeads());
  };

  useEffect(() => {
    refreshData();
    const unsubscribe = cmsStore.subscribe(refreshData);
    return () => {
      unsubscribe();
    };
  }, []);

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim() === 'admin' && passwordInput === 'Aurex@2026') {
      sessionStorage.setItem('aurex_cms_auth', 'true');
      setIsAuthenticated(true);
      setAuthError(null);
      showToast('Welcome, Administrator');
    } else {
      setAuthError('Invalid credentials. Please verify your username and password.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('aurex_cms_auth');
    setIsAuthenticated(false);
    setUsernameInput('');
    setPasswordInput('');
    setViewMode('list');
    showToast('Signed out successfully.');
  };

  // ==================== PROJECT ACTIONS ====================
  const handleOpenNewProject = () => {
    const newProj: CMSProject = {
      id: `project-${Date.now()}`,
      name: '',
      category: 'residential',
      segment: 'Luxury',
      developer: 'DLF',
      developerId: 'dlf',
      city: 'Gurugram',
      location: 'Sector 0, Gurugram',
      typologies: ['3 BHK', '4 BHK'],
      priceMin: 250,
      priceMax: 600,
      priceDisplay: '₹2.50 Cr - ₹6.00 Cr',
      sizeMin: 2000,
      sizeMax: 3500,
      sizeDisplay: '2,000 - 3,500 sq ft',
      status: 'Under Construction',
      statusMode: 'draft',
      image: '/images/meridien/club-facade.png',
      galleryImages: ['/images/meridien/club-facade.png'],
      brochureName: '',
      brochureUrl: '',
      requireLeadForBrochure: true,
      highlights: ['Prime corridor connectivity', 'Integrated luxury clubhouse'],
      description: 'Exclusive luxury real estate development in prime Gurugram corridor.',
      projectArea: '14.5 Acres',
      launchYear: '2024',
      completionYear: '2028',
      totalFloors: 'G + 30 Floors',
      reraNumber: 'HARERA Registered',
      featured: false,
      focusKeyword: '',
      metaTitle: '',
      metaDescription: '',
    };
    setEditingProject(newProj);
    setProjectEditorSection('basic');
    setViewMode('edit-project');
  };

  const handleEditProject = (proj: CMSProject) => {
    setEditingProject({
      ...proj,
      statusMode: proj.statusMode || 'published',
      galleryImages: proj.galleryImages || ((proj as any).images ? [...(proj as any).images] : [proj.image]),
      focusKeyword: proj.focusKeyword || `${proj.name} Gurugram`,
      metaTitle: proj.metaTitle || `${proj.name} | Luxury Property in ${proj.location}`,
      metaDescription: proj.metaDescription || proj.description?.slice(0, 155),
    });
    setProjectEditorSection('basic');
    setViewMode('edit-project');
  };

  const handleSaveProject = (status?: 'published' | 'draft') => {
    if (!editingProject || !editingProject.name.trim()) {
      showToast('Project name is required.');
      return;
    }
    const updated: CMSProject = {
      ...editingProject,
      statusMode: status || editingProject.statusMode || 'published',
    };
    cmsStore.saveProject(updated);
    setEditingProject(updated);
    showToast(
      `Project "${updated.name}" saved as ${updated.statusMode === 'published' ? '🟢 Published' : '🟡 Draft'}!`
    );
  };

  const handleDeleteProject = (proj: CMSProject) => {
    if (window.confirm(`Are you sure you want to delete "${proj.name}"? This action cannot be undone.`)) {
      cmsStore.deleteProject(proj.id);
      showToast(`Project "${proj.name}" deleted.`);
    }
  };

  // Upload Additional Gallery Image
  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingProject) {
      try {
        const dataUrl = await readFileAsDataUrl(file);
        const currentGallery = editingProject.galleryImages || [editingProject.image];
        setEditingProject({
          ...editingProject,
          galleryImages: [...currentGallery, dataUrl],
        });
        cmsStore.addMediaItem({
          name: file.name,
          type: 'image',
          url: dataUrl,
          size: `${Math.round(file.size / 1024)} KB`,
        });
        showToast('Image added to gallery!');
      } catch {
        showToast('Failed to upload gallery image.');
      }
    }
  };

  // Add Gallery Image from URL
  const handleAddGalleryImageUrl = () => {
    if (!newGalleryImageUrl.trim() || !editingProject) return;
    const currentGallery = editingProject.galleryImages || [editingProject.image];
    setEditingProject({
      ...editingProject,
      galleryImages: [...currentGallery, newGalleryImageUrl.trim()],
    });
    setNewGalleryImageUrl('');
    showToast('Image URL added to gallery!');
  };

  // Delete Gallery Image
  const handleDeleteGalleryImage = (index: number) => {
    if (!editingProject) return;
    const currentGallery = editingProject.galleryImages || [editingProject.image];
    if (currentGallery.length <= 1) {
      showToast('Project must have at least one image.');
      return;
    }
    const updated = currentGallery.filter((_, i) => i !== index);
    setEditingProject({
      ...editingProject,
      galleryImages: updated,
      image: index === 0 ? updated[0] : editingProject.image,
    });
    showToast('Gallery image removed.');
  };

  // Set Gallery Image as Hero
  const handleSetGalleryImageAsHero = (index: number) => {
    if (!editingProject) return;
    const currentGallery = editingProject.galleryImages || [editingProject.image];
    const selectedImg = currentGallery[index];
    const newGallery = [selectedImg, ...currentGallery.filter((_, i) => i !== index)];
    setEditingProject({
      ...editingProject,
      image: selectedImg,
      galleryImages: newGallery,
    });
    showToast('Image set as primary Hero image!');
  };

  // Upload Project PDF Brochure
  const handleProjectBrochureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingProject) {
      try {
        const dataUrl = await readFileAsDataUrl(file);
        setEditingProject({
          ...editingProject,
          brochureName: file.name,
          brochureUrl: dataUrl,
        });
        cmsStore.addMediaItem({
          name: file.name,
          type: 'pdf',
          url: dataUrl,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        });
        showToast(`Official brochure attached: ${file.name}`);
      } catch {
        showToast('Failed to upload PDF brochure.');
      }
    }
  };

  // Remove Attached Brochure
  const handleRemoveBrochure = () => {
    if (!editingProject) return;
    if (window.confirm('Are you sure you want to remove the attached PDF brochure?')) {
      setEditingProject({
        ...editingProject,
        brochureName: '',
        brochureUrl: '',
      });
      showToast('Brochure removed. You can now upload a new PDF brochure.');
    }
  };

  // Insert Internal Link into Description
  const handleInsertInternalLink = (anchor: string, url: string) => {
    if (!editingProject) return;
    const linkMarkdown = `[${anchor}](${url})`;
    setEditingProject({
      ...editingProject,
      description: editingProject.description ? `${editingProject.description} ${linkMarkdown}` : linkMarkdown,
    });
    showToast(`Inserted link: ${linkMarkdown}`);
  };

  // ==================== BLOG POST ACTIONS ====================
  const handleOpenNewPost = () => {
    const newPost: CMSBlogPost = {
      id: `post-${Date.now()}`,
      slug: `market-insight-${Date.now()}`,
      title: '',
      category: 'Market Intelligence',
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      readTime: '5 min read',
      author: {
        name: 'Aurex Advisory Desk',
        role: 'Senior Property Analyst',
      },
      image: '/images/camellias.jpg',
      excerpt: '',
      keyTakeaways: ['Institutional corridor capital velocity', 'Long-term risk-adjusted returns'],
      content: ['In-depth strategic advisory report for high-net-worth real estate investors.'],
      tags: ['Gurugram Real Estate', 'Investment Advisory'],
      statusMode: 'draft',
      focusKeyword: '',
      metaTitle: '',
      metaDescription: '',
    };
    setEditingPost(newPost);
    setViewMode('edit-post');
  };

  const handleEditPost = (post: CMSBlogPost) => {
    setEditingPost({
      ...post,
      statusMode: post.statusMode || 'published',
      focusKeyword: post.focusKeyword || post.title.split(':')[0] || post.title,
      metaTitle: post.metaTitle || `${post.title} | Aurex Estates Blogs`,
      metaDescription: post.metaDescription || post.excerpt?.slice(0, 155),
    });
    setViewMode('edit-post');
  };

  const handleSavePost = (status?: 'published' | 'draft') => {
    if (!editingPost || !editingPost.title.trim()) {
      showToast('Blog title is required.');
      return;
    }
    const updated: CMSBlogPost = {
      ...editingPost,
      statusMode: status || editingPost.statusMode || 'published',
    };
    cmsStore.saveBlogPost(updated);
    setEditingPost(updated);
    showToast(`Blog "${updated.title}" saved as ${updated.statusMode === 'published' ? '🟢 Published' : '🟡 Draft'}!`);
  };

  const handleDeletePost = (post: CMSBlogPost) => {
    if (window.confirm(`Delete blog post "${post.title}"?`)) {
      cmsStore.deleteBlogPost(post.id);
      showToast(`Blog post deleted.`);
    }
  };

  // Upload Blog Cover Image
  const handleBlogImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingPost) {
      try {
        const dataUrl = await readFileAsDataUrl(file);
        setEditingPost({ ...editingPost, image: dataUrl });
        cmsStore.addMediaItem({
          name: file.name,
          type: 'image',
          url: dataUrl,
          size: `${Math.round(file.size / 1024)} KB`,
        });
        showToast('Blog cover image updated!');
      } catch {
        showToast('Failed to upload image.');
      }
    }
  };

  // Insert Internal Link into Blog Content
  const handleInsertBlogInternalLink = (anchor: string, url: string) => {
    if (!editingPost) return;
    const linkMarkdown = `[${anchor}](${url})`;
    const currentParagraphs = Array.isArray(editingPost.content)
      ? [...editingPost.content]
      : [editingPost.content || ''];
    if (currentParagraphs.length === 0) {
      currentParagraphs.push(linkMarkdown);
    } else {
      currentParagraphs[currentParagraphs.length - 1] = `${currentParagraphs[currentParagraphs.length - 1]} ${linkMarkdown}`;
    }
    setEditingPost({
      ...editingPost,
      content: currentParagraphs,
    });
    showToast(`Inserted link: ${linkMarkdown}`);
  };

  // ==================== PAGE CONTENT SAVE ====================
  const handleSavePageContent = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    cmsStore.savePageContent(pageContent);
    showToast('Page texts & elements updated successfully across the website!');
  };

  // ==================== MEDIA LIBRARY ====================
  const handleGeneralMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const isPdf = file.name.toLowerCase().endsWith('.pdf');
        const dataUrl = await readFileAsDataUrl(file);
        cmsStore.addMediaItem({
          name: file.name,
          type: isPdf ? 'pdf' : 'image',
          url: dataUrl,
          size: isPdf ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`,
        });
        showToast(`Uploaded ${file.name} to media library!`);
      } catch {
        showToast('Error uploading file.');
      }
    }
  };

  // ==================== LEADS EXPORT TO CSV ====================
  const handleExportLeadsCSV = () => {
    if (leads.length === 0) {
      showToast('No leads captured yet.');
      return;
    }
    const headers = ['Name', 'Phone', 'Email', 'Project Name', 'Brochure Name', 'Type', 'Timestamp'];
    const rows = leads.map((l) => [
      `"${l.name}"`,
      `"${l.phone}"`,
      `"${l.email}"`,
      `"${l.projectName || 'General'}"`,
      `"${l.brochureName || 'N/A'}"`,
      `"${l.type}"`,
      `"${l.timestamp}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Aurex_Leads_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Leads CSV exported successfully!');
  };

  // ==================== JSON BACKUP & RESTORE ====================
  const handleExportJSON = () => {
    const json = cmsStore.exportFullBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Aurex_Site_CMS_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Full website database backup exported!');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const success = cmsStore.importFullBackup(text);
        if (success) {
          showToast('Database restored successfully from backup!');
        } else {
          showToast('Invalid JSON backup file.');
        }
      };
      reader.readAsText(file);
    }
  };

  // ==================== FILTERED LISTS ====================
  const filteredProjects = projects.filter((p) => {
    if (projectCatFilter !== 'all' && p.category !== projectCatFilter) return false;
    if (projectStatusFilter !== 'all' && (p.statusMode || 'published') !== projectStatusFilter) return false;
    if (
      projectSearch.trim() &&
      !p.name.toLowerCase().includes(projectSearch.toLowerCase()) &&
      !p.developer.toLowerCase().includes(projectSearch.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const filteredPosts = posts.filter((post) => {
    if (postStatusFilter !== 'all' && (post.statusMode || 'published') !== postStatusFilter) return false;
    if (postSearch.trim() && !post.title.toLowerCase().includes(postSearch.toLowerCase())) {
      return false;
    }
    return true;
  });

  const filteredLeads = leads.filter((lead) => {
    if (leadTypeFilter !== 'all' && lead.type !== leadTypeFilter) return false;
    if (
      leadSearch.trim() &&
      !lead.name.toLowerCase().includes(leadSearch.toLowerCase()) &&
      !lead.phone.toLowerCase().includes(leadSearch.toLowerCase()) &&
      !lead.email.toLowerCase().includes(leadSearch.toLowerCase()) &&
      !(lead.projectName || '').toLowerCase().includes(leadSearch.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // Calculate Real-time SEO analysis for editing project
  const projectSeoAnalysis = editingProject
    ? analyzeSEO({
        title: editingProject.name,
        description: editingProject.description || '',
        focusKeyword: editingProject.focusKeyword,
        metaTitle: editingProject.metaTitle,
        metaDescription: editingProject.metaDescription,
        highlights: editingProject.highlights,
        amenities: editingProject.amenities,
      })
    : null;

  // 10 LSI Keywords for editing project
  const projectLsiKeywords: LSIKeywordResult[] = editingProject
    ? generateLSIKeywords(editingProject.focusKeyword || editingProject.name, editingProject.category)
    : [];

  // 10 LSI Keywords for editing blog post
  const blogLsiKeywords: LSIKeywordResult[] = editingPost
    ? generateLSIKeywords(editingPost.focusKeyword || editingPost.title, 'residential')
    : [];

  // ==================== AUTHENTICATION SCREEN ====================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07070A] text-white flex items-center justify-center px-4 py-20 relative overflow-hidden font-sans">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-purple/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-md w-full relative z-10">
          <div className="text-center mb-8">
            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-400 hover:text-white transition-colors mb-6 border border-white/10"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Aurex Estates</span>
            </button>

            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-brand-purple to-purple-500 flex items-center justify-center shadow-xl shadow-brand-purple/30 mb-4 border border-brand-purple/40">
              <Lock className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white">Aurex Admin Portal</h1>
            <p className="text-xs text-gray-400 mt-1">Sign in with authorized administrator credentials</p>
          </div>

          <div className="bg-[#101016] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            {authError && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="admin"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-purple-600 hover:from-brand-purpleLight hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-brand-purple/25 transition-all active:scale-[0.98]"
              >
                Sign In to Dashboard
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/10 text-center">
              <span className="text-[11px] text-gray-500 font-mono">
                Aurex Estates Administrative Panel • Secured HTTPS
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== DASHBOARD MAIN LAYOUT ====================
  return (
    <div className="min-h-screen bg-[#09090D] text-gray-200 flex font-sans antialiased overflow-x-hidden">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 px-4 py-3 rounded-xl bg-brand-purple text-white text-xs sm:text-sm font-semibold shadow-2xl flex items-center gap-2 border border-white/20 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          LEFT SIDEBAR: WORDPRESS-STYLE NAVIGATION
      ========================================================================= */}
      <aside className="w-64 bg-[#0D0D14] border-r border-white/10 flex flex-col justify-between shrink-0 min-h-screen select-none z-30 sticky top-0 h-screen">
        {/* Top Header / Branding */}
        <div>
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-purple to-purple-500 flex items-center justify-center font-bold text-white shadow-md shadow-brand-purple/30 text-sm">
                A
              </div>
              <div>
                <h2 className="text-sm font-bold text-white tracking-wide">Admin</h2>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-gray-400 font-medium">v2.5 Live Sync</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {/* 1. Projects */}
            <button
              onClick={() => {
                setActiveTab('projects');
                setViewMode('list');
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'projects' && viewMode === 'list'
                  ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/25'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 text-purple-400" />
                <span>Projects</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/10 text-white font-mono">
                {projects.length}
              </span>
            </button>

            {/* 2. Blogs (Renamed strictly as Blogs) */}
            <button
              onClick={() => {
                setActiveTab('posts');
                setViewMode('list');
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'posts' && viewMode === 'list'
                  ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/25'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Blogs</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/10 text-white font-mono">
                {posts.length}
              </span>
            </button>

            {/* 3. Pages & Elements */}
            <button
              onClick={() => {
                setActiveTab('pages');
                setViewMode('list');
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'pages' && viewMode === 'list'
                  ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/25'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Edit3 className="w-4 h-4 text-blue-400" />
                <span>Pages & Elements</span>
              </div>
              <span className="text-[10px] text-gray-400 font-mono">7 Pages</span>
            </button>

            {/* 4. Media & PDF Library */}
            <button
              onClick={() => {
                setActiveTab('media');
                setViewMode('list');
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'media' && viewMode === 'list'
                  ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/25'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span>Media & Brochures</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/10 text-white font-mono">
                {mediaLibrary.length}
              </span>
            </button>

            {/* 5. Leads & Inquiries */}
            <button
              onClick={() => {
                setActiveTab('leads');
                setViewMode('list');
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'leads' && viewMode === 'list'
                  ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/25'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Leads & Inquiries</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" title="Connected to Google Sheet & Email" />
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                  {leads.length}
                </span>
              </div>
            </button>

            {/* 6. SEO & LSI Engine */}
            <button
              onClick={() => {
                setActiveTab('seo');
                setViewMode('list');
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'seo' && viewMode === 'list'
                  ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/25'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span>SEO & 10 LSI Desk</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] bg-pink-500/20 text-pink-300 font-semibold uppercase">
                AI LSI
              </span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer: View Live Site & Sign Out */}
        <div className="p-3 border-t border-white/10 space-y-2">
          <a
            href="https://aurexestates.co.in"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-all border border-white/5"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>View Live Website</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
          </a>

          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-brand-purple/30 text-brand-purpleLight flex items-center justify-center font-bold text-xs">
                AD
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">Admin</p>
                <p className="text-[10px] text-gray-500 leading-tight">aurex.estates01</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Sign out of CMS"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* =========================================================================
          MAIN WORKSPACE
      ========================================================================= */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        {/* Top Header Bar (WordPress-style, clean breadcrumbs & quick actions, NO old banner text) */}
        <header className="h-16 px-6 bg-[#0B0B11]/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Aurex CMS</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-sm font-bold text-white capitalize">
              {viewMode === 'edit-project'
                ? `Edit Project: ${editingProject?.name || 'New Project'}`
                : viewMode === 'edit-post'
                ? `Edit Blog: ${editingPost?.title || 'New Blog'}`
                : viewMode === 'edit-page'
                ? `Edit Webpage Containers: ${selectedPageKey.toUpperCase()}`
                : activeTab === 'projects'
                ? 'All Property Projects'
                : activeTab === 'posts'
                ? 'Blogs & Market Intelligence'
                : activeTab === 'pages'
                ? 'Pages & Content Elements'
                : activeTab === 'media'
                ? 'Media & Brochure Library'
                : activeTab === 'leads'
                ? 'Captured Leads & Inquiries'
                : 'SEO & Real Estate LSI Engine'}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Database Backup Actions */}
            <button
              onClick={handleExportJSON}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-gray-300 hover:text-white transition-all border border-white/10"
              title="Export complete database backup to JSON"
            >
              <Download className="w-3.5 h-3.5 text-purple-400" />
              <span>Export Backup</span>
            </button>

            <button
              onClick={() => jsonImportRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-gray-300 hover:text-white transition-all border border-white/10"
              title="Import database backup JSON"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>Import Backup</span>
            </button>
            <input
              type="file"
              ref={jsonImportRef}
              onChange={handleImportJSON}
              accept=".json"
              className="hidden"
            />
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* =========================================================================
              VIEW 1: FULL-PAGE PROJECT EDITOR (Replaces Popup Modal)
          ========================================================================= */}
          {viewMode === 'edit-project' && editingProject && (
            <div className="space-y-6">
              {/* Sticky Top Action Bar */}
              <div className="p-4 rounded-2xl bg-[#111118] border border-white/10 flex flex-wrap items-center justify-between gap-4 sticky top-20 z-10 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setViewMode('list')}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                    title="Return to Projects List"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <h2 className="text-base font-bold text-white">
                      {editingProject.name ? editingProject.name : 'New Property Listing'}
                    </h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          editingProject.statusMode === 'published'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {editingProject.statusMode === 'published' ? '🟢 Published Live' : '🟡 Draft Mode'}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {editingProject.category.toUpperCase()} • {editingProject.segment}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Workflow Buttons: Preview without publish, Unpublish / Draft, Publish Live, Save */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Preview Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectProject) {
                        onSelectProject(editingProject.id);
                      }
                      showToast('Live preview opened in viewer.');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all border border-white/10"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-400" />
                    <span>Preview (Without publishing)</span>
                  </button>

                  {/* Toggle Draft / Unpublish */}
                  {editingProject.statusMode === 'published' ? (
                    <button
                      type="button"
                      onClick={() => handleSaveProject('draft')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold transition-all border border-amber-500/30"
                    >
                      <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                      <span>Unpublish / Revert to Draft</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSaveProject('published')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all border border-emerald-500/40"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Publish Live</span>
                    </button>
                  )}

                  {/* Save Changes */}
                  <button
                    type="button"
                    onClick={() => handleSaveProject(editingProject.statusMode)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-purple hover:bg-brand-purpleLight text-white text-xs font-bold shadow-lg shadow-brand-purple/30 transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>

              {/* Editor Sub-Navigation Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 scrollbar-none">
                <button
                  onClick={() => setProjectEditorSection('basic')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    projectEditorSection === 'basic' ? 'bg-white/15 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  1. Identification & Classification
                </button>
                <button
                  onClick={() => setProjectEditorSection('pricing')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    projectEditorSection === 'pricing' ? 'bg-white/15 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  2. Pricing & Financials
                </button>
                <button
                  onClick={() => setProjectEditorSection('media')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    projectEditorSection === 'media' ? 'bg-white/15 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  3. Media & Multi-Image Gallery
                </button>
                <button
                  onClick={() => setProjectEditorSection('brochure')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    projectEditorSection === 'brochure' ? 'bg-white/15 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  4. Official PDF Brochure
                </button>
                <button
                  onClick={() => setProjectEditorSection('content')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    projectEditorSection === 'content' ? 'bg-white/15 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  5. Content & Internal Linking
                </button>
                <button
                  onClick={() => setProjectEditorSection('floorplans')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    projectEditorSection === 'floorplans' ? 'bg-white/15 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  6. Floor Plans & Landmarks
                </button>
                <button
                  onClick={() => setProjectEditorSection('seo')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    projectEditorSection === 'seo' ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  ⚡ 7. SEO Structure & 10 LSI
                </button>
              </div>

              {/* ================= CONTAINER 1: BASIC IDENTIFICATION ================= */}
              {projectEditorSection === 'basic' && (
                <div className="p-6 rounded-2xl bg-[#111118] border border-white/10 space-y-5">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider text-brand-purpleLight">
                    Container 1: Core Property Identification & Corridor Classification
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">Project Name *</label>
                      <input
                        type="text"
                        value={editingProject.name}
                        onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                        placeholder="e.g. Godrej Meridien"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-brand-purple"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">Category *</label>
                      <select
                        value={editingProject.category}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            category: e.target.value as 'residential' | 'commercial' | 'plots',
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-[#181822] border border-white/15 text-white text-sm focus:outline-none focus:border-brand-purple"
                      >
                        <option value="residential">Residential Luxury</option>
                        <option value="commercial">Commercial Grade-A</option>
                        <option value="plots">Freehold Plotted Enclaves</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">Segment</label>
                      <select
                        value={editingProject.segment}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            segment: e.target.value as any,
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-[#181822] border border-white/15 text-white text-sm focus:outline-none focus:border-brand-purple"
                      >
                        <option value="Affordable">Affordable (Within 1.5 Cr)</option>
                        <option value="Luxury">Luxury (1.5 Cr - 6 Cr)</option>
                        <option value="Super Luxury">Super Luxury (6 Cr - 15 Cr)</option>
                        <option value="Ultra Luxury">Ultra Luxury (Above 15 Cr)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">Developer Name</label>
                      <input
                        type="text"
                        value={editingProject.developer}
                        onChange={(e) => setEditingProject({ ...editingProject, developer: e.target.value })}
                        placeholder="e.g. Godrej Properties"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-brand-purple"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">Location & Corridor</label>
                      <input
                        type="text"
                        value={editingProject.location}
                        onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                        placeholder="e.g. Sector 106, Dwarka Expressway"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-brand-purple"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">Total Project Area</label>
                      <input
                        type="text"
                        value={editingProject.projectArea || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, projectArea: e.target.value })}
                        placeholder="e.g. 14.5 Acres"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-brand-purple"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">Launch Year</label>
                      <input
                        type="text"
                        value={editingProject.launchYear || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, launchYear: e.target.value })}
                        placeholder="e.g. 2018 or 2024"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-brand-purple"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">Possession / Completion</label>
                      <input
                        type="text"
                        value={editingProject.completionYear || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, completionYear: e.target.value })}
                        placeholder="e.g. 2025 or Ready to Move"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-brand-purple"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">RERA Registration No</label>
                      <input
                        type="text"
                        value={editingProject.reraNumber || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, reraNumber: e.target.value })}
                        placeholder="e.g. HRERA-PKL-GGM-1240-2023"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-brand-purple"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-6">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-300">
                        <input
                          type="checkbox"
                          checked={editingProject.featured || false}
                          onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                          className="w-4 h-4 rounded text-brand-purple focus:ring-brand-purple"
                        />
                        <span>Feature on Homepage Spotlight</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= CONTAINER 2: PRICING & FINANCIALS ================= */}
              {projectEditorSection === 'pricing' && (
                <div className="p-6 rounded-2xl bg-[#111118] border border-white/10 space-y-5">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider text-brand-purpleLight">
                    Container 2: Investment Financials & Price Display
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                        Price Display String * (Shown on Cards & Overview)
                      </label>
                      <input
                        type="text"
                        value={editingProject.priceDisplay}
                        onChange={(e) => setEditingProject({ ...editingProject, priceDisplay: e.target.value })}
                        placeholder="e.g. ₹2.12 Cr - ₹5.66 Cr"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-brand-purple"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                        Size Display String (e.g. 1,004 - 2,027 sq ft)
                      </label>
                      <input
                        type="text"
                        value={editingProject.sizeDisplay || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, sizeDisplay: e.target.value })}
                        placeholder="e.g. 1,004 - 2,027 sq ft"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-brand-purple"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">Min Price Numeric (Lakhs)</label>
                      <input
                        type="number"
                        value={editingProject.priceMin}
                        onChange={(e) => setEditingProject({ ...editingProject, priceMin: Number(e.target.value) })}
                        placeholder="212"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-brand-purple"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">Max Price Numeric (Lakhs)</label>
                      <input
                        type="number"
                        value={editingProject.priceMax}
                        onChange={(e) => setEditingProject({ ...editingProject, priceMax: Number(e.target.value) })}
                        placeholder="566"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-brand-purple"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">Price Per Sq Ft (Approx)</label>
                      <input
                        type="text"
                        value={editingProject.pricePerSqFt || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, pricePerSqFt: e.target.value })}
                        placeholder="e.g. ₹18,500 / sq ft"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-brand-purple"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">Expected Rental Yield (%)</label>
                      <input
                        type="text"
                        value={editingProject.rentalYield || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, rentalYield: e.target.value })}
                        placeholder="e.g. 4.2% - 5.1%"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-brand-purple"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ================= CONTAINER 3: MEDIA & MULTI-IMAGE GALLERY ================= */}
              {projectEditorSection === 'media' && (
                <div className="p-6 rounded-2xl bg-[#111118] border border-white/10 space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider text-brand-purpleLight">
                        Container 3: Media & Multi-Image Gallery Manager
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Add, replace, or delete images. Every image can be previewed or designated as the primary hero thumbnail.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => galleryImageUploadRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-purple hover:bg-brand-purpleLight text-white text-xs font-semibold transition-all"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Image File</span>
                      </button>
                      <input
                        type="file"
                        ref={galleryImageUploadRef}
                        onChange={handleGalleryImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Add via URL */}
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={newGalleryImageUrl}
                      onChange={(e) => setNewGalleryImageUrl(e.target.value)}
                      placeholder="Paste image web URL (e.g. /images/meridien/facade.jpg or https://...)"
                      className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-brand-purple"
                    />
                    <button
                      type="button"
                      onClick={handleAddGalleryImageUrl}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold"
                    >
                      Add URL
                    </button>
                  </div>

                  {/* Gallery Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
                    {(editingProject.galleryImages || [editingProject.image]).map((imgUrl, idx) => {
                      const isHero = imgUrl === editingProject.image;
                      return (
                        <div
                          key={idx}
                          className={`relative rounded-xl overflow-hidden border group transition-all ${
                            isHero ? 'border-brand-purple ring-2 ring-brand-purple/40 shadow-lg' : 'border-white/10'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`Gallery asset ${idx + 1}`}
                            className="w-full h-36 object-cover bg-black/40"
                          />

                          {isHero && (
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-brand-purple text-white text-[10px] font-bold uppercase tracking-wider shadow">
                              ★ Hero Thumbnail
                            </span>
                          )}

                          {/* Hover action overlay */}
                          <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                            {!isHero && (
                              <button
                                type="button"
                                onClick={() => handleSetGalleryImageAsHero(idx)}
                                className="w-full py-1 rounded bg-brand-purple/90 text-white text-[11px] font-semibold hover:bg-brand-purple"
                              >
                                Set as Hero
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteGalleryImage(idx)}
                              className="w-full py-1 rounded bg-rose-500/80 text-white text-[11px] font-semibold hover:bg-rose-600 flex items-center justify-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete Image</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ================= CONTAINER 4: OFFICIAL PDF BROCHURE ================= */}
              {projectEditorSection === 'brochure' && (
                <div className="p-6 rounded-2xl bg-[#111118] border border-white/10 space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider text-brand-purpleLight">
                      Container 4: Official Verified PDF Brochure
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Manage the property PDF brochure download gating and verified document attachment.
                    </p>
                  </div>

                  {/* Brochure Upload State UX */}
                  {editingProject.brochureUrl || editingProject.brochureName ? (
                    /* STATE A: BROCHURE ATTACHED - Hide Upload Button, Show Attached File Card */
                    <div className="p-5 rounded-2xl bg-white/[0.03] border border-emerald-500/30 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-red-950/40 border border-red-500/40 flex items-center justify-center text-red-400">
                          <FileDown className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">
                              {editingProject.brochureName || `${editingProject.name} Official Brochure.pdf`}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                              🟢 Attached & Live
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Official verified document ready for instant visitor download.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Preview / Test Download */}
                        <a
                          href={editingProject.brochureUrl}
                          download={editingProject.brochureName || 'Brochure.pdf'}
                          className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview PDF</span>
                        </a>

                        {/* Replace Brochure */}
                        <button
                          type="button"
                          onClick={() => brochureUploadRef.current?.click()}
                          className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Replace File</span>
                        </button>
                        <input
                          type="file"
                          ref={brochureUploadRef}
                          onChange={handleProjectBrochureUpload}
                          accept="application/pdf"
                          className="hidden"
                        />

                        {/* Delete Brochure */}
                        <button
                          type="button"
                          onClick={handleRemoveBrochure}
                          className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-1.5 border border-rose-500/30 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove Brochure</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* STATE B: NO BROCHURE ATTACHED - Show Upload Button */
                    <div className="p-8 rounded-2xl bg-white/[0.02] border-2 border-dashed border-white/15 text-center space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-red-950/30 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
                        <FileDown className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">No PDF Brochure Attached Yet</h4>
                        <p className="text-xs text-gray-400 mt-1">
                          Upload the official developer PDF brochure to enable visitor downloads.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => brochureUploadRef.current?.click()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-950/40 border border-red-500/40 hover:bg-red-950/60 text-red-300 text-xs font-bold transition-all shadow-lg"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload PDF Brochure</span>
                      </button>
                      <input
                        type="file"
                        ref={brochureUploadRef}
                        onChange={handleProjectBrochureUpload}
                        accept="application/pdf"
                        className="hidden"
                      />
                    </div>
                  )}

                  {/* Lead Requirement Gating Checkbox */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={editingProject.requireLeadForBrochure ?? true}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            requireLeadForBrochure: e.target.checked,
                          })
                        }
                        className="w-4 h-4 mt-1 text-brand-purple rounded border-gray-600 focus:ring-brand-purple"
                      />
                      <div>
                        <span className="font-bold text-white text-xs block">
                          Require visitor contact details before PDF download starts
                        </span>
                        <span className="text-gray-400 text-[11px] block mt-0.5">
                          When checked, visitors must provide their Name, 10-digit Phone, and Email. The lead is automatically logged in the Attached Excel / Google Sheet and sends an email notification to aurex.estates01@gmail.com, then immediately downloads the PDF brochure.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* ================= CONTAINER 5: CONTENT & INTERNAL LINKING ================= */}
              {projectEditorSection === 'content' && (
                <div className="p-6 rounded-2xl bg-[#111118] border border-white/10 space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider text-brand-purpleLight">
                      Container 5: Comprehensive Project Description & Internal Hyperlinking
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Write in-depth property narratives with one-click internal link insertion for maximum SEO authority.
                    </p>
                  </div>

                  {/* Internal Linking Helper Toolbar */}
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                    <div className="flex items-center gap-2">
                      <Link2 className="w-4 h-4 text-brand-purpleLight" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Quick Internal Linking Toolbar
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleInsertInternalLink('Golf Course Road', '/residential')}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-gray-300 hover:text-white border border-white/10"
                      >
                        + [Golf Course Road](/residential)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertInternalLink('Dwarka Expressway', '/residential')}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-gray-300 hover:text-white border border-white/10"
                      >
                        + [Dwarka Expressway](/residential)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertInternalLink('Commercial Portfolios', '/commercial')}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-gray-300 hover:text-white border border-white/10"
                      >
                        + [Commercial Portfolios](/commercial)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertInternalLink('Freehold Plotted Enclaves', '/plots')}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-gray-300 hover:text-white border border-white/10"
                      >
                        + [Plotted Enclaves](/plots)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertInternalLink('Senior Advisory Desk', '/contact')}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-gray-300 hover:text-white border border-white/10"
                      >
                        + [Advisory Desk](/contact)
                      </button>
                    </div>

                    {/* Custom Link Builder */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                      <input
                        type="text"
                        value={linkAnchorText}
                        onChange={(e) => setLinkAnchorText(e.target.value)}
                        placeholder="Custom anchor text (e.g. DLF Privana)"
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-white text-xs w-48"
                      />
                      <select
                        value={linkTargetUrl}
                        onChange={(e) => setLinkTargetUrl(e.target.value)}
                        className="px-3 py-1.5 rounded-lg bg-[#181822] border border-white/15 text-white text-xs"
                      >
                        <option value="/residential">/residential (Prime Residential)</option>
                        <option value="/commercial">/commercial (Commercial Assets)</option>
                        <option value="/plots">/plots (Plotted Enclaves)</option>
                        <option value="/blogs">/blogs (Blogs & Research)</option>
                        <option value="/about">/about (About Aurex)</option>
                        <option value="/contact">/contact (Advisory Desk)</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          if (linkAnchorText.trim()) {
                            handleInsertInternalLink(linkAnchorText.trim(), linkTargetUrl);
                            setLinkAnchorText('');
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-brand-purple hover:bg-brand-purpleLight text-white text-xs font-semibold"
                      >
                        Insert Hyperlink
                      </button>
                    </div>
                  </div>

                  {/* Main Description Textarea */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Full Property Narrative & Advisory Overview
                    </label>
                    <textarea
                      rows={8}
                      value={editingProject.description}
                      onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                      placeholder="Comprehensive architectural narrative, location advantage, and developer pedigree..."
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-brand-purple font-mono"
                    />
                    <div className="flex items-center justify-between text-[11px] text-gray-500 mt-1">
                      <span>Internal links supported format: [Anchor Text](/page)</span>
                      <span>{editingProject.description?.split(/\s+/).filter(Boolean).length || 0} words</span>
                    </div>
                  </div>

                  {/* Highlights Bullet List */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Bullet Highlights (Comma separated or per line)
                    </label>
                    <textarea
                      rows={4}
                      value={(editingProject.highlights || []).join('\n')}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          highlights: e.target.value.split('\n').filter((h) => h.trim().length > 0),
                        })
                      }
                      placeholder="One highlight per line:&#10;Olympian Olympic-Length Clubhouse&#10;Private Lift Lobby per Apartment&#10;24/7 Concierge Standards"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-brand-purple font-mono"
                    />
                  </div>

                  {/* Amenities List */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Key Amenities (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={(editingProject.amenities || []).join(', ')}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          amenities: e.target.value.split(',').map((a) => a.trim()).filter(Boolean),
                        })
                      }
                      placeholder="Clubhouse, Heated Swimming Pool, Spa, Tennis Court, Banquet Hall"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-brand-purple"
                    />
                  </div>
                </div>
              )}

              {/* ================= CONTAINER 6: FLOOR PLANS & CONNECTIVITY ================= */}
              {projectEditorSection === 'floorplans' && (
                <div className="p-6 rounded-2xl bg-[#111118] border border-white/10 space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider text-brand-purpleLight">
                      Container 6: Floor Plans & Strategic Travel Radii
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Add and edit architectural unit typologies, dimensions, and drive times to core landmarks.
                    </p>
                  </div>

                  {/* Drive Times */}
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-gray-300">
                      Drive Times & Landmark Proximity
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(editingProject.driveTimes || [
                        { time: '15 Mins', label: 'IGI Airport T3' },
                        { time: '5 Mins', label: 'Cyber City / Commercial Hub' },
                        { time: '7 Mins', label: 'Golf Course Road' },
                        { time: '10 Mins', label: 'Metro Station' },
                      ]).map((dt, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
                          <input
                            type="text"
                            value={dt.time}
                            onChange={(e) => {
                              const updated = [...(editingProject.driveTimes || [])];
                              updated[idx] = { ...dt, time: e.target.value };
                              setEditingProject({ ...editingProject, driveTimes: updated });
                            }}
                            placeholder="e.g. 15 Mins"
                            className="w-24 px-2 py-1 rounded bg-black/40 border border-white/15 text-white text-xs font-bold"
                          />
                          <input
                            type="text"
                            value={dt.label}
                            onChange={(e) => {
                              const updated = [...(editingProject.driveTimes || [])];
                              updated[idx] = { ...dt, label: e.target.value };
                              setEditingProject({ ...editingProject, driveTimes: updated });
                            }}
                            placeholder="e.g. IGI Airport T3"
                            className="flex-1 px-2 py-1 rounded bg-black/40 border border-white/15 text-white text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ================= CONTAINER 7: SEO STRUCTURE & 10 LSI SUGGESTIONS ================= */}
              {projectEditorSection === 'seo' && (
                <div className="p-6 rounded-2xl bg-[#111118] border border-pink-500/20 space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider text-pink-400 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        <span>Container 7: Real-Time SEO Structure & 10 LSI Keyword Intelligence</span>
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Inspect heading hierarchy (H1, H2s), word count, SERP snippet, and automatically suggested real estate LSI keywords.
                      </p>
                    </div>

                    {projectSeoAnalysis && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                        <span className="text-xs text-gray-400">SEO Health Score:</span>
                        <span
                          className={`text-sm font-bold font-mono ${
                            projectSeoAnalysis.score >= 80
                              ? 'text-emerald-400'
                              : projectSeoAnalysis.score >= 60
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {projectSeoAnalysis.score}/100
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Seed Keyword Input */}
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Seed Focus Keyword (Used to auto-generate 10 LSI variations)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editingProject.focusKeyword || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, focusKeyword: e.target.value })}
                        placeholder={`e.g. ${editingProject.name} Dwarka Expressway`}
                        className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-pink-500"
                      />
                    </div>
                  </div>

                  {/* 10 Automatically Suggested LSI Keywords */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        10 Recommended Real Estate LSI Keywords
                      </span>
                      <span className="text-[11px] text-gray-400">
                        Click "+ Insert" to add directly to content narrative
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {projectLsiKeywords.map((lsi, idx) => {
                        const isIncluded =
                          editingProject.description?.toLowerCase().includes(lsi.keyword.toLowerCase()) || false;
                        return (
                          <div
                            key={idx}
                            className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                              isIncluded
                                ? 'bg-emerald-950/20 border-emerald-500/30'
                                : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                            }`}
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-medium text-white truncate">{lsi.keyword}</span>
                                {isIncluded && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" title="Included" />
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-white/10 text-gray-400">
                                  {lsi.intent}
                                </span>
                                <span className="text-[10px] text-gray-500">
                                  {isIncluded ? '🟢 In content' : '⚪ Missing'}
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                const currentDesc = editingProject.description || '';
                                setEditingProject({
                                  ...editingProject,
                                  description: `${currentDesc} ${lsi.keyword}.`,
                                });
                                showToast(`Added LSI: "${lsi.keyword}"`);
                              }}
                              className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/15 text-pink-300 text-[11px] font-semibold shrink-0"
                            >
                              + Insert
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Heading Hierarchy Preview (H1, H2s, H3s) */}
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                    <span className="text-xs font-bold text-white uppercase tracking-wider block">
                      Heading & Structural Hierarchy (H-Tags & P-Tags)
                    </span>

                    <div className="space-y-2 text-xs font-mono">
                      <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 text-brand-purpleLight flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-brand-purple/30 text-[10px] font-bold">H1</span>
                        <span>{editingProject.name || 'Untitled Property'}</span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 text-gray-300 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold">
                            H2
                          </span>
                          <span>Property Overview & Strategic Connectivity</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold">
                            H2
                          </span>
                          <span>Pricing & Investment Typologies</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold">
                            H2
                          </span>
                          <span>Architectural Highlights & Verified Brochure</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 text-gray-400 flex items-center justify-between">
                        <span>Paragraph Count (&lt;p&gt; tags): {editingProject.description ? '3 Containers' : '0'}</span>
                        <span>Word Count: {projectSeoAnalysis?.wordCount || 0} words</span>
                      </div>
                    </div>
                  </div>

                  {/* Meta Title & Meta Description with Google SERP Simulation */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-gray-300">
                          Meta Title Tag (Google Search Result Title)
                        </label>
                        <span className="text-[11px] text-gray-400">
                          {(editingProject.metaTitle || '').length}/60 chars
                        </span>
                      </div>
                      <input
                        type="text"
                        value={editingProject.metaTitle || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, metaTitle: e.target.value })}
                        placeholder={`${editingProject.name} | Luxury Property in ${editingProject.location}`}
                        className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-brand-purple"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-gray-300">
                          Meta Description Tag (Google Snippet)
                        </label>
                        <span className="text-[11px] text-gray-400">
                          {(editingProject.metaDescription || '').length}/160 chars
                        </span>
                      </div>
                      <textarea
                        rows={2}
                        value={editingProject.metaDescription || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, metaDescription: e.target.value })}
                        placeholder="Explore verified pricing, floor plans, and official brochure download..."
                        className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-brand-purple"
                      />
                    </div>

                    {/* Google SERP Snippet Preview */}
                    <div className="p-4 rounded-xl bg-[#1e1f24] border border-gray-700/50 space-y-1 font-sans">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>https://aurexestates.co.in</span>
                        <span>›</span>
                        <span>{editingProject.category}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-[#8ab4f8] hover:underline cursor-pointer">
                        {editingProject.metaTitle || `${editingProject.name} | Luxury Property`}
                      </h4>
                      <p className="text-xs text-[#bdc1c6] line-clamp-2">
                        {editingProject.metaDescription ||
                          editingProject.description?.slice(0, 155) ||
                          'Official project specifications, floor plans, and verified brochure.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              VIEW 2: FULL-PAGE BLOG EDITOR (Replaces Popup Modal)
          ========================================================================= */}
          {viewMode === 'edit-post' && editingPost && (
            <div className="space-y-6">
              {/* Sticky Top Action Bar */}
              <div className="p-4 rounded-2xl bg-[#111118] border border-white/10 flex flex-wrap items-center justify-between gap-4 sticky top-20 z-10 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setViewMode('list')}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <h2 className="text-base font-bold text-white">
                      {editingPost.title ? editingPost.title : 'New Blog Article'}
                    </h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          editingPost.statusMode === 'published'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {editingPost.statusMode === 'published' ? '🟢 Published Live' : '🟡 Draft Mode'}
                      </span>
                      <span className="text-[11px] text-gray-400">{editingPost.category}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Draft / Publish Toggle */}
                  {editingPost.statusMode === 'published' ? (
                    <button
                      type="button"
                      onClick={() => handleSavePost('draft')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Revert to Draft</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSavePost('published')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold border border-emerald-500/40"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Publish Live</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleSavePost(editingPost.statusMode)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-purple hover:bg-brand-purpleLight text-white text-xs font-bold shadow-lg shadow-brand-purple/30"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Save Blog</span>
                  </button>
                </div>
              </div>

              {/* Blog Metadata Form */}
              <div className="p-6 rounded-2xl bg-[#111118] border border-white/10 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">Article Title *</label>
                    <input
                      type="text"
                      value={editingPost.title}
                      onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                      placeholder="e.g. Golf Course Road vs Dwarka Expressway: The High-Net-Worth Thesis"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-brand-purple"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">Category</label>
                    <input
                      type="text"
                      value={editingPost.category}
                      onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value as any })}
                      placeholder="Market Intelligence / Investment Advisory"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-brand-purple"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">Read Time</label>
                    <input
                      type="text"
                      value={editingPost.readTime}
                      onChange={(e) => setEditingPost({ ...editingPost, readTime: e.target.value })}
                      placeholder="6 min read"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-brand-purple"
                    />
                  </div>

                  {/* Cover Image */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-xs font-semibold text-gray-300">Blog Cover Image</label>
                    <div className="flex items-center gap-3">
                      <img
                        src={editingPost.image}
                        alt="Blog Cover"
                        className="w-20 h-14 rounded-lg object-cover border border-white/15"
                      />
                      <button
                        type="button"
                        onClick={() => blogImageUploadRef.current?.click()}
                        className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Cover Image</span>
                      </button>
                      <input
                        type="file"
                        ref={blogImageUploadRef}
                        onChange={handleBlogImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">Executive Excerpt</label>
                    <textarea
                      rows={2}
                      value={editingPost.excerpt}
                      onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                      placeholder="Concise summary for previews and social sharing cards..."
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-brand-purple"
                    />
                  </div>

                  {/* Internal Linking Helper for Blogs */}
                  <div className="md:col-span-2 p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider block">
                      Quick Internal Linking Toolbar
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleInsertBlogInternalLink('Golf Course Road', '/residential')}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-gray-300 hover:text-white border border-white/10"
                      >
                        + [Golf Course Road](/residential)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertBlogInternalLink('Dwarka Expressway Portfolios', '/residential')}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-gray-300 hover:text-white border border-white/10"
                      >
                        + [Dwarka Expressway](/residential)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertBlogInternalLink('Grade-A Commercial Assets', '/commercial')}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-gray-300 hover:text-white border border-white/10"
                      >
                        + [Commercial](/commercial)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertBlogInternalLink('Private Advisory Desk', '/contact')}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-gray-300 hover:text-white border border-white/10"
                      >
                        + [Advisory Desk](/contact)
                      </button>
                    </div>
                  </div>

                  {/* Blog Body Paragraphs */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Full Article Body Content (Paragraphs)
                    </label>
                    <textarea
                      rows={12}
                      value={Array.isArray(editingPost.content) ? editingPost.content.join('\n\n') : editingPost.content}
                      onChange={(e) =>
                        setEditingPost({
                          ...editingPost,
                          content: e.target.value.split('\n\n').filter(Boolean),
                        })
                      }
                      placeholder="Write blog paragraphs separated by empty lines..."
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-brand-purple font-mono"
                    />
                  </div>
                </div>

                {/* 10 LSI Auto-Suggestions for Blog */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <span className="text-xs font-bold text-white uppercase tracking-wider block">
                    10 Suggested LSI Keywords for Market Insights
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {blogLsiKeywords.map((lsi, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between text-xs"
                      >
                        <span className="text-gray-300">{lsi.keyword}</span>
                        <button
                          type="button"
                          onClick={() => handleInsertBlogInternalLink(lsi.keyword, '/residential')}
                          className="px-2 py-0.5 rounded bg-brand-purple/40 text-brand-purpleLight text-[10px] font-semibold hover:bg-brand-purple/60"
                        >
                          + Insert
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 3: PROJECTS LIST TAB
          ========================================================================= */}
          {viewMode === 'list' && activeTab === 'projects' && (
            <div className="space-y-5">
              {/* Search & Filter Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={projectSearch}
                      onChange={(e) => setProjectSearch(e.target.value)}
                      placeholder="Search projects or developer..."
                      className="pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/15 text-white placeholder-gray-500 text-xs w-64 focus:outline-none focus:border-brand-purple"
                    />
                  </div>

                  {/* Category Pill Filters */}
                  <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
                    {(['all', 'residential', 'commercial', 'plots'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setProjectCatFilter(cat)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                          projectCatFilter === cat
                            ? 'bg-brand-purple text-white shadow'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Status Pill Filters */}
                  <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
                    {(['all', 'published', 'draft'] as const).map((stat) => (
                      <button
                        key={stat}
                        onClick={() => setProjectStatusFilter(stat)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                          projectStatusFilter === stat
                            ? 'bg-white/20 text-white shadow'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {stat}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleOpenNewProject}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-purple hover:bg-brand-purpleLight text-white text-xs font-bold shadow-lg shadow-brand-purple/30 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add New Project</span>
                </button>
              </div>

              {/* Projects Table */}
              <div className="bg-[#101016] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 border-b border-white/10 uppercase tracking-wider text-[11px] text-gray-400">
                      <tr>
                        <th className="py-3 px-4">Project</th>
                        <th className="py-3 px-4">Category & Segment</th>
                        <th className="py-3 px-4">Location</th>
                        <th className="py-3 px-4">Price Range</th>
                        <th className="py-3 px-4">Brochure</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredProjects.map((p) => {
                        const hasBrochure = Boolean(p.brochureUrl || p.brochureName);
                        const isPublished = (p.statusMode || 'published') === 'published';
                        return (
                          <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src = '/camellias.jpg';
                                  }}
                                  className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0"
                                />
                                <div>
                                  <p className="font-bold text-white text-xs">{p.name}</p>
                                  <p className="text-[11px] text-gray-400">{p.developer}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="capitalize text-gray-300 font-semibold">{p.category}</span>
                              <span className="block text-[11px] text-brand-purpleLight font-medium">
                                {p.segment}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <p className="text-gray-200 font-semibold truncate max-w-[200px]">
                                {formatLocationShort(p.location, p.city)}
                              </p>
                            </td>
                            <td className="py-3.5 px-4">
                              <p className="font-semibold text-emerald-400">{p.priceDisplay}</p>
                            </td>
                            <td className="py-3.5 px-4">
                              {hasBrochure ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                  <Check className="w-3 h-3" />
                                  <span>Attached</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/5 text-gray-400 border border-white/10">
                                  Unattached
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              <select
                                value={isPublished ? 'published' : 'draft'}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  const newStatus = val === 'published' ? 'published' : 'draft';
                                  cmsStore.toggleProjectStatus(p.id, newStatus);
                                  showToast(`Project status set to ${newStatus === 'published' ? 'Published' : 'Draft'}`);
                                }}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border cursor-pointer focus:outline-none transition-colors ${
                                  isPublished
                                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                    : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                }`}
                              >
                                <option value="published" className="bg-[#101016] text-emerald-400">Publish</option>
                                <option value="draft" className="bg-[#101016] text-amber-400">Draft</option>
                                <option value="unpublish" className="bg-[#101016] text-gray-400">Unpublish</option>
                              </select>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleEditProject(p)}
                                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-all font-semibold flex items-center gap-1.5"
                                  title="Edit project"
                                >
                                  <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteProject(p)}
                                  className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                  title="Delete project"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 4: BLOGS TAB (Strictly "Blogs", replacing "Articles & Market Intelligence")
          ========================================================================= */}
          {viewMode === 'list' && activeTab === 'posts' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={postSearch}
                      onChange={(e) => setPostSearch(e.target.value)}
                      placeholder="Search blogs..."
                      className="pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/15 text-white placeholder-gray-500 text-xs w-64 focus:outline-none focus:border-brand-purple"
                    />
                  </div>

                  <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
                    {(['all', 'published', 'draft'] as const).map((stat) => (
                      <button
                        key={stat}
                        onClick={() => setPostStatusFilter(stat)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                          postStatusFilter === stat ? 'bg-white/20 text-white shadow' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {stat}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleOpenNewPost}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-purple hover:bg-brand-purpleLight text-white text-xs font-bold shadow-lg shadow-brand-purple/30 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Write New Blog</span>
                </button>
              </div>

              {/* Blogs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredPosts.map((post) => {
                  const isPublished = (post.statusMode || 'published') === 'published';
                  return (
                    <div
                      key={post.id}
                      className="rounded-2xl bg-[#111118] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-brand-purple/40 transition-all group shadow-xl"
                    >
                      <div>
                        <div className="relative h-44 overflow-hidden">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span
                            className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shadow ${
                              isPublished ? 'bg-emerald-500/80 text-white' : 'bg-amber-500/80 text-white'
                            }`}
                          >
                            {isPublished ? 'Published' : 'Draft'}
                          </span>
                        </div>

                        <div className="p-5 space-y-2">
                          <span className="text-[11px] font-bold text-brand-purpleLight uppercase tracking-wider">
                            {post.category} • {post.readTime}
                          </span>
                          <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug">{post.title}</h3>
                          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                        </div>
                      </div>

                      <div className="p-4 pt-0 border-t border-white/5 flex items-center justify-between mt-2">
                        <span className="text-[11px] text-gray-500">{post.date}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditPost(post)}
                            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3 text-purple-400" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeletePost(post)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/10"
                            title="Delete article"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 5: PAGES & ELEMENTS DIRECTORY (Cards with Edit button for each container)
          ========================================================================= */}
          {viewMode === 'list' && activeTab === 'pages' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white tracking-wide">
                    Webpage &amp; Container Management
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Select any webpage or global layout to inspect and edit its containers, tags, images, PDFs, and metadata.
                  </p>
                </div>
              </div>

              {/* Grid of Pages & Global Layouts */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    key: 'home' as PageKey,
                    title: 'Home Page',
                    route: '/',
                    icon: '🏠',
                    desc: 'Hero banner, stats counters, advisory methodology, portfolio showcase, consultation banner',
                    containers: '5 Containers',
                    tags: 'H1, H2, <p>, Images, Stats',
                    meta: pageContent.home?.metaTitle || 'Home Page',
                  },
                  {
                    key: 'about' as PageKey,
                    title: 'About Us',
                    route: '/about',
                    icon: '📖',
                    desc: 'Corporate fiduciary narrative, mission statement, vision, institutional standards',
                    containers: '3 Containers',
                    tags: 'H1, H2, <p>, Mission, Vision',
                    meta: pageContent.about?.metaTitle || 'About Us',
                  },
                  {
                    key: 'residential' as PageKey,
                    title: 'Residential Portfolios',
                    route: '/residential',
                    icon: '🏙️',
                    desc: 'Luxury apartments, penthouses, villas, Golf Course Road, Dwarka Expressway inventory',
                    containers: '2 Containers',
                    tags: 'H1, H2, <p>, Tagline',
                    meta: pageContent.residential?.metaTitle || 'Residential Portfolios',
                  },
                  {
                    key: 'commercial' as PageKey,
                    title: 'Commercial Assets',
                    route: '/commercial',
                    icon: '🏢',
                    desc: 'Institutional grade-A corporate offices, pre-leased retail shops, multiplexes & SCOs',
                    containers: '2 Containers',
                    tags: 'H1, H2, <p>, Tagline',
                    meta: pageContent.commercial?.metaTitle || 'Commercial Assets',
                  },
                  {
                    key: 'plots' as PageKey,
                    title: 'Plots & Plotted Lands',
                    route: '/plots',
                    icon: '🌳',
                    desc: 'Freehold residential & commercial plots, land parcels, title and zoning disclosures',
                    containers: '2 Containers',
                    tags: 'H1, H2, <p>, Tagline',
                    meta: pageContent.plots?.metaTitle || 'Plots & Land',
                  },
                  {
                    key: 'career' as PageKey,
                    title: 'Careers & Culture',
                    route: '/career',
                    icon: '💼',
                    desc: 'Talent hiring banner, company culture, dynamic job openings listings & requirements',
                    containers: '2 Containers',
                    tags: `H1, <p>, ${pageContent.career?.openings?.length || 0} Openings`,
                    meta: pageContent.career?.metaTitle || 'Careers at Aurex',
                  },
                  {
                    key: 'contact' as PageKey,
                    title: 'Contact & Advisory Desk',
                    route: '/contact',
                    icon: '📞',
                    desc: 'Official phone, email, registered office address, RERA certificate, Excel webhook',
                    containers: '2 Containers',
                    tags: 'Direct Phone, Email, Address, Webhook',
                    meta: pageContent.contact?.metaTitle || 'Contact Aurex Estates',
                  },
                  {
                    key: 'header' as PageKey,
                    title: 'Header & Navigation Bar',
                    route: 'Global Layout',
                    icon: '🧭',
                    desc: 'Brand logo asset, navigation menu links, Consultation CTA button, WhatsApp icon placement',
                    containers: '3 Containers',
                    tags: 'Logo [Image], CTA [Btn], WhatsApp [Icon]',
                    meta: 'Global Desktop & Mobile Header',
                  },
                  {
                    key: 'footer' as PageKey,
                    title: 'Footer & Global Brand',
                    route: 'Global Layout',
                    icon: '⚓',
                    desc: 'Brand narrative, social media channels, RERA compliance statements, copyright notice',
                    containers: '2 Containers',
                    tags: 'Copyright [<p>], RERA [<p>], Social Links',
                    meta: 'Global Footer & Disclaimers',
                  },
                ].map((card) => (
                  <div
                    key={card.key}
                    className="p-5 rounded-2xl bg-[#101016] border border-white/10 hover:border-brand-purple/40 transition-all flex flex-col justify-between group shadow-xl hover:shadow-brand-purple/10"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{card.icon}</span>
                          <div>
                            <h4 className="font-bold text-white text-sm group-hover:text-brand-purpleLight transition-colors">
                              {card.title}
                            </h4>
                            <span className="text-[10px] font-mono text-purple-400">
                              {card.route}
                            </span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/5 text-gray-400 border border-white/5">
                          {card.containers}
                        </span>
                      </div>

                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                        {card.desc}
                      </p>

                      <div className="pt-2 border-t border-white/5 text-[11px] text-gray-500 flex items-center justify-between">
                        <span className="truncate max-w-[200px]" title={card.meta}>
                          🏷️ {card.tags}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Live Sync
                      </span>
                      <button
                        onClick={() => {
                          setSelectedPageKey(card.key);
                          setViewMode('edit-page');
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-brand-purple hover:bg-brand-purpleLight text-white text-xs font-bold transition-all shadow-md shadow-brand-purple/20 flex items-center gap-1.5 active:scale-95"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 5B: DEDICATED FULL-PAGE WEBPAGE & CONTAINER EDITOR
          ========================================================================= */}
          {viewMode === 'edit-page' && (
            <WebpageContainerEditor
              pageKey={selectedPageKey}
              pageContent={pageContent}
              setPageContent={setPageContent}
              onSave={() => handleSavePageContent()}
              onBack={() => setViewMode('list')}
              showToast={showToast}
            />
          )}

          {/* =========================================================================
              VIEW 6: MEDIA & PDF BROCHURES LIBRARY TAB
          ========================================================================= */}
          {viewMode === 'list' && activeTab === 'media' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Centralized Media & Brochure Repository ({mediaLibrary.length} Items)
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Browse all uploaded property photos, architectural renders, and official PDF brochures.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => mediaLibraryUploadRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-purple hover:bg-brand-purpleLight text-white text-xs font-bold shadow-lg shadow-brand-purple/30"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New File</span>
                  </button>
                  <input
                    type="file"
                    ref={mediaLibraryUploadRef}
                    onChange={handleGeneralMediaUpload}
                    accept="image/*,application/pdf"
                    className="hidden"
                  />
                </div>
              </div>

              {/* Media Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {mediaLibrary.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-[#111118] border border-white/10 overflow-hidden flex flex-col justify-between group hover:border-brand-purple/40 transition-all shadow-lg"
                  >
                    {item.type === 'pdf' ? (
                      <div className="h-32 bg-red-950/20 flex flex-col items-center justify-center p-3 text-red-400">
                        <FileDown className="w-10 h-10 mb-1" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-red-300">PDF Brochure</span>
                      </div>
                    ) : (
                      <img src={item.url} alt={item.name} className="h-32 w-full object-cover bg-black/40" />
                    )}

                    <div className="p-3 border-t border-white/5 space-y-1">
                      <p className="text-xs font-semibold text-white truncate" title={item.name}>
                        {item.name}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-gray-500">
                        <span>{item.size || 'Attached'}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(item.url);
                              showToast('Asset link copied to clipboard!');
                            }}
                            className="text-gray-400 hover:text-white"
                            title="Copy link"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete "${item.name}" from library?`)) {
                                cmsStore.deleteMediaItem(item.id);
                                showToast('File deleted.');
                              }
                            }}
                            className="text-gray-500 hover:text-rose-400"
                            title="Delete file"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 7: LEADS & INQUIRIES TAB (Connected to Google Sheets & Email)
          ========================================================================= */}
          {viewMode === 'list' && activeTab === 'leads' && (
            <div className="space-y-6">
              {/* Live Integration Status Banner */}
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Attached Excel / Google Sheet Webhook & Email Active</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Target Email: <span className="text-emerald-300 font-semibold">{FORMS_CONFIG.notificationEmail}</span> • All site inquiries are auto-synchronized.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportLeadsCSV}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>📥 Export All to Excel / CSV</span>
                  </button>

                  {leads.length > 0 && (
                    <button
                      onClick={() => {
                        if (window.confirm('Clear all local leads history? (Google Sheet records will remain safe)')) {
                          cmsStore.clearAllLeads();
                          showToast('Local leads log cleared.');
                        }
                      }}
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-rose-500/10 text-gray-400 hover:text-rose-400 text-xs font-semibold transition-all"
                    >
                      Clear Log
                    </button>
                  )}
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={leadSearch}
                      onChange={(e) => setLeadSearch(e.target.value)}
                      placeholder="Search name, phone, email..."
                      className="pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/15 text-white placeholder-gray-500 text-xs w-64 focus:outline-none focus:border-brand-purple"
                    />
                  </div>

                  <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
                    {['all', 'brochure-download', 'consultation', 'general'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setLeadTypeFilter(type)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                          leadTypeFilter === type ? 'bg-white/20 text-white shadow' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {type.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <span className="text-xs text-gray-400">Total Leads: {filteredLeads.length}</span>
              </div>

              {/* Leads Table */}
              <div className="bg-[#101016] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                {filteredLeads.length === 0 ? (
                  <div className="py-16 text-center space-y-2">
                    <Users className="w-10 h-10 text-gray-600 mx-auto" />
                    <h4 className="text-sm font-bold text-gray-400">No Inquiries Found</h4>
                    <p className="text-xs text-gray-600">
                      When visitors download a brochure or request advisory, their records appear here instantly.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-white/5 border-b border-white/10 uppercase tracking-wider text-[11px] text-gray-400">
                        <tr>
                          <th className="py-3 px-4">Visitor Name</th>
                          <th className="py-3 px-4">Mobile & Email</th>
                          <th className="py-3 px-4">Project / Asset</th>
                          <th className="py-3 px-4">Type</th>
                          <th className="py-3 px-4">Date & Time</th>
                          <th className="py-3 px-4 text-right">Delete</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredLeads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-3.5 px-4 font-bold text-white">{lead.name}</td>
                            <td className="py-3.5 px-4">
                              <a
                                href={`tel:${lead.phone}`}
                                className="text-emerald-400 font-mono hover:underline block"
                              >
                                {lead.phone}
                              </a>
                              <a
                                href={`mailto:${lead.email}`}
                                className="text-gray-400 text-[11px] hover:text-white truncate block max-w-[200px]"
                              >
                                {lead.email}
                              </a>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="text-gray-300 font-semibold">{lead.projectName || 'General Inquiry'}</span>
                              {lead.brochureName && (
                                <span className="block text-[11px] text-red-300 truncate max-w-[220px]">
                                  📄 {lead.brochureName}
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-purple/20 text-brand-purpleLight border border-brand-purple/30">
                                {lead.type}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-gray-400 text-[11px] font-mono">
                              {new Date(lead.timestamp).toLocaleString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => {
                                  cmsStore.deleteLead(lead.id);
                                  showToast('Lead removed from local view.');
                                }}
                                className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/10"
                                title="Delete lead"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 8: GLOBAL SEO & 10 LSI DESK
          ========================================================================= */}
          {viewMode === 'list' && activeTab === 'seo' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#111118] border border-pink-500/20 space-y-5">
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-wider text-pink-400 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    <span>Real Estate SEO & 10 LSI Keyword Generator</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Generate 10 high-intent Latent Semantic Indexing keywords tailored to NCR luxury corridors, commercial yields, and plotted enclaves.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Seed Focus Keyword
                    </label>
                    <input
                      type="text"
                      value={globalSeedKeyword}
                      onChange={(e) => setGlobalSeedKeyword(e.target.value)}
                      placeholder="e.g. Godrej Meridien Sector 106 or DLF Privana"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">Property Sector</label>
                    <select
                      value={globalLsiCategory}
                      onChange={(e) => setGlobalLsiCategory(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#181822] border border-white/15 text-white text-xs focus:outline-none focus:border-pink-500"
                    >
                      <option value="residential">Residential Luxury</option>
                      <option value="commercial">Grade-A Commercial</option>
                      <option value="plots">Freehold Plots & Land</option>
                    </select>
                  </div>
                </div>

                {/* 10 LSI Generated Results */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      10 Generated LSI Keywords for "{globalSeedKeyword}"
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const lsiList = generateLSIKeywords(globalSeedKeyword, globalLsiCategory)
                          .map((l) => l.keyword)
                          .join('\n');
                        navigator.clipboard.writeText(lsiList);
                        showToast('All 10 LSI keywords copied to clipboard!');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy All 10 Keywords</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {generateLSIKeywords(globalSeedKeyword, globalLsiCategory).map((lsi, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-pink-500/40 transition-all flex items-center justify-between gap-3"
                      >
                        <div>
                          <p className="text-xs font-semibold text-white">{lsi.keyword}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-pink-500/20 text-pink-300">
                              {lsi.intent} Intent
                            </span>
                            <span className="text-[10px] text-gray-500 capitalize">{lsi.relevance} Relevance</span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(lsi.keyword);
                            showToast(`Copied: "${lsi.keyword}"`);
                          }}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white"
                          title="Copy keyword"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
