"use client";

import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const pieColors = ["#15803d", "#f59e0b", "#0f766e", "#1d4ed8", "#7c3aed", "#be123c"];

type ChartDatum = {
  name: string;
  value: number;
};

export function MunicipioBarChart({ data }: { data: ChartDatum[] }) {
  return (
    <div className="h-80 min-h-80 min-w-0 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
          <Tooltip />
          <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#15803d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AtividadePieChart({ data }: { data: ChartDatum[] }) {
  return (
    <div className="h-80 min-h-80 min-w-0 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={3}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
