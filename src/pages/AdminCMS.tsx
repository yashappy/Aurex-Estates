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
  Unlock,
  Copy,
} from 'lucide-react';
import {
  cmsStore,
  type CMSProject,
  type PageContent,
  type MediaItem,
  type LeadSubmission,
} from '../services/cmsStore';
import type { BlogPost } from '../data/blogPosts';
import type { Page } from '../App';

interface AdminCMSProps {
  onNavigate: (page: Page) => void;
  onSelectProject?: (projectId: string) => void;
}

type CMSTab = 'projects' | 'posts' | 'pages' | 'media' | 'leads' | 'settings';

export const AdminCMS: React.FC<AdminCMSProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<CMSTab>('projects');
  const [projects, setProjects] = useState<CMSProject[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [pageContent, setPageContent] = useState<PageContent>(cmsStore.getPageContent());
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>([]);
  const [leads, setLeads] = useState<LeadSubmission[]>([]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  // Project Search & Filter
  const [projectSearch, setProjectSearch] = useState('');
  const [projectCatFilter, setProjectCatFilter] = useState<'all' | 'residential' | 'commercial' | 'plots'>('all');

  // Edit / Create Project Modal
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<CMSProject | null>(null);

  // Edit / Create Post Modal
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  // Hidden file inputs for uploads
  const imageUploadRef = useRef<HTMLInputElement>(null);
  const brochureUploadRef = useRef<HTMLInputElement>(null);
  const mediaLibraryUploadRef = useRef<HTMLInputElement>(null);
  const jsonImportRef = useRef<HTMLInputElement>(null);

  // Handle generic file reading to Base64
  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // ==================== PROJECT ACTIONS ====================
  const handleOpenNewProject = () => {
    setEditingProject({
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
      image: '/images/meridien/club-facade.png',
      brochureName: 'Official Brochure.pdf',
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
    });
    setIsProjectModalOpen(true);
  };

  const handleEditProject = (proj: CMSProject) => {
    setEditingProject({ ...proj });
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.name.trim()) {
      showToast('Project name is required.');
      return;
    }
    cmsStore.saveProject(editingProject);
    setIsProjectModalOpen(false);
    showToast(`Project "${editingProject.name}" saved successfully!`);
  };

  const handleDeleteProject = (proj: CMSProject) => {
    if (window.confirm(`Are you sure you want to delete "${proj.name}"? This action cannot be undone.`)) {
      cmsStore.deleteProject(proj.id);
      showToast(`Project "${proj.name}" deleted.`);
    }
  };

  const handleToggleBrochureGating = (proj: CMSProject) => {
    const updated = {
      ...proj,
      requireLeadForBrochure: !proj.requireLeadForBrochure,
    };
    cmsStore.saveProject(updated);
    showToast(`Brochure condition updated for ${proj.name}: ${updated.requireLeadForBrochure ? 'Requires User Details' : 'Open Download'}`);
  };

  // Upload Project Hero Image
  const handleProjectHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingProject) {
      try {
        const dataUrl = await readFileAsDataUrl(file);
        setEditingProject({ ...editingProject, image: dataUrl });
        cmsStore.addMediaItem({
          name: file.name,
          type: 'image',
          url: dataUrl,
          size: `${Math.round(file.size / 1024)} KB`,
        });
        showToast('Image uploaded successfully!');
      } catch {
        showToast('Failed to upload image.');
      }
    }
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
        showToast('PDF Brochure uploaded successfully!');
      } catch {
        showToast('Failed to upload PDF brochure.');
      }
    }
  };

  // ==================== BLOG POST ACTIONS ====================
  const handleOpenNewPost = () => {
    setEditingPost({
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
    });
    setIsPostModalOpen(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost({ ...post });
    setIsPostModalOpen(true);
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost || !editingPost.title.trim()) {
      showToast('Article title is required.');
      return;
    }
    cmsStore.saveBlogPost(editingPost);
    setIsPostModalOpen(false);
    showToast(`Article "${editingPost.title}" published!`);
  };

  const handleDeletePost = (post: BlogPost) => {
    if (window.confirm(`Delete article "${post.title}"?`)) {
      cmsStore.deleteBlogPost(post.id);
      showToast(`Article deleted.`);
    }
  };

  // ==================== PAGE CONTENT SAVE ====================
  const handleSavePageContent = (e: React.FormEvent) => {
    e.preventDefault();
    cmsStore.savePageContent(pageContent);
    showToast('Page content updated successfully!');
  };

  // ==================== MEDIA LIBRARY UPLOAD ====================
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
    const json = cmsStore.exportDatabaseJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Aurex_Site_CMS_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Database backup downloaded!');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const success = cmsStore.importDatabaseJSON(text);
        if (success) {
          showToast('Database restored successfully from backup!');
        } else {
          showToast('Invalid JSON backup file.');
        }
      };
      reader.readAsText(file);
    }
  };

  // Filtered projects
  const filteredProjects = projects.filter((p) => {
    if (projectCatFilter !== 'all' && p.category !== projectCatFilter) return false;
    if (projectSearch.trim() && !p.name.toLowerCase().includes(projectSearch.toLowerCase()) && !p.developer.toLowerCase().includes(projectSearch.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0F0F14] text-white pt-20 pb-24 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl bg-brand-purple text-white shadow-2xl border border-white/20 animate-fade-in">
          <Check className="w-5 h-5 text-white shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('home')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>View Live Site</span>
              </button>
              <span className="px-2.5 py-0.5 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-brand-purpleLight text-[11px] font-mono font-bold tracking-wider">
                AUREX CMS v2.0
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-2">
              Website Content Management System
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Add, edit, or delete any project, blog post, page text, media asset, or PDF brochure with instant live updates.
            </p>
          </div>

          {/* Quick Database Metrics & Export */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExportJSON}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all border border-white/10"
              title="Backup entire website data to JSON"
            >
              <Download className="w-4 h-4 text-purple-300" />
              <span>Export Backup (.JSON)</span>
            </button>

            <button
              onClick={() => jsonImportRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all border border-white/10"
              title="Restore website data from JSON"
            >
              <Upload className="w-4 h-4 text-emerald-400" />
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
        </div>

        {/* CMS Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto py-5 border-b border-white/10 scrollbar-none">
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'projects'
                ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/30'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Projects ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('posts')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'posts'
                ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/30'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Blog & Insights ({posts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pages')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'pages'
                ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/30'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Page Texts & Elements</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'media'
                ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/30'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Media & PDF Library ({mediaLibrary.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'leads'
                ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/30'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Leads & Downloads ({leads.length})</span>
          </button>
        </div>

        {/* =========================================================================
            TAB 1: PROJECTS MANAGEMENT
        ========================================================================= */}
        {activeTab === 'projects' && (
          <div className="pt-6 space-y-6">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    placeholder="Search projects or developer..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
                  {(['all', 'residential', 'commercial', 'plots'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setProjectCatFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                        projectCatFilter === cat ? 'bg-brand-purple text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleOpenNewProject}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purpleDark text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-brand-purple/30 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Project</span>
              </button>
            </div>

            {/* Projects Table */}
            <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 text-gray-400 font-semibold border-b border-white/10 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-5 py-3.5">Project</th>
                      <th className="px-4 py-3.5">Category / Segment</th>
                      <th className="px-4 py-3.5">Location</th>
                      <th className="px-4 py-3.5">Price Range</th>
                      <th className="px-4 py-3.5">Brochure Download Condition</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-200">
                    {filteredProjects.map((p) => (
                      <tr key={p.id} className="hover:bg-white/[0.03] transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-12 h-12 rounded-lg object-cover border border-white/15 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-white text-sm">{p.name}</div>
                              <div className="text-gray-400 text-xs">{p.developer}</div>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1 items-start">
                            <span className="capitalize font-medium text-purple-300">{p.category}</span>
                            <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-gray-300 font-semibold">
                              {p.segment}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-gray-300">
                          <div>{p.location}</div>
                          <div className="text-[11px] text-gray-500">{p.city}</div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="font-semibold text-emerald-400">{p.priceDisplay}</div>
                          <div className="text-[10px] text-gray-400">{p.sizeDisplay}</div>
                        </td>

                        {/* Brochure Gating Condition */}
                        <td className="px-4 py-4">
                          <div className="flex flex-col items-start gap-1">
                            <button
                              onClick={() => handleToggleBrochureGating(p)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                                p.requireLeadForBrochure
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                              }`}
                              title="Click to toggle condition"
                            >
                              {p.requireLeadForBrochure ? (
                                <>
                                  <Lock className="w-3 h-3" />
                                  <span>Details Required to Download</span>
                                </>
                              ) : (
                                <>
                                  <Unlock className="w-3 h-3" />
                                  <span>Open Download</span>
                                </>
                              )}
                            </button>
                            {p.brochureUrl && (
                              <span className="text-[10px] text-gray-400 truncate max-w-xs">
                                {p.brochureName || 'PDF attached'}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => handleEditProject(p)}
                              className="p-2 rounded-lg bg-white/10 hover:bg-brand-purple text-white transition-colors"
                              title="Edit Project"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteProject(p)}
                              className="p-2 rounded-lg bg-white/10 hover:bg-red-600/80 text-white transition-colors"
                              title="Delete Project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: BLOG POSTS MANAGEMENT
        ========================================================================= */}
        {activeTab === 'posts' && (
          <div className="pt-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Articles & Market Intelligence</h2>
              <button
                onClick={handleOpenNewPost}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purpleDark text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-brand-purple/30 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Write New Article</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between p-5 hover:border-white/20 transition-all"
                >
                  <div>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-40 object-cover rounded-xl border border-white/10 mb-4"
                    />
                    <div className="flex items-center justify-between text-xs text-brand-purpleLight font-semibold mb-2">
                      <span>{post.category}</span>
                      <span className="text-gray-400">{post.readTime}</span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-gray-400">{post.date}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditPost(post)}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-brand-purple text-xs font-semibold transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePost(post)}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-red-600/80 text-xs transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: PAGE CONTENT & TEXTS EDITOR
        ========================================================================= */}
        {activeTab === 'pages' && (
          <form onSubmit={handleSavePageContent} className="pt-6 space-y-8 max-w-4xl">
            {/* Home Page Section */}
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6 space-y-5">
              <div className="flex items-center gap-2 text-brand-purpleLight text-sm font-bold uppercase tracking-wider">
                <Edit3 className="w-4 h-4" />
                <span>Home Page Main Content</span>
              </div>

              <div className="grid grid-cols-1 gap-4 text-xs">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Hero Eyebrow Tag</label>
                  <input
                    type="text"
                    value={pageContent.home.heroTag}
                    onChange={(e) =>
                      setPageContent({
                        ...pageContent,
                        home: { ...pageContent.home, heroTag: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Hero Title</label>
                  <input
                    type="text"
                    value={pageContent.home.heroTitle}
                    onChange={(e) =>
                      setPageContent({
                        ...pageContent,
                        home: { ...pageContent.home, heroTitle: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Hero Subtitle</label>
                  <textarea
                    rows={3}
                    value={pageContent.home.heroSubtitle}
                    onChange={(e) =>
                      setPageContent({
                        ...pageContent,
                        home: { ...pageContent.home, heroSubtitle: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Advisory Process Heading</label>
                  <input
                    type="text"
                    value={pageContent.home.advisoryHeading}
                    onChange={(e) =>
                      setPageContent({
                        ...pageContent,
                        home: { ...pageContent.home, advisoryHeading: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-brand-purple"
                  />
                </div>
              </div>
            </div>

            {/* About Page Section */}
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6 space-y-5">
              <div className="flex items-center gap-2 text-brand-purpleLight text-sm font-bold uppercase tracking-wider">
                <Edit3 className="w-4 h-4" />
                <span>About Us Page Content</span>
              </div>

              <div className="grid grid-cols-1 gap-4 text-xs">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">About Hero Title</label>
                  <input
                    type="text"
                    value={pageContent.about.heroTitle}
                    onChange={(e) =>
                      setPageContent({
                        ...pageContent,
                        about: { ...pageContent.about, heroTitle: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Mission Statement</label>
                  <textarea
                    rows={3}
                    value={pageContent.about.missionText}
                    onChange={(e) =>
                      setPageContent({
                        ...pageContent,
                        about: { ...pageContent.about, missionText: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Vision Statement</label>
                  <textarea
                    rows={3}
                    value={pageContent.about.visionText}
                    onChange={(e) =>
                      setPageContent({
                        ...pageContent,
                        about: { ...pageContent.about, visionText: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-brand-purple"
                  />
                </div>
              </div>
            </div>

            {/* Corporate Coordinates */}
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6 space-y-5">
              <div className="flex items-center gap-2 text-brand-purpleLight text-sm font-bold uppercase tracking-wider">
                <Edit3 className="w-4 h-4" />
                <span>Corporate Coordinates & Contact</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Direct Phone</label>
                  <input
                    type="text"
                    value={pageContent.contact.phone}
                    onChange={(e) =>
                      setPageContent({
                        ...pageContent,
                        contact: { ...pageContent.contact, phone: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Direct Email</label>
                  <input
                    type="text"
                    value={pageContent.contact.email}
                    onChange={(e) =>
                      setPageContent({
                        ...pageContent,
                        contact: { ...pageContent.contact, email: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-gray-300 font-semibold mb-1">Office Address</label>
                  <input
                    type="text"
                    value={pageContent.contact.address}
                    onChange={(e) =>
                      setPageContent({
                        ...pageContent,
                        contact: { ...pageContent.contact, address: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-brand-purple"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-brand-purple hover:bg-brand-purpleDark text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-brand-purple/40 transition-all active:scale-95"
            >
              Save All Page Content Changes
            </button>
          </form>
        )}

        {/* =========================================================================
            TAB 4: MEDIA & PDF LIBRARY
        ========================================================================= */}
        {activeTab === 'media' && (
          <div className="pt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Media & PDF Brochure Library</h2>
                <p className="text-xs text-gray-400">Upload and manage image assets and brochure PDFs.</p>
              </div>

              <button
                onClick={() => mediaLibraryUploadRef.current?.click()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purpleDark text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-brand-purple/30 transition-all"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Asset (Image / PDF)</span>
              </button>
              <input
                type="file"
                ref={mediaLibraryUploadRef}
                onChange={handleGeneralMediaUpload}
                accept="image/*,application/pdf"
                className="hidden"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {mediaLibrary.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/5 rounded-xl border border-white/10 p-3 flex flex-col justify-between group hover:border-white/20 transition-all"
                >
                  <div>
                    {item.type === 'image' ? (
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-32 object-cover rounded-lg border border-white/10 mb-2.5"
                      />
                    ) : (
                      <div className="w-full h-32 rounded-lg bg-red-950/30 border border-red-500/20 flex flex-col items-center justify-center text-red-400 mb-2.5">
                        <FileDown className="w-10 h-10 mb-1" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">PDF Brochure</span>
                      </div>
                    )}
                    <div className="font-semibold text-white text-xs truncate" title={item.name}>
                      {item.name}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      {item.size || 'Standard'} • {item.uploadedAt}
                    </div>
                  </div>

                  <div className="pt-2.5 mt-2 border-t border-white/10 flex items-center justify-between">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(item.url);
                        showToast('Asset link copied to clipboard!');
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-purpleLight hover:underline"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy URL</span>
                    </button>

                    <button
                      onClick={() => {
                        cmsStore.deleteMediaItem(item.id);
                        showToast('Asset removed from library.');
                      }}
                      className="p-1 rounded text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: LEADS & BROCHURE DOWNLOAD LOG
        ========================================================================= */}
        {activeTab === 'leads' && (
          <div className="pt-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white">Visitor Leads & Download Activity</h2>
                <p className="text-xs text-gray-400">
                  Real-time log of visitors who gave details before downloading official brochures or enquiring.
                </p>
              </div>

              <button
                onClick={handleExportLeadsCSV}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Export to CSV ({leads.length})</span>
              </button>
            </div>

            {leads.length === 0 ? (
              <div className="bg-white/5 rounded-2xl border border-white/10 p-12 text-center">
                <Users className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-white">No Leads Recorded Yet</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                  When visitors unlock floor plans or download official PDF brochures, their verified phone, name, and email will appear here in real time.
                </p>
              </div>
            ) : (
              <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 text-gray-400 font-semibold border-b border-white/10 uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="px-5 py-3.5">Visitor Name</th>
                        <th className="px-4 py-3.5">Contact Phone</th>
                        <th className="px-4 py-3.5">Email Address</th>
                        <th className="px-4 py-3.5">Project / Brochure</th>
                        <th className="px-4 py-3.5">Date & Time</th>
                        <th className="px-4 py-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-gray-200">
                      {leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-white/[0.03] transition-colors">
                          <td className="px-5 py-3.5 font-bold text-white">{lead.name}</td>
                          <td className="px-4 py-3.5">
                            <a
                              href={`tel:${lead.phone}`}
                              className="text-emerald-400 hover:underline font-mono font-medium"
                            >
                              {lead.phone}
                            </a>
                          </td>
                          <td className="px-4 py-3.5">
                            <a
                              href={`mailto:${lead.email}`}
                              className="text-purple-300 hover:underline"
                            >
                              {lead.email}
                            </a>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="font-semibold text-white">{lead.projectName || 'General Enquiry'}</span>
                            {lead.brochureName && (
                              <div className="text-[10px] text-gray-400">{lead.brochureName}</div>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-gray-400 text-[11px] font-mono">
                            {lead.timestamp}
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <button
                              onClick={() => {
                                cmsStore.deleteLead(lead.id);
                                showToast('Lead record removed.');
                              }}
                              className="p-1.5 rounded-lg bg-white/10 hover:bg-red-600/80 text-white transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* =========================================================================
          MODAL: ADD / EDIT PROJECT
      ========================================================================= */}
      {isProjectModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#181820] border border-white/15 rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto scrollbar-thin shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingProject.id.startsWith('project-') ? 'Add New Project' : `Edit: ${editingProject.name}`}
              </h2>
              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="p-2 text-gray-400 hover:text-white rounded-lg bg-white/5"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-gray-300 font-semibold mb-1">Project Name *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.name}
                    onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Category</label>
                  <select
                    value={editingProject.category}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        category: e.target.value as 'residential' | 'commercial' | 'plots',
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-brand-purple"
                  >
                    <option value="residential" className="bg-[#181820]">Residential</option>
                    <option value="commercial" className="bg-[#181820]">Commercial</option>
                    <option value="plots" className="bg-[#181820]">Plots & Land</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Segment</label>
                  <select
                    value={editingProject.segment}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        segment: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-brand-purple"
                  >
                    <option value="Affordable" className="bg-[#181820]">Affordable (Within 1.5 Cr)</option>
                    <option value="Luxury" className="bg-[#181820]">Luxury (1.5 Cr - 6 Cr)</option>
                    <option value="Super Luxury" className="bg-[#181820]">Super Luxury (6 Cr - 15 Cr)</option>
                    <option value="Ultra Luxury" className="bg-[#181820]">Ultra Luxury (Above 15 Cr)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Developer</label>
                  <input
                    type="text"
                    value={editingProject.developer}
                    onChange={(e) => setEditingProject({ ...editingProject, developer: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Location & Sector</label>
                  <input
                    type="text"
                    value={editingProject.location}
                    onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Price Display (e.g. ₹2.85 Cr - ₹5.60 Cr)</label>
                  <input
                    type="text"
                    value={editingProject.priceDisplay}
                    onChange={(e) => setEditingProject({ ...editingProject, priceDisplay: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Launch Year (e.g. 2018 or 2024)</label>
                  <input
                    type="text"
                    value={editingProject.launchYear || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, launchYear: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Project Area (e.g. 14.5 Acres)</label>
                  <input
                    type="text"
                    value={editingProject.projectArea || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, projectArea: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Possession Year (e.g. 2032 or Ready)</label>
                  <input
                    type="text"
                    value={editingProject.completionYear || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, completionYear: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-brand-purple"
                  />
                </div>
              </div>

              {/* Uploads Section */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <h3 className="font-bold text-white text-xs uppercase tracking-wider text-brand-purpleLight">
                  Media & Official PDF Brochure Upload
                </h3>

                {/* Hero Image */}
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Project Hero Thumbnail Image</label>
                  <div className="flex items-center gap-3">
                    <img
                      src={editingProject.image}
                      alt="Preview"
                      className="w-14 h-14 rounded-lg object-cover border border-white/15"
                    />
                    <button
                      type="button"
                      onClick={() => imageUploadRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload New Image</span>
                    </button>
                    <input
                      type="file"
                      ref={imageUploadRef}
                      onChange={handleProjectHeroUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>

                {/* PDF Brochure Upload */}
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Official Brochure (PDF File)</label>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => brochureUploadRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/40 border border-red-500/30 hover:bg-red-950/60 text-red-300 font-semibold"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>Upload PDF Brochure</span>
                    </button>
                    <input
                      type="file"
                      ref={brochureUploadRef}
                      onChange={handleProjectBrochureUpload}
                      accept="application/pdf"
                      className="hidden"
                    />

                    {editingProject.brochureUrl && (
                      <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Attached: {editingProject.brochureName || 'Brochure.pdf'}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Condition: Give details then download start */}
                <div className="pt-2 border-t border-white/10">
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
                      className="w-4 h-4 mt-0.5 text-brand-purple rounded border-gray-600 focus:ring-brand-purple"
                    />
                    <div>
                      <span className="font-bold text-white text-xs block">
                        Require visitor contact details before PDF download starts
                      </span>
                      <span className="text-gray-400 text-[11px]">
                        When checked, clicking "Download Brochure" prompts the visitor for their Name, 10-digit Phone, and Email. The lead is recorded and the download begins immediately.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Description & Details */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purpleDark text-white font-bold shadow-lg shadow-brand-purple/40"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD / EDIT BLOG POST
      ========================================================================= */}
      {isPostModalOpen && editingPost && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#181820] border border-white/15 rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto scrollbar-thin shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingPost.id.startsWith('post-') ? 'Create New Article' : `Edit Article`}
              </h2>
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="p-2 text-gray-400 hover:text-white rounded-lg bg-white/5"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePost} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Category</label>
                  <select
                    value={editingPost.category}
                    onChange={(e) =>
                      setEditingPost({
                        ...editingPost,
                        category: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-brand-purple"
                  >
                    <option value="Market Intelligence" className="bg-[#181820]">Market Intelligence</option>
                    <option value="Investment Advisory" className="bg-[#181820]">Investment Advisory</option>
                    <option value="Luxury Living" className="bg-[#181820]">Luxury Living</option>
                    <option value="Micro-Market Analysis" className="bg-[#181820]">Micro-Market Analysis</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Read Time (e.g. 6 min read)</label>
                  <input
                    type="text"
                    value={editingPost.readTime}
                    onChange={(e) => setEditingPost({ ...editingPost, readTime: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-brand-purple"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Excerpt / Summary</label>
                <textarea
                  rows={2}
                  value={editingPost.excerpt}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Article Paragraphs (one per block)</label>
                <textarea
                  rows={6}
                  value={editingPost.content.join('\n\n')}
                  onChange={(e) =>
                    setEditingPost({
                      ...editingPost,
                      content: e.target.value.split('\n\n').filter(Boolean),
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-brand-purple"
                  placeholder="Separate paragraphs with a blank line"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purpleDark text-white font-bold shadow-lg shadow-brand-purple/40"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
