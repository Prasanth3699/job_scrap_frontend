"use client";

import { LayoutDashboard } from "lucide-react";
import FeatureCard from "./FeatureCard";

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-6 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
            AI-Powered Job Matching
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Our proprietary machine learning analyzes hundreds of data points
            across skills, experience, and preferences to find your perfect
            career match
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<LayoutDashboard className="h-7 w-7" />}
            title="Smart Analysis"
            description="We extract and interpret every relevant detail from your resume beyond just keywords, understanding context, skills hierarchy, and industry nuances."
            color="purple"
          />
          <FeatureCard
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-7 w-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            }
            title="Ranked Matches"
            description="Get intelligently ranked job suggestions based on skills compatibility, culture fit, salary expectations, and long-term growth potential."
            color="blue"
          />
          <FeatureCard
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-7 w-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            }
            title="Privacy Focused"
            description="Your data is encrypted end-to-end, never shared without consent, with full GDPR and CCPA compliance. Delete anytime."
            color="green"
          />
        </div>
      </div>
    </section>
  );
}
