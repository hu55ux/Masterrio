import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
        console.log("Login successful, user data:", data);

        // Uğurlu girişdən sonra saxlanılan məlumatları təmizlə
        localStorage.removeItem("login_email");
        localStorage.removeItem("login_password");

        navigate("/");
      } else {
        setError(message || "Login failed due to an unknown error.");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-purple-50 dark:from-[#0f0c29] dark:via-[#1a1a2e] dark:to-[#16213e] px-4 sm:px-6 font-['Inter','Segoe_UI',system-ui,sans-serif] transition-colors duration-500">

      {/* Theme Toggle Button */}
      <button
        onClick={toggleDarkmode}
        className="absolute top-6 right-6 p-2 rounded-full bg-white/50 dark:bg-white/10 text-gray-800 dark:text-white backdrop-blur-md border border-gray-200 dark:border-white/10 shadow-sm hover:scale-110 transition-all duration-300"
        title="Toggle Light/Dark Mode"
      >
        {isDarkmodeActive ? "☀️" : "🌙"}
      </button>

      <div className="w-full max-w-[420px] bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/8 rounded-2xl sm:rounded-3xl p-8 sm:p-10 shadow-xl dark:shadow-[0_25px_60px_rgba(0,0,0,0.4)] animate-cardAppear transition-colors duration-500">

        {/* Header */}
        <div className="text-center mb-8 sm:mb-9">
          <h1 className="animate-slideUpFade text-2xl sm:text-3xl font-bold bg-linear-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-[#a78bfa] dark:via-[#7c3aed] dark:to-[#6d28d9] bg-clip-text text-transparent tracking-tight mb-2">
            Masterrio
          </h1>
          <p className="animate-slideUpFade delay-100 text-gray-500 dark:text-white/50 text-sm sm:text-[15px]">
            Sign in to your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Error */}
          {error && (
            <div className="bg-red-50 dark:bg-red-500/12 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-300 px-4 py-3 rounded-xl text-sm animate-shake">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="animate-slideUpFade delay-200 flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-medium text-gray-500 dark:text-white/60 uppercase tracking-wider">
              Email
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
              autoComplete="email"
              className="px-4 py-3.5 bg-white dark:bg-white/6 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-gray-100 text-[15px] placeholder-gray-400 dark:placeholder-white/25 outline-none transition-all duration-200 focus:border-violet-500 focus:dark:border-[#7c3aed] focus:ring-[3px] focus:ring-violet-500/10 focus:dark:ring-[#7c3aed]/15 shadow-sm dark:shadow-none"
            />
          </div>

          {/* Password */}
          <div className="animate-slideUpFade delay-300 flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs font-medium text-gray-500 dark:text-white/60 uppercase tracking-wider">
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
                autoComplete="current-password"
                className="w-full px-4 py-3.5 pr-12 bg-white dark:bg-white/6 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-gray-100 text-[15px] placeholder-gray-400 dark:placeholder-white/25 outline-none transition-all duration-200 focus:border-violet-500 focus:dark:border-[#7c3aed] focus:ring-[3px] focus:ring-violet-500/10 focus:dark:ring-[#7c3aed]/15 shadow-sm dark:shadow-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white/80 transition-colors focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="animate-slideUpFade delay-400 mt-2 py-3.5 bg-linear-to-r from-violet-600 to-indigo-600 dark:from-[#7c3aed] dark:to-[#6d28d9] text-white rounded-xl text-base font-semibold cursor-pointer transition-all duration-200 hover:not-disabled:-translate-y-0.5 hover:not-disabled:shadow-[0_8px_25px_rgba(124,58,237,0.3)] dark:hover:not-disabled:shadow-[0_8px_25px_rgba(124,58,237,0.4)] active:not-disabled:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <div className="animate-slideUpFade delay-500 text-center mt-7 pt-6 border-t border-gray-100 dark:border-white/6">
          <p className="text-gray-500 dark:text-white/40 text-sm">
            Don't have an account?{" "}
            <a href="/register" className="text-violet-600 dark:text-[#a78bfa] font-medium hover:text-violet-700 dark:hover:text-[#c4b5fd] transition-colors duration-200">
              Create one
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
