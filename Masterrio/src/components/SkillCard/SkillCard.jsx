import React from 'react';
import { useTranslation } from 'react-i18next';

const SkillCard = ({ skill, isManageMode = false, onDelete }) => {
  const { t } = useTranslation();
  const handleRemove = (e) => {
    e.stopPropagation();
    onDelete(skill.id);
  };
  if (!skill) return null;

  return (
    <div className="group relative w-full bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-5 sm:p-6 premium-shadow hover:border-primary-400/50 dark:hover:border-primary-500/50 transition-all duration-300 cursor-pointer overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-linear-to-bl from-primary-500/10 to-transparent dark:from-primary-500/20 dark:to-transparent rounded-full blur-2xl group-hover:scale-150 group-hover:from-primary-500/20 dark:group-hover:from-primary-500/30 transition-all duration-300 ease-out"></div>

      <div className="relative z-10 flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
        {/* Icon */}
        <div className="shrink-0 w-14 h-14 rounded-2xl bg-linear-to-br from-primary-50 to-primary-100 dark:from-primary-500/10 dark:to-primary-600/10 border border-primary-100 dark:border-white/5 text-primary-600 dark:text-primary-400 flex items-center justify-center transition-transform group-hover:scale-110 duration-300 group-hover:rotate-3 shadow-inner">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.83M11.42 15.17l3.86-3.86a2.94 2.94 0 00-4.16-4.16l-3.86 3.86M11.42 15.17l-3.86 3.86a2.94 2.94 0 01-4.16-4.16l3.86-3.86m-3.86 3.86L6.5 13M9.83 4.17l3.86-3.86" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 13.5l3-3" />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 mt-1 sm:mt-0">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-all duration-300">
              {skill.name}
            </h3>
            <div className="flex items-center gap-2">
              {isManageMode && (
                <button 
                  onClick={handleRemove}
                  className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  title={t('modals.confirm.removeSkillTitle')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
            {skill.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SkillCard;
