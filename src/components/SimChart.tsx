import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from 'recharts';
import { formatKrw, formatKrwFull } from '../simulator';

interface ChartDataPoint {
  label: string;
  평가금: number;
  누적원금: number;
  누적배당: number;
  월배당: number;
}

interface SimChartProps {
  chartData: ChartDataPoint[];
}

const tooltipStyle = {
  background: '#1a1f2b',
  border: '1px solid #2a2f3a',
  borderRadius: 8,
} as const;

export function SimChart({ chartData }: SimChartProps) {
  const interval = Math.max(0, Math.floor(chartData.length / 12) - 1);

  return (
    <>
      <section className="card">
        <h2>자산 성장 추이</h2>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#2a2f3a" strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                stroke="#8b92a5"
                tick={{ fontSize: 11 }}
                interval={interval}
              />
              <YAxis
                stroke="#8b92a5"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => formatKrw(v)}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v) => formatKrwFull(Number(v))}
              />
              <Legend />
              <Line type="monotone" dataKey="평가금" stroke="#4f8cff" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="누적원금" stroke="#8b92a5" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="누적배당" stroke="#4ade80" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="card">
        <h2>월별 세후 배당</h2>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid stroke="#2a2f3a" strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                stroke="#8b92a5"
                tick={{ fontSize: 11 }}
                interval={interval}
              />
              <YAxis
                stroke="#8b92a5"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => formatKrw(v)}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v) => formatKrwFull(Number(v))}
              />
              <Bar dataKey="월배당" fill="#4ade80" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </>
  );
}
