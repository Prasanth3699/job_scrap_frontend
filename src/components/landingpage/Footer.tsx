"use client";
import { useRef, useEffect } from "react";
import Link from "next/link";
import {
  FaFacebook,
  FaXTwitter,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa6";
import gsap from "gsap";

export default function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (footerRef.current) {
        gsap.fromTo(
          footerRef.current,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
          }
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const socialLinks = [
    { Icon: FaFacebook, color: "hover:text-blue-400" },
    { Icon: FaXTwitter, color: "hover:text-blue-400" },
    { Icon: FaLinkedin, color: "hover:text-blue-500" },
    { Icon: FaInstagram, color: "hover:text-purple-400" },
  ];

  const quickLinks = ["Find Jobs", "Upload Resume", "Career Tips", "FAQ"];
  const resources = [
    "Learning Paths",
    "Resume Templates",
    "Interview Tips",
    "Blog",
  ];

  return (
    <footer ref={footerRef} className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 md:gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              JobMatch
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Helping freshers find their perfect first job through AI-powered
              matching and career guidance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-blue-400">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center gap-2 group"
                  >
                    <span className="h-px w-0 bg-blue-400 group-hover:w-4 transition-all duration-300"></span>
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-purple-400">
              Resources
            </h4>
            <ul className="space-y-3">
              {resources.map((resource) => (
                <li key={resource}>
                  <Link
                    href="#"
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center gap-2 group"
                  >
                    <span className="h-px w-0 bg-purple-400 group-hover:w-4 transition-all duration-300"></span>
                    {resource}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              Connect With Us
            </h4>
            <div className="flex gap-6">
              {socialLinks.map(({ Icon, color }, index) => (
                <a
                  key={index}
                  href="#"
                  className={`text-gray-300 ${color} transition-all duration-300 transform hover:scale-110 hover:-translate-y-1`}
                >
                  <Icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400">
              © {new Date().getFullYear()} JobMatch. All rights reserved.
            </p>
            <div className="flex gap-8 text-sm text-gray-400">
              <Link
                href="#"
                className="hover:text-white transition-colors hover:translate-x-1  duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="hover:text-white transition-colors hover:translate-x-1  duration-300"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="hover:text-white transition-colors hover:translate-x-1  duration-300"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Gradient Border */}
        <div className="absolute top-0 left-0 right-0 h-px opacity-20 bg-gradient-to-r from-transparent via-blue-500 to-purple-500"></div>
      </div>
    </footer>
  );
}
