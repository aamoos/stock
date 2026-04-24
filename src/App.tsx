import { useMemo, useState } from 'react';
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
import './App.css';
import {
  type Holding,
  formatKrw,
  formatKrwFull,
  simulate,
} from './simulator';

const DEFAULT_HOLDINGS: Holding[] = [
  {
    id: 'qqqi',
    name: 'QQQI (NEOS Nasdaq-100 High Income)',
    ticker: 'QQQI',
    account: 'general',
    currency: 'KRW',
    shares: 829,
    pricePerShare: 79212,
    annualYieldPct: 14.5,
    annualGrowthPct: 3,
    monthlyContribution: 500000,
    taxRatePct: 15.4,
  },
  {
    id: 'tiger-qqq-covered',
    name: 'TIGER 나스닥100 커버드콜 데일리타겟100모아',
    ticker: '497570',
    account: 'isa',
    currency: 'KRW',
    shares: 1867,
    pricePerShare: 11000,
    annualYieldPct: 14.6,
    annualGrowthPct: 1.5,
    monthlyContribution: 500000,
    taxRatePct: 0,
  },
];

function App() {
  const [holdings, setHoldings] = useState<Holding[]>(DEFAULT_HOLDINGS);
  const [months, setMonths] = useState(120);
  const [usdKrw, setUsdKrw] = useState(1380);
  const [reinvest, setReinvest] = useState(true);
  const [startYm, setStartYm] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  const results = useMemo(
    () =>
      simulate({
        holdings,
        months,
        usdKrw,
        reinvest,
        startYearMonth: startYm,
      }),
    [holdings, months, usdKrw, reinvest, startYm],
  );

  const last = results[results.length - 1];

  const chartData = useMemo(
    () =>
      results.map((r) => ({
        label: r.label,
        평가금: Math.round(r.totalValueKrw),
        누적원금: Math.round(r.cumContributionKrw),
        누적배당: Math.round(r.cumNetDividendKrw),
        월배당: Math.round(r.totalNetDividendKrw),
      })),
    [results],
  );

  const updateHolding = (id: string, patch: Partial<Holding>) => {
    setHoldings((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...patch } : h)),
    );
  };

  const addHolding = () => {
    const id = `custom-${Date.now()}`;
    setHoldings((prev) => [
      ...prev,
      {
        id,
        name: '새 종목',
        ticker: '',
        account: 'general',
        currency: 'KRW',
        shares: 0,
        pricePerShare: 10000,
        annualYieldPct: 10,
        annualGrowthPct: 3,
        monthlyContribution: 0,
        taxRatePct: 15.4,
      },
    ]);
  };

  const removeHolding = (id: string) => {
    setHoldings((prev) => prev.filter((h) => h.id !== id));
  };

  return (
    <div className="page">
      <header className="header">
        <h1>월배당 자산 시뮬레이터</h1>
        <p className="subtitle">
          일반계좌 · ISA계좌 월배당 ETF의 배당 재투자와 자산 성장을 시뮬레이션합니다.
        </p>
      </header>

      <section className="card">
        <h2>기본 설정</h2>
        <div className="grid">
          <label>
            <span>시뮬레이션 기간 (개월)</span>
            <input
              type="number"
              min={1}
              max={600}
              value={months}
              onChange={(e) => setMonths(Number(e.target.value) || 0)}
            />
          </label>
          <label>
            <span>시작 연월</span>
            <input
              type="month"
              value={startYm}
              onChange={(e) => setStartYm(e.target.value)}
            />
          </label>
          <label>
            <span>환율 (USD → KRW)</span>
            <input
              type="number"
              min={0}
              value={usdKrw}
              onChange={(e) => setUsdKrw(Number(e.target.value) || 0)}
            />
          </label>
          <label className="toggle">
            <input
              type="checkbox"
              checked={reinvest}
              onChange={(e) => setReinvest(e.target.checked)}
            />
            <span>배당 재투자 (DRIP)</span>
          </label>
        </div>
      </section>

      <section className="card">
        <div className="card-head">
          <h2>보유 종목</h2>
          <button className="btn btn-primary" onClick={addHolding}>
            + 종목 추가
          </button>
        </div>

        <div className="holdings">
          {holdings.map((h) => (
            <div key={h.id} className="holding">
              <div className="holding-top">
                <input
                  className="holding-name"
                  value={h.name}
                  onChange={(e) => updateHolding(h.id, { name: e.target.value })}
                />
                <button
                  className="btn btn-ghost"
                  onClick={() => removeHolding(h.id)}
                  aria-label="삭제"
                >
                  ×
                </button>
              </div>
              <div className="grid grid-dense">
                <label>
                  <span>티커</span>
                  <input
                    value={h.ticker}
                    onChange={(e) =>
                      updateHolding(h.id, { ticker: e.target.value })
                    }
                  />
                </label>
                <label>
                  <span>계좌</span>
                  <select
                    value={h.account}
                    onChange={(e) =>
                      updateHolding(h.id, {
                        account: e.target.value as Holding['account'],
                      })
                    }
                  >
                    <option value="general">일반계좌</option>
                    <option value="isa">ISA계좌</option>
                  </select>
                </label>
                <label>
                  <span>통화</span>
                  <select
                    value={h.currency}
                    onChange={(e) =>
                      updateHolding(h.id, {
                        currency: e.target.value as Holding['currency'],
                      })
                    }
                  >
                    <option value="KRW">KRW</option>
                    <option value="USD">USD</option>
                  </select>
                </label>
                <label>
                  <span>현재 보유 수량</span>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={h.shares}
                    onChange={(e) =>
                      updateHolding(h.id, {
                        shares: Number(e.target.value) || 0,
                      })
                    }
                  />
                </label>
                <label>
                  <span>현재 주당 가격</span>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={h.pricePerShare}
                    onChange={(e) =>
                      updateHolding(h.id, {
                        pricePerShare: Number(e.target.value) || 0,
                      })
                    }
                  />
                </label>
                <label>
                  <span>월 적립금 ({h.currency})</span>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={h.monthlyContribution}
                    onChange={(e) =>
                      updateHolding(h.id, {
                        monthlyContribution: Number(e.target.value) || 0,
                      })
                    }
                  />
                </label>
                <label>
                  <span>연 배당률 (%)</span>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={h.annualYieldPct}
                    onChange={(e) =>
                      updateHolding(h.id, {
                        annualYieldPct: Number(e.target.value) || 0,
                      })
                    }
                  />
                </label>
                <label>
                  <span>연 주가 상승률 (%)</span>
                  <input
                    type="number"
                    step="any"
                    value={h.annualGrowthPct}
                    onChange={(e) =>
                      updateHolding(h.id, {
                        annualGrowthPct: Number(e.target.value) || 0,
                      })
                    }
                  />
                </label>
                <label>
                  <span>배당세율 (%)</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step="any"
                    value={h.taxRatePct}
                    onChange={(e) =>
                      updateHolding(h.id, {
                        taxRatePct: Number(e.target.value) || 0,
                      })
                    }
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </section>

      {last && (
        <section className="card">
          <h2>결과 요약 ({last.label} 기준)</h2>
          <div className="stats">
            <div className="stat">
              <div className="stat-label">최종 평가금</div>
              <div className="stat-value">{formatKrwFull(last.totalValueKrw)}</div>
            </div>
            <div className="stat">
              <div className="stat-label">누적 투자 원금</div>
              <div className="stat-value">
                {formatKrwFull(last.cumContributionKrw)}
              </div>
            </div>
            <div className="stat">
              <div className="stat-label">누적 세후 배당</div>
              <div className="stat-value accent">
                {formatKrwFull(last.cumNetDividendKrw)}
              </div>
            </div>
            <div className="stat">
              <div className="stat-label">마지막 월 세후 배당</div>
              <div className="stat-value accent">
                {formatKrwFull(last.totalNetDividendKrw)}
              </div>
            </div>
          </div>
        </section>
      )}

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
                interval={Math.max(0, Math.floor(chartData.length / 12) - 1)}
              />
              <YAxis
                stroke="#8b92a5"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => formatKrw(v)}
              />
              <Tooltip
                contentStyle={{
                  background: '#1a1f2b',
                  border: '1px solid #2a2f3a',
                  borderRadius: 8,
                }}
                formatter={(v) => formatKrwFull(Number(v))}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="평가금"
                stroke="#4f8cff"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="누적원금"
                stroke="#8b92a5"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="누적배당"
                stroke="#4ade80"
                strokeWidth={2}
                dot={false}
              />
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
                interval={Math.max(0, Math.floor(chartData.length / 12) - 1)}
              />
              <YAxis
                stroke="#8b92a5"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => formatKrw(v)}
              />
              <Tooltip
                contentStyle={{
                  background: '#1a1f2b',
                  border: '1px solid #2a2f3a',
                  borderRadius: 8,
                }}
                formatter={(v) => formatKrwFull(Number(v))}
              />
              <Bar dataKey="월배당" fill="#4ade80" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="card">
        <h2>월별 상세</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>회차</th>
                <th>연월</th>
                <th>월 적립</th>
                <th>세후 배당</th>
                <th>누적 배당</th>
                <th>평가금</th>
                <th>누적 원금</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.month}>
                  <td>{r.month}</td>
                  <td>{r.label}</td>
                  <td>{formatKrwFull(r.totalContributionKrw)}</td>
                  <td className="accent">
                    {formatKrwFull(r.totalNetDividendKrw)}
                  </td>
                  <td>{formatKrwFull(r.cumNetDividendKrw)}</td>
                  <td className="strong">
                    {formatKrwFull(r.totalValueKrw)}
                  </td>
                  <td>{formatKrwFull(r.cumContributionKrw)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="footer">
        <p>
          계좌별 과세 예시 · 일반계좌(해외 ETF 배당): US 원천징수 약 15% · ISA계좌:
          한도 내 비과세 · 국내 분배금 과세 상품: 15.4%. 실제 과세는 상품·한도·연 한도에 따라 다릅니다.
        </p>
        <p>
          입력한 가정(연 배당률, 주가 상승률, 환율)에 따른 단순 시뮬레이션이며,
          실제 수익/분배금과 다를 수 있습니다.
        </p>
      </footer>
    </div>
  );
}

export default App;
