// components/forms/register-form.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch"; // Add this if you don't have it

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    isAdmin: z.boolean().default(false),
    adminSecretKey: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.isAdmin && !data.adminSecretKey) {
        return false;
      }
      return true;
    },
    {
      message: "Admin secret key is required for admin registration",
      path: ["adminSecretKey"],
    }
  );

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const { register: registerUser, registerAdmin } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      isAdmin: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      let success;

      if (data.isAdmin && data.adminSecretKey) {
        success = await registerAdmin(
          data.name,
          data.email,
          data.password,
          data.adminSecretKey
        );
      } else {
        success = await registerUser(data.name, data.email, data.password);
      }

      if (success) {
        toast.success(
          `${data.isAdmin ? "Admin" : ""} Registration Successful! 🎉`
        );
        reset();
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      } else {
        toast.error("Registration failed ❌");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Full Name Input */}
      <div className="space-y-2">
        <Input
          {...register("name")}
          placeholder="Full Name"
          className="bg-gray-200 dark:bg-black dark:text-white dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500 transition-all"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* Email Input */}
      <div className="space-y-2">
        <Input
          {...register("email")}
          type="email"
          placeholder="Email"
          className="bg-gray-200 dark:bg-black dark:text-white dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500 transition-all"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <Input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="bg-gray-200 dark:bg-black dark:text-white dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500 transition-all"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password Input */}
      <div className="space-y-2">
        <Input
          {...register("confirmPassword")}
          type="password"
          placeholder="Confirm Password"
          className="bg-gray-200 dark:bg-black dark:text-white dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500 transition-all"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Admin Toggle */}
      <div className="flex items-center space-x-2">
        <Switch
          id="admin-mode"
          checked={isAdmin}
          onCheckedChange={(checked) => {
            setIsAdmin(checked);
            setValue("isAdmin", checked);
            if (!checked) {
              setValue("adminSecretKey", "");
            }
          }}
        />
        <label
          htmlFor="admin-mode"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Register as Admin
        </label>
      </div>

      {/* Admin Secret Key Input - Only shown when isAdmin is true */}
      {isAdmin && (
        <div className="space-y-2">
          <Input
            {...register("adminSecretKey")}
            type="password"
            placeholder="Admin Secret Key"
            className="bg-gray-200 dark:bg-black dark:text-white dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500 transition-all"
          />
          {errors.adminSecretKey && (
            <p className="text-red-500 text-sm">
              {errors.adminSecretKey.message}
            </p>
          )}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-gray-800 dark:bg-black dark:text-white hover:bg-gray-700 dark:hover:bg-gray-900 transition-all"
        disabled={isLoading}
      >
        {isLoading
          ? "Creating Account..."
          : `Create ${isAdmin ? "Admin" : ""} Account`}
      </Button>
    </form>
  );
}
