import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Loader2, ArrowLeft, Upload, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import api from '../api/axios';

const TEMPLATES = ['Business', 'Minimal', 'Technology', 'Education', 'Startup', 'Creative', 'Dark', 'Corporate'];
const SLIDE_COUNTS = [5, 8, 10, 15, 20];
const LANGUAGES = ['English', 'Uzbek', 'Russian'];

const CreatePresentation = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [form, setForm] = useState({ topic: '', slideCount: 8, template: 'Minimal', language: 'English' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/presentations/generate', form);
      navigate(`/edit/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data || 'Generation failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    
    setFile(uploadedFile);
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('slideCount', form.slideCount);
      formData.append('template', form.template);
      formData.append('language', form.language);
      
      const res = await api.post('/presentations/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate(`/edit/${res.data._id}`);
    } catch (err) {
      setError('File upload failed. Try again.');
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4 py-12">
      <button onClick={toggleTheme} className="fixed top-4 right-4 z-50 p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50">
        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
      
      <div className="max-w-lg w-full">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-2xl shadow-indigo-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2.5 rounded-xl">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Create with AI</h1>
              <p className="text-sm text-slate-500">Enter a topic or upload a document</p>
            </div>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-5 flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{error}</div>}

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Upload Document (Optional)</label>
            <label className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all">
              <Upload className="w-5 h-5 text-slate-400" />
              <span className="text-sm text-slate-600">{file ? file.name : 'Upload PDF, DOCX, or TXT'}</span>
              <input type="file" accept=".pdf,.docx,.txt" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-slate-500">OR</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Presentation Topic</label>
              <input
                type="text"
                required
                placeholder="e.g. Artificial Intelligence in Education"
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                value={form.topic}
                onChange={e => setForm({ ...form, topic: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Number of Slides</label>
              <div className="flex gap-2 flex-wrap">
                {SLIDE_COUNTS.map(n => (
                  <button type="button" key={n}
                    onClick={() => setForm({ ...form, slideCount: n })}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${form.slideCount === n ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent' : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-300'}`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Template</label>
              <div className="grid grid-cols-4 gap-2">
                {TEMPLATES.map(t => (
                  <button type="button" key={t}
                    onClick={() => setForm({ ...form, template: t })}
                    className={`px-2 py-2 rounded-xl text-xs font-semibold border transition-all ${form.template === t ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent' : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-300'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Language</label>
              <div className="flex gap-2">
                {LANGUAGES.map(l => (
                  <button type="button" key={l}
                    onClick={() => setForm({ ...form, language: l })}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${form.language === l ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent' : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-300'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-indigo-200 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Generating slides...</>
              ) : (
                <><Sparkles className="w-5 h-5" /> Generate Presentation</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePresentation;
