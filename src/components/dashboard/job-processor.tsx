"use client";

import { useState } from "react";
import { useMLProcessing } from "@/hooks/use-ml-processing";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ProcessedJob {
  job_id: number;
  score: number;
}

interface ProcessingResult {
  similarity_scores: number[][];
  processed_jobs: number[];
  recommendations: Record<number, ProcessedJob[]>;
}

export function JobProcessor() {
  const { processJobs, isProcessing, processingStatus } = useMLProcessing();
  const [processedData, setProcessedData] = useState<ProcessingResult | null>(
    null
  );

  const handleProcessJobs = async () => {
    try {
      console.log("Processing jobs..."); // Debug log
      const result = await processJobs([1, 2, 3]);
      console.log("Process result:", result); // Debug log
      setProcessedData(result.data);
    } catch (error) {
      console.error("Processing failed:", error);
      toast.error("Failed to process jobs");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Job Processing</h2>
        <Button
          onClick={handleProcessJobs}
          disabled={isProcessing}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isProcessing ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Processing...
            </>
          ) : (
            "Process Jobs"
          )}
        </Button>
      </div>

      {processedData && (
        <div className="space-y-6">
          {/* Similarity Scores */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Similarity Matrix</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <tbody>
                  {processedData.similarity_scores.map((row, i) => (
                    <tr key={i}>
                      {row.map((score, j) => (
                        <td
                          key={j}
                          className="px-4 py-2 text-center"
                          style={{
                            backgroundColor: `rgba(59, 130, 246, ${score})`,
                          }}
                        >
                          {score.toFixed(2)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Recommendations */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Job Recommendations</h3>
            <div className="space-y-4">
              {Object.entries(processedData.recommendations).map(
                ([jobId, recommendations]) => (
                  <div key={jobId} className="border-b pb-4 last:border-0">
                    <h4 className="font-medium mb-2">
                      Job {jobId} Recommendations
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {recommendations.map((rec) => (
                        <Card
                          key={rec.job_id}
                          className="p-4 bg-gray-50 dark:bg-gray-800"
                        >
                          <div className="flex justify-between items-center">
                            <span>Job {rec.job_id}</span>
                            <span className="text-blue-600 font-medium">
                              {(rec.score * 100).toFixed(0)}% Match
                            </span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </Card>

          {/* Processing Stats */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Processing Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Processed Jobs
                </p>
                <p className="text-2xl font-bold">
                  {processedData.processed_jobs.length}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Status
                </p>
                <p className="text-2xl font-bold capitalize">
                  {processingStatus}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
