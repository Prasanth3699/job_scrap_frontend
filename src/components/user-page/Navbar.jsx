"use client";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, User, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const navItems = [
    { name: "Home", href: "/" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
  ];

  return (
    <nav className="fixed w-full z-50 bg-light-card dark:bg-dark-card shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-light-primary to-light-secondary dark:from-dark-primary dark:to-dark-secondary bg-clip-text text-transparent">
                ResumeMatch AI
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-3 py-2 rounded-md text-sm font-medium text-light-text dark:text-dark-text hover:text-light-primary dark:hover:text-dark-primary transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side buttons */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-light-text dark:text-dark-text hover:bg-light-background dark:hover:bg-dark-background transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <div className="relative">
                <button className="p-2 rounded-full text-light-text dark:text-dark-text hover:bg-light-background dark:hover:bg-dark-background transition-colors">
                  <User size={20} />
                </button>
              </div>

              <button className="flex items-center px-4 py-2 rounded-md bg-light-primary dark:bg-dark-primary text-white text-sm font-medium hover:bg-opacity-90 transition-colors">
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-light-text dark:text-dark-text hover:bg-light-background dark:hover:bg-dark-background transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-light-card dark:bg-dark-card"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-light-text dark:text-dark-text hover:text-light-primary dark:hover:text-dark-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 pb-3 border-t border-light-background dark:border-dark-background">
              <div className="flex items-center px-5 space-x-3">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full text-light-text dark:text-dark-text hover:bg-light-background dark:hover:bg-dark-background transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button className="flex items-center px-4 py-2 rounded-md bg-light-primary dark:bg-dark-primary text-white text-sm font-medium hover:bg-opacity-90 transition-colors">
                  <User size={16} className="mr-2" />
                  Profile
                </button>
                <button className="flex items-center px-4 py-2 rounded-md border border-light-primary dark:border-dark-primary text-light-primary dark:text-dark-primary text-sm font-medium hover:bg-light-background dark:hover:bg-dark-background transition-colors">
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
