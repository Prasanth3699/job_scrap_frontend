"use client";

import TrustItem from "./TrustItem";

export default function TrustIndicators() {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800">
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
          <TrustItem
            icon={
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            }
            title="Enterprise Security"
            description="Military-grade encryption with SOC 2 Type II compliance protects your data at every step"
            color="purple"
          />
          <TrustItem
            icon={
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            }
            title="250K+ Professionals"
            description="Join a growing community of career-driven individuals across 150+ countries"
            color="blue"
          />
          <TrustItem
            icon={
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            }
            title="94% Accuracy"
            description="Industry-leading match precision powered by GPT-4 AI and proprietary algorithms"
            color="green"
          />
        </div>
      </div>
    </section>
  );
}
