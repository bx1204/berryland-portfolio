
import React, { useState, useEffect, useRef } from 'react';
import { Category, Project, ProjectFormData } from './types';
import { INITIAL_PROJECTS } from './constants';

const STORAGE_KEY = 'berryland_projects_v2';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [view, setView] = useState<'portfolio' | 'admin'>('portfolio');
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Form State for dynamic image lists
  const [hoverImage, setHoverImage] = useState<string>('');
  const [detailImages, setDetailImages] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setProjects(JSON.parse(stored));
    } else {
      setProjects(INITIAL_PROJECTS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROJECTS));
    }
  }, []);

  const saveProjects = (updated: Project[]) => {
    setProjects(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      alert("Storage limit reached (Images are stored as Base64). Please use smaller images or fewer projects.");
    }
  };

  const handleFileRead = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  const handleAddProject = (data: ProjectFormData) => {
    const newProject: Project = {
      ...data,
      id: Date.now().toString(),
      date: new Date().getFullYear().toString(),
    };
    saveProjects([newProject, ...projects]);
    closeForm();
  };

  const handleEditProject = (data: ProjectFormData) => {
    if (!editingProject) return;
    const updated = projects.map(p => p.id === editingProject.id ? { ...p, ...data } : p);
    saveProjects(updated);
    closeForm();
  };

  const closeForm = () => {
    setEditingProject(null);
    setIsFormOpen(false);
    setHoverImage('');
    setDetailImages([]);
  };

  const openEdit = (p: Project) => {
    setEditingProject(p);
    setHoverImage(p.hoverImageUrl);
    setDetailImages(p.detailImageUrls);
    setIsFormOpen(true);
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      const updated = projects.filter(p => p.id !== id);
      saveProjects(updated);
    }
  };

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button 
            onClick={() => { setView('portfolio'); setFilter('all'); setSelectedProject(null); }}
            className="text-2xl font-bold tracking-tighter hover:opacity-70 transition-opacity"
          >
            BERRYLAND
          </button>
          
          <div className="flex items-center gap-8 text-xs font-medium uppercase tracking-widest">
            {view === 'portfolio' ? (
              <>
                <button onClick={() => setFilter('all')} className={filter === 'all' ? 'underline decoration-2 underline-offset-4' : 'hover:opacity-50'}>All</button>
                <button onClick={() => setFilter(Category.WEAVING)} className={filter === Category.WEAVING ? 'underline decoration-2 underline-offset-4' : 'hover:opacity-50'}>Weaving</button>
                <button onClick={() => setFilter(Category.LANDSCAPE)} className={filter === Category.LANDSCAPE ? 'underline decoration-2 underline-offset-4' : 'hover:opacity-50'}>Landscape</button>
                <button onClick={() => setFilter(Category.MODELING)} className={filter === Category.MODELING ? 'underline decoration-2 underline-offset-4' : 'hover:opacity-50'}>Modeling</button>
                <button onClick={() => setView('admin')} className="ml-4 px-3 py-1 bg-black text-white rounded-sm hover:bg-gray-800 transition-colors">Admin</button>
              </>
            ) : (
              <button onClick={() => setView('portfolio')} className="hover:opacity-50">Back to Portfolio</button>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {view === 'portfolio' ? (
          selectedProject ? (
            <div className="animate-in fade-in duration-500">
              <button 
                onClick={() => setSelectedProject(null)}
                className="mb-8 text-xs uppercase tracking-widest flex items-center gap-2 hover:opacity-50 font-bold"
              >
                ← Back
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="space-y-8">
                  {selectedProject.detailImageUrls.map((url, i) => (
                    <img key={i} src={url} alt={`${selectedProject.title}-${i}`} className="w-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                  ))}
                </div>
                <div className="md:sticky md:top-32 h-fit">
                  <span className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">{selectedProject.category}</span>
                  <h1 className="text-6xl font-bold mb-4 tracking-tighter">{selectedProject.title}</h1>
                  <p className="text-xl text-gray-500 mb-8 font-light italic leading-relaxed">{selectedProject.subtitle}</p>
                  <p className="leading-loose text-gray-700 whitespace-pre-wrap text-sm">{selectedProject.description}</p>
                  
                  <div className="mt-16 pt-8 border-t border-gray-100 grid grid-cols-2 text-xs uppercase tracking-widest gap-8">
                    <div>
                      <p className="text-gray-400 mb-2">Year</p>
                      <p className="font-bold">{selectedProject.date}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-2">Location</p>
                      <p className="font-bold">{selectedProject.location || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <div 
                  key={project.id} 
                  className="group cursor-pointer relative aspect-square border border-black/5 hover:border-black/20 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
                  onClick={() => setSelectedProject(project)}
                >
                  {/* Glowing Border Overlay */}
                  <div className="absolute inset-0 border-[8px] border-white/40 pointer-events-none z-10 transition-opacity duration-500 opacity-0 group-hover:opacity-100"></div>
                  
                  {/* Layer 1: White/Default state */}
                  <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-8 transition-transform duration-700 group-hover:translate-y-full">
                    <h3 className="text-sm font-black tracking-[0.2em] uppercase text-center mb-2">{project.title}</h3>
                    <div className="w-8 h-[1px] bg-black/20"></div>
                  </div>

                  {/* Layer 2: Hover image state */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <img 
                      src={project.hoverImageUrl} 
                      alt={project.title} 
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                    />
                    <div className="absolute bottom-6 left-6 z-20">
                       <p className="text-[10px] text-white bg-black px-2 py-1 uppercase tracking-widest font-bold">
                        {project.category}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {filteredProjects.length === 0 && (
                <div className="col-span-full py-20 text-center text-gray-400 uppercase tracking-widest text-xs">
                  No projects found in this category.
                </div>
              )}
            </div>
          )
        ) : (
          /* Admin View */
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end mb-12 border-b-2 border-black pb-6">
              <div>
                <h1 className="text-4xl font-black tracking-tighter uppercase">Studio Admin</h1>
                <p className="text-xs text-gray-400 uppercase tracking-widest mt-2">Manage your works and visual stories</p>
              </div>
              <button 
                onClick={() => { setEditingProject(null); setIsFormOpen(true); }}
                className="px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-all shadow-lg active:scale-95"
              >
                + New Project
              </button>
            </div>

            <div className="grid gap-6">
              {projects.map(p => (
                <div key={p.id} className="group flex items-center bg-gray-50 p-6 border border-transparent hover:border-black/10 hover:bg-white transition-all">
                  <div className="flex gap-2">
                    <img src={p.hoverImageUrl} className="w-24 h-24 object-cover border border-gray-200" alt="Hover" />
                    <div className="w-24 h-24 bg-gray-200 flex items-center justify-center text-[10px] uppercase text-gray-400 font-bold border border-gray-200">
                      +{p.detailImageUrls.length}
                    </div>
                  </div>
                  <div className="ml-8 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-black text-lg uppercase tracking-tight">{p.title}</h3>
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-black text-white">{p.category}</span>
                    </div>
                    <p className="text-xs text-gray-500 italic mt-1">{p.subtitle}</p>
                    <p className="text-[10px] text-gray-400 uppercase mt-2 tracking-widest">{p.date} • {p.location || 'No Location'}</p>
                  </div>
                  <div className="flex gap-6">
                    <button onClick={() => openEdit(p)} className="text-[10px] font-black uppercase tracking-widest border-b-2 border-black hover:opacity-50">Edit Project</button>
                    <button onClick={() => handleDeleteProject(p.id)} className="text-[10px] font-black uppercase tracking-widest text-red-500 border-b-2 border-red-500 hover:opacity-50">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Admin Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center p-6 md:p-12 overflow-y-auto">
          <div className="w-full max-w-4xl bg-white border border-black/5 p-8 md:p-12 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-4xl font-black tracking-tighter uppercase">{editingProject ? 'Edit Entry' : 'New Entry'}</h2>
              <button onClick={closeForm} className="text-4xl hover:opacity-50 leading-none">&times;</button>
            </div>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const data: ProjectFormData = {
                title: formData.get('title') as string,
                subtitle: formData.get('subtitle') as string,
                description: formData.get('description') as string,
                category: formData.get('category') as Category,
                hoverImageUrl: hoverImage,
                detailImageUrls: detailImages,
                location: formData.get('location') as string,
              };
              editingProject ? handleEditProject(data) : handleAddProject(data);
            }} className="grid grid-cols-1 md:grid-cols-2 gap-12">
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Project Title</label>
                  <input required name="title" defaultValue={editingProject?.title} className="w-full border-b-2 border-gray-100 focus:border-black outline-none py-3 transition-colors uppercase font-black text-lg" placeholder="Untitled Project" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Short Subtitle</label>
                  <input required name="subtitle" defaultValue={editingProject?.subtitle} className="w-full border-b-2 border-gray-100 focus:border-black outline-none py-3 transition-colors italic" placeholder="The essence of the work..." />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Category</label>
                    <select name="category" defaultValue={editingProject?.category} className="w-full border-b-2 border-gray-100 focus:border-black outline-none py-3 bg-transparent uppercase text-xs font-bold tracking-widest">
                      <option value={Category.WEAVING}>Weaving</option>
                      <option value={Category.LANDSCAPE}>Landscape</option>
                      <option value={Category.MODELING}>Modeling</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Location</label>
                    <input name="location" defaultValue={editingProject?.location} className="w-full border-b-2 border-gray-100 focus:border-black outline-none py-3 transition-colors text-xs font-bold uppercase tracking-widest" placeholder="Global" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Project Story</label>
                  <textarea required name="description" rows={8} defaultValue={editingProject?.description} className="w-full border border-gray-100 focus:border-black outline-none p-4 transition-colors text-sm leading-relaxed" placeholder="Describe the concept, materials, and process..." />
                </div>
              </div>

              <div className="space-y-8">
                {/* Hover Image Upload */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Cover Image (Hover State)</label>
                  <div className="relative aspect-square bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer group hover:bg-gray-100 transition-colors">
                    {hoverImage ? (
                      <img src={hoverImage} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Upload Cover</span>
                    )}
                    <input 
                      type="file" 
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const base64 = await handleFileRead(file);
                          setHoverImage(base64);
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Detail Images Upload */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Detail Gallery (Multiple Images)</label>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {detailImages.map((img, idx) => (
                      <div key={idx} className="relative aspect-square border border-gray-100 overflow-hidden group">
                        <img src={img} className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => setDetailImages(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center font-bold text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                    <div className="aspect-square bg-gray-100 flex items-center justify-center cursor-pointer relative hover:bg-gray-200 transition-colors">
                      <span className="text-xl">+</span>
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={async (e) => {
                          // Fixed: Cast the result of Array.from to File[] to avoid unknown type error
                          const files = Array.from(e.target.files || []) as File[];
                          const readers = files.map(f => handleFileRead(f));
                          const results = await Promise.all(readers);
                          setDetailImages(prev => [...prev, ...results]);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button type="submit" className="w-full py-5 bg-black text-white text-xs uppercase tracking-[0.3em] font-black hover:bg-gray-800 transition-all shadow-2xl active:scale-[0.98]">
                    {editingProject ? 'Apply Project Changes' : 'Publish to Portfolio'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto py-20 border-t border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] uppercase tracking-[0.2em] font-black text-gray-300">
          <div className="text-black">© {new Date().getFullYear()} BERRYLAND STUDIO</div>
          <div className="flex gap-12">
            <a href="#" className="hover:text-black transition-colors">Instagram</a>
            <a href="#" className="hover:text-black transition-colors">Archive</a>
            <a href="#" className="hover:text-black transition-colors">Connect</a>
          </div>
          <div className="italic">Exploring the boundaries between art & architecture</div>
        </div>
      </footer>
    </div>
  );
};

export default App;
