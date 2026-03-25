import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import JobPostCard from '@/components/JobPostCard/JobPostCard';
import { useDarkmode } from "@/stores/useDarkmode";
import { Link } from 'react-router-dom';

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkmodeActive, toggleDarkmode } = useDarkmode();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get('/JobPost/all');
        // Handle both direct array response and nested { data: [] } response
        const fetchedJobs = Array.isArray(response.data) ? response.data : (response.data?.data || []);
        setJobs(fetchedJobs);
      } catch (err) {
        console.error("Error fetching all jobs:", err);
        setError("Failed to load jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 dark:from-[#0f0c29] dark:via-[#1a1a2e] dark:to-[#16213e] transition-colors duration-500 font-['Inter',sans-serif]">
      


      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Explore Opportunities</h2>
            <p className="text-gray-500 dark:text-white/40">Find the perfect job that matches your skills.</p>
          </div>
          
          {/* Simple Search/Filter Placeholder */}
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Search jobs..." 
              className="pl-10 pr-4 py-3 w-full md:w-64 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
            />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-500 transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-white/50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 animate-pulse"></div>
            ))}
          </div>
        ) : error ? (
           <div className="text-center py-20 bg-red-50 dark:bg-red-500/5 rounded-3xl border border-red-100 dark:border-red-500/10">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-24 bg-white/40 dark:bg-white/5 rounded-3xl border-2 border-dashed border-gray-200 dark:border-white/10">
            <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">🔍</div>
            <p className="text-gray-500 dark:text-white/40 font-medium">No jobs available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map(job => (
              <JobPostCard key={job.id} jobPost={job} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AllJobs;
