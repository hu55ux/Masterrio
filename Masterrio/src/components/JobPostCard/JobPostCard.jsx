import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '@/utils/axiosInstance';

const JobPostCard = ({ jobPost, isManageMode = false, onDelete, onEditStatus, onEditJob }) => {
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(jobPost.id);
  };

  const handleEditStatus = (e) => {
    e.stopPropagation();
    onEditStatus(jobPost);
  };

  const handleEditJob = (e) => {
    e.stopPropagation();
    onEditJob(jobPost);
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

  const currentStatus = jobPost.status !== undefined ? jobPost.status : jobPost.jpStatus;

  return (
    <div
      className="w-full bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-md dark:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="p-5 flex flex-col gap-4">
        {/* Header: Title and Status */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-3 flex-wrap mb-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-2 leading-tight">
                {jobPost.title}
              </h3>
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider inline-flex items-center self-start mt-0.5 shadow-sm ${
                currentStatus === 'Pending' || currentStatus === 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                currentStatus === 'Active' || currentStatus === 1 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                currentStatus === 'InProgress' || currentStatus === 2 ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                currentStatus === 'Completed' || currentStatus === 3 ? 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400' :
                'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400' // Canceled
              }`}>
                {currentStatus === 0 ? 'Pending' :
                 currentStatus === 1 ? 'Active' :
                 currentStatus === 2 ? 'In Progress' :
                 currentStatus === 3 ? 'Completed' :
                 currentStatus === 4 ? 'Canceled' :
                 currentStatus || 'Unknown'}
              </span>
            </div>
            <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
              {jobPost.requiredSkillName}
            </p>
          </div>
          
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Budget</p>
              <p className="text-xl md:text-2xl font-black text-primary-600 dark:text-primary-400">
                {jobPost.budget} <span className="text-sm font-medium">AZN</span>
              </p>
            </div>
          </div>
        </div>

        <p className={`text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed mb-6 ${isExpanded ? "" : "line-clamp-2"}`}>
          {jobPost.description}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-white/10">
              {loadingOwner ? (
                <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
              ) : ownerInfo?.profilePicture ? (
                <img src={ownerInfo.profilePicture} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-slate-400 font-bold">{displayOwnerInitial}</span>
              )}
            </div>
            <div>
              <Link 
                to={displayOwnerId ? `/profile/${displayOwnerId}` : '#'}
                onClick={(e) => e.stopPropagation()}
                className={`text-sm font-bold text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors ${!displayOwnerId && 'pointer-events-none'}`}
              >
                {loadingOwner ? "Loading..." : displayOwnerName}
              </Link>
              <p className="text-xs text-slate-500 dark:text-slate-400">Client</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{jobPost.requiredSkillName || "No skill specified"}</span>
            </div>
            
            {isManageMode && (
              <div className="flex gap-1">
                <button 
                  onClick={handleEditJob}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                  title="Edit Job Details"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.13 1.897L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                  </svg>
                </button>
                <button 
                  onClick={handleEditStatus}
                  className="p-1.5 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-lg transition-colors"
                  title="Change Job Status"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                  </svg>
                </button>
                <button 
                  onClick={handleDelete}
                  className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Remove Job"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 6m-4.74 0-.34-6m4.74-6.33L14.5 3h-5l-.31 3.33M4.5 18.75A2.25 2.25 0 0 0 6.75 21h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75H4.5v12z" />
                  </svg>
                </button>
              </div>
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
