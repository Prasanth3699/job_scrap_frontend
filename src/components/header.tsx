import { cn } from "@/lib/utils";

interface DashboardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: string;
  text?: string;
}

export function DashboardHeader({
  heading,
  text,
  className,
  ...props
}: DashboardHeaderProps) {
  return (
    <div className={cn("space-y-1", className)} {...props}>
      <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}
