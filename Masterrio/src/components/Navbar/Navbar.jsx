import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDarkmode } from "@/stores/useDarkmode";
import { useTokens } from "@/stores/useTokens";
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const { t } = useTranslation();
  const { isDarkmodeActive, toggleDarkmode } = useDarkmode();
  const { accessToken, role, clearTokens } = useTokens();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    clearTokens();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-slate-200 dark:border-white/10 px-4 md:px-8 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/jobs" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 group">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-linear-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white premium-shadow group-hover:scale-110 transition-all duration-300">
            <span className="font-black text-xl">M</span>
          </div>
          <span className="text-lg md:text-xl font-black bg-linear-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent tracking-tight">
            Masterrio
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100/50 dark:bg-white/5 p-1 rounded-2xl border border-slate-200/50 dark:border-white/5">
          <NavLink to="/jobs" active={isActive('/jobs')}>{t('nav.allJobs')}</NavLink>
          {accessToken && (
            <>
              {(role === 'Client' || role === 'Admin') && (
                <>
                  <NavLink to="/create-job" active={isActive('/create-job')}>{t('nav.postAJob')}</NavLink>
                  <NavLink to="/masters" active={isActive('/masters')}>{t('nav.masters')}</NavLink>
                </>
              )}
              {(role === 'Master' || role === 'Admin') && (
                <NavLink to="/clients" active={isActive('/clients')}>{t('nav.clients')}</NavLink>
              )}
              <NavLink to="/my-profile" active={isActive('/my-profile')}>{t('nav.myProfile')}</NavLink>
              {role === 'Admin' && (
                <NavLink to="/admin/files" active={isActive('/admin/files')}>{t('nav.adminFiles')}</NavLink>
              )}
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 md:gap-3">
          <LanguageSwitcher />

          <button
            onClick={toggleDarkmode}
            className="p-2 md:p-2.5 rounded-xl bg-white dark:bg-white/5 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 shadow-sm hover:scale-110 transition-all duration-300"
            title={t('nav.toggleTheme')}
          >
            {isDarkmodeActive ? "☀️" : "🌙"}
          </button>

          {accessToken ? (
            <button
              onClick={handleLogout}
              className="hidden md:flex px-5 py-2.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold border border-red-100 dark:border-red-500/20 hover:bg-red-500 hover:text-white transition-all active:scale-95"
            >
              {t('nav.logout')}
            </button>
          ) : (
            <Link
              to="/login"
              className="px-5 md:px-6 py-2 md:py-2.5 bg-linear-to-r from-primary-600 to-primary-700 text-white rounded-xl text-xs md:text-sm font-bold premium-shadow hover:brightness-110 transition-all active:scale-95 text-center"
            >
              {t('nav.signIn')}
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-2 mx-4 p-4 glass rounded-4xl shadow-2xl border border-slate-200 dark:border-white/10 animate-cardAppear animate-fadeIn z-60">
          <div className="flex flex-col gap-2">
            <MobileNavLink to="/jobs" active={isActive('/jobs')} onClick={() => setIsMobileMenuOpen(false)}>{t('nav.allJobs')}</MobileNavLink>
            {accessToken && (
              <>
                {(role === 'Client' || role === 'Admin') && (
                  <>
                    <MobileNavLink to="/create-job" active={isActive('/create-job')} onClick={() => setIsMobileMenuOpen(false)}>{t('nav.postAJob')}</MobileNavLink>
                    <MobileNavLink to="/masters" active={isActive('/masters')} onClick={() => setIsMobileMenuOpen(false)}>{t('nav.masters')}</MobileNavLink>
                  </>
                )}
                {(role === 'Master' || role === 'Admin') && (
                  <MobileNavLink to="/clients" active={isActive('/clients')} onClick={() => setIsMobileMenuOpen(false)}>{t('nav.clients')}</MobileNavLink>
                )}
                <MobileNavLink to="/my-profile" active={isActive('/my-profile')} onClick={() => setIsMobileMenuOpen(false)}>{t('nav.myProfile')}</MobileNavLink>
                {role === 'Admin' && (
                  <MobileNavLink to="/admin/files" active={isActive('/admin/files')} onClick={() => setIsMobileMenuOpen(false)}>{t('nav.adminFiles')}</MobileNavLink>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full mt-2 p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl text-sm font-bold text-left flex items-center justify-between"
                >
                  {t('nav.logout')}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, children, active }) => (
  <Link
    to={to}
    className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${active
        ? "bg-white dark:bg-white/10 text-primary-600 dark:text-primary-400 shadow-sm"
        : "text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white"
      }`}
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, children, active, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`w-full p-4 rounded-2xl text-sm font-bold transition-all ${active
        ? "bg-primary-600 text-white"
        : "text-slate-600 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/5"
      }`}
  >
    {children}
  </Link>
);

export default Navbar;
