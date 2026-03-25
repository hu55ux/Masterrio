import React from 'react';
import { Link } from 'react-router-dom';

const UserProfileCard = ({ user }) => {
  if (!user) return null;

  const isMaster = Array.isArray(user.roles) ? user.roles.includes('Master') : user.role === 'Master';
  const displayRole = Array.isArray(user.roles) && user.roles.length > 0 ? user.roles[0] : (user.role || 'User');
  
  return (
    <div className="w-full max-w-md bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group">
      {/* Cover/Header Section */}
      <div className="h-24 bg-linear-to-r from-violet-600 to-indigo-600 dark:from-[#7c3aed] dark:to-[#6d28d9] relative">
        <div className="absolute -bottom-12 left-6">
          <div className="w-24 h-24 rounded-2xl bg-white dark:bg-[#1a1a2e] p-1 shadow-lg group-hover:scale-105 transition-transform duration-500">
            <div className="w-full h-full rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-3xl font-bold text-violet-600 dark:text-[#a78bfa]">
              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
            </div>
          </div>
        </div>
        <div className="absolute top-4 right-6">
           <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border border-white/20 text-white backdrop-blur-md ${isMaster ? 'bg-amber-500/20' : 'bg-emerald-500/20'}`}>
            {displayRole}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="pt-16 pb-8 px-8">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {user.firstName} {user.lastName}
          </h3>
          <div className="flex items-center gap-2 text-gray-500 dark:text-white/50 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            {user.email}
          </div>
        </div>

        {/* Role Based Stats/Info */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-transparent hover:border-violet-500/20 transition-colors">
            <span className="block text-xs text-gray-500 dark:text-white/40 uppercase tracking-widest mb-1 font-semibold">Location</span>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate block">
              {user.address || 'Not specified'}
            </span>
          </div>
          <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-transparent hover:border-violet-500/20 transition-colors">
            <span className="block text-xs text-gray-500 dark:text-white/40 uppercase tracking-widest mb-1 font-semibold">Phone</span>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate block">
              {user.phoneNumber || 'Not provided'}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-transparent hover:border-violet-500/20 transition-colors">
            <span className="block text-xs text-gray-500 dark:text-white/40 uppercase tracking-widest mb-1 font-semibold">Date of Birth</span>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Unknown'}
            </span>
          </div>
          <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-transparent hover:border-violet-500/20 transition-colors">
            <span className="block text-xs text-gray-500 dark:text-white/40 uppercase tracking-widest mb-1 font-semibold">
              {isMaster ? 'Experience' : 'Member Since'}
            </span>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {isMaster ? `${user.experience || 0} Years` : 'Mar 2024'}
            </span>
          </div>
        </div>


      </div>
    </div>
  );
};

export default UserProfileCard;
