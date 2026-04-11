import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '@/utils/axiosInstance';
import UserProfileCard from '@/components/UserProfileCard/UserProfileCard';
import JobPostCard from '@/components/JobPostCard/JobPostCard';
import SkillCard from '@/components/SkillCard/SkillCard';
import RatingModal from '@/components/RatingModal/RatingModal';
import RatingStars from '@/components/RatingStars/RatingStars';
import { useDarkmode } from "@/stores/useDarkmode";
import { useTokens } from '@/stores/useTokens';

const UserProfile = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { isDarkmodeActive } = useDarkmode();
  const { userId } = useTokens();
  const [userData, setUserData] = useState(null);
  const [userItems, setUserItems] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [editingRating, setEditingRating] = useState(null);
  const [isNewRatingModalOpen, setIsNewRatingModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfileData = async () => {
    setLoading(true);
    setError(null);
    try {
      const userResponse = await axiosInstance.post('/Auth/details', { userId: id });
      const user = userResponse.data?.data || userResponse.data;
      setUserData(user);

      try {
        const isMaster = Array.isArray(user?.roles) ? user.roles.includes('Master') : user?.role === 'Master';
        if (isMaster) {
          // Fetch skills via the new getSkillsByUserId endpoint
          const skillsResponse = await axiosInstance.get(`/Skill/user/${id}`);
          setUserItems(Array.isArray(skillsResponse.data) ? skillsResponse.data : (skillsResponse.data?.data || []));
          
          const ratingsResponse = await axiosInstance.get(`/MasterRating/${id}`);
          setRatings(ratingsResponse.data?.data || ratingsResponse.data || []);
        } else {
          const jobsResponse = await axiosInstance.get(`/JobPost/user/${id}`);
          const fetchedJobs = Array.isArray(jobsResponse.data) ? jobsResponse.data : (jobsResponse.data?.data || []);
          setUserItems(fetchedJobs);
        }
      } catch (itemErr) {
        console.error("Error fetching related items:", itemErr);
        setUserItems([]);
        setRatings([]);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(t('profile.userNotFound'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProfileData();
    }
  }, [id]);

  const handleDeleteRating = async (masterId, customerId) => {
    if (!window.confirm(t('modals.confirm.deleteReviewMessage'))) return;
    try {
      await axiosInstance.delete(`/MasterRating/${masterId}/${customerId}`);
      // Refresh data
      fetchProfileData();
    } catch (err) {
      console.error("Delete error:", err);
      alert('Failed to delete rating');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-purple-50 dark:from-[#0f0c29] dark:via-[#1a1a2e] dark:to-[#16213e]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 dark:text-white/50 font-medium animate-pulse">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-purple-50 dark:from-[#0f0c29] dark:via-[#1a1a2e] dark:to-[#16213e] p-6">
        <div className="max-w-md w-full bg-white dark:bg-white/5 backdrop-blur-xl p-10 rounded-3xl border border-gray-200 dark:border-white/10 text-center shadow-xl">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('common.error')}</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">{error || t('profile.userNotFound')}</p>
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 dark:bg-[#7c3aed] text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors">
            {t('profile.goBack')}
          </Link>
        </div>
      </div>
    );
  }

  const isMaster = (Array.isArray(userData.roles) ? userData.roles.includes('Master') : userData.role === 'Master');

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 dark:from-[#0f0c29] dark:via-[#1a1a2e] dark:to-[#16213e] transition-colors duration-300 font-['Inter',sans-serif]">
      <main className="max-w-5xl mx-auto px-6 py-10 space-y-12">
        
        <section className="flex justify-center">
          <UserProfileCard user={userData} />
        </section>

        <section className="space-y-8 animate-slideUpFade">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isMaster ? t('profile.specializedSkills') : t('profile.activeJobs')}
            </h2>
            <div className="h-px flex-1 bg-linear-to-r from-gray-200 to-transparent dark:from-white/10 dark:to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isMaster ? (
              userItems.map(skill => <SkillCard key={skill.id} skill={skill} />)
            ) : (
              userItems.map(job => <JobPostCard key={job.id} jobPost={job} />)
            )}
          </div>

          {userItems.length === 0 && (
            <div className="text-center py-20 bg-white/40 dark:bg-white/5 rounded-3xl border-2 border-dashed border-gray-200 dark:border-white/10">
              <p className="text-gray-500 dark:text-white/40">{isMaster ? t('profile.noSkillsFound') : t('profile.noJobsFound')}</p>
            </div>
          )}
        </section>

        {isMaster && (
          <section className="space-y-8 animate-slideUpFade">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('profile.customerReviews')}</h2>
                {userData.averageScore > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 rounded-full">
                    <RatingStars score={userData.averageScore} size="w-3.5 h-3.5" />
                    <span className="text-amber-500 text-sm font-bold">{userData.averageScore.toFixed(1)}</span>
                  </div>
                )}
              </div>
              <div className="h-px flex-1 bg-linear-to-r from-gray-200 to-transparent dark:from-white/10 dark:to-transparent"></div>
              {userId !== id && (
                <button 
                  onClick={() => setIsNewRatingModalOpen(true)}
                  className="px-5 py-2.5 bg-violet-600 dark:bg-violet-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-violet-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  {t('profile.writeReview')}
                </button>
              )}
            </div>

            {ratings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ratings.map((rating, idx) => (
                  <div 
                    key={idx} 
                    className="p-6 bg-white dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-gray-100 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                          {rating.customerName?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white leading-none mb-1">{rating.customerName}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 dark:text-white/30 uppercase tracking-widest font-black text-[10px]">{t('profile.verifiedCustomer')}</span>
                            {rating.createdAt && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/10"></span>
                                <span className="text-[10px] text-gray-400 dark:text-white/30 font-medium">
                                  {new Date(rating.createdAt).toLocaleDateString()}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <RatingStars score={rating.score} />
                        {rating.customerId === userId && (
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => setEditingRating(rating)}
                              className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all"
                              title={t('profile.editReview')}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => handleDeleteRating(rating.masterId, rating.customerId)}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                              title={t('profile.deleteReview')}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-white/70 leading-relaxed italic text-sm">
                      "{rating.comment || t('profile.noComment')}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/40 dark:bg-white/5 rounded-3xl border-2 border-dashed border-gray-200 dark:border-white/10">
                <p className="text-gray-500 dark:text-white/40">{t('profile.noReviews')}</p>
              </div>
            )}
          </section>
        )}
      </main>

      {editingRating && (
        <RatingModal 
          isOpen={!!editingRating}
          onClose={() => setEditingRating(null)}
          masterId={editingRating.masterId}
          initialScore={editingRating.score}
          initialComment={editingRating.comment}
          isUpdate={true}
          onRatingSuccess={() => {
            fetchProfileData();
            setEditingRating(null);
          }}
        />
      )}

      {isNewRatingModalOpen && (
        <RatingModal 
          isOpen={isNewRatingModalOpen}
          onClose={() => setIsNewRatingModalOpen(false)}
          masterId={id}
          onRatingSuccess={() => {
            fetchProfileData();
            setIsNewRatingModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default UserProfile;
