"use client";

import { useQuery } from "@tanstack/react-query";
import { statsApi } from "@/lib/api";
import { ScrapingHistory } from "@/types";
import { format } from "date-fns";
import { formatDuration } from "@/lib/utils";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationItemType } from "@heroui/pagination";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Download,
  Clock,
  Database,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaginationItemRenderProps } from "@heroui/pagination";
import { Cover } from "@/components/ui/cover";

export default function HistoryPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { data: history, isLoading } = useQuery<ScrapingHistory>({
    queryKey: ["scraping-history"],
    queryFn: statsApi.getScrapingHistory,
    refetchInterval: 30000,
  });

  // Filter sessions based on search
  const filteredSessions =
    history?.recentSessions?.filter(
      (session) =>
        session.jobsScraped.toString().includes(search) ||
        session.status.toLowerCase().includes(search.toLowerCase())
    ) || [];

  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSessions = filteredSessions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Custom pagination renderer
  const renderPaginationItem = ({
    key,
    value,
    isActive,
    onNext,
    onPrevious,
    setPage,
  }: PaginationItemRenderProps) => {
    if (value === PaginationItemType.NEXT) {
      return (
        <Button
          key={key}
          onClick={onNext}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-1 flex items-center justify-center"
        >
          <ChevronRight className="h-4 w-4 text-white" />
        </Button>
      );
    }

    if (value === PaginationItemType.PREV) {
      return (
        <Button
          key={key}
          onClick={onPrevious}
          disabled={currentPage === 1}
          className="h-8 w-8 p-1 flex items-center justify-center"
        >
          <ChevronLeft className="h-4 w-4 text-white" />
        </Button>
      );
    }

    if (value === PaginationItemType.DOTS) {
      return <span key={key}>...</span>;
    }

    return (
      <Button
        key={key}
        onClick={() => setPage(value)}
        className={`h-8 w-8 ${
          isActive
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "text-gray-600 dark:text-gray-300"
        }`}
      >
        {value}
      </Button>
    );
  };

  return (
    // <DashboardLayout>
    <div className="flex-1 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white font-display">
              <Cover>Scraping History</Cover>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-1 font-medium">
              Track and analyze your scraping performance over time
            </p>
          </div>
          <Button
            onClick={() => {}}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4"
          >
            <Download className="h-5 w-5" />
            Export History
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-10">Loading...</div>
        ) : (
          <>
            {/* Table Section */}
            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white font-display">
                    Scraping Sessions
                  </h3>
                  <div className="relative w-full sm:w-64">
                    <Input
                      placeholder="Search sessions..."
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="pl-10 w-full"
                    />
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>

                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="min-w-[800px] px-4 sm:px-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="text-sm sm:text-base">
                          <TableHead className="w-[100px]">ID</TableHead>
                          <TableHead>Start Time</TableHead>
                          <TableHead>End Time</TableHead>
                          <TableHead>Jobs Found</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedSessions.map((session) => {
                          const startTime = new Date(session.startTime);
                          const endTime = session.endTime
                            ? new Date(session.endTime)
                            : null;
                          const duration = endTime
                            ? (endTime.getTime() - startTime.getTime()) / 1000
                            : null;

                          return (
                            <TableRow
                              key={session.id}
                              className="text-sm sm:text-base"
                            >
                              <TableCell className="font-medium">
                                #{session.id}
                              </TableCell>
                              <TableCell>
                                {format(startTime, "MMM d, yyyy HH:mm:ss")}
                              </TableCell>
                              <TableCell>
                                {endTime
                                  ? format(endTime, "MMM d, yyyy HH:mm:ss")
                                  : "-"}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Database className="h-4 w-4 text-blue-600" />
                                  {session.jobsScraped} jobs
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-gray-500" />
                                  {duration
                                    ? formatDuration(duration)
                                    : "Running"}
                                </div>
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    session.status === "success"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                      : session.status === "running"
                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                  }`}
                                >
                                  {session.status}
                                </span>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-6 overflow-x-auto py-4">
                    <Pagination
                      disableCursorAnimation
                      showControls
                      className="gap-1 sm:gap-2 px-4"
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
            </div>
          </>
        )}
      </div>
    </div>
    // </DashboardLayout>
  );
}
