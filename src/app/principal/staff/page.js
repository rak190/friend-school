'use client';

export default function PrincipalStaffPage() {
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">បុគ្គលិក និងគ្រូបង្រៀន</h1>
        <p className="text-brand-muted font-medium mt-1">គ្រប់គ្រងទិន្នន័យបុគ្គលិកទូទាំងសាលា</p>
      </header>
      <div className="flex-1 bg-white rounded-[24px] shadow-sm border border-slate-100 flex items-center justify-center">
        <div className="text-center text-slate-400">
          <p className="font-bold text-xl mb-2">មិនទាន់មានទិន្នន័យទេ</p>
          <p className="text-sm">មុខងារនេះនឹងមកដល់ឆាប់ៗនេះ។</p>
        </div>
      </div>
    </div>
  );
}
