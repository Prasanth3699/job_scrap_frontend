"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/auth/use-auth";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { login, isLoading } = useAuth(); // no need to subscribe to the whole state

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  /* ---------------------------------------------------------- */
  /* handlers                                                   */
  /* ---------------------------------------------------------- */
  const onSubmit = async (data: LoginFormData) => {
    try {
      /* try to authenticate; store.login() already returns a boolean */
      const ok = await login(data.email, data.password);

      if (ok) {
        /* get the fresh user snapshot from the store */
        const { user } = useAuth.getState();
        router.replace(user?.is_admin ? "/dashboard" : "/landing-page");
      }
    } catch (error) {
      /* login() already shows a toast via handleAuthError, but log anyway */
      console.error("Login error:", error);
    }
  };

  /* ---------------------------------------------------------- */
  /* UI                                                         */
  /* ---------------------------------------------------------- */
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Email ------------------------------------------------ */}
      <div className="space-y-2">
        <Input
          {...register("email")}
          type="email"
          placeholder="Email"
          className="bg-gray-200 dark:bg-black dark:text-white dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500 transition-all"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* Password -------------------------------------------- */}
      <div className="space-y-2">
        <Input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="bg-gray-200 dark:bg-black dark:text-white dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500 transition-all"
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      {/* Submit button --------------------------------------- */}
      <Button
        type="submit"
        className="w-full bg-gray-800 dark:bg-black dark:text-white hover:bg-gray-700 dark:hover:bg-gray-900 transition-all"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Signing in...
          </div>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
}
