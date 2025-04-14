"use client";

import { Sparkles } from "lucide-react";
import {
  FaFacebook,
  FaXTwitter,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="py-16 px-6 bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <Sparkles className="h-7 w-7 text-purple-400" />
            <span className="text-2xl font-bold text-white">JobMatch AI</span>
          </div>
          <p className="mb-6 max-w-xs">
            The most advanced AI-powered job matching platform helping
            professionals worldwide find their perfect career matches.
          </p>
          <div className="flex space-x-4">
            <a
              href="#"
              className="hover:text-blue-400 transition-colors transform hover:scale-110 hover:-translate-y-1"
              aria-label="Facebook"
            >
              <FaFacebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="hover:text-blue-200 transition-colors transform hover:scale-110 hover:-translate-y-1"
              aria-label="Twitter"
            >
              <FaXTwitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="hover:text-blue-500 transition-colors transform hover:scale-110 hover:-translate-y-1"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="hover:text-pink-500 transition-colors transform hover:scale-110 hover:-translate-y-1"
              aria-label="Instagram"
            >
              <FaInstagram className="w-5 h-5" />
            </a>
          </div>
        </div>

        <FooterColumn
          title="Product"
          items={["Features", "How It Works", "Pricing", "API", "Status"]}
          color="purple"
        />

        <FooterColumn
          title="Resources"
          items={[
            "Blog",
            "Help Center",
            "Tutorials",
            "Career Tips",
            "Webinars",
          ]}
          color="blue"
        />

        <FooterColumn
          title="Company"
          items={[
            "About Us",
            "Careers",
            "Privacy Policy",
            "Terms of Service",
            "Contact",
          ]}
          color="indigo"
        />
      </div>

      <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-gray-800 text-sm text-center">
        <p>© {new Date().getFullYear()} JobMatch AI. All rights reserved.</p>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
  color,
}: {
  title: string;
  items: string[];
  color: string;
}) {
  const colorClasses = {
    purple: "bg-purple-400",
    blue: "bg-blue-400",
    indigo: "bg-indigo-400",
  };

  return (
    <div>
      <h4 className="text-white font-bold mb-6">{title}</h4>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item}>
            <a
              href="#"
              className="hover:text-white transition-colors flex items-center group text-sm"
            >
              <span
                className={`h-px w-0 ${
                  colorClasses[color as keyof typeof colorClasses]
                } group-hover:w-4 mr-2 transition-all duration-300`}
              ></span>
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
