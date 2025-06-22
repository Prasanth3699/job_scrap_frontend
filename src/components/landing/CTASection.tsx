"use client";

import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative py-24 px-6 bg-gradient-to-tr from-indigo-700 via-purple-700 to-blue-700 dark:from-indigo-800 dark:via-purple-800 dark:to-blue-800 text-white overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white rounded-full filter blur-3xl opacity-10"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-400 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6">
          Ready to Find Your Perfect Job Match?
        </h2>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Join thousands of professionals who accelerated their careers with our
          AI matching technology
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
  );
}
