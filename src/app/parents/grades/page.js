'use client';
import { FileText, Award, Download, TrendingUp, Search } from 'lucide-react';

export default function ParentGrades() {
  const grades = [
    { id: 1, subject: 'គណិតវិទ្យា (Math)', score: 95, grade: 'A', status: 'Excellent', date: 'Jul 2026' },
    { id: 2, subject: 'រូបវិទ្យា (Physics)', score: 88, grade: 'B+', status: 'Good', date: 'Jul 2026' },
    { id: 3, subject: 'គីមីវិទ្យា (Chemistry)', score: 65, grade: 'C', status: 'Average', date: 'Jul 2026' },
    { id: 4, subject: 'ជីវវិទ្យា (Biology)', score: 92, grade: 'A', status: 'Excellent', date: 'Jul 2026' },
    { id: 5, subject: 'អក្សរសាស្រ្តខ្មែរ (Khmer)', score: 85, grade: 'B', status: 'Good', date: 'Jul 2026' },
    { id: 6, subject: 'ភាសាអង់គ្លេស (English)', score: 98, grade: 'A+', status: 'Outstanding', date: 'Jul 2026' },
  ];

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">លទ្ធផលសិក្សា (Grades)</h1>
          <p className="text-slate-500 font-medium mt-1">ពិន្ទុ និងចំណាត់ថ្នាក់ប្រចាំខែ</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="ស្វែងរកមុខវិជ្ជា..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
            <Download className="w-5 h-5" /> ទាញយកសៀវភៅ (PDF)
          </button>
        </div>
      </header>

      {/* Overview Score */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-lg mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-inner">
              <Award className="w-10 h-10 text-white" />
            </div>
            <div>
              <p className="text-indigo-100 font-bold text-sm uppercase tracking-wider mb-1">ពិន្ទុសរុបប្រចាំខែ (Total Score)</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-4xl font-black">523</h2>
                <span className="text-indigo-200 font-medium">/ 600</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-black/20 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10">
            <TrendingUp className="w-8 h-8 text-emerald-400" />
            <div>
              <p className="text-sm font-bold text-slate-300">មធ្យមភាគ (GPA)</p>
              <p className="text-2xl font-black text-white">87.16%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex-1 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h2 className="font-bold text-slate-700 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" /> ពិន្ទុតាមមុខវិជ្ជា (Subject Breakdown)
          </h2>
          <select className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20">
            <option>ខែកក្កដា (July 2026)</option>
            <option>ខែមិថុនា (June 2026)</option>
          </select>
        </div>
        
        <div className="overflow-x-auto flex-1 p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4 pl-6">មុខវិជ្ជា (Subject)</th>
                <th className="p-4 text-center">ពិន្ទុ (Score)</th>
                <th className="p-4 text-center">និទ្ទេស (Grade)</th>
                <th className="p-4">ការវាយតម្លៃ (Remarks)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {grades.map(grade => (
                <tr key={grade.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 pl-6 font-bold text-slate-700">
                    {grade.subject}
                  </td>
                  <td className="p-4 text-center font-black text-lg text-slate-800">
                    {grade.score}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-block w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mx-auto ${
                      grade.score >= 90 ? 'bg-emerald-100 text-emerald-700' :
                      grade.score >= 80 ? 'bg-blue-100 text-blue-700' :
                      grade.score >= 70 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {grade.grade.replace('+','').replace('-','')}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-medium text-slate-600">{grade.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
