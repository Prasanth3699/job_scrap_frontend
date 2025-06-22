"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Job } from "@/types";
import { ArrowLeft, MapPin, Clock, Briefcase, Calendar } from "lucide-react";
import RelatedJobs from "@/components/jobs/RelatedJobs";
import { jobsService } from "@/lib/api/services/jobs";
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
        const jobData = await jobsService.getJobById(params.id as string);
        setJob(jobData);

        // Fetch related jobs
        try {
          const relatedData = await jobsService.getRelatedJobs(
            params.id as string
          );
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
        <div className="animate-pulse flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-400">Loading job details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !job) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 max-w-md w-full text-center">
          <p className="text-xl text-red-400 mb-4">
            {error || "Job not found"}
          </p>
          <p className="text-gray-400 mb-6">
            The job you're looking for might have been removed or is temporarily
            unavailable.
          </p>
          <button
            onClick={() => router.push("/jobs")}
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to job listings
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-black text-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md p-1"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Jobs
        </button>

        {/* Job Details Card */}
        <div className="bg-black rounded-lg p-6 md:p-8 border border-gray-800 shadow-lg">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {job.job_title}
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mt-2">
                {job.company_name}
              </p>
            </div>
            <div className="md:text-right">
              <p className="text-lg font-semibold text-green-400">
                {job.salary}
              </p>
              <div className="flex items-center text-gray-400 mt-1 md:justify-end">
                <Calendar className="w-4 h-4 mr-1" />
                <p className="text-sm">Posted {formatDate(job.posting_date)}</p>
              </div>
            </div>
          </div>

          {/* Job Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8 bg-gray-900 p-4 rounded-lg">
            <div className="flex items-center text-gray-300">
              <MapPin className="w-5 h-5 mr-2 text-blue-400" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Briefcase className="w-5 h-5 mr-2 text-blue-400" />
              <span>{job.job_type}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Clock className="w-5 h-5 mr-2 text-blue-400" />
              <span>{job.experience}</span>
            </div>
          </div>

          {/* Job Description */}
          <div className="mt-8 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-3 flex items-center">
                Job Description
                <div className="h-px flex-grow bg-gray-800 ml-4"></div>
              </h2>
              <div
                className="prose prose-invert max-w-none text-gray-300 leading-relaxed"
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
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Apply for this position
            </a>
            <p className="text-gray-500 text-sm mt-2">
              Opens application on company website
            </p>
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
          <div className="mt-12">
            <RelatedJobs currentJobId={job.id} jobs={relatedJobs} />
          </div>
        )}
      </div>
    </div>
  );
}
