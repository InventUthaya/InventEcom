import React from "react";

export default function LeftSideAnimation() {
    return (
        <div className="hidden lg:flex lg:w-1/2 bg-indigo-950 relative overflow-hidden">
            {/* 3D Floating Shapes Container */}
            <div className="absolute inset-0">
                {/* Rotating Orbital Rings around Logo */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    {/* Large Outer Ring */}
                    <div className="relative w-[500px] h-[500px] animate-spin-slow">
                        <div className="absolute inset-0 border-2 border-transparent border-t-purple-400/40 border-r-indigo-400/30 rounded-full"></div>
                        <div className="absolute inset-16 border-2 border-transparent border-b-indigo-300/30 border-l-purple-300/25 rounded-full"></div>

                        {/* Orbital Points */}
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={`outer-${i}`}
                                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                                style={{ transform: `rotate(${i * 45}deg) translateY(-250px) rotate(-${i * 45}deg)` }}
                            >
                                <div className="w-3 h-3 bg-gradient-to-br from-purple-400 to-indigo-300 rounded-full blur-sm"></div>
                            </div>
                        ))}
                    </div>

                    {/* Medium Ring */}
                    <div className="relative w-[400px] h-[400px] animate-spin-medium">
                        <div className="absolute inset-0 border-3 border-transparent border-t-indigo-400/30 border-r-purple-400/25 rounded-full"></div>
                        <div className="absolute inset-12 border-2 border-transparent border-b-purple-300/25 border-l-indigo-300/20 rounded-full"></div>

                        {/* Orbital Points */}
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={`medium-${i}`}
                                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                                style={{ transform: `rotate(${i * 60}deg) translateY(-200px) rotate(-${i * 60}deg)` }}
                            >
                                <div className="w-2 h-2 bg-gradient-to-br from-indigo-300 to-purple-200 rounded-full"></div>
                            </div>
                        ))}
                    </div>

                    {/* Small Inner Ring */}
                    <div className="relative w-[300px] h-[300px] animate-spin-fast">
                        <div className="absolute inset-0 border-2 border-transparent border-l-purple-400/20 border-b-indigo-400/15 rounded-full"></div>

                        {/* Orbital Points */}
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={`inner-${i}`}
                                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                                style={{ transform: `rotate(${i * 90}deg) translateY(-150px) rotate(-${i * 90}deg)` }}
                            >
                                <div className="w-1.5 h-1.5 bg-white/70 rounded-full"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Logo Container */}
                <div className="relative z-20 flex flex-col justify-center items-center w-full h-full px-8">
                    <div className="relative group">
                        {/* Logo shadow/glow effect */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>

                        {/* Logo container with subtle 3D tilt */}
                        <div className="relative transform transition-transform duration-500 ">
                            <img
                                src="/images/logo/Logo (1).png"
                                alt="Company Logo"
                                width={240}
                                height={140}
                                className="object-contain drop-shadow-2xl filter brightness-110 contrast-110"
                                style={{
                                    filter: 'drop-shadow(0 20px 40px rgba(99, 102, 241, 0.3))',
                                    imageRendering: 'crisp-edges'
                                }}
                            />

                            {/* Subtle reflection effect */}
                            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-2 bg-gradient-to-t from-white/10 to-transparent blur-sm"></div>
                        </div>
                    </div>

                    {/* Optional: Subtle floating indicator */}
                    <div className="mt-12 animate-bounce-slow">
                        {/* <div className="text-white/60 text-sm font-light tracking-wider">
              WELCOME BACK
            </div> */}
                    </div>
                </div>

                {/* Background Floating Orbs */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 opacity-30 animate-float-slow">
                    <div className="relative w-full h-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 to-indigo-600/30 rounded-full blur-2xl"></div>
                        <div className="absolute inset-8 bg-gradient-to-tr from-purple-500/30 to-indigo-400/20 rounded-full blur-xl"></div>
                    </div>
                </div>

                <div className="absolute bottom-1/3 right-1/4 w-48 h-48 opacity-20 animate-float-medium">
                    <div className="relative w-full h-full">
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/30 to-purple-500/25 rounded-full blur-2xl"></div>
                    </div>
                </div>

                {/* Floating Particles */}
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className={`absolute w-1 h-1 bg-white/20 rounded-full animate-pulse`}
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: `${2 + (i % 4)}s`
                        }}
                    ></div>
                ))}
            </div>

            {/* Subtle grid overlay for depth */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px),
                          linear-gradient(to bottom, #fff 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }}></div>
            </div>
              {/* Add custom animations to global styles or in your CSS file */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(20px, -20px) rotate(120deg); }
          66% { transform: translate(-15px, 15px) rotate(240deg); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(15px, 15px); }
        }
        
        @keyframes float-fast {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(10px, -10px); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-medium {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        
        @keyframes spin-fast {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 15s ease-in-out infinite;
        }
        
        .animate-float-fast {
          animation: float-fast 10s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 40s linear infinite;
        }
        
        .animate-spin-medium {
          animation: spin-medium 30s linear infinite;
        }
        
        .animate-spin-fast {
          animation: spin-fast 20s linear infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
        </div>
        
    );
}