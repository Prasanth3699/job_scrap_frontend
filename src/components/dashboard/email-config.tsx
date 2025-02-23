"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSettings } from "@/hooks/use-settings";
import { useEffect } from "react";

const emailConfigSchema = z.object({
  smtp_server: z.string().min(1, "SMTP server is required"),
  smtp_port: z.number().min(1, "SMTP port is required"),
  email_sender: z.string().email("Invalid sender email"),
  email_password: z.string().min(1, "Password is required"),
  email_receiver: z.string().email("Invalid receiver email"),
});

type EmailConfigForm = z.infer<typeof emailConfigSchema>;

export function EmailConfigForm() {
  const { emailConfig, updateEmailConfig, isUpdating, isLoading } =
    useSettings();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailConfigForm>({
    resolver: zodResolver(emailConfigSchema),
    defaultValues: {
      smtp_server: "smtp.gmail.com",
      smtp_port: 587,
      email_sender: "",
      email_password: "",
      email_receiver: "",
    },
  });

  useEffect(() => {
    if (emailConfig) {
      reset(emailConfig);
    }
  }, [emailConfig, reset]);

  const onSubmit = (data: EmailConfigForm) => {
    updateEmailConfig(data);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">SMTP Server</label>
              <Input
                {...register("smtp_server")}
                placeholder="smtp.gmail.com"
                error={errors.smtp_server?.message}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">SMTP Port</label>
              <Input
                {...register("smtp_port", { valueAsNumber: true })}
                type="number"
                placeholder="587"
                error={errors.smtp_port?.message}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Sender Email</label>
              <Input
                {...register("email_sender")}
                type="email"
                placeholder="your@email.com"
                error={errors.email_sender?.message}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Password</label>
              <Input
                {...register("email_password")}
                type="password"
                placeholder="App password for Gmail"
                error={errors.email_password?.message}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Receiver Email</label>
            <Input
              {...register("email_receiver")}
              type="email"
              placeholder="receiver@email.com"
              error={errors.email_receiver?.message}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isUpdating}>
            {isUpdating ? "Saving..." : "Save Email Configuration"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
