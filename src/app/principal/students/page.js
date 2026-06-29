'use client';
import { useState, useEffect } from 'react';
import { Search, Filter, Edit, Download, X, Save, Plus } from 'lucide-react';

export default function PrincipalStudentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/students');
      const json = await res.json();
      if (json.success) {
        setStudents(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (student) => {
    setEditingStudent({ ...student });
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingStudent({ id: null, firstName: '', lastName: '', classId: '', status: 'សកម្ម' });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingStudent.firstName || !editingStudent.lastName) return;

    try {
      const isNew = !editingStudent.id;
      const url = '/api/students';
      const method = isNew ? 'POST' : 'PUT';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingStudent)
      });
      
      if (res.ok) {
        fetchStudents();
        setIsModalOpen(false);
        setEditingStudent(null);
      }
    } catch (err) {
      console.error('Failed to save student:', err);
    }
  };

  const filteredStudents = students.filter(s => 
    s.firstName.includes(searchTerm) || 
    s.lastName.includes(searchTerm) || 
    (s.id && s.id.toString().includes(searchTerm))
  );

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300 relative">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">សិស្សទាំងអស់</h1>
          <p className="text-brand-muted font-medium mt-1">គ្រប់គ្រង និងកែប្រែព័ត៌មានសិស្សទូទាំងសាលា</p>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" /> ទាញយក
          </button>
          <button onClick={handleAddClick} className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white font-bold rounded-xl shadow-sm hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" /> បន្ថែមសិស្ស
          </button>
        </div>
      </header>

      <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 flex-1 overflow-hidden flex flex-col relative z-0">
        <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="ស្វែងរកឈ្មោះ ឬអត្តលេខ..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-12 pr-4 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue" 
            />
          </div>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-100 bg-white">
                <th className="py-4 px-6 text-sm font-bold text-slate-400 uppercase">អត្តលេខ</th>
                <th className="py-4 px-6 text-sm font-bold text-slate-400 uppercase">នាមត្រកូល</th>
                <th className="py-4 px-6 text-sm font-bold text-slate-400 uppercase">នាមខ្លួន</th>
                <th className="py-4 px-6 text-sm font-bold text-slate-400 uppercase">បន្ទប់</th>
                <th className="py-4 px-6 text-sm font-bold text-slate-400 uppercase">វត្តមាន</th>
                <th className="py-4 px-6 text-sm font-bold text-slate-400 uppercase">ស្ថានភាព</th>
                <th className="py-4 px-6 text-sm font-bold text-slate-400 uppercase text-right">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-400">កំពុងទាញយកទិន្នន័យ...</td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-400">មិនមានសិស្សទេ</td>
                </tr>
              ) : (
                filteredStudents.map((student, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <span className="font-mono text-sm font-bold text-brand-muted">ID-{student.id}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-800">{student.lastName}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-800">{student.firstName}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center justify-center px-3 h-8 rounded-lg bg-blue-50 text-brand-blue font-bold text-sm">
                        {student.className || 'គ្មានបន្ទប់'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-100 rounded-full h-2 max-w-[60px]">
                          <div className="h-2 rounded-full bg-emerald-500" style={{ width: '90%' }}></div>
                        </div>
                        <span className="text-sm font-bold text-slate-700">90%</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                        student.status === 'សកម្ម' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {student.status || 'សកម្ម'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button onClick={() => handleEditClick(student)} className="px-3 py-1.5 flex items-center justify-center gap-1.5 text-brand-blue bg-blue-50 hover:bg-blue-100 font-bold text-sm rounded-lg transition-colors ml-auto">
                        <Edit className="w-4 h-4" /> កែប្រែ
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && editingStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 animate-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">{editingStudent.id ? 'កែប្រែព័ត៌មានសិស្ស' : 'បន្ថែមសិស្សថ្មី'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full p-2 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">នាមត្រកូល</label>
                  <input 
                    type="text" 
                    value={editingStudent.lastName}
                    onChange={(e) => setEditingStudent({...editingStudent, lastName: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 font-medium" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">នាមខ្លួន</label>
                  <input 
                    type="text" 
                    value={editingStudent.firstName}
                    onChange={(e) => setEditingStudent({...editingStudent, firstName: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 font-medium" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">លេខកូដបន្ទប់ (Class ID)</label>
                  <input 
                    type="number" 
                    value={editingStudent.classId || ''}
                    onChange={(e) => setEditingStudent({...editingStudent, classId: parseInt(e.target.value) || null})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 font-medium uppercase" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">ស្ថានភាព</label>
                  <select 
                    value={editingStudent.status || 'សកម្ម'}
                    onChange={(e) => setEditingStudent({...editingStudent, status: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 font-medium"
                  >
                    <option value="សកម្ម">សកម្ម (Active)</option>
                    <option value="ព្រមាន">ព្រមាន (Warning)</option>
                    <option value="ឈប់រៀន">ឈប់រៀន (Dropped)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 rounded-b-3xl">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors">
                បោះបង់
              </button>
              <button onClick={handleSave} className="px-5 py-2.5 bg-brand-blue hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-brand-blue/30 transition-all flex items-center gap-2">
                <Save className="w-4 h-4" /> រក្សាទុក
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
