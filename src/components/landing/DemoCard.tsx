"use client";

import { FileInput, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import MatchJobItem from "./MatchJobItem";

const jobs = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "UI Designer",
  "UX Designer",
  "Product Manager",
  "DevOps Engineer",
  "Data Scientist",
];

export default function DemoCard() {
  const demoCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!demoCardRef.current) return;

    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: 1.5,
      defaults: { ease: "power3.inOut" },
    });

    // Initial state reset
    tl.set(demoCardRef.current.querySelectorAll("*"), { opacity: 0, y: 20 });

    // Upload state
    tl.to(demoCardRef.current.querySelectorAll(".upload-section > *"), {
      opacity: 1,
      y: 0,
      stagger: 0.15,
      duration: 0.5,
    })
      .to(
        demoCardRef.current,
        {
          backgroundColor: "var(--demo-card-bg)",
          duration: 0.3,
        },
        "<"
      )
      .delay(2)

      // Processing state
      .to(demoCardRef.current.querySelectorAll(".upload-section > *"), {
        opacity: 0,
        y: -20,
        stagger: 0.1,
        duration: 0.4,
      })
      .to(
        demoCardRef.current,
        {
          backgroundColor: "var(--demo-card-processing-bg)",
          duration: 0.3,
        },
        "<"
      )
      .fromTo(
        demoCardRef.current.querySelectorAll(".processing > *"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 0.5 }
      )
      .to(demoCardRef.current.querySelector(".spinner"), {
        rotation: 360,
        duration: 2,
        ease: "none",
        repeat: 1,
      })
      .delay(3)

      // Job selection state
      .to(demoCardRef.current.querySelectorAll(".processing > *"), {
        opacity: 0,
        y: -20,
        duration: 0.4,
      })
      .to(
        demoCardRef.current,
        {
          backgroundColor: "var(--demo-card-bg)",
          duration: 0.3,
        },
        "<"
      )
      .fromTo(
        demoCardRef.current.querySelectorAll(".job-selection > *"),
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, stagger: 0.1, duration: 0.5 }
      )
      .delay(4)

      // Results state
      .to(demoCardRef.current.querySelectorAll(".job-selection > *"), {
        opacity: 0,
        scale: 0.9,
        duration: 0.4,
      })
      .to(
        demoCardRef.current,
        {
          backgroundColor: "var(--demo-card-processing-bg)",
          duration: 0.3,
        },
        "<"
      )
      .fromTo(
        demoCardRef.current.querySelectorAll(".results > *"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 }
      )
      .delay(5);

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={demoCardRef}
      className="relative bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 transform hover:scale-[1.02] transition-all duration-300 h-[500px] w-full max-w-md overflow-hidden"
    >
      <div className="space-y-6 h-full flex flex-col">
        <h3 className="text-2xl font-bold">Find Your Dream Job</h3>

        <div className="flex-1 flex flex-col items-center justify-center relative">
          {/* Upload State */}
          <div className="upload-section text-center space-y-4 absolute inset-0 flex flex-col items-center justify-center p-6">
            <div className="p-4 bg-purple-100/50 dark:bg-purple-900/20 rounded-full mb-4">
              <FileInput className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">
                <span className="font-medium text-purple-600 dark:text-purple-400">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                PDF, DOCX, TXT formats (max. 5MB)
              </p>
            </div>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-2 rounded-lg transition-all">
              Upload Resume
            </button>
          </div>

          {/* Processing State */}
          <div className="processing absolute inset-0 flex flex-col items-center justify-center p-6 opacity-0">
            <div className="p-4 bg-purple-100/50 dark:bg-purple-900/20 rounded-full mb-4">
              <Loader2 className="h-8 w-8 text-purple-600 dark:text-purple-400 animate-spin spinner" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 mt-4 text-lg">
              Analyzing your resume...
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              This usually takes about 30 seconds
            </p>
          </div>

          {/* Job Selection State */}
          <div className="job-selection absolute inset-0 p-6 opacity-0 flex极速赛车开奖直播 flex-col">
            <h4 className="font-bold text-lg mb-4">
              Select Job Titles That Interest You
            </h4>
            <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto pb-4">
              {jobs.map((job) => (
                <JobButton
                  key={job}
                  job={job}
                  isHighlighted={jobs.indexOf(job) < 2}
                />
              ))}
            </div>
          </div>

          {/* Results State */}
          <ResultsSection />
        </div>
      </div>
    </div>
  );
}

function JobButton({
  job,
  isHighlighted,
}: {
  job: string;
  isHighlighted: boolean;
}) {
  return (
    <button
      className={`px-4 py-3 rounded-lg border transition-all hover:shadow-sm ${
        isHighlighted
          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/10"
          : "border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500/50"
      }`}
    >
      {job}
    </button>
  );
}

function ResultsSection() {
  const matches = [
    {
      title: "Senior Frontend Developer",
      company: "Tech Innovations Inc.",
      match: "94%",
      salary: "$120K - $150K",
      location: "Remote",
    },
    {
      title: "UI/UX Engineer",
      company: "Digital Creations LLC",
      match: "87%",
      salary: "$100K - $135K",
      location: "San Francisco, CA, USA",
    },
    {
      title: "Product Designer",
      company: "Creative Labs",
      match: "82%",
      salary: "$95K - $125K",
      location: "New York, NY, USA",
    },
  ];

  return (
    <div className="results absolute inset-0 p-6 opacity-0 flex flex-col items-center justify-center">
      <div className="w-20 h-20 mb-4 bg-purple-100/50 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
        <svg
          className="w-10 h-10 text-purple-600 dark:text-purple-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h3 className="text-2xl font-bold mb-2 text-center">
        Analysis Complete!
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Here are your top matches:
      </p>
      <div className="space-y-3 w-full max-w-xs">
        {matches.map((job, index) => (
          <MatchJobItem key={index} job={job} />
        ))}
      </div>
    </div>
  );
}
