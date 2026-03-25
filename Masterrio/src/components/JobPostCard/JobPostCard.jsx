import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '@/utils/axiosInstance';

const JobPostCard = ({ jobPost, isManageMode = false, onDelete }) => {
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(jobPost.id);
  };
  const [isExpanded, setIsExpanded] = useState(false);
  const [ownerInfo, setOwnerInfo] = useState(null);
  const [loadingOwner, setLoadingOwner] = useState(false);

  // Fetch owner info if missing and card is expanded
  useEffect(() => {
    const fetchOwner = async () => {
      if (isExpanded && !ownerInfo && !jobPost.customerId) {
        setLoadingOwner(true);
        try {
          const response = await axiosInstance.get(`/JobPost/${jobPost.id}/owner`);
          setOwnerInfo(response.data);
        } catch (err) {
          console.error("Error fetching job owner:", err);
        } finally {
          setLoadingOwner(false);
        }
      }
    };
    fetchOwner();
  }, [isExpanded, jobPost.id, jobPost.customerId, ownerInfo]);

  const displayOwnerName = jobPost.customerName || ownerInfo?.firstName + " " + ownerInfo?.lastName || "Unknown Customer";
  const displayOwnerId = jobPost.customerId || ownerInfo?.id || ownerInfo?.userId;
  const displayOwnerInitial = (jobPost.customerName || ownerInfo?.firstName || 'C').charAt(0).toUpperCase();

  // Format date
  const date = jobPost?.createdDate
    ? new Date(jobPost.createdDate).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
    : '';

  if (!jobPost) return null;

  return (
    <div
      className="w-full bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-md dark:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="p-5 flex flex-col gap-4">
        {/* Header: Title and Status */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-2">
              {jobPost.title}
            </h3>
            <p className="text-sm font-medium text-violet-600 dark:text-[#a78bfa] mt-1">
              {jobPost.requiredSkillName}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${jobPost.status?.toLowerCase() === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300'}`}>
              {jobPost.status}
            </span>
            {isManageMode && (
              <button 
                onClick={handleDelete}
                className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                title="Delete Job Post"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Short Info: Budget and Date */}
        <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-white/60">
          <div className="flex items-center gap-1.5 flex-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-emerald-500 dark:text-emerald-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold text-gray-700 dark:text-gray-300">{jobPost.budget} AZN</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            <span>{date}</span>
          </div>
        </div>

        {/* Expandable Content Container using Grid template trick for smooth height animation */}
        <div
          className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0 mt-0"
            }`}
        >
          <div className="overflow-hidden">
            <div className="pt-4 border-t border-gray-100 dark:border-white/10 flex flex-col gap-4 text-sm text-gray-600 dark:text-gray-300">

              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Description</h4>
                <p className="leading-relaxed whitespace-pre-line">{jobPost.description}</p>
              </div>

              <Link
                to={displayOwnerId ? `/profile/${displayOwnerId}` : '#'}
                className={`bg-gray-50 dark:bg-white/5 p-4 rounded-xl flex items-center justify-between hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-colors group/user ${!displayOwnerId && 'pointer-events-none opacity-50'}`}
                onClick={(e) => e.stopPropagation()}
              >
                <div>
                  <span className="block text-xs text-gray-500 dark:text-white/50 mb-1 uppercase tracking-wider">Customer</span>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-300 flex items-center justify-center font-bold text-xs group-hover/user:scale-110 transition-transform">
                      {loadingOwner ? (
                        <div className="w-3 h-3 border-2 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        displayOwnerInitial
                      )}
                    </div>
                    <span className="font-medium text-gray-800 dark:text-gray-200 group-hover/user:text-violet-600 dark:group-hover/user:text-violet-400 transition-colors">
                      {loadingOwner ? "Loading..." : displayOwnerName}
                    </span>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-400 group-hover/user:text-violet-500 group-hover/user:translate-x-1 transition-all">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>

              <div className="mt-2 flex justify-between items-center">
                <Link
                  to={`/job/${jobPost.id}`}
                  className="text-violet-600 dark:text-[#a78bfa] font-semibold text-sm hover:underline flex items-center gap-1 group/det"
                  onClick={(e) => e.stopPropagation()}
                >
                  View Full Details
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 group-hover/det:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>


              </div>
            </div>
          </div>
        </div>

        {/* Expand Icon - chevron pointing down or up */}
        <div className="flex justify-center -mb-2 mt-1">
          <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 dark:text-white/40 group-hover:bg-violet-50 dark:group-hover:bg-violet-500/10 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? '-rotate-180 text-violet-500' : ''}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
};

export default JobPostCard;
