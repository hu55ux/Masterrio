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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0f1118]">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0f1118] p-6 text-center">
        <div className="max-w-md glass p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-lg animate-shake">
           <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
           </div>
           <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Job Not Found</h2>
           <p className="text-slate-500 dark:text-slate-400 mb-8">{error}</p>
           <Link to="/jobs" className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-700 transition-all inline-block premium-shadow">Go Back to Jobs</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f1118] transition-colors duration-300 font-['Inter',sans-serif]">
      <main className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-10">
        <div className="glass rounded-[2.5rem] border border-slate-200 dark:border-white/10 overflow-hidden premium-shadow animate-slideUpFade">
          {/* Cover */}
          <div className="h-48 md:h-64 bg-linear-to-br from-primary-600 to-primary-800 p-8 md:p-12 flex items-end">
            <div className="max-w-3xl">
              <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-xl text-xs font-black text-white uppercase tracking-widest mb-4 inline-block">
                {job.requiredSkillName || "General"}
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
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
                  <span className="text-xs text-gray-500 dark:text-white/40 uppercase font-bold tracking-widest block mb-1">Location</span>
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    {job.location || "N/A"}
                  </span>
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
              <div className="sticky top-28 p-8 bg-white dark:bg-white/5 backdrop-blur-xl rounded-4xl border border-gray-100 dark:border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-none hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] transition-colors duration-300 flex flex-col items-center text-center">
                
                {owner ? (
                  <>
                    <div className="w-24 h-24 mb-5 rounded-full bg-linear-to-br from-primary-500 to-primary-700 p-1 premium-shadow select-none">
                       <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-3xl font-black text-transparent bg-clip-text bg-linear-to-br from-primary-600 to-primary-700">
                         {owner?.firstName?.charAt(0)}{owner?.lastName?.charAt(0)}
                       </div>
                    </div>

                    <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                      Posted By
                    </h3>

                    <h4 className="text-xl font-black text-slate-900 dark:text-white mb-1.5 leading-tight">
                      {owner.firstName} {owner.lastName}
                    </h4>
                    
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 max-w-[200px] truncate">
                      {owner.email}
                    </p>

                    <Link 
                      to={`/profile/${owner?.id || owner?.userId || job?.customerId}`}
                      className="w-full py-4 text-sm bg-primary-50 dark:bg-white/5 text-primary-700 dark:text-primary-400 rounded-2xl font-black hover:bg-primary-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group premium-shadow hover:-translate-y-0.5"
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
