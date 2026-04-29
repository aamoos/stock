import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { fetchUsdKrwRate } from '../fxRate';
import { type Holding, formatKrwFull } from '../simulator';
import { clearLocalStorageKeys, useLocalStorage } from '../useLocalStorage';
import { AdSlot } from '../AdSlot';
import { SiteFooter } from '../components/SiteFooter';
import type { WorkerOutput, ChartPoint, PerHoldingRow } from '../workers/simulator.worker';

const SimChart = lazy(() => import('../components/SimChart').then(m => ({ default: m.SimChart })));

const AD_SLOT_MIDDLE = import.meta.env.VITE_ADSENSE_SLOT_MIDDLE;
const AD_SLOT_BOTTOM = import.meta.env.VITE_ADSENSE_SLOT_BOTTOM;

const STORAGE_KEYS = [
  'holdings', 'months', 'usdKrw', 'usdKrwFxInfo',
  'reinvest', 'startYm', 'expandedIds', 'hiddenIds',
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

const EMPTY_CHART: ChartPoint[] = [];
const EMPTY_PER_HOLDING: PerHoldingRow[] = [];
const EMPTY_TABLE: WorkerOutput['tableRows'] = [];

export function HomePage() {
  const [holdings, setHoldings] = useLocalStorage<Holding[]>('holdings', DEFAULT_HOLDINGS);
  const [months, setMonths] = useLocalStorage<number>('months', 120);
  const [usdKrw, setUsdKrw] = useLocalStorage<number>('usdKrw', 1380);
  const [reinvest, setReinvest] = useLocalStorage<boolean>('reinvest', true);
  const [startYm, setStartYm] = useLocalStorage<string>('startYm', defaultStartYm);
  const [expandedIdList, setExpandedIdList] = useLocalStorage<string[]>(
    'expandedIds', () => DEFAULT_HOLDINGS.map((h) => h.id),
  );
  const [hiddenIdList, setHiddenIdList] = useLocalStorage<string[]>('hiddenIds', []);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [fxLoading, setFxLoading] = useState(false);
  const [fxError, setFxError] = useState<string | null>(null);
  const [fxInfo, setFxInfo] = useLocalStorage<{ source: string; fetchedAt: number } | null>(
    'usdKrwFxInfo', null,
  );

  // Worker 결과 상태
  const [workerResult, setWorkerResult] = useState<WorkerOutput | null>(null);
  const workerRef = useRef<Worker | null>(null);

  // Worker 초기화
  useEffect(() => {
    const worker = new Worker(
      new URL('../workers/simulator.worker.ts', import.meta.url),
      { type: 'module' },
    );
    worker.onmessage = (e: MessageEvent<WorkerOutput>) => {
      setWorkerResult(e.data);
    };
    workerRef.current = worker;
    return () => worker.terminate();
  }, []);

  const FX_CACHE_MS = 60 * 60 * 1000;
  const fxInitialized = useRef(false);

  const refreshUsdKrw = async (silent = false) => {
    if (!silent) setFxError(null);
    setFxLoading(true);
    try {
      const { rate, source, fetchedAt } = await fetchUsdKrwRate();
      setUsdKrw(rate);
      setFxInfo({ source, fetchedAt });
    } catch (err) {
      if (!silent) {
        setFxError(err instanceof Error ? err.message : '환율을 가져오지 못했습니다.');
      }
    } finally {
      setFxLoading(false);
    }
  };

  useEffect(() => {
    if (fxInitialized.current) return;
    fxInitialized.current = true;
    const isFresh = fxInfo && Date.now() - fxInfo.fetchedAt < FX_CACHE_MS;
    if (!isFresh) {
      if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(() => refreshUsdKrw(true), { timeout: 3000 });
      } else {
        setTimeout(() => refreshUsdKrw(true), 500);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fxFetchedLabel = useMemo(() => {
    if (!fxInfo) return null;
    const d = new Date(fxInfo.fetchedAt);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    return `${mm}/${dd} ${hh}:${mi} · ${fxInfo.source}`;
  }, [fxInfo]);

  const usdKrwDisplay = useMemo(
    () => usdKrw.toLocaleString('ko-KR', { maximumFractionDigits: 2 }),
    [usdKrw],
  );

  const expandedIds = useMemo(() => new Set(expandedIdList), [expandedIdList]);
  const hiddenIds = useMemo(() => new Set(hiddenIdList), [hiddenIdList]);

  const visibleHoldings = useMemo(
    () => holdings.filter((h) => !hiddenIds.has(h.id)),
    [holdings, hiddenIds],
  );

  // 입력 변경 시 Worker에 계산 위임 (메인 스레드 블록 없음)
  useEffect(() => {
    if (!workerRef.current) return;
    workerRef.current.postMessage({
      simInput: {
        holdings: visibleHoldings,
        months,
        usdKrw,
        reinvest,
        startYearMonth: startYm,
      },
      usdKrw,
      reinvest,
    });
  }, [visibleHoldings, months, usdKrw, reinvest, startYm]);

  const toggleExpanded = (id: string) => {
    setExpandedIdList((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const toggleHidden = (id: string) => {
    setHiddenIdList((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const resetAll = () => {
    if (!window.confirm('모든 설정과 보유 종목을 초기값으로 되돌립니다. 계속할까요?')) return;
    clearLocalStorageKeys(STORAGE_KEYS);
    setHoldings(DEFAULT_HOLDINGS);
    setMonths(120);
    setUsdKrw(1380);
    setFxInfo(null);
    setFxError(null);
    setReinvest(true);
    setStartYm(defaultStartYm());
    setExpandedIdList(DEFAULT_HOLDINGS.map((h) => h.id));
    setHiddenIdList([]);
  };

  const updateHolding = (id: string, patch: Partial<Holding>) => {
    setHoldings((prev) => prev.map((h) => (h.id === id ? { ...h, ...patch } : h)));
  };

  const addHolding = () => {
    const id = `custom-${Date.now()}`;
    setHoldings((prev) => [
      ...prev,
      {
        id, name: '새 종목', ticker: '', account: 'general', currency: 'KRW',
        shares: 0, pricePerShare: 10000, annualYieldPct: 10,
        annualGrowthPct: 3, monthlyContribution: 0, taxRatePct: 15.4,
      },
    ]);
    setExpandedIdList((prev) => prev.includes(id) ? prev : [...prev, id]);
  };

  const removeHolding = (id: string) => {
    setHoldings((prev) => prev.filter((h) => h.id !== id));
  };

  // Worker 결과에서 파생값 추출
  const hasResults = workerResult?.hasResults ?? false;
  const chartData = workerResult?.chartData ?? EMPTY_CHART;
  const perHoldingSummary = workerResult?.perHoldingSummary ?? EMPTY_PER_HOLDING;
  const tableRows = workerResult?.tableRows ?? EMPTY_TABLE;

  const sidebar = (
    <aside className="sidebar" aria-label="시뮬레이션 설정 패널">
      <div className="sidebar-head">
        <div className="sidebar-title-wrap">
          <h2 className="sidebar-title">설정</h2>
          <span className="save-dot" title="자동 저장됨 (localStorage)">자동 저장</span>
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
            <div className="fx-rate-block grid-col-full">
              <div className="fx-rate-block-head">
                <span className="fx-rate-pair">USD → KRW</span>
                <button
                  type="button"
                  className="fx-rate-refresh btn btn-ghost"
                  onClick={() => refreshUsdKrw(false)}
                  disabled={fxLoading}
                  title="현재 환율 다시 가져오기"
                  aria-label="현재 환율 다시 가져오기"
                >
                  {fxLoading ? '⏳' : '↻'}
                </button>
              </div>
              <div className="fx-rate-equation">
                <span className="fx-rate-label">1 USD =</span>
                <span className="fx-rate-symbol">₩</span>
                <span className="fx-rate-amount">{usdKrwDisplay}</span>
                <span className="fx-rate-won">원</span>
              </div>
              {fxError ? (
                <small className="field-hint fx-error">{fxError}</small>
              ) : fxLoading ? (
                <small className="field-hint">환율 조회 중...</small>
              ) : fxFetchedLabel ? (
                <small className="field-hint fx-rate-meta">{fxFetchedLabel}</small>
              ) : null}
            </div>
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
            <button className="btn btn-primary btn-sm" onClick={addHolding}>+ 추가</button>
          </div>

          <div className="holdings">
            {holdings.length === 0 && (
              <div className="empty">
                아직 추가된 종목이 없습니다.<br />
                위의 <b>+ 추가</b> 버튼으로 시작하세요.
              </div>
            )}
            {holdings.map((h) => {
              const isOpen = expandedIds.has(h.id);
              const isHidden = hiddenIds.has(h.id);
              return (
                <div
                  key={h.id}
                  className={`holding ${isOpen ? 'open' : ''} ${isHidden ? 'hidden-holding' : ''}`}
                >
                  <button
                    type="button"
                    className="holding-header"
                    onClick={() => toggleExpanded(h.id)}
                  >
                    <span className={`chev ${isOpen ? 'open' : ''}`}>›</span>
                    <span className={`badge badge-${h.account}`}>{ACCOUNT_BADGE[h.account]}</span>
                    <span className="holding-title">{h.name}</span>
                    <span
                      className="vis"
                      role="button"
                      aria-label={isHidden ? '종목 표시' : '종목 숨김'}
                      title={isHidden ? '결과에 포함' : '결과에서 숨김'}
                      onClick={(e) => { e.stopPropagation(); toggleHidden(h.id); }}
                    >
                      {isHidden ? '🙈' : '👁'}
                    </span>
                    <span
                      className="del"
                      role="button"
                      aria-label="종목 삭제"
                      onClick={(e) => { e.stopPropagation(); removeHolding(h.id); }}
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
                          onChange={(e) => updateHolding(h.id, { name: e.target.value })}
                        />
                      </label>
                      <div className="grid grid-dense">
                        <label>
                          <span>티커</span>
                          <input
                            value={h.ticker}
                            onChange={(e) => updateHolding(h.id, { ticker: e.target.value })}
                          />
                        </label>
                        <label>
                          <span>계좌</span>
                          <select
                            value={h.account}
                            onChange={(e) => {
                              const nextAccount = e.target.value as Holding['account'];
                              updateHolding(h.id, { account: nextAccount, taxRatePct: nextAccount === 'isa' ? 0 : 15.4 });
                            }}
                          >
                            <option value="general">일반계좌</option>
                            <option value="isa">ISA계좌</option>
                          </select>
                        </label>
                        <label>
                          <span>통화</span>
                          <select
                            value={h.currency}
                            onChange={(e) => updateHolding(h.id, { currency: e.target.value as Holding['currency'] })}
                          >
                            <option value="KRW">KRW</option>
                            <option value="USD">USD</option>
                          </select>
                        </label>
                        <label>
                          <span>보유 수량</span>
                          <input
                            type="number" min={0} step="any" value={h.shares}
                            onChange={(e) => updateHolding(h.id, { shares: Number(e.target.value) || 0 })}
                          />
                        </label>
                        <label>
                          <span>주당 가격</span>
                          <input
                            type="number" min={0} step="any" value={h.pricePerShare}
                            onChange={(e) => updateHolding(h.id, { pricePerShare: Number(e.target.value) || 0 })}
                          />
                        </label>
                        <label>
                          <span>월 적립 ({h.currency})</span>
                          <input
                            type="number" min={0} step="any" value={h.monthlyContribution}
                            onChange={(e) => updateHolding(h.id, { monthlyContribution: Number(e.target.value) || 0 })}
                          />
                        </label>
                        <label>
                          <span>연 배당률 (%)</span>
                          <input
                            type="number" min={0} step="any" value={h.annualYieldPct}
                            onChange={(e) => updateHolding(h.id, { annualYieldPct: Number(e.target.value) || 0 })}
                          />
                        </label>
                        <label>
                          <span>연 상승률 (%)</span>
                          <input
                            type="number" step="any" value={h.annualGrowthPct}
                            onChange={(e) => updateHolding(h.id, { annualGrowthPct: Number(e.target.value) || 0 })}
                          />
                        </label>
                        <label>
                          <span>배당세율 (%)</span>
                          <input
                            type="number" min={0} max={100} step="any" value={h.taxRatePct}
                            onChange={(e) => updateHolding(h.id, { taxRatePct: Number(e.target.value) || 0 })}
                          />
                          <small className="field-hint">
                            {h.account === 'isa' ? '한도 내 0% · 초과 9.9%' : '국내상장 / 미국직접 ≈ 15.4%'}
                          </small>
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
      <div className="scrim" onClick={() => setDrawerOpen(false)} aria-hidden="true" />

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
          </div>
        </header>

        {hasResults && workerResult && (
          <section className="card">
            <h2>결과 요약 ({workerResult.lastLabel} 기준)</h2>
            <div className="stats">
              <div className="stat">
                <div className="stat-label">최종 평가금</div>
                <div className="stat-value">{formatKrwFull(workerResult.totalValueKrw)}</div>
              </div>
              <div className="stat">
                <div className="stat-label">투자 원금 (초기+적립)</div>
                <div className="stat-value">{formatKrwFull(workerResult.totalPrincipalKrw)}</div>
                <div className="stat-sub">
                  초기 {formatKrwFull(workerResult.initialPrincipalKrw)} · 적립{' '}
                  {formatKrwFull(workerResult.cumContributionKrw)}
                </div>
              </div>
              <div className="stat">
                <div className="stat-label">누적 세후 배당</div>
                <div className="stat-value accent">{formatKrwFull(workerResult.cumNetDividendKrw)}</div>
              </div>
              <div className="stat">
                <div className="stat-label">평가 손익</div>
                <div className={`stat-value ${workerResult.totalProfitKrw >= 0 ? 'accent' : 'negative'}`}>
                  {workerResult.totalProfitKrw >= 0 ? '+' : ''}
                  {formatKrwFull(workerResult.totalProfitKrw)}
                  {workerResult.totalPrincipalKrw > 0 && (
                    <span className="roi-pct">
                      {' '}(
                      {workerResult.totalProfitKrw / workerResult.totalPrincipalKrw >= 0 ? '+' : ''}
                      {((workerResult.totalProfitKrw / workerResult.totalPrincipalKrw) * 100).toFixed(1)}%)
                    </span>
                  )}
                </div>
              </div>
              <div className="stat">
                <div className="stat-label">마지막 월 세후 배당</div>
                <div className="stat-value accent">{formatKrwFull(workerResult.totalNetDividendKrw)}</div>
              </div>
            </div>
          </section>
        )}

        {hasResults && perHoldingSummary.length > 0 && workerResult && (
          <section className="card">
            <h2>종목별 결과 ({workerResult.lastLabel} 기준)</h2>
            <div className="per-holding-grid">
              {perHoldingSummary.map(({ holding, cumNetDividendKrw, valueKrw, initialPrincipalKrw, totalPrincipalKrw, profitKrw }) => {
                const roi = totalPrincipalKrw > 0 ? (profitKrw / totalPrincipalKrw) * 100 : 0;
                return (
                  <div key={holding.id} className="per-holding-card">
                    <div className="per-holding-head">
                      <span className={`badge badge-${holding.account}`}>{ACCOUNT_BADGE[holding.account]}</span>
                      <span className="per-holding-name">{holding.name}</span>
                      {holding.ticker && <span className="per-holding-ticker">{holding.ticker}</span>}
                    </div>
                    <div className="per-holding-stats">
                      <div className="per-holding-stat">
                        <div className="stat-label">평가금</div>
                        <div className="stat-value">{formatKrwFull(valueKrw)}</div>
                      </div>
                      <div className="per-holding-stat">
                        <div className="stat-label">투자 원금 (초기+적립)</div>
                        <div className="stat-value">{formatKrwFull(totalPrincipalKrw)}</div>
                        <div className="stat-sub">초기 {formatKrwFull(initialPrincipalKrw)}</div>
                      </div>
                      <div className="per-holding-stat">
                        <div className="stat-label">누적 세후 배당</div>
                        <div className="stat-value accent">{formatKrwFull(cumNetDividendKrw)}</div>
                      </div>
                      <div className="per-holding-stat">
                        <div className="stat-label">평가 손익</div>
                        <div className={`stat-value ${profitKrw >= 0 ? 'accent' : 'negative'}`}>
                          {profitKrw >= 0 ? '+' : ''}{formatKrwFull(profitKrw)}
                          {totalPrincipalKrw > 0 && (
                            <span className="roi-pct"> ({roi >= 0 ? '+' : ''}{roi.toFixed(1)}%)</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <AdSlot slot={AD_SLOT_MIDDLE} format="auto" />

        <Suspense fallback={null}>
          <SimChart chartData={chartData} />
        </Suspense>

        <section className="card">
          <h2>월별 상세</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>회차</th><th>연월</th><th>월 적립</th>
                  <th>세후 배당</th><th>누적 배당</th><th>평가금</th><th>누적 원금</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((r) => (
                  <tr key={r.month}>
                    <td>{r.month}</td>
                    <td>{r.label}</td>
                    <td>{formatKrwFull(r.totalContributionKrw)}</td>
                    <td className="accent">{formatKrwFull(r.totalNetDividendKrw)}</td>
                    <td>{formatKrwFull(r.cumNetDividendKrw)}</td>
                    <td className="strong">{formatKrwFull(r.totalValueKrw)}</td>
                    <td>{formatKrwFull(r.cumContributionKrw)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <AdSlot slot={AD_SLOT_BOTTOM} format="auto" />

        <SiteFooter />
      </main>
    </div>
  );
}
