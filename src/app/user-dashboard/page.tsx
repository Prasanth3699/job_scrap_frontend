"use client";
import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Hero from "@/components/landingpage/Hero";
import Features from "@/components/landingpage/Features";
import HowItWorks from "@/components/landingpage/HowItWorks";
import Stats from "@/components/landingpage/Stats";
import Navbar from "@/components/landingpage/NavBar";
import Footer from "@/components/landingpage/Footer";
import LoadingSpinner from "@/components/landingpage/LoadingSpinner";
import MLAnimation from "@/components/landingpage/MLAnimation";
import JobMatchingProcess from "@/components/landingpage/JobMatchingProcess";
import { Toaster } from "sonner";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize animations
    const ctx = gsap.context(() => {
      // Smooth scroll animations
      gsap.from(".section", {
        opacity: 0,
        y: 100,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".section",
          start: "top center+=100",
          toggleActions: "play none none reverse",
        },
      });
    });

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => ctx.revert();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="relative">
      <Toaster position="top-center" />
      <div className="fixed w-full z-50">
        <Navbar />
      </div>

      {/* Container for all sections */}
      <div className="relative">
        {/* Hero Section */}
        <div className="relative h-screen">
          <Hero />
        </div>

        {/* Content Sections */}
        <div className="relative bg-black z-10">
          {/* <section className="section">
            <MLAnimation />
          </section> */}

          <section className="section">
            <Features />
          </section>

          <section className="section ">
            <HowItWorks />
          </section>

          <section className="section">
            <JobMatchingProcess />
          </section>

          <section className="section">
            <Stats />
          </section>

          <footer className="relative z-10">
            <Footer />
          </footer>
        </div>
      </div>
    </div>
  );
}
