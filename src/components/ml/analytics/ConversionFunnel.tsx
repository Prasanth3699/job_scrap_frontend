// components/ml/analytics/ConversionFunnel.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserEngagement } from "@/hooks/ml/analytics/use-user-engagement";
import {
  Funnel,
  FunnelChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export function ConversionFunnel() {
  const { data, isLoading, error } = useUserEngagement();

  const funnelData = data?.data?.conversion_funnel
    ? [
        { name: "Impressions", value: data.data.conversion_funnel.impression },
        { name: "Clicks", value: data.data.conversion_funnel.click },
        { name: "Applications", value: data.data.conversion_funnel.apply },
        { name: "Hires", value: data.data.conversion_funnel.hired },
      ]
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : error ? (
          <p className="text-destructive">Failed to load data</p>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip />
                <Funnel
                  dataKey="value"
                  data={funnelData}
                  isAnimationActive
                  lastShapeType="rectangle"
                >
                  <LabelList
                    position="right"
                    fill="#000"
                    stroke="none"
                    dataKey="name"
                  />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>

            <div className="mt-4 grid grid-cols-4 gap-4 text-center">
              {data?.data?.conversion_rates && (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      View → Click
                    </p>
                    <p className="font-medium">
                      {Math.round(
                        (data.data.conversion_rates.impression_to_click || 0) *
                          100
                      )}
                      %
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Click → Apply
                    </p>
                    <p className="font-medium">
                      {Math.round(
                        (data.data.conversion_rates.click_to_apply || 0) * 100
                      )}
                      %
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Apply → Hire
                    </p>
                    <p className="font-medium">
                      {Math.round(
                        (data.data.conversion_rates.apply_to_hired || 0) * 100
                      )}
                      %
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Overall</p>
                    <p className="font-medium">
                      {Math.round(
                        (data.data.conversion_rates.impression_to_click || 0) *
                          (data.data.conversion_rates.click_to_apply || 0) *
                          (data.data.conversion_rates.apply_to_hired || 0) *
                          10000
                      ) / 100}
                      %
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
