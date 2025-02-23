"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/button:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/button:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          `relative flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md
          text-white bg-gray-800 dark:bg-black shadow-lg 
          hover:bg-gray-700 dark:hover:bg-gray-900 
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all group/button`,
          className
        )}
        {...props}
      >
        {children}
        <BottomGradient />
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
