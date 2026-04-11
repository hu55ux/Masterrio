import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [stage, setStage] = useState('in'); // 'in' or 'out'

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setStage('out');

      const timeout = setTimeout(() => {
        setDisplayLocation(location);
        window.scrollTo({ top: 0, behavior: 'instant' });
        
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setStage('in');
          });
        });
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [location, displayLocation]);

  return (
    <div
      className={`w-full min-h-[50vh] transform-gpu will-change-[opacity,transform] transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        stage === 'in'
          ? 'opacity-100 translate-y-0 scale-100 blur-0'
          : 'opacity-0 translate-y-6 scale-[0.98] blur-[2px] pointer-events-none'
      }`}
    >
      {children}
    </div>
  );
};

export default PageTransition;
