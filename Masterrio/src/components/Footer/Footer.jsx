import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTokens } from "@/stores/useTokens";

const Footer = () => {
  const { t } = useTranslation();
  const { role } = useTokens();

  return (
    <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-white/10 mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">

          {/* Brand & Description */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/jobs" className="flex items-center gap-2 group">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-linear-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white premium-shadow transition-transform duration-300 group-hover:scale-110">
                <span className="font-black text-xl">M</span>
              </div>
              <span className="text-xl font-black bg-linear-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent tracking-tight">
                Masterrio
              </span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-sm">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">
              {t('footer.quickLinks')}
            </h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/jobs" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors w-fit">
                {t('nav.allJobs')}
              </Link>
              {role !== 'Master' && (
                <Link to="/create-job" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors w-fit">
                  {t('nav.postAJob')}
                </Link>
              )}
              {(role === 'Client' || role === 'Admin') && (
                <Link to="/masters" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors w-fit">
                  {t('nav.masters')}
                </Link>
              )}
              {(role === 'Master' || role === 'Admin') && (
                <Link to="/clients" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors w-fit">
                  {t('nav.clients')}
                </Link>
              )}
              <Link to="/my-profile" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors w-fit">
                {t('nav.myProfile')}
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">
              {t('footer.contactUs')}
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:masterstepit@gmail.com"
                className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors w-fit text-left cursor-pointer"
                title={t('footer.emailTooltip')}
              >
                <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center shrink-0 border border-slate-200 dark:border-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <span>masterstepit@gmail.com</span>
              </a>

              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center shrink-0 border border-slate-200 dark:border-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <span>{t('footer.address')}</span>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} Masterrio. {t('footer.rights')}
          </p>
          <div className="flex text-xs space-x-4 text-slate-400 dark:text-slate-500">
            <span className="cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors">{t('footer.privacy')}</span>
            <span className="cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors">{t('footer.terms')}</span>
            <span className="cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors">{t('footer.cookieSettings')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

