import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import JobPostCard from '@/components/JobPostCard/JobPostCard';
import { useDarkmode } from "@/stores/useDarkmode";
import { Link } from 'react-router-dom';

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(9);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const { isDarkmodeActive } = useDarkmode();

  const statuses = ["All", "Active", "Pending", "InProgress", "Completed", "Canceled"];

  const fetchJobs = async (pageNumber = 1, isInitial = false) => {
    if (isInitial) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    setError(null);
    try {
      const params = {
        Page: pageNumber,
        PageSize: pageSize,
        Sort: 'CreatedDate',
        SortDirection: 'desc',
      };

      if (searchTerm.trim()) params.SearchTerm = searchTerm.trim();
      if (status !== "All") params.Status = status;

      console.log("Fetching jobs with params:", params);
      const response = await axiosInstance.get('/JobPost/paged', { params });

      const result = response.data;
      let fetchedJobs = [];
      if (Array.isArray(result)) {
        fetchedJobs = result;
      } else if (Array.isArray(result?.data)) {
        fetchedJobs = result.data;
      } else if (Array.isArray(result?.data?.items)) {
        fetchedJobs = result.data.items;
      } else if (Array.isArray(result?.items)) {
        fetchedJobs = result.items;
      }

      if (isInitial) {
        setJobs(fetchedJobs);
      } else {
        setJobs(prev => {
          // Prevent duplicates
          const existingIds = new Set(prev.map(j => j.id));
          const newUniqueJobs = fetchedJobs.filter(j => !existingIds.has(j.id));
          return [...prev, ...newUniqueJobs];
        });
      }

      setPage(pageNumber);
      setHasMore(fetchedJobs.length === pageSize);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to load jobs. Please check your connection.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Initial load or search/status changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchJobs(1, true);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, status]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchJobs(page + 1, false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f1118] transition-colors duration-300 font-['Inter',sans-serif]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 animate-slideUpFade">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
              Find Your Next <span className="text-primary-600 dark:text-primary-400">Masterpiece</span>
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
              Browse through a curated list of high-quality job opportunities from verified clients across the platform.
            </p>
          </div>

          <div className="relative group w-full md:w-80">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by title or skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all premium-shadow dark:text-white"
            />
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-slate-100 dark:border-white/5 animate-slideUpFade delay-100">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${status === s
                ? "bg-primary-600 text-white shadow-lg shadow-primary-500/20"
                : "bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10"
                }`}
            >
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-72 bg-white/50 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10 animate-pulse premium-shadow"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 glass rounded-[2.5rem] border border-red-100 dark:border-red-500/10 animate-shake">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
            </div>
            <p className="text-red-600 dark:text-red-400 font-bold text-lg">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all">Retry</button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-24 glass rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-white/10">
            <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-4xl flex items-center justify-center mx-auto mb-6 text-3xl">🔍</div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No jobs found</h3>
            <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or check back later.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-cardAppear">
              {jobs.map(job => (
                <JobPostCard key={job.id} jobPost={job} />
              ))}
            </div>

            {hasMore ? (
              <div className="mt-16 text-center animate-slideUpFade">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-10 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-2xl font-black premium-shadow hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                >
                  <span className={loadingMore ? "opacity-0" : "flex items-center gap-2"}>
                    Load More Jobs
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover:translate-y-1 transition-transform">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                  {loadingMore && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </button>
              </div>
            ) : jobs.length > 0 && (
              <div className="mt-16 text-center animate-slideUpFade opacity-40">
                <p className="text-slate-500 dark:text-slate-400 font-medium">You've reached the end of the collection ✨</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AllJobs;
