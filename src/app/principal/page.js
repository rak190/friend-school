'use client';
import { useState, useEffect } from 'react';
import { Search, ArrowUpRight, Globe, MessageCircle, Camera, Link2 } from 'lucide-react';

export default function PrincipalOverviewPage() {
  const [stats, setStats] = useState({ totalStudents: 2450, totalTeachers: 179 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/dashboard');
        const json = await res.json();
        if (json.success) {
          setStats(json.data);
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <>
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">ទិដ្ឋភាពទូទៅសាលា</h1>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="ស្វែងរក..." className="w-full bg-white border-none rounded-full py-3 pl-12 pr-4 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue text-slate-700 placeholder:text-slate-400" />
          </div>
        </div>
      </header>

      {/* 4 Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-6">
        <div className="bg-brand-yellow rounded-[20px] p-6 relative">
          <div className="absolute top-4 right-4 w-8 h-8 rounded-full border border-yellow-800 flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4 text-yellow-900" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-1">{loading ? '...' : stats.totalStudents}</h2>
          <p className="text-sm font-semibold text-yellow-900">ចុះឈ្មោះសរុប</p>
        </div>
        <div className="bg-brand-yellow rounded-[20px] p-6 relative">
          <div className="absolute top-4 right-4 w-8 h-8 rounded-full border border-yellow-800 flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4 text-yellow-900" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-1">{loading ? '...' : stats.totalTeachers}</h2>
          <p className="text-sm font-semibold text-yellow-900">គ្រូបង្រៀន</p>
        </div>
        <div className="bg-brand-yellow rounded-[20px] p-6 relative">
          <div className="absolute top-4 right-4 w-8 h-8 rounded-full border border-yellow-800 flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4 text-yellow-900" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-1">$1.2M</h2>
          <p className="text-sm font-semibold text-yellow-900">ចំណូលប្រចាំឆ្នាំ</p>
        </div>
        <div className="bg-brand-blue rounded-[20px] p-6 relative text-white">
          <div className="absolute top-4 right-4 w-8 h-8 rounded-full border border-blue-300 flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4 text-blue-100" />
          </div>
          <h2 className="text-3xl font-bold mb-1">94%</h2>
          <p className="text-sm font-medium text-blue-100">វត្តមានមធ្យម</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 lg:gap-6 mb-6">
        {/* Earnings Line Chart */}
        <div className="bg-white p-6 rounded-[24px] shadow-sm flex flex-col overflow-x-auto min-h-[350px]">
          <div className="flex justify-between items-center mb-4 shrink-0">
            <h3 className="font-bold text-slate-800">របាយការណ៍ហិរញ្ញវត្ថុ</h3>
            <span className="text-xs font-semibold text-brand-muted bg-slate-50 px-2 py-1 rounded">ឆ្នាំ 2026 ⌄</span>
          </div>
          <div className="flex gap-4 mb-4 shrink-0">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-brand-yellow"></div><span className="text-xs text-brand-muted">ចំណូល</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-brand-blue"></div><span className="text-xs text-brand-muted">ចំណាយ</span></div>
          </div>
          <div className="flex-1 w-full min-w-[500px] relative pt-4 h-64">
             <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] font-medium text-brand-muted pb-6 z-10">
              <span>200K</span><span>150K</span><span>100K</span><span>50K</span><span>0</span>
            </div>
            <div className="w-full h-full pl-8 pb-6 flex items-end relative">
              <div className="absolute top-2 left-8 right-0 border-t border-slate-100"></div>
              <div className="absolute top-1/4 left-8 right-0 border-t border-slate-100"></div>
              <div className="absolute top-2/4 left-8 right-0 border-t border-slate-100"></div>
              <div className="absolute top-3/4 left-8 right-0 border-t border-slate-100"></div>
              <div className="absolute bottom-6 left-8 right-0 border-t border-slate-100"></div>
              
              <svg className="w-full h-full overflow-visible z-10" viewBox="0 0 500 100" preserveAspectRatio="none">
                <path d="M0,80 Q50,90 100,70 T200,60 T300,50 T400,20 T500,40" fill="none" stroke="#FFCF59" strokeWidth="3"/>
                <path d="M0,90 Q50,100 100,85 T200,75 T300,40 T400,60 T500,20" fill="none" stroke="#155EEF" strokeWidth="3"/>
              </svg>
            </div>
            <div className="absolute bottom-0 left-8 right-0 flex justify-between text-[10px] font-medium text-brand-muted px-2">
              <span>មករា</span><span>កុម្ភៈ</span><span>មិនា</span><span>មេសា</span><span>ឧសភា</span><span>មិថុនា</span><span>កក្កដា</span><span>សីហា</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Text */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-xs font-semibold text-brand-muted mt-auto pt-6 justify-between items-center text-center sm:text-left">
        <div>រក្សាសិទ្ធិគ្រប់យ៉ាង © 2026 អនាគតល្អ Good Future <span className="hidden sm:inline mx-4">គោលការណ៍ឯកជនភាព</span> <span className="hidden sm:inline mx-4">លក្ខខណ្ឌប្រើប្រាស់</span> <span className="hidden sm:inline">ទំនាក់ទំនង</span></div>
        <div className="flex gap-3">
          <Globe className="w-4 h-4" />
          <MessageCircle className="w-4 h-4" />
          <Camera className="w-4 h-4" />
          <Link2 className="w-4 h-4" />
        </div>
      </div>
    </>
  );
}
