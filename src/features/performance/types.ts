export interface MetricCardData {
  id: string;
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  trendPositive: boolean;
}

export interface RevenuePerformancePoint {
  month: string;
  actual: number;
  target: number;
}

export interface RetentionByServicePoint {
  service: string;
  threeMonth: number;
  sixMonth: number;
  twelveMonth: number;
}