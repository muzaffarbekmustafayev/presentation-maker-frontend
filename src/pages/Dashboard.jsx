import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Presentation, Plus, Trash2, Edit, LogOut, Loader2, Download, Share2, Clock, Calendar, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../api/axios';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [presentations, setPresentations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/presentations')
      .then(res => setPresentations(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this presentation?')) return;
    await api.delete(`/presentations/${id}`);
    setPresentations(prev => prev.filter(p => p._id !== id));
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Navbar */}
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-lg shadow-md">
            <Presentation className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white">AlphaSlides</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme} 
            className="theme-toggle"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <Sun className="text-yellow-500 mr-auto ml-0.5" />
            <Moon className="text-slate-400 ml-auto mr-0.5" />
          </button>
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <span className="text-slate-500 dark:text-slate-500">Hi,</span>
            <span className="font-semibold text-slate-900 dark:text-white">{user?.name}</span>
          </div>
          <button onClick={handleLogout} className="btn-classic flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Presentations</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage and edit your AI-generated presentations</p>
          </div>
          <Link to="/create" className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-200 hover:scale-105 transition-all">
            <Plus className="w-4 h-4" /> New Presentation
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : presentations.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-600 animate-fade-in">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/50 dark:to-purple-900/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Presentation className="w-10 h-10 text-indigo-400" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-lg mb-6">No presentations yet.</p>
            <Link to="/create" className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-200 hover:scale-105 transition-all">
              <Plus className="w-4 h-4" /> Create your first one
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {presentations.map((p, i) => (
              <div key={p._id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-500 transition-all group hover:-translate-y-1 animate-slide-in" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-xl h-32 flex items-center justify-center mb-4 group-hover:from-indigo-100 group-hover:to-purple-100 dark:group-hover:from-indigo-800/50 dark:group-hover:to-purple-800/50 transition-colors shadow-sm">
                  <Presentation className="w-12 h-12 text-indigo-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white truncate mb-3" title={p.title}>{p.title}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-4">
                  <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                    <Clock className="w-3 h-3" />
                    {formatDate(p.updatedAt || p.createdAt)}
                  </span>
                  <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                    <span className="w-3 h-3 flex items-center justify-center text-[10px]">S</span>
                    {p.slideCount} slides
                  </span>
                </div>
                <div className="flex gap-2">
                  <Link to={`/edit/${p._id}`} className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 py-2 rounded-xl text-sm font-semibold hover:from-indigo-600 hover:to-purple-600 hover:text-white transition-all">
                    <Edit className="w-4 h-4" /> Edit
                  </Link>
                  <button onClick={() => handleDelete(p._id)} className="flex items-center justify-center gap-1.5 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-3 py-2 rounded-xl text-sm hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
