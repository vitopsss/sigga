import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

const InputGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("relative flex items-center", className)} {...props} />
  )
);
InputGroup.displayName = "InputGroup";

const InputGroupInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <Input
      ref={ref}
      className={cn("rounded-l-xl border-l-0 pl-0 focus-visible:ring-0 focus-visible:ring-offset-0", className)}
      {...props}
    />
  )
);
InputGroupInput.displayName = "InputGroupInput";

const InputGroupAddon = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex h-11 items-center justify-center rounded-l-xl border border-r-0 border-zinc-300 bg-zinc-50 px-3 text-zinc-400",
        className
      )}
      {...props}
    />
  )
);
InputGroupAddon.displayName = "InputGroupAddon";

export { InputGroup, InputGroupInput, InputGroupAddon };
