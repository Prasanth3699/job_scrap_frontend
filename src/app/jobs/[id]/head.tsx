import { Metadata } from "next";

async function fetchJobData(id: string) {
  const res = await fetch(`${process.env.API_URL}/api/jobs/${id}`);
  if (!res.ok) throw new Error("Failed to fetch job data");
  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const job = await fetchJobData(params.id);

    return {
      title: `${job.job_title} at ${job.company_name} | Your Job Board`,
      description: `${job.job_title} position at ${job.company_name}. ${job.job_type} role with ${job.experience} experience required. Salary: ${job.salary}`,
      openGraph: {
        title: `${job.job_title} at ${job.company_name}`,
        description: `${job.job_title} position at ${job.company_name}. ${job.job_type} role with ${job.experience} experience required. Salary: ${job.salary}`,
        type: "website",
        url: `https://yourjobboard.com/jobs/${params.id}`,
      },
      twitter: {
        card: "summary_large_image",
        title: `${job.job_title} at ${job.company_name}`,
        description: `${job.job_title} position at ${job.company_name}. ${job.job_type} role with ${job.experience} experience required.`,
      },
    };
  } catch (error) {
    return {
      title: "Job Details | Your Job Board",
      description: "View job details and apply for positions.",
    };
  }
}
