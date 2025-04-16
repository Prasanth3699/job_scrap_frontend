"use client";

import { Sparkles } from "lucide-react";
import { animateNavLink } from "./utils";

import { forwardRef } from "react";

const Navbar = forwardRef<HTMLElement>(function Navbar(_, ref) {
  return (
    <nav
      ref={ref}
      className="fixed w-full z-50 bg-white/90 dark:bg-black/90 shadow-sm px-6 py-6 transition-colors duration-300 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-7 w-7 text-purple-600 dark:text-purple-400" />
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
            JobMatch AI
          </span>
        </div>
        <div className="flex items-center space-x-6">
          <a
            href="#features"
            className="hidden md:block font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors relative px-2 py-1"
            onClick={animateNavLink}
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="hidden md:block font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors relative px-2 py-1"
            onClick={animateNavLink}
          >
            How It Works
          </a>
          <button className="hidden md:block bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all hover:scale-105 hover:shadow-purple-500/20 transform focus:ring-2 focus:ring-purple-400 focus:outline-none">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
});

export default Navbar;
