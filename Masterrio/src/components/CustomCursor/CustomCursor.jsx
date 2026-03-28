import React, { useEffect, useState, useRef } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [sparks, setSparks] = useState([]);
  const requestRef = useRef();

  useEffect(() => {
    const onMouseMove = (e) => {
      const { clientX, clientY } = e;
      setPosition({ x: clientX, y: clientY });
    };

    const handleMouseDown = (e) => {
      setIsClicked(true);
      createSparks(e.clientX, e.clientY);
      setTimeout(() => setIsClicked(false), 150);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button')
      ) {
        setIsPointer(true);
      } else {
        setIsPointer(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseover', handleMouseOver);

    const animate = () => {
      setSparks((prev) =>
        prev
          .map((s) => ({
            ...s,
            life: s.life - 0.05,
            y: s.y + s.velocity.y,
            x: s.x + s.velocity.x,
            velocity: { x: s.velocity.x * 0.95, y: s.velocity.y + 0.2 }
          }))
          .filter((s) => s.life > 0)
      );
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const createSparks = (x, y) => {
    const newSparks = Array.from({ length: 10 }).map(() => ({
      id: Math.random().toString(36).substr(2, 9),
      x, y,
      life: 1,
      size: Math.random() * 3 + 1,
      velocity: {
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 10 - 2
      },
      color: '#fbbf24'
    }));
    setSparks((prev) => [...prev, ...newSparks]);
  };

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      <style>{`
        body { cursor: none !important; }
        a, button, [role="button"], input, textarea, select { cursor: none !important; }
        .cursor-h { pointer-events: none; position: fixed; top: 0; left: 0; z-index: 99999; }
      `}</style>

      {/* Sparks */}
      {sparks.map((s) => (
        <div key={s.id} className="cursor-h" style={{ transform: `translate3d(${s.x}px, ${s.y}px, 0)`, opacity: s.life, width: s.size, height: s.size, backgroundColor: s.color, borderRadius: '50%' }} />
      ))}

      {/* The Hammer */}
      <div className="cursor-h" style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}>
        <div className="transition-transform duration-75" style={{ 
          transform: `translate(-10px, -15px) rotate(${isClicked ? '-30deg' : '0deg'}) scale(${isPointer ? 1.2 : 1})`,
          transformOrigin: 'bottom left'
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
            {/* Handle */}
            <path d="M7 17L13 11" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M4 20L7 17" stroke="#451a03" strokeWidth="3" strokeLinecap="round" />
            
            {/* Metal Head */}
            <rect x="12" y="6" width="9" height="6" rx="1.5" transform="rotate(45 12 6)" fill="#475569" />
            <path d="M15 5L12 8" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          </svg>
        </div>
      </div>
    </>
  );
};

export default CustomCursor;
