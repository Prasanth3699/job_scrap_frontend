"use client";

import {
  ArrowRight,
  FileInput,
  LayoutDashboard,
  Loader2,
  Sparkles,
  Target,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FaFacebook,
  FaXTwitter,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa6";

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const trustSectionRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const demoCardRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Dark mode toggle with localStorage persistence
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode) setDarkMode(savedMode === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Hero section animation timeline
  useEffect(() => {
    if (!demoCardRef.current) return;

    setIsAnimating(true);

    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: 1.5,
      defaults: { ease: "power3.inOut" },
    });

    // Initial state reset
    tl.set(demoCardRef.current.querySelectorAll("*"), { opacity: 0, y: 20 });

    // Upload state
    tl.to(demoCardRef.current.querySelectorAll(".upload-section > *"), {
      opacity: 1,
      y: 0,
      stagger: 0.15,
      duration: 0.5,
    })
      .to(
        demoCardRef.current,
        {
          backgroundColor: darkMode ? "rgb(17 24 39)" : "rgb(255 255 255)",
          duration: 0.3,
        },
        "<"
      )
      .delay(2)

      // Processing state
      .to(demoCardRef.current.querySelectorAll(".upload-section > *"), {
        opacity: 0,
        y: -20,
        stagger: 0.1,
        duration: 0.4,
      })
      .to(
        demoCardRef.current,
        {
          backgroundColor: darkMode ? "rgb(31 41 55)" : "rgb(249 250 251)",
          duration: 0.3,
        },
        "<"
      )
      .fromTo(
        demoCardRef.current.querySelectorAll(".processing > *"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 0.5 }
      )
      .to(demoCardRef.current.querySelector(".spinner"), {
        rotation: 360,
        duration: 2,
        ease: "none",
        repeat: 1,
      })
      .delay(3)

      // Job selection state
      .to(demoCardRef.current.querySelectorAll(".processing > *"), {
        opacity: 0,
        y: -20,
        duration: 0.4,
      })
      .to(
        demoCardRef.current,
        {
          backgroundColor: darkMode ? "rgb(17 24 39)" : "rgb(255 255 255)",
          duration: 0.3,
        },
        "<"
      )
      .fromTo(
        demoCardRef.current.querySelectorAll(".job-selection > *"),
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, stagger: 0.1, duration: 0.5 }
      )
      .delay(4)

      // Results state
      .to(demoCardRef.current.querySelectorAll(".job-selection > *"), {
        opacity: 0,
        scale: 0.9,
        duration: 0.4,
      })
      .to(
        demoCardRef.current,
        {
          backgroundColor: darkMode ? "rgb(31 41 55)" : "rgb(249 250 251)",
          duration: 0.3,
        },
        "<"
      )
      .fromTo(
        demoCardRef.current.querySelectorAll(".results > *"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 }
      )
      .delay(5);

    return () => {
      tl.kill();
      setIsAnimating(false);
    };
  }, [darkMode]);

  // Trust indicators animation
  useEffect(() => {
    if (!trustSectionRef.current) return;

    gsap.from(trustSectionRef.current.querySelectorAll(".trust-item"), {
      scrollTrigger: {
        trigger: trustSectionRef.current,
        start: "top 80%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      y: 40,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out",
    });

    // Add scale effect on hover
    trustSectionRef.current.querySelectorAll(".trust-item").forEach((item) => {
      item.addEventListener("mouseenter", () => {
        gsap.to(item, {
          scale: 1.03,
          duration: 0.3,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
        });
      });
    });
  }, []);

  // CTA animation
  useEffect(() => {
    if (!ctaRef.current) return;

    gsap.from(ctaRef.current.querySelectorAll("*"), {
      scrollTrigger: {
        trigger: ctaRef.current,
        start: "top 80%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      y: 30,
      duration: 0.6,
      stagger: 0.15,
      ease: "back.out",
    });
  }, []);

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

  const animateNavLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isAnimating) return;

    setIsAnimating(true);
    const link = e.currentTarget;

    // Clear any existing underline
    const existingUnderline = link.querySelector(".nav-underline");
    if (existingUnderline) existingUnderline.remove();

    const underline = document.createElement("span");
    underline.className =
      "nav-underline absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-purple-400 to-blue-500 origin-left";
    underline.style.transform = "scaleX(0)";
    link.appendChild(underline);

    gsap.to(underline, {
      scaleX: 1,
      duration: 0.3,
      ease: "power2.out",
      onComplete: () => {
        setTimeout(() => {
          gsap.to(underline, {
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
              underline.remove();
              setIsAnimating(false);
            },
          });
        }, 300);
      },
    });
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="dark:bg-gray-900 dark:text-gray-100 min-h-screen">
        {/* Navigation */}
        <nav
          ref={navRef}
          className="fixed w-full z-50 bg-white/80 dark:bg-gray-900/80 shadow-sm px-6 py-6 transition-all duration-300 backdrop-blur-lg"
        >
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-7 w-7 text-purple-600 dark:text-purple-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                JobMatch AI
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <a
                href="#features"
                className="hidden md:block font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors relative px-2 py-1"
                onClick={animateNavLink}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="hidden md:block font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors relative px-2 py-1"
                onClick={animateNavLink}
              >
                How It Works
              </a>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                aria-label={`Toggle ${darkMode ? "light" : "dark"} mode`}
              >
                {darkMode ? (
                  <svg
                    className="w-5 h-5 text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-gray-700"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
              <button className="hidden md:block bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all hover:scale-105 hover:shadow-purple-500/20 transform focus:ring-2 focus:ring-purple-400 focus:outline-none">
                Get Started
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section ref={heroRef} className="pt-40 pb-20 px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                Your Perfect{" "}
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                  Job Match
                </span>{" "}
                with AI
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg">
                Let our advanced machine learning analyze your resume and
                preferred jobs to find your perfect career match with{" "}
                <span className="font-semibold text-purple-600 dark:text-purple-400">
                  95% accuracy
                </span>
                .
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  id="get-started"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg hover:shadow-purple-500/20 transition-all hover:scale-105 transform focus:ring-2 focus:ring-purple-400 focus:outline-none flex items-center gap-2"
                >
                  Find My Matches{" "}
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-3 rounded-full font-medium border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-colors focus:ring-2 focus:ring-gray-400 focus:outline-none">
                  How It Works
                </button>
              </div>
              <div className="flex items-center space-x-2 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-12 w-12 rounded-full border-2 border-white dark:border-gray-900 bg-gradient-to-tr from-indigo-400 to-purple-600"
                    />
                  ))}
                </div>
                <div>
                  <p className="text-sm font-medium dark:text-gray-300">
                    Trusted by 10,000+ professionals
                  </p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.799-2.034a1 1 0 00-1.175 0l-2.799 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                      4.9/5 (1,200+ reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-8 -left-8 w-40 h-40 bg-purple-400/80 dark:bg-purple-600/50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-blue-400/80 dark:bg-blue-600/50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute -top-16 right-0 w-52 h-52 bg-indigo-400/80 dark:bg-indigo-600/50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

              {/* Demo Card */}
              <div
                ref={demoCardRef}
                className="relative bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 transform hover:scale-[1.02] transition-all duration-300 h-[500px] w-full max-w-md overflow-hidden"
              >
                <div className="space-y-6 h-full flex flex-col">
                  <h3 className="text-2xl font-bold">Find Your Dream Job</h3>

                  <div className="flex-1 flex flex-col items-center justify-center relative">
                    {/* Upload State */}
                    <div className="upload-section text-center space-y-4 absolute inset-0 flex flex-col items-center justify-center p-6">
                      <div className="p-4 bg-purple-100/50 dark:bg-purple-900/20 rounded-full mb-4">
                        <FileInput className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">
                          <span className="font-medium text-purple-600 dark:text-purple-400">
                            Click to upload
                          </span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                          PDF, DOCX, TXT formats (max. 5MB)
                        </p>
                      </div>
                      <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-2 rounded-lg transition-all">
                        Upload Resume
                      </button>
                    </div>

                    {/* Processing State */}
                    <div className="processing absolute inset-0 flex flex-col items-center justify-center p-6 opacity-0">
                      <div className="p-4 bg-purple-100/50 dark:bg-purple-900/20 rounded-full mb-4">
                        <Loader2 className="h-8 w-8 text-purple-600 dark:text-purple-400 animate-spin spinner" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 mt-4 text-lg">
                        Analyzing your resume...
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                        This usually takes about 30 seconds
                      </p>
                    </div>

                    {/* Job Selection State */}
                    <div className="job-selection absolute inset-0 p-6 opacity-0 flex flex-col">
                      <h4 className="font-bold text-lg mb-4">
                        Select Job Titles That Interest You
                      </h4>
                      <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto pb-4">
                        {[
                          "Frontend Developer",
                          "Backend Engineer",
                          "UX Designer",
                          "Product Manager",
                          "Data Scientist",
                          "DevOps Engineer",
                          "Mobile Developer",
                          "Cloud Architect",
                        ].map((job) => (
                          <button
                            key={job}
                            className={`px-4 py-3 rounded-lg border transition-all hover:shadow-sm ${
                              Math.random() > 0.5
                                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/10"
                                : "border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500/50"
                            }`}
                          >
                            {job}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Results State */}
                    <div className="results absolute inset-0 p-6 opacity-0 flex flex-col items-center justify-center">
                      <div className="w-20 h-20 mb-4 bg-purple-100/50 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                        <svg
                          className="w-10 h-10 text-purple-600 dark:text-purple-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold mb-2 text-center">
                        Analysis Complete!
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Here are your top matches:
                      </p>
                      <div className="space-y-3 w-full max-w-xs">
                        {[
                          {
                            title: "Senior Frontend Developer",
                            company: "Tech Innovations Inc.",
                            match: "94%",
                          },
                          {
                            title: "UI/UX Engineer",
                            company: "Digital Creations LLC",
                            match: "87%",
                          },
                          {
                            title: "Product Designer",
                            company: "Creative Labs",
                            match: "82%",
                          },
                        ].map((job, index) => (
                          <div
                            key={index}
                            className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-sm transition-all"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-bold text-gray-800 dark:text-gray-100">
                                  {job.title}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {job.company}
                                </p>
                              </div>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  parseInt(job.match) > 85
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    : parseInt(job.match) > 75
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                }`}
                              >
                                {job.match} match
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section
          ref={trustSectionRef}
          className="py-16 bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
                Trusted by Professionals Worldwide
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Join thousands who found their dream jobs with our AI matching
                technology
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="trust-item bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 flex items-center justify-center mb-6">
                  <svg
                    className="h-10 w-10 text-purple-600 dark:text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Enterprise Security</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Military-grade encryption with SOC 2 Type II compliance
                  protects your data at every step
                </p>
              </div>

              <div className="trust-item bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center mb-6">
                  <svg
                    className="h-10 w-10 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">250K+ Professionals</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Join a growing community of career-driven individuals across
                  150+ countries
                </p>
              </div>

              <div className="trust-item bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/20 dark:to-teal-900/20 flex items-center justify-center mb-6">
                  <svg
                    className="h-10 w-10 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">94% Accuracy</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Industry-leading match precision powered by GPT-4 AI and
                  proprietary algorithms
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-6 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                AI-Powered Job Matching
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Our proprietary machine learning analyzes hundreds of data
                points across skills, experience, and preferences to find your
                perfect career match
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature Card 1 */}
              <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 transform border border-gray-100 dark:border-gray-800 group/item">
                <div className="w-14 h-14 bg-purple-100/50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-6 group-hover/item:bg-purple-600/10 transition-colors">
                  <LayoutDashboard className="h-7 w-7 text-purple-600 dark:text-purple-400 group-hover/item:text-purple-700 dark:group-hover/item:text-purple-300 transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                  Smart Analysis
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We extract and interpret every relevant detail from your
                  resume beyond just keywords, understanding context, skills
                  hierarchy, and industry nuances.
                </p>
              </div>

              {/* Feature Card 2 */}
              <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 transform border border-gray-100 dark:border-gray-800 group/item">
                <div className="w-14 h-14 bg-blue-100/50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-6 group-hover/item:bg-blue-600/10 transition-colors">
                  <svg
                    className="h-7 w-7 text-blue-600 dark:text-blue-400 group-hover/item:text-blue-700 dark:group-hover/item:text-blue-300 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                  Ranked Matches
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Get intelligently ranked job suggestions based on skills
                  compatibility, culture fit, salary expectations, and long-term
                  growth potential.
                </p>
              </div>

              {/* Feature Card 3 */}
              <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 transform border border-gray-100 dark:border-gray-800 group/item">
                <div className="w-14 h-14 bg-green-100/50 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-6 group-hover/item:bg-green-600/10 transition-colors">
                  <svg
                    className="h-7 w-7 text-green-600 dark:text-green-400 group-hover/item:text-green-700 dark:group-hover/item:text-green-300 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                  Privacy Focused
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Your data is encrypted end-to-end, never shared without
                  consent, with full GDPR and CCPA compliance. Delete anytime.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="py-20 px-6 bg-gray-50 dark:bg-gray-900/50"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Our three-step process simplifies finding your perfect career
                match
              </p>
            </div>

            <div className="relative">
              {/* Vertical line */}
              <div className="hidden lg:block absolute left-1/2 top-0 h-full w-1 bg-gradient-to-b from-purple-500 via-indigo-500 to-blue-500 -ml-[2px] rounded-full"></div>

              {/* Steps */}
              <div className="space-y-20 lg:space-y-32">
                {/* Step 1 */}
                <div className="relative grid lg:grid-cols-2 gap-12 items-center">
                  <div className="lg:pr-12 order-last lg:order-first">
                    <div className="flex items-start gap-6">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
                        1
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-4">
                          Upload Your Resume
                        </h3>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                          Simply upload your resume in any common format. Our
                          system extracts and organizes all relevant information
                          including skills, experience, education, and
                          accomplishments with contextual understanding.
                        </p>
                        <button className="inline-flex items-center text-purple-600 dark:text-purple-400 font-medium group">
                          Learn more about our parsing technology
                          <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                    <div className="p-6 space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-purple-100/50 dark:bg-purple-900/20 flex items-center justify-center">
                          <FileInput className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="font-medium">File Upload</span>
                      </div>
                      <div className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg p-8 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/30">
                        <div className="w-16 h-16 rounded-full bg-purple-100/50 dark:bg-purple-900/20 flex items-center justify-center mb-4">
                          <FileInput className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 mb-2 font-medium">
                          Drag and drop your resume here
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                          or click to browse files
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative grid lg:grid-cols-2 gap-12 items-center">
                  <div className="lg:pl-12 order-first lg:order-last">
                    <div className="flex items-start gap-6">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
                        2
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-4">
                          Select Job Preferences
                        </h3>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                          Choose from our extensive database of job titles or
                          describe your ideal role. Select multiple preferences
                          to help our AI understand your career interests and
                          priorities.
                        </p>
                        <button className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium group">
                          Explore our job categories
                          <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                    <div className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100/50 dark:bg-blue-900/20 flex items-center justify-center">
                          <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="font-medium">Job Selection</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          "Software Engineer",
                          "UX Designer",
                          "Product Manager",
                          "Data Analyst",
                          "Marketing Lead",
                          "DevOps Engineer",
                          "Sales Director",
                          "QA Specialist",
                        ].map((job, index) => (
                          <button
                            key={job}
                            className={`px-4 py-3 rounded-lg border transition-all hover:shadow-sm text-left ${
                              index < 2
                                ? "border-purple-500 bg-purple-50/50 dark:bg-purple-900/10"
                                : "border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500/50"
                            }`}
                          >
                            {job}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Step 3 */}
                <div className="relative grid lg:grid-cols-2 gap-12 items-center">
                  <div className="lg:pr-12 order-last lg:order-first">
                    <div className="flex items-start gap-6">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-blue-600 text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
                        3
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-4">
                          Get Personalized Matches
                        </h3>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                          Our AI compares your profile with thousands of job
                          opportunities, ranking them based on skills match,
                          culture fit, salary expectation, and growth potential
                          with actionable insights.
                        </p>
                        <button className="inline-flex items-center text-indigo-600 dark:text-indigo-400 font-medium group">
                          See sample matching report
                          <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                    <div className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-indigo-100/50 dark:bg-indigo-900/20 flex items-center justify-center">
                          <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <span className="font-medium">Your Top Matches</span>
                      </div>
                      <div className="space-y-3">
                        {[
                          {
                            title: "Senior Frontend Developer",
                            company: "Tech Innovations Inc.",
                            match: "94%",
                            salary: "$120K - $150K",
                            location: "Remote",
                          },
                          {
                            title: "UI/UX Engineer",
                            company: "Digital Creations LLC",
                            match: "87%",
                            salary: "$100K - $135K",
                            location: "San Francisco, CA, USA",
                          },
                          {
                            title: "Product Designer",
                            company: "Creative Labs",
                            match: "82%",
                            salary: "$95K - $125K",
                            location: "New York, NY, USA",
                          },
                        ].map((job, index) => (
                          <div
                            key={index}
                            className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-sm transition-all"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-bold text-gray-800 dark:text-gray-100">
                                  {job.title}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                  {job.company} • {job.location}
                                </p>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {job.salary}
                                </p>
                              </div>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  parseInt(job.match) > 90
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    : parseInt(job.match) > 80
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                    : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                                }`}
                              >
                                {job.match} match
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Modern Glass Morphism Style */}
        <section
          ref={ctaRef}
          className="py-24 px-6 bg-gradient-to-tr from-indigo-700 via-purple-700 to-blue-700 dark:from-indigo-800 dark:via-purple-800 dark:to-blue-800 text-white overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white rounded-full filter blur-3xl opacity-20"></div>
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-400 rounded-full filter blur-3xl opacity-30"></div>
          </div>

          <div className="relative max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Find Your Perfect Job Match?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of professionals who accelerated their careers with
              our AI matching technology
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="relative bg-white text-indigo-700 dark:text-indigo-800 px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all hover:scale-105 transform focus:ring-2 focus:ring-white focus:outline-none overflow-hidden group">
                <span className="relative z-10">Get Started for Free</span>
                <span className="absolute inset-0 bg-gradient-to-r from-white to-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
              <button className="relative px-8 py-4 rounded-full font-bold text-lg border-2 border-white hover:bg-white/10 transition-colors focus:ring-2 focus:ring-white focus:outline-none overflow-hidden group">
                <span className="relative z-10">Schedule a Demo</span>
                <span className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
            </div>
            <p className="mt-6 text-sm opacity-80 font-light">
              No credit card required • Cancel anytime • 7-day free trial
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 px-6 bg-gray-950 text-gray-400">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Sparkles className="h-7 w-7 text-purple-400" />
                <span className="text-2xl font-bold text-white">
                  JobMatch AI
                </span>
              </div>
              <p className="mb-6 max-w-xs">
                The most advanced AI-powered job matching platform helping
                professionals worldwide find their perfect career matches.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors transform hover:scale-110 hover:-translate-y-1"
                  aria-label="Facebook"
                >
                  <FaFacebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="hover:text-blue-200 transition-colors transform hover:scale-110 hover:-translate-y-1"
                  aria-label="Twitter"
                >
                  <FaXTwitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="hover:text-blue-500 transition-colors transform hover:scale-110 hover:-translate-y-1"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="hover:text-pink-500 transition-colors transform hover:scale-110 hover:-translate-y-1"
                  aria-label="Instagram"
                >
                  <FaInstagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Product</h4>
              <ul className="space-y-3">
                {["Features", "How It Works", "Pricing", "API", "Status"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="hover:text-white transition-colors flex items-center group text-sm"
                      >
                        <span className="h-px w-0 bg-purple-400 group-hover:w-4 mr-2 transition-all duration-300"></span>
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Resources</h4>
              <ul className="space-y-3">
                {[
                  "Blog",
                  "Help Center",
                  "Tutorials",
                  "Career Tips",
                  "Webinars",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="hover:text-white transition-colors flex items-center group text-sm"
                    >
                      <span className="h-px w-0 bg-blue-400 group-hover:w-4 mr-2 transition-all duration-300"></span>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Company</h4>
              <ul className="space-y-3">
                {[
                  "About Us",
                  "Careers",
                  "Privacy Policy",
                  "Terms of Service",
                  "Contact",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="hover:text-white transition-colors flex items-center group text-sm"
                    >
                      <span className="h-px w-0 bg-indigo-400 group-hover:w-4 mr-2 transition-all duration-300"></span>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-gray-800 text-sm text-center">
            <p>
              © {new Date().getFullYear()} JobMatch AI. All rights reserved.
            </p>
          </div>
        </footer>
      </div>

      {/* Global Styles */}
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
    </div>
  );
}
