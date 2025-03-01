"use client";

import { EmailConfigForm } from "@/components/dashboard/email-config";
import { CronConfigForm } from "@/components/dashboard/cron-cofig";
import { JobSourcesConfig } from "@/components/dashboard/job-sources-config";
import { Cover } from "@/components/ui/cover";

export default function SettingsPage() {
  return (
    <div className="w-full">
      <div className="px-4 md:px-6 py-4 md:py-6">
        <div className=" mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              <Cover> Settings </Cover>
            </h2>
            <p className="text-muted-foreground mt-1">
              Manage your scraper settings and configurations.
            </p>
          </div>

          {/* Job Sources Configuration */}
          <div className="flex flex-col gap-6">
            <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-700 shadow-lg p-4 md:p-6 rounded-lg">
              <JobSourcesConfig />
            </div>

            {/* Settings Forms */}

            {/* Email Configuration */}
            <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-700 shadow-lg p-4 md:p-6 rounded-lg">
              <EmailConfigForm />
            </div>

            {/* Cron Configuration */}
            <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-700 shadow-lg p-4 md:p-6 rounded-lg">
              <CronConfigForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
