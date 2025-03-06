import { Job } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{job.job_title}</CardTitle>
        <p className="text-sm text-muted-foreground">{job.company_name}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Location:</span>
            <span className="text-sm">{job.location}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Type:</span>
            <span className="text-sm">{job.job_type}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Experience:</span>
            <span className="text-sm">{job.experience}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Salary:</span>
            <span className="text-sm">{job.salary}</span>
          </div>
          <div className="mt-4">
            <Button
              className="w-full"
              onClick={() => window.open(job.apply_link, "_blank")}
            >
              Apply Now
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
