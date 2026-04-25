import React, { useState, useEffect } from 'react';
import { getFiles, deleteFile, uploadFile } from '../services/fileService';
import { useTokens } from '../stores/useTokens';
import { Navigate } from 'react-router-dom';

const AdminFileManagement = () => {
  const { role } = useTokens();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFileObj, setUploadFileObj] = useState(null);
  const [uploadFolderName, setUploadFolderName] = useState('uploads');
  const [search, setSearch] = useState('');

  // Sadece admin girişi
  const fetchFiles = async () => {
    setLoading(true);
    try {
      const data = await getFiles();
      if (data.success) {
        // Sort newest first
        const sorted = data.data.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
        setFiles(sorted);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Faylları gətirərkən xəta baş verdi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === 'Admin') {
      fetchFiles();
    }
  }, [role]);

  if (role !== 'Admin') {
    return <Navigate to="/jobs" replace />;
  }

  const handleDelete = async (url) => {
    if (!window.confirm('Bu faylı silmək istədiyinizə əminsiniz?')) return;

    try {
      const data = await deleteFile(url);
      if (data.success) {
        setFiles(files.filter(f => f.url !== url));
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Fayl silinərkən xəta baş verdi.');
    }
  };

  const filteredFiles = files.filter(f => 
    f.key.toLowerCase().includes(search.toLowerCase()) || 
    f.url.toLowerCase().includes(search.toLowerCase())
  );

  const isImage = (url) => /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(url);

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUploadClick = async () => {
    if (!uploadFileObj) return;
    setUploading(true);
    try {
      const data = await uploadFile(uploadFileObj, uploadFolderName);
      if (data.success) {
        setShowUploadModal(false);
        setUploadFileObj(null);
        fetchFiles();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Yükləmə xətası baş verdi.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fadeIn relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            Admin Fayl İdarəetməsi
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Sistemdəki bütün faylları idarə edin, silin və ya yenilərini yükləyin.
          </p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={() => setShowUploadModal(true)}
            className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold flex items-center gap-2 premium-shadow hover:brightness-110 transition-all active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Yüklə
          </button>
          <input 
            type="text" 
            placeholder="Fayl axtar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 md:w-64 px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          />
          <button 
            onClick={fetchFiles}
            className="p-3 bg-slate-100 dark:bg-white/5 rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
            title="Yenilə"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
        </div>
      </div>

      <div className="glass rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden premium-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Fayl</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Qovluq</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Ölçü</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Tarix</th>
                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
                      <span className="text-slate-400 font-medium">Fayllar yüklənir...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredFiles.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-40">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.001.217-.006.321-.014a19.119 19.119 0 0 0 1.585-.233c.299-.052.598-.109.897-.17a19.119 19.119 0 0 0 1.585-.395c.299-.089.598-.184.897-.287a19.119 19.119 0 0 0 1.585-.623c.299-.138.598-.138.897-.432a19.119 19.119 0 0 0 1.585-.826c.299-.176.598-.362.897-.558a19.119 19.119 0 0 0 1.585-1.127c.299-.236.598-.482.897-.738a19.119 19.119 0 0 0 1.585-1.558c.299-.313.598-.636.897-.968a19.119 19.119 0 0 0 1.585-2.227c.299-.446.598-.902.897-1.368" />
                      </svg>
                      <span className="text-lg font-bold">Fayl tapılmadı</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredFiles.map((file) => (
                  <tr 
                    key={file.key} 
                    className="group border-b border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-all duration-300"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-white/10 shrink-0 border border-slate-200 dark:border-white/10 premium-shadow">
                          {isImage(file.url) ? (
                            <img 
                              src={file.url} 
                              alt="" 
                              className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25" />
                              </svg>
                            </div>
                          )}
                          
                          {/* Hover Zoom Preview Overlay */}
                          {isImage(file.url) && (
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]" title={file.key.split('/').pop()}>
                            {file.key.split('/').pop()}
                          </span>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(file.url);
                              // alert('URL kopyalandı!'); 
                            }}
                            className="text-[10px] uppercase tracking-wider font-bold text-primary-500 hover:text-primary-600 transition-colors text-left"
                          >
                            URL-i kopyala
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10">
                        {file.key.split('/').slice(0, -1).join('/') || 'root'}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                        {formatSize(file.size)}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                          {new Date(file.lastModified).toLocaleDateString()}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-tighter">
                          {new Date(file.lastModified).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <a 
                          href={file.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all active:scale-90"
                          title="Bax"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </a>
                        <button 
                          onClick={() => handleDelete(file.url)}
                          className="p-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20 hover:bg-red-500 hover:text-white transition-all active:scale-90 shadow-sm"
                          title="Sil"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="glass w-full max-w-md p-8 rounded-4xl border border-white/20 premium-shadow animate-cardAppear">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black dark:text-white">Yeni Fayl Yüklə</h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Qovluq Adı</label>
                <input 
                  type="text" 
                  value={uploadFolderName}
                  onChange={(e) => setUploadFolderName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Fayl Seçin</label>
                <div 
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all
                    ${uploadFileObj ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10' : 'border-slate-200 dark:border-slate-800 hover:border-primary-400'}`}
                  onClick={() => document.getElementById('admin-file-upload').click()}
                >
                  <input 
                    id="admin-file-upload"
                    type="file" 
                    className="hidden" 
                    onChange={(e) => setUploadFileObj(e.target.files[0])}
                  />
                  {uploadFileObj ? (
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-500/20 text-primary-600 rounded-full flex items-center justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25" />
                        </svg>
                      </div>
                      <span className="text-sm font-bold truncate max-w-full dark:text-white">{uploadFileObj.name}</span>
                    </div>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 mx-auto text-slate-300 mb-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                      <p className="text-sm text-slate-500">Seçmək üçün klikləyin</p>
                    </>
                  )}
                </div>
              </div>

              <button 
                onClick={handleUploadClick}
                disabled={!uploadFileObj || uploading}
                className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all
                  ${!uploadFileObj || uploading ? 'bg-slate-100 dark:bg-white/5 text-slate-400' : 'bg-primary-600 text-white hover:brightness-110 active:scale-95 shadow-lg shadow-primary-500/20'}`}
              >
                {uploading ? 'Yüklənir...' : 'Yükləməni Başlat'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFileManagement;
