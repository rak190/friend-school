'use client';
import { useState } from 'react';
import { Database, Download, AlertTriangle, CheckCircle2, Loader2, HardDrive } from 'lucide-react';

export default function AdminBackupPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle', 'generating', 'success'

  const handleBackup = () => {
    setLoading(true);
    setStatus('generating');
    
    // Mock backup generation
    setTimeout(() => {
      setLoading(false);
      setStatus('success');
      
      // Trigger a mock download
      const data = JSON.stringify({ message: "Mock Database Backup Data" }, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Reset status after a while
      setTimeout(() => setStatus('idle'), 5000);
    }, 2500);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300 max-w-3xl mx-auto w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">បម្រុងទុកទិន្នន័យ (Database Backup)</h1>
        <p className="text-slate-500 font-medium mt-1">ទាញយកទិន្នន័យទាំងអស់នៃប្រព័ន្ធទុកជាឯកសារ</p>
      </header>

      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500"></div>
        
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-lg">
          <Database className="w-10 h-10 text-indigo-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-800 mb-2">ទាញយកទិន្នន័យច្បាប់ចម្លង</h2>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">
          ការបម្រុងទុកទិន្នន័យជាប្រចាំគឺមានសារៈសំខាន់ណាស់ដើម្បីការពារការបាត់បង់ទិន្នន័យ។ ទិន្នន័យនឹងត្រូវបានទាញយកជាទម្រង់ JSON/SQL។
        </p>

        {status === 'idle' && (
          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={handleBackup}
              className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-300"
            >
              <Download className="w-6 h-6" /> ចាប់ផ្តើមបម្រុងទុក (Start Backup)
            </button>
            <div className="flex items-center gap-2 text-sm text-amber-600 font-medium bg-amber-50 px-4 py-2 rounded-xl">
              <AlertTriangle className="w-4 h-4" /> សូមកុំបិទទំព័រនេះពេលកំពុងដំណើរការ
            </div>
          </div>
        )}

        {status === 'generating' && (
          <div className="flex flex-col items-center gap-4 py-4">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            <div className="text-lg font-bold text-slate-700">កំពុងចងក្រងទិន្នន័យ... (Generating)</div>
            <p className="text-slate-400 text-sm">សូមរង់ចាំបន្តិច...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-4 py-4 animate-in zoom-in duration-300">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            <div className="text-xl font-bold text-emerald-600">ប្រតិបត្តិការជោគជ័យ!</div>
            <p className="text-slate-500 text-sm">ឯកសារបម្រុងទុកកំពុងត្រូវបានទាញយក។</p>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between text-left text-sm">
          <div className="flex items-center gap-3 text-slate-500">
            <HardDrive className="w-5 h-5 text-slate-400" /> 
            <div>
              <p className="font-bold text-slate-700">ទំហំប្រមាណ (Estimated Size)</p>
              <p>~125 MB</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-slate-700">បម្រុងទុកចុងក្រោយ</p>
            <p className="text-slate-500">ម្សិលមិញ ម៉ោង 23:00</p>
          </div>
        </div>

      </div>
    </div>
  );
}
