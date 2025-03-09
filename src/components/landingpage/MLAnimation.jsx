// MLAnimation.jsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const MLAnimation = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Ensure all refs are available
    if (!containerRef.current) return;

    // Create text elements dynamically
    const title = document.createElement("h1");
    title.textContent = "Intelligent Resume Matching";
    title.className = "text-gradient animate-title";
    containerRef.current.appendChild(title);

    // Animation timeline
    const tl = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
    });

    // Animate title
    tl.from(title, {
      y: 50,
      opacity: 0,
      duration: 1,
    });

    // Cleanup
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <main className="relative min-h-screen w-full bg-[#0A0A2A] overflow-hidden">
      {/* Background with stars */}
      <div className="absolute inset-0">
        <div className="stars" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div
          ref={containerRef}
          className="flex flex-col items-center justify-center min-h-[80vh]"
        >
          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500">
            Intelligent Resume Matching
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 text-center mb-16 max-w-3xl">
            Advanced ML-powered resume analysis and job matching system
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
            {[
              {
                title: "Resume Analysis",
                description: "AI-powered deep analysis",
                icon: "📄",
              },
              {
                title: "Job Matching",
                description: "Smart opportunity matching",
                icon: "🎯",
              },
              {
                title: "Skill Suggestions",
                description: "Personalized recommendations",
                icon: "💡",
              },
              {
                title: "Career Guidance",
                description: "Expert career insights",
                icon: "🚀",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <span className="text-4xl mb-4 block">{feature.icon}</span>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default MLAnimation;
