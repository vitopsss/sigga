import * as React from "react";
import { cn } from "@/lib/utils";

interface EmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

const Empty = React.forwardRef<HTMLDivElement, EmptyProps>(
  ({ className, icon, title, description, action, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}
      {...props}
    >
      {icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
          {icon}
        </div>
      )}
      {title && <h3 className="mb-1 text-lg font-semibold text-zinc-900">{title}</h3>}
      {description && <p className="mb-4 max-w-sm text-sm text-zinc-500">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
      {children}
    </div>
  )
);
Empty.displayName = "Empty";

const EmptyIcon = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400", className)} {...props} />
  )
);
EmptyIcon.displayName = "EmptyIcon";

const EmptyTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("mb-1 text-lg font-semibold text-zinc-900", className)} {...props} />
  )
);
EmptyTitle.displayName = "EmptyTitle";

const EmptyDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("mb-4 max-w-sm text-sm text-zinc-500", className)} {...props} />
  )
);
EmptyDescription.displayName = "EmptyDescription";

const EmptyActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mt-2 flex gap-2", className)} {...props} />
  )
);
EmptyActions.displayName = "EmptyActions";

export { Empty, EmptyIcon, EmptyTitle, EmptyDescription, EmptyActions };
