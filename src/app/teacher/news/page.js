import { Megaphone, Calendar, Image as ImageIcon, Bell, Pin } from 'lucide-react';

export default function TeacherNews() {
  const newsItems = [
    {
      id: 1,
      title: 'ការផ្លាស់ប្តូរកាលវិភាគប្រឡងឆមាសទី ១',
      date: '១០ កក្កដា 2026',
      author: 'នាយកសាលា',
      content: 'សូមជម្រាបជូនដល់លោកគ្រូ អ្នកគ្រូទាំងអស់ឱ្យបានជ្រាបថា កាលវិភាគប្រឡងឆមាសទី១ នឹងត្រូវលើកពេលទៅសប្តាហ៍ទី៤ នៃខែកក្កដាវិញ ដើម្បីទុកពេលឱ្យសិស្សានុសិស្សបានរំលឹកមេរៀនបានគ្រប់គ្រាន់។ សូមពិនិត្យមើលកាលវិភាគថ្មីក្នុងប្រព័ន្ធ។',
      isPinned: true,
      category: 'ប្រកាសសំខាន់',
      color: 'bg-red-50 text-red-600 border-red-100'
    },
    {
      id: 2,
      title: 'សិក្ខាសាលាស្តីពី "គរុកោសល្យទំនើប"',
      date: '០៨ កក្កដា 2026',
      author: 'ការិយាល័យសិក្សាធិការ',
      content: 'សាលានឹងរៀបចំសិក្ខាសាលាសម្រាប់គ្រូបង្រៀនទាំងអស់នៅថ្ងៃសៅរ៍ ទី២៥ កក្កដា ខាងមុខនេះ។ វាគ្មិនកិត្តិយសមកពីក្រសួងអប់រំ នឹងមកចែករំលែកបទពិសោធន៍ទាក់ទងនឹងការប្រើប្រាស់បច្ចេកវិទ្យាក្នុងការបង្រៀន។',
      isPinned: false,
      category: 'ព្រឹត្តិការណ៍',
      color: 'bg-blue-50 text-brand-blue border-blue-100'
    },
    {
      id: 3,
      title: 'ការជួសជុលអគារ C ជាន់ទី២',
      date: '០៥ កក្កដា 2026',
      author: 'ផ្នែករដ្ឋបាល',
      content: 'ចាប់ពីថ្ងៃចន្ទសប្តាហ៍ក្រោយនេះ ក្រុមជាងនឹងចាប់ផ្តើមជួសជុលបន្ទប់ទឹក និងលាបថ្នាំថ្មីនៅអគារ C ជាន់ទី២។ សូមលោកគ្រូ អ្នកគ្រូដែលមានថ្នាក់នៅជាន់នោះ មេត្តាយោគយល់ចំពោះសម្លេងរំខានបន្តិចបន្តួច។',
      isPinned: false,
      category: 'រដ្ឋបាល',
      color: 'bg-yellow-50 text-yellow-700 border-yellow-100'
    }
  ];

  return (
    <>
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">ដំណឹងសាលា</h1>
          <p className="text-sm font-medium text-brand-muted mt-1">សេចក្តីជូនដំណឹង និងព្រឹត្តិការណ៍សំខាន់ៗពីរដ្ឋបាល</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-slate-200 p-2.5 rounded-full shadow-sm text-slate-600 hover:bg-slate-50 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative items-start">
        {/* Main News Feed */}
        <div className="lg:col-span-2 space-y-6">
          {newsItems.map(news => (
            <article key={news.id} className={`bg-white rounded-[24px] border ${news.isPinned ? 'border-brand-blue shadow-md' : 'border-slate-100 shadow-sm'} p-6 relative overflow-hidden group hover:shadow-lg transition-shadow`}>
              {news.isPinned && (
                <div className="absolute top-0 right-6 bg-brand-blue text-white px-3 py-1 rounded-b-lg flex items-center gap-1.5 shadow-sm text-xs font-bold">
                  <Pin className="w-3 h-3 fill-white" /> ខ្ទាស់ទុក
                </div>
              )}
              
              <div className="flex items-center gap-2 mb-4 mt-2">
                <span className={`px-2.5 py-1 rounded border text-[10px] font-bold ${news.color}`}>
                  {news.category}
                </span>
                <span className="text-xs font-semibold text-slate-400">{news.date} • {news.author}</span>
              </div>
              
              <h2 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-brand-blue transition-colors">{news.title}</h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-5">
                {news.content}
              </p>
              
              <div className="flex items-center gap-4 border-t border-slate-50 pt-4 mt-auto">
                <button className="text-xs font-bold text-brand-blue hover:text-blue-700 transition-colors flex items-center gap-1">
                  អានលម្អិត
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-4">
          <div className="bg-gradient-to-br from-brand-blue to-purple-600 rounded-[24px] p-6 text-white shadow-lg">
            <Megaphone className="w-8 h-8 mb-4 text-white/80" />
            <h3 className="text-lg font-bold mb-2">មានព័ត៌មានបន្ទាន់?</h3>
            <p className="text-sm text-white/80 mb-6 leading-relaxed">
              លោកគ្រូ អ្នកគ្រូអាចស្នើសុំការផ្សាយដំណឹងទៅកាន់សិស្សក្នុងថ្នាក់របស់ខ្លួនបានតាមរយៈប្រព័ន្ធនេះ។
            </p>
            <button className="w-full bg-white text-brand-blue font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors text-sm shadow-sm">
              បង្កើតសេចក្តីប្រកាស
            </button>
          </div>

          <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-yellow" />
              ប្រតិទិនព្រឹត្តិការណ៍
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <div className="flex flex-col items-center justify-center bg-slate-50 rounded-lg p-2 min-w-[50px] border border-slate-100">
                  <span className="text-xs font-bold text-red-500">កក្កដា</span>
                  <span className="text-lg font-black text-slate-800">១៥</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">ស្វាគមន៍សិស្សថ្មី</h4>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">ម៉ោង ៧:០០ ព្រឹក នៅទីធ្លា</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex flex-col items-center justify-center bg-slate-50 rounded-lg p-2 min-w-[50px] border border-slate-100">
                  <span className="text-xs font-bold text-red-500">កក្កដា</span>
                  <span className="text-lg font-black text-slate-800">២៥</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">សិក្ខាសាលាគរុកោសល្យ</h4>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">ពេញមួយថ្ងៃ នៅសាលប្រជុំ</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
