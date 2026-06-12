import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-zinc-950 text-white hover:bg-zinc-800 shadow-md shadow-zinc-950/20",
        primary: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20",
        secondary: "bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900 shadow-sm",
        destructive: "bg-rose-600 text-white hover:bg-rose-500 shadow-sm",
        outline: "border border-zinc-300 bg-transparent text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900",
        ghost: "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950",
        link: "text-emerald-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-12 rounded-2xl px-8",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
