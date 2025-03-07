"use client";

import { useMLProcessing } from "@/hooks/ml/use-ml-processing";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Job } from "@/types";

interface JobRecommendationsProps {
  jobId: number;
}

export function JobRecommendations({ jobId }: JobRecommendationsProps) {
  const { recommendations, isLoadingRecommendations } = useMLProcessing(jobId);

  if (isLoadingRecommendations) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="animate-spin h-6 w-6" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Similar Jobs</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations?.map((job: Job) => (
          <Card key={job.id} className="p-4">
            <h4 className="font-medium">{job.job_title}</h4>
            <p className="text-sm text-gray-600">{job.company_name}</p>
            {/* Add more job details */}
          </Card>
        ))}
      </div>
    </div>
  );
}
