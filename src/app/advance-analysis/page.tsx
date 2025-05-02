// app/(pages)/analysis/page.tsx or any component
"use client";

import React from "react";
import { useLLMComprehensiveAnalysis } from "@/hooks/llm/use-advanced-analysis";
import AnalysisDashboard from "@/components/AnalysisDashboard/AnalysisDashboard";

const SAMPLE_RESUME_TEXT = `
+91 702XXXXXXX
email@gmail.com
Alwar, Rajasthan, India
Gagan Gupta https://www.linkedin.com/in/gagang033/

EXPERIENCE
Specialist Programmer Infosys Limited 10/2021 – Present
• Migrated an entire contract management application developed on MEAN stack to IronClad
• Working as a FullStack developer using MEAN/MERN stack

EDUCATION
Computer Science Chandigarh group of Colleges, Mohali 07/2017 – 07/2021
• GPA: 8.0/10.

SKILLS
• C; C++; Java;
• HTML; CSS; JavaScript;
• MongoDB; ExpressJS; React; Angular; NodeJS;
• Android Studio; Google Firebase;

PROJECTS
… (rest of text) …
`;

const SAMPLE_JD_TEXT = `
   "FanCode is India’s premier sports destination committed to giving fans a highly personalised experience across content and merchandise for a wide variety of sports. Founded by sports industry veterans Yannick Colaco and Prasana Krishnan in March 2019, FanCode has over 100 million users. It has partnered with domestic, international sports leagues and associations across multiple sports. In content, FanCode offers interactive live streaming for sports with industry-first subscription formats like Match, Bundle and Tour Passes, along with monthly and annual subscriptions at affordable prices. Through FanCode Shop, it also offers fans a wide range of sports merchandise for sporting teams, brands and leagues across the world.\n\nTechnology @ FanCode\nWe have one mission: Create a platform for all sports fans. Built by sports fans for sports fans, we cover Sports Live Video Streaming, Live Scores & Commentary, Video On Demand, Player Analytics, Fantasy Research, News, and very recently, e-Commerce. We’re at the beginning of our story and growing at an incredible pace. Our tech stack is hosted on AWS and GCP, built on Amazon EC2, CloudFront, Lambda, API Gateway, and Google Compute Engine, Cloud Functions, and Google Cloud Storage. We have a microservices-based architecture using Java, Node.js, Python, PHP, Redis, MySQL, Cassandra, and Elasticsearch as our end-to-end stack serving product features. As a data-driven team, we also use Python and other big data technologies for Machine Learning and Predictive Analytics. Additionally, we heavily use Kafka, Spark, Redshift, and BigQuery, and other cutting-edge technologies to keep improving FanCode's performance. You will be joining the Core Infra Engineering Team at FanCode, which runs a fresh, stable, and secure environment for our talented developers to thrive. Along with building a great foundation, this Core Infra team is also responsible for spreading their knowledge throughout the other teams, ensuring everyone takes advantage of the easy-to-use infrastructure, and applying best practices when it comes to Continuous Delivery, Containerization, Performance, Networking, and Security.\n\nYour Role:\n• Deploy solid, resilient Cloud Architectures by writing Infrastructure as Code automation tools.\n• Design and implement the services and tools needed to manage and scale a service-oriented architecture, e.g., service discovery, config managers, container orchestration, and more.\n• Build self-serve infrastructure automation, optimise deployment workflow at scale.\n• Build and maintain a Compute Orchestration Platform using EC2 and GCE as the foundation.\n• Develop and support tools for infrastructure, and evangelise best practices to be used by other engineers.\n• Write code to implement networking and security at scale.\n• Mentor and support engineers regarding development, concepts, and best practices.\n\nMust Haves:\n• 1 to 3 years of relevant experience\n• Proficient with at least one scripting language (Python or Bash)\n• Strong Infrastructure fundamentals (preferably on AWS and GCP)\n• Experience in containers and orchestration tools like Kubernetes (GKE/EKS)\n\nGood to Haves:\n• Experience with implementing CI and CD pipelines using Jenkins, ArgoCD, Github Actions\n• Experience using monitoring solutions like DataDog/ NewRelic, CloudWatch, ELK Stack, Prometheus/Grafana\n• Experience with DevOps tools like Terraform, Ansible\n• AWS, GCP, Azure certification(s) is a plus\n• Previous experience of working in a startup\n• Love for sports\n\nDream Sports is India’s leading sports technology company with 250 million users, housing brands such as Dream11, the world’s largest fantasy sports platform, FanCode, India’s digital sports destination, and DreamSetGo, a sports experiences platform. Dream Sports is based in Mumbai and has a workforce of close to 1,000 ‘Sportans’. Founded in 2008 by Harsh Jain and Bhavit Sheth, Dream Sports’ vision is to ‘Make Sports Better’ for fans through the confluence of sports and technology. For more information: https://dreamsports.group/"

`;

export default function AnalysisPage() {
  const {
    mutateAsync: analyze,
    isPending,
    data,
  } = useLLMComprehensiveAnalysis();

  // Hard-coded sample payload (replace with form values)
  const payload = {
    resume: SAMPLE_RESUME_TEXT,
    job_description: SAMPLE_JD_TEXT,
  };

  return (
    <main className="mx-auto max-w-7xl p-6">
      <button
        onClick={() => analyze(payload)}
        disabled={isPending}
        className="rounded bg-indigo-600 px-6 py-2 font-medium text-white disabled:opacity-50"
      >
        {isPending ? "Analyzing …" : "Run Analysis"}
      </button>

      {data && (
        <div className="mt-8">
          <AnalysisDashboard result={data} />
        </div>
      )}
    </main>
  );
}
