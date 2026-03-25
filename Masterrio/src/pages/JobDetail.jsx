import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '@/utils/axiosInstance';
import { useDarkmode } from "@/stores/useDarkmode";

const JobDetail = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkmodeActive } = useDarkmode();

  useEffect(() => {
    const fetchJobData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch Job Info
        const jobResponse = await axiosInstance.get(`/JobPost/${jobId}`);
        setJob(jobResponse.data?.data || jobResponse.data);

        // 2. Fetch Owner Info
        const ownerResponse = await axiosInstance.get(`/JobPost/${jobId}/owner`);
        setOwner(ownerResponse.data?.data || ownerResponse.data);
      } catch (err) {
        console.error("Error fetching job details:", err);
        setError("Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobData();
    }
  }, [jobId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-purple-50 dark:from-[#0f0c29] dark:via-[#1a1a2e] dark:to-[#16213e]">
        <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-purple-50 dark:from-[#0f0c29] dark:via-[#1a1a2e] dark:to-[#16213e] p-6 text-center">
        <div className="max-w-md bg-white dark:bg-white/5 p-8 rounded-3xl border border-gray-200 dark:border-white/10 shadow-lg">
           <h2 className="text-2xl font-bold dark:text-white mb-4">Job Not Found</h2>
           <p className="text-gray-500 mb-8">{error}</p>
           <Link to="/jobs" className="px-6 py-3 bg-violet-600 text-white rounded-xl font-bold">Go Back to Jobs</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 dark:from-[#0f0c29] dark:via-[#1a1a2e] dark:to-[#16213e] transition-colors duration-500 font-['Inter',sans-serif]">
      


      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-2xl">
          {/* Cover */}
          <div className="h-48 bg-linear-to-r from-indigo-600 to-violet-600 p-8 flex items-end">
            <div>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white uppercase tracking-wider mb-2 inline-block">
                {job.requiredSkillName || "General"}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                {job.title}
              </h1>
            </div>
          </div>

          <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Job Description</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-8 py-6 border-y border-gray-100 dark:border-white/5">
                <div>
                  <span className="text-xs text-gray-500 dark:text-white/40 uppercase font-bold tracking-widest block mb-1">Budget</span>
                  <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{job.budget} AZN</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 dark:text-white/40 uppercase font-bold tracking-widest block mb-1">Status</span>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 rounded-full text-sm font-bold">
                    {job.status}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 dark:text-white/40 uppercase font-bold tracking-widest block mb-1">Posted</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {job.createdDate ? new Date(job.createdDate).toLocaleDateString() : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Sidebar / Owner Info Card */}
            <div>
              <div className="sticky top-28 p-8 bg-white dark:bg-white/5 backdrop-blur-xl rounded-4xl border border-gray-100 dark:border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-none hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col items-center text-center">
                
                {owner ? (
                  <>
                    <div className="w-24 h-24 mb-5 rounded-full bg-linear-to-br from-violet-500 to-indigo-600 p-1 shadow-lg shadow-violet-500/20 select-none">
                       <div className="w-full h-full rounded-full bg-white dark:bg-[#1a1a2e] flex items-center justify-center text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-br from-violet-600 to-indigo-600">
                         {owner?.firstName?.charAt(0)}{owner?.lastName?.charAt(0)}
                       </div>
                    </div>

                    <h3 className="text-xs font-bold text-gray-400 dark:text-white/40 uppercase tracking-[0.2em] mb-2">
                      Posted By
                    </h3>

                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1.5 leading-tight">
                      {owner.firstName} {owner.lastName}
                    </h4>
                    
                    <p className="text-sm font-medium text-gray-500 dark:text-white/50 mb-8 max-w-[200px] truncate">
                      {owner.email}
                    </p>

                    <Link 
                      to={`/profile/${owner?.id || owner?.userId || job?.customerId}`}
                      className="w-full py-4 text-sm bg-violet-50 dark:bg-white/5 text-violet-700 dark:text-[#c4b5fd] rounded-2xl font-bold hover:bg-violet-600 hover:text-white dark:hover:bg-violet-600 transition-all duration-300 flex items-center justify-center gap-2 group shadow-sm hover:shadow-[0_10px_20px_-5px_rgba(124,58,237,0.3)] hover:-translate-y-0.5"
                    >
                      View Full Profile
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  </>
                ) : (
                  <div className="py-12">
                     <p className="text-sm text-gray-400 italic">Owner info unavailable</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default JobDetail;
