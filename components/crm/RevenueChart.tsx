"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { revenue } from "./data";

/** The one gradient stroke the brief allows in the CRM. Draws on when `draw` flips true. */
export function RevenueChart({ months, draw }: { months: string[]; draw: boolean }) {
  const [animate, setAnimate] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { if (draw) setAnimate(true); }, [draw]);
  const data = revenue.map((d) => ({ ...d, name: months[d.m] ?? "" }));
  return (
    <div className="h-[150px] md:h-[190px] w-full" aria-hidden="true">
      {!mounted ? null : (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={animate ? data : data.map((d) => ({ ...d, v: 0 }))} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="crm-stroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6E3BFF" />
              <stop offset="50%" stopColor="#FF7A6B" />
              <stop offset="100%" stopColor="#35E3F0" />
            </linearGradient>
            <linearGradient id="crm-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6E3BFF" stopOpacity={0.16} />
              <stop offset="100%" stopColor="#35E3F0" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" tick={{ fill: "rgba(245,241,234,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} interval={0} />
          <YAxis tick={{ fill: "rgba(245,241,234,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => (v >= 1000 ? `${v / 1000}M` : `${v}K`)} width={48} />
          <Tooltip
            cursor={{ stroke: "rgba(255,255,255,0.15)" }}
            contentStyle={{ background: "#0A0A0B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12, color: "#F5F1EA" }}
            formatter={(v) => [`${Number(v) >= 1000 ? (Number(v) / 1000).toFixed(1) + "M" : v + "K"} MDL`, ""]}
            labelStyle={{ color: "rgba(245,241,234,0.6)" }}
          />
          <Area type="monotone" dataKey="v" stroke="url(#crm-stroke)" strokeWidth={2} fill="url(#crm-fill)" dot={false} isAnimationActive animationDuration={1600} animationEasing="ease-out" />
        </AreaChart>
      </ResponsiveContainer>
      )}
    </div>
  );
}
