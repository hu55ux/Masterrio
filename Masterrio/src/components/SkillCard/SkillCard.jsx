import React from 'react';

const SkillCard = ({ skill, isManageMode = false, onDelete }) => {
  const handleRemove = (e) => {
    e.stopPropagation();
    onDelete(skill.id);
  };
  if (!skill) return null;

  return (
    <div className="group relative w-full bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-[0_8px_30px_rgba(124,58,237,0.12)] dark:hover:shadow-[0_8px_30px_rgba(124,58,237,0.06)] hover:border-violet-300 dark:hover:border-violet-500/50 transition-all duration-300 cursor-pointer overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-linear-to-bl from-violet-500/10 to-transparent dark:from-violet-500/20 dark:to-transparent rounded-full blur-2xl group-hover:scale-150 group-hover:from-violet-500/20 dark:group-hover:from-violet-500/30 transition-all duration-500 ease-out"></div>

      <div className="relative z-10 flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
        {/* Icon */}
        <div className="shrink-0 w-14 h-14 rounded-2xl bg-linear-to-br from-violet-50 to-indigo-50 dark:from-[#7c3aed]/10 dark:to-[#6d28d9]/10 border border-violet-100 dark:border-white/5 text-violet-600 dark:text-[#a78bfa] flex items-center justify-center transition-transform group-hover:scale-110 duration-300 group-hover:rotate-3 shadow-inner">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.83M11.42 15.17l3.86-3.86a2.94 2.94 0 00-4.16-4.16l-3.86 3.86M11.42 15.17l-3.86 3.86a2.94 2.94 0 01-4.16-4.16l3.86-3.86m-3.86 3.86L6.5 13M9.83 4.17l3.86-3.86" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 13.5l3-3" />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 mt-1 sm:mt-0">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold bg-linear-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent group-hover:from-violet-600 group-hover:to-indigo-600 dark:group-hover:from-[#c4b5fd] dark:group-hover:to-[#a78bfa] transition-all duration-300">
              {skill.name}
            </h3>
            <div className="flex items-center gap-2">
              {isManageMode && (
                <button 
                  onClick={handleRemove}
                  className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  title="Remove Skill"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-violet-500 dark:group-hover:text-[#a78bfa] transition-colors translate-x-[-4px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 duration-300 hidden sm:block">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
              </svg>
            </div>
          </div>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400/80 leading-relaxed line-clamp-2">
            {skill.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SkillCard;
