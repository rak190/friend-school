'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu, Globe, X, BookOpen, Shield, Users, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const featuresRef = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim().toLowerCase(), password })
      });
      
      if (res.ok) {
        window.location.href = '/';
      } else {
        setError('ឈ្មោះគណនី ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ');
      }
    } catch (err) {
      console.error(err);
      setError('មានបញ្ហាក្នុងការភ្ជាប់ទៅម៉ាស៊ីនមេ (Network Error)');
    } finally {
      setLoading(false);
    }
  };

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col font-sans text-brand-text overflow-x-hidden relative">
      
      {/* Slide-out Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
          <div className="relative w-64 bg-white h-full shadow-2xl p-6 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-8">
              <span className="font-bold text-slate-800">ម៉ឺនុយ (Menu)</span>
              <X className="w-6 h-6 text-slate-400 cursor-pointer hover:text-slate-800" onClick={() => setIsMenuOpen(false)} />
            </div>
            <div className="flex flex-col gap-4 text-sm font-semibold text-slate-600">
              <button onClick={() => { setIsMenuOpen(false); scrollToFeatures(); }} className="text-left px-4 py-3 hover:bg-slate-50 rounded-xl transition-colors">ស្វែងយល់ពីប្រព័ន្ធ (Features)</button>
              <button onClick={() => setIsMenuOpen(false)} className="text-left px-4 py-3 hover:bg-slate-50 rounded-xl transition-colors">ទំនាក់ទំនង (Contact)</button>
              <button onClick={() => setIsMenuOpen(false)} className="text-left px-4 py-3 hover:bg-slate-50 rounded-xl transition-colors">ជំនួយ (Help)</button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="w-full px-6 py-4 flex items-center justify-between bg-white border-b border-slate-100 z-40 relative">
        <div className="flex items-center gap-3">
          <img src="/logo.png?v=1" alt="School Logo" className="w-10 h-10 object-contain" />
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">សាលារៀន School</span>
        </div>
        
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 font-bold text-slate-700">
          ប្រព័ន្ធគ្រប់គ្រងសាលារៀន
        </div>
        
        <div className="flex items-center gap-4 text-sm font-bold text-slate-600 relative">
          <div className="relative">
            <button onClick={() => setIsLangOpen(!isLangOpen)} className="flex items-center gap-1.5 hover:bg-slate-50 px-2 py-1.5 rounded-lg transition-colors">
              <Globe className="w-4 h-4" /> <span>KM</span>
            </button>
            {isLangOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-slate-100 shadow-lg rounded-xl p-2 w-32 animate-in fade-in zoom-in-95 duration-200">
                <button onClick={() => setIsLangOpen(false)} className="w-full text-left px-3 py-2 text-brand-blue bg-blue-50 rounded-lg">🇰🇭 ភាសាខ្មែរ</button>
                <button onClick={() => setIsLangOpen(false)} className="w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors mt-1">🇺🇸 English</button>
              </div>
            )}
          </div>
          <button onClick={() => setIsMenuOpen(true)} className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Main Login Hero */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center p-6 lg:p-12 gap-12 max-w-7xl mx-auto w-full relative min-h-[calc(100vh-80px)]">
        
        {/* Left Side: Copy & Illustration */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left z-10">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight mb-4">
            សម្រាប់បទពិសោធន៍បង្រៀន <br className="hidden lg:block"/> និងរៀនកាន់តែប្រសើរ!
          </h1>
          <button onClick={scrollToFeatures} className="bg-brand-yellow/20 text-yellow-900 px-5 py-2 rounded-full text-sm font-bold mb-8 hover:bg-brand-yellow/30 transition-colors flex items-center gap-2 cursor-pointer">
            ស្វែងយល់បន្ថែម <ArrowRight className="w-4 h-4" />
          </button>
          
          <div className="w-full max-w-lg mt-4 flex justify-center">
            <img 
              src="/login_illustration.svg" 
              alt="Students reading" 
              className="w-full h-auto object-contain drop-shadow-xl animate-pop opacity-0"
            />
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full max-w-md z-20 relative">
          <div className="bg-[#E6F4EA] p-8 lg:p-10 rounded-[32px] shadow-sm border border-emerald-50 relative">
            
            {/* TABS */}
            <div className="flex bg-white/50 p-1 rounded-xl mb-8 border border-white relative z-50">
              <button type="button" className="flex-1 py-2 text-sm font-bold bg-white text-slate-900 rounded-lg shadow-sm text-center">បុគ្គលិក (Staff)</button>
              <button type="button" onClick={() => window.location.href = '/parents/login'} className="flex-1 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors text-center cursor-pointer">មាតាបិតា (Parents)</button>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-6">សូមស្វាគមន៍មកវិញ</h2>
            
            {error && (
              <div className="mb-6 p-3 bg-red-100 border border-red-200 rounded-xl text-red-600 text-sm font-medium text-center animate-in fade-in zoom-in duration-200">
                {error}
              </div>
            )}


            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-transparent border-b border-slate-300 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-blue transition-colors font-medium"
                  placeholder="ឈ្មោះគណនី (ឧ. teacher)"
                  required
                />
              </div>
              
              <div className="space-y-2 relative">
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-slate-300 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-blue transition-colors font-medium pr-16"
                  placeholder="ពាក្យសម្ងាត់"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-brand-blue hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-blue/30 transition-all flex justify-center items-center mt-4 disabled:opacity-70"
              >
                {loading ? 'កំពុងចូល...' : 'ចូលគណនី'}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section ref={featuresRef} className="bg-white py-20 px-6 lg:px-12 border-t border-slate-100 mt-12 relative z-30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-800 mb-4">ប្រព័ន្ធគ្រប់គ្រងសាលាទំនើប</h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto">ផ្តល់ភាពងាយស្រួលដល់គណៈគ្រប់គ្រង លោកគ្រូអ្នកគ្រូ និងសិស្សានុសិស្សក្នុងការគ្រប់គ្រងការសិក្សាប្រចាំថ្ងៃ។</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-brand-bg rounded-[32px] p-8 text-center transition-all hover:-translate-y-2 hover:shadow-xl duration-300">
              <div className="w-16 h-16 bg-blue-100 text-brand-blue rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">ងាយស្រួលគ្រប់គ្រងការសិក្សា</h3>
              <p className="text-slate-600 text-sm font-medium leading-relaxed">តាមដានពិន្ទុ កាលវិភាគ និងអវត្តមានសិស្សដោយស្វ័យប្រវត្តិ។</p>
            </div>
            
            <div className="bg-brand-bg rounded-[32px] p-8 text-center transition-all hover:-translate-y-2 hover:shadow-xl duration-300">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">សុវត្ថិភាពទិន្នន័យកម្រិតខ្ពស់</h3>
              <p className="text-slate-600 text-sm font-medium leading-relaxed">ទិន្នន័យសាលាត្រូវបានរក្សាទុកដោយសុវត្ថិភាពបំផុតលើម៉ាស៊ីនមេទំនើប។</p>
            </div>

            <div className="bg-brand-bg rounded-[32px] p-8 text-center transition-all hover:-translate-y-2 hover:shadow-xl duration-300">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">ទំនាក់ទំនងរហ័ស</h3>
              <p className="text-slate-600 text-sm font-medium leading-relaxed">ភ្ជាប់ទំនាក់ទំនងរវាងនាយកសាលា គ្រូបង្រៀន និងអាណាព្យាបាលសិស្ស។</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-slate-900 py-8 px-6 text-center text-slate-400 text-sm font-medium z-30 relative">
        <p>&copy; {new Date().getFullYear()} សាលារៀន School. រក្សាសិទ្ធិគ្រប់យ៉ាង។</p>
      </footer>
    </div>
  );
}
