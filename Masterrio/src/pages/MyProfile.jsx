import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { userId, role, clearTokens } = useTokens();
  const { t } = useTranslation();
  const [userData, setUserData] = useState(null);
  const [userRoleLocal, setUserRoleLocal] = useState("");
  const [userItems, setUserItems] = useState([]);
  const [adminSkills, setAdminSkills] = useState([]);
  const [adminJobs, setAdminJobs] = useState([]);
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

  // Create Skill State
  const [isCreateSkillModalOpen, setIsCreateSkillModalOpen] = useState(false);
  const [createSkillForm, setCreateSkillForm] = useState({ name: "", description: "" });
  const [createSkillLoading, setCreateSkillLoading] = useState(false);
  const [createSkillError, setCreateSkillError] = useState("");
  const [createSkillSuccess, setCreateSkillSuccess] = useState("");

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => { },
    type: "danger"
  });

  // Status Change State
  const [jobStatuses, setJobStatuses] = useState([]);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedJobForStatus, setSelectedJobForStatus] = useState(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [statusUpdateError, setStatusUpdateError] = useState("");

  // Job Edit State
  const [isJobEditModalOpen, setIsJobEditModalOpen] = useState(false);
  const [selectedJobForEdit, setSelectedJobForEdit] = useState(null);
  const [jobEditForm, setJobEditForm] = useState({
    title: "",
    description: "",
    location: "",
    budget: 0,
    requiredSkillId: ""
  });
  const [jobEditLoading, setJobEditLoading] = useState(false);
  const [jobEditError, setJobEditError] = useState("");
  const [skillSearchQuery, setSkillSearchQuery] = useState("");
  const [isSkillDropdownOpen, setIsSkillDropdownOpen] = useState(false);

  const fetchStatuses = async () => {
    try {
      const response = await axiosInstance.get('/JobPost/statuses');
      const data = response.data?.data || response.data;
      setJobStatuses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching statuses:", err);
    }
  };

  const fetchAllSkills = async () => {
    try {
      const response = await axiosInstance.get('/Skill/all');
      const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      setAllAvailableSkills(data);
    } catch (err) {
      console.error("Error fetching all skills:", err);
    }
  };

  const handleCreateSkillSubmit = async (e) => {
    e.preventDefault();
    setCreateSkillLoading(true);
    setCreateSkillError("");
    setCreateSkillSuccess("");
    try {
      await axiosInstance.post('/Skill', createSkillForm);
      setCreateSkillSuccess(t('modals.skill.successMessage') || "Skill created successfully!");
      fetchAllSkills(); // Refresh the skills list instantly
      setTimeout(() => {
        setIsCreateSkillModalOpen(false);
        setCreateSkillForm({ name: "", description: "" });
        setCreateSkillSuccess("");
      }, 1500);
    } catch (err) {
      setCreateSkillError(err.response?.data?.message || err.response?.data?.title || t('common.error'));
    } finally {
      setCreateSkillLoading(false);
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
      setError(t('profile.sessionExpired') || "You must be logged in to view your profile.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Fetch Profile
      const userResponse = await axiosInstance.post('/Auth/details', { userId });
      const user = userResponse.data?.data || userResponse.data;
      setUserData(user);
      setEditFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        address: user.address || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || ""
      });

      const fetchedRole = Array.isArray(user?.roles) && user.roles.length > 0 ? user.roles[0] : (user?.role || role);
      setUserRoleLocal(fetchedRole);

      const isMaster = fetchedRole === 'Master';
      const isAdmin = fetchedRole === 'Admin';

      fetchAllSkills(); // Unconditional fetch for all roles so add skills works properly

      if (isAdmin) {
        // Fetch both for Admin
        const skillsResponse = await axiosInstance.get('/Skill/my-skills');
        const jobsResponse = await axiosInstance.get('/JobPost/myJobs');
        setAdminSkills(Array.isArray(skillsResponse.data) ? skillsResponse.data : (skillsResponse.data?.data || []));
        setAdminJobs(Array.isArray(jobsResponse.data) ? jobsResponse.data : (jobsResponse.data?.data || []));
      } else if (isMaster) {
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
        setError(t('common.error'));
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
      setPasswordError(t('modals.password.errorMismatch') || "New passwords do not match.");
      return;
    }
    setPasswordLoading(true);
    setPasswordError("");
    setPasswordSuccess("");
    try {
      const response = await axiosInstance.post('/Auth/changePassword', passwordFormData);
      if (response.data?.success || response.status === 200) {
        setPasswordSuccess(t('modals.password.successMessage') || "Password changed successfully!");
        setTimeout(() => {
          setIsChangePasswordModalOpen(false);
          setPasswordFormData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
          setPasswordSuccess("");
        }, 2000);
      } else {
        setPasswordError(response.data?.message || t('common.error'));
      }
    } catch (err) {
      setPasswordError(err.response?.data?.message || t('common.error'));
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
      title: t('modals.confirm.deleteJobTitle'),
      message: t('modals.confirm.deleteJobMessage'),
      onConfirm: async () => {
        try {
          await axiosInstance.delete(`/JobPost/${jobId}`);
          setUserItems(prev => prev.filter(item => item.id !== jobId));
        } catch (err) {
          alert(t('common.error'));
          console.error(err);
        }
      },
      type: "danger"
    });
  };

  const handleEditStatusClick = (job) => {
    setSelectedJobForStatus(job);
    setIsStatusModalOpen(true);
    if (jobStatuses.length === 0) {
      fetchStatuses();
    }
  };

  const handleStatusUpdate = async (statusName) => {
    if (!selectedJobForStatus) return;
    setStatusUpdateLoading(true);
    setStatusUpdateError("");
    try {
      // API expects the status name as a string body (JSON-encoded)
      const response = await axiosInstance.patch(`/JobPost/${selectedJobForStatus.id}/status`, JSON.stringify(statusName), {
        headers: { "Content-Type": "application/json" }
      });
      if (response.data?.success || response.status === 200) {
        setIsStatusModalOpen(false);
        setSelectedJobForStatus(null);
        fetchData(); // Refresh list
      } else {
        setStatusUpdateError(t('common.error'));
      }
    } catch (err) {
      setStatusUpdateError(err.response?.data?.message || t('common.error'));
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const handleEditJobClick = (job) => {
    setSelectedJobForEdit(job);
    setJobEditForm({
      title: job.title || "",
      description: job.description || "",
      location: job.location || "",
      budget: job.budget || 0,
      requiredSkillId: job.requiredSkillId || ""
    });
    setIsJobEditModalOpen(true);
  };

  const handleJobUpdate = async (e) => {
    e.preventDefault();
    setJobEditLoading(true);
    setJobEditError("");
    try {
      await axiosInstance.put(`/JobPost/${selectedJobForEdit.id}`, jobEditForm);
      setIsJobEditModalOpen(false);
      setSelectedJobForEdit(null);
      fetchData(); // Refresh list
    } catch (err) {
      setJobEditError(err.response?.data?.message || t('common.error'));
    } finally {
      setJobEditLoading(false);
    }
  };

  const handleRemoveSkill = async (skillId) => {
    setConfirmModal({
      isOpen: true,
      title: t('modals.confirm.removeSkillTitle'),
      message: t('modals.confirm.removeSkillMessage'),
      onConfirm: async () => {
        try {
          await axiosInstance.delete(`/Skill/removeSkill/${skillId}`);
          setUserItems(prev => prev.filter(item => item.id !== skillId));
        } catch (err) {
          alert(t('common.error'));
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
        setEditError(response.data?.message || t('common.error'));
      }
    } catch (err) {
      setEditError(err.response?.data?.message || t('common.error'));
    } finally {
      setEditLoading(false);
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
          <p className="text-gray-500 dark:text-gray-400 mb-8">{error || t('profile.sessionExpired')}</p>
          <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 dark:bg-[#7c3aed] text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors">
            {t('nav.signIn')}
          </Link>
        </div>
      </div>
    );
  }

  const isMaster = Array.isArray(userData.roles) ? userData.roles.includes('Master') : userData.role === 'Master';

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 dark:from-[#0f0c29] dark:via-[#1a1a2e] dark:to-[#16213e] transition-colors duration-300 font-['Inter',sans-serif]">
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
              {t('profile.changePassword')}
            </button>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-8 py-4 bg-linear-to-r from-violet-600 to-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-violet-500/25 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.13 1.897L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
              {t('profile.editProfile')}
            </button>
          </div>
        </div>

        {/* Content Section (Skills or Jobs) */}
        <section className="space-y-8 animate-slideUpFade">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('profile.manageTitle', { type: userRoleLocal === "Admin" ? t('profile.manageTypePlatform') : userRoleLocal === "Master" ? t('profile.manageTypeSkills') : t('profile.manageTypeJobs') })}
            </h2>
            <div className="h-px flex-1 bg-linear-to-r from-gray-200 to-transparent dark:from-white/10 dark:to-transparent"></div>

            {(userRoleLocal === "Master" || userRoleLocal === "Admin") && (
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
                {t('profile.addSkill')}
              </button>
            )}
          </div>

          {userRoleLocal === "Admin" ? (
            <div className="space-y-12">
              <div>
                <h3 className="text-xl font-black mb-4 dark:text-white">{t('profile.adminJobs')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {adminJobs.map(job => (
                    <JobPostCard
                      key={job.id}
                      jobPost={job}
                      isManageMode={true}
                      onDelete={handleDeleteJob}
                      onEditStatus={handleEditStatusClick}
                      onEditJob={handleEditJobClick}
                    />
                  ))}
                </div>
                {adminJobs.length === 0 && <p className="text-gray-500 mt-2">{t('profile.adminNoJobs')}</p>}
              </div>
              <div>
                <h3 className="text-xl font-black mb-4 dark:text-white">{t('profile.adminSkills')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {adminSkills.map(skill => (
                    <SkillCard
                      key={skill.id}
                      skill={skill}
                      isManageMode={true}
                      onDelete={handleRemoveSkill}
                    />
                  ))}
                </div>
                {adminSkills.length === 0 && <p className="text-gray-500 mt-2">{t('profile.adminNoSkills')}</p>}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userRoleLocal === "Master" ? (
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
                      onEditStatus={handleEditStatusClick}
                      onEditJob={handleEditJobClick}
                    />
                  ))
                )}
              </div>

              {userItems.length === 0 && (
                <div className="text-center py-20 bg-white/40 dark:bg-white/5 rounded-3xl border-2 border-dashed border-gray-200 dark:border-white/10">
                  <p className="text-gray-500 dark:text-white/40 mb-4">{userRoleLocal === "Master" ? t('profile.noSkillsFound') : t('profile.noJobsFound')}</p>
                  {userRoleLocal !== "Master" && (
                    <Link to="/create-job" className="px-6 py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition-colors inline-block">
                      {t('profile.postFirstJob')}
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#1a1a2e] w-full max-w-lg rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-gray-200 dark:border-white/10 animate-cardAppear">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{t('modals.editProfile.title')}</h3>
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
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">{t('modals.editProfile.firstName')}</label>
                  <input
                    type="text"
                    value={editFormData.firstName}
                    onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                    required
                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl outline-none focus:border-violet-500 dark:text-white text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">{t('modals.editProfile.lastName')}</label>
                  <input
                    type="text"
                    value={editFormData.lastName}
                    onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                    required
                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl outline-none focus:border-violet-500 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">{t('modals.editProfile.email')}</label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl outline-none focus:border-violet-500 dark:text-white text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">{t('modals.editProfile.address')}</label>
                <input
                  type="text"
                  value={editFormData.address}
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                  required
                  className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl outline-none focus:border-violet-500 dark:text-white text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">{t('modals.editProfile.phone')}</label>
                <input
                  type="tel"
                  value={editFormData.phoneNumber}
                  onChange={(e) => setEditFormData({ ...editFormData, phoneNumber: e.target.value })}
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
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex-2 py-4 bg-linear-to-r from-violet-600 to-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-violet-500/25 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                >
                  {editLoading ? t('common.loading') : t('common.saveChanges')}
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
                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{t('profile.addSkill')}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-sm text-gray-500 dark:text-white/40">{t('modals.skill.subtitle')}</p>
                  <span className="text-gray-300 dark:text-white/20">•</span>
                  <button
                    onClick={() => setIsCreateSkillModalOpen(true)}
                    className="text-sm font-bold text-violet-600 hover:text-violet-700 dark:text:violet-400 dark:hover:text-violet-300 transition-colors"
                  >
                    {t('createJob.createNewSkill')}
                  </button>
                </div>
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
                  className={`w-full p-4 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between group ${selectedSkillIds.includes(skill.id)
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
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedSkillIds.includes(skill.id)
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
                {t('common.cancel')}
              </button>
              <button
                onClick={handleAddSkillsSubmit}
                disabled={addSkillLoading || selectedSkillIds.length === 0}
                className="flex-2 py-4 bg-linear-to-r from-violet-600 to-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-violet-500/25 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
              >
                {addSkillLoading ? t('common.loading') : `${t('common.success')} ${selectedSkillIds.length}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Skill Modal */}
      {isCreateSkillModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#1a1a2e] w-full max-w-md rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-gray-200 dark:border-white/10 animate-cardAppear">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{t('modals.skill.title')}</h3>
                <p className="text-sm text-gray-500 dark:text-white/40 mt-1">{t('modals.skill.subtitle')}</p>
              </div>
              <button
                onClick={() => setIsCreateSkillModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateSkillSubmit} className="space-y-5">
              {createSkillError && <div className="p-3 text-sm bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-500/20">{createSkillError}</div>}
              {createSkillSuccess && <div className="p-3 text-sm bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-200 dark:border-emerald-500/20">{createSkillSuccess}</div>}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">{t('modals.skill.name')}</label>
                <input
                  type="text"
                  value={createSkillForm.name}
                  onChange={(e) => setCreateSkillForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                  placeholder="e.g. Next.js Developer"
                  className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl outline-none focus:border-violet-500 dark:text-white text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">{t('modals.skill.description')}</label>
                <textarea
                  value={createSkillForm.description}
                  onChange={(e) => setCreateSkillForm(prev => ({ ...prev, description: e.target.value }))}
                  required
                  placeholder="e.g. Expertise in React framework Next.js"
                  className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl outline-none focus:border-violet-500 dark:text-white text-sm min-h-[100px] resize-none"
                ></textarea>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsCreateSkillModalOpen(false)}
                  className="flex-1 py-4 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white rounded-2xl font-bold hover:bg-gray-200 transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={createSkillLoading}
                  className="flex-2 py-4 bg-linear-to-r from-violet-600 to-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-violet-500/25 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                >
                  {createSkillLoading ? t('modals.skill.creating') : t('modals.skill.create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Change Password Modal */}
      {isChangePasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#1a1a2e] w-full max-w-md rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-gray-200 dark:border-white/10 animate-cardAppear">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{t('modals.password.title')}</h3>
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
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">{t('modals.password.current')}</label>
                <input
                  type="password"
                  value={passwordFormData.currentPassword}
                  onChange={(e) => setPasswordFormData({ ...passwordFormData, currentPassword: e.target.value })}
                  required
                  className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl outline-none focus:border-violet-500 dark:text-white text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">{t('modals.password.new')}</label>
                <input
                  type="password"
                  value={passwordFormData.newPassword}
                  onChange={(e) => setPasswordFormData({ ...passwordFormData, newPassword: e.target.value })}
                  required
                  className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl outline-none focus:border-violet-500 dark:text-white text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">{t('modals.password.confirm')}</label>
                <input
                  type="password"
                  value={passwordFormData.confirmNewPassword}
                  onChange={(e) => setPasswordFormData({ ...passwordFormData, confirmNewPassword: e.target.value })}
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
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="flex-2 py-4 bg-primary-600 text-white rounded-2xl font-black shadow-lg shadow-primary-500/25 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                >
                  {passwordLoading ? t('modals.password.updating') : t('modals.password.updateButton')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Job Status Update Modal */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#1a1a2e] w-full max-w-md rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-gray-200 dark:border-white/10 animate-cardAppear">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{t('modals.status.title')}</h3>
                <p className="text-sm text-gray-500 dark:text-white/40 mt-1">{t('modals.status.subtitle')}</p>
              </div>
              <button
                onClick={() => setIsStatusModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {statusUpdateError && <div className="p-3 text-xs bg-red-50 dark:bg-red-500/10 text-red-600 rounded-xl border border-red-200">{statusUpdateError}</div>}
              {jobStatuses.map(status => {
                // State Machine Logic from Backend Handler
                const currentStatus = selectedJobForStatus?.status || selectedJobForStatus?.jpStatus;
                let isValidTransition = false;

                if (currentStatus === "Pending") {
                  isValidTransition = ["Active", "Canceled"].includes(status.name);
                } else if (currentStatus === "Active") {
                  isValidTransition = ["InProgress"].includes(status.name);
                } else if (currentStatus === "InProgress") {
                  isValidTransition = ["Completed"].includes(status.name);
                }

                const isCurrent = currentStatus === status.name;

                return (
                  <button
                    key={status.id}
                    onClick={() => handleStatusUpdate(status.name)}
                    disabled={statusUpdateLoading || (!isValidTransition && !isCurrent)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between group ${isCurrent
                      ? "bg-primary-50 border-primary-200 dark:bg-primary-500/10 dark:border-primary-500/30"
                      : !isValidTransition
                        ? "opacity-50 cursor-not-allowed bg-slate-50 border-slate-100 dark:bg-white/5 dark:border-white/5"
                        : "bg-white border-slate-200 hover:border-primary-400 dark:bg-white/5 dark:border-white/10 dark:hover:border-primary-500/50"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${isCurrent ? "bg-primary-100 text-primary-600 dark:bg-primary-500/20" : "bg-slate-100 text-slate-400 dark:bg-white/10"
                        }`}>
                        <span className="text-xs font-bold uppercase">{status.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className={`font-semibold ${isCurrent ? "text-primary-900 dark:text-primary-100" : "text-slate-700 dark:text-slate-200"}`}>
                          {t(`jobs.statuses.${status.name}`)}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-white/40">
                          {isCurrent ? t('modals.status.current') : isValidTransition ? t('modals.status.available') : t('modals.status.locked')}
                        </p>
                      </div>
                    </div>
                    {isCurrent && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary-600 animate-pulse"></div>
                    )}
                    {!isCurrent && isValidTransition && (
                      <div className="w-6 h-6 rounded-full border border-slate-300 group-hover:border-primary-500 flex items-center justify-center transition-colors">
                        <div className="w-3 h-3 rounded-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    )}
                  </button>
                );
              })}
              {jobStatuses.length === 0 && (
                <div className="text-center py-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
                  <p className="text-xs text-gray-400 animate-pulse">{t('modals.status.loading')}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsStatusModalOpen(false)}
              className="w-full py-4 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white rounded-2xl font-bold hover:bg-gray-200 transition-colors"
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}

      {/* Job Edit Modal */}
      {isJobEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#1a1a2e] w-full max-w-lg rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-gray-200 dark:border-white/10 animate-cardAppear">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{t('modals.editJob.title')}</h3>
              <button
                onClick={() => setIsJobEditModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleJobUpdate} className="space-y-5">
              {jobEditError && <div className="p-3 text-sm bg-red-50 dark:bg-red-500/10 text-red-600 rounded-xl border border-red-200">{jobEditError}</div>}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">{t('jobs.labels.title')}</label>
                <input
                  type="text"
                  value={jobEditForm.title}
                  onChange={(e) => setJobEditForm({ ...jobEditForm, title: e.target.value })}
                  required
                  className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl outline-none focus:border-violet-500 dark:text-white text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">{t('jobs.labels.location')}</label>
                <input
                  type="text"
                  value={jobEditForm.location}
                  onChange={(e) => setJobEditForm({ ...jobEditForm, location: e.target.value })}
                  required
                  placeholder="e.g. Baku, Azerbaijan"
                  className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl outline-none focus:border-violet-500 dark:text-white text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">{t('jobs.labels.description')}</label>
                <textarea
                  value={jobEditForm.description}
                  onChange={(e) => setJobEditForm({ ...jobEditForm, description: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl outline-none focus:border-violet-500 dark:text-white text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">{t('jobs.labels.budget')}</label>
                  <input
                    type="number"
                    value={jobEditForm.budget}
                    onChange={(e) => setJobEditForm({ ...jobEditForm, budget: parseFloat(e.target.value) })}
                    required
                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl outline-none focus:border-violet-500 dark:text-white text-sm"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between pl-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('jobs.labels.requiredSkill')}</label>
                    <span className="text-[10px] font-medium text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-full">{t('jobs.labels.selectOne')}</span>
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder={t('common.search')}
                      value={skillSearchQuery}
                      onChange={(e) => setSkillSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white text-sm transition-all"
                    />
                  </div>

                  <div className="max-h-[220px] overflow-y-auto pr-2 custom-scrollbar grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {allAvailableSkills
                      .filter(s => s.name.toLowerCase().includes(skillSearchQuery.toLowerCase()))
                      .map(skill => {
                        const isSelected = jobEditForm.requiredSkillId === skill.id;
                        return (
                          <button
                            key={skill.id}
                            type="button"
                            onClick={() => setJobEditForm({ ...jobEditForm, requiredSkillId: skill.id })}
                            className={`p-3 rounded-2xl border text-center transition-all duration-300 relative overflow-hidden group ${isSelected
                                ? "bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-500/30"
                                : "bg-white dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-primary-400 dark:hover:border-primary-500/50"
                              }`}
                          >
                            <span className={`text-xs font-bold block truncate ${isSelected ? "text-white" : "group-hover:text-primary-600 dark:group-hover:text-primary-400"}`}>
                              {skill.name}
                            </span>
                            {isSelected && (
                              <div className="absolute top-1 right-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-white/90">
                                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </button>
                        );
                      })
                    }
                    {allAvailableSkills.filter(s => s.name.toLowerCase().includes(skillSearchQuery.toLowerCase())).length === 0 && (
                      <div className="col-span-full py-8 text-center bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
                        <p className="text-xs text-slate-400">{t('createJob.noMatchingSkills') || "No matching skills found."}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={jobEditLoading}
                className="w-full py-4 mt-4 bg-linear-to-r from-primary-600 to-primary-700 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/25 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50"
              >
                {jobEditLoading ? t('modals.editJob.saving') : t('modals.editJob.saveButton')}
              </button>
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
