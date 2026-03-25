import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '@/utils/axiosInstance';
import { useDarkmode } from "@/stores/useDarkmode";

const CreateJobPost = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: 0,
    requiredSkillId: ""
  });
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const { isDarkmodeActive } = useDarkmode();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axiosInstance.get('/Skill/all');
        const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
        setSkills(data);
      } catch (err) {
        console.error("Error fetching skills:", err);
        setError("Failed to load skills. Please refresh the page.");
      } finally {
        setSkillsLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSkillToggle = (skillId) => {
    // Single select since requiredSkillId is a single string
    setFormData(prev => ({
      ...prev,
      requiredSkillId: prev.requiredSkillId === skillId ? "" : skillId
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.requiredSkillId) {
      setError("Please select a required skill.");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const response = await axiosInstance.post('/JobPost/create', formData);
      if (response.data?.success || response.status === 200 || response.status === 201) {
        setSuccess(true);
        setTimeout(() => navigate('/jobs'), 2000);
      } else {
        setError(response.data?.message || "Failed to create job post.");
      }
    } catch (err) {
      console.error("Error creating job:", err);
      const msg = err.response?.data?.message || "An error occurred while creating the job.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 dark:from-[#0f0c29] dark:via-[#1a1a2e] dark:to-[#16213e] transition-all duration-500 font-['Inter',system-ui,sans-serif] py-12 px-6">
      


      <div className="max-w-3xl mx-auto">
        <div className="bg-white/70 dark:bg-white/5 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl dark:shadow-[0_40px_100px_rgba(0,0,0,0.5)] animate-cardAppear">
          
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-black bg-linear-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-[#a78bfa] dark:via-[#7c3aed] dark:to-[#6d28d9] bg-clip-text text-transparent tracking-tight mb-3">
              Post a New Job
            </h1>
            <p className="text-gray-500 dark:text-white/40 text-lg">
              Find the right talent for your project.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl text-sm animate-shake">
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl text-sm font-bold flex items-center gap-3 animate-slideUpFade">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Job posted successfully! Redirecting...
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-white/70 uppercase tracking-widest pl-1">Job Title</label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Modern Web Design needed"
                  required
                  className="w-full px-6 py-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 dark:focus:border-violet-400 transition-all font-medium"
                />
              </div>

              <div className="space-y-2">
                <style>
                  {`
                    input::-webkit-outer-spin-button,
                    input::-webkit-inner-spin-button {
                      -webkit-appearance: none;
                      margin: 0;
                    }
                    input[type=number] {
                      -moz-appearance: textfield;
                    }
                  `}
                </style>
                <label className="text-sm font-bold text-gray-700 dark:text-white/70 uppercase tracking-widest pl-1">Budget (AZN)</label>
                <div className="relative group/budget">
                  <input 
                    type="number" 
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    min="0"
                    required
                    className="w-full pl-6 pr-16 py-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 dark:focus:border-violet-400 transition-all font-bold"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-gray-100 dark:bg-white/10 rounded-xl text-xs font-black text-gray-500 dark:text-white/40 border border-gray-200 dark:border-white/10 group-focus-within/budget:text-violet-600 dark:group-focus-within/budget:text-violet-400 transition-colors">
                    AZN
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-white/70 uppercase tracking-widest pl-1">Description</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what you need in detail..."
                required
                rows="5"
                className="w-full px-6 py-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 dark:focus:border-violet-400 transition-all font-medium resize-none"
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-gray-700 dark:text-white/70 uppercase tracking-widest pl-1">Required Skill</label>
              
              {skillsLoading ? (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-24 h-10 bg-gray-100 dark:bg-white/5 rounded-full animate-pulse shrink-0" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {skills.map(skill => (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => handleSkillToggle(skill.id)}
                      className={`px-4 py-3 rounded-2xl border text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                        formData.requiredSkillId === skill.id
                          ? "bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-500/30 scale-105"
                          : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60 hover:border-violet-500 hover:text-violet-600"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center transition-colors ${
                        formData.requiredSkillId === skill.id 
                          ? "bg-white border-white text-violet-600" 
                          : "border-gray-300 dark:border-white/20 text-transparent"
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                      </div>
                      {skill.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-5 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-3xl font-black text-xl shadow-2xl shadow-violet-500/30 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? "Posting Job..." : "Publish Job Post"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateJobPost;
