import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 dark:from-[#0f1118] dark:to-[#1a1c2e] p-6 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 text-center max-w-2xl animate-slideUpFade">
        {/* Floating Icon */}
        <div className="inline-flex items-center justify-center w-32 h-32 rounded-[2.5rem] bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-2xl mb-12 animate-bounce hover:scale-110 transition-transform duration-500">
          <span className="text-6xl">🐣</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">
          404
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-primary-600 to-violet-600 bg-clip-text text-transparent mb-8">
          This page not borned
        </h2>

        <p className="text-slate-500 dark:text-white/40 text-lg mb-12 max-w-md mx-auto leading-relaxed">
          The stars didn't align for this URL. We're guiding you back to safety automatically.
        </p>

        <div className="flex flex-col items-center gap-6">
          <Link
            to="/"
            className="px-10 py-4 bg-linear-to-r from-primary-600 to-primary-700 text-white font-bold rounded-2xl shadow-xl shadow-primary-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-3 group"
          >
            <span>Back to Home</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>

          <div className="flex items-center gap-2 text-sm font-bold text-slate-400 dark:text-white/20">
            <div className="w-8 h-8 rounded-lg border-2 border-slate-200 dark:border-white/10 flex items-center justify-center">
              {countdown}
            </div>
            <span>Redirecting in seconds...</span>
          </div>
        </div>
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
    </div>
  );
};

export default NotFound;
