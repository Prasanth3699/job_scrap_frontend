"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FileText, Target, BarChart, Zap, Shield, Globe } from "lucide-react";
import { motion } from "framer-motion";
import React, { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: FileText,
    title: "Resume Parsing",
    description: "Extract key information from your resume with high accuracy",
  },
  {
    icon: Target,
    title: "Precision Matching",
    description: "Advanced algorithms match your skills with job requirements",
  },
  {
    icon: BarChart,
    title: "Compatibility Scoring",
    description: "Get a clear score showing how well you match each position",
  },
  {
    icon: Zap,
    title: "Keyword Optimization",
    description:
      "Identify missing keywords to improve your resume for specific jobs",
  },
  {
    icon: Shield,
    title: "Skill Gap Analysis",
    description: "Discover which skills you need to develop for your dream job",
  },
  {
    icon: Globe,
    title: "Industry Trends",
    description: "See what skills are in demand for your target roles",
  },
];

export default function Features() {
  const containerRef = useRef(null);
  const featureRefs = useRef([]);

  useGSAP(
    () => {
      // Animate features on scroll
      featureRefs.current.forEach((feature, index) => {
        gsap.from(feature, {
          scrollTrigger: {
            trigger: feature,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 50,
          duration: 0.8,
          delay: index * 0.1,
          ease: "power3.out",
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      id="features"
      className="py-16 md:py-24 bg-light-card dark:bg-dark-card"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text mb-4">
            Powerful Features
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-light-text dark:text-dark-text opacity-90">
            Everything you need to optimize your resume and land your dream job
          </p>
        </div>

        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              ref={(el) => (featureRefs.current[index] = el)}
              className="p-8 rounded-xl bg-light-background dark:bg-dark-background shadow-sm hover:shadow-md transition-shadow"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-light-primary dark:bg-dark-primary bg-opacity-10 text-light-primary dark:text-dark-primary">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-semibold text-light-text dark:text-dark-text ml-4">
                  {feature.title}
                </h3>
              </div>
              <p className="text-light-text dark:text-dark-text opacity-80">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
