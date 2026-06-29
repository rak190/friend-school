'use client';
import { useState, useEffect } from 'react';
import { 
  Search, Mic, ArrowUpRight, 
  MoreHorizontal, Award, Medal, Trophy, Globe, MessageCircle, Camera, Link2
} from 'lucide-react';

export default function TeacherDashboard() {
  const [stats, setStats] = useState({ totalStudents: 142, totalClasses: 5, totalUsers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/dashboard');
        const text = await res.text();
        if (!res.ok) {
          console.error('API Error:', res.status, text);
          setLoading(false);
          return;
        }
        if (!text) {
          console.error('Empty response from /api/dashboard');
          setLoading(false);
          return;
        }
        const json = JSON.parse(text);
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
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">ផ្ទាំងគ្រប់គ្រងគ្រូបង្រៀន</h1>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="ស្វែងរក..." className="w-full bg-white border-none rounded-full py-3 pl-12 pr-4 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue text-slate-700 placeholder:text-slate-400" />
          </div>
          <button className="bg-brand-yellow p-3 rounded-full shadow-sm text-yellow-900 hover:bg-yellow-400 transition-colors shrink-0">
            <Mic className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-6">
        <div className="bg-brand-yellow rounded-[20px] p-6 relative">
          <div className="absolute top-4 right-4 w-8 h-8 rounded-full border border-yellow-800 flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4 text-yellow-900" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-1">{loading ? '...' : stats.totalStudents}</h2>
          <p className="text-sm font-semibold text-yellow-900">សិស្សសរុប</p>
        </div>
        <div className="bg-brand-yellow rounded-[20px] p-6 relative">
          <div className="absolute top-4 right-4 w-8 h-8 rounded-full border border-yellow-800 flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4 text-yellow-900" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-1">{loading ? '...' : stats.totalClasses}</h2>
          <p className="text-sm font-semibold text-yellow-900">ថ្នាក់កំពុងបង្រៀន</p>
        </div>
        <div className="bg-brand-yellow rounded-[20px] p-6 relative">
          <div className="absolute top-4 right-4 w-8 h-8 rounded-full border border-yellow-800 flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4 text-yellow-900" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-1">98%</h2>
          <p className="text-sm font-semibold text-yellow-900">អត្រាវត្តមាន</p>
        </div>
        <div className="bg-brand-blue rounded-[20px] p-6 relative text-white">
          <div className="absolute top-4 right-4 w-8 h-8 rounded-full border border-blue-300 flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4 text-blue-100" />
          </div>
          <h2 className="text-3xl font-bold mb-1">12</h2>
          <p className="text-sm font-medium text-blue-100">ការងាររង់ចាំ</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 mb-6">
        {/* Students Donut */}
        <div className="lg:col-span-4 bg-white p-6 rounded-[24px] shadow-sm flex flex-col justify-between min-h-[300px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">សិស្ស</h3>
            <span className="text-xs font-semibold text-brand-muted bg-slate-50 px-2 py-1 rounded">ថ្នាក់ 8C ⌄</span>
          </div>
          <div className="flex justify-center mb-6 flex-1 items-center">
            <div className="donut-chart scale-90 sm:scale-100">
              <div className="donut-inner">
                <span className="text-xs text-brand-muted font-medium">សរុប</span>
                <span className="text-2xl font-bold text-slate-800">427</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between px-4 mt-auto">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-brand-yellow"></div><span className="text-xs text-brand-muted">ស្រី</span></div>
              <span className="font-bold text-slate-800">234</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-brand-blue"></div><span className="text-xs text-brand-muted">ប្រុស</span></div>
              <span className="font-bold text-slate-800">193</span>
            </div>
          </div>
        </div>

        {/* Class Line Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-[24px] shadow-sm flex flex-col min-h-[300px] overflow-x-auto">
          <div className="flex justify-between items-center mb-4 shrink-0">
            <h3 className="font-bold text-slate-800">លទ្ធផលសិក្សា</h3>
            <span className="text-xs font-semibold text-brand-muted bg-slate-50 px-2 py-1 rounded">៨ ខែចុងក្រោយ ⌄</span>
          </div>
          <div className="flex gap-4 mb-4 shrink-0">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-brand-yellow"></div><span className="text-xs text-brand-muted">ពិន្ទុមធ្យម</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-brand-blue"></div><span className="text-xs text-brand-muted">ពិន្ទុខ្ពស់បំផុត</span></div>
          </div>
          <div className="flex-1 w-full min-w-[500px] relative pt-4">
             <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] font-medium text-brand-muted pb-6 z-10">
              <span>100</span><span>75</span><span>50</span><span>25</span><span>0</span>
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

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 mb-6">
        {/* Attendance Bar Chart */}
        <div className="lg:col-span-5 bg-white p-6 rounded-[24px] shadow-sm flex flex-col min-h-[300px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">វត្តមាន</h3>
            <span className="text-xs font-semibold text-brand-muted bg-slate-50 px-2 py-1 rounded">ប្រចាំសប្តាហ៍ ⌄</span>
          </div>
          <div className="flex gap-4 mb-4">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-brand-yellow"></div><span className="text-[10px] text-brand-muted">វត្តមាន</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-brand-blue"></div><span className="text-[10px] text-brand-muted">អវត្តមាន</span></div>
          </div>
          <div className="flex-1 flex pt-2 overflow-x-auto">
            <div className="min-w-[200px] w-full flex">
             <div className="flex flex-col justify-between text-[10px] font-medium text-brand-muted pb-5 pr-2">
              <span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span>
            </div>
            <div className="flex-1 flex justify-between items-end pb-5 relative px-2">
              <div className="w-[10%] max-w-8 h-full flex flex-col justify-end"><div className="w-full bg-brand-blue rounded-t-sm h-[10%]"></div><div className="w-full bg-brand-yellow rounded-b-sm h-[70%]"></div></div>
              <div className="w-[10%] max-w-8 h-full flex flex-col justify-end"><div className="w-full bg-brand-blue rounded-t-sm h-[20%]"></div><div className="w-full bg-brand-yellow rounded-b-sm h-[60%]"></div></div>
              <div className="w-[10%] max-w-8 h-full flex flex-col justify-end"><div className="w-full bg-brand-blue rounded-t-sm h-[5%]"></div><div className="w-full bg-brand-yellow rounded-b-sm h-[80%]"></div></div>
              <div className="w-[10%] max-w-8 h-full flex flex-col justify-end relative">
                <div className="hidden sm:block absolute -top-10 left-1/2 -translate-x-1/2 bg-white shadow-lg border border-slate-100 rounded p-1 text-[8px] whitespace-nowrap z-10 font-medium">វត្តមាន: 70%<br/>អវត្តមាន: 30%</div>
                <div className="w-full bg-brand-blue rounded-t-sm h-[30%]"></div><div className="w-full bg-brand-yellow rounded-b-sm h-[70%]"></div>
              </div>
              <div className="w-[10%] max-w-8 h-full flex flex-col justify-end"><div className="w-full bg-brand-blue rounded-t-sm h-[15%]"></div><div className="w-full bg-brand-yellow rounded-b-sm h-[65%]"></div></div>
              
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] font-medium text-brand-muted px-3">
                <span>ច័ន្ទ</span><span>អង្គារ</span><span>ពុធ</span><span>ព្រហ.</span><span>សុក្រ</span>
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* Student Activities */}
        <div className="lg:col-span-7 bg-white p-6 rounded-[24px] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">សកម្មភាពសិស្ស</h3>
            <MoreHorizontal className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-5">
            <div className="flex gap-4 items-start">
              <div className="bg-brand-blue text-white p-2.5 rounded-full shrink-0"><Award className="w-4 h-4" /></div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-800">ឧបករណ៍វាស់កម្ពស់ស្វ័យប្រវត្តិ</h4>
                <p className="text-xs text-brand-muted mt-1 leading-relaxed">ផ្នែកទី 8C បានអនុវត្តតក្កវិជ្ជា mBlock 5 ដោយជោគជ័យ។</p>
              </div>
              <div className="text-[10px] text-right font-medium text-brand-muted shrink-0">ឧសភា 5<br/>1:30 រសៀល</div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-brand-yellow text-yellow-900 p-2.5 rounded-full shrink-0"><Medal className="w-4 h-4" /></div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-800">មេដាយមាស ICT អូឡាំពិក</h4>
                <p className="text-xs text-brand-muted mt-1 leading-relaxed">សិស្សដោះស្រាយបញ្ហាស្មុគស្មាញដោយជំនាញលេចធ្លោ។</p>
              </div>
              <div className="text-[10px] text-right font-medium text-brand-muted shrink-0">មេសា 10<br/>10:00 ព្រឹក</div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-brand-blue text-white p-2.5 rounded-full shrink-0"><Trophy className="w-4 h-4" /></div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-800">ចំណាត់ថ្នាក់លេខ១ ពិព័រណ៍វិទ្យាសាស្ត្រ</h4>
                <p className="text-xs text-brand-muted mt-1 leading-relaxed">សុភ័ក្រ្ត ម៉ាទីណេស បានបង្កើតប្រព័ន្ធចម្រោះទឹកថ្មី។</p>
              </div>
              <div className="text-[10px] text-right font-medium text-brand-muted shrink-0">មិនា 15<br/>2:00 រសៀល</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Text */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-xs font-semibold text-brand-muted mt-6 justify-between items-center text-center sm:text-left">
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
