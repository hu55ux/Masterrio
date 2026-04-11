import React from 'react';

const RatingStars = ({ score, size = "w-4 h-4" }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    // Determine the fill percentage for this specific star (0 to 100)
    const fillPercent = Math.max(0, Math.min(100, (score - (i - 1)) * 100));
    
    stars.push(
      <div key={i} className={`relative ${size}`}>
        {/* Background Empty Star */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`${size} text-gray-200 dark:text-white/10 absolute inset-0`}>
          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
        </svg>

        {/* Foreground Filled Star (Clamped to fillPercent) */}
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${fillPercent}%` }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`${size} text-amber-400`}>
            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    );
  }
  return <div className="flex gap-0.5">{stars}</div>;
};

export default RatingStars;
