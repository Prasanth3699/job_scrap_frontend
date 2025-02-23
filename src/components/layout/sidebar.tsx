// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { cn } from "@/lib/utils";
// import {
//   LayoutDashboard,
//   Settings,
//   Database,
//   History,
//   Mail,
// } from "lucide-react";

// const sidebarLinks = [
//   {
//     title: "Dashboard",
//     href: "/dashboard",
//     icon: LayoutDashboard,
//   },
//   {
//     title: "Jobs",
//     href: "/dashboard/jobs",
//     icon: Database,
//   },
//   {
//     title: "History",
//     href: "/dashboard/history",
//     icon: History,
//   },
//   {
//     title: "Email Config",
//     href: "/dashboard/email-config",
//     icon: Mail,
//   },
//   {
//     title: "Settings",
//     href: "/dashboard/settings",
//     icon: Settings,
//   },
// ];

// export function Sidebar() {
//   const pathname = usePathname();

//   return (
//     <div className="hidden lg:flex h-screen w-64 flex-col fixed left-0 top-0 border-r bg-white">
//       <div className="p-6">
//         <h1 className="text-2xl font-bold">Job Scraper</h1>
//       </div>

//       <div className="flex-1 px-4">
//         <nav className="space-y-2">
//           {sidebarLinks.map((link) => (
//             <Link
//               key={link.href}
//               href={link.href}
//               className={cn(
//                 "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
//                 pathname === link.href
//                   ? "bg-primary-50 text-primary-600"
//                   : "text-gray-600 hover:bg-gray-100"
//               )}
//             >
//               <link.icon className="h-5 w-5" />
//               {link.title}
//             </Link>
//           ))}
//         </nav>
//       </div>
//     </div>
//   );
// }
