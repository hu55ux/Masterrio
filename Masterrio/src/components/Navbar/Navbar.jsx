import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDarkmode } from "@/stores/useDarkmode";
import { useTokens } from "@/stores/useTokens";

const Navbar = () => {
  const { isDarkmodeActive, toggleDarkmode } = useDarkmode();
  const { accessToken, clearTokens } = useTokens();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    clearTokens();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/70 dark:bg-[#1a1a2e]/70 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 px-6 py-4 transition-all duration-500">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/jobs" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform duration-300">
            <span className="font-black text-xl">M</span>
          </div>
          <span className="text-xl font-black bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent tracking-tight">
            Masterrio
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1 bg-gray-100/50 dark:bg-white/5 p-1 rounded-2xl border border-gray-200/50 dark:border-white/5">
          <NavLink to="/jobs" active={isActive('/jobs')}>All Jobs</NavLink>
          {accessToken && (
            <>
              <NavLink to="/create-job" active={isActive('/create-job')}>Post a Job</NavLink>
              <NavLink to="/my-profile" active={isActive('/my-profile')}>My Profile</NavLink>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkmode}
            className="p-2.5 rounded-xl bg-white dark:bg-white/5 text-gray-800 dark:text-white border border-gray-200 dark:border-white/10 shadow-sm hover:scale-110 transition-all duration-300"
            title="Toggle Theme"
          >
            {isDarkmodeActive ? "☀️" : "🌙"}
          </button>

          {accessToken ? (
            <button 
              onClick={handleLogout}
              className="hidden sm:flex px-5 py-2.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold border border-red-100 dark:border-red-500/20 hover:bg-red-500 hover:text-white transition-all active:scale-95"
            >
              Logout
            </button>
          ) : (
            <Link 
              to="/login"
              className="px-6 py-2.5 bg-linear-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-violet-500/20 hover:brightness-110 transition-all active:scale-95"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, children, active }) => (
  <Link 
    to={to} 
    className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
      active 
        ? "bg-white dark:bg-white/10 text-violet-600 dark:text-[#a78bfa] shadow-sm" 
        : "text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white"
    }`}
  >
    {children}
  </Link>
);

export default Navbar;
