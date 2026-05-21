import React from 'react';

function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-[100] backdrop-blur-sm transition-opacity duration-300">
      <div className="flex flex-col items-center">
        <svg 
          viewBox="0 0 100 100" 
          className="w-24 h-24 animate-[spin_1s_linear_infinite]" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="metalOuter" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d1d5db" />
              <stop offset="20%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#9ca3af" />
              <stop offset="80%" stopColor="#e5e7eb" />
              <stop offset="100%" stopColor="#4b5563" />
            </linearGradient>
            <linearGradient id="metalInner" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d1d5db" />
              <stop offset="20%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#9ca3af" />
              <stop offset="80%" stopColor="#e5e7eb" />
              <stop offset="100%" stopColor="#374151" />
            </linearGradient>
            <radialGradient id="ball" cx="35%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#e5e7eb" />
              <stop offset="80%" stopColor="#6b7280" />
              <stop offset="100%" stopColor="#1f2937" />
            </radialGradient>
            <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.5"/>
            </filter>
            <filter id="innerShadow">
              <feOffset dx="0" dy="0"/>
              <feGaussianBlur stdDeviation="3" result="offset-blur"/>
              <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
              <feFlood floodColor="black" floodOpacity="0.7" result="color"/>
              <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
              <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
            </filter>
          </defs>

          {/* Outer ring */}
          <circle cx="50" cy="50" r="45" fill="url(#metalOuter)" filter="url(#dropShadow)" />
          
          {/* Groove (Dark area behind balls) */}
          <circle cx="50" cy="50" r="36" fill="#111827" filter="url(#innerShadow)" />
          
          {/* Inner ring */}
          <circle cx="50" cy="50" r="22" fill="url(#metalInner)" filter="url(#dropShadow)" />
          
          {/* Axle hole */}
          <circle cx="50" cy="50" r="10" fill="#030712" filter="url(#innerShadow)" />
          
          {/* Balls (Radius = 7, placed around circle with r=29) */}
          <circle cx="79" cy="50" r="7" fill="url(#ball)" filter="url(#dropShadow)" />
          <circle cx="70.5" cy="70.5" r="7" fill="url(#ball)" filter="url(#dropShadow)" />
          <circle cx="50" cy="79" r="7" fill="url(#ball)" filter="url(#dropShadow)" />
          <circle cx="29.5" cy="70.5" r="7" fill="url(#ball)" filter="url(#dropShadow)" />
          <circle cx="21" cy="50" r="7" fill="url(#ball)" filter="url(#dropShadow)" />
          <circle cx="29.5" cy="29.5" r="7" fill="url(#ball)" filter="url(#dropShadow)" />
          <circle cx="50" cy="21" r="7" fill="url(#ball)" filter="url(#dropShadow)" />
          <circle cx="70.5" cy="29.5" r="7" fill="url(#ball)" filter="url(#dropShadow)" />
          
          {/* Rim reflections for extra realism */}
          <circle cx="50" cy="50" r="43" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
          <circle cx="50" cy="50" r="21" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
          <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth="1" />
          <circle cx="50" cy="50" r="23" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="1" />
          
          {/* Light gleam across the whole bearing */}
          <path d="M 5,50 A 45,45 0 0,1 95,50" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="6" opacity="0.7" />
        </svg>
        <span className="mt-5 text-gray-200 font-bold text-lg tracking-[0.2em] animate-pulse drop-shadow-md">
          LOADING
        </span>
      </div>
    </div>
  );
}

export default Loader;