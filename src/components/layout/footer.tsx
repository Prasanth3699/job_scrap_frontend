"use client";

import { Github, Mail, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const navigation = {
  main: [
    { name: "Dashboard", href: "/dashboard" },
    { name: "History", href: "/dashboard/history" },
    { name: "Settings", href: "/dashboard/settings" },
    { name: "Help", href: "#" },
  ],
  social: [
    {
      name: "GitHub",
      href: "https://github.com/yourusername",
      icon: Github,
    },
    {
      name: "Twitter",
      href: "https://twitter.com/yourusername",
      icon: Twitter,
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/in/yourusername",
      icon: Linkedin,
    },
    {
      name: "Email",
      href: "mailto:your@email.com",
      icon: Mail,
    },
  ],
};

export function FooterFull() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t fixed border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-900">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-12 sm:py-16 lg:px-8">
        {/* Logo and Description */}
        <div className="mb-8 flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Job Scraper
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            Automated job scraping solution for efficient recruitment and job
            market analysis.
          </p>
        </div>

        {/* Navigation Links */}
        <nav
          className="mb-8 columns-2 sm:flex sm:justify-center sm:space-x-12"
          aria-label="Footer"
        >
          {navigation.main.map((item) => (
            <div key={item.name} className="pb-6">
              <Link
                href={item.href}
                className="text-sm leading-6 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                {item.name}
              </Link>
            </div>
          ))}
        </nav>

        {/* Social Links */}
        <div className="flex justify-center space-x-10">
          {navigation.social.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-gray-500"
              onClick={() => window.open(item.href)}
            >
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </Button>
          ))}
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-gray-900/10 dark:border-gray-100/10 pt-8">
          <p className="text-center text-xs leading-5 text-gray-500">
            &copy; {currentYear} Job Scraper. All rights reserved.
          </p>
        </div>

        {/* Additional Links */}
        <div className="mt-4 flex justify-center space-x-6 text-xs text-gray-500">
          <Link href="#" className="hover:text-gray-900 dark:hover:text-white">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:text-gray-900 dark:hover:text-white">
            Terms of Service
          </Link>
          <Link href="#" className="hover:text-gray-900 dark:hover:text-white">
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
}
