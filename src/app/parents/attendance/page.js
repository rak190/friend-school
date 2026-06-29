'use client';
import { CalendarCheck, AlertTriangle, UserCheck, CalendarX, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ParentAttendance() {
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">កំណត់ត្រាអវត្តមាន (Attendance)</h1>
        <p className="text-slate-500 font-medium mt-1">តាមដានវត្តមានរបស់កូនអ្នកប្រចាំខែ</p>
      </header>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shrink-0 shadow-md shadow-emerald-200">
            <UserCheck size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-700">វត្តមានសរុប (Present)</p>
            <h3 className="text-2xl font-black text-emerald-900">45 ថ្ងៃ</h3>
          </div>
        </div>
        <div className="bg-rose-50 rounded-3xl p-6 border border-rose-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center text-white shrink-0 shadow-md shadow-rose-200">
            <CalendarX size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-rose-700">អវត្តមានសរុប (Absent)</p>
            <h3 className="text-2xl font-black text-rose-900">2 ថ្ងៃ</h3>
          </div>
        </div>
        <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-white shrink-0 shadow-md shadow-amber-200">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-amber-700">យឺត (Late)</p>
            <h3 className="text-2xl font-black text-amber-900">1 ដង</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 flex-1">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <CalendarCheck className="text-indigo-500 w-5 h-5" /> ប្រវត្តិលម្អិត
          </h2>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"><ChevronLeft size={20} /></button>
            <span className="font-bold text-slate-800">ខែកក្កដា 2026 (July)</span>
            <button className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"><ChevronRight size={20} /></button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-rose-50 rounded-2xl border border-rose-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex flex-col items-center justify-center text-rose-600 font-bold shadow-sm border border-rose-100">
                <span className="text-xs font-medium">ថ្ងៃទី</span>
                <span className="text-lg leading-none">12</span>
              </div>
              <div>
                <h4 className="font-bold text-rose-900">អវត្តមាន (ឈឺ)</h4>
                <p className="text-sm text-rose-700">មានច្បាប់អនុញ្ញាតពីគ្រូ</p>
              </div>
            </div>
            <span className="bg-rose-200 text-rose-800 font-bold px-3 py-1 rounded-full text-sm">Absent</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl border border-amber-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex flex-col items-center justify-center text-amber-600 font-bold shadow-sm border border-amber-100">
                <span className="text-xs font-medium">ថ្ងៃទី</span>
                <span className="text-lg leading-none">05</span>
              </div>
              <div>
                <h4 className="font-bold text-amber-900">មកយឺត (15 នាទី)</h4>
                <p className="text-sm text-amber-700">មកយឺតម៉ោងទី១</p>
              </div>
            </div>
            <span className="bg-amber-200 text-amber-800 font-bold px-3 py-1 rounded-full text-sm">Late</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-rose-50 rounded-2xl border border-rose-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex flex-col items-center justify-center text-rose-600 font-bold shadow-sm border border-rose-100">
                <span className="text-xs font-medium">ថ្ងៃទី</span>
                <span className="text-lg leading-none">02</span>
              </div>
              <div>
                <h4 className="font-bold text-rose-900">អវត្តមាន (គ្មានច្បាប់)</h4>
                <p className="text-sm text-rose-700">មិនបានផ្តល់ដំណឹងដល់គ្រូ</p>
              </div>
            </div>
            <span className="bg-rose-200 text-rose-800 font-bold px-3 py-1 rounded-full text-sm">Absent</span>
          </div>
        </div>
      </div>
    </div>
  );
}
