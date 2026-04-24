import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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
import {
  type Holding,
  formatKrw,
  formatKrwFull,
  simulate,
} from '../simulator';
import {
  clearLocalStorageKeys,
  useLocalStorage,
} from '../useLocalStorage';
import { AdSlot } from '../AdSlot';
import { SiteFooter } from '../components/SiteFooter';

const AD_SLOT_MIDDLE = import.meta.env.VITE_ADSENSE_SLOT_MIDDLE;
const AD_SLOT_BOTTOM = import.meta.env.VITE_ADSENSE_SLOT_BOTTOM;

const STORAGE_KEYS = [
  'holdings',
  'months',
  'usdKrw',
  'reinvest',
  'startYm',
  'expandedIds',
];

const DEFAULT_HOLDINGS: Holding[] = [];

const ACCOUNT_BADGE: Record<Holding['account'], string> = {
  general: '일반',
  isa: 'ISA',
};

const defaultStartYm = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

export function HomePage() {
  const [holdings, setHoldings] = useLocalStorage<Holding[]>(
    'holdings',
    DEFAULT_HOLDINGS,
  );
  const [months, setMonths] = useLocalStorage<number>('months', 120);
  const [usdKrw, setUsdKrw] = useLocalStorage<number>('usdKrw', 1380);
  const [reinvest, setReinvest] = useLocalStorage<boolean>('reinvest', true);
  const [startYm, setStartYm] = useLocalStorage<string>(
    'startYm',
    defaultStartYm,
  );
  const [expandedIdList, setExpandedIdList] = useLocalStorage<string[]>(
    'expandedIds',
    () => DEFAULT_HOLDINGS.map((h) => h.id),
  );

  const [drawerOpen, setDrawerOpen] = useState(false);
  const expandedIds = useMemo(
    () => new Set(expandedIdList),
    [expandedIdList],
  );

  const toggleExpanded = (id: string) => {
    setExpandedIdList((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const resetAll = () => {
    if (
      !window.confirm(
        '모든 설정과 보유 종목을 초기값으로 되돌립니다. 계속할까요?',
      )
    ) {
      return;
    }
    clearLocalStorageKeys(STORAGE_KEYS);
    setHoldings(DEFAULT_HOLDINGS);
    setMonths(120);
    setUsdKrw(1380);
    setReinvest(true);
    setStartYm(defaultStartYm());
    setExpandedIdList(DEFAULT_HOLDINGS.map((h) => h.id));
  };

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
    setExpandedIdList((prev) =>
      prev.includes(id) ? prev : [...prev, id],
    );
  };

  const removeHolding = (id: string) => {
    setHoldings((prev) => prev.filter((h) => h.id !== id));
  };

  const sidebar = (
    <aside className="sidebar" aria-label="시뮬레이션 설정 패널">
      <div className="sidebar-head">
        <div className="sidebar-title-wrap">
          <h2 className="sidebar-title">설정</h2>
          <span className="save-dot" title="자동 저장됨 (localStorage)">
            자동 저장
          </span>
        </div>
        <div className="sidebar-head-actions">
          <button
            className="btn btn-ghost btn-reset"
            onClick={resetAll}
            title="초기값으로 리셋"
            aria-label="초기값으로 리셋"
          >
            ⟲
          </button>
          <button
            className="btn btn-ghost drawer-close"
            onClick={() => setDrawerOpen(false)}
            aria-label="닫기"
          >
            ×
          </button>
        </div>
      </div>

      <div className="sidebar-body">
        <div className="panel">
          <div className="panel-head">
            <h3>기본 설정</h3>
          </div>
          <div className="grid">
            <label>
              <span>기간 (개월)</span>
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
              <span>환율 (USD→KRW)</span>
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
        </div>

        <div className="panel">
          <div className="panel-head">
            <h3>보유 종목</h3>
            <button className="btn btn-primary btn-sm" onClick={addHolding}>
              + 추가
            </button>
          </div>

          <div className="holdings">
            {holdings.length === 0 && (
              <div className="empty">
                아직 추가된 종목이 없습니다.
                <br />
                위의 <b>+ 추가</b> 버튼으로 시작하세요.
              </div>
            )}
            {holdings.map((h) => {
              const isOpen = expandedIds.has(h.id);
              return (
                <div
                  key={h.id}
                  className={`holding ${isOpen ? 'open' : ''}`}
                >
                  <button
                    type="button"
                    className="holding-header"
                    onClick={() => toggleExpanded(h.id)}
                  >
                    <span className={`chev ${isOpen ? 'open' : ''}`}>›</span>
                    <span className={`badge badge-${h.account}`}>
                      {ACCOUNT_BADGE[h.account]}
                    </span>
                    <span className="holding-title">{h.name}</span>
                    <span
                      className="del"
                      role="button"
                      aria-label="종목 삭제"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeHolding(h.id);
                      }}
                    >
                      ×
                    </span>
                  </button>

                  {isOpen && (
                    <div className="holding-body">
                      <label className="full">
                        <span>종목명</span>
                        <input
                          value={h.name}
                          onChange={(e) =>
                            updateHolding(h.id, { name: e.target.value })
                          }
                        />
                      </label>
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
                                account: e.target
                                  .value as Holding['account'],
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
                                currency: e.target
                                  .value as Holding['currency'],
                              })
                            }
                          >
                            <option value="KRW">KRW</option>
                            <option value="USD">USD</option>
                          </select>
                        </label>
                        <label>
                          <span>보유 수량</span>
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
                          <span>주당 가격</span>
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
                          <span>월 적립 ({h.currency})</span>
                          <input
                            type="number"
                            min={0}
                            step="any"
                            value={h.monthlyContribution}
                            onChange={(e) =>
                              updateHolding(h.id, {
                                monthlyContribution:
                                  Number(e.target.value) || 0,
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
                          <span>연 상승률 (%)</span>
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
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <div className={`layout ${drawerOpen ? 'drawer-open' : ''}`}>
      <div
        className="scrim"
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {sidebar}

      <main className="main">
        <header className="header">
          <div className="header-inner">
            <button
              className="btn btn-ghost drawer-toggle"
              onClick={() => setDrawerOpen(true)}
              aria-label="설정 열기"
            >
              ☰
            </button>
            <div className="header-text">
              <h1>월배당 자산 시뮬레이터</h1>
              <p className="subtitle">
                일반계좌 · ISA계좌 월배당 ETF의 배당 재투자와 자산 성장을 시뮬레이션합니다.
              </p>
            </div>
            <nav className="top-nav">
              <Link to="/about">사용법</Link>
              <Link to="/disclaimer">면책</Link>
              <Link to="/privacy">개인정보</Link>
            </nav>
          </div>
        </header>

        {last && (
          <section className="card">
            <h2>결과 요약 ({last.label} 기준)</h2>
            <div className="stats">
              <div className="stat">
                <div className="stat-label">최종 평가금</div>
                <div className="stat-value">
                  {formatKrwFull(last.totalValueKrw)}
                </div>
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

        <AdSlot
          slot={AD_SLOT_MIDDLE}
          format="auto"
          minHeight={120}
          label="본문 광고"
        />

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

        <AdSlot
          slot={AD_SLOT_BOTTOM}
          format="auto"
          minHeight={150}
          label="하단 광고"
        />

        <SiteFooter />
      </main>
    </div>
  );
}
