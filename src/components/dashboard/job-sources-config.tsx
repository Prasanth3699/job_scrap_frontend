"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useJobSources } from "@/hooks/jobs/use-job-sources";
import type { JobSource, JobSourceUpdateData, ScrapingConfig } from "@/types";

// Define the schema
const jobSourceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Must be a valid URL"),
  is_active: z.boolean(),
  scraping_config: z.object({
    max_jobs: z.number().min(1, "Must be at least 1"),
    scroll_pause_time: z.number().min(0.1, "Must be at least 0.1"),
    element_timeout: z.number().min(1, "Must be at least 1"),
  }),
});

type JobSourceFormValues = z.infer<typeof jobSourceSchema>;

export function JobSourcesConfig() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<JobSource | null>(null);

  const {
    sources,
    createSource,
    updateSource,
    deleteSource,
    triggerScrape,
    isLoading,
    isUpdating,
  } = useJobSources();

  const form = useForm<JobSourceFormValues>({
    resolver: zodResolver(jobSourceSchema),
    defaultValues: {
      name: "",
      url: "",
      is_active: true,
      scraping_config: {
        max_jobs: 20,
        scroll_pause_time: 1,
        element_timeout: 5,
      },
    },
  });

  useEffect(() => {
    if (editingSource) {
      form.reset({
        name: editingSource.name,
        url: editingSource.url,
        is_active: editingSource.is_active,
        scraping_config: editingSource.scraping_config,
      });
    } else {
      form.reset({
        name: "",
        url: "",
        is_active: true,
        scraping_config: {
          max_jobs: 20,
          scroll_pause_time: 1,
          element_timeout: 5,
        },
      });
    }
  }, [editingSource, form]);

  const handleSubmit = form.handleSubmit((data: JobSourceFormValues) => {
    if (editingSource) {
      const updates: JobSourceUpdateData = {};

      // Compare simple fields
      if (data.name !== editingSource.name) updates.name = data.name;
      if (data.url !== editingSource.url) updates.url = data.url;
      if (data.is_active !== editingSource.is_active)
        updates.is_active = data.is_active;

      // Compare scraping config values
      const configUpdates: Partial<ScrapingConfig> = {};
      let hasConfigChanges = false;

      (
        Object.keys(data.scraping_config) as Array<keyof ScrapingConfig>
      ).forEach((key) => {
        if (data.scraping_config[key] !== editingSource.scraping_config[key]) {
          configUpdates[key] = data.scraping_config[key];
          hasConfigChanges = true;
        }
      });

      if (hasConfigChanges) {
        updates.scraping_config = configUpdates;
      }

      updateSource(editingSource.id, updates);
    } else {
      createSource(data);
    }
    setIsDialogOpen(false);
    setEditingSource(null);
    form.reset();
  });

  const handleEdit = (source: JobSource) => {
    setEditingSource(source);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-32">
            <p>Loading job sources...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Sources</CardTitle>
        <CardDescription>
          Manage your job scraping sources and configurations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                setEditingSource(null);
                form.reset();
              }
            }}
          >
            <DialogTrigger asChild>
              <Button>Add New Source</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="mb-6">
                <DialogTitle className="text-2xl font-semibold text-white">
                  {editingSource ? "Edit Job Source" : "Add New Job Source"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-5">
                  <div className="space-y-2.5">
                    <label className="text-sm font-medium text-neutral-200">
                      Name
                    </label>
                    <Input
                      {...form.register("name")}
                      placeholder="Enter source name"
                      className="w-full bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 rounded-lg focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600"
                    />
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-sm font-medium text-neutral-200">
                      URL
                    </label>
                    <Input
                      {...form.register("url")}
                      placeholder="https://example.com"
                      className="w-full bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 rounded-lg focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600"
                    />
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-sm font-medium text-neutral-200 block">
                      Active
                    </label>
                    <Switch
                      checked={form.watch("is_active")}
                      onCheckedChange={(checked) =>
                        form.setValue("is_active", checked)
                      }
                      className="bg-neutral-700 data-[state=checked]:bg-blue-600"
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-neutral-200">
                      Scraping Configuration
                    </h3>

                    <div className="space-y-2.5">
                      <label className="text-sm font-medium text-neutral-200">
                        Max Jobs
                      </label>
                      <Input
                        type="number"
                        {...form.register("scraping_config.max_jobs", {
                          valueAsNumber: true,
                        })}
                        className="w-full bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 rounded-lg focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600"
                      />
                    </div>

                    <div className="space-y-2.5">
                      <label className="text-sm font-medium text-neutral-200">
                        Scroll Pause Time (seconds)
                      </label>
                      <Input
                        type="number"
                        step="0.1"
                        {...form.register("scraping_config.scroll_pause_time", {
                          valueAsNumber: true,
                        })}
                        className="w-full bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 rounded-lg focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600"
                      />
                    </div>

                    <div className="space-y-2.5">
                      <label className="text-sm font-medium text-neutral-200">
                        Element Timeout (seconds)
                      </label>
                      <Input
                        type="number"
                        {...form.register("scraping_config.element_timeout", {
                          valueAsNumber: true,
                        })}
                        className="w-full bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 rounded-lg focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-6 border-t border-neutral-800">
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5"
                    disabled={isUpdating}
                  >
                    {isUpdating
                      ? editingSource
                        ? "Updating..."
                        : "Creating..."
                      : editingSource
                      ? "Update Source"
                      : "Create Source"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Scraped</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sources?.map((source) => (
              <TableRow key={source.id}>
                <TableCell>{source.name}</TableCell>
                <TableCell>{source.url}</TableCell>
                <TableCell>
                  <Switch
                    checked={source.is_active}
                    onCheckedChange={(checked) =>
                      updateSource(source.id, { is_active: checked })
                    }
                  />
                </TableCell>
                <TableCell>
                  {source.last_scraped_at
                    ? new Date(source.last_scraped_at).toLocaleString()
                    : "Never"}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 text-sm">
                    <Button onClick={() => handleEdit(source)}>Edit</Button>
                    <Button
                      onClick={() => triggerScrape(source.id)}
                      disabled={!source.is_active || isUpdating}
                    >
                      Scrape Now
                    </Button>
                    <Button
                      onClick={() => deleteSource(source.id)}
                      disabled={isUpdating}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
