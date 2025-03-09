"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { FileText, Brain, BarChart3, Target, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function QuantumMatchingSystem() {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const [activeCard, setActiveCard] = useState(null);
  const [interactionPoint, setInteractionPoint] = useState({ x: 0, y: 0 });

  const quantumSteps = [
    {
      title: "Resume Analysis",
      description:
        "AI analyzes your skills, experience, and preferences through quantum pattern recognition",
      Icon: FileText,
      link: "#",
    },
    {
      title: "Pattern Recognition",
      description:
        "Machine learning identifies career patterns and opportunities across dimensions",
      Icon: Brain,
      link: "#",
    },
    {
      title: "Job Market Analysis",
      description: "Real-time quantum analysis of market trends and demands",
      Icon: BarChart3,
      link: "#",
    },
    {
      title: "Smart Matching",
      description:
        "Precise quantum-powered matching with suitable opportunities",
      Icon: Target,
      link: "#",
    },
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      setInteractionPoint({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-black overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#000,#000)]">
        <div className="absolute inset-0 opacity-30 mix-blend-hard-light">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 3}px`,
                height: `${Math.random() * 3}px`,
                backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
                boxShadow: "0 0 15px currentColor",
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Title Section */}
        <div className="text-center mb-20">
          <div className="relative inline-block">
            <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-purple-500 animate-text-shimmer">
              How Our AI Works
            </h1>
            <span className="absolute -top-6 right-0 text-sm bg-gradient-to-r from-blue-500 to-purple-500 px-3 py-1 rounded-full animate-pulse text-white font-semibold">
              Pro
            </span>
          </div>
          <p className="mt-4 text-xl text-blue-300/80 font-light">
            Understanding the technology behind our job matching process
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {quantumSteps.map((step, idx) => (
            <div
              key={idx}
              ref={(el) => (cardsRef.current[idx] = el)}
              className={`
      quantum-card-base
      relative group cursor-pointer
      rounded-2xl p-6
      min-h-[280px] /* Ensure consistent height */
      flex flex-col /* Enable flex layout */
      ${activeCard === idx ? "card-hover" : ""}
    `}
              onClick={() => setActiveCard(idx === activeCard ? null : idx)}
            >
              <div className="card-glow"></div>

              {/* Main Content */}
              <div className="flex flex-col flex-grow">
                {/* Icon Container */}
                <div className="p-3 bg-blue-500/10 rounded-xl w-fit mb-4">
                  <step.Icon
                    className="w-8 h-8 text-blue-400 transform group-hover:scale-110 transition-all duration-300"
                    strokeWidth={1.5}
                  />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white/90 group-hover:text-blue-300 transition-colors mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  {step.description}
                </p>
              </div>

              {/* Link Icon - Now properly positioned at bottom */}
              <div className="flex justify-end mt-4">
                <div className="relative w-5 h-5">
                  <ArrowRight
                    className="w-full h-full text-blue-400/40 group-hover:text-blue-400 
                     transition-all duration-300 transform group-hover:translate-x-0.5 
                     group-hover:-translate-y-0.5"
                    strokeWidth={1.5}
                  />
                </div>
              </div>

              {/* Interactive Quantum Field */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <div
                  className="absolute w-full h-full opacity-30 mix-blend-overlay transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at ${interactionPoint.x}px ${interactionPoint.y}px, rgba(96, 165, 250, 0.3) 0%, transparent 50%)`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Particles */}
      <div className="quantum-particle-container">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="quantum-particle animate-quantum-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 2}px`,
              height: `${2 + Math.random() * 2}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
              opacity: 0.4 + Math.random() * 0.3,
              background: `linear-gradient(to right, rgba(96, 165, 250, ${
                0.4 + Math.random() * 0.3
              }), rgba(168, 85, 247, ${0.4 + Math.random() * 0.3}))`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
