"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/hooks/auth/use-settings";
import { useEffect } from "react";

const schedulerConfigSchema = z.object({
  scrape_schedule_hour: z.number().min(0).max(23),
  scrape_schedule_minute: z.number().min(0).max(59),
  enabled: z.boolean(),
});

type SchedulerConfigForm = z.infer<typeof schedulerConfigSchema>;

export function CronConfigForm() {
  const { schedulerConfig, updateSchedulerConfig, isUpdating, isLoading } =
    useSettings();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<SchedulerConfigForm>({
    resolver: zodResolver(schedulerConfigSchema),
    defaultValues: {
      scrape_schedule_hour: 9,
      scrape_schedule_minute: 0,
      enabled: true,
    },
  });

  useEffect(() => {
    if (schedulerConfig) {
      reset(schedulerConfig);
    }
  }, [schedulerConfig, reset]);

  const enabled = watch("enabled");

  const onSubmit = (data: SchedulerConfigForm) => {
    updateSchedulerConfig(data);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scheduling Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Enable Scheduling</label>
            <Switch
              checked={enabled}
              onCheckedChange={(checked) => setValue("enabled", checked)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Hour (0-23)</label>
              <Input
                {...register("scrape_schedule_hour", { valueAsNumber: true })}
                type="number"
                min={0}
                max={23}
                disabled={!enabled}
                error={errors.scrape_schedule_hour?.message}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Minute (0-59)</label>
              <Input
                {...register("scrape_schedule_minute", { valueAsNumber: true })}
                type="number"
                min={0}
                max={59}
                disabled={!enabled}
                error={errors.scrape_schedule_minute?.message}
              />
            </div>
          </div>

          <p className="text-sm text-gray-500">
            Set the time when the scraper should run daily. Current schedule:
            {enabled
              ? ` ${watch("scrape_schedule_hour")}:${watch(
                  "scrape_schedule_minute"
                )
                  .toString()
                  .padStart(2, "0")}`
              : " Disabled"}
          </p>

          <Button type="submit" className="w-full" disabled={isUpdating}>
            {isUpdating ? "Saving..." : "Save Schedule Configuration"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
