'use client';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, CalendarCheck, FileText, Bell, 
  LogOut, Menu, X, ChevronLeft, ChevronRight, UserCircle 
} from 'lucide-react';
import Image from 'next/image';

export default function ParentLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [leftMenuOpen, setLeftMenuOpen] = useState(false);
  const [rightMenuOpen, setRightMenuOpen] = useState(false);

  const handleLogout = () => {
    // Clear parent simulation cookie
    document.cookie = 'parent_student_id=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    router.push('/parents/login');
  };

  const navLinks = [
    { name: 'ទិដ្ឋភាពទូទៅ (Overview)', path: '/parents', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'អវត្តមាន (Attendance)', path: '/parents/attendance', icon: <CalendarCheck className="w-5 h-5" /> },
    { name: 'លទ្ធផលសិក្សា (Grades)', path: '/parents/grades', icon: <FileText className="w-5 h-5" /> },
    { name: 'សេចក្តីជូនដំណឹង (News)', path: '/parents/announcements', icon: <Bell className="w-5 h-5" /> },
  ];

  if (pathname === '/parents/login') {
    return <div className="font-sans">{children}</div>;
  }

  return (
    <div className="bg-white h-screen w-full flex flex-col lg:flex-row overflow-hidden font-sans text-brand-text selection:bg-brand-blue/30 relative">
      {/* ================= MOBILE HEADER ================= */}
      <div className="lg:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100 z-50 shrink-0 relative">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="School Logo" width={32} height={32} className="object-contain" />
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">Good Future</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => { setRightMenuOpen(!rightMenuOpen); setLeftMenuOpen(false); }} className="relative text-slate-600">
            <Bell className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <button onClick={() => { setLeftMenuOpen(!leftMenuOpen); setRightMenuOpen(false); }} className="text-slate-600">
            {leftMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ================= LEFT SIDEBAR ================= */}
      <aside className={`${leftMenuOpen ? 'flex' : 'hidden'} lg:flex absolute lg:relative top-[73px] lg:top-0 left-0 w-64 h-[calc(100vh-73px)] lg:h-full bg-white flex-col justify-between py-6 px-6 z-40 flex-shrink-0 shadow-2xl lg:shadow-none overflow-y-auto`}>
        <div>
          <div className="hidden lg:flex items-center gap-2 mb-10 pl-2">
            <Image src="/logo.png" alt="School Logo" width={32} height={32} className="object-contain" />
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">អនាគតល្អ</span>
          </div>
          
          <nav className="space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link 
                  key={link.path} 
                  href={link.path} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                    isActive 
                      ? 'text-indigo-600 bg-indigo-50 font-bold' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  onClick={() => setLeftMenuOpen(false)}
                >
                  {link.icon} {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-2 mt-8 lg:mt-0">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 text-slate-500 hover:text-rose-600 px-4 py-3 rounded-xl font-medium transition-colors mt-4 hover:bg-rose-50">
            <LogOut className="w-5 h-5" /> ចាកចេញ (Logout)
          </button>
        </div>
      </aside>

      {/* OVERLAY */}
      {(leftMenuOpen || rightMenuOpen) && (
        <div className="lg:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30" onClick={() => { setLeftMenuOpen(false); setRightMenuOpen(false); }} />
      )}

      {/* ================= CENTER MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col py-0 lg:py-4 px-0 lg:px-2 overflow-hidden h-[calc(100vh-73px)] lg:h-screen">
        <main className="flex-1 bg-slate-50 rounded-none lg:rounded-[36px] flex flex-col overflow-y-auto p-5 md:p-8 lg:p-10 shadow-sm border-0 lg:border border-slate-100 relative">
          {children}
        </main>
      </div>

      {/* ================= RIGHT SIDEBAR ================= */}
      <aside className={`${rightMenuOpen ? 'flex' : 'hidden'} lg:flex absolute lg:relative top-[73px] lg:top-0 right-0 w-80 h-[calc(100vh-73px)] lg:h-full bg-white flex-col py-6 px-6 z-40 flex-shrink-0 shadow-2xl lg:shadow-none overflow-y-auto`}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border-2 border-white shadow-sm shrink-0">
              <UserCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Parent Profile</h4>
              <p className="text-xs text-slate-500">មាតាបិតា</p>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg shadow-indigo-200 mb-8">
          <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider mb-1">សិស្សកំពុងមើល</p>
          <h3 className="font-black text-xl mb-4">សុខ តារា</h3>
          <div className="flex justify-between items-center text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full font-bold">ថ្នាក់ 10A</span>
            <span className="bg-white/20 px-3 py-1 rounded-full font-bold">ID: 00124</span>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800">កក្កដា 2026</h3>
            <div className="flex gap-2">
              <ChevronLeft className="w-4 h-4 text-slate-400" />
              <ChevronRight className="w-4 h-4 text-slate-800" />
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 font-semibold text-slate-400">
            <div>អា</div><div>ច</div><div>អ</div><div>ព</div><div>ព្រ</div><div>សុ</div><div>ស</div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-slate-800">
            <div className="text-slate-300 py-1.5">29</div><div className="text-slate-300 py-1.5">30</div>
            <div className="py-1.5">1</div><div className="py-1.5">2</div><div className="py-1.5">3</div><div className="py-1.5">4</div><div className="py-1.5">5</div>
            <div className="py-1.5">6</div><div className="py-1.5">7</div><div className="py-1.5">8</div><div className="py-1.5">9</div>
            <div className="bg-indigo-600 text-white rounded-full py-1.5 shadow-md shadow-indigo-200">10</div>
            <div className="py-1.5">11</div><div className="py-1.5">12</div>
            <div className="py-1.5">13</div><div className="py-1.5">14</div><div className="py-1.5">15</div><div className="py-1.5">16</div><div className="py-1.5">17</div><div className="py-1.5">18</div><div className="py-1.5">19</div>
          </div>
        </div>
      </aside>

    </div>
  );
}
