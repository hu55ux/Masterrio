import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { useTokens } from '@/stores/useTokens';

const RatingModal = ({ 
  isOpen, 
  onClose, 
  masterId, 
  onRatingSuccess, 
  initialScore = 0, 
  initialComment = '', 
  isUpdate = false 
}) => {
  const [score, setScore] = useState(initialScore);
  const [comment, setComment] = useState(initialComment);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const { userId } = useTokens();

  useEffect(() => {
    if (isOpen) {
      setScore(initialScore);
      setComment(initialComment);
      setStatus({ type: '', message: '' });
    }
  }, [isOpen, initialScore, initialComment]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (score === 0) {
      setStatus({ type: 'error', message: 'Please select a rating' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      const payload = {
        masterId,
        customerId: userId,
        score,
        comment
      };

      if (isUpdate) {
        await axiosInstance.put('/MasterRating', payload);
        setStatus({ type: 'success', message: 'Rating updated successfully!' });
      } else {
        await axiosInstance.post('/MasterRating', payload);
        setStatus({ type: 'success', message: 'Rating submitted successfully!' });
      }

      setTimeout(() => {
        onRatingSuccess();
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Rating error:', error);
      setStatus({ type: 'error', message: error.response?.data?.message || 'Operation failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleMouseMove = (e, starIndex) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, x / rect.width));
    // Calculate 0.1 precision
    const preciseValue = Math.round((starIndex - 1 + percent) * 10) / 10;
    setHover(preciseValue);
  };

  const StarIcon = ({ starIndex, fillValue }) => {
    const fillPercent = Math.max(0, Math.min(1, fillValue - (starIndex - 1))) * 100;
    
    return (
      <div className="relative w-10 h-10 transition-transform duration-200">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="absolute inset-0 w-full h-full text-slate-200 dark:text-white/5">
          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
        </svg>

        <div className="absolute inset-0 overflow-hidden" style={{ width: `${fillPercent}%` }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-amber-400">
            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    );
  };

  const getStatusText = (val) => {
    if (val >= 4.8) return "Visionary Masterpiece";
    if (val >= 4.5) return "Absolute Excellence";
    if (val >= 4.0) return "Top-Tier Professional";
    if (val >= 3.5) return "Strongly Recommended";
    if (val >= 3.0) return "Skilled Execution";
    if (val >= 2.5) return "Acceptable Standards";
    return "Requires Improvement";
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fadeIn" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-4xl p-8 shadow-2xl border border-slate-200 dark:border-white/10 animate-cardAppear">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{isUpdate ? 'Edit Rating' : 'Rate Master'}</h2>
        <p className="text-slate-500 dark:text-white/40 text-sm mb-6">Your feedback helps improve the platform.</p>

        {status.message && (
          <div className={`p-4 rounded-2xl mb-6 text-sm font-bold ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((starIndex) => (
                <button
                  key={starIndex}
                  type="button"
                  onClick={() => setScore(hover)}
                  onMouseMove={(e) => handleMouseMove(e, starIndex)}
                  className="p-0.5 transition-transform active:scale-95 cursor-pointer"
                >
                  <StarIcon starIndex={starIndex} fillValue={hover || score} />
                </button>
              ))}
            </div>
            {(hover || score) > 0 && (
              <div className="flex flex-col items-center gap-1 animate-fadeIn">
                <span className="text-4xl font-black text-amber-500 tracking-tighter">
                  {(hover || score).toFixed(1)}
                </span>
                <span className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.3em]">
                  {getStatusText(hover || score)}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest px-1">Detailed Feedback</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What specifically did you appreciate about their work?"
              className="w-full h-32 p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary-500 outline-hidden transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || score === 0}
            className="w-full py-4 bg-linear-to-r from-primary-600 to-primary-700 text-white font-bold rounded-2xl shadow-xl shadow-primary-500/20 hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              isUpdate ? 'Confirm Changes' : 'Post Review'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;
