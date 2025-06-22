// components/ml/analytics/SkillDemandCard.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useSkillDemand } from "@/hooks/ml/analytics/use-skill-demand";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function SkillDemandCard() {
  const { data, isLoading, error } = useSkillDemand();

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle>Skill Demand</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Failed to load data</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data?.top_skills
    ? Object.entries(data.top_skills)
        .slice(0, 10)
        .map(([skill, count]) => ({ skill, count }))
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top In-Demand Skills</CardTitle>
        {data?.time_period && (
          <p className="text-sm text-muted-foreground">
            {data.time_period} • {data.total_jobs_analyzed} jobs analyzed
          </p>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <div className="flex flex-col gap-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="skill" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap gap-2">
              {data?.skill_categories?.slice(0, 5).map(([skill]) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
