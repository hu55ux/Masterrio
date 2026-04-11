import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '@/utils/axiosInstance';

const StatusBadge = ({ status }) => {
  const configs = {
    0: { label: 'Pending', icon: '⏳', dot: 'bg-amber-500', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-400/10', border: 'border-amber-200/50 dark:border-amber-400/20' },
    1: { label: 'Active', icon: '⚡', dot: 'bg-emerald-500', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-400/10', border: 'border-emerald-200/50 dark:border-emerald-400/20', pulse: true },
    2: { label: 'In Progress', icon: '🔄', dot: 'bg-blue-500', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-400/10', border: 'border-blue-200/50 dark:border-blue-400/20', pulse: true },
    3: { label: 'Completed', icon: '✨', dot: 'bg-violet-500', color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-400/10', border: 'border-violet-200/50 dark:border-violet-400/20' },
    4: { label: 'Canceled', icon: '🚫', dot: 'bg-rose-500', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-400/10', border: 'border-rose-200/50 dark:border-rose-400/20' },
  };

  const config = configs[status] || configs[0];

  return (
    <div className={`inline-flex items-center gap-2 px-3.5 py-2 ${config.bg} ${config.color} ${config.border} border rounded-2xl backdrop-blur-md transition-all duration-300 group/status`}>
      <div className="relative flex h-2 w-2">
        {config.pulse && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.dot} opacity-75`}></span>}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dot}`}></span>
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.15em] leading-none">{config.label}</span>
    </div>
  );
};

const JobPostCard = ({ jobPost, isManageMode = false, onDelete, onEditStatus, onEditJob }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [ownerInfo, setOwnerInfo] = useState(null);
  const [loadingOwner, setLoadingOwner] = useState(false);

  const handleDelete = (e) => { e.stopPropagation(); onDelete(jobPost.id); };
  const handleEditStatus = (e) => { e.stopPropagation(); onEditStatus(jobPost); };
  const handleEditJob = (e) => { e.stopPropagation(); onEditJob(jobPost); };

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

  const displayOwnerName = jobPost.customerName || (ownerInfo ? `${ownerInfo.firstName} ${ownerInfo.lastName}` : "Unknown Customer");
  const displayOwnerId = jobPost.customerId || ownerInfo?.id || ownerInfo?.userId;
  const displayOwnerInitial = (jobPost.customerName || ownerInfo?.firstName || 'C').charAt(0).toUpperCase();

  const date = jobPost?.createdDate
    ? new Date(jobPost.createdDate).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  if (!jobPost) return null;
  const currentStatus = jobPost.status !== undefined ? jobPost.status : jobPost.jpStatus;

  return (
    <div
      className="w-full bg-white dark:bg-white/3 backdrop-blur-xl border border-gray-200/80 dark:border-white/6 rounded-4xl p-7 hover:shadow-[0_25px_60px_-12px_rgba(99,102,241,0.12)] dark:hover:shadow-[0_25px_60px_-12px_rgba(99,102,241,0.15)] hover:-translate-y-1.5 hover:border-primary-300/50 dark:hover:border-primary-500/20 transition-all duration-500 group overflow-hidden flex flex-col relative before:absolute before:left-0 before:top-8 before:bottom-8 before:w-1 before:rounded-full before:bg-linear-to-b before:from-primary-500 before:to-violet-500 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Decorative gradient orb */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary-500/5 dark:bg-primary-500/3 rounded-full blur-3xl group-hover:bg-primary-500/10 transition-all duration-700 pointer-events-none"></div>

      {/* Top Header */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-slate-100 to-slate-200/50 dark:from-white/10 dark:to-white/5 border border-slate-200/50 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-white/70 font-black text-sm overflow-hidden shadow-sm shrink-0 group-hover:shadow-md transition-shadow">
            {ownerInfo?.profilePicture ? <img src={ownerInfo.profilePicture} alt="" className="w-full h-full object-cover" /> : displayOwnerInitial}
          </div>
          <div>
            <Link 
              to={displayOwnerId ? `/profile/${displayOwnerId}` : '#'} 
              onClick={(e) => e.stopPropagation()} 
              className="text-sm font-black text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-1"
            >
              {loadingOwner ? "Loading..." : displayOwnerName}
            </Link>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-slate-400 dark:text-white/25 uppercase tracking-[0.2em] leading-none">Client</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tags Row */}
      <div className="flex flex-wrap items-center gap-2 mb-5 relative z-10">
        <StatusBadge status={currentStatus} />
        <div className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary-50/80 dark:bg-primary-500/8 text-primary-600 dark:text-primary-400 border border-primary-200/30 dark:border-primary-500/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] shadow-xs backdrop-blur-md">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.659A2.25 2.25 0 0 0 9.568 3Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
          </svg>
          <span className="leading-none">{jobPost.requiredSkillName || "General"}</span>
        </div>
      </div>

      {/* Title & Description */}
      <div className="grow flex flex-col mb-6 relative z-10">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 mb-3 line-clamp-2">
          {jobPost.title}
        </h3>

        <div className="flex items-center gap-2.5 text-sm font-bold text-slate-500 dark:text-white/60 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-violet-500 group-hover:scale-110 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          <span className="truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{jobPost.location || "Location not specified"}</span>
        </div>

        <p className={`text-slate-500 dark:text-white/50 text-sm leading-relaxed ${isExpanded ? "" : "line-clamp-2"}`}>
          {jobPost.description}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-slate-100/80 dark:border-white/4 flex items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-5">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-400/80 dark:text-white/25 uppercase tracking-[0.2em] mb-1">Budget</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black bg-linear-to-r from-primary-600 to-violet-600 dark:from-primary-400 dark:to-violet-400 bg-clip-text text-transparent leading-none">{jobPost.budget}</span>
              <span className="text-[10px] font-black text-slate-400 dark:text-white/30 uppercase tracking-widest">AZN</span>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200/60 dark:bg-white/6"></div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-400/80 dark:text-white/25 uppercase tracking-[0.2em] mb-1">Posted</span>
            <span className="text-sm font-bold text-slate-600 dark:text-white/60 leading-none">{date}</span>
          </div>
        </div>

        {isManageMode ? (
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-white/3 border border-slate-100 dark:border-white/5 rounded-2xl p-1">
            <button onClick={handleEditJob} className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-white dark:hover:bg-white/5 rounded-xl transition-all" title="Edit"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.13 1.897L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931zm0 0L19.5 7.125" /></svg></button>
            <button onClick={handleEditStatus} className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-white dark:hover:bg-white/5 rounded-xl transition-all" title="Status"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg></button>
            <button onClick={handleDelete} className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-white dark:hover:bg-white/5 rounded-xl transition-all" title="Delete"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg></button>
          </div>
        ) : (
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${isExpanded ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25' : 'bg-slate-50 dark:bg-white/3 text-slate-400 border border-slate-100 dark:border-white/5 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-500/10 dark:hover:text-primary-400'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? '-rotate-180' : ''}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        )}
      </div>

      {/* Expandable Section */}
      <div className={`grid transition-[grid-template-rows,opacity,margin] duration-400 ease-in-out ${isExpanded ? "grid-rows-[1fr] opacity-100 mt-6" : "grid-rows-[0fr] opacity-0 mt-0"}`}>
        <div className="overflow-hidden">
          <div className="pt-6 border-t border-slate-100/80 dark:border-white/4">
            <Link
              to={`/job/${jobPost.id}`}
              onClick={(e) => e.stopPropagation()}
              className="w-full py-4 bg-linear-to-r from-primary-600 to-violet-600 hover:from-primary-700 hover:to-violet-700 text-white font-black rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-lg hover:shadow-xl hover:shadow-primary-600/20 group/btn"
            >
              View Full Details
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPostCard;
