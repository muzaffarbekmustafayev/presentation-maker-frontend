import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, Loader2, ChevronLeft, ChevronRight, Download, Share2, 
  Moon, Sun, Plus, Trash2, Copy, Type, Palette, Layout, AlignLeft, 
  AlignCenter, AlignRight, Image, Square, Circle, Minus, StickyNote, 
  Play, GripVertical, Presentation, Move, AlertTriangle, Layers, Maximize, 
  Settings, Sparkles, CheckCircle2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Draggable from 'react-draggable';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import api from '../api/axios';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  componentDidCatch(error, errorInfo) { console.error("Draggable Error:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <span className="text-sm font-medium">Element loading error. Please refresh.</span>
        </div>
      );
    }
    return this.props.children;
  }
}

const DESIGN_PATTERNS = {
  none: '',
  dots: 'radial-gradient(#ffffff33 1px, transparent 1px)',
  grid: 'linear-gradient(#ffffff11 1px, transparent 1px), linear-gradient(90deg, #ffffff11 1px, transparent 1px)',
  diagonal: 'repeating-linear-gradient(45deg, #ffffff0a, #ffffff0a 10px, transparent 10px, transparent 20px)',
  waves: 'radial-gradient(circle at 100% 50%, transparent 20%, #ffffff11 21%, #ffffff11 34%, transparent 35%, transparent), radial-gradient(circle at 0% 50%, transparent 20%, #ffffff11 21%, #ffffff11 34%, transparent 35%, transparent)'
};

const TEMPLATE_COLORS = {
  Business: { gradient: 'from-blue-600 to-blue-800', name: 'Business', defaultText: '#ffffff', accent: 'indigo' },
  Minimal: { gradient: 'from-slate-100 to-slate-200', name: 'Minimal', defaultText: '#1e293b', isLight: true, accent: 'slate' },
  Technology: { gradient: 'from-cyan-900 to-blue-900', name: 'Technology', defaultText: '#ffffff', accent: 'cyan' },
  Education: { gradient: 'from-emerald-50 to-teal-100', name: 'Education', defaultText: '#064e3b', isLight: true, accent: 'emerald' },
  Startup: { gradient: 'from-orange-500 to-pink-600', name: 'Startup', defaultText: '#ffffff', accent: 'orange' },
  Creative: { gradient: 'from-purple-600 to-pink-600', name: 'Creative', defaultText: '#ffffff', accent: 'purple' },
  Dark: { gradient: 'from-gray-900 to-black', name: 'Dark', defaultText: '#ffffff', accent: 'gray' },
  Corporate: { gradient: 'from-indigo-900 to-blue-900', name: 'Corporate', defaultText: '#ffffff', accent: 'indigo' },
  Clean: { gradient: 'from-white to-slate-50', name: 'Clean', defaultText: '#0f172a', isLight: true, accent: 'blue' },
};

const TRANSITIONS = {
  none: { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 } },
  fade: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.5 } },
  slide: { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '-100%' }, transition: { type: 'spring', damping: 25, stiffness: 200 } },
  zoom: { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 1.2, opacity: 0 }, transition: { duration: 0.4 } },
};

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [presentation, setPresentation] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [showShapes, setShowShapes] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [presentMode, setPresentMode] = useState(false);
  const [leftWidth, setLeftWidth] = useState(210);
  const [rightWidth, setRightWidth] = useState(288);
  const [showLayouts, setShowLayouts] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [generatingAIImage, setGeneratingAIImage] = useState(false);

  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const shapesRefs = useRef([]);
  const imagesRefs = useRef([]);
  const textBoxesRefs = useRef([]);

  useEffect(() => {
    api.get(`/presentations/${id}`)
      .then(res => setPresentation(res.data))
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      if (presentMode) {
        if (e.key === 'Escape') exitPresentation();
        if (e.key === 'ArrowLeft') setCurrentSlide(i => Math.max(0, i - 1));
        if (e.key === 'ArrowRight' || e.key === ' ') setCurrentSlide(i => Math.min((presentation?.slides.length || 1) - 1, i + 1));
      } else {
        if (e.key === 'ArrowLeft') setCurrentSlide(i => Math.max(0, i - 1));
        if (e.key === 'ArrowRight') setCurrentSlide(i => Math.min((presentation?.slides.length || 1) - 1, i + 1));
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [presentation, presentMode]);

  const handleSave = async () => {
    if (!presentation || saving) return;
    setSaving(true);
    try {
      await api.put(`/presentations/${id}`, presentation);
    } catch (err) {
      alert('Save failed');
    }
    setSaving(false);
  };

  const handleExport = async () => {
    try {
      const res = await api.get(`/presentations/${id}/export/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${presentation.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Export failed');
    }
  };

  const handleExportPPTX = async () => {
    try {
      const res = await api.get(`/presentations/${id}/export/pptx`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${presentation.title}.pptx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Export failed');
    }
  };

  const handleShare = async () => {
    try {
      const res = await api.post(`/presentations/${id}/share`);
      const link = `${window.location.origin}/share/${res.data.shareId}`;
      navigator.clipboard.writeText(link);
      alert('Share link copied!');
    } catch (err) {
      alert('Share failed');
    }
  };

  const addSlide = () => {
    const activeTheme = TEMPLATE_COLORS[presentation.template] || TEMPLATE_COLORS.Business;
    const newSlide = {
      _id: `temp-${Date.now()}`,
      title: 'New Slide',
      content: ['Add content here'],
      layout: 'title-content',
      theme: presentation.template,
      textColor: activeTheme.defaultText,
      titleSize: '3xl',
      textAlign: 'left',
      backgroundMode: 'gradient',
      pattern: 'none'
    };
    setPresentation({ ...presentation, slides: [...presentation.slides, newSlide] });
    setCurrentSlide(presentation.slides.length);
  };

  const removeSlide = (index) => {
    if (presentation.slides.length === 1) return;
    const newSlides = presentation.slides.filter((_, i) => i !== index);
    setPresentation({ ...presentation, slides: newSlides });
    if (currentSlide >= newSlides.length) setCurrentSlide(newSlides.length - 1);
  };

  const duplicateSlide = (index) => {
    const newSlides = [...presentation.slides];
    const original = presentation.slides[index];
    newSlides.splice(index + 1, 0, { ...original, _id: `temp-${Date.now()}` });
    setPresentation({ ...presentation, slides: newSlides });
  };

  const updateSlide = (field, value) => {
    const newSlides = [...presentation.slides];
    newSlides[currentSlide] = { ...newSlides[currentSlide], [field]: value };
    setPresentation({ ...presentation, slides: newSlides });
  };

  const applyThemeToAll = () => {
    const newSlides = presentation.slides.map(s => ({ 
      ...s, 
      theme: slide.theme, 
      textColor: slide.textColor, 
      backgroundMode: slide.backgroundMode,
      pattern: slide.pattern,
      backgroundColor: slide.backgroundColor
    }));
    setPresentation({ ...presentation, template: slide.theme, slides: newSlides });
  };

  const handleReorderSlides = (newSlides) => {

    const currentSlideObj = presentation.slides[currentSlide];
    setPresentation({ ...presentation, slides: newSlides });
    const newIndex = newSlides.findIndex(s => (s._id || s.tempId) === (currentSlideObj._id || currentSlideObj.tempId));
    if (newIndex !== -1) setCurrentSlide(newIndex);
  };

  const updateBullet = (index, value) => {
    const newContent = [...(presentation.slides[currentSlide].content || [])];
    newContent[index] = value;
    updateSlide('content', newContent);
  };

  const addBullet = () => {
    const newContent = [...(presentation.slides[currentSlide].content || []), 'New point'];
    updateSlide('content', newContent);
  };

  const removeBullet = (index) => {
    const newContent = presentation.slides[currentSlide].content.filter((_, i) => i !== index);
    updateSlide('content', newContent);
  };

  const addShape = (type) => {
    const shapes = slide.shapes || [];
    const activeTheme = TEMPLATE_COLORS[slide.theme || presentation.template] || TEMPLATE_COLORS.Business;
    const newShape = {
      type,
      x: 100,
      y: 100,
      width: type === 'line' ? 200 : 100,
      height: type === 'line' ? 2 : 100,
      color: slide.textColor || activeTheme.defaultText,
      opacity: 0.8
    };
    updateSlide('shapes', [...shapes, newShape]);
    setShowShapes(false);
  };

  const updateShapePosition = (index, x, y) => {
    const shapes = [...(slide.shapes || [])];
    shapes[index] = { ...shapes[index], x, y };
    updateSlide('shapes', shapes);
  };

  const removeShape = (index) => {
    const shapes = slide.shapes.filter((_, i) => i !== index);
    updateSlide('shapes', shapes);
  };

  const addImage = () => {
    const url = prompt('Enter image URL:');
    if (!url) return;
    const images = slide.images || [];
    updateSlide('images', [...images, { url, x: 100, y: 100, width: 200, height: 150 }]);
  };

  const generateAIImage = async () => {
    const promptValue = prompt('Describe the image you want to generate:', slide.imagePrompt || '');
    if (!promptValue) return;

    
    setGeneratingAIImage(true);
    try {
      const res = await api.post('/presentations/generate-image', { prompt: promptValue });
      const images = slide.images || [];
      updateSlide('images', [...images, { url: res.data.imageUrl, x: 100, y: 100, width: 300, height: 200 }]);
    } catch (err) {
      alert('AI Image generation failed. Using fallback search.');
      try {
           const res = await api.post('/presentations/generate-image', { prompt: promptValue }); // It has fallback on backend
           const images = slide.images || [];
           updateSlide('images', [...images, { url: res.data.imageUrl, x: 100, y: 100, width: 300, height: 200 }]);
      } catch (e) {
          alert('Failed to get alternative image.');
      }
    } finally {
      setGeneratingAIImage(false);
    }
  };

  const updateImagePosition = (index, x, y) => {
    const images = [...(slide.images || [])];
    images[index] = { ...images[index], x, y };
    updateSlide('images', images);
  };

  const removeImage = (index) => {
    const images = slide.images.filter((_, i) => i !== index);
    updateSlide('images', images);
  };

  const addTextBox = () => {
    const textBoxes = slide.textBoxes || [];
    const activeTheme = TEMPLATE_COLORS[slide.theme || presentation.template] || TEMPLATE_COLORS.Business;
    updateSlide('textBoxes', [...textBoxes, { text: 'Text Box', x: 100, y: 100, fontSize: '16px', color: slide.textColor || activeTheme.defaultText }]);
  };

  const updateTextBox = (index, field, value) => {
    const textBoxes = [...(slide.textBoxes || [])];
    textBoxes[index] = { ...textBoxes[index], [field]: value };
    updateSlide('textBoxes', textBoxes);
  };

  const updateTextBoxPosition = (index, x, y) => {
    const textBoxes = [...(slide.textBoxes || [])];
    textBoxes[index] = { ...textBoxes[index], x, y };
    updateSlide('textBoxes', textBoxes);
  };

  const removeTextBox = (index) => {
    const textBoxes = slide.textBoxes.filter((_, i) => i !== index);
    updateSlide('textBoxes', textBoxes);
  };

  const changeLayout = (layout) => {
    updateSlide('layout', layout);
    setShowLayouts(false);
  };

  const startPresentation = () => {
    setPresentMode(true);
    setCurrentSlide(0);
  };

  const exitPresentation = () => {
    setPresentMode(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  if (!presentation) return null;

  const slide = presentation.slides[currentSlide];
  const activeTheme = TEMPLATE_COLORS[slide.theme || presentation.template] || TEMPLATE_COLORS.Business;
  const gradient = activeTheme.gradient;
  const defaultTextColor = activeTheme.defaultText;
  const currentTextColor = slide.textColor || defaultTextColor;

  const getSlideStyle = (isThumbnail = false) => {
    const pattern = slide.pattern || 'none';
    const bgStyle = slide.backgroundMode === 'solid' ? { backgroundColor: slide.backgroundColor || '#ffffff' } : {};
    return {
      ...bgStyle,
      backgroundImage: slide.backgroundMode === 'gradient' ? undefined : (pattern !== 'none' ? DESIGN_PATTERNS[pattern] : undefined),
      backgroundSize: pattern === 'dots' ? '20px 20px' : (pattern === 'grid' ? '40px 40px' : undefined)
    };
  };

  // Presentation mode
  if (presentMode) {
    const transitionEffect = TRANSITIONS[slide.transition || 'none'];
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center overflow-hidden" onClick={exitPresentation}>
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSlide}
            initial={transitionEffect.initial}
            animate={transitionEffect.animate}
            exit={transitionEffect.exit}
            transition={transitionEffect.transition}
            className={`w-full h-full ${slide.backgroundMode === 'gradient' ? `bg-gradient-to-br ${gradient}` : ''} flex flex-col p-16 shadow-2xl relative`}
            style={{ 
              ...getSlideStyle(),
              justifyContent: slide.verticalAlign === 'top' ? 'flex-start' : slide.verticalAlign === 'bottom' ? 'flex-end' : 'center' 
            }}
            onClick={e => e.stopPropagation()}
          >
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-bold mb-8"
              style={{ 
                fontSize: slide.titleSize === '5xl' ? '4rem' : slide.titleSize === '4xl' ? '3.5rem' : slide.titleSize === '2xl' ? '2rem' : '2.5rem',
                color: currentTextColor,
                textAlign: slide.textAlign || 'left'
              }}
            >
              {slide.title}
            </motion.h2>
            <div className="space-y-4" style={{ textAlign: slide.textAlign || 'left' }}>
              {slide.content?.map((point, i) => (
                <motion.div 
                  key={i} 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <span className="mt-2.5 w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: currentTextColor, opacity: 0.7 }} />
                  <span className="text-2xl" style={{ color: currentTextColor, opacity: 0.9 }}>
                    {point}
                  </span>
                </motion.div>
              ))}
            </div>
            {/* Shapes & Images in present mode */}
            {slide.shapes?.map((shape, i) => (
              <div key={i} className="absolute" style={{ left: `${shape.x}px`, top: `${shape.y}px`, width: `${shape.width}px`, height: `${shape.height}px`, backgroundColor: shape.type === 'line' ? 'transparent' : shape.color, borderBottom: shape.type === 'line' ? `${shape.height}px solid ${shape.color}` : 'none', borderRadius: shape.type === 'circle' ? '50%' : '0', opacity: shape.opacity }} />
            ))}
            {slide.images?.map((img, i) => (
              <img key={i} src={img.url} alt="" className="absolute object-cover rounded shadow-lg" style={{ left: `${img.x}px`, top: `${img.y}px`, width: `${img.width}px`, height: `${img.height}px` }} />
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 z-50">
          <button onClick={(e) => { e.stopPropagation(); setCurrentSlide(i => Math.max(0, i - 1)); }} disabled={currentSlide === 0} className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all disabled:opacity-20">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="bg-black/40 backdrop-blur-md px-6 py-2 rounded-full text-white text-sm font-bold border border-white/10">
            {currentSlide + 1} / {presentation.slides.length}
          </div>
          <button onClick={(e) => { e.stopPropagation(); setCurrentSlide(i => Math.min(presentation.slides.length - 1, i + 1)); }} disabled={currentSlide === presentation.slides.length - 1} className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all disabled:opacity-20">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
        
        <button onClick={exitPresentation} className="absolute top-8 right-8 bg-white/10 hover:bg-red-500/20 px-4 py-2 rounded-lg backdrop-blur-md text-white/70 hover:text-white text-xs font-bold transition-all border border-white/10">ESC TO EXIT</button>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-100 dark:bg-slate-900 flex flex-col overflow-hidden text-slate-900 dark:text-slate-100">
      {/* Quick Access Toolbar */}
      <div className="bg-indigo-700 text-white px-4 py-1 flex items-center justify-between text-xs font-medium">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 opacity-80 hover:opacity-100 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <Presentation className="w-3.5 h-3.5" />
            <span>AlphaSlides PowerPoint</span>
          </div>
          <div className="h-3 w-px bg-white/20" />
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-1 hover:bg-white/10 px-2 py-0.5 rounded transition-colors">
            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
            <span>{saving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
        <div className="flex items-center gap-3">
          {editingTitle ? (
            <input
              autoFocus
              className="bg-white/10 text-white outline-none px-2 rounded border border-white/20"
              value={presentation.title}
              onChange={e => setPresentation({ ...presentation, title: e.target.value })}
              onBlur={() => setEditingTitle(false)}
              onKeyPress={e => e.key === 'Enter' && setEditingTitle(false)}
            />
          ) : (
            <span className="opacity-70 cursor-pointer hover:opacity-100" onClick={() => setEditingTitle(true)}>{presentation.title} - Saved to Cloud</span>
          )}
          <div className="h-3 w-px bg-white/20" />
          <button onClick={toggleTheme} className="hover:bg-white/10 p-1 rounded transition-colors">
            {theme === 'dark' ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Main Ribbon Tabs */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center px-4">
        {['home', 'insert', 'design', 'transitions', 'view', 'export'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold uppercase tracking-tight transition-all border-b-2 ${activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-indigo-500'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Ribbon Content */}
      <div className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 px-6 py-2 flex items-center gap-8 overflow-x-auto min-h-[85px] shadow-sm">
        {activeTab === 'home' && (
          <>
            <div className="flex flex-col items-center gap-1.5 px-4 border-r border-slate-200 dark:border-slate-700">
              <button onClick={addSlide} className="flex flex-col items-center gap-1 group">
                <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-md group-hover:bg-indigo-700 transition-all scale-100 group-hover:scale-105">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">New Slide</span>
              </button>
            </div>
            
            <div className="flex flex-col gap-2 px-4 border-r border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <div className="flex bg-white dark:bg-slate-700 rounded-lg p-0.5 border border-slate-200 dark:border-slate-600">
                  <select value={slide.titleSize || '3xl'} onChange={e => updateSlide('titleSize', e.target.value)} className="text-xs bg-transparent rounded px-2 py-1 outline-none font-medium">
                    <option value="2xl">18px</option>
                    <option value="3xl">24px</option>
                    <option value="4xl">32px</option>
                    <option value="5xl">48px</option>
                  </select>
                </div>
                <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600 relative group">
                  <input type="color" value={currentTextColor} onChange={e => updateSlide('textColor', e.target.value)} className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer scale-150" />
                  <Palette className="absolute inset-0 m-auto w-4 h-4 text-white pointer-events-none drop-shadow-md" />
                </div>
              </div>
              <div className="flex items-center gap-1 bg-white dark:bg-slate-700 p-0.5 rounded-lg border border-slate-200 dark:border-slate-600">
                <button onClick={() => updateSlide('textAlign', 'left')} className={`p-1.5 rounded-md transition-all ${slide.textAlign === 'left' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}><AlignLeft className="w-4 h-4" /></button>
                <button onClick={() => updateSlide('textAlign', 'center')} className={`p-1.5 rounded-md transition-all ${slide.textAlign === 'center' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}><AlignCenter className="w-4 h-4" /></button>
                <button onClick={() => updateSlide('textAlign', 'right')} className={`p-1.5 rounded-md transition-all ${slide.textAlign === 'right' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}><AlignRight className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="flex items-center gap-4 px-4 border-r border-slate-200 dark:border-slate-700">
              <button onClick={() => setShowLayouts(!showLayouts)} className="flex flex-col items-center gap-1 group">
                <div className="p-2.5 text-slate-600 dark:text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-700 rounded-xl transition-all shadow-sm group-hover:shadow-md border border-transparent group-hover:border-slate-100">
                  <Layout className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-medium text-slate-500">Layout</span>
              </button>
            </div>
          </>
        )}

        {activeTab === 'insert' && (
          <>
            <div className="flex items-center gap-2 px-4 border-r border-slate-200 dark:border-slate-700">
              <button onClick={() => addShape('rectangle')} className="flex flex-col items-center gap-1 group p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all shadow-sm group-hover:shadow-md border border-transparent group-hover:border-slate-100">
                <Square className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                <span className="text-[10px]">Shape</span>
              </button>
              <button onClick={() => addShape('circle')} className="flex flex-col items-center gap-1 group p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all shadow-sm group-hover:shadow-md border border-transparent group-hover:border-slate-100">
                <Circle className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                <span className="text-[10px]">Circle</span>
              </button>
            </div>
            <div className="flex items-center gap-4 px-4">
              <button onClick={addImage} className="flex flex-col items-center gap-1 group p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all shadow-sm group-hover:shadow-md border border-transparent group-hover:border-slate-100">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-1.5 rounded-lg"><Image className="w-6 h-6 text-blue-600" /></div>
                <span className="text-[10px] font-medium">Picture</span>
              </button>
              <button 
                onClick={generateAIImage} 
                disabled={generatingAIImage}
                className="flex flex-col items-center gap-1 group p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all shadow-sm group-hover:shadow-md border border-transparent group-hover:border-slate-100 relative overflow-hidden"
              >
                <div className="bg-purple-50 dark:bg-purple-900/20 p-1.5 rounded-lg">
                  {generatingAIImage ? <Loader2 className="w-6 h-6 text-purple-600 animate-spin" /> : <Sparkles className="w-6 h-6 text-purple-600" />}
                </div>
                <span className="text-[10px] font-medium">AI Image</span>
                {generatingAIImage && <motion.div layoutId="loader-bar" className="absolute bottom-0 left-0 h-0.5 bg-purple-500 w-full" initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ repeat: Infinity, duration: 1 }} />}
              </button>
              <button onClick={addTextBox} className="flex flex-col items-center gap-1 group p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all shadow-sm group-hover:shadow-md border border-transparent group-hover:border-slate-100">
                <div className="bg-amber-50 dark:bg-amber-900/20 p-1.5 rounded-lg"><Type className="w-6 h-6 text-amber-600" /></div>
                <span className="text-[10px] font-medium">Text Box</span>
              </button>
            </div>
          </>
        )}

        {activeTab === 'design' && (
          <div className="flex items-center gap-6 px-4 overflow-x-auto max-w-full pb-1">
            <div className="flex flex-col items-center gap-1 border-r border-slate-200 dark:border-slate-700 pr-4">
              <div className="flex items-center gap-2">
                {['solid', 'gradient'].map(mode => (
                  <button 
                    key={mode}
                    onClick={() => updateSlide('backgroundMode', mode)}
                    className={`px-3 py-1 text-[10px] font-bold rounded-lg border transition-all ${slide.backgroundMode === mode ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-slate-700 text-slate-600 border-slate-200 dark:border-slate-600'}`}
                  >
                    {mode.toUpperCase()}
                  </button>
                ))}
              </div>
              <span className="text-[10px] font-bold text-slate-400">BG MODE</span>
            </div>

            <div className="flex items-center gap-2">
              {Object.entries(TEMPLATE_COLORS).map(([key, t]) => (
                <button
                  key={key}
                  onClick={() => {
                    updateSlide('theme', key);
                    updateSlide('textColor', t.defaultText);
                  }}
                  className={`flex-shrink-0 w-20 h-10 rounded-lg bg-gradient-to-br ${t.gradient} relative group transition-all hover:scale-105 shadow-sm ${slide.theme === key ? 'ring-2 ring-indigo-500' : ''}`}
                >
                  <span className="absolute inset-0 flex items-center justify-center text-white text-[8px] font-black uppercase opacity-0 group-hover:opacity-100 bg-black/20 rounded-lg transition-opacity">{t.name}</span>
                </button>
              ))}
            </div>
            
            <div className="h-10 w-px bg-slate-200 dark:bg-slate-700 mx-2" />

            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1">
                {Object.keys(DESIGN_PATTERNS).map(p => (
                  <button 
                    key={p}
                    onClick={() => updateSlide('pattern', p)}
                    className={`w-8 h-8 rounded-lg border transition-all flex items-center justify-center overflow-hidden ${slide.pattern === p ? 'ring-2 ring-indigo-500' : 'border-slate-200 dark:border-slate-600'}`}
                    title={p}
                  >
                    <div className="w-full h-full bg-slate-400" style={{ backgroundImage: DESIGN_PATTERNS[p], backgroundSize: '10px 10px' }} />
                  </button>
                ))}
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Patterns</span>
            </div>

            <div className="flex flex-col items-center gap-1 pl-4 border-l border-slate-200 dark:border-slate-700">
              <button 
                onClick={applyThemeToAll}
                className="px-3 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-lg text-[10px] font-bold border border-indigo-100 dark:border-indigo-900/30 hover:bg-indigo-100 transition-all"
              >
                APPLY TO ALL
              </button>
              <span className="text-[10px] font-bold text-slate-400">BATCH</span>
            </div>
          </div>

        )}

        {activeTab === 'transitions' && (
          <div className="flex items-center gap-6 px-4">
            {['none', 'fade', 'slide', 'zoom'].map(t => (
              <button
                key={t}
                onClick={() => updateSlide('transition', t)}
                className={`flex flex-col items-center gap-1 group transition-all ${slide.transition === t || (!slide.transition && t === 'none') ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
              >
                <div className={`p-3 rounded-2xl shadow-sm border ${slide.transition === t || (!slide.transition && t === 'none') ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-slate-700 text-slate-600 border-slate-100 dark:border-slate-600'}`}>
                  {t === 'none' ? <Minus className="w-5 h-5" /> : t === 'fade' ? <Square className="w-5 h-5 opacity-40" /> : t === 'slide' ? <ArrowRight className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <span className="capitalize text-[10px] font-bold tracking-tighter">{t}</span>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'view' && (
          <div className="flex items-center gap-6 px-4">
            <button onClick={startPresentation} className="flex flex-col items-center gap-1 group">
              <div className="p-3 bg-green-500 text-white rounded-2xl shadow-lg shadow-green-100 dark:shadow-none hover:bg-green-600 transition-all scale-100 hover:scale-105 active:scale-95">
                <Play className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-green-600">START SHOW</span>
            </button>
            <div className="h-10 w-px bg-slate-200 dark:bg-slate-700 mx-2" />
            <button onClick={() => setShowNotes(!showNotes)} className={`flex flex-col items-center gap-1 group transition-all ${showNotes ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-500'}`}>
              <div className={`p-3 rounded-2xl border transition-all ${showNotes ? 'bg-indigo-50 border-indigo-200' : 'bg-white dark:bg-slate-700 border-slate-100'}`}>
                <StickyNote className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold">NOTES</span>
            </button>
          </div>
        )}

        {activeTab === 'export' && (
          <div className="flex items-center gap-6 px-4">
            <button onClick={handleExport} className="flex flex-col items-center gap-1 group hover:scale-105 transition-all">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl border border-red-100 dark:border-red-900/30 shadow-sm group-hover:shadow-md">
                <Download className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-red-600 uppercase">Adobe PDF</span>
            </button>
            <button onClick={handleExportPPTX} className="flex flex-col items-center gap-1 group hover:scale-105 transition-all">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 shadow-sm group-hover:shadow-md">
                <Download className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-indigo-600 uppercase">PowerPoint</span>
            </button>
            <div className="h-10 w-px bg-slate-200 dark:bg-slate-700 mx-2" />
            <button onClick={handleShare} className="flex flex-col items-center gap-1 group hover:scale-105 transition-all">
              <div className="p-3 bg-slate-100 dark:bg-slate-700 text-slate-600 rounded-2xl shadow-sm group-hover:shadow-md">
                <Share2 className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase">Share Link</span>
            </button>
          </div>
        )}
      </div>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - Thumbnails with Reorder */}
        <div className="relative bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col shadow-sm" style={{ width: `${leftWidth}px`, minWidth: '150px', maxWidth: '400px' }}>
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <button onClick={addSlide} className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-3 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-md transition-all active:scale-95">
              <Plus className="w-4 h-4" /> New Slide
            </button>
          </div>
          
          <Reorder.Group 
            axis="y" 
            values={presentation.slides} 
            onReorder={handleReorderSlides}
            className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50/50 dark:bg-slate-900/30"
          >
            {presentation.slides.map((s, i) => {
              const slideTheme = TEMPLATE_COLORS[s.theme || presentation.template] || TEMPLATE_COLORS.Business;
              return (
                <Reorder.Item
                  key={s._id || `slide-${i}`}
                  value={s}
                  onClick={() => setCurrentSlide(i)}
                  className={`relative group cursor-grab active:cursor-grabbing rounded-xl border-2 transition-all overflow-hidden ${
                    currentSlide === i ? 'border-indigo-600 shadow-lg scale-[1.02]' : 'border-transparent hover:border-indigo-300'
                  }`}
                >
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10 backdrop-blur-sm">{i + 1}</div>
                  <div 
                    className={`aspect-video ${s.backgroundMode === 'gradient' ? `bg-gradient-to-br ${slideTheme.gradient}` : ''} p-2 flex flex-col`}
                    style={{
                      backgroundColor: s.backgroundMode === 'solid' ? s.backgroundColor : undefined,
                      backgroundImage: s.backgroundMode === 'pattern' ? DESIGN_PATTERNS[s.pattern || 'none'] : undefined,
                      backgroundSize: '10px 10px'
                    }}
                  >
                    <div className="text-[8px] font-bold truncate mb-1 opacity-90" style={{ color: slideTheme.defaultText }}>{s.title}</div>
                    <div className="space-y-0.5">
                      {s.content?.slice(0, 2).map((c, j) => <div key={j} className="text-[6px] truncate" style={{ color: slideTheme.defaultText, opacity: 0.7 }}>• {c}</div>)}
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button onClick={(e) => { e.stopPropagation(); duplicateSlide(i); }} className="bg-white/90 backdrop-blur p-1.5 rounded-lg shadow-sm hover:bg-indigo-600 hover:text-white transition-all">
                      <Copy className="w-3 h-3" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); removeSlide(i); }} className="bg-white/90 backdrop-blur p-1.5 rounded-lg shadow-sm hover:bg-red-600 hover:text-white transition-all">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>

          {/* Resize handle */}
          <div
            className="absolute right-0 top-0 bottom-0 w-1 bg-transparent hover:bg-indigo-400 cursor-col-resize transition-colors"
            onMouseDown={(e) => {
              e.preventDefault();
              const startX = e.clientX;
              const startWidth = leftWidth;
              const onMouseMove = (e) => setLeftWidth(Math.max(150, Math.min(400, startWidth + e.clientX - startX)));
              const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
              };
              document.addEventListener('mousemove', onMouseMove);
              document.addEventListener('mouseup', onMouseUp);
            }}
          />
        </div>

        {/* Center - Slide canvas */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 gap-6 bg-slate-100 dark:bg-slate-900/50 relative">
          <div className="w-full max-w-5xl aspect-video bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-700 relative">
            <div 
              className={`w-full h-full ${slide.backgroundMode === 'gradient' ? `bg-gradient-to-br ${gradient}` : ''} p-12 flex flex-col relative overflow-hidden transition-all duration-500`}
              style={{ 
                ...getSlideStyle(),
                justifyContent: slide.verticalAlign === 'top' ? 'flex-start' : slide.verticalAlign === 'bottom' ? 'flex-end' : 'center' 
              }}
            >
              <ErrorBoundary>
                {/* Shapes */}
                {slide.shapes?.map((shape, i) => {
                  if (!shapesRefs.current[i]) shapesRefs.current[i] = React.createRef();
                  return (
                    <Draggable
                      key={`shape-${i}`}
                      nodeRef={shapesRefs.current[i]}
                      position={{ x: shape.x, y: shape.y }}
                      onStop={(e, data) => updateShapePosition(i, data.x, data.y)}
                      handle=".drag-handle"
                    >
                      <div ref={shapesRefs.current[i]} className="absolute group z-20">
                        <div
                          style={{
                            width: shape.width,
                            height: shape.height,
                            backgroundColor: shape.type === 'line' ? 'transparent' : shape.color,
                            borderBottom: shape.type === 'line' ? `${shape.height}px solid ${shape.color}` : 'none',
                            borderRadius: shape.type === 'circle' ? '50%' : '0',
                            opacity: shape.opacity,
                            backdropFilter: slide.glassmorphism ? 'blur(8px)' : 'none',
                            border: slide.glassmorphism ? '1px solid rgba(255,255,255,0.2)' : 'none'
                          }}
                        />
                        <div className="drag-handle absolute -top-8 left-0 bg-indigo-600 text-white rounded-lg px-2 py-1 cursor-move opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-bold shadow-lg">
                          <GripVertical className="w-3 h-3" />
                        </div>
                        <button
                          onClick={() => removeShape(i)}
                          className="absolute -top-8 right-0 bg-red-500 text-white rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold shadow-lg"
                        >
                          DEL
                        </button>
                      </div>
                    </Draggable>
                  );
                })}

                {/* Images */}
                {slide.images?.map((img, i) => {
                  if (!imagesRefs.current[i]) imagesRefs.current[i] = React.createRef();
                  return (
                    <Draggable
                      key={`img-${i}`}
                      nodeRef={imagesRefs.current[i]}
                      position={{ x: img.x, y: img.y }}
                      onStop={(e, data) => updateImagePosition(i, data.x, data.y)}
                      handle=".drag-handle"
                    >
                      <div ref={imagesRefs.current[i]} className="absolute group z-20">
                        <img
                          src={img.url}
                          alt=""
                          className="object-cover rounded-xl shadow-lg border-2 border-transparent group-hover:border-indigo-500 transition-all pointer-events-none"
                          style={{ width: img.width, height: img.height }}
                        />
                        <div className="drag-handle absolute -top-8 left-0 bg-indigo-600 text-white rounded-lg px-2 py-1 cursor-move opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-bold shadow-lg">
                          <GripVertical className="w-3 h-3" />
                        </div>
                        <button
                          onClick={() => removeImage(i)}
                          className="absolute -top-8 right-0 bg-red-500 text-white rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold shadow-lg"
                        >
                          DEL
                        </button>
                      </div>
                    </Draggable>
                  );
                })}

                {/* Text Boxes */}
                {slide.textBoxes?.map((box, i) => {
                  if (!textBoxesRefs.current[i]) textBoxesRefs.current[i] = React.createRef();
                  return (
                    <Draggable
                      key={`text-${i}`}
                      nodeRef={textBoxesRefs.current[i]}
                      position={{ x: box.x, y: box.y }}
                      onStop={(e, data) => updateTextBoxPosition(i, data.x, data.y)}
                      handle=".drag-handle"
                    >
                      <div ref={textBoxesRefs.current[i]} className="absolute group z-20">
                        <div
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={e => updateTextBox(i, 'text', e.target.innerText)}
                          className={`px-4 py-2 rounded-xl outline-none min-w-[150px] shadow-sm transition-all ${slide.glassmorphism ? 'bg-white/10 backdrop-blur-md border border-white/20' : 'bg-white/5 hover:bg-white/10'}`}
                          style={{ fontSize: box.fontSize, color: box.color || currentTextColor }}
                        >
                          {box.text}
                        </div>
                        <div className="drag-handle absolute -top-8 left-0 bg-indigo-600 text-white rounded-lg px-2 py-1 cursor-move opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-bold shadow-lg">
                          <GripVertical className="w-3 h-3" />
                        </div>
                        <button
                          onClick={() => removeTextBox(i)}
                          className="absolute -top-8 right-0 bg-red-500 text-white rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold shadow-lg"
                        >
                          DEL
                        </button>
                      </div>
                    </Draggable>
                  );
                })}

                {/* Slide Title - Now Draggable */}
                <Draggable nodeRef={titleRef} handle=".title-drag-handle">
                  <div ref={titleRef} className="relative group/title z-10 w-fit">
                    <div className="title-drag-handle absolute -left-10 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg opacity-0 group-hover/title:opacity-100 transition-opacity cursor-move shadow-lg">
                      <Move className="w-4 h-4" />
                    </div>
                    <h2
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={e => updateSlide('title', e.target.innerText)}
                      className={`font-extrabold mb-8 outline-none cursor-text px-4 py-2 transition-all ${slide.glassmorphism ? 'bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl' : 'hover:bg-white/10 rounded-xl'}`}
                      style={{ 
                        fontSize: slide.titleSize === '5xl' ? '3.5rem' : slide.titleSize === '4xl' ? '2.8rem' : slide.titleSize === '2xl' ? '1.8rem' : '2.2rem',
                        color: currentTextColor,
                        textAlign: slide.textAlign || 'left',
                        lineHeight: '1.2'
                      }}
                    >
                      {slide.title}
                    </h2>
                  </div>
                </Draggable>
                
                {/* Slide Content - Now Draggable */}
                <Draggable nodeRef={contentRef} handle=".content-drag-handle">
                  <div ref={contentRef} className="relative group/content z-10 w-full">
                    <div className="content-drag-handle absolute -left-10 top-0 p-2 bg-indigo-600 text-white rounded-lg opacity-0 group-hover/content:opacity-100 transition-opacity cursor-move shadow-lg">
                      <Move className="w-4 h-4" />
                    </div>
                    <div 
                      className={`space-y-4 p-6 transition-all ${slide.glassmorphism ? 'bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 shadow-inner' : ''}`} 
                      style={{ textAlign: slide.textAlign || 'left' }}
                    >
                      {slide.content?.map((point, i) => (
                        <div key={i} className="flex items-start gap-4 group">
                          <span className="mt-3 w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm" style={{ backgroundColor: currentTextColor, opacity: 0.8 }} />
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={e => updateBullet(i, e.target.innerText)}
                            className="flex-1 outline-none cursor-text hover:bg-white/10 rounded-xl px-4 py-2 text-xl font-medium transition-all"
                            style={{ color: currentTextColor, opacity: 0.95 }}
                          >
                            {point}
                          </span>
                          <button onClick={() => removeBullet(i)} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 rounded-lg transition-all">
                            <Trash2 className="w-4 h-4 text-white/60 hover:text-white" style={{ color: activeTheme.isLight ? '#ef4444' : 'white' }} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </Draggable>
              </ErrorBoundary>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-6 py-2 rounded-2xl shadow-xl border border-white dark:border-slate-700">
            <button onClick={() => setCurrentSlide(i => Math.max(0, i - 1))} disabled={currentSlide === 0} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-all disabled:opacity-30">
              <ChevronLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
            </button>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
            <span className="text-xs font-black text-slate-500 dark:text-slate-400 px-4 text-center min-w-[120px] uppercase tracking-tighter">
              Slide <span className="text-indigo-600 dark:text-indigo-400 text-lg mx-1">{currentSlide + 1}</span> of {presentation.slides.length}
            </span>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
            <button onClick={() => setCurrentSlide(i => Math.min(presentation.slides.length - 1, i + 1))} disabled={currentSlide === presentation.slides.length - 1} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-all disabled:opacity-30">
              <ChevronRight className="w-6 h-6 text-slate-600 dark:text-slate-300" />
            </button>
          </div>
        </div>

        {/* Right sidebar - Design & Properties */}
        <div className="relative bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 overflow-y-auto p-5 space-y-8 shadow-sm" style={{ width: `${rightWidth}px`, minWidth: '250px', maxWidth: '450px' }}>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Visual Styles</h3>
            </div>
            
            {/* Glassmorphism Toggle */}
            <button 
              onClick={() => updateSlide('glassmorphism', !slide.glassmorphism)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${slide.glassmorphism ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-600 shadow-md' : 'bg-white dark:bg-slate-700 border-slate-100 dark:border-slate-600 opacity-60 hover:opacity-100'}`}
            >
              <div className="flex items-center gap-3">
                <Layers className={`w-5 h-5 ${slide.glassmorphism ? 'text-indigo-600' : ''}`} />
                <span className="text-sm font-bold">Glassmorphism</span>
              </div>
              {slide.glassmorphism && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
            </button>

            {/* Pattern Selection */}
            <div className="grid grid-cols-3 gap-2">
              {Object.keys(DESIGN_PATTERNS).map(p => (
                <button 
                  key={p}
                  onClick={() => updateSlide('pattern', p)}
                  className={`relative aspect-square rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${slide.pattern === p ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-100 dark:border-slate-700 hover:border-indigo-300'}`}
                >
                  <div className="w-8 h-8 rounded-md bg-slate-400 opacity-40 shadow-inner" style={{ backgroundImage: DESIGN_PATTERNS[p], backgroundSize: '8px 8px' }} />
                  <span className="text-[8px] font-bold uppercase">{p}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-700" />

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Background</h3>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input 
                  type="color" 
                  value={slide.backgroundColor || '#ffffff'} 
                  onChange={e => {
                    updateSlide('backgroundColor', e.target.value);
                    updateSlide('backgroundMode', 'solid');
                  }}
                  className="w-12 h-12 rounded-xl cursor-pointer border-2 border-slate-100 dark:border-slate-700 p-1" 
                />
                <div className="flex-1 flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Solid Color</span>
                  <span className="text-xs font-mono opacity-60 uppercase">{slide.backgroundColor || '#FFFFFF'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-700" />

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Layout className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Alignment</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => updateSlide('verticalAlign', 'top')} className={`px-2 py-3 text-[10px] font-bold rounded-xl border-2 transition-all ${slide.verticalAlign === 'top' ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white dark:bg-slate-700 text-slate-600 border-slate-100 dark:border-slate-600'}`}>TOP</button>
              <button onClick={() => updateSlide('verticalAlign', 'center')} className={`px-2 py-3 text-[10px] font-bold rounded-xl border-2 transition-all ${!slide.verticalAlign || slide.verticalAlign === 'center' ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white dark:bg-slate-700 text-slate-600 border-slate-100 dark:border-slate-600'}`}>CENTER</button>
              <button onClick={() => updateSlide('verticalAlign', 'bottom')} className={`px-2 py-3 text-[10px] font-bold rounded-xl border-2 transition-all ${slide.verticalAlign === 'bottom' ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white dark:bg-slate-700 text-slate-600 border-slate-100 dark:border-slate-600'}`}>BOTTOM</button>
            </div>
          </div>

          {/* Resize handle */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1 bg-transparent hover:bg-indigo-400 cursor-col-resize transition-colors"
            onMouseDown={(e) => {
              e.preventDefault();
              const startX = e.clientX;
              const startWidth = rightWidth;
              const onMouseMove = (e) => setRightWidth(Math.max(250, Math.min(450, startWidth - (e.clientX - startX))));
              const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
              };
              document.addEventListener('mousemove', onMouseMove);
              document.addEventListener('mouseup', onMouseUp);
            }}
          />
        </div>
      </div>

      {/* Templates Modal */}
      <AnimatePresence>
        {showTemplates && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6" 
            onClick={() => setShowTemplates(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-4xl w-full shadow-2xl overflow-hidden" 
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Global Themes</h2>
                  <p className="text-slate-500 text-sm">Apply a consistent design across all your slides</p>
                </div>
                <button onClick={() => setShowTemplates(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {Object.entries(TEMPLATE_COLORS).map(([key, t]) => (
                  <button
                    key={key}
                    onClick={() => { setPresentation({ ...presentation, template: key }); setShowTemplates(false); }}
                    className={`relative h-28 rounded-2xl bg-gradient-to-br ${t.gradient} group overflow-hidden transition-all hover:scale-105 shadow-lg ${presentation.template === key ? 'ring-4 ring-indigo-600 ring-offset-4 dark:ring-offset-slate-800' : ''}`}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">{t.name}</span>
                    <div className="absolute bottom-2 right-2 w-4 h-4 bg-white/20 rounded-full" />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Editor;
