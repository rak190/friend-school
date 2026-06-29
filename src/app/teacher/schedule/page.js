'use client';
import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Plus, X, Trash2, Edit2, Users } from 'lucide-react';

const DAYS = ['ច័ន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍'];
const SHIFTS = ['ព្រឹក', 'រសៀល'];

const MORNING_PERIODS = [
  { start: '07:00', end: '08:00', label: 'ម៉ោងទី ១' },
  { start: '08:00', end: '09:00', label: 'ម៉ោងទី ២' },
  { start: '09:00', end: '10:00', label: 'ម៉ោងទី ៣' },
  { start: '10:00', end: '11:00', label: 'ម៉ោងទី ៤' },
];

const AFTERNOON_PERIODS = [
  { start: '13:00', end: '14:00', label: 'ម៉ោងទី ១' },
  { start: '14:00', end: '15:00', label: 'ម៉ោងទី ២' },
  { start: '15:00', end: '16:00', label: 'ម៉ោងទី ៣' },
  { start: '16:00', end: '17:00', label: 'ម៉ោងទី ៤' },
];

export default function TeacherSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [activeShift, setActiveShift] = useState('ព្រឹក');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    id: null,
    dayOfWeek: 'ច័ន្ទ',
    shift: 'ព្រឹក',
    startTime: '07:00',
    endTime: '08:00',
    classId: '',
    room: ''
  });

  useEffect(() => {
    fetchSchedules();
    fetchClasses();
  }, []);

  const fetchSchedules = async () => {
    try {
      const res = await fetch('/api/schedules');
      if (res.ok) {
        const json = await res.json();
        if (json.success) setSchedules(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch schedules:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/classes');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setClasses(json.data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch classes:', err);
    }
  };

  const openAddModal = (day = 'ច័ន្ទ', period = null) => {
    setModalMode('add');
    setForm({
      id: null,
      dayOfWeek: day,
      shift: activeShift,
      startTime: period ? period.start : (activeShift === 'ព្រឹក' ? '07:00' : '13:00'),
      endTime: period ? period.end : (activeShift === 'ព្រឹក' ? '08:00' : '14:00'),
      classId: classes.length > 0 ? classes[0].id.toString() : '',
      room: ''
    });
    setShowModal(true);
  };

  const openEditModal = (sched) => {
    setModalMode('edit');
    setForm({
      id: sched.id,
      dayOfWeek: sched.dayOfWeek,
      shift: sched.shift,
      startTime: sched.startTime,
      endTime: sched.endTime,
      classId: sched.classId.toString(),
      room: sched.room || ''
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const url = modalMode === 'add' ? '/api/schedules' : `/api/schedules/${form.id}`;
    const method = modalMode === 'add' ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setShowModal(false);
        fetchSchedules();
      } else {
        alert('មានបញ្ហាក្នុងការរក្សាទុក។ សូមពិនិត្យទិន្នន័យម្តងទៀត។');
      }
    } catch (err) {
      console.error('Failed to save schedule:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('តើអ្នកពិតជាចង់លុបម៉ោងនេះមែនទេ?')) return;
    try {
      const res = await fetch(`/api/schedules/${form.id}`, { method: 'DELETE' });
      if (res.ok) {
        setShowModal(false);
        fetchSchedules();
      }
    } catch (err) {
      console.error('Failed to delete schedule:', err);
    }
  };

  const filteredSchedules = schedules.filter(s => s.shift === activeShift);
  const periods = activeShift === 'ព្រឹក' ? MORNING_PERIODS : AFTERNOON_PERIODS;

  return (
    <>
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 shadow-sm">
              <CalendarIcon className="w-6 h-6" />
            </div>
            កាលវិភាគបង្រៀន
          </h1>
          <p className="text-sm font-medium text-brand-muted mt-1">គ្រប់គ្រងម៉ោងបង្រៀនតាមទម្រង់តារាង (ចុចលើប្រអប់ដើម្បីកែប្រែ)</p>
        </div>
      </header>

      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit mb-6">
        {SHIFTS.map(shift => (
          <button 
            key={shift}
            onClick={() => setActiveShift(shift)}
            className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all ${activeShift === shift ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            វេន{shift}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500">កំពុងទាញយកទិន្នន័យ...</div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 w-32 border-r border-slate-200 text-center font-bold text-slate-500 text-sm">ម៉ោង</th>
                  {DAYS.map(day => (
                    <th key={day} className="p-4 text-center border-r border-slate-200 last:border-0">
                      <div className="font-bold text-slate-800">ថ្ងៃ{day}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periods.map((period, idx) => (
                  <tr key={idx} className="border-b border-slate-200 last:border-0">
                    
                    <td className="p-4 border-r border-slate-200 bg-slate-50/50 text-center align-middle">
                      <div className="font-bold text-slate-700 text-sm mb-1">{period.label}</div>
                      <div className="text-xs font-semibold text-brand-muted flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3" /> {period.start} - {period.end}
                      </div>
                    </td>

                    {DAYS.map(day => {
                      const sched = filteredSchedules.find(s => s.dayOfWeek === day && s.startTime === period.start);
                      
                      return (
                        <td key={`${day}-${period.start}`} className="p-2 border-r border-slate-200 last:border-0 h-28 min-w-[140px] relative group align-top">
                          {sched ? (
                            <button onClick={() => openEditModal(sched)} className={`w-full h-full p-3 rounded-xl text-left border transition-all hover:-translate-y-0.5 hover:shadow-md focus:ring-2 focus:ring-brand-blue outline-none ${sched.color ? `${sched.color.replace('bg-', 'bg-').replace('-500', '-50')} border-${sched.color.replace('bg-', 'border-').replace('-500', '-200')}` : 'bg-blue-50 border-blue-200'}`}>
                              <div className="font-bold text-slate-800 text-sm leading-tight mb-1">{sched.className}</div>
                              <div className={`text-xs font-semibold mb-2 ${sched.color ? `text-${sched.color.replace('bg-', '').replace('-500', '-600')}` : 'text-brand-blue'}`}>
                                {sched.subject}
                              </div>
                              <div className="flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-white/60 p-1 rounded-md w-fit">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                {sched.room || 'បន្ទប់?'}
                              </div>
                            </button>
                          ) : (
                            <button onClick={() => openAddModal(day, period)} className="w-full h-full rounded-xl border-2 border-dashed border-transparent hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center text-slate-300 hover:text-brand-blue transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue">
                              <Plus className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">{modalMode === 'add' ? 'បន្ថែមម៉ោងបង្រៀន' : 'កែប្រែម៉ោងបង្រៀន'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><Users className="w-4 h-4"/> ថ្នាក់រៀន</label>
                <select required value={form.classId} onChange={e => setForm({...form, classId: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-brand-blue focus:bg-white">
                  <option value="" disabled>-- ជ្រើសរើសថ្នាក់ --</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name} - {c.subject}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><MapPin className="w-4 h-4"/> បន្ទប់</label>
                <input type="text" value={form.room} onChange={e => setForm({...form, room: e.target.value})} placeholder="ឧ. បន្ទប់ 101" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-brand-blue focus:bg-white" />
              </div>

              <div className="pt-6 flex justify-between gap-3 items-center">
                {modalMode === 'edit' ? (
                  <button type="button" onClick={handleDelete} className="px-5 py-2.5 rounded-full text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-2">
                    <Trash2 className="w-4 h-4" /> លុប
                  </button>
                ) : (
                  <div></div>
                )}
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-500 hover:bg-slate-50">បោះបង់</button>
                  <button type="submit" disabled={isSubmitting || !form.classId} className="bg-brand-blue text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-600 disabled:opacity-50 shadow-sm shadow-blue-200">
                    {isSubmitting ? 'កំពុងរក្សាទុក...' : 'រក្សាទុក'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
