import Link from "next/link";
import { Twitter, Linkedin, Github, Mail } from "lucide-react";

export default function Footer() {
  const links = [
    {
      title: "Product",
      items: [
        { name: "Features", href: "#features" },
        { name: "How It Works", href: "#how-it-works" },
        { name: "Pricing", href: "#pricing" },
      ],
    },
    {
      title: "Company",
      items: [
        { name: "About Us", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Contact", href: "#" },
      ],
    },
    {
      title: "Legal",
      items: [
        { name: "Privacy", href: "#" },
        { name: "Terms", href: "#" },
        { name: "Cookies", href: "#" },
      ],
    },
  ];

  const socials = [
    { icon: Twitter, href: "#" },
    { icon: Linkedin, href: "#" },
    { icon: Github, href: "#" },
    { icon: Mail, href: "#" },
  ];

  return (
    <footer className="bg-light-background dark:bg-dark-background border-t border-light-card dark:border-dark-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-light-primary to-light-secondary dark:from-dark-primary dark:to-dark-secondary bg-clip-text text-transparent">
                ResumeMatch AI
              </span>
            </Link>
            <p className="mt-4 text-sm text-light-text dark:text-dark-text opacity-80">
              The most advanced AI-powered resume matching system to help you
              land your dream job.
            </p>
            <div className="flex space-x-4 mt-6">
              {socials.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className="text-light-text dark:text-dark-text hover:text-light-primary dark:hover:text-dark-primary transition-colors"
                >
                  <social.icon size={20} />
                </Link>
              ))}
            </div>
          </div>

          {links.map((link) => (
            <div key={link.title}>
              <h3 className="text-sm font-semibold text-light-text dark:text-dark-text tracking-wider uppercase">
                {link.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {link.items.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-light-text dark:text-dark-text opacity-80 hover:text-light-primary dark:hover:text-dark-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-light-card dark:border-dark-card flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-light-text dark:text-dark-text opacity-80">
            © {new Date().getFullYear()} ResumeMatch AI. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link
              href="#"
              className="text-sm text-light-text dark:text-dark-text opacity-80 hover:text-light-primary dark:hover:text-dark-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-sm text-light-text dark:text-dark-text opacity-80 hover:text-light-primary dark:hover:text-dark-primary transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-sm text-light-text dark:text-dark-text opacity-80 hover:text-light-primary dark:hover:text-dark-primary transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
