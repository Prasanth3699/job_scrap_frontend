// "use client";

// import * as React from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Job } from "@/types";
// import { ExternalLink, Calendar, MapPin, Building } from "lucide-react";
// import { format } from "date-fns";

// interface JobDetailModalProps {
//   job: Job | null;
//   isOpen: boolean;
//   onClose: () => void;
// }

// export function JobDetailModal({ job, isOpen, onClose }: JobDetailModalProps) {
//   if (!job) return null;

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-2xl">
//         <DialogHeader>
//           <DialogTitle>{job.title}</DialogTitle>
//         </DialogHeader>

//         <div className="space-y-4">
//           <div className="flex items-center gap-4 text-sm text-muted-foreground">
//             <div className="flex items-center gap-1">
//               <Building className="h-4 w-4" />
//               {job.company}
//             </div>
//             <div className="flex items-center gap-1">
//               <MapPin className="h-4 w-4" />
//               {job.location}
//             </div>
//             <div className="flex items-center gap-1">
//               <Calendar className="h-4 w-4" />
//               {format(new Date(job.postedDate), "MMM d, yyyy")}
//             </div>
//           </div>

//           <div className="prose prose-sm max-w-none">
//             <h3>Job Description</h3>
//             <div dangerouslySetInnerHTML={{ __html: job.description }} />
//           </div>

//           <div className="flex items-center gap-4">
//             <Button onClick={() => window.open(job.url, "_blank")}>
//               <ExternalLink className="mr-2 h-4 w-4" />
//               View Original
//             </Button>
//             <Button onClick={onClose}>Close</Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
