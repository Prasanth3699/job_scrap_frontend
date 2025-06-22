import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const progressVariants = cva("h-full w-full flex-1 bg-primary transition-all", {
  variants: {
    variant: {
      default: "bg-primary",
      destructive: "bg-destructive",
      success: "bg-green-500",
      premium: "bg-gradient-to-r from-purple-500 to-pink-500",
      restricted: "bg-red-900",
    },
    size: {
      default: "h-2",
      sm: "h-1",
      lg: "h-4",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {
  value?: number;
  max?: number;
  restricted?: boolean;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    { className, value = 0, max = 100, variant, size, restricted, ...props },
    ref
  ) => {
    // Validate and sanitize input values
    const safeValue = Math.min(Math.max(Number(value) || 0, 0), max);
    const safeMax = Math.max(Number(max) || 100, 1);
    const percentage = Math.round((safeValue / safeMax) * 100);

    // Apply restricted styling if needed
    const appliedVariant = restricted ? "restricted" : variant;

    return (
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(progressVariants({ variant: appliedVariant, size }))}
          style={{
            transform: `translateX(-${100 - percentage}%)`,
            width: `${percentage}%`,
          }}
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </ProgressPrimitive.Root>
    );
  }
);
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress, progressVariants };
