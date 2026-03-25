import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '@/utils/axiosInstance';
import UserProfileCard from '@/components/UserProfileCard/UserProfileCard';
import JobPostCard from '@/components/JobPostCard/JobPostCard';
import SkillCard from '@/components/SkillCard/SkillCard';
import ConfirmModal from '@/components/ConfirmModal/ConfirmModal';
import { useDarkmode } from "@/stores/useDarkmode";
import { useTokens } from "@/stores/useTokens";

const MyProfile = () => {
  const navigate = useNavigate();
  const { isDarkmodeActive, toggleDarkmode } = useDarkmode();
  const { userId, clearTokens } = useTokens();
  const [userData, setUserData] = useState(null);
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Edit Profile State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    email: "",
    phoneNumber: ""
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  // Change Password State
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Add Skills State
  const [isAddSkillModalOpen, setIsAddSkillModalOpen] = useState(false);
  const [allAvailableSkills, setAllAvailableSkills] = useState([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState([]);
  const [addSkillLoading, setAddSkillLoading] = useState(false);

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "danger"
  });

  const fetchAllSkills = async () => {
    try {
      const response = await axiosInstance.get('/Skill/all');
      const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      setAllAvailableSkills(data);
    } catch (err) {
      console.error("Error fetching all skills:", err);
    }
  };

  const handleAddSkillsSubmit = async (e) => {
    e.preventDefault();
    setAddSkillLoading(true);
    try {
      await axiosInstance.post('/Skill/assignMe', selectedSkillIds);
      setIsAddSkillModalOpen(false);
      setSelectedSkillIds([]);
      fetchData(); // Refresh user data and skills
    } catch (err) {
      console.error("Error adding skills:", err);
      alert("Failed to add skills.");
    } finally {
      setAddSkillLoading(false);
    }
  };

  const toggleSkillSelection = (skillId) => {
    setSelectedSkillIds(prev =>
      prev.includes(skillId)
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  const fetchData = async () => {
    if (!userId) {
      setError("You must be logged in to view your profile.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Fetch Profile
      const userResponse = await axiosInstance.post(`/Auth/id/${userId}`, {});
      const user = userResponse.data?.data || userResponse.data;
      setUserData(user);
      setEditFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        address: user.address || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || ""
      });

      const isMaster = Array.isArray(user?.roles) ? user.roles.includes('Master') : user?.role === 'Master';
      
      if (isMaster) {
        // Fetch My Skills
        const skillsResponse = await axiosInstance.get('/Skill/my-skills');
        setUserItems(Array.isArray(skillsResponse.data) ? skillsResponse.data : (skillsResponse.data?.data || []));
      } else {
        // Fetch My Jobs
        const jobsResponse = await axiosInstance.get('/JobPost/myJobs');
        setUserItems(Array.isArray(jobsResponse.data) ? jobsResponse.data : (jobsResponse.data?.data || []));
      }
    } catch (err) {
      console.error("Error fetching my profile:", err);
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError("Failed to load profile data.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordFormData.newPassword !== passwordFormData.confirmNewPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    setPasswordLoading(true);
    setPasswordError("");
    setPasswordSuccess("");
    try {
      const response = await axiosInstance.post('/Auth/changePassword', passwordFormData);
      if (response.data?.success || response.status === 200) {
        setPasswordSuccess("Password changed successfully!");
        setTimeout(() => {
          setIsChangePasswordModalOpen(false);
          setPasswordFormData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
          setPasswordSuccess("");
        }, 2000);
      } else {
        setPasswordError(response.data?.message || "Failed to change password.");
      }
    } catch (err) {
      setPasswordError(err.response?.data?.message || "An error occurred.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = () => {
    clearTokens();
    navigate('/login');
  };

  const handleDeleteJob = async (jobId) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Job Post",
      message: "Are you sure you want to permanently delete this job post?",
      onConfirm: async () => {
        try {
          await axiosInstance.delete(`/JobPost/${jobId}`);
          setUserItems(prev => prev.filter(item => item.id !== jobId));
        } catch (err) {
          alert("Failed to delete job post.");
          console.error(err);
        }
      },
      type: "danger"
    });
  };

  const handleRemoveSkill = async (skillId) => {
    setConfirmModal({
      isOpen: true,
      title: "Remove Skill",
      message: "Are you sure you want to remove this skill from your profile?",
      onConfirm: async () => {
        try {
          await axiosInstance.delete(`/Skill/removeSkill/${skillId}`);
          setUserItems(prev => prev.filter(item => item.id !== skillId));
        } catch (err) {
          alert("Failed to remove skill.");
          console.error(err);
        }
      },
      type: "danger"
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    try {
      const response = await axiosInstance.put('/Auth/editProfile', editFormData);
      if (response.data?.success || response.status === 200) {
        setIsEditModalOpen(false);
        fetchData(); // Refresh data
      } else {
        setEditError(response.data?.message || "Failed to update profile.");
      }
    } catch (err) {
      setEditError(err.response?.data?.message || "An error occurred.");
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-purple-50 dark:from-[#0f0c29] dark:via-[#1a1a2e] dark:to-[#16213e]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 dark:text-white/50 font-medium animate-pulse">Loading Your Profile...</p>
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
          <p className="text-gray-500 dark:text-gray-400 mb-8">{error || "User session expired"}</p>
          <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 dark:bg-[#7c3aed] text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors">
            Login Again
          </Link>
        </div>
      </div>
    );
  }

  const isMaster = Array.isArray(userData.roles) ? userData.roles.includes('Master') : userData.role === 'Master';

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 dark:from-[#0f0c29] dark:via-[#1a1a2e] dark:to-[#16213e] transition-colors duration-500 font-['Inter',sans-serif]">
      {/* Navbar is handled by App.jsx wrapper */}
      
      <main className="max-w-5xl mx-auto px-6 py-10 space-y-12">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <UserProfileCard user={userData} />
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <button 
              onClick={() => setIsChangePasswordModalOpen(true)}
              className="px-6 py-4 bg-white dark:bg-white/5 text-gray-700 dark:text-white border border-gray-200 dark:border-white/10 rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
              </svg>
              Change Password
            </button>
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="px-8 py-4 bg-linear-to-r from-violet-600 to-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-violet-500/25 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              Edit Profile
            </button>
          </div>
        </div>

        {/* Content Section (Skills or Jobs) */}
        <section className="space-y-8 animate-slideUpFade">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Manage {isMaster ? "Your Skills" : "Your Job Posts"}
            </h2>
            <div className="h-px flex-1 bg-linear-to-r from-gray-200 to-transparent dark:from-white/10 dark:to-transparent"></div>
            
            {isMaster && (
              <button
                onClick={() => {
                  fetchAllSkills();
                  setIsAddSkillModalOpen(true);
                }}
                className="px-6 py-2 bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-[#a78bfa] rounded-xl text-sm font-bold hover:bg-violet-600 hover:text-white transition-all flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add Skill
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isMaster ? (
              userItems.map(skill => (
                <SkillCard 
                  key={skill.id} 
                  skill={skill} 
                  isManageMode={true} 
                  onDelete={handleRemoveSkill} 
                />
              ))
            ) : (
              userItems.map(job => (
                <JobPostCard 
                  key={job.id} 
                  jobPost={job} 
                  isManageMode={true} 
                  onDelete={handleDeleteJob} 
                />
              ))
            )}
          </div>

          {userItems.length === 0 && (
            <div className="text-center py-20 bg-white/40 dark:bg-white/5 rounded-3xl border-2 border-dashed border-gray-200 dark:border-white/10">
              <p className="text-gray-500 dark:text-white/40 mb-4">No {isMaster ? "skills" : "job posts"} found on your profile.</p>
              {!isMaster && (
                <Link to="/create-job" className="px-6 py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition-colors inline-block">
                  Post Your First Job
                </Link>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#1a1a2e] w-full max-w-lg rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-gray-200 dark:border-white/10 animate-cardAppear">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Edit Profile</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-5">
              {editError && <div className="p-3 text-sm bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-500/20">{editError}</div>}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">First Name</label>
                  <input 
                    type="text" 
                    value={editFormData.firstName}
                    onChange={(e) => setEditFormData({...editFormData, firstName: e.target.value})}
                    required
                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl outline-none focus:border-violet-500 dark:text-white text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Last Name</label>
                  <input 
                    type="text" 
                    value={editFormData.lastName}
                    onChange={(e) => setEditFormData({...editFormData, lastName: e.target.value})}
                    required
                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl outline-none focus:border-violet-500 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Email Address</label>
                <input 
                  type="email" 
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                  required
                  className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl outline-none focus:border-violet-500 dark:text-white text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Address</label>
                <input 
                  type="text" 
                  value={editFormData.address}
                  onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                  required
                  className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl outline-none focus:border-violet-500 dark:text-white text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={editFormData.phoneNumber}
                  onChange={(e) => setEditFormData({...editFormData, phoneNumber: e.target.value})}
                  required
                  className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl outline-none focus:border-violet-500 dark:text-white text-sm"
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-4 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white rounded-2xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={editLoading}
                  className="flex-2 py-4 bg-linear-to-r from-violet-600 to-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-violet-500/25 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                >
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Add Skills Modal */}
      {isAddSkillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#1a1a2e] w-full max-w-2xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-gray-200 dark:border-white/10 animate-cardAppear">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Add Skills</h3>
                <p className="text-sm text-gray-500 dark:text-white/40 mt-1">Select the skills you specialize in</p>
              </div>
              <button 
                onClick={() => setIsAddSkillModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="max-h-[50vh] overflow-y-auto pr-4 mb-8 space-y-3 custom-scrollbar">
              {allAvailableSkills.map(skill => (
                <button
                  key={skill.id}
                  onClick={() => toggleSkillSelection(skill.id)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between group ${
                    selectedSkillIds.includes(skill.id)
                      ? "bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-500/20"
                      : "bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-700 dark:text-white/70 hover:border-violet-400"
                  }`}
                >
                  <div>
                    <span className="font-bold block">{skill.name}</span>
                    <span className={`text-xs ${selectedSkillIds.includes(skill.id) ? 'text-white/80' : 'text-gray-500 dark:text-white/40'}`}>
                      {skill.description}
                    </span>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedSkillIds.includes(skill.id) 
                      ? "bg-white border-white text-violet-600" 
                      : "border-gray-300 dark:border-white/20 text-transparent"
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setIsAddSkillModalOpen(false)}
                className="flex-1 py-4 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white rounded-2xl font-bold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddSkillsSubmit}
                disabled={addSkillLoading || selectedSkillIds.length === 0}
                className="flex-2 py-4 bg-linear-to-r from-violet-600 to-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-violet-500/25 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
              >
                {addSkillLoading ? "Saving..." : `Add ${selectedSkillIds.length} Skills`}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Change Password Modal */}
      {isChangePasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#1a1a2e] w-full max-w-md rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-gray-200 dark:border-white/10 animate-cardAppear">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Change Password</h3>
              <button 
                onClick={() => setIsChangePasswordModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="space-y-5">
              {passwordError && <div className="p-3 text-sm bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-500/20">{passwordError}</div>}
              {passwordSuccess && <div className="p-3 text-sm bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-200 dark:border-emerald-500/20">{passwordSuccess}</div>}
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Current Password</label>
                <input 
                  type="password" 
                  value={passwordFormData.currentPassword}
                  onChange={(e) => setPasswordFormData({...passwordFormData, currentPassword: e.target.value})}
                  required
                  className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl outline-none focus:border-violet-500 dark:text-white text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">New Password</label>
                <input 
                  type="password" 
                  value={passwordFormData.newPassword}
                  onChange={(e) => setPasswordFormData({...passwordFormData, newPassword: e.target.value})}
                  required
                  className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl outline-none focus:border-violet-500 dark:text-white text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Confirm New Password</label>
                <input 
                  type="password" 
                  value={passwordFormData.confirmNewPassword}
                  onChange={(e) => setPasswordFormData({...passwordFormData, confirmNewPassword: e.target.value})}
                  required
                  className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl outline-none focus:border-violet-500 dark:text-white text-sm"
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsChangePasswordModalOpen(false)}
                  className="flex-1 py-4 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white rounded-2xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={passwordLoading}
                  className="flex-2 py-4 bg-linear-to-r from-violet-600 to-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-violet-500/25 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                >
                  {passwordLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Confirmation Modal */}
      <ConfirmModal 
        {...confirmModal}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default MyProfile;
