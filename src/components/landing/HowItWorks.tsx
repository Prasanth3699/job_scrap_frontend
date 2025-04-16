"use client";

import { FileInput, Sparkles, Target } from "lucide-react";
import StepCard from "./StepCard";

export default function HowItWorks() {
  const matches = [
    {
      title: "Senior Software Engineer",
      company: "Tech Corp",
      location: "Remote",
      salary: "$120k - $150k",
      match: "95",
    },
    {
      title: "Full Stack Developer",
      company: "StartUp Inc",
      location: "New York",
      salary: "$100k - $130k",
      match: "88",
    },
    {
      title: "Frontend Engineer",
      company: "Digital Solutions",
      location: "San Francisco",
      salary: "$110k - $140k",
      match: "82",
    },
  ];

  const steps = [
    {
      number: 1,
      title: "Upload Your Resume",
      description:
        "Simply upload your resume in any common format. Our system extracts and organizes all relevant information including skills, experience, education, and accomplishments with contextual understanding.",
      learnMore: "Learn more about our parsing technology",
      color: "from-purple-600 to-blue-600",
      icon: "upload",
      content: (
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-purple-100/50 dark:bg-purple-900/20 flex items-center justify-center">
              <FileInput className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="font-medium">File Upload</span>
          </div>
          <div className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg p-8 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/30">
            <div className="w-16 h-16 rounded-full bg-purple-100/50 dark:bg-purple-900/20 flex items-center justify-center mb-4">
              <FileInput className="h-7 w-7 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-2 font-medium">
              Drag and drop your resume here
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              or click to browse files
            </p>
          </div>
        </div>
      ),
    },
    {
      number: 2,
      title: "Select Job Preferences",
      description:
        "Choose from our extensive database of job titles or describe your ideal role. Select multiple preferences to help our AI understand your career interests and priorities.",
      learnMore: "Explore our job categories",
      color: "from-blue-600 to-indigo-600",
      icon: "target",
      content: (
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100/50 dark:bg-blue-900/20 flex items-center justify-center">
              <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="font-medium">Job Selection</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              "Software Engineer",
              "UX Designer",
              "Product Manager",
              "Data Analyst",
              "Marketing Lead",
              "DevOps Engineer",
              "Sales Director",
              "QA Specialist",
            ].map((job, index) => (
              <button
                key={job}
                className={`px-4 py-3 rounded-lg border transition-all hover:shadow-sm text-left ${
                  index < 2
                    ? "border-purple-500 bg-purple-50/50 dark:bg-purple-900/10"
                    : "border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500/50"
                }`}
              >
                {job}
              </button>
            ))}
          </div>
        </div>
      ),
    },
    {
      number: 3,
      title: "Get Personalized Matches",
      description:
        "Our AI compares your profile with thousands of job opportunities, ranking them based on skills match, culture fit, salary expectation, and growth potential with actionable insights.",
      learnMore: "See sample matching report",
      color: "from-indigo-600 to-blue-600",
      icon: "sparkles",
      content: (
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100/50 dark:bg-indigo-900/20 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="font-medium">Your Top Matches</span>
          </div>
          <div className="space-y-3">
            {matches.map((job, index) => (
              <MatchJobItem key={index} job={job} />
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-6 bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Our three-step process simplifies finding your perfect career match
          </p>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="hidden lg:block absolute left-1/2 top-0 h-full w-1 bg-gradient-to-b from-purple-500 via-indigo-500 to-blue-500 -ml-[2px] rounded-full"></div>

          {/* Steps */}
          <div className="space-y-20 lg:space-y-32">
            {steps.map((step, index) => (
              <StepCard
                key={step.number}
                step={step}
                isEven={index % 2 === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MatchJobItem({ job }: { job: any }) {
  return (
    <div className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-sm transition-all">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-gray-800 dark:text-gray-100">
            {job.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {job.company} • {job.location}
          </p>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {job.salary}
          </p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            parseInt(job.match) > 90
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : parseInt(job.match) > 80
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
              : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
          }`}
        >
          {job.match} match
        </span>
      </div>
    </div>
  );
}
