"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import * as THREE from "three";
import { motion, useScroll, useTransform } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay, Pagination } from "swiper/modules";
import anime from "animejs";

// Styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

const jobCategories = [
  {
    title: "Software Development",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    count: 2345,
    trend: "+15%",
    description: "Build the future of technology",
    skills: ["React", "Node.js", "Python", "Java"],
    companies: ["Google", "Microsoft", "Amazon"],
  },
  {
    title: "Data Science",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    count: 1890,
    trend: "+25%",
    description: "Transform data into insights",
    skills: ["Python", "R", "SQL", "Machine Learning"],
    companies: ["IBM", "Facebook", "Netflix"],
  },
  // Add more categories...
];

const latestJobs = [
  {
    id: 1,
    company: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2048px-Google_%22G%22_Logo.svg.png",
    position: "Software Engineer",
    location: "Bangalore",
    salary: "₹12-18 LPA",
    type: "Full-time",
    posted: "2 hours ago",
    skills: ["Python", "React", "Node.js"],
    description: "Join our team to build next-generation products",
    requirements: [
      "B.Tech/M.Tech in Computer Science",
      "0-2 years experience",
      "Strong problem-solving skills",
    ],
  },
  // Add more jobs...
];

const successStories = [
  {
    name: "Priya Sharma",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    company: "Microsoft",
    role: "Frontend Developer",
    story: "Found my dream job within 2 weeks!",
    salary: "12 LPA",
    timeline: "2 months",
    background: "Fresh Graduate",
  },
  // Add more stories...
];

export default function ModernLanding() {
  const containerRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const { scrollYProgress } = useScroll();
  const backgroundRef = useRef();

  useEffect(() => {
    // GSAP Animations
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Three.js Background
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    backgroundRef.current.appendChild(renderer.domElement);

    // Create animated particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 5000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 5;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.005,
      color: "#9333ea",
      blending: THREE.AdditiveBlending,
    });

    const particlesMesh = new THREE.Points(
      particlesGeometry,
      particlesMaterial
    );
    scene.add(particlesMesh);
    camera.position.z = 2;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      particlesMesh.rotation.y += 0.001;
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Background */}
      <div ref={backgroundRef} className="fixed inset-0 -z-10" />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed w-full z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              JobPortal
            </div>
            <div className="hidden md:flex space-x-8">
              {["Home", "Jobs", "Companies", "About"].map((item, index) => (
                <button key={index} className="relative group px-4 py-2">
                  <span className="relative z-10 text-gray-300 group-hover:text-white transition-colors">
                    {item}
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black" />
        <div className="container mx-auto px-6 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-7xl md:text-8xl font-bold">
              <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
                Launch Your Career
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Discover thousands of opportunities tailored for freshers. No
              registration required. One-click apply.
            </p>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:-translate-y-1">
                Explore Jobs
              </button>
              <button className="px-8 py-4 border-2 border-purple-500 rounded-full text-lg font-semibold hover:bg-purple-500/20 transition-all duration-300">
                How It Works
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
                Trending Categories
              </span>
            </h2>
            <p className="text-gray-400 text-xl">
              Explore the most in-demand job categories
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/50 to-black z-10" />
                <Image
                  src={category.image}
                  alt={category.title}
                  width={600}
                  height={400}
                  className="object-cover w-full h-[300px] group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end">
                  <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                  <p className="text-gray-300 mb-4">{category.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-purple-400 font-semibold">
                        {category.count}+ Jobs
                      </span>
                      <span className="text-green-400">{category.trend}</span>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 px-4 py-2 bg-purple-500 rounded-full text-sm font-semibold hover:bg-purple-600">
                      Explore More
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Jobs Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
                Latest Opportunities
              </span>
            </h2>
            <p className="text-gray-400 text-xl">
              Fresh positions updated daily
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {latestJobs.map((job, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl border border-gray-800 hover:border-purple-500 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-12 h-12">
                        <Image
                          src={job.logo}
                          alt={job.company}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {job.position}
                        </h3>
                        <p className="text-gray-400">{job.company}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                      {job.type}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-5 h-5 text-purple-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-gray-300">{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-5 h-5 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-gray-300">{job.salary}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {job.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm hover:bg-purple-500/20 hover:text-purple-400 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">{job.posted}</span>
                    <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:-translate-y-1">
                      Apply Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="px-8 py-4 bg-transparent border-2 border-purple-500 rounded-full text-lg font-semibold hover:bg-purple-500/20 transition-all duration-300">
              View All Jobs
            </button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black" />
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "10K+", label: "Active Jobs" },
              { value: "50K+", label: "Successful Placements" },
              { value: "1000+", label: "Partner Companies" },
              { value: "24/7", label: "Support" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
                Success Stories
              </span>
            </h2>
            <p className="text-gray-400 text-xl">
              Hear from our successful candidates
            </p>
          </motion.div>

          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            pagination={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            modules={[EffectCoverflow, Pagination, Autoplay]}
            className="max-w-6xl"
          >
            {successStories.map((story, index) => (
              <SwiperSlide key={index} className="w-[380px]">
                <motion.div
                  whileHover={{ y: -10 }}
                  className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-gray-800 hover:border-purple-500 transition-all duration-300"
                >
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <Image
                      src={story.image}
                      alt={story.name}
                      fill
                      className="rounded-full object-cover"
                    />
                    <div className="absolute -right-2 -bottom-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {story.name}
                    </h3>
                    <p className="text-purple-400">{story.role}</p>
                    <p className="text-gray-400 text-sm">at {story.company}</p>
                  </div>

                  <blockquote className="text-gray-300 text-center italic mb-6">
                    "{story.story}"
                  </blockquote>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-purple-400 font-bold">
                        {story.salary}
                      </p>
                      <p className="text-gray-400 text-sm">Package</p>
                    </div>
                    <div>
                      <p className="text-purple-400 font-bold">
                        {story.timeline}
                      </p>
                      <p className="text-gray-400 text-sm">Timeline</p>
                    </div>
                    <div>
                      <p className="text-purple-400 font-bold">
                        {story.background}
                      </p>
                      <p className="text-gray-400 text-sm">Background</p>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black" />
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center bg-gradient-to-br from-gray-900 to-black p-12 rounded-3xl border border-gray-800 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-50" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Start Your Journey?
              </h2>
              <p className="text-gray-300 text-xl mb-8">
                Join thousands of freshers who found their dream job through our
                platform
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300">
                  Explore Opportunities
                </button>
                <button className="px-8 py-4 bg-transparent border-2 border-purple-500 rounded-full text-lg font-semibold hover:bg-purple-500/20 transition-all duration-300">
                  Learn More
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-xl pt-20 pb-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div>
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                JobPortal
              </h3>
              <p className="text-gray-400 mb-6">
                Connecting fresh talent with amazing opportunities across India.
              </p>
              <div className="flex gap-4">
                {["twitter", "linkedin", "instagram", "github"].map(
                  (social, index) => (
                    <a
                      key={index}
                      href="#"
                      className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-purple-500 transition-colors"
                    >
                      <i className={`fab fa-${social} text-white`}></i>
                    </a>
                  )
                )}
              </div>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-6">Quick Links</h4>
              <ul className="space-y-4">
                {["About Us", "Contact", "Privacy Policy", "Terms"].map(
                  (link, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                      >
                        <span className="w-1 h-1 rounded-full bg-purple-500"></span>
                        {link}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-6">Popular Categories</h4>
              <ul className="space-y-4">
                {jobCategories.slice(0, 4).map((category, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-purple-500"></span>
                      {category.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-6">Newsletter</h4>
              <p className="text-gray-400 mb-4">
                Stay updated with the latest opportunities
              </p>
              <form className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md text-sm font-semibold"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} JobPortal. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
