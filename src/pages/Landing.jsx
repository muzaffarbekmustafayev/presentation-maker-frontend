import React from 'react';
import { Link } from 'react-router-dom';
import { Presentation, Sparkles, Layout, Download, Share2, ArrowRight, Users, Zap, Shield, Check, Star, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Landing = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="bg-white dark:bg-slate-900 overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-50 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-lg shadow-lg shadow-indigo-200">
              <Presentation className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">AlphaSlides</span>
          </div>
          <div className="flex items-center gap-6">
            <button 
              className="theme-toggle"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <Sun className="text-yellow-500 mr-auto ml-0.5" />
              <Moon className="text-slate-400 ml-auto mr-0.5" />
            </button>
            <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Login</Link>
            <Link to="/register" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-indigo-200 hover:scale-105 transition-all">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full blur-3xl opacity-60 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-50 to-cyan-50 rounded-full blur-3xl opacity-60 animate-pulse delay-700" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-6 border border-indigo-100 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> AI-Powered Presentation Generator
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 dark:text-white mb-8 leading-[1.1] tracking-tight">
            Create Beautiful Presentations <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">in Seconds</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Transform your ideas, documents, or topics into professional-grade slide decks automatically. No design skills required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-slate-900 to-slate-800 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:shadow-2xl hover:shadow-slate-200 hover:scale-105 transition-all group">
              Start Creating <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/demo" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:shadow-md">
              View Samples
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-slate-700">4.9/5</span> from 2,000+ users
            </div>
            <div className="flex items-center gap-1">
              <Check className="w-4 h-4 text-green-500" />
              <span>Free forever plan</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">Everything you need to wow your audience</h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">Built with the latest AI models to give you a head start.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Sparkles, title: "AI Content Generation", desc: "Just enter your topic and we generate structured content, bullet points, and speaker notes." },
              { icon: Layout, title: "Professional Layouts", desc: "Choose from curated templates designed for business, education, or creative pitches." },
              { icon: Download, title: "Multi-Format Export", desc: "Download your slides as PDF, PowerPoint, or high-quality images ready to use." }
            ].map((f, i) => (
              <div key={i} className="bg-white dark:bg-slate-700 p-8 rounded-3xl border border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all hover:shadow-xl hover:shadow-indigo-50/50 group hover:-translate-y-1">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/50 dark:to-purple-900/50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:from-indigo-600 group-hover:to-purple-600 transition-colors shadow-sm">
                  <f.icon className="text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{f.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Active Users", value: "10K+" },
              { label: "Presentations Created", value: "50K+" },
              { label: "Templates", value: "50+" },
              { label: "Countries", value: "50+" }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">How it works</h2>
            <p className="text-slate-600 dark:text-slate-300">Create stunning presentations in 3 simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 -z-10" />

            {[
              { step: "01", title: "Enter Topic", desc: "Type your presentation topic or upload a document" },
              { step: "02", title: "Customize", desc: "Choose template, slide count, and language" },
              { step: "03", title: "Generate", desc: "AI creates your presentation in seconds" }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-indigo-200 group-hover:scale-110 transition-transform">
                  <span className="text-3xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Trusted by professionals</h2>
            <p className="text-slate-600">See what our users have to say</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Sarah Johnson", role: "Marketing Director", text: "AlphaSlides has completely transformed how we create pitch decks. It's incredible!" },
              { name: "Michael Chen", role: "University Professor", text: "I create lecture slides in minutes instead of hours. The AI generates great content." },
              { name: "Elena Rodriguez", role: "Startup Founder", text: "Beautiful presentations that impress investors. Highly recommended!" }
            ].map((t, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-slate-700 mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to create your next masterpiece?</h2>
          <p className="text-xl text-indigo-100 mb-10">Join thousands of users who create stunning presentations with AlphaSlides.</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-indigo-50 hover:shadow-xl transition-all hover:scale-105">
            Get Started for Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-1.5 rounded-lg">
                  <Presentation className="text-white w-5 h-5" />
                </div>
                <span className="text-lg font-bold text-white">AlphaSlides</span>
              </div>
              <p className="text-sm text-slate-400">AI-powered presentation generator for professionals.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
            © 2024 AlphaSlides. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
