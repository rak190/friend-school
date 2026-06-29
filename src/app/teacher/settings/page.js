'use client';
import { useState } from 'react';
import { User, Bell, Lock, Globe, Save, CheckCircle2 } from 'lucide-react';

export default function TeacherSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  
  // States for Security Tab
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState(null); // { type: 'success' | 'error', message: string }
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // States for Notifications (Mockup)
  const [notifications, setNotifications] = useState({
    email: true,
    newStudent: true,
    systemUpdates: false
  });

  // State for Language (Mockup)
  const [language, setLanguage] = useState('kh');

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordStatus(null);
    
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'ពាក្យសម្ងាត់ថ្មីមិនផ្ទៀងផ្ទាត់ទេ។ (Passwords do not match)' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordStatus({ type: 'error', message: 'ពាក្យសម្ងាត់ថ្មីត្រូវមានយ៉ាងហោចណាស់ ៦ តួអក្សរ។ (Minimum 6 characters)' });
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await fetch('/api/auth/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setPasswordStatus({ type: 'success', message: 'ផ្លាស់ប្តូរពាក្យសម្ងាត់បានជោគជ័យ! (Password changed successfully)' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordStatus({ type: 'error', message: data.error || 'មានបញ្ហាក្នុងការផ្លាស់ប្តូរពាក្យសម្ងាត់។' });
      }
    } catch (err) {
      setPasswordStatus({ type: 'error', message: 'Internal server error' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const navItems = [
    { id: 'profile', icon: User, label: 'ព័ត៌មានផ្ទាល់ខ្លួន' },
    { id: 'notifications', icon: Bell, label: 'ការជូនដំណឹង' },
    { id: 'security', icon: Lock, label: 'សុវត្ថិភាព និងពាក្យសម្ងាត់' },
    { id: 'language', icon: Globe, label: 'ភាសា' }
  ];

  return (
    <>
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">ការកំណត់</h1>
          <p className="text-sm font-medium text-brand-muted mt-1">គ្រប់គ្រងគណនី និងចំណូលចិត្តរបស់អ្នក</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-brand-blue px-6 py-2.5 rounded-full shadow-sm shadow-blue-200 text-white font-bold hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm">
            <Save className="w-4 h-4" /> រក្សាទុក
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 space-y-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 font-semibold px-4 py-3 rounded-xl transition-colors text-sm ${
                  isActive 
                  ? 'bg-blue-50 text-brand-blue font-bold border border-blue-100' 
                  : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-blue' : 'text-slate-400'}`} /> {item.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-[24px] border border-slate-100 p-6 sm:p-8 shadow-sm min-h-[500px]">
            
            {activeTab === 'profile' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-xl font-bold text-slate-800 mb-6">ព័ត៌មានផ្ទាល់ខ្លួន</h2>
                
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-100">
                  <div className="w-24 h-24 rounded-full bg-brand-yellow flex items-center justify-center text-yellow-900 font-bold text-3xl border-4 border-white shadow-md">NR</div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">រូបតំណាង</h3>
                    <p className="text-xs text-brand-muted mb-3">រូបភាពប្រភេទ PNG ឬ JPG (អតិបរមា 2MB)</p>
                    <div className="flex gap-2">
                      <button className="bg-white border border-slate-200 px-4 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50">ប្តូររូប</button>
                      <button className="bg-red-50 text-red-600 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-red-100">លុបចេញ</button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">នាមត្រកូល</label>
                    <input type="text" defaultValue="Norak" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">នាមខ្លួន</label>
                    <input type="text" defaultValue="Run" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">អ៊ីមែល</label>
                    <input type="email" defaultValue="teacher@school.edu.kh" disabled className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 cursor-not-allowed" />
                    <p className="text-[10px] text-slate-400 mt-1">អ៊ីមែលស្ថាប័នមិនអាចកែប្រែបានទេ</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">លេខទូរស័ព្ទ</label>
                    <input type="tel" defaultValue="012 345 678" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">ជីវប្រវត្តិសង្ខេប / ជំនាញបង្រៀន</label>
                    <textarea rows="3" defaultValue="គ្រូបង្រៀនមុខវិជ្ជាគណិតវិទ្យា និងរូបវិទ្យា។" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all resize-none"></textarea>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-xl font-bold text-slate-800 mb-6">ការជូនដំណឹង (Notifications)</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-800">សារតាមអ៊ីមែល (Email Alerts)</h4>
                      <p className="text-xs text-slate-500 mt-1">ទទួលបានអ៊ីមែលនៅពេលមានការជូនដំណឹងសំខាន់ៗ។</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={notifications.email} onChange={(e) => setNotifications({...notifications, email: e.target.checked})} className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-800">សិស្សថ្មីចូលថ្នាក់ (New Student Alerts)</h4>
                      <p className="text-xs text-slate-500 mt-1">ទទួលបានការជូនដំណឹងនៅពេលមានសិស្សថ្មីត្រូវបានចុះឈ្មោះក្នុងថ្នាក់របស់អ្នក។</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={notifications.newStudent} onChange={(e) => setNotifications({...notifications, newStudent: e.target.checked})} className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-800">ការធ្វើបច្ចុប្បន្នភាពប្រព័ន្ធ (System Updates)</h4>
                      <p className="text-xs text-slate-500 mt-1">ទទួលបានព័ត៌មានអំពីការអាប់ដេតប្រព័ន្ធថ្មីៗពីសាលា។</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={notifications.systemUpdates} onChange={(e) => setNotifications({...notifications, systemUpdates: e.target.checked})} className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-xl font-bold text-slate-800 mb-6">សុវត្ថិភាព និងពាក្យសម្ងាត់</h2>
                
                <form onSubmit={handlePasswordSubmit} className="max-w-md space-y-5">
                  {passwordStatus && (
                    <div className={`p-4 rounded-xl flex items-center gap-3 ${passwordStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                      {passwordStatus.type === 'success' && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
                      <p className="text-sm font-bold">{passwordStatus.message}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">ពាក្យសម្ងាត់ចាស់</label>
                    <input 
                      type="password" 
                      required
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">ពាក្យសម្ងាត់ថ្មី</label>
                    <input 
                      type="password" 
                      required
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">បញ្ជាក់ពាក្យសម្ងាត់ថ្មី</label>
                    <input 
                      type="password" 
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all" 
                    />
                  </div>
                  
                  <button type="submit" disabled={isChangingPassword} className="bg-slate-800 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-700 transition-colors disabled:opacity-50 mt-4">
                    {isChangingPassword ? 'កំពុងផ្លាស់ប្តូរ...' : 'ផ្លាស់ប្តូរពាក្យសម្ងាត់'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'language' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-xl font-bold text-slate-800 mb-6">ភាសា (Language)</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
                  
                  <label className={`cursor-pointer flex items-center justify-between p-4 rounded-xl border-2 transition-all ${language === 'kh' ? 'border-brand-blue bg-blue-50/50' : 'border-slate-100 hover:border-slate-200'}`}>
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">🇰🇭</span>
                      <div>
                        <p className="font-bold text-slate-800">ភាសាខ្មែរ</p>
                        <p className="text-xs text-slate-500">Khmer (Default)</p>
                      </div>
                    </div>
                    <input 
                      type="radio" 
                      name="lang" 
                      value="kh" 
                      checked={language === 'kh'}
                      onChange={() => setLanguage('kh')}
                      className="w-5 h-5 text-brand-blue border-slate-300 focus:ring-brand-blue" 
                    />
                  </label>

                  <label className={`cursor-pointer flex items-center justify-between p-4 rounded-xl border-2 transition-all ${language === 'en' ? 'border-brand-blue bg-blue-50/50' : 'border-slate-100 hover:border-slate-200'}`}>
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">🇺🇸</span>
                      <div>
                        <p className="font-bold text-slate-800">English</p>
                        <p className="text-xs text-slate-500">US English</p>
                      </div>
                    </div>
                    <input 
                      type="radio" 
                      name="lang" 
                      value="en" 
                      checked={language === 'en'}
                      onChange={() => setLanguage('en')}
                      className="w-5 h-5 text-brand-blue border-slate-300 focus:ring-brand-blue" 
                    />
                  </label>

                </div>
                {language === 'en' && (
                  <p className="mt-4 text-sm font-semibold text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200 max-w-lg">
                    ចំណាំ៖ ការបកប្រែជាភាសាអង់គ្លេសកំពុងស្ថិតក្នុងការអភិវឌ្ឍន៍នៅឡើយ។<br/>
                    (Note: English translation is still under development.)
                  </p>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
