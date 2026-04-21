import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-teal-600",
  iconBg = "bg-teal-100",
  trend,
  className,
}: MetricCardProps) {
  const isPositive = trend && trend.value >= 0;

  return (
    <Card className={cn("relative overflow-hidden p-5", className)}>
      {/* Gradient decoration */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-teal-500/10 to-transparent" />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-zinc-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-zinc-950">{value}</p>
          {subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}

          {/* Trend */}
          {trend && (
            <div className="mt-3 flex items-center gap-1">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-rose-600" />
              )}
              <span
                className={cn(
                  "text-sm font-medium",
                  isPositive ? "text-emerald-600" : "text-rose-600"
                )}
              >
                {isPositive ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-sm text-zinc-500">{trend.label}</span>
            </div>
          )}
        </div>

        {/* Icon */}
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", iconBg)}>
          <Icon className={cn("h-6 w-6", iconColor)} />
        </div>
      </div>
    </Card>
  );
}

interface MetricGridProps {
  children: React.ReactNode;
}

export function MetricGrid({ children }: MetricGridProps) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{children}</div>;
}
