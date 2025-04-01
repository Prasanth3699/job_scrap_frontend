// components/ml/analytics/SalaryComparisonTool.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSalaryComparison } from "@/hooks/ml/analytics/use-salary-comparison";
import { Progress } from "@/components/ui/progress";

export function SalaryComparisonTool() {
  const {
    currentSalary,
    setCurrentSalary,
    jobTitle,
    setJobTitle,
    location,
    setLocation,
    result,
    compare,
    isLoading,
  } = useSalaryComparison();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Salary Comparison</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Salary</label>
            <Input
              type="number"
              value={currentSalary}
              onChange={(e) => setCurrentSalary(Number(e.target.value))}
              placeholder="Enter your current salary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Job Title</label>
            <Input
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Enter job title"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Location</label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="new-york">New York</SelectItem>
              <SelectItem value="san-francisco">San Francisco</SelectItem>
              <SelectItem value="london">London</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={compare} disabled={isLoading}>
          {isLoading ? "Comparing..." : "Compare to Market"}
        </Button>

        {result && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Your Salary</span>
              <span className="font-bold">
                ${currentSalary.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Market Median</span>
              <span className="font-bold">
                ${result.data.market_median.toLocaleString()}
              </span>
            </div>

            {result.data.location_adjusted && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Location Adjusted ({location})
                </span>
                <span className="font-bold">
                  ${result.data.location_adjusted.toLocaleString()}
                </span>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Percentile</span>
                <span>{result.data.percentile}th</span>
              </div>
              <Progress value={result.data.percentile} className="h-2" />
            </div>

            <div
              className={`p-3 rounded-md text-center ${
                result.data.comparison.includes("below")
                  ? "bg-yellow-100 text-yellow-800"
                  : result.data.comparison.includes("above")
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {result.data.comparison}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
