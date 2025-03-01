"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner"; // ✅ Import toast

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    reset, // ✅ Get reset function to clear form fields
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const success = await registerUser(data.name, data.email, data.password);

      if (success) {
        toast.success("Registration Successful! 🎉"); // ✅ Show success toast

        reset(); // ✅ Clear form fields after success

        setTimeout(() => {
          router.push("/login"); // ✅ Redirect after clearing inputs
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

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-gray-800 dark:bg-black dark:text-white hover:bg-gray-700 dark:hover:bg-gray-900 transition-all"
        disabled={isLoading}
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
}
