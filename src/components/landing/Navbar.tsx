"use client";

import { Bell, Menu, X } from "lucide-react";
import { animateNavLink } from "./utils"; // Presumed utility, optional
import { useEffect, useState, forwardRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/auth/use-auth";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/landing-page", label: "Home" },
  { href: "/jobs", label: "Job" },
];

const menuVariants = {
  hidden: { x: "110%" },
  visible: {
    x: 0,
    transition: { type: "spring", bounce: 0.24, duration: 0.36 },
  },
  exit: { x: "110%" },
};

const Navbar = forwardRef<HTMLElement>(function Navbar(_, ref) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function HamburgerIcon({ open }: { open: boolean }) {
    return open ? (
      <X className="h-7 w-7 text-white" />
    ) : (
      <Menu className="h-7 w-7 text-white" />
    );
  }

  return (
    <nav
      ref={ref}
      className={`fixed w-full z-[60] ${
        isScrolled
          ? "bg-white/80 dark:bg-neutral-950/90 shadow-md px-4 py-2"
          : "bg-white/95 dark:bg-neutral-950 px-4 py-6"
      } transition-all duration-300 ease-in-out backdrop-blur-lg`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center relative">
        {/* --- LEFT: Logo, name on desktop only --- */}
        <div className="flex items-center space-x-2 select-none">
          {/* You can use your icon here */}
          <span className="text-2xl md:inline font-extrabold bg-gradient-to-r dark:text-white text-blue-500 bg-clip-text text-transparent tracking-tight">
            {/* Place your logo HERE, e.g. <LogoIcon className="h-7 w-7 ..." /> */}
            <span className="mr-2">
              {" "}
              {/* Only on desktop: show app name with logo */}
              <span className="hidden md:inline">JobMatch AI</span>
            </span>
          </span>
        </div>

        {/* --- Desktop nav --- */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map(({ href, label }) => {
            const isActive =
              (label === "Home" && pathname.startsWith("/landing-page")) ||
              (label !== "Home" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={animateNavLink}
                className={`
          relative font-medium px-4 py-2 rounded focus:outline-none
          flex flex-col items-center
          ${
            isActive
              ? "text-blue-500 font-bold"
              : "text-gray-300 hover:text-blue-400 transition"
          }
        `}
                aria-current={isActive ? "page" : undefined}
              >
                {label}
                {/* The underline lives ONLY under the link,
           and animates with opacity/translate, not full-width */}
                {isActive && (
                  <motion.span
                    layout // animates size if present/removed
                    className="block h-[2.5px] w-6 mt-1 rounded-full bg-blue-500"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.18, type: "tween" }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* --- Desktop right area: bell, user, logout --- */}
        <div className="hidden md:flex items-center gap-4">
          <button
            className="relative p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-950 transition group"
            type="button"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-blue-800 dark:text-blue-300 group-hover:scale-110 transition-transform" />
          </button>
          {user?.email && (
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
              {user.name || user.email}
            </span>
          )}
          <Button
            className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 px-4 py-1.5 transition"
            onClick={logout}
            type="button"
          >
            Logout
          </Button>
        </div>

        {/* ---- MOBILE HEADER: User name (if present) and hamburger only, no logo or name */}
        <div className="md:hidden flex items-center gap-2">
          {user?.email && (
            <span className="text-[15px] font-medium text-gray-900 dark:text-gray-100 truncate max-w-[85px]">
              {user.name || user.email}
            </span>
          )}
          <motion.button
            className="p-2 rounded-full bg-black"
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            onClick={() => setMenuOpen((p) => !p)}
            whileTap={{ scale: 0.95 }}
          >
            <HamburgerIcon open={menuOpen} />
          </motion.button>
        </div>

        {/* ----- MOBILE MENU + OVERLAY ------ */}
        <AnimatePresence>
          {menuOpen && (
            <>
              {/* Pure black overlay */}
              <motion.div
                className="fixed inset-0 bg-black z-[99]"
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28 }}
              />
              {/* Menu: floating card */}
              <motion.aside
                className="fixed top-0 right-0 h-full w-[90vw] max-w-xs z-[100] shadow-2xl rounded-l-2xl dark:bg-neutral-950 bg-zinc-100 flex flex-col pt-2"
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Close button absolute */}
                <motion.button
                  type="button"
                  aria-label="Close menu"
                  className="absolute right-3 top-3 rounded-full p-2 hover:bg-blue-100 dark:hover:bg-blue-900 transition z-[101]"
                  onClick={() => setMenuOpen(false)}
                  whileTap={{ scale: 0.93 }}
                >
                  <X className="h-6 w-6 text-blue-700 dark:text-blue-200" />
                </motion.button>

                {/* User name at top */}
                <div className="flex flex-col gap-1 px-5 pt-7 pb-4">
                  {user?.email && (
                    <span className="text-lg font-bold text-zinc-900 dark:text-gray-50 truncate max-w-full mb-1">
                      {user.name || user.email}
                    </span>
                  )}
                </div>

                {/* --- Nav links, animated underline/bubble only under item! --- */}
                <nav className="flex flex-col gap-2 px-3 mt-1">
                  {navLinks.map(({ href, label }) => {
                    const isActive =
                      (label === "Home" &&
                        pathname.startsWith("/landing-page")) ||
                      (label !== "Home" && pathname.startsWith(href));
                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setMenuOpen(false)}
                        className={`
                          relative flex items-center font-semibold px-4 py-3 rounded-xl
                          text-base tracking-tight overflow-hidden
                          focus:outline-none transition-all duration-200 group
                          ${
                            isActive
                              ? "text-blue-600 dark:text-blue-300"
                              : "text-gray-800 dark:text-gray-100 hover:text-blue-700 dark:hover:text-blue-300"
                          }
                        `}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {label}
                        {/* Animated Bubble Underline */}
                        <AnimatePresence initial={false}>
                          {isActive && (
                            <motion.span
                              layoutId="nav-underline"
                              className="absolute left-2 right-2 bottom-1.5 h-2 rounded-xl bg-blue-600/20 dark:bg-blue-800/30 z-[-1]"
                              initial={{ opacity: 0, scaleY: 0.7 }}
                              animate={{ opacity: 1, scaleY: 1 }}
                              exit={{ opacity: 0, scaleY: 0.8 }}
                              transition={{
                                type: "spring",
                                stiffness: 420,
                                damping: 30,
                                duration: 0.34,
                              }}
                            />
                          )}
                        </AnimatePresence>
                      </Link>
                    );
                  })}
                  <hr className="my-3 border-t border-blue-900/10 dark:border-blue-300/10" />
                  <motion.button
                    type="button"
                    aria-label="Notifications"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium transition"
                    whileTap={{ scale: 0.97 }}
                  >
                    <Bell className="h-5 w-5" />
                    Notifications
                  </motion.button>
                </nav>
                {/* --- Logout bottom --- */}
                <div className="mt-auto px-6 pb-8 pt-6 border-t border-blue-900/10 dark:border-blue-300/15 flex flex-col items-stretch">
                  <Button
                    className="w-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 px-4 py-2 rounded-xl transition font-bold"
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    type="button"
                  >
                    Logout
                  </Button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
});

export default Navbar;
