"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Upload, Search, Bot, BarChart2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  useGSAP(() => {
    gsap.from(".hero-title", {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });

    gsap.from(".hero-subtitle", {
      y: 30,
      opacity: 0,
      duration: 1,
      delay: 0.3,
      ease: "power3.out",
    });

    gsap.from(".hero-cta", {
      y: 30,
      opacity: 0,
      duration: 1,
      delay: 0.6,
      ease: "power3.out",
    });

    gsap.from(".hero-feature", {
      y: 30,
      opacity: 0,
      duration: 1,
      delay: 0.9,
      stagger: 0.2,
      ease: "power3.out",
    });
  });

  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h1
            className="hero-title text-4xl md:text-6xl font-bold text-light-text dark:text-dark-text mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="bg-gradient-to-r from-light-primary to-light-secondary dark:from-dark-primary dark:to-dark-secondary bg-clip-text text-transparent">
              AI-Powered
            </span>{" "}
            Resume Matching
          </motion.h1>

          <motion.p
            className="hero-subtitle max-w-3xl mx-auto text-lg md:text-xl text-light-text dark:text-dark-text opacity-90 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Upload your resume, get matched with the perfect jobs, and receive
            personalized improvement suggestions—all powered by advanced machine
            learning.
          </motion.p>

          <motion.div
            className="hero-cta flex flex-col sm:flex-row justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              href="/dashboard"
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-light-primary to-light-secondary dark:from-dark-primary dark:to-dark-secondary text-white font-medium hover:opacity-90 transition-opacity shadow-lg"
            >
              Get Started - It's Free
            </Link>
            <Link
              href="#how-it-works"
              className="px-8 py-3 rounded-lg border border-light-primary dark:border-dark-primary text-light-primary dark:text-dark-primary font-medium hover:bg-light-background dark:hover:bg-dark-background transition-colors"
            >
              How It Works
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Upload, text: "Upload Resume" },
              { icon: Search, text: "Select Jobs" },
              { icon: Bot, text: "AI Matching" },
              { icon: Sparkles, text: "Get Results" },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="hero-feature flex flex-col items-center p-4 rounded-xl bg-light-card dark:bg-dark-card shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <item.icon
                  size={32}
                  className="text-light-primary dark:text-dark-primary mb-2"
                />
                <p className="text-sm font-medium text-light-text dark:text-dark-text">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
