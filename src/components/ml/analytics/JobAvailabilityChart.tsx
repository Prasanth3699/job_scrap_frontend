// components/ml/analytics/JobAvailabilityChart.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useJobAvailability } from "@/hooks/ml/analytics/use-job-availability";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function JobAvailabilityChart() {
  const { data, isLoading, error } = useJobAvailability();

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle>Job Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Failed to load data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Availability Trends</CardTitle>
        {data?.data?.time_period && (
          <p className="text-sm text-muted-foreground">
            {data.data.time_period}
          </p>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data?.data?.trends || []}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="open_positions"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="filled_positions"
                  stroke="#82ca9d"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
