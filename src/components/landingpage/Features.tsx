"use client";
import React, { useEffect, useRef } from "react";
import Tilt from "react-parallax-tilt";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import { Bot, BrainCircuit, GraduationCap, ChartLine } from "lucide-react";
import { JSX } from "react/jsx-runtime";

gsap.registerPlugin(ScrollTrigger);

interface Feature {
  icon: JSX.Element;
  title: string;
  description: string;
  color: string;
  gradient: string;
}

const features: Feature[] = [
  {
    icon: <Bot />,
    title: "AI-Powered Matching",
    description:
      "Our advanced algorithms analyze your skills and experience to find the perfect job matches.",
    color: "#3B82F6", // Blue accent
    gradient: "from-blue-400 to-purple-500",
  },
  {
    icon: <BrainCircuit />,
    title: "ATS Optimization",
    description:
      "Get real-time suggestions to improve your resume and pass ATS scanning systems.",
    color: "#10B981", // Green accent
    gradient: "from-blue-400 to-purple-500",
  },
  {
    icon: <GraduationCap />,
    title: "Learning Paths",
    description:
      "Personalized learning recommendations to help you acquire in-demand skills.",
    color: "#8B5CF6", // Purple accent
    gradient: "from-blue-400 to-purple-500",
  },
  {
    icon: <ChartLine />,
    title: "Career Tracking",
    description:
      "Track your application progress and get insights to improve your success rate.",
    color: "#EF4444", // Red accent
    gradient: "from-blue-400 to-purple-500",
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  useEffect(() => {
    if (cardsRef.current.length) {
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center",
          },
        }
      );
    }
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-black" id="features">
      {/* Gradient Border Top */}
      <div className="absolute top-0 left-0 right-0 h-px opacity-20 bg-gradient-to-r from-transparent via-blue-500 to-purple-500"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Why Choose JobMatch
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Our platform combines cutting-edge technology with personalized
            support to help you land your dream job.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Tilt
              key={index}
              tiltMaxAngleX={12}
              tiltMaxAngleY={12}
              perspective={1000}
              scale={1.02}
              transitionSpeed={400}
              glareEnable={false}
            >
              <div
                ref={addToRefs}
                className="relative p-6 rounded-xl overflow-hidden custom-card"
              >
                <div className="relative z-10">
                  <div className="p-3 bg-blue-500/10 rounded-xl w-fit mb-4">
                    {React.cloneElement(feature.icon, {
                      className:
                        "w-8 h-8 text-blue-400 transform group-hover:scale-110 transition-all duration-300",
                    })}
                  </div>
                  <h3
                    className={`text-xl font-bold mb-3 bg-gradient-to-r ${feature.gradient} text-transparent bg-clip-text`}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              </div>
            </Tilt>
          ))}
        </div>
        {/* Gradient Border Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-px opacity-20 bg-gradient-to-r from-transparent via-blue-500 to-purple-500"></div>
      </div>
    </section>
  );
}
