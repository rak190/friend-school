'use client';
import { useState } from 'react';
import { Search, Book, MessageCircle, FileText, Phone, Mail, ChevronRight, ChevronDown, PlayCircle, X, Send } from 'lucide-react';

// Mock Data
const helpData = {
  manuals: [
    { id: 1, title: 'របៀបបញ្ចូលពិន្ទុប្រចាំខែ', content: 'ដើម្បីបញ្ចូលពិន្ទុ សូមចូលទៅកាន់ទំព័រ "បញ្ជីពិន្ទុ" ជ្រើសរើសថ្នាក់រៀន និងមុខវិជ្ជា បន្ទាប់មកបញ្ចូលពិន្ទុក្នុងតារាង រួចចុចប៊ូតុង "រក្សាទុកទាំងអស់"។' },
    { id: 2, title: 'របៀបគ្រប់គ្រងវត្តមានសិស្ស', content: 'ចូលទៅកាន់ទំព័រ "វត្តមាន" ជ្រើសរើសថ្នាក់រៀន។ លោកអ្នកអាចចុចលើឈ្មោះសិស្សម្នាក់ៗដើម្បីប្តូរស្ថានភាព ឬប្រើប៊ូតុង "មកទាំងអស់" ដើម្បីចំណេញពេល។' },
    { id: 3, title: 'របៀបបង្កើតថ្នាក់រៀនថ្មី', content: 'ចូលទៅកាន់ទំព័រ "ថ្នាក់រៀន" ចុចប៊ូតុង "បង្កើតថ្នាក់រៀន" បំពេញព័ត៌មានកម្រិតថ្នាក់ និងមុខវិជ្ជា រួចចុចរក្សាទុក។' },
  ],
  videos: [
    { id: 4, title: 'វីដេអូ៖ ការប្រើប្រាស់តារាងពិន្ទុ', content: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    { id: 5, title: 'វីដេអូ៖ ការរៀបចំកាលវិភាគបង្រៀន', content: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  ],
  faqs: [
    { id: 6, title: 'តើខ្ញុំអាចប្តូរលេខសម្ងាត់ដោយរបៀបណា?', content: 'សូមចូលទៅកាន់ទំព័រ "ការកំណត់" > "សុវត្ថិភាព និងពាក្យសម្ងាត់" បញ្ចូលពាក្យសម្ងាត់ចាស់ និងថ្មី រួចចុចផ្លាស់ប្តូរ។' },
    { id: 7, title: 'បើភ្លេចលេខសម្ងាត់ តើត្រូវធ្វើដូចម្តេច?', content: 'សូមទាក់ទងទៅកាន់នាយកសាលា ឬអ្នកគ្រប់គ្រងប្រព័ន្ធ (Admin) ដើម្បីធ្វើការកំណត់លេខសម្ងាត់ថ្មីជូនលោកអ្នក។' },
    { id: 8, title: 'តើខ្ញុំអាចមើលកាលវិភាគបង្រៀននៅឯណា?', content: 'កាលវិភាគបង្រៀនត្រូវបានបង្ហាញនៅលើ "ទំព័រដើម" (Dashboard) ឬលោកអ្នកអាចចូលទៅកាន់ទំព័រ "កាលវិភាគ" ដើម្បីមើល និងកែប្រែ។' },
  ]
};

export default function TeacherHelp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null); // 'manuals', 'videos', 'faqs'
  const [expandedId, setExpandedId] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'bot', text: 'សួស្តី! តើខ្ញុំអាចជួយលោកគ្រូ អ្នកគ្រូបានអ្វីខ្លះថ្ងៃនេះ?' }
  ]);

  // Filter Data
  const filterData = (dataArray) => {
    if (!searchQuery) return dataArray;
    return dataArray.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredManuals = filterData(helpData.manuals);
  const filteredVideos = filterData(helpData.videos);
  const filteredFaqs = filterData(helpData.faqs);

  const totalResults = filteredManuals.length + filteredVideos.length + filteredFaqs.length;

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    
    setChatHistory([...chatHistory, { sender: 'user', text: chatMessage }]);
    setChatMessage('');
    
    // Mock bot response
    setTimeout(() => {
      setChatHistory(prev => [...prev, { sender: 'bot', text: 'សូមអភ័យទោស ភ្នាក់ងារយើងខ្ញុំកំពុងជាប់រវល់។ សូមរង់ចាំបន្តិច...' }]);
    }, 1000);
  };

  return (
    <>
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">ជំនួយ និងការគាំទ្រ</h1>
          <p className="text-sm font-medium text-brand-muted mt-1">មជ្ឈមណ្ឌលជំនួយសម្រាប់លោកគ្រូ អ្នកគ្រូ</p>
        </div>
      </header>

      {/* Search & Hero */}
      <div className="bg-brand-blue rounded-[32px] p-8 md:p-12 mb-8 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-1/4 -translate-x-1/4"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6">តើលោកអ្នកត្រូវការជំនួយអ្វីខ្លះ?</h2>
          <div className="relative">
            <Search className="w-6 h-6 text-slate-400 absolute left-5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value && !activeCategory) setActiveCategory('faqs'); // Auto open a tab if searching
              }}
              placeholder="ស្វែងរកអត្ថបទជំនួយ ឧទាហរណ៍៖ ការបញ្ជូលពិន្ទុ..." 
              className="w-full bg-white rounded-full py-4 pl-14 pr-6 text-lg font-medium shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-400/30 text-slate-700 transition-all" 
            />
          </div>
          {searchQuery && (
            <p className="text-blue-100 mt-4 text-sm font-medium">រកឃើញលទ្ធផលចំនួន {totalResults}</p>
          )}
        </div>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div 
          onClick={() => { setActiveCategory(activeCategory === 'manuals' ? null : 'manuals'); setExpandedId(null); }}
          className={`rounded-[24px] border p-6 shadow-sm transition-all cursor-pointer ${activeCategory === 'manuals' ? 'bg-blue-50 border-brand-blue shadow-md scale-[1.02]' : 'bg-white border-slate-100 hover:shadow-md group'}`}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform ${activeCategory === 'manuals' ? 'bg-brand-blue text-white' : 'bg-blue-50 text-brand-blue group-hover:scale-110'}`}>
            <Book className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-lg mb-2">សៀវភៅណែនាំប្រើប្រាស់</h3>
          <p className="text-sm text-slate-500 mb-4 leading-relaxed">អានការណែនាំលម្អិតអំពីរបៀបប្រើប្រាស់មុខងារនីមួយៗនៅក្នុងប្រព័ន្ធ។</p>
          <div className="flex items-center text-sm font-bold text-brand-blue">
            {activeCategory === 'manuals' ? 'លាក់' : 'មើលបន្ថែម'} <ChevronRight className={`w-4 h-4 transition-transform ${activeCategory === 'manuals' ? 'rotate-90' : ''}`} />
          </div>
        </div>
        
        <div 
          onClick={() => { setActiveCategory(activeCategory === 'videos' ? null : 'videos'); setExpandedId(null); }}
          className={`rounded-[24px] border p-6 shadow-sm transition-all cursor-pointer ${activeCategory === 'videos' ? 'bg-emerald-50 border-emerald-500 shadow-md scale-[1.02]' : 'bg-white border-slate-100 hover:shadow-md group'}`}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform ${activeCategory === 'videos' ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-600 group-hover:scale-110'}`}>
            <PlayCircle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-lg mb-2">វីដេអូបង្រៀន</h3>
          <p className="text-sm text-slate-500 mb-4 leading-relaxed">ទស្សនាវីដេអូខ្លីៗបង្រៀនពីរបៀបបញ្ចូលពិន្ទុ រៀបចំកាលវិភាគ និងផ្សេងៗទៀត។</p>
          <div className="flex items-center text-sm font-bold text-emerald-600">
            {activeCategory === 'videos' ? 'លាក់' : 'មើលបន្ថែម'} <ChevronRight className={`w-4 h-4 transition-transform ${activeCategory === 'videos' ? 'rotate-90' : ''}`} />
          </div>
        </div>

        <div 
          onClick={() => { setActiveCategory(activeCategory === 'faqs' ? null : 'faqs'); setExpandedId(null); }}
          className={`rounded-[24px] border p-6 shadow-sm transition-all cursor-pointer ${activeCategory === 'faqs' ? 'bg-purple-50 border-purple-500 shadow-md scale-[1.02]' : 'bg-white border-slate-100 hover:shadow-md group'}`}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform ${activeCategory === 'faqs' ? 'bg-purple-500 text-white' : 'bg-purple-50 text-purple-600 group-hover:scale-110'}`}>
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-lg mb-2">សំណួរដែលសួរញឹកញាប់</h3>
          <p className="text-sm text-slate-500 mb-4 leading-relaxed">ស្វែងរកចម្លើយចំពោះសំណួរដែលលោកគ្រូ អ្នកគ្រូផ្សេងទៀតតែងតែសួរ។</p>
          <div className="flex items-center text-sm font-bold text-purple-600">
             {activeCategory === 'faqs' ? 'លាក់' : 'មើលបន្ថែម'} <ChevronRight className={`w-4 h-4 transition-transform ${activeCategory === 'faqs' ? 'rotate-90' : ''}`} />
          </div>
        </div>
      </div>

      {/* Dynamic Content Area (Accordions) */}
      {activeCategory && (
        <div className="mb-12 bg-white rounded-[24px] border border-slate-100 p-6 md:p-8 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            {activeCategory === 'manuals' && <><Book className="w-6 h-6 text-brand-blue" /> សៀវភៅណែនាំប្រើប្រាស់</>}
            {activeCategory === 'videos' && <><PlayCircle className="w-6 h-6 text-emerald-600" /> វីដេអូបង្រៀន</>}
            {activeCategory === 'faqs' && <><FileText className="w-6 h-6 text-purple-600" /> សំណួរដែលសួរញឹកញាប់</>}
          </h3>

          <div className="space-y-4">
            {activeCategory === 'manuals' && filteredManuals.length === 0 && <p className="text-slate-500 font-medium">មិនមានលទ្ធផលទេ។</p>}
            {activeCategory === 'manuals' && filteredManuals.map((item) => (
              <div key={item.id} className="border border-slate-200 rounded-2xl overflow-hidden transition-colors hover:border-brand-blue/30">
                <div 
                  className="p-4 flex justify-between items-center cursor-pointer bg-slate-50 hover:bg-blue-50/50"
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                >
                  <h4 className="font-bold text-slate-800">{item.title}</h4>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expandedId === item.id ? 'rotate-180 text-brand-blue' : ''}`} />
                </div>
                {expandedId === item.id && (
                  <div className="p-4 bg-white border-t border-slate-100 text-slate-600 font-medium leading-relaxed animate-in fade-in slide-in-from-top-2">
                    {item.content}
                  </div>
                )}
              </div>
            ))}

            {activeCategory === 'videos' && filteredVideos.length === 0 && <p className="text-slate-500 font-medium">មិនមានលទ្ធផលទេ។</p>}
            {activeCategory === 'videos' && filteredVideos.map((item) => (
              <div key={item.id} className="border border-slate-200 rounded-2xl overflow-hidden transition-colors hover:border-emerald-500/30">
                <div 
                  className="p-4 flex justify-between items-center cursor-pointer bg-slate-50 hover:bg-emerald-50/50"
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                >
                  <h4 className="font-bold text-slate-800">{item.title}</h4>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expandedId === item.id ? 'rotate-180 text-emerald-600' : ''}`} />
                </div>
                {expandedId === item.id && (
                  <div className="p-4 bg-white border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
                    <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center relative overflow-hidden">
                       <img src={`https://img.youtube.com/vi/${item.content.split('/').pop()}/maxresdefault.jpg`} alt="Video Thumbnail" className="w-full h-full object-cover opacity-50" onError={(e) => { e.target.onerror = null; e.target.src="https://images.unsplash.com/photo-1610484826967-09c5720778c7?w=800&q=80" }} />
                       <PlayCircle className="w-16 h-16 text-white absolute cursor-pointer hover:scale-110 transition-transform" />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {activeCategory === 'faqs' && filteredFaqs.length === 0 && <p className="text-slate-500 font-medium">មិនមានលទ្ធផលទេ។</p>}
            {activeCategory === 'faqs' && filteredFaqs.map((item) => (
              <div key={item.id} className="border border-slate-200 rounded-2xl overflow-hidden transition-colors hover:border-purple-500/30">
                <div 
                  className="p-4 flex justify-between items-center cursor-pointer bg-slate-50 hover:bg-purple-50/50"
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                >
                  <h4 className="font-bold text-slate-800">{item.title}</h4>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expandedId === item.id ? 'rotate-180 text-purple-600' : ''}`} />
                </div>
                {expandedId === item.id && (
                  <div className="p-4 bg-white border-t border-slate-100 text-slate-600 font-medium leading-relaxed animate-in fade-in slide-in-from-top-2">
                    {item.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Support */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
        <div className="bg-slate-50 rounded-[24px] border border-slate-200 p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <h3 className="font-bold text-slate-800 text-lg mb-2">នៅតែត្រូវការជំនួយមែនទេ?</h3>
            <p className="text-sm text-slate-500 mb-4 sm:mb-0">ទាក់ទងមកកាន់ក្រុមការងារបច្ចេកទេសរបស់យើងដោយផ្ទាល់។</p>
          </div>
          <div className="flex gap-4">
            <a href="tel:+85512345678" className="bg-white border border-slate-200 p-3 rounded-full text-brand-blue shadow-sm hover:bg-blue-50 transition-transform hover:scale-110">
              <Phone className="w-5 h-5" />
            </a>
            <a href="mailto:support@goodfuture.edu.kh" className="bg-white border border-slate-200 p-3 rounded-full text-brand-blue shadow-sm hover:bg-blue-50 transition-transform hover:scale-110">
              <Mail className="w-5 h-5" />
            </a>
            <button 
              onClick={() => setIsChatOpen(true)}
              className="bg-brand-blue text-white font-bold px-6 py-3 rounded-full shadow-sm shadow-blue-200 flex items-center gap-2 hover:bg-blue-600 transition-transform hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" /> ជជែកផ្ទាល់
            </button>
          </div>
        </div>
      </div>

      {/* Live Chat Mockup Widget */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col z-50 animate-in slide-in-from-bottom-10 fade-in duration-300 overflow-hidden h-[500px]">
          {/* Header */}
          <div className="bg-brand-blue p-4 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold">ជំនួយបច្ចេកទេស</h4>
                <p className="text-xs text-blue-100">កំពុងភ្ជាប់...</p>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 p-4 bg-slate-50 overflow-y-auto flex flex-col gap-4">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm font-medium ${msg.sender === 'user' ? 'bg-brand-blue text-white rounded-br-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm shadow-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          
          {/* Input */}
          <form onSubmit={handleSendChat} className="p-3 bg-white border-t border-slate-100 flex gap-2 shrink-0">
            <input 
              type="text" 
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="សរសេរសារនៅទីនេះ..." 
              className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-brand-blue transition-colors"
            />
            <button type="submit" className="bg-brand-blue text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors shrink-0">
              <Send className="w-4 h-4 ml-1" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
