import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '@/utils/axiosInstance';
import UserProfileCard from '@/components/UserProfileCard/UserProfileCard';
import JobPostCard from '@/components/JobPostCard/JobPostCard';
import SkillCard from '@/components/SkillCard/SkillCard';
import { useDarkmode } from "@/stores/useDarkmode";

const UserProfile = () => {
  const { id } = useParams();
  const { isDarkmodeActive } = useDarkmode();
  const [userData, setUserData] = useState(null);
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      setError(null);
      try {
        const userResponse = await axiosInstance.post(`/Auth/id/${id}`, {});
        const user = userResponse.data?.data || userResponse.data;
        setUserData(user);

        try {
          const isMaster = Array.isArray(user?.roles) ? user.roles.includes('Master') : user?.role === 'Master';
          if (isMaster) {
            setUserItems(user?.skills || []);
          } else {
            const jobsResponse = await axiosInstance.get(`/JobPost/user/${id}`);
            const fetchedJobs = Array.isArray(jobsResponse.data) ? jobsResponse.data : (jobsResponse.data?.data || []);
            setUserItems(fetchedJobs);
          }
        } catch (itemErr) {
          console.error("Error fetching related items:", itemErr);
          setUserItems([]);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfileData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br
       from-indigo-50 via-white to-purple-50 dark:from-[#0f0c29] dark:via-[#1a1a2e]
        dark:to-[#16213e]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 dark:text-white/50 font-medium animate-pulse">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-purple-50 dark:from-[#0f0c29] dark:via-[#1a1a2e] dark:to-[#16213e] p-6">
        <div className="max-w-md w-full bg-white dark:bg-white/5 backdrop-blur-xl p-10 rounded-3xl border border-gray-200 dark:border-white/10 text-center shadow-xl">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">{error || "User not found"}</p>
          <Link to="/demo" className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 dark:bg-[#7c3aed] text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors">
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  const isMaster = userData.role === 'Master';

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 dark:from-[#0f0c29] dark:via-[#1a1a2e] dark:to-[#16213e] transition-colors duration-500 font-['Inter',sans-serif]">



      <main className="max-w-5xl mx-auto px-6 py-10 space-y-12">

        {/* User Header Section */}
        <section className="flex justify-center">
          <UserProfileCard user={userData} />
        </section>

        {/* Content Section (Skills or Jobs) */}
        <section className="space-y-8 animate-slideUpFade">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isMaster ? "Specialized Skills" : "Active Job Posts"}
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
              <p className="text-gray-500 dark:text-white/40">No {isMaster ? "skills" : "job posts"} found yet.</p>
            </div>
          )}
        </section>

      </main>
    </div>
  );
};

export default UserProfile;

