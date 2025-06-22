// components/ui/Card.tsx  – reusable glass card
import clsx from "clsx";
import { ReactNode } from "react";

export default function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-white/10 bg-backdrop p-6 shadow-md shadow-black/30",
        "backdrop-blur-lg transition hover:shadow-glow",
        className
      )}
    >
      {children}
    </div>
  );
}
