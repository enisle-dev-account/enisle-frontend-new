"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { ParameterHistory, LabParameter } from "@/types/laboratory";

// ==================== HISTORICAL CHART ====================
export function HistoricalChart({
  history,
  config,
}: {
  history: ParameterHistory[];
  config: LabParameter;
}) {
  const chartData = history.map((h) => ({
    date: new Date(h.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: typeof h.value === "number" ? h.value : parseFloat(h.value as string) || 0,
    status: h.status,
  }));

  const minValue = config.min || Math.min(...chartData.map((d) => d.value)) * 0.8;
  const maxValue = config.max || Math.max(...chartData.map((d) => d.value)) * 1.2;

  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
        <YAxis domain={[minValue, maxValue]} tick={{ fontSize: 12 }} stroke="#9CA3AF" />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
          }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#3B82F6"
          strokeWidth={2}
          fill="url(#colorValue)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}