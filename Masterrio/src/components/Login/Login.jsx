import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";
import { useTokens } from "@/stores/useTokens";
import { useDarkmode } from "@/stores/useDarkmode";

const Login = () => {
  const [email, setEmail] = useState(() => localStorage.getItem("login_email") || "");
  const [password, setPassword] = useState(() => localStorage.getItem("login_password") || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setAccessToken, setRefreshToken, setUserId } = useTokens();
  const { isDarkmodeActive, toggleDarkmode } = useDarkmode();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/Auth/login", {
        email,
        password,
      });

      const { success, message, data } = response.data;

      if (success && data) {
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        if (data.id) setUserId(data.id);
        
        localStorage.removeItem("login_email");
        localStorage.removeItem("login_password");

        navigate("/");
      } else {
        setError(message || "Login failed due to an unknown error.");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Login failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0f1118] px-4 sm:px-6 font-['Inter',sans-serif] transition-colors duration-300">

      {/* Theme Toggle Button */}
      <button
        onClick={toggleDarkmode}
        className="fixed top-6 right-6 p-2 rounded-full glass border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white premium-shadow hover:scale-110 transition-all duration-300 z-50"
        title="Toggle Light/Dark Mode"
      >
        {isDarkmodeActive ? "☀️" : "🌙"}
      </button>

      <div className="w-full max-w-[440px] glass border border-slate-200 dark:border-white/8 rounded-3xl p-8 sm:p-12 premium-shadow animate-cardAppear transition-colors duration-300">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="animate-slideUpFade text-[2.5rem] font-black text-slate-900 dark:text-white tracking-tight mb-2">
            Master<span className="text-primary-600 dark:text-primary-400">rio</span>
          </h1>
          <p className="animate-slideUpFade delay-100 text-slate-500 dark:text-slate-400 text-lg">
            Welcome back to the elite platform
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {error && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-2xl text-sm animate-shake">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="animate-slideUpFade delay-200 flex flex-col gap-2">
            <label htmlFor="email" className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                const val = e.target.value;
                setEmail(val);
                localStorage.setItem("login_email", val);
              }}
              placeholder="you@example.com"
              required
              className="px-5 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white text-base placeholder-slate-400 dark:placeholder-white/20 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all premium-shadow"
            />
          </div>

          {/* Password */}
          <div className="animate-slideUpFade delay-300 flex flex-col gap-2">
            <label htmlFor="password" className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  const val = e.target.value;
                  setPassword(val);
                  localStorage.setItem("login_password", val);
                }}
                placeholder="••••••••"
                required
                className="w-full px-5 py-4 pr-12 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white text-base placeholder-slate-400 dark:placeholder-white/20 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all premium-shadow"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-600 transition-colors"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="animate-slideUpFade delay-400 mt-4 py-4.5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-lg font-black transition-all duration-300 hover:-translate-y-1 premium-shadow hover:shadow-primary-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <div className="animate-slideUpFade delay-500 text-center mt-10 pt-8 border-t border-slate-100 dark:border-white/5">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary-600 dark:text-primary-400 font-black hover:underline ml-1">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
