'use client';
import { useState, useEffect, useRef } from 'react';
import { Megaphone, CalendarDays, Plus, X, Image as ImageIcon, Send, Clock, Users, UploadCloud, Link as LinkIcon, FileText, Download } from 'lucide-react';

export default function PrincipalAnnouncementsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    type: 'announcement',
    audience: 'everyone',
    eventDate: '',
    imageUrl: '',
    attachmentUrl: '',
    attachmentName: '',
    attachmentType: ''
  });

  const [attachmentMode, setAttachmentMode] = useState('upload'); // 'upload' or 'link'

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/announcements');
      const json = await res.json();
      if (json.success) {
        setPosts(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const json = await res.json();
      
      if (json.success) {
        const { url, name, type } = json.data;
        if (type.startsWith('image/')) {
          setNewPost({ ...newPost, imageUrl: url, attachmentUrl: '', attachmentName: '', attachmentType: '' });
        } else {
          setNewPost({ ...newPost, imageUrl: '', attachmentUrl: url, attachmentName: name, attachmentType: type });
        }
      } else {
        alert('Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload error');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!newPost.title || !newPost.content) return;
    setSaving(true);
    
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      });
      if (res.ok) {
        fetchPosts();
        setIsModalOpen(false);
        setNewPost({
          title: '',
          content: '',
          type: 'announcement',
          audience: 'everyone',
          eventDate: '',
          imageUrl: '',
          attachmentUrl: '',
          attachmentName: '',
          attachmentType: ''
        });
      }
    } catch (err) {
      console.error('Failed to save post:', err);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('km-KH', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getAttachmentIcon = (type) => {
    if (type?.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    if (type?.includes('spreadsheet') || type?.includes('excel')) return <FileText className="w-5 h-5 text-emerald-500" />;
    if (type?.includes('presentation') || type?.includes('powerpoint')) return <FileText className="w-5 h-5 text-orange-500" />;
    return <FileText className="w-5 h-5 text-blue-500" />;
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300 relative">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">សេចក្តីជូនដំណឹង & ព្រឹត្តិការណ៍</h1>
          <p className="text-brand-muted font-medium mt-1">គ្រប់គ្រងការផ្សព្វផ្សាយព័ត៌មានទូទាំងសាលា</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-blue text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition-colors w-fit"
        >
          <Plus className="w-5 h-5" /> បង្កើតការផ្សាយថ្មី
        </button>
      </header>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto pr-2 pb-10 space-y-6">
        {loading ? (
          <div className="text-center py-20 text-brand-muted font-medium">កំពុងទាញយកទិន្នន័យ...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-brand-muted font-medium bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
            មិនទាន់មានការផ្សាយនៅឡើយទេ
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow group">
                
                {post.imageUrl ? (
                  <div className="w-full h-48 bg-slate-100 overflow-hidden relative">
                    <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 right-4">
                       <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
                        post.type === 'event' ? 'bg-orange-500 text-white' : 'bg-brand-blue text-white'
                      }`}>
                        {post.type === 'event' ? 'ព្រឹត្តិការណ៍' : 'ព័ត៌មាន'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className={`w-full h-24 relative ${post.type === 'event' ? 'bg-orange-50' : 'bg-blue-50'}`}>
                     <div className="absolute top-4 right-4">
                       <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
                        post.type === 'event' ? 'bg-orange-500 text-white' : 'bg-brand-blue text-white'
                      }`}>
                        {post.type === 'event' ? 'ព្រឹត្តិការណ៍' : 'ព័ត៌មាន'}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2 leading-tight">{post.title}</h3>
                  
                  {post.type === 'event' && post.eventDate && (
                    <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-3 py-2 rounded-lg font-bold text-sm mb-3">
                      <CalendarDays className="w-4 h-4" /> ថ្ងៃទី {formatDate(post.eventDate)}
                    </div>
                  )}

                  <p className="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed flex-1 whitespace-pre-wrap">
                    {post.content}
                  </p>

                  {/* Attachment Display */}
                  {post.attachmentUrl && (
                    <a href={post.attachmentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 mb-4 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors">
                      <div className="flex items-center gap-3 overflow-hidden">
                        {post.attachmentType === 'link' ? <LinkIcon className="w-5 h-5 text-blue-500" /> : getAttachmentIcon(post.attachmentType)}
                        <span className="text-sm font-semibold text-slate-700 truncate">{post.attachmentName || 'Link'}</span>
                      </div>
                      <Download className="w-4 h-4 text-slate-400" />
                    </a>
                  )}
                  
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> 
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-md">
                      <Users className="w-3.5 h-3.5 text-slate-500" /> 
                      <span className="capitalize">{post.audience}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl relative z-10 animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-white">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Megaphone className="w-6 h-6 text-brand-blue" /> បង្កើតការផ្សាយថ្មី
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full p-2 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">ប្រភេទការផ្សាយ (Type)</label>
                  <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-full">
                    <button onClick={() => setNewPost({...newPost, type: 'announcement'})} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${newPost.type === 'announcement' ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-500 hover:text-brand-blue'}`}>
                      <Megaphone className="w-4 h-4" /> ព័ត៌មាន
                    </button>
                    <button onClick={() => setNewPost({...newPost, type: 'event'})} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${newPost.type === 'event' ? 'bg-white text-orange-500 shadow-sm' : 'text-slate-500 hover:text-orange-500'}`}>
                      <CalendarDays className="w-4 h-4" /> ព្រឹត្តិការណ៍
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">គោលដៅអ្នកអាន (Audience)</label>
                  <select 
                    value={newPost.audience}
                    onChange={(e) => setNewPost({...newPost, audience: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 font-medium"
                  >
                    <option value="everyone">មនុស្សទាំងអស់ (Everyone)</option>
                    <option value="teachers">សម្រាប់តែគ្រូបង្រៀន (Teachers)</option>
                    <option value="students">សម្រាប់តែសិស្ស (Students)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">ចំណងជើង (Title)</label>
                <input 
                  type="text" 
                  placeholder="សរសេរចំណងជើង..."
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 font-medium text-lg" 
                />
              </div>

              {newPost.type === 'event' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1 text-orange-600">ថ្ងៃខែព្រឹត្តិការណ៍ (Event Date)</label>
                  <input 
                    type="date" 
                    value={newPost.eventDate}
                    onChange={(e) => setNewPost({...newPost, eventDate: e.target.value})}
                    className="w-full bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 font-medium" 
                  />
                </div>
              )}

              {/* Enhanced File Upload Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-slate-700">ឯកសារភ្ជាប់ (Attachment)</label>
                  <div className="flex gap-2">
                    <button onClick={() => setAttachmentMode('upload')} className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${attachmentMode === 'upload' ? 'bg-blue-100 text-brand-blue' : 'text-slate-400 hover:bg-slate-100'}`}>Upload File</button>
                    <button onClick={() => setAttachmentMode('link')} className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${attachmentMode === 'link' ? 'bg-blue-100 text-brand-blue' : 'text-slate-400 hover:bg-slate-100'}`}>External Link</button>
                  </div>
                </div>

                {attachmentMode === 'upload' ? (
                  <div className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50 hover:bg-slate-100 transition-colors text-center relative flex flex-col items-center justify-center min-h-[120px]">
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                    />
                    
                    {uploading ? (
                      <div className="text-brand-blue font-bold flex flex-col items-center gap-2">
                         <div className="w-6 h-6 border-2 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
                         កំពុងបញ្ចូលឯកសារ...
                      </div>
                    ) : newPost.imageUrl || newPost.attachmentUrl ? (
                      <div className="flex flex-col items-center gap-2">
                        {newPost.imageUrl ? (
                          <div className="w-16 h-16 rounded-lg bg-white p-1 shadow-sm"><img src={newPost.imageUrl} className="w-full h-full object-cover rounded-md" /></div>
                        ) : (
                          <FileText className="w-10 h-10 text-brand-blue" />
                        )}
                        <span className="text-sm font-bold text-slate-700">{newPost.attachmentName || 'Image Uploaded'}</span>
                        <span className="text-xs text-brand-muted">ចុចដើម្បីផ្លាស់ប្តូរ</span>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                          <UploadCloud className="w-6 h-6 text-brand-blue" />
                        </div>
                        <p className="text-sm font-bold text-slate-700">ចុច ឬ ទាញទម្លាក់ឯកសារនៅទីនេះ</p>
                        <p className="text-xs text-brand-muted mt-1">គាំទ្រ: រូបភាព, PDF, Word, Excel, PPT</p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    <LinkIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input 
                      type="url" 
                      placeholder="https://drive.google.com/..."
                      value={newPost.attachmentUrl}
                      onChange={(e) => setNewPost({...newPost, attachmentUrl: e.target.value, attachmentName: 'External Link', attachmentType: 'link', imageUrl: ''})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 font-medium text-sm" 
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">ខ្លឹមសារ (Content)</label>
                <textarea 
                  placeholder="សរសេរខ្លឹមសារលម្អិត..."
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  rows="4"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 font-medium resize-none" 
                ></textarea>
              </div>

            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors">
                បោះបង់
              </button>
              <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-brand-blue hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-brand-blue/30 transition-all flex items-center gap-2 disabled:opacity-70">
                <Send className="w-4 h-4" /> {saving ? 'កំពុងបង្ហោះ...' : 'បង្ហោះ (Publish)'}
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
