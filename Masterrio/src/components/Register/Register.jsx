import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";
import { useDarkmode } from "@/stores/useDarkmode";

const INITIAL_DATA = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmedPassword: "",
  dateOfBirth: "",
  experience: 0,
  phoneNumber: "",
  address: "",
  role: "Customer",
};

const Register = () => {
  const [step, setStep] = useState(() => {
    return Number(localStorage.getItem("register_step")) || 1;
  });
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("register_form_data");
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const { isDarkmodeActive, toggleDarkmode } = useDarkmode();

  // Bütün formData dəyişəndə avtomatik olaraq LocalStorage-ə yazır (tək-tək yazmağa ehtiyac qalmır)
  useEffect(() => {
    localStorage.setItem("register_form_data", JSON.stringify(formData));
  }, [formData]);

  // Hətta hansı Addımda olduğunu da yaddaşda saxlayır
  useEffect(() => {
    localStorage.setItem("register_step", step);
  }, [step]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const nextStep = () => {
    setError("");
    // Basic validation for Step 1
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phoneNumber || !formData.dateOfBirth) {
      setError("Please fill in all required fields.");
      return;
    }
    setStep(2);
  };

  const prevStep = () => {
    setError("");
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmedPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const payload = { ...formData };
      if (payload.role === "Customer") {
        payload.experience = 0;
      }

      const response = await axiosInstance.post("/auth/register", payload);
      const { success, message } = response.data;

      if (success) {
        localStorage.removeItem("register_form_data");
        localStorage.removeItem("register_step");
        navigate("/login");
      } else {
        setError(message || "Registration failed. Please try again.");
      }
    } catch (err) {
      // Backenddən gələn dəqiq Validation (Məsələn, .NET ModelState) xətalarını tutmaq
      if (err.response?.data) {
        if (err.response.data.errors) {
          const errList = Object.values(err.response.data.errors).flat();
          setError(errList.join(" | "));
        } else if (err.response.data.message) {
          setError(err.response.data.message);
        } else if (typeof err.response.data === "string") {
          setError(err.response.data);
        } else {
          setError("Registration failed with validation error.");
        }
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-purple-50 dark:from-[#0f0c29] dark:via-[#1a1a2e] dark:to-[#16213e] px-4 sm:px-6 py-10 font-['Inter','Segoe_UI',system-ui,sans-serif] transition-colors duration-500">

      {/* Theme Toggle Button */}
      <button
        onClick={toggleDarkmode}
        className="animate-slideUpFade delay-600 fixed top-6 right-6 p-2 rounded-full bg-white/50 dark:bg-white/10 text-gray-800 dark:text-white backdrop-blur-md border border-gray-200 dark:border-white/10 shadow-sm hover:scale-110 transition-all duration-300 z-50"
        title="Toggle Light/Dark Mode"
      >
        {isDarkmodeActive ? "☀️" : "🌙"}
      </button>

      <div className="w-full max-w-[500px] bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/8 rounded-2xl sm:rounded-3xl p-8 sm:p-10 shadow-xl dark:shadow-[0_25px_60px_rgba(0,0,0,0.4)] animate-cardAppear transition-colors duration-500">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="animate-slideUpFade text-2xl sm:text-3xl font-bold bg-linear-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-[#a78bfa] dark:via-[#7c3aed] dark:to-[#6d28d9] bg-clip-text text-transparent tracking-tight mb-2">
            Create Account
          </h1>
          <p className="animate-slideUpFade delay-100 text-gray-500 dark:text-white/50 text-sm">
            Step {step} of 2
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-white/10 h-1.5 rounded-full mt-4 overflow-hidden animate-slideUpFade delay-200">
            <div
              className="h-full bg-linear-to-r from-violet-600 to-indigo-600 dark:from-[#7c3aed] dark:to-[#6d28d9] transition-all duration-500 ease-out"
              style={{ width: step === 1 ? "50%" : "100%" }}
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={step === 1 ? (e) => { e.preventDefault(); nextStep(); } : handleSubmit} className="flex flex-col gap-5">

          {error && (
            <div className="bg-red-50 dark:bg-red-500/12 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-300 px-4 py-3 rounded-xl text-sm animate-shake">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="animate-slideUpFade delay-300 space-y-4">

              {/* Role Selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500 dark:text-white/60 uppercase tracking-wider">I am a</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "Customer" })}
                    className={`py-3 rounded-xl border transition-all duration-200 font-medium text-sm ${formData.role === "Customer"
                        ? "bg-violet-100 border-violet-500 text-violet-700 dark:bg-[#7c3aed]/20 dark:border-[#7c3aed] dark:text-[#c4b5fd]"
                        : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-violet-300 dark:hover:border-white/20"
                      }`}
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "Master" })}
                    className={`py-3 rounded-xl border transition-all duration-200 font-medium text-sm ${formData.role === "Master"
                        ? "bg-violet-100 border-violet-500 text-violet-700 dark:bg-[#7c3aed]/20 dark:border-[#7c3aed] dark:text-[#c4b5fd]"
                        : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-violet-300 dark:hover:border-white/20"
                      }`}
                  >
                    Master
                  </button>
                </div>
              </div>

              {/* Name Details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-500 dark:text-white/60 uppercase tracking-wider">First Name</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="px-4 py-3 bg-white dark:bg-white/6 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-gray-100 text-sm outline-none focus:border-violet-500 focus:ring-[3px] focus:ring-violet-500/10 dark:focus:border-[#7c3aed]" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-500 dark:text-white/60 uppercase tracking-wider">Last Name</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="px-4 py-3 bg-white dark:bg-white/6 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-gray-100 text-sm outline-none focus:border-violet-500 focus:ring-[3px] focus:ring-violet-500/10 dark:focus:border-[#7c3aed]" />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500 dark:text-white/60 uppercase tracking-wider">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="px-4 py-3 bg-white dark:bg-white/6 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-gray-100 text-sm outline-none focus:border-violet-500 focus:ring-[3px] focus:ring-violet-500/10 dark:focus:border-[#7c3aed]" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-500 dark:text-white/60 uppercase tracking-wider">Phone</label>
                  <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required className="px-4 py-3 bg-white dark:bg-white/6 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-gray-100 text-sm outline-none focus:border-violet-500 focus:ring-[3px] focus:ring-violet-500/10 dark:focus:border-[#7c3aed]" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-500 dark:text-white/60 uppercase tracking-wider">Date of Birth</label>
                  <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required className="px-4 py-3 bg-white dark:bg-white/6 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-gray-100 text-sm outline-none focus:border-violet-500 focus:ring-[3px] focus:ring-violet-500/10 dark:focus:border-[#7c3aed]" />
                </div>
              </div>

            </div>
          )}

          {step === 2 && (
            <div className="animate-slideUpFade space-y-4">

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500 dark:text-white/60 uppercase tracking-wider">Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} required className="px-4 py-3 bg-white dark:bg-white/6 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-gray-100 text-sm outline-none focus:border-violet-500 focus:ring-[3px] focus:ring-violet-500/10 dark:focus:border-[#7c3aed]" />
              </div>

              {/* Show Experience only if Role is Master, otherwise default to 0 */}
              <div className={`transition-all duration-300 flex flex-col gap-1.5 ${formData.role === "Master" ? "opacity-100 h-auto" : "hidden"}`}>
                <label className="text-xs font-medium text-gray-500 dark:text-white/60 uppercase tracking-wider">Experience (Years)</label>
                <input type="number" name="experience" min="0" max="50" value={formData.experience} onChange={handleChange} className="px-4 py-3 bg-white dark:bg-white/6 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-gray-100 text-sm outline-none focus:border-violet-500 focus:ring-[3px] focus:ring-violet-500/10 dark:focus:border-[#7c3aed]" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-500 dark:text-white/60 uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-3 pr-10 bg-white dark:bg-white/6 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-gray-100 text-sm outline-none focus:border-violet-500 focus:ring-[3px] focus:ring-violet-500/10 dark:focus:border-[#7c3aed]" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white/80 transition-colors">
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-500 dark:text-white/60 uppercase tracking-wider">Confirm Password</label>
                  <div className="relative">
                    <input type={showConfirmPassword ? "text" : "password"} name="confirmedPassword" value={formData.confirmedPassword} onChange={handleChange} required className="w-full px-4 py-3 pr-10 bg-white dark:bg-white/6 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-gray-100 text-sm outline-none focus:border-violet-500 focus:ring-[3px] focus:ring-violet-500/10 dark:focus:border-[#7c3aed]" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white/80 transition-colors">
                      {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Controls */}
          <div className="animate-slideUpFade delay-400 mt-4 flex gap-3">
            {step === 2 && (
              <button
                type="button"
                onClick={prevStep}
                className="w-1/3 py-3.5 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white rounded-xl text-sm font-semibold hover:bg-gray-200 dark:hover:bg-white/20 transition-all duration-200"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`${step === 1 ? "w-full" : "w-2/3"} py-3.5 bg-linear-to-r from-violet-600 to-indigo-600 dark:from-[#7c3aed] dark:to-[#6d28d9] text-white rounded-xl text-sm font-semibold cursor-pointer transition-all duration-200 hover:not-disabled:-translate-y-0.5 hover:not-disabled:shadow-[0_8px_25px_rgba(124,58,237,0.3)] disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {loading ? "Please wait..." : (step === 1 ? "Continue" : "Create Account")}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="animate-slideUpFade delay-500 text-center mt-7 pt-6 border-t border-gray-100 dark:border-white/6">
          <p className="text-gray-500 dark:text-white/40 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-violet-600 dark:text-[#a78bfa] font-medium hover:text-violet-700 dark:hover:text-[#c4b5fd] transition-colors duration-200">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
