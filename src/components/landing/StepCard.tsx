"use client";

import { ArrowRight } from "lucide-react";

interface StepData {
  number: number;
  title: string;
  description: string;
  learnMore: string;
  color: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

interface StepCardProps {
  step: StepData;
  isEven: boolean;
}

export default function StepCard({ step, isEven }: StepCardProps) {
  return (
    <div className="relative grid lg:grid-cols-2 gap-12 items-center">
      <div
        className={`lg:${isEven ? "pl" : "pr"}-12 order-${
          isEven ? "first" : "last"
        } lg:order-${isEven ? "last" : "first"}`}
      >
        <div className="flex items-start gap-6">
          <div
            className={`w-14 h-14 rounded-full bg-gradient-to-br ${step.color} text-white flex items-center justify-center font-bold text-xl flex-shrink-0`}
          >
            {step.number}
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              {step.description}
            </p>
            <button className="inline-flex items-center text-purple-600 dark:text-purple-400 font-medium group">
              {step.learnMore}
              <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-b  from-gray-100 to-white dark:from-gray-950 dark:to-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
        {step.content}
      </div>
    </div>
  );
}
