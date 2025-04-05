"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CallToAction() {
  useGSAP(() => {
    gsap.from(".cta-container", {
      scrollTrigger: {
        trigger: ".cta-container",
        start: "top 80%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
    });
  });

  return (
    <section className="py-16 md:py-24 bg-light-card dark:bg-dark-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="cta-container bg-gradient-to-r from-light-primary to-light-secondary dark:from-dark-primary dark:to-dark-secondary rounded-2xl p-8 md:p-12 text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Ready to Find Your Perfect Job Match?
          </motion.h2>
          <motion.p
            className="text-xl text-white opacity-90 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Join thousands of professionals who found their dream jobs with our
            AI-powered matching system.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              href="/signup"
              className="px-8 py-3 rounded-lg bg-white text-light-primary font-medium hover:bg-opacity-90 transition-opacity shadow-lg"
            >
              Get Started for Free
            </Link>
            <Link
              href="#how-it-works"
              className="px-8 py-3 rounded-lg border border-white text-white font-medium hover:bg-white hover:bg-opacity-10 transition-colors"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
