import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-teal-600 text-white",
        success: "border-transparent bg-emerald-500/15 text-emerald-700",
        warning: "border-transparent bg-amber-500/15 text-amber-700",
        info: "border-transparent bg-sky-500/15 text-sky-700",
        destructive: "border-transparent bg-rose-500/15 text-rose-700",
        "success-subtle": "border border-emerald-200 bg-emerald-50/70 text-emerald-700",
        "warning-subtle": "border border-amber-200 bg-amber-50/70 text-amber-700",
        "destructive-subtle": "border border-rose-200 bg-rose-50/70 text-rose-700",
        outline: "border border-zinc-300 bg-transparent text-zinc-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
