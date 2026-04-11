import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTokens } from '@/stores/useTokens';
import RatingModal from '../RatingModal/RatingModal';
import RatingStars from '../RatingStars/RatingStars';

const UserCard = ({ user }) => {
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const { role } = useTokens();
  const { t } = useTranslation();
  
  if (!user) return null;

  const isMaster = Array.isArray(user.roles) ? user.roles.includes('Master') : user.role === 'Master';
  const nameInitial = user.firstName?.charAt(0) || '';
  const lastNameInitial = user.lastName?.charAt(0) || '';
  
  // Only Clients and Admins can rate Masters
  const canRate = isMaster && (role === 'Client' || role === 'Admin');

  return (
    <>
      <div className="bg-white dark:bg-white/3 backdrop-blur-xl border border-gray-200 dark:border-white/6 rounded-4xl p-6 hover:shadow-[0_25px_60px_-12px_rgba(99,102,241,0.12)] dark:hover:shadow-[0_25px_60px_-12px_rgba(99,102,241,0.15)] hover:-translate-y-1.5 hover:border-primary-300/50 dark:hover:border-primary-500/20 transition-all duration-500 group flex flex-col h-full relative overflow-hidden before:absolute before:left-0 before:top-6 before:bottom-6 before:w-1 before:rounded-full before:bg-linear-to-b before:from-primary-500 before:to-violet-500 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500">
        <Link to={`/profile/${user.id}`} className="flex items-center gap-4 mb-6 hover:opacity-80 transition-opacity">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
            {nameInitial}{lastNameInitial}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-violet-500 transition-colors">
              {user.firstName} {user.lastName}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className={`w-2 h-2 rounded-full ${isMaster ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`}></div>
              <span className="text-xs font-bold text-gray-500 dark:text-white/40 uppercase tracking-widest">
                {isMaster ? 'Master' : 'Client'}
              </span>
            </div>
          </div>
        </Link>

        <div className="space-y-3 mb-8 grow">
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-white/60">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-violet-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span className="truncate">{user.address || t('profile.locationHidden')}</span>
          </div>
          
          {isMaster && (
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-white/60">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-amber-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .621-.504 1.125-1.125 1.125H4.875c-.621 0-1.125-.504-1.125-1.125v-4.25m16.5 0a2.25 2.25 0 0 0-2.25-2.25H12m8.25 2.25H3.75m16.5 0V9.45c0-.621-.504-1.125-1.125-1.125h-5.45c-.328 0-.642.142-.857.39l-1.071 1.285c-.215.248-.53.39-.857.39H4.875c-.621 0-1.125.504-1.125 1.125v4.7m16.5 0h-3.75a2.25 2.25 0 0 1-2.25-2.25V9.45m-10.5 0h3.75M9 3.75h6M9 3.75a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5M9 3.75V2.25c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125v1.5" />
              </svg>
              <span>{user.experience || 0} {t('profile.yearsExperience')}</span>
            </div>
          )}

          {user.averageScore > 0 && (
            <div className="flex items-center gap-3">
              <RatingStars score={user.averageScore} />
              <span className="text-sm font-bold text-amber-500">{user.averageScore.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Removed skills display from card as requested */}

        <div className="flex gap-2">
          <Link 
            to={`/profile/${user.id}`}
            className="flex-1 py-4 text-center bg-gray-50 dark:bg-white/5 hover:bg-violet-600 hover:text-white dark:hover:bg-violet-600 rounded-2xl font-bold transition-all duration-300"
          >
            {t('profile.viewProfile')}
          </Link>
          {canRate && (
            <button
              onClick={() => setIsRatingModalOpen(true)}
              className="px-5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white rounded-2xl transition-all duration-300 flex items-center justify-center group/btn"
              title={t('modals.rateMaster.title') || "Rate Master"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover/btn:scale-110 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <RatingModal 
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        masterId={user.id}
        onRatingSuccess={() => {
          window.location.reload(); 
        }}
      />
    </>
  );
};

export default UserCard;
