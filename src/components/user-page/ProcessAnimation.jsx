"use client";
import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Upload,
  Search,
  Bot,
  BarChart2,
  Sparkles,
  ChevronRight,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function ProcessAnimation() {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const stepsRef = useRef([]);

  useGSAP(
    () => {
      // Animate steps on scroll
      stepsRef.current.forEach((step, index) => {
        gsap.from(step, {
          scrollTrigger: {
            trigger: step,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 50,
          duration: 0.8,
          delay: index * 0.2,
          ease: "power3.out",
        });
      });

      // Animate SVG path drawing
      const paths = svgRef.current.querySelectorAll("path");
      paths.forEach((path) => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;

        gsap.to(path, {
          scrollTrigger: {
            trigger: path,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          strokeDashoffset: 0,
          duration: 1.5,
          ease: "power3.out",
        });
      });

      // Animate circles
      const circles = svgRef.current.querySelectorAll("circle");
      circles.forEach((circle) => {
        gsap.from(circle, {
          scrollTrigger: {
            trigger: circle,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          r: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
        });
      });
    },
    { scope: containerRef }
  );

  const steps = [
    {
      icon: Upload,
      title: "Upload Your Resume",
      description:
        "Simply upload your resume in any common format (PDF, DOCX, etc.)",
      color: "text-blue-500",
    },
    {
      icon: Search,
      title: "Select Job Openings",
      description:
        "Choose from available job postings or paste job descriptions",
      color: "text-emerald-500",
    },
    {
      icon: Bot,
      title: "AI Matching Process",
      description:
        "Our ML algorithm analyzes and matches your resume with the best jobs",
      color: "text-violet-500",
    },
    {
      icon: BarChart2,
      title: "Get Match Results",
      description: "Receive ranked job matches with compatibility scores",
      color: "text-amber-500",
    },
    {
      icon: Sparkles,
      title: "Advanced Analysis",
      description:
        "Get keyword suggestions, skill gaps, and improvement guidance",
      color: "text-pink-500",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-16 md:py-24 bg-light-background dark:bg-dark-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text mb-4">
            How It Works
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-light-text dark:text-dark-text opacity-90">
            Our advanced AI analyzes your resume and job requirements to find
            the perfect match and provide actionable insights.
          </p>
        </div>

        <div ref={containerRef} className="relative">
          {/* SVG Animation */}
          <div className="hidden md:block absolute inset-0 h-full w-full">
            <svg
              ref={svgRef}
              width="100%"
              height="100%"
              viewBox="0 0 1200 400"
              preserveAspectRatio="none"
              className="h-full w-full"
            >
              {/* Main path */}
              <path
                d="M100,200 Q300,100 500,200 T900,200"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="1000"
                strokeDashoffset="1000"
                className="text-gray-200 dark:text-gray-800"
              />

              {/* Connection lines to steps */}
              {steps.map((_, i) => {
                const x = 100 + i * 200;
                return (
                  <path
                    key={`connector-${i}`}
                    d={`M${x},200 V300`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="1000"
                    strokeDashoffset="1000"
                    className="text-gray-200 dark:text-gray-800"
                  />
                );
              })}

              {/* Circles at each step */}
              {steps.map((_, i) => {
                const x = 100 + i * 200;
                return (
                  <circle
                    key={`circle-${i}`}
                    cx={x}
                    cy="200"
                    r="8"
                    fill="currentColor"
                    className="text-light-primary dark:text-dark-primary"
                  />
                );
              })}
            </svg>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-5 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div
                key={index}
                ref={(el) => (stepsRef.current[index] = el)}
                className="flex flex-col items-center text-center p-6 bg-light-card dark:bg-dark-card rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className={`p-4 rounded-full bg-opacity-10 ${step.color} bg-current mb-4`}
                >
                  <step.icon size={32} className={step.color} />
                </div>
                <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-light-text dark:text-dark-text opacity-80">
                  {step.description}
                </p>
                {index < steps.length - 1 && (
                  <div className="md:hidden mt-4 text-gray-400">
                    <ChevronRight size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
