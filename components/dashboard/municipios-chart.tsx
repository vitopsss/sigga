"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";

type Props = {
  data: Array<{ name: string; count: number }>;
};

export function MunicipiosChart({ data }: Props) {
  if (!data || data.length === 0) return null;

  return (
    <Card className="p-6">
      <h3 className="mb-6 text-lg font-bold text-zinc-900">UFPAs por Município</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#71717a" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#71717a" }} allowDecimals={false} />
            <Tooltip
              cursor={{ fill: "#f4f4f5" }}
              contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
            />
            <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} name="UFPAs Cadastradas" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
