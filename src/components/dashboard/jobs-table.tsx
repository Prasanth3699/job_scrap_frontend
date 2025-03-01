"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useJobs } from "@/hooks/use-jobs";
import { Pagination, PaginationItemType } from "@heroui/pagination";
import { PaginationItemRenderProps } from "@heroui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Job } from "@/types/";

export function JobsTable() {
  const { jobs, isLoading } = useJobs();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  // Ensure we are working with an array
  const jobList = Array.isArray(jobs) ? jobs : jobs?.data || [];

  // Filter jobs based on search

  const filteredJobs = jobList?.filter((job: { job_title: string }) =>
    job?.job_title?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil((filteredJobs?.length || 0) / jobsPerPage);

  const paginatedJobs =
    filteredJobs?.slice(
      (currentPage - 1) * jobsPerPage,
      currentPage * jobsPerPage
    ) || [];

  // HeroUI Pagination Custom Render
  const renderPaginationItem = ({
    ref,
    key,
    value,
    isActive,
    onNext,
    onPrevious,
    setPage,
  }: PaginationItemRenderProps) => {
    if (value === PaginationItemType.NEXT) {
      return (
        <button
          key={key}
          className={`bg-gray-200 dark:bg-gray-700 min-w-8 w-8 h-8 rounded-md flex items-center justify-center`}
          onClick={onNext}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4 text-white" />
        </button>
      );
    }

    if (value === PaginationItemType.PREV) {
      return (
        <button
          key={key}
          className={`bg-gray-200 dark:bg-gray-700 min-w-8 w-8 h-8 rounded-md flex items-center justify-center`}
          onClick={onPrevious}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4 text-white" />
        </button>
      );
    }

    if (value === PaginationItemType.DOTS) {
      return (
        <span key={key} className="px-2">
          ...
        </span>
      );
    }

    return (
      <button
        key={key}
        ref={ref}
        className={`px-3 py-1 rounded-md ${
          isActive
            ? "bg-blue-600 text-white font-bold"
            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
        }`}
        onClick={() => setPage(value)}
      >
        {value}
      </button>
    );
  };

  return (
    <div className="space-y-6 bg-white dark:bg-neutral-900 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      {/* Search & Export */}
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // Reset page when searching
          }}
          className="w-64 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-400 text-sm shadow-sm bg-gray-50 dark:bg-gray-800"
        />
        <Button className="px-5 w-1/6 items-end mx-auto py-2 text-sm text-white bg-black hover:bg-gray-800 rounded-md">
          Export
        </Button>
      </div>

      {/* Job Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <Table className="w-full border-collapse">
          <TableHeader className="bg-gray-100 dark:bg-gray-800 border-b dark:border-gray-600">
            <TableRow>
              <TableHead className="p-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                Company Name
              </TableHead>
              <TableHead className="p-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                Title
              </TableHead>
              <TableHead className="p-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                Type
              </TableHead>
              <TableHead className="p-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                Salary
              </TableHead>
              <TableHead className="p-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                Experience
              </TableHead>
              <TableHead className="p-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                Posted Date
              </TableHead>
              <TableHead className="p-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-gray-500"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : !paginatedJobs.length ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-gray-500"
                >
                  No jobs found
                </TableCell>
              </TableRow>
            ) : (
              paginatedJobs.map((job: Job) => (
                <TableRow
                  key={job.id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <TableCell className="p-3">{job.company_name}</TableCell>
                  <TableCell className="p-3">{job.job_title}</TableCell>
                  <TableCell className="p-3">{job.job_type}</TableCell>
                  <TableCell className="p-3">{job.salary}</TableCell>
                  <TableCell className="p-3">{job.experience}</TableCell>
                  <TableCell className="p-3">
                    {new Date(job.posting_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="p-3 text-right">
                    <Button
                      className="px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                      onClick={() => window.open(job.apply_link, "_blank")}
                    >
                      Apply
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* HeroUI Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6">
          <Pagination
            disableCursorAnimation
            showControls
            className="gap-2"
            initialPage={1}
            page={currentPage}
            total={totalPages}
            onChange={setCurrentPage}
            radius="full"
            renderItem={renderPaginationItem}
            variant="light"
          />
        </div>
      )}
    </div>
  );
}
