'use client';
import { useState, useEffect } from 'react';
import { Bell, Loader2, Megaphone, Calendar, FileText, Download, ExternalLink } from 'lucide-react';
import Image from 'next/image';

export default function ParentAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements');
      const json = await res.json();
      if (json.success) {
        // Filter for "Everyone" or "Students Only" for parents (mocking typical parent access)
        const visible = json.data.filter(a => a.audience === 'everyone' || a.audience === 'students');
        setAnnouncements(visible);
      }
    } catch (err) {
      console.error('Failed to fetch announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAttachmentIcon = (type) => {
    if (!type) return <FileText className="w-5 h-5" />;
    if (type.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    if (type.includes('sheet') || type.includes('excel')) return <FileText className="w-5 h-5 text-emerald-500" />;
    if (type.includes('word')) return <FileText className="w-5 h-5 text-blue-500" />;
    if (type.includes('presentation') || type.includes('powerpoint')) return <FileText className="w-5 h-5 text-orange-500" />;
    return <FileText className="w-5 h-5" />;
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">សេចក្តីជូនដំណឹង (News)</h1>
        <p className="text-slate-500 font-medium mt-1">ព័ត៌មាន និងព្រឹត្តិការណ៍ពីសាលារៀន</p>
      </header>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : (
        <div className="space-y-6 max-w-3xl mx-auto w-full pb-10">
          {announcements.length === 0 ? (
            <div className="text-center p-12 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-bold">មិនទាន់មានសេចក្តីជូនដំណឹងទេ</p>
            </div>
          ) : (
            announcements.map((post) => {
              const isImage = post.attachmentType && post.attachmentType.includes('image');
              const isDocument = post.attachmentUrl && !isImage;
              
              return (
                <article key={post.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-md transition-shadow">
                  {/* Image Cover */}
                  {isImage && (
                    <div className="w-full h-64 bg-slate-100 relative">
                      <Image 
                        src={post.attachmentUrl} 
                        alt="Cover" 
                        fill 
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-4">
                      {post.type === 'event' ? (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                          <Calendar className="w-3.5 h-3.5" /> ព្រឹត្តិការណ៍
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
                          <Megaphone className="w-3.5 h-3.5" /> ព័ត៌មាន
                        </span>
                      )}
                      <span className="text-xs font-medium text-slate-400">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-bold text-slate-800 mb-3">{post.title}</h2>
                    <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">{post.content}</p>

                    {post.type === 'event' && post.eventDate && (
                      <div className="mt-4 p-4 bg-slate-50 rounded-2xl flex items-center gap-3 border border-slate-100">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-slate-700">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase">កាលបរិច្ឆេទកម្មវិធី</p>
                          <p className="font-bold text-slate-800">{new Date(post.eventDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    )}

                    {/* Document Attachment Button */}
                    {isDocument && (
                      <div className="mt-6 pt-6 border-t border-slate-100">
                        <a 
                          href={post.attachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer" 
                          className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors group/link"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                              {getAttachmentIcon(post.attachmentType)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-700 text-sm">{post.attachmentName || 'ឯកសារភ្ជាប់ (Attachment)'}</p>
                              <p className="text-xs text-slate-400 font-medium">{post.attachmentType ? 'Document File' : 'External Link'}</p>
                            </div>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 group-hover/link:bg-indigo-600 group-hover/link:text-white group-hover/link:border-indigo-600 transition-colors text-slate-400">
                            {post.attachmentUrl.startsWith('/uploads') ? <Download className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                          </div>
                        </a>
                      </div>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
