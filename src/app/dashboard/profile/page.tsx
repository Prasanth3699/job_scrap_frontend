"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Cover } from "@/components/ui/cover";

import { UserCircle, Mail, Lock, Key, User, Shield } from "lucide-react";

// Profile Schema Validation
const profileSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    currentPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional(),
    confirmNewPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword !== data.confirmNewPassword) {
        return false;
      }
      return true;
    },
    {
      message: "New passwords don't match",
      path: ["confirmNewPassword"],
    }
  );

export default function ProfilePage() {
  const { user, updateProfile, isAuthenticated } = useAuth();

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    try {
      await updateProfile(data);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <>
      {/* Main Content */}
      <div className="flex-1 p-6  pb-16 overflow-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            <Cover> Profile Settings </Cover>
          </h1>

          {/* User Info Section */}
          <Card className="bg-white dark:bg-neutral-900 shadow-lg border border-gray-200 dark:border-gray-700">
            <CardHeader className="flex items-center space-x-4">
              {/* Profile Image Placeholder */}
              <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <UserCircle className="h-10 w-10 text-gray-500 dark:text-gray-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {user?.name || "Guest User"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {user?.email || "user@example.com"}
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
                  <Shield className="h-4 w-4" /> Standard User
                </p>
              </div>
            </CardHeader>
          </Card>

          {/* Form Section */}
          <Card className="bg-white dark:bg-neutral-900 shadow-lg border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-800 dark:text-white">
                Update Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="relative">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Name
                    </label>
                    <div className="relative">
                      <Input {...form.register("name")} className="pl-10" />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <div className="relative">
                      <Input
                        {...form.register("email")}
                        type="email"
                        className="pl-10"
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Current Password */}
                  <div className="relative">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Current Password
                    </label>
                    <div className="relative">
                      <Input
                        {...form.register("currentPassword")}
                        type="password"
                        className="pl-10"
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="relative">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      New Password (Optional)
                    </label>
                    <div className="relative">
                      <Input
                        {...form.register("newPassword")}
                        type="password"
                        className="pl-10"
                      />
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="relative">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Input
                      {...form.register("confirmNewPassword")}
                      type="password"
                      className="pl-10"
                    />
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full px-5 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition"
                >
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
