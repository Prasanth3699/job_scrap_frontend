"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Job } from "@/types";
import { ArrowLeft, MapPin, Clock, Briefcase } from "lucide-react";
import RelatedJobs from "@/components/jobs/RelatedJobs";
import { jobsApi } from "@/lib/api/jobs-api";
import { sanitizeHtml } from "@/lib/utils/sanitize";

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedJobs, setRelatedJobs] = useState<Job[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch job details using the API service
        const jobData = await jobsApi.getJobById(params.id as string);
        setJob(jobData);

        // Fetch related jobs
        try {
          const relatedData = await jobsApi.getRelatedJobs(params.id as string);
          setRelatedJobs(relatedData || []);
        } catch (err) {
          console.error("Error fetching related jobs:", err);
          setRelatedJobs([]);
        }
      } catch (err) {
        console.error("Error fetching job details:", err);
        setError("Failed to fetch job details");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchJobDetails();
    }
  }, [params.id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error || !job) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <p className="text-xl text-red-400 mb-4">{error || "Job not found"}</p>
        <button
          onClick={() => router.push("/jobs")}
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          Go back to jobs
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Jobs
        </button>

        {/* Job Details Card */}
        <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white">{job.job_title}</h1>
              <p className="text-xl text-gray-400 mt-2">{job.company_name}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-blue-400">
                {job.salary}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Posted {new Date(job.posting_date).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Job Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="flex items-center text-gray-400">
              <MapPin className="w-5 h-5 mr-2" />
              {job.location}
            </div>
            <div className="flex items-center text-gray-400">
              <Briefcase className="w-5 h-5 mr-2" />
              {job.job_type}
            </div>
            <div className="flex items-center text-gray-400">
              <Clock className="w-5 h-5 mr-2" />
              {job.experience}
            </div>
          </div>

          {/* Job Description */}
          <div className="mt-8 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">
                Job Description
              </h2>
              <div
                className="prose prose-invert max-w-none text-gray-400 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(
                    job.description || "No description available"
                  ),
                }}
              />
            </div>
          </div>

          {/* Apply Button */}
          <div className="mt-8 pt-8 border-t border-gray-800">
            <a
              href={job.apply_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Apply for this position
            </a>
          </div>
        </div>

        {/* Schema.org JobPosting structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "JobPosting",
              title: job.job_title,
              datePosted: job.posting_date,
              description: job.description,
              employmentType: job.job_type,
              hiringOrganization: {
                "@type": "Organization",
                name: job.company_name,
              },
              jobLocation: {
                "@type": "Place",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: job.location,
                },
              },
              baseSalary: {
                "@type": "MonetaryAmount",
                currency: "USD",
                value: {
                  "@type": "QuantitativeValue",
                  value: job.salary,
                  unitText: "YEAR",
                },
              },
            }),
          }}
        />

        {/* Related Jobs Section */}
        {relatedJobs.length > 0 && (
          <RelatedJobs currentJobId={job.id} jobs={relatedJobs} />
        )}
      </div>
    </div>
  );
}
