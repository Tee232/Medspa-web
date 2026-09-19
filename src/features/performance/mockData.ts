import type { MetricCardData, RetentionByServicePoint, RevenuePerformancePoint } from "./types";

export const performanceMetrics: MetricCardData[] = [
  { id: "monthly-revenue", label: "Monthly Revenue", value: "$128,450", trend: "+12.4%", trendUp: true, trendPositive: true },
  { id: "retention-rate", label: "Retention Rate", value: "68%", trend: "+3.2pt", trendUp: true, trendPositive: true },
  { id: "at-risk-clients", label: "At-Risk Clients", value: "10", trend: "-5", trendUp: false, trendPositive: true },
  { id: "campaign-roi", label: "Campaign ROI", value: "214%", trend: "+18.2%", trendUp: true, trendPositive: true },
];

export const mockRevenuePerformance: RevenuePerformancePoint[] = [
  { month: "Jan", actual: 82000, target: 86000 },
  { month: "Feb", actual: 87500, target: 90000 },
  { month: "Mar", actual: 91800, target: 94000 },
  { month: "Apr", actual: 89300, target: 96000 },
  { month: "May", actual: 96400, target: 99000 },
  { month: "Jun", actual: 101200, target: 104000 },
  { month: "Jul", actual: 97500, target: 104000 },
  { month: "Aug", actual: 103800, target: 108000 },
  { month: "Sep", actual: 111600, target: 112000 },
  { month: "Oct", actual: 108900, target: 116000 },
  { month: "Nov", actual: 118700, target: 122000 },
  { month: "Dec", actual: 128450, target: 132000 },
];

export const mockRetentionByService: RetentionByServicePoint[] = [
  { service: "Botox", threeMonth: 72, sixMonth: 56, twelveMonth: 41 },
  { service: "Fillers", threeMonth: 64, sixMonth: 48, twelveMonth: 35 },
  { service: "Laser", threeMonth: 58, sixMonth: 43, twelveMonth: 30 },
  { service: "HydraFacial", threeMonth: 81, sixMonth: 62, twelveMonth: 47 },
  { service: "Skin Treatments", threeMonth: 66, sixMonth: 51, twelveMonth: 36 },
  { service: "Others", threeMonth: 45, sixMonth: 32, twelveMonth: 21 },
];