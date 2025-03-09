"use client";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import gsap from "gsap";

export default function Stats() {
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  const stats = [
    {
      number: 10000,
      label: "Active Jobs",
      suffix: "+",
      gradient: "from-blue-400 to-purple-500",
    },
    {
      number: 5000,
      label: "Partner Companies",
      suffix: "+",
      gradient: "from-purple-400 to-blue-500",
    },
    {
      number: 25000,
      label: "Success Stories",
      suffix: "+",
      gradient: "from-blue-400 to-purple-500",
    },
    {
      number: 95,
      label: "Success Rate",
      suffix: "%",
      gradient: "from-purple-400 to-blue-500",
    },
  ];

  useEffect(() => {
    if (inView) {
      gsap.from(".stat-item", {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.3,
        ease: "back.out(1.7)",
      });
    }
  }, [inView]);

  return (
    <section ref={ref} className="py-20 bg-black relative" id="stats">
      {/* Gradient Border Top */}
      <div className="absolute top-0 left-0 right-0 h-px opacity-20 bg-gradient-to-r from-transparent via-blue-500 to-purple-500"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-item text-center p-6 rounded-xl border border-gray-800 backdrop-blur-sm relative overflow-hidden group"
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  scale: 1.05,
                  duration: 0.3,
                  ease: "power3.out",
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  scale: 1,
                  duration: 0.3,
                  ease: "power3.out",
                });
              }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </div>

              <div
                className={`text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r ${stat.gradient} text-transparent bg-clip-text`}
              >
                {inView && (
                  <CountUp
                    end={stat.number}
                    duration={2.5}
                    suffix={stat.suffix}
                  />
                )}
              </div>
              <div className="text-xl text-gray-300 group-hover:text-white transition-colors duration-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gradient Border Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px opacity-20 bg-gradient-to-r from-transparent via-blue-500 to-purple-500"></div>
    </section>
  );
}
