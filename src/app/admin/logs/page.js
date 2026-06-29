'use client';
import { useState, useEffect } from 'react';
import { ShieldAlert, Clock, Loader2, User } from 'lucide-react';

export default function AdminLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/logs');
      const json = await res.json();
      if (json.success) {
        setLogs(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">កំណត់ត្រាសកម្មភាព (Audit Logs)</h1>
        <p className="text-slate-500 font-medium mt-1">ត្រួតពិនិត្យរាល់សកម្មភាពក្នុងប្រព័ន្ធដើម្បីសុវត្ថិភាព</p>
      </header>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex-1 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-indigo-500" />
          <h2 className="font-bold text-slate-700">ប្រវត្តិសកម្មភាពថ្មីៗ</h2>
        </div>
        
        <div className="overflow-x-auto flex-1 p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4 pl-6">កាលបរិច្ឆេទ (Time)</th>
                <th className="p-4">អ្នកប្រើប្រាស់ (User)</th>
                <th className="p-4">សកម្មភាព (Action)</th>
                <th className="p-4">ព័ត៌មានលម្អិត (Details)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" /> កំពុងទាញយក...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-400 font-medium">មិនមានកំណត់ត្រានៅឡើយទេ</td>
                </tr>
              ) : logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors text-sm">
                  <td className="p-4 pl-6 text-slate-500 flex items-center gap-2 whitespace-nowrap">
                    <Clock className="w-4 h-4" />
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4 font-bold text-slate-700 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center"><User className="w-3 h-3" /></div>
                    {log.user ? log.user.name : 'System'}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 font-mono text-xs border border-slate-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
