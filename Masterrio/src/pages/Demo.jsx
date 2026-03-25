import React from 'react';
import JobPostCard from '@/components/JobPostCard/JobPostCard';
import SkillCard from '@/components/SkillCard/SkillCard';
import UserProfileCard from '@/components/UserProfileCard/UserProfileCard';
import { useDarkmode } from "@/stores/useDarkmode";
import { Link } from "react-router-dom";

const Demo = () => {
  const { isDarkmodeActive, toggleDarkmode } = useDarkmode();

  const mockJobPost = {
    id: "8b77976c-063a-4c45-9546-019264a39348",
    title: "Set up home WiFi network",
    description: "Looking for a professional to set up a home wifi network with optimal router placement and mesh network configuration. Need to ensure full coverage across 3 floors.",
    budget: 2046,
    status: "Active",
    createdDate: "2026-03-15T11:16:47.3838205",
    customerId: "ecc77bf8-14d7-491a-060f-08de86722ab9",
    customerName: "elvin.karimov1@mail.com",
    requiredSkillId: "412d381b-c54f-472b-a6fd-08de866480ef",
    requiredSkillName: "Networking"
  };

  const mockSkill = {
    id: "412d381b-c54f-472b-a6fd-08de866480ef",
    name: "Plumbing",
    description: "Fixing pipes, leaks, and water systems."
  };

  const mockMaster = {
    firstName: "Ali",
    lastName: "Veli",
    email: "ali.master@mail.com",
    role: "Master",
    experience: 8,
    address: "Baku, Azerbaijan"
  };

  const mockClient = {
    firstName: "Elvin",
    lastName: "Karimov",
    email: "elvin.client@mail.com",
    role: "Customer",
    address: "Sumgait, Azerbaijan"
  };

  return (
    <div className="min-h-screen relative bg-linear-to-br from-indigo-50 via-white to-purple-50 dark:from-[#0f0c29] dark:via-[#1a1a2e] dark:to-[#16213e] transition-colors duration-500 p-6 sm:p-12 font-['Inter','Segoe_UI',system-ui,sans-serif]">
      {/* Theme Toggle */}
      <button
        onClick={toggleDarkmode}
        className="fixed top-6 right-6 p-2.5 rounded-full bg-white/80 dark:bg-black/20 text-gray-800 dark:text-white backdrop-blur-md border border-gray-200 dark:border-white/10 shadow-sm hover:scale-110 transition-all duration-300 z-50 flex items-center justify-center"
        title="Toggle Light/Dark Mode"
      >
        {isDarkmodeActive ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
          </svg>
        )}
      </button>

      {/* Back to Home Link */}
      <Link to="/register" className="absolute top-6 left-6 text-violet-600 dark:text-[#a78bfa] font-medium hover:underline flex items-center gap-1">
        &larr; Back to App
      </Link>

      <div className="max-w-6xl mx-auto pt-10">
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-[#a78bfa] dark:via-[#c4b5fd] dark:to-[#8b5cf6] bg-clip-text text-transparent tracking-tight mb-3">
            Premium Components Preview
          </h1>
          <p className="text-gray-500 dark:text-white/40 max-w-lg mx-auto">Experience our modern, responsive components designed for professional master-client matching platform.</p>
        </div>

        {/* Profile Cards Section */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8 justify-center">
            <div className="h-px w-12 bg-gray-200 dark:bg-white/10"></div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">User Profiles</h2>
            <div className="h-px w-12 bg-gray-200 dark:bg-white/10"></div>
          </div>
          <div className="flex flex-col lg:flex-row gap-10 items-center justify-center">
            <div className="w-full max-w-md">
              <p className="text-xs font-semibold text-gray-500 dark:text-white/30 uppercase tracking-[0.2em] mb-4 text-center">Master View</p>
              <UserProfileCard user={mockMaster} />
            </div>
            <div className="w-full max-w-md">
              <p className="text-xs font-semibold text-gray-500 dark:text-white/30 uppercase tracking-[0.2em] mb-4 text-center">Client View</p>
              <UserProfileCard user={mockClient} />
            </div>
          </div>
        </div>

        {/* Job & Skill Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-6 bg-indigo-500 rounded-full"></div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Job Postings</h2>
            </div>
            <JobPostCard jobPost={mockJobPost} />
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-6 bg-violet-500 rounded-full"></div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Specialties</h2>
            </div>
            <SkillCard skill={mockSkill} />
            <SkillCard skill={{ name: "Electrical", description: "Installation and repair of electrical systems and wiring." }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
