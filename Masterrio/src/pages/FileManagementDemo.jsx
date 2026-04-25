import React, { useState, useCallback } from 'react';
import { uploadFile } from '../services/fileService';

const FileManagementDemo = () => {
  const [file, setFile] = useState(null);
  const [folderName, setFolderName] = useState('demo');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await uploadFile(file, folderName);
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.message || 'Yükləmə uğursuz oldu.');
      }
    } catch (err) {
      setError('Serverlə əlaqə saxlayarkən xəta baş verdi.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isImage = (url) => {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url.toLowerCase());
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fadeIn">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black mb-3 bg-linear-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
          Fayl İdarəetmə Sistemi
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Bu səhifə yeni fayl yükləmə sistemini nümayiş etdirmək üçün yaradılmışdır. Fayllarınızı buraya sürükləyərək və ya seçərək yükləyə bilərsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="glass p-8 rounded-3xl border border-slate-200 dark:border-white/10 premium-shadow">
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Qovluq Adı</label>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Məs: istifadəçi-faylları"
              className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
            />
          </div>

          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-10 transition-all text-center flex flex-col items-center justify-center cursor-pointer
              ${dragActive ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-500/10' : 'border-slate-300 dark:border-slate-700 hover:border-primary-400'}
              ${file ? 'bg-slate-50 dark:bg-white/5' : ''}`}
            onClick={() => document.getElementById('file-upload').click()}
          >
            <input 
              id="file-upload"
              type="file" 
              className="hidden" 
              onChange={handleChange}
            />
            
            {file ? (
              <div className="flex flex-col items-center animate-cardAppear">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                </div>
                <span className="text-slate-800 dark:text-white font-bold max-w-[200px] truncate">{file.name}</span>
                <span className="text-slate-500 dark:text-slate-400 text-xs mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-bold">Faylı bura çəkin və ya seçin</p>
                <p className="text-slate-400 dark:text-slate-500 text-sm mt-2 font-medium">Bütün növ fayllar dəstəklənir</p>
              </>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className={`w-full mt-6 py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all active:scale-[0.98] premium-shadow
              ${!file || loading 
                ? 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-600 cursor-not-allowed' 
                : 'bg-linear-to-r from-primary-600 to-primary-700 text-white hover:brightness-110'}`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Yüklənir...
              </div>
            ) : 'Yüklə'}
          </button>
        </div>

        {/* Status/Result Section */}
        <div className="flex flex-col gap-6">
          {!result && !error && !loading && (
            <div className="glass p-12 rounded-3xl border border-slate-200 dark:border-white/10 flex flex-col items-center justify-center text-center h-full opacity-60">
              <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10 text-slate-300 dark:text-slate-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </div>
              <p className="text-slate-500 dark:text-slate-400">Nəticəni görmək üçün fayl yükləyin</p>
            </div>
          )}

          {error && (
            <div className="glass p-8 rounded-3xl border border-red-200 dark:border-red-500/20 bg-red-50/50 dark:bg-red-500/5 animate-shake">
              <div className="flex items-center gap-3 text-red-600 dark:text-red-400 font-bold mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
                Xəta Baş Verdi
              </div>
              <p className="text-red-500 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          {result && (
            <div className="glass p-8 rounded-3xl border border-accent-200 dark:border-accent-500/20 bg-accent-50/50 dark:bg-accent-500/5 animate-cardAppear">
              <div className="flex items-center gap-3 text-accent-600 dark:text-accent-500 font-bold mb-4">
                <div className="w-8 h-8 bg-accent-100 dark:bg-accent-500/20 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                Uğurla Yükləndi!
              </div>
              
              <div className="bg-white/50 dark:bg-black/20 p-4 rounded-xl border border-slate-200 dark:border-white/5 mb-6 overflow-hidden">
                <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 dark:text-slate-500 mb-1">Faylın Linki</label>
                <div className="flex gap-2 items-center">
                  <input 
                    readOnly
                    type="text" 
                    value={result.url} 
                    className="flex-1 bg-transparent border-none outline-none text-sm font-mono dark:text-white truncate"
                  />
                  <button 
                    onClick={() => navigator.clipboard.writeText(result.url)}
                    className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-primary-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                    </svg>
                  </button>
                </div>
              </div>

              {isImage(result.url) && (
                <div className="animate-cardAppear">
                  <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 dark:text-slate-500 mb-3">Ön Baxış</label>
                  <div className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 premium-shadow">
                    <img src={result.url} alt="Uploaded" className="w-full h-auto max-h-[300px] object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <a 
                        href={result.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-6 py-2 bg-white text-slate-900 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform"
                      >
                        Tam Fayla Bax
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileManagementDemo;
