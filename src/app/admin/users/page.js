'use client';
import { useState, useEffect, useCallback } from 'react';
import { Users, Plus, X, Edit, Trash2, Search, Loader2, Shield, GraduationCap, Crown, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    id: null,
    username: '',
    name: '',
    email: '',
    password: '',
    role: 'teacher'
  });

  const [formErrors, setFormErrors] = useState({});

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (roleFilter !== 'all') params.set('role', roleFilter);
      
      const res = await fetch(`/api/users?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setUsers(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
      showToast('មានបញ្ហាក្នុងការទាញទិន្នន័យ', 'error');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      fetchUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, roleFilter]);

  const validateForm = () => {
    const errors = {};
    if (!formData.username.trim()) errors.username = 'ត្រូវការឈ្មោះគណនី';
    if (!formData.id && !formData.password) errors.password = 'ត្រូវការពាក្យសម្ងាត់';
    if (formData.password && formData.password.length < 6) errors.password = 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setSaving(true);
    
    try {
      const method = formData.id ? 'PUT' : 'POST';
      const res = await fetch('/api/users', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const json = await res.json();
      
      if (res.ok && json.success) {
        fetchUsers();
        setIsModalOpen(false);
        showToast(formData.id ? 'កែប្រែគណនីបានជោគជ័យ!' : 'បង្កើតគណនីថ្មីបានជោគជ័យ!');
      } else {
        showToast(json.error || 'មានបញ្ហាក្នុងការរក្សាទុក', 'error');
      }
    } catch (err) {
      console.error('Failed to save user:', err);
      showToast('មានបញ្ហាក្នុងការភ្ជាប់ទៅម៉ាស៊ីនមេ', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, username) => {
    if (!confirm(`តើអ្នកពិតជាចង់លុបគណនី "${username}" មែនទេ?`)) return;
    try {
      const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (res.ok && json.success) {
        fetchUsers();
        showToast('លុបគណនីបានជោគជ័យ!');
      } else {
        showToast(json.error || 'មានបញ្ហាក្នុងការលុប', 'error');
      }
    } catch (err) {
      console.error('Failed to delete:', err);
      showToast('មានបញ្ហាក្នុងការភ្ជាប់ទៅម៉ាស៊ីនមេ', 'error');
    }
  };

  const openModal = (user = null) => {
    if (user) {
      setFormData({ id: user.id, username: user.username, name: user.name || '', email: user.email || '', password: '', role: user.role });
    } else {
      setFormData({ id: null, username: '', name: '', email: '', password: '', role: 'teacher' });
    }
    setFormErrors({});
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const getRoleIcon = (role) => {
    if (role === 'admin') return <Shield className="w-4 h-4" />;
    if (role === 'principal') return <Crown className="w-4 h-4" />;
    return <GraduationCap className="w-4 h-4" />;
  };

  const getRoleLabel = (role) => {
    if (role === 'admin') return 'រដ្ឋបាល';
    if (role === 'principal') return 'នាយកសាលា';
    return 'គ្រូបង្រៀន';
  };

  const getRoleBadgeClass = (role) => {
    if (role === 'admin') return 'bg-rose-100 text-rose-700';
    if (role === 'principal') return 'bg-purple-100 text-purple-700';
    return 'bg-indigo-100 text-indigo-700';
  };

  const getAvatarColor = (role) => {
    if (role === 'admin') return 'bg-rose-100 text-rose-600';
    if (role === 'principal') return 'bg-purple-100 text-purple-600';
    return 'bg-indigo-100 text-indigo-600';
  };

  const roleStats = {
    all: users.length,
    admin: users.filter(u => u.role === 'admin').length,
    principal: users.filter(u => u.role === 'principal').length,
    teacher: users.filter(u => u.role === 'teacher').length,
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-bold animate-in slide-in-from-top-5 duration-300 ${
          toast.type === 'error' ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle className="w-5 h-5 shrink-0" />}
          {toast.message}
        </div>
      )}

      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">គ្រប់គ្រងអ្នកប្រើប្រាស់</h1>
          <p className="text-slate-500 font-medium mt-1">បន្ថែម កែប្រែ ឬលុបគណនីក្នុងប្រព័ន្ធ</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 transition-colors shrink-0"
        >
          <Plus className="w-5 h-5" /> បង្កើតគណនី
        </button>
      </header>

      {/* Role Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: 'all', label: 'ទាំងអស់', icon: <Users className="w-4 h-4" /> },
          { key: 'admin', label: 'រដ្ឋបាល', icon: <Shield className="w-4 h-4" /> },
          { key: 'principal', label: 'នាយកសាលា', icon: <Crown className="w-4 h-4" /> },
          { key: 'teacher', label: 'គ្រូបង្រៀន', icon: <GraduationCap className="w-4 h-4" /> },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => { setRoleFilter(tab.key); setLoading(true); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              roleFilter === tab.key 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {tab.icon} {tab.label}
            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
              roleFilter === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              {roleStats[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ស្វែងរកតាមឈ្មោះ ឬអ៊ីមែល..." 
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-300 transition-all font-medium"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4 pl-6">អ្នកប្រើប្រាស់</th>
                <th className="p-4">ឈ្មោះគណនី</th>
                <th className="p-4">អ៊ីមែល</th>
                <th className="p-4">តួនាទី</th>
                <th className="p-4 text-right pr-6">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" /> កំពុងទាញយក...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                    <p className="font-bold text-slate-500 mb-1">មិនមានទិន្នន័យ</p>
                    <p className="text-sm">សូមបង្កើតគណនីថ្មី ឬកែតម្រង់ការស្វែងរក</p>
                  </td>
                </tr>
              ) : users.map(user => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-4 pl-6 font-bold text-slate-700">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold uppercase ${getAvatarColor(user.role)}`}>
                        {(user.name || user.username).substring(0,2)}
                      </div>
                      <span>{user.name || '—'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 font-medium font-mono text-sm">{user.username}</td>
                  <td className="p-4 text-slate-500 font-medium">{user.email || '—'}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${getRoleBadgeClass(user.role)}`}>
                      {getRoleIcon(user.role)} {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="p-4 text-right pr-6">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal(user)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="កែប្រែ">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(user.id, user.username)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="លុប">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        {!loading && users.length > 0 && (
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-sm text-slate-500 font-medium">
            សរុប {users.length} គណនី
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md relative z-10 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">{formData.id ? 'កែប្រែគណនី' : 'បង្កើតគណនីថ្មី'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full p-2 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">ឈ្មោះគណនី (Username) <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.username} 
                  onChange={e => setFormData({...formData, username: e.target.value})} 
                  className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono ${formErrors.username ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'}`}
                  placeholder="ឧ. teacher01"
                />
                {formErrors.username && <p className="text-xs text-rose-500 mt-1 font-medium">{formErrors.username}</p>}
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">ឈ្មោះពេញ (Full Name)</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="ឧ. សុខ វិចិត្រ"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">អ៊ីមែល (Email)</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="ឧ. teacher@school.com"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  ពាក្យសម្ងាត់ {formData.id ? '(ទុកទទេបើមិនប្តូរ)' : <span className="text-rose-500">*</span>}
                </label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={formData.password} 
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                    className={`w-full bg-slate-50 border rounded-xl px-4 py-3 pr-12 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${formErrors.password ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'}`}
                    placeholder={formData.id ? '••••••' : 'យ៉ាងតិច ៦ តួអក្សរ'}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formErrors.password && <p className="text-xs text-rose-500 mt-1 font-medium">{formErrors.password}</p>}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">តួនាទី (Role)</label>
                <select 
                  value={formData.role} 
                  onChange={e => setFormData({...formData, role: e.target.value})} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-bold"
                >
                  <option value="teacher">គ្រូបង្រៀន (Teacher)</option>
                  <option value="principal">នាយកសាលា (Principal)</option>
                  <option value="admin">រដ្ឋបាល (Admin)</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 rounded-b-[24px]">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors">បោះបង់</button>
              <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-60">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />} រក្សាទុក
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
