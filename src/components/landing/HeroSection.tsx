"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import DemoCard from "./DemoCard";
import { forwardRef } from "react";

const HeroSection = forwardRef<HTMLDivElement>(function HeroSection(_, ref) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const handleBrowseJobs = () => {
    router.push("/jobs");
    gsap.to(containerRef.current, {
      opacity: 0.5,
      duration: 0.3,

      onComplete: () => {
        router.push("/jobs");
      },
    });
  };
  return (
    <section ref={ref} className=" pb-20 px-6 dark:bg-black">
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
            Let our advanced machine learning analyze your resume and preferred
            jobs to find your perfect career match with{" "}
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
            <button
              onClick={handleBrowseJobs}
              className="group px-8 py-4 bg-transparent border border-white/20 text-white text-lg font-semibold rounded-full hover:border-white/40 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
            >
              <span className="flex items-center justify-center gap-2">
                Browse Jobs
                <svg
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </span>
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
          <DemoCard />
        </div>
      </div>
    </section>
  );
});

export default HeroSection;
