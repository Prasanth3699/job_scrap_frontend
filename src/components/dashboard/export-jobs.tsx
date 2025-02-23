// "use client";

// import { useState } from "react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import { Download } from "lucide-react";
// import { Job } from "@/types";
// import { toast } from "sonner";

// interface ExportJobsProps {
//   jobs: Job[];
// }

// export function ExportJobs({ jobs }: ExportJobsProps) {
//   const [isExporting, setIsExporting] = useState(false);

//   const exportToCSV = () => {
//     try {
//       setIsExporting(true);
//       const headers = [
//         "Title",
//         "Company",
//         "Location",
//         "Posted Date",
//         "Status",
//         "URL",
//       ];
//       const csvContent = [
//         headers.join(","),
//         ...jobs.map((job) =>
//           [
//             // `"${job.title}"`,
//             // `"${job.company}"`,
//             `"${job.location}"`,
//             // job.postedDate,
//             // job.status,
//             // job.url,
//           ].join(",")
//         ),
//       ].join("\n");

//       const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//       const link = document.createElement("a");
//       const url = URL.createObjectURL(blob);
//       link.setAttribute("href", url);
//       link.setAttribute(
//         "download",
//         `jobs_export_${new Date().toISOString()}.csv`
//       );
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       toast.success("Jobs exported successfully");
//     } catch (error) {
//       toast.error("Failed to export jobs");
//     } finally {
//       setIsExporting(false);
//     }
//   };

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button disabled={isExporting}>
//           <Download className="mr-2 h-4 w-4" />
//           Export
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent>
//         <DropdownMenuItem onClick={exportToCSV}>Export as CSV</DropdownMenuItem>
//         <DropdownMenuItem onClick={() => toast.info("Coming soon")}>
//           Export as Excel
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }
