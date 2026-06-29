'use client';
import { useState, useEffect } from 'react';
import { Save, Building2, CalendarDays, Clock, Phone, Mail, Globe, MapPin, Loader2 } from 'lucide-react';

export default function PrincipalSettingsPage() {
  const [settings, setSettings] = useState({
    school_name: '',
    school_name_en: '',
    academic_year: '',
    term_start: '',
    term_end: '',
    phone: '',
    email: '',
    address: '',
    website: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const json = await res.json();
      if (json.success && json.data) {
        // Merge fetched data with default empty strings
        setSettings(prev => ({ ...prev, ...json.data }));
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const json = await res.json();
      if (json.success) {
        setMessage('ការកំណត់ត្រូវបានរក្សាទុកដោយជោគជ័យ!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('មានបញ្ហាក្នុងការរក្សាទុក!');
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
      setMessage('មានបញ្ហាក្នុងការរក្សាទុក!');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-brand-muted">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p>កំពុងទាញយកការកំណត់...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300 relative max-w-4xl mx-auto w-full">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">ការកំណត់ប្រព័ន្ធ</h1>
          <p className="text-brand-muted font-medium mt-1">គ្រប់គ្រងព័ត៌មានទូទៅរបស់សាលារៀន</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-brand-blue text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition-all disabled:opacity-70"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? 'កំពុងរក្សាទុក...' : 'រក្សាទុកការផ្លាស់ប្តូរ'}
          </button>
        </div>
      </header>

      {message && (
        <div className={`p-4 mb-6 rounded-xl font-bold text-sm ${message.includes('ជោគជ័យ') ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        
        {/* Profile Info */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-brand-blue">
              <Building2 className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">ព័ត៌មានសាលារៀន</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">ឈ្មោះសាលា (ខ្មែរ)</label>
              <input 
                type="text" 
                value={settings.school_name}
                onChange={e => setSettings({...settings, school_name: e.target.value})}
                placeholder="ឧ. សាលាអន្តរជាតិ ស៊ី អាយ អេ"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">ឈ្មោះសាលា (English)</label>
              <input 
                type="text" 
                value={settings.school_name_en}
                onChange={e => setSettings({...settings, school_name_en: e.target.value})}
                placeholder="e.g. CIA First International School"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Academic Settings */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
              <CalendarDays className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">ប្រតិទិនសិក្សា</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">ឆ្នាំសិក្សា</label>
              <input 
                type="text" 
                value={settings.academic_year}
                onChange={e => setSettings({...settings, academic_year: e.target.value})}
                placeholder="ឧ. 2026-2027"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 font-medium font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">ថ្ងៃចូលរៀន (Term Start)</label>
              <input 
                type="date" 
                value={settings.term_start}
                onChange={e => setSettings({...settings, term_start: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">ថ្ងៃបញ្ចប់ (Term End)</label>
              <input 
                type="date" 
                value={settings.term_end}
                onChange={e => setSettings({...settings, term_end: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Phone className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">ទំនាក់ទំនង</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">លេខទូរស័ព្ទ</label>
              <div className="relative">
                <Phone className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="tel" 
                  value={settings.phone}
                  onChange={e => setSettings({...settings, phone: e.target.value})}
                  placeholder="012 345 678"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-medium"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">អ៊ីមែល (Email)</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="email" 
                  value={settings.email}
                  onChange={e => setSettings({...settings, email: e.target.value})}
                  placeholder="admin@school.edu.kh"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-medium"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">អាសយដ្ឋាន (Address)</label>
              <div className="relative">
                <MapPin className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
                <textarea 
                  value={settings.address}
                  onChange={e => setSettings({...settings, address: e.target.value})}
                  placeholder="បញ្ចូលអាសយដ្ឋានលម្អិត..."
                  rows="2"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-medium resize-none"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
