'use client';
import { Award, Target, BookOpen, AlertCircle, TrendingUp } from 'lucide-react';

export default function ParentOverview() {
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">ទិដ្ឋភាពទូទៅ (Overview)</h1>
        <p className="text-slate-500 font-medium mt-1">សង្ខេបលទ្ធផលសិក្សា និងអវត្តមាន</p>
      </header>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 flex items-center gap-5 group hover:-translate-y-1 transition-all duration-300">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
            <Award size={28} />
          </div>
          <div>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-1">មធ្យមភាគ (GPA)</p>
            <h3 className="text-3xl font-black text-slate-800">A- <span className="text-sm text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full ml-1">ល្អណាស់</span></h3>
          </div>
        </div>
        
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 flex items-center gap-5 group hover:-translate-y-1 transition-all duration-300">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-colors">
            <AlertCircle size={28} />
          </div>
          <div>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-1">អវត្តមានសរុប (Absences)</p>
            <h3 className="text-3xl font-black text-slate-800">2 <span className="text-sm text-slate-500 font-medium">ថ្ងៃ</span></h3>
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 flex items-center gap-5 group hover:-translate-y-1 transition-all duration-300">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
            <Target size={28} />
          </div>
          <div>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-1">ចំណាត់ថ្នាក់ (Rank)</p>
            <h3 className="text-3xl font-black text-slate-800">លេខ 3 <span className="text-sm text-slate-500 font-medium">/ 35</span></h3>
          </div>
        </div>
      </div>

      {/* Progress Chart & Recent Subjects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp className="text-indigo-500 w-5 h-5" /> វឌ្ឍនភាពសិក្សាប្រចាំខែ
          </h2>
          <div className="flex items-end justify-between h-48 pt-4">
            {/* Mock Chart */}
            {[65, 78, 85, 82, 90, 88].map((val, i) => (
              <div key={i} className="flex flex-col items-center gap-2 w-full">
                <div className="w-8 md:w-12 bg-indigo-100 rounded-t-lg relative group">
                  <div 
                    className="absolute bottom-0 w-full bg-indigo-500 rounded-t-lg transition-all duration-1000"
                    style={{ height: `${val}%` }}
                  ></div>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {val}%
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-400">ខែ {i+1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <BookOpen className="text-purple-500 w-5 h-5" /> មុខវិជ្ជាលេចធ្លោ
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div>
                <h4 className="font-bold text-slate-700">គណិតវិទ្យា (Math)</h4>
                <p className="text-xs text-slate-500">ពិន្ទុខែមុន: 95/100</p>
              </div>
              <span className="bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-full text-sm">ល្អឥតខ្ចោះ</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div>
                <h4 className="font-bold text-slate-700">រូបវិទ្យា (Physics)</h4>
                <p className="text-xs text-slate-500">ពិន្ទុខែមុន: 88/100</p>
              </div>
              <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-sm">ល្អណាស់</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-rose-100">
              <div>
                <h4 className="font-bold text-slate-700">គីមីវិទ្យា (Chemistry)</h4>
                <p className="text-xs text-rose-500 font-medium">ត្រូវការការយកចិត្តទុកដាក់បន្តិច</p>
              </div>
              <span className="bg-amber-100 text-amber-700 font-bold px-3 py-1 rounded-full text-sm">មធ្យម 65/100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
