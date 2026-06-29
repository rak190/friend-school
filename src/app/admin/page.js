'use client';
import { useState, useEffect } from 'react';
import { Users, GraduationCap, School, UserCircle, Activity, Loader2, Clock } from 'lucide-react';

export default function AdminOverview() {
  const [stats, setStats] = useState({
    users: 0,
    students: 0,
    classes: 0,
    teachers: 0
  });
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch dashboard stats
        const resStats = await fetch('/api/dashboard');
        const jsonStats = await resStats.json();
        
        if (jsonStats.success) {
          setStats({
            users: jsonStats.data.totalUsers || 0,
            students: jsonStats.data.totalStudents || 0,
            classes: jsonStats.data.totalClasses || 0,
            teachers: jsonStats.data.totalTeachers || 0
          });
        }

        // Fetch recent logs
        const resLogs = await fetch('/api/logs');
        const jsonLogs = await resLogs.json();
        
        if (jsonLogs.success) {
          setRecentLogs(jsonLogs.data.slice(0, 5)); // Only show top 5
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-500" /></div>;

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">ទិដ្ឋភាពទូទៅ (System Overview)</h1>
        <p className="text-slate-500 font-medium mt-1">ស្ថិតិប្រព័ន្ធពិតប្រាកដ (Real-time Database Stats)</p>
      </header>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                <Users size={24} />
              </div>
            </div>
            <h3 className="text-3xl font-black text-slate-800 mb-1">{stats.users}</h3>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">អ្នកប្រើប្រាស់សរុប (Users)</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <GraduationCap size={24} />
              </div>
            </div>
            <h3 className="text-3xl font-black text-slate-800 mb-1">{stats.students}</h3>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">សិស្សសរុប (Students)</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-colors">
                <UserCircle size={24} />
              </div>
            </div>
            <h3 className="text-3xl font-black text-slate-800 mb-1">{stats.teachers}</h3>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">គ្រូបង្រៀនសរុប (Teachers)</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <School size={24} />
              </div>
            </div>
            <h3 className="text-3xl font-black text-slate-800 mb-1">{stats.classes}</h3>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">ថ្នាក់រៀនសរុប (Classes)</p>
          </div>
        </div>

      </div>

      {/* RECENT ACTIVITY LOGS */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-8">
        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Activity className="text-indigo-500 w-5 h-5" /> សកម្មភាពថ្មីៗក្នុងប្រព័ន្ធ (Recent Activity)
        </h2>
        
        <div className="space-y-4">
          {recentLogs.length === 0 ? (
            <p className="text-slate-500 text-center py-4">មិនមានកំណត់ត្រានៅឡើយទេ</p>
          ) : recentLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-700">{log.user ? log.user.name : 'System'}</p>
                  <span className="text-xs text-slate-400 font-medium">{new Date(log.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm text-slate-500 mt-1">{log.details}</p>
                <div className="mt-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                    {log.action}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
