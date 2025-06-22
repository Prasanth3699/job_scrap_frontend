"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { DashboardStats, ScrapingHistory } from "@/types";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { statsApi } from "@/lib/api/stats-api";

const COLORS = ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"];

export function AnalyticsCharts({ data }: { data: DashboardStats }) {
  const { data: history } = useQuery<ScrapingHistory>({
    queryKey: ["scraping-history"],
    queryFn: statsApi.getScrapingHistory,
    refetchInterval: 30000,
  });

  // Convert success rate values to percentage format
  const formattedSuccessRate = data.successRate.map((entry) => ({
    ...entry,
    value: parseFloat(entry.value.toFixed(2)), // Round to 2 decimal places
    percentage: `${Math.round(entry.value)}%`, // Whole number percentage for display
  }));

  return (
    <div className="space-y-6">
      {/* Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Jobs Scraped Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {history?.jobsOverTime && history.jobsOverTime.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={history.jobsOverTime}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#374151"
                    opacity={0.1}
                  />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => format(new Date(value), "MMM d")}
                    stroke="#6B7280"
                  />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      borderColor: "#374151",
                      borderRadius: "0.5rem",
                      color: "#F9FAFB",
                    }}
                    labelFormatter={(value) =>
                      format(new Date(value), "MMMM d, yyyy")
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#2563EB"
                    strokeWidth={3}
                    dot={{ fill: "#2563EB", strokeWidth: 2 }}
                    activeDot={{
                      r: 6,
                      fill: "#2563EB",
                      stroke: "#FFFFFF",
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bar Chart and Pie Chart Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Jobs by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.jobsByCategory}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis
                    dataKey="name"
                    stroke="#6B7280"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis stroke="#6B7280" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      borderColor: "#374151",
                      borderRadius: "0.5rem",
                      color: "#F9FAFB",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="#2563eb"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        {/* <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Jobs by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.jobsByCategory}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis
                    dataKey="name"
                    stroke="#6B7280"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis stroke="#6B7280" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      borderColor: "#374151",
                      borderRadius: "0.5rem",
                      color: "#F9FAFB",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="#36a2eb"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card> */}

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Success Rate Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={formattedSuccessRate}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    label={({ name, percentage }) => `${name}: ${percentage}`}
                  >
                    {formattedSuccessRate.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `${value}%`}
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      borderColor: "#374151",
                      borderRadius: "0.5rem",
                      color: "#F9FAFB",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
