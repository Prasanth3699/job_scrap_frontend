"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useState, createContext, useContext, useEffect } from "react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import {
  LayoutDashboard,
  Settings,
  Database,
  History,
  Home,
} from "lucide-react";
import Image from "next/image";

// Sidebar Links Array
const sidebarLinks = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Jobs", href: "/dashboard/jobs", icon: Database },
  { title: "History", href: "/dashboard/history", icon: History },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
  { title: "Landing Page", href: "/dashboard/landing-page", icon: Home },
];

// Sidebar Context
const SidebarContext = createContext<
  | {
      open: boolean;
      setOpen: React.Dispatch<React.SetStateAction<boolean>>;
      isMobile: boolean;
    }
  | undefined
>(undefined);

// interface SidebarContextProps {
//   open: boolean;
//   setOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   isMobile: boolean;
// }

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

// Sidebar Provider

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [openState, setOpenState] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, isMobile }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Desktop Sidebar
export const DesktopSidebar = ({
  className,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, isMobile } = useSidebar();
  const pathname = usePathname();

  if (isMobile) return null;

  return (
    <motion.aside
      className={cn(
        "fixed top-16 left-0 h-[calc(100vh-4rem)] px-4 py-6 hidden md:flex md:flex-col bg-black dark:bg-black border-r shadow-lg z-30",
        "min-w-[70px] max-w-[250px]",
        className
      )}
      animate={{ width: open ? 250 : 70 }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      <div className="flex flex-col flex-1 overflow-hidden">
        <SidebarLogo open={open} />
        <nav className="mt-8 space-y-2">
          {sidebarLinks.map((link) => (
            <SidebarLink
              key={link.href}
              link={link}
              active={pathname === link.href}
              open={open}
            />
          ))}
        </nav>
      </div>
    </motion.aside>
  );
};

// Mobile Sidebar
export const MobileSidebar = ({ className }: React.ComponentProps<"div">) => {
  const { open, setOpen, isMobile } = useSidebar();
  const pathname = usePathname();

  if (!isMobile) return null;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-3 left-4 z-50 md:hidden"
      >
        <IconMenu2 className="h-6 w-6 text-gray-700 dark:text-gray-300" />
      </button>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className={cn(
                "fixed top-0 left-0 h-full w-64 bg-black dark:bg-black p-6 z-50 md:hidden",
                className
              )}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <IconX className="h-6 w-6" />
              </button>

              <div className="flex flex-col flex-1">
                <SidebarLogo open={true} />
                <nav className="mt-8 space-y-2">
                  {sidebarLinks.map((link) => (
                    <SidebarLink
                      key={link.href}
                      link={link}
                      active={pathname === link.href}
                      open={true}
                    />
                  ))}
                </nav>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const SidebarLogo = ({ open }: { open: boolean }) => {
  return (
    <div className="font-normal flex space-x-2 items-center text-sm text-white py-1 relative z-20">
      <div className="mt-auto -ml-2 flex-shrink-0">
        <SidebarLink
          link={{
            title: "",
            href: "/dashboard/profile",
            icon: () => (
              <Image
                src="https://avatar.iran.liara.run/public/21"
                alt="User"
                width={32}
                height={32}
                className="rounded-full flex-shrink-0"
              />
            ),
          }}
          open={open}
        />
      </div>
    </div>
  );
};

const SidebarLink = ({
  link,
  active,
  open,
}: {
  link: { title: string; href: string; icon: React.ElementType };
  active?: boolean;
  open: boolean;
}) => {
  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all text-white",
        active ? "bg-gray-700 text-white" : "hover:bg-gray-800"
      )}
    >
      <link.icon className="h-5 w-5 text-white" />
      {open && <span>{link.title}</span>}
    </Link>
  );
};
