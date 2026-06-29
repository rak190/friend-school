'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Users, GraduationCap, School, ChevronRight, Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function ParentLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');

  // Dummy data for prototype
  const grades = ['ទី១ (Grade 1)', 'ទី២ (Grade 2)', 'ទី៣ (Grade 3)', 'ទី៤ (Grade 4)', 'ទី៥ (Grade 5)', 'ទី៦ (Grade 6)', 'ទី៧ (Grade 7)', 'ទី៨ (Grade 8)', 'ទី៩ (Grade 9)', 'ទី១០ (Grade 10)', 'ទី១១ (Grade 11)', 'ទី១២ (Grade 12)'];
  
  const dummyClasses = {
    'ទី១០ (Grade 10)': ['10A', '10B', '10C'],
    'ទី១១ (Grade 11)': ['11A', '11B'],
    'ទី១២ (Grade 12)': ['12A', '12B', '12C']
  };

  const dummyStudents = {
    '10A': [
      { id: 1, name: 'សិស្ស ក (Student A)' },
      { id: 2, name: 'សិស្ស ខ (Student B)' }
    ],
    '12A': [
      { id: 3, name: 'សិស្ស គ (Student C)' }
    ]
  };

  useEffect(() => {
    // When grade changes, load classes (mocked)
    if (selectedGrade) {
      setClasses(dummyClasses[selectedGrade] || ['Class A', 'Class B']);
      setSelectedClass('');
      setSelectedStudent('');
      setStudents([]);
    }
  }, [selectedGrade]);

  useEffect(() => {
    // When class changes, load students (mocked)
    if (selectedClass) {
      setStudents(dummyStudents[selectedClass] || [
        { id: 99, name: 'សិស្សសាកល្បង (Test Student)' },
        { id: 100, name: 'សុខ តារា (Sok Dara)' }
      ]);
      setSelectedStudent('');
    }
  }, [selectedClass]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!selectedStudent) return;
    
    setLoading(true);
    // Simulate setting a cookie via document.cookie for prototype
    document.cookie = `parent_student_id=${selectedStudent}; path=/; max-age=86400`;
    
    setTimeout(() => {
      router.push('/parents');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-indigo-500/30">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-200/40 blur-3xl mix-blend-multiply"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/40 blur-3xl mix-blend-multiply"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-white rounded-[24px] shadow-xl flex items-center justify-center p-4">
            <img src="/logo.png?v=1" alt="School Logo" width={60} height={60} className="object-contain" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-black text-slate-800 tracking-tight">
          វិបផតថលមាតាបិតា
        </h2>
        <p className="mt-2 text-center text-sm font-medium text-slate-500">
          ចូលមើលទិន្នន័យ និងលទ្ធផលសិក្សារបស់កូនអ្នក
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-[32px] sm:px-10 border border-white/50">
          
          {/* TABS */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-8 border border-slate-200">
            <button type="button" onClick={() => router.push('/login')} className="flex-1 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors text-center cursor-pointer">បុគ្គលិក (Staff)</button>
            <button type="button" className="flex-1 py-2 text-sm font-bold bg-white text-indigo-600 rounded-lg shadow-sm text-center">មាតាបិតា (Parents)</button>
          </div>

          <div className="mb-6 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/50 text-xs text-slate-600 shadow-sm backdrop-blur-sm">
            <p className="font-bold text-slate-800 mb-2">គណនីសាកល្បង:</p>
            <p className="font-medium">សូមជ្រើសរើស <strong>ទី១០</strong> &gt; <strong>10A</strong> &gt; <strong>សុខ តារា</strong></p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            
            {/* Grade Selection */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <School className="w-4 h-4 text-indigo-500" /> ជ្រើសរើសកម្រិតថ្នាក់ (Grade)
              </label>
              <div className="relative">
                <select 
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="block w-full appearance-none rounded-2xl border-0 py-3.5 pl-4 pr-10 text-slate-800 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm font-bold bg-white/50 backdrop-blur-sm transition-all"
                >
                  <option value="" disabled>-- ជ្រើសរើស --</option>
                  {grades.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                  <ChevronRight className="h-5 w-5 text-slate-400 rotate-90" />
                </div>
              </div>
            </div>

            {/* Class Selection */}
            <div className={`transition-all duration-300 ${selectedGrade ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" /> ជ្រើសរើសថ្នាក់ (Class)
              </label>
              <div className="relative">
                <select 
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  disabled={!selectedGrade}
                  className="block w-full appearance-none rounded-2xl border-0 py-3.5 pl-4 pr-10 text-slate-800 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm font-bold bg-white/50 backdrop-blur-sm transition-all disabled:bg-slate-50"
                >
                  <option value="" disabled>-- ជ្រើសរើស --</option>
                  {classes.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                  <ChevronRight className="h-5 w-5 text-slate-400 rotate-90" />
                </div>
              </div>
            </div>

            {/* Student Selection */}
            <div className={`transition-all duration-300 ${selectedClass ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-500" /> ជ្រើសរើសឈ្មោះសិស្ស (Student Name)
              </label>
              <div className="relative">
                <select 
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  disabled={!selectedClass}
                  className="block w-full appearance-none rounded-2xl border-0 py-3.5 pl-4 pr-10 text-slate-800 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm font-bold bg-white/50 backdrop-blur-sm transition-all disabled:bg-slate-50"
                >
                  <option value="" disabled>-- ជ្រើសរើស --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                  <ChevronRight className="h-5 w-5 text-slate-400 rotate-90" />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={!selectedStudent || loading}
                className="flex w-full justify-center items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-4 text-sm font-bold text-white shadow-lg hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all disabled:opacity-50 disabled:shadow-none hover:-translate-y-0.5 active:translate-y-0"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'ចូលមើលទិន្នន័យ (View Data)'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
