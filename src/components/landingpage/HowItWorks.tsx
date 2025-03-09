"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import {
  UserRoundPen,
  MousePointerClick,
  BrainCog,
  Sparkles,
} from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      number: "01",
      title: "Create Your Profile",
      description:
        "Upload your resume and complete your profile with your skills and preferences.",
      icon: <UserRoundPen className="h-4 w-4" />,
      gradient: "from-blue-400 to-purple-500",
    },
    {
      number: "02",
      title: "Get Matched",
      description:
        "Our AI analyzes your profile and matches you with the most suitable jobs.",
      icon: <Sparkles className="h-4 w-4" />,
      gradient: "from-purple-400 to-blue-500",
    },
    {
      number: "03",
      title: "Optimize Application",
      description:
        "Receive personalized suggestions to improve your resume and application.",
      icon: <BrainCog className="h-4 w-4" />,
      gradient: "from-blue-400 to-purple-500",
    },
    {
      number: "04",
      title: "Apply & Track",
      description:
        "Apply to jobs with confidence and track your application progress.",
      icon: <MousePointerClick className="h-4 w-4" />,
      gradient: "from-purple-400 to-blue-500",
    },
  ];

  // Scroll-triggered animation for grid items
  useEffect(() => {
    // Select all elements with the "animate-on-scroll" class
    const gridItems = gsap.utils.toArray(".animate-on-scroll");
    gridItems.forEach((item) => {
      return gsap.fromTo(
        item as HTMLElement,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: item as HTMLElement,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-black overflow-hidden"
      id="how-it-works"
    >
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            How It Works
          </h2>
          <p className="mt-2 text-xl text-gray-300">
            Simple steps to start your career journey
          </p>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <GridItem
              key={index}
              area=""
              icon={step.icon}
              title={step.title}
              description={step.description}
              gradient={step.gradient}
            />
          ))}
        </ul>
      </div>
      {/* Gradient Border Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px opacity-20 bg-gradient-to-r from-transparent via-blue-500 to-purple-500"></div>
    </section>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: React.ReactNode;
  gradient: string;
}

const GridItem = ({
  area,
  icon,
  title,
  description,
  gradient,
}: GridItemProps) => {
  return (
    <li className={`animate-on-scroll min-h-[14rem] list-none ${area}`}>
      <div className="relative h-full rounded-2.5xl border border-gray-800/50 p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="relative flex h-full flex-col gap-4 overflow-hidden rounded-xl border border-gray-800/50 p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="relative flex flex-col gap-3">
            <div className="p-3 bg-blue-500/10 rounded-xl w-fit mb-4">
              {React.cloneElement(icon, {
                className:
                  "w-8 h-8 text-blue-400 transform group-hover:scale-110 transition-all duration-300",
              })}
            </div>
            <div className="space-y-2">
              <h3
                className={`text-xl font-bold bg-gradient-to-r ${gradient} text-transparent bg-clip-text`}
              >
                {title}
              </h3>
              <p className="text-sm text-gray-300 md:text-base">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
