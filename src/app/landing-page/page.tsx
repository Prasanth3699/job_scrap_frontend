"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import TrustIndicators from "@/components/landing/TrustIndicators";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorks from "@/components/landing/HowItWorks";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Dark mode toggle with localStorage persistence
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode) setDarkMode(savedMode === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Navbar scroll effect
  useEffect(() => {
    if (!navRef.current || !heroRef.current) return;

    gsap.to(navRef.current, {
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "+=100",
        scrub: true,
      },
      backgroundColor: darkMode
        ? "rgba(17, 24, 39, 0.9)"
        : "rgba(255, 255, 255, 0.9)",
      paddingTop: ".75rem",
      paddingBottom: ".75rem",
      backdropFilter: "blur(12px)",
      boxShadow: darkMode
        ? "0 4px 6px -1px rgba(0, 0, 0, 0.4)"
        : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      duration: 0.3,
    });
  }, [darkMode]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="dark:bg-gray-900 dark:text-gray-100 min-h-screen">
        <Navbar ref={navRef} darkMode={darkMode} setDarkMode={setDarkMode} />
        <HeroSection ref={heroRef} darkMode={darkMode} />
        <TrustIndicators />
        <FeaturesSection />
        <HowItWorks />
        <CTASection />
        <Footer />

        {/* Global Styles */}
        <GlobalStyles />
      </div>
    </div>
  );
}

function GlobalStyles() {
  return (
    <style jsx global>{`
      @keyframes blob {
        0%,
        100% {
          transform: translate(0px, 0px) scale(1);
        }
        33% {
          transform: translate(30px, -50px) scale(1.1);
        }
        66% {
          transform: translate(-20px, 20px) scale(0.9);
        }
      }
      .animate-blob {
        animation: blob 7s ease-in-out infinite;
      }
      .animation-delay-2000 {
        animation-delay: 2s;
      }
      .animation-delay-4000 {
        animation-delay: 4s;
      }

      /* Smooth scrolling */
      html {
        scroll-behavior: smooth;
      }

      /* Better transitions */
      * {
        transition: background-color 0.3s ease, color 0.3s ease;
      }

      /* Focus styles for accessibility */
      button:focus,
      a:focus,
      input:focus {
        outline: 2px solid rgba(139, 92, 246, 0.5);
        outline-offset: 2px;
      }

      /* Scrollbar styling */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      ::-webkit-scrollbar-track {
        background: rgba(243, 244, 246, 0.4);
      }
      ::-webkit-scrollbar-thumb {
        background: rgba(139, 92, 246, 0.5);
        border-radius: 4px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(139, 92, 246, 0.7);
      }
      .dark ::-webkit-scrollbar-track {
        background: rgba(17, 24, 39, 0.8);
      }
      .dark ::-webkit-scrollbar-thumb {
        background: rgba(167, 139, 250, 0.5);
      }

      /* Animation for the hero section demo card */
      .upload-section,
      .processing,
      .job-selection,
      .results {
        transition: all 0.5s ease;
      }
    `}</style>
  );
}
