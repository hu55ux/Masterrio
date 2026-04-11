import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axiosInstance from '@/utils/axiosInstance';
import UserCard from '@/components/UserCard/UserCard';

const Clients = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchClients = async (pageNumber = 1, isInitial = false) => {
    if (isInitial) setLoading(true);
    else setLoadingMore(true);
    
    setError(null);
    try {
      const params = {
        PageNumber: pageNumber,
        PageSize: pageSize,
      };
      if (searchTerm.trim()) params.Search = searchTerm.trim();

      const response = await axiosInstance.get('/Auth/clients', { params });
      const data = response.data?.data || response.data;
      const items = data.items || [];

      if (isInitial) {
        setUsers(items);
      } else {
        setUsers(prev => [...prev, ...items]);
      }

      setPage(pageNumber);
      setHasMore(items.length === pageSize);
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError(t('catalog.clients.fetchError'));
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchClients(1, true);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchClients(page + 1, false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f1118] transition-colors duration-300 font-['Inter',sans-serif]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 animate-slideUpFade">
          <div className="max-w-2xl">
            <h1 
              className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight"
              dangerouslySetInnerHTML={{ __html: t('catalog.clients.title') }}
            />
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
              {t('catalog.clients.subtitle')}
            </p>
          </div>

          <div className="relative group w-full md:w-80">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder={t('catalog.clients.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm dark:text-white"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-80 bg-white/50 dark:bg-white/5 rounded-4xl border border-slate-200 dark:border-white/10 animate-pulse"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white dark:bg-white/5 rounded-3xl border border-red-100 dark:border-red-500/10">
            <p className="text-red-500 font-bold">{error}</p>
            <button onClick={() => fetchClients(1, true)} className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-xl">{t('common.retry')}</button>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-white/5 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-white/10">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{t('catalog.clients.noResults')}</h3>
            <p className="text-slate-500 dark:text-slate-400">{t('catalog.clients.noResultsSub')}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-cardAppear">
              {users.map(user => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-16 text-center animate-slideUpFade">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-10 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-2xl font-black shadow-sm hover:border-emerald-500 transition-all disabled:opacity-50"
                >
                  {loadingMore ? t('common.loading') : t('catalog.clients.loadMore')}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Clients;
