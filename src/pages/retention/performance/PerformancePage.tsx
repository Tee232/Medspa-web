import type { ReactNode } from "react";
import { AlertTriangle, DollarSign, TrendingDown, TrendingUp, UserCheck } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { performanceMetrics, mockRevenuePerformance, mockRetentionByService } from "@/features/performance/mockData";
import type { MetricCardData } from "@/features/performance/types";
import { cn } from "@/lib/utils";

const [monthlyRevenue, retentionRate, atRiskClients, campaignROI] = performanceMetrics;

const AXIS_TICK = { fill: "#9CA3AF", fontSize: 11, fontFamily: "DM Sans" } as const;

const TOOLTIP_STYLE = {
  borderRadius: 12,
  border: "1px solid #E5E7EB",
  fontFamily: "DM Sans",
  fontSize: 13,
} as const;

function MetricCard({ metric, icon, iconBg, iconColor }: { metric: MetricCardData; icon: ReactNode; iconBg: string; iconColor: string }) {
  return (
    <div className="rounded-[20px] border border-[#E8E4DF] bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px]" style={{ backgroundColor: iconBg, color: iconColor }}>
          {icon}
        </div>
        <span
          className={cn(
            "flex items-center gap-1 rounded-full px-2 py-0.5 font-body text-xs font-semibold",
            metric.trendPositive ? "bg-[#E8F4F0] text-[#1A6B52]" : "bg-[#FEE2E2] text-[#DC2626]"
          )}
        >
          {metric.trendUp ? <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" /> : <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />}
          {metric.trend}
        </span>
      </div>
      <div className="mt-4 font-heading text-2xl font-extrabold leading-none text-[#1C1C1A]">{metric.value}</div>
      <div className="mt-1.5 font-body text-xs text-[#6B7280]">{metric.label}</div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 font-body text-xs text-[#6B7280]">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
      {label}
    </span>
  );
}

function ChartCard({ title, subtitle, legend, children }: { title: string; subtitle: string; legend?: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-[20px] border border-[#E8E4DF] bg-white p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-heading text-sm font-bold text-[#1C1C1A]">{title}</h3>
          <p className="mt-0.5 font-body text-xs text-[#6B7280]">{subtitle}</p>
        </div>
        {legend && <div className="flex flex-wrap items-center gap-3">{legend}</div>}
      </div>
      {children}
    </div>
  );
}

export function PerformancePage() {
  return (
    <div>
      <div className="mb-5">
        <h2 className="font-heading text-xl font-bold text-[#1C1C1A]">Performance & Analytics</h2>
        <p className="mt-0.5 font-body text-sm text-[#6B7280]">Revenue, retention, and campaign ROI across the clinic.</p>
      </div>

      {/* Top Metrics */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard metric={monthlyRevenue} icon={<DollarSign className="h-[18px] w-[18px]" aria-hidden="true" />} iconBg="#E8F4F0" iconColor="#1A6B52" />
        <MetricCard metric={retentionRate} icon={<UserCheck className="h-[18px] w-[18px]" aria-hidden="true" />} iconBg="#F0FDF4" iconColor="#16A34A" />
        <MetricCard metric={atRiskClients} icon={<AlertTriangle className="h-[18px] w-[18px]" aria-hidden="true" />} iconBg="#FEF9EC" iconColor="#C9A96E" />
        <MetricCard metric={campaignROI} icon={<TrendingUp className="h-[18px] w-[18px]" aria-hidden="true" />} iconBg="#EFF6FF" iconColor="#3B82F6" />
      </div>

      <div className="space-y-5">
        {/* Revenue Performance */}
        <ChartCard
          title="Revenue Performance"
          subtitle="Monthly actual vs target · Jan – Dec 2026"
          legend={
            <>
              <LegendItem color="#1A6B52" label="Actual Revenue" />
              <LegendItem color="#C9A96E" label="Target Revenue" />
            </>
          }
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockRevenuePerformance} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={AXIS_TICK} tickMargin={10} interval={0} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={AXIS_TICK}
                  tickFormatter={(value: number) => `$${Math.round(value / 1000)}k`}
                  width={52}
                />
                <Tooltip
                  cursor={{ stroke: "#E5E7EB" }}
                  contentStyle={TOOLTIP_STYLE}
                  formatter={(value: number | string, name: string) => [`$${Number(value).toLocaleString()}`, name]}
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  name="Actual Revenue"
                  stroke="#1A6B52"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#FFFFFF", stroke: "#1A6B52", strokeWidth: 2 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  name="Target Revenue"
                  stroke="#C9A96E"
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  dot={{ r: 3, fill: "#FFFFFF", stroke: "#C9A96E", strokeWidth: 2 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Retention by Service */}
        <ChartCard
          title="Retention by Service"
          subtitle="Return rate by treatment category"
          legend={
            <>
              <LegendItem color="#1A6B52" label="3-Month Return Rate" />
              <LegendItem color="#C9A96E" label="6-Month Return Rate" />
              <LegendItem color="#3B82F6" label="12-Month Return Rate" />
            </>
          }
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockRetentionByService} margin={{ top: 10, right: 12, left: 0, bottom: 0 }} barCategoryGap="24%">
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" vertical={false} />
                <XAxis dataKey="service" tickLine={false} axisLine={false} tick={AXIS_TICK} tickMargin={10} interval={0} />
                <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickLine={false} axisLine={false} tick={AXIS_TICK} tickFormatter={(value: number) => `${value}%`} width={40} />
                <Tooltip
                  cursor={{ fill: "#FAFAF9" }}
                  contentStyle={TOOLTIP_STYLE}
                  formatter={(value: number | string, name: string) => [`${value}%`, name]}
                />
                <Bar dataKey="threeMonth" name="3-Month Return Rate" fill="#1A6B52" radius={[6, 6, 0, 0]} />
                <Bar dataKey="sixMonth" name="6-Month Return Rate" fill="#C9A96E" radius={[6, 6, 0, 0]} />
                <Bar dataKey="twelveMonth" name="12-Month Return Rate" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}