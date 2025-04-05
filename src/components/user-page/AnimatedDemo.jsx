"use client";
import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FileText, Briefcase, Cpu, Star, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedDemo() {
  const containerRef = useRef(null);
  const documentRef = useRef(null);
  const jobRef = useRef(null);
  const aiRef = useRef(null);
  const resultsRef = useRef(null);
  const arrowsRef = useRef([]);

  useGSAP(
    () => {
      // Timeline for the animation sequence
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          toggleActions: "play none none none",
        },
      });

      // Animation sequence
      tl.from(documentRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "power3.out",
      })
        .from(arrowsRef.current[0], {
          opacity: 0,
          x: -20,
          duration: 0.5,
        })
        .from(jobRef.current, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: "power3.out",
        })
        .from(arrowsRef.current[1], {
          opacity: 0,
          x: -20,
          duration: 0.5,
        })
        .from(aiRef.current, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: "power3.out",
        })
        .from(arrowsRef.current[2], {
          opacity: 0,
          x: -20,
          duration: 0.5,
        })
        .from(resultsRef.current, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: "power3.out",
        });

      // Continuous pulse animation for AI box
      gsap.to(aiRef.current.querySelector(".pulse-element"), {
        scale: 1.05,
        opacity: 0.8,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: containerRef }
  );

  return (
    <section className="py-16 md:py-24 bg-light-background dark:bg-dark-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text mb-4">
            See It In Action
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-light-text dark:text-dark-text opacity-90">
            Watch how our AI processes your information to deliver the best
            results
          </p>
        </div>

        <div
          ref={containerRef}
          className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8"
        >
          {/* Resume Upload */}
          <motion.div
            ref={documentRef}
            className="w-full md:w-1/4 p-6 rounded-xl bg-light-card dark:bg-dark-card shadow-sm text-center"
            whileHover={{ scale: 1.03 }}
          >
            <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900 bg-opacity-50 mb-4 inline-block">
              <FileText
                size={32}
                className="text-blue-500 dark:text-blue-400"
              />
            </div>
            <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-2">
              Your Resume
            </h3>
            <p className="text-sm text-light-text dark:text-dark-text opacity-80">
              Upload your resume in any format
            </p>
          </motion.div>

          {/* Arrow */}
          <div
            ref={(el) => (arrowsRef.current[0] = el)}
            className="hidden md:block text-gray-400 rotate-90 md:rotate-0"
          >
            <ChevronRight size={32} />
          </div>

          {/* Job Selection */}
          <motion.div
            ref={jobRef}
            className="w-full md:w-1/4 p-6 rounded-xl bg-light-card dark:bg-dark-card shadow-sm text-center"
            whileHover={{ scale: 1.03 }}
          >
            <div className="p-4 rounded-full bg-emerald-100 dark:bg-emerald-900 bg-opacity-50 mb-4 inline-block">
              <Briefcase
                size={32}
                className="text-emerald-500 dark:text-emerald-400"
              />
            </div>
            <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-2">
              Job Openings
            </h3>
            <p className="text-sm text-light-text dark:text-dark-text opacity-80">
              Select target job positions
            </p>
          </motion.div>

          {/* Arrow */}
          <div
            ref={(el) => (arrowsRef.current[1] = el)}
            className="hidden md:block text-gray-400 rotate-90 md:rotate-0"
          >
            <ChevronRight size={32} />
          </div>

          {/* AI Processing */}
          <motion.div
            ref={aiRef}
            className="w-full md:w-1/4 p-6 rounded-xl bg-gradient-to-br from-light-primary to-light-secondary dark:from-dark-primary dark:to-dark-secondary shadow-sm text-center relative overflow-hidden"
            whileHover={{ scale: 1.03 }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="pulse-element absolute inset-0 bg-white dark:bg-black opacity-10 rounded-xl"></div>
            </div>
            <div className="p-4 rounded-full bg-white bg-opacity-20 mb-4 inline-block">
              <Cpu size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              AI Processing
            </h3>
            <p className="text-sm text-white opacity-90">
              Our ML algorithm analyzes and matches
            </p>
          </motion.div>

          {/* Arrow */}
          <div
            ref={(el) => (arrowsRef.current[2] = el)}
            className="hidden md:block text-gray-400 rotate-90 md:rotate-0"
          >
            <ChevronRight size={32} />
          </div>

          {/* Results */}
          <motion.div
            ref={resultsRef}
            className="w-full md:w-1/4 p-6 rounded-xl bg-light-card dark:bg-dark-card shadow-sm text-center"
            whileHover={{ scale: 1.03 }}
          >
            <div className="p-4 rounded-full bg-amber-100 dark:bg-amber-900 bg-opacity-50 mb-4 inline-block">
              <Star size={32} className="text-amber-500 dark:text-amber-400" />
            </div>
            <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-2">
              Match Results
            </h3>
            <p className="text-sm text-light-text dark:text-dark-text opacity-80">
              Get ranked matches and improvement tips
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
