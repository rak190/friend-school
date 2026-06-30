'use client';
import { useState, useEffect } from 'react';
import { ClipboardCheck, Calendar, Users, Save, CheckCircle2 } from 'lucide-react';

export default function TeacherAttendance() {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  
  // Default to today's date in YYYY-MM-DD format
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClassId && selectedDate) {
      fetchAttendance();
    } else {
      setStudents([]);
    }
  }, [selectedClassId, selectedDate]);

  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/classes');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setClasses(json.data);
          if (json.data.length > 0) {
            setSelectedClassId(json.data[0].id.toString());
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch classes:', err);
    }
  };

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/attendance?classId=${selectedClassId}&date=${selectedDate}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setStudents(json.data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const cycleStatus = (currentStatus) => {
    if (currentStatus === 'វត្តមាន') return 'អវត្តមាន';
    if (currentStatus === 'អវត្តមាន') return 'ច្បាប់';
    return 'វត្តមាន';
  };

  const handleStatusClick = (studentId, currentStatus) => {
    const newStatus = cycleStatus(currentStatus);
    setStudents(students.map(s => s.id === studentId ? { ...s, status: newStatus } : s));
  };

  const markAllPresent = () => {
    setStudents(students.map(s => ({ ...s, status: 'វត្តមាន' })));
  };

  const handleSaveAttendance = async () => {
    setIsSaving(true);
    try {
      const attendanceData = students.map(s => ({ studentId: s.id, status: s.status }));
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: selectedClassId,
          date: selectedDate,
          attendanceData
        })
      });
      if (res.ok) {
        alert('បញ្ជីអវត្តមានត្រូវបានរក្សាទុកដោយជោគជ័យ!');
      } else {
        alert('មានបញ្ហាក្នុងការរក្សាទុក។ សូមព្យាយាមម្តងទៀត។');
      }
    } catch (err) {
      console.error('Failed to save attendance:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center text-yellow-900 shadow-sm">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            ចុះអវត្តមាន
          </h1>
          <p className="text-sm font-medium text-brand-muted mt-1">កត់ត្រាការចូលរៀនរបស់សិស្សប្រចាំថ្ងៃ</p>
        </div>
      </header>

      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2">
            <Users className="w-4 h-4" /> ជ្រើសរើសថ្នាក់រៀនរបស់អ្នក
          </h2>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input 
              type="date" 
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 cursor-pointer"
            />
          </div>
        </div>

        {classes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center text-sm font-medium text-slate-500">អ្នកមិនទាន់មានថ្នាក់រៀនទេ។ សូមបង្កើតថ្នាក់ថ្មី។</div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
            {classes.map(cls => (
              <button 
                key={cls.id} 
                onClick={() => setSelectedClassId(cls.id.toString())}
                className={`snap-start shrink-0 w-64 text-left rounded-3xl p-5 border transition-all duration-300 ${
                  selectedClassId === cls.id.toString() 
                    ? `border-brand-blue shadow-lg shadow-blue-500/20 bg-gradient-to-br from-white to-blue-50 ring-2 ring-brand-blue ring-offset-2` 
                    : 'border-slate-100 bg-white hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className={`w-12 h-12 rounded-xl ${cls.color || 'bg-brand-blue'} text-white flex items-center justify-center font-bold text-lg shadow-inner uppercase`}>
                    {cls.name ? cls.name.replace('ថ្នាក់ទី ', '').substring(0, 2) : 'C'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg leading-tight">{cls.name}</h3>
                    <span className="text-xs font-semibold text-brand-muted">{cls.subject}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-50/80 p-2 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  សិស្សសរុប {cls.studentsCount || 0} នាក់
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedClassId && selectedDate ? (
        <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm">
          {loading ? (
            <div className="py-12 text-center text-brand-muted font-medium">កំពុងទាញយកបញ្ជីសិស្ស...</div>
          ) : students.length === 0 ? (
            <div className="py-12 text-center text-brand-muted font-medium">មិនមានសិស្សនៅក្នុងថ្នាក់នេះទេ</div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-lg">បញ្ជីសិស្ស ({students.length})</h3>
                <button onClick={markAllPresent} className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full font-bold text-sm hover:bg-emerald-100 transition-colors flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> វត្តមានទាំងអស់
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 mt-6">
                {students.map((student, idx) => {
                  let bgColor = 'bg-white';
                  let shadowColor = 'shadow-slate-200';
                  let borderColor = 'border-slate-200';
                  let textColor = 'text-slate-700';
                  let labelBg = 'bg-slate-100';
                  let translate = ''; // For the pressed effect

                  if (student.status === 'វត្តមាន') {
                    bgColor = 'bg-emerald-50';
                    shadowColor = 'shadow-emerald-200';
                    borderColor = 'border-emerald-300';
                    textColor = 'text-emerald-900';
                    labelBg = 'bg-emerald-500 text-white';
                  } else if (student.status === 'អវត្តមាន') {
                    bgColor = 'bg-rose-50';
                    shadowColor = 'shadow-rose-100';
                    borderColor = 'border-rose-300';
                    textColor = 'text-rose-900';
                    labelBg = 'bg-rose-500 text-white';
                    translate = 'translate-y-1 shadow-sm'; // Depressed effect
                  } else if (student.status === 'ច្បាប់') {
                    bgColor = 'bg-blue-50';
                    shadowColor = 'shadow-blue-100';
                    borderColor = 'border-blue-300';
                    textColor = 'text-blue-900';
                    labelBg = 'bg-blue-500 text-white';
                    translate = 'translate-y-1 shadow-sm'; // Depressed effect
                  }

                  return (
                    <button
                      key={student.id}
                      onClick={() => handleStatusClick(student.id, student.status)}
                      className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 select-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-brand-blue/20 
                        ${bgColor} ${borderColor} ${textColor}
                        ${translate ? translate : `shadow-[0_4px_0_0_${shadowColor.replace('shadow-', '')}] hover:-translate-y-1 hover:shadow-[0_6px_0_0_${shadowColor.replace('shadow-', '')}]`}
                        active:translate-y-1 active:shadow-none
                      `}
                      style={{ 
                        WebkitTapHighlightColor: 'transparent',
                        boxShadow: translate ? 'none' : '' 
                      }}
                    >
                      <div className="w-12 h-12 rounded-full bg-white/60 flex items-center justify-center font-bold text-lg mb-2 shadow-inner uppercase border border-white/40">
                        {student.firstName.substring(0, 1)}
                      </div>
                      <div className="font-bold text-center leading-tight truncate w-full text-sm sm:text-base">
                        {student.lastName} {student.firstName}
                      </div>
                      <div className="text-[10px] font-bold text-center mt-1 text-slate-500 uppercase tracking-widest">
                        {student.gender === 'ប្រុស' ? 'M' : 'F'}
                      </div>
                      
                      {/* Status Label Pill */}
                      <div className={`absolute -top-3 shadow-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${labelBg}`}>
                        {student.status || 'វត្តមាន'}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={handleSaveAttendance} 
                  disabled={isSaving}
                  className="bg-brand-blue text-white px-8 py-3 rounded-full font-bold shadow-sm shadow-blue-200 hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {isSaving ? 'កំពុងរក្សាទុក...' : 'រក្សាទុកបញ្ជីអវត្តមាន'}
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="py-12 text-center text-brand-muted font-medium">
          សូមជ្រើសរើសថ្នាក់រៀន និងកាលបរិច្ឆេទ ដើម្បីកត់ត្រាអវត្តមាន
        </div>
      )}
    </>
  );
}
