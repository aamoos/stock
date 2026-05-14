import { useEffect, useRef, useState } from 'react';
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
import { useTheme } from '../hooks/useTheme';

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

const CHART_COLORS = {
  dark: {
    grid: '#2a2f3a',
    axis: '#8b92a5',
    tooltipBg: '#1a1f2b',
    tooltipBorder: '#2a2f3a',
  },
  light: {
    grid: '#dde1ea',
    axis: '#5a6278',
    tooltipBg: '#ffffff',
    tooltipBorder: '#dde1ea',
  },
} as const;

function LazyChart({ children, height }: { children: React.ReactNode; height: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ height, width: '100%' }}>
      {visible ? children : null}
    </div>
  );
}

export function SimChart({ chartData }: SimChartProps) {
  const { theme } = useTheme();
  const colors = CHART_COLORS[theme];
  const interval = Math.max(0, Math.floor(chartData.length / 12) - 1);

  const tooltipStyle = {
    background: colors.tooltipBg,
    border: `1px solid ${colors.tooltipBorder}`,
    borderRadius: 8,
  } as const;

  return (
    <>
      <section className="card">
        <h2>자산 성장 추이</h2>
        <div className="chart-wrap">
          <LazyChart height={320}>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={chartData}>
                <CartesianGrid stroke={colors.grid} strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  stroke={colors.axis}
                  tick={{ fontSize: 11 }}
                  interval={interval}
                />
                <YAxis
                  stroke={colors.axis}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => formatKrw(v)}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v) => formatKrwFull(Number(v))}
                />
                <Legend />
                <Line type="monotone" dataKey="평가금" stroke="#4f8cff" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="누적원금" stroke={colors.axis} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="누적배당" stroke="#4ade80" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </LazyChart>
        </div>
      </section>

      <section className="card">
        <h2>월별 세후 배당</h2>
        <div className="chart-wrap">
          <LazyChart height={260}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <CartesianGrid stroke={colors.grid} strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  stroke={colors.axis}
                  tick={{ fontSize: 11 }}
                  interval={interval}
                />
                <YAxis
                  stroke={colors.axis}
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
          </LazyChart>
        </div>
      </section>
    </>
  );
}
