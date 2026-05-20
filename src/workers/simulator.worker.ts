import { simulate } from '../simulator';
import type { SimInput, Holding } from '../simulator';

export interface WorkerInput {
  simInput: SimInput;
  usdKrw: number;
  reinvest: boolean;
}

export interface PerHoldingRow {
  holding: Holding;
  cumContributionKrw: number;
  cumNetDividendKrw: number;
  valueKrw: number;
  initialPrincipalKrw: number;
  totalPrincipalKrw: number;
  profitKrw: number;
}

export interface ChartPoint {
  label: string;
  평가금: number;
  누적원금: number;
  누적배당: number;
  월배당: number;
}

export interface WorkerOutput {
  chartData: ChartPoint[];
  perHoldingSummary: PerHoldingRow[];
  tableRows: {
    month: number;
    label: string;
    totalContributionKrw: number;
    totalNetDividendKrw: number;
    cumNetDividendKrw: number;
    totalValueKrw: number;
    cumContributionKrw: number;
  }[];
  lastLabel: string;
  totalValueKrw: number;
  cumContributionKrw: number;
  cumNetDividendKrw: number;
  totalNetDividendKrw: number;
  initialPrincipalKrw: number;
  totalPrincipalKrw: number;
  totalProfitKrw: number;
  hasResults: boolean;
}

self.onmessage = (e: MessageEvent<WorkerInput>) => {
  const { simInput, usdKrw, reinvest } = e.data;
  const results = simulate(simInput);
  const holdings = simInput.holdings;

  if (holdings.length === 0 || results.length === 0) {
    self.postMessage({ hasResults: false } as WorkerOutput);
    return;
  }

  const last = results[results.length - 1];

  // chartData
  const chartData: ChartPoint[] = results.map((r) => ({
    label: r.label,
    평가금: Math.round(r.totalValueKrw),
    누적원금: Math.round(r.cumContributionKrw),
    누적배당: Math.round(r.cumNetDividendKrw),
    월배당: Math.round(r.totalNetDividendKrw),
  }));

  // perHoldingSummary
  const acc = new Map<string, { cumContributionKrw: number; cumNetDividendKrw: number; valueKrw: number }>();
  holdings.forEach((h) => {
    acc.set(h.id, { cumContributionKrw: 0, cumNetDividendKrw: 0, valueKrw: 0 });
  });
  results.forEach((r) => {
    r.perHolding.forEach((p) => {
      const cur = acc.get(p.id);
      if (!cur) return;
      cur.cumContributionKrw += p.contributionKrw;
      cur.cumNetDividendKrw += p.netDividendKrw;
      cur.valueKrw = p.valueKrw;
    });
  });
  const perHoldingSummary: PerHoldingRow[] = holdings.map((h) => {
    const agg = acc.get(h.id) ?? { cumContributionKrw: 0, cumNetDividendKrw: 0, valueKrw: 0 };
    const initialPrincipalKrw = h.shares * h.pricePerShare * (h.currency === 'USD' ? usdKrw : 1);
    const totalPrincipalKrw = initialPrincipalKrw + agg.cumContributionKrw;
    const realizedDividendKrw = reinvest ? 0 : agg.cumNetDividendKrw;
    const profitKrw = agg.valueKrw + realizedDividendKrw - totalPrincipalKrw;
    return { holding: h, ...agg, initialPrincipalKrw, totalPrincipalKrw, profitKrw };
  });

  // tableRows
  const tableRows = results.map((r) => ({
    month: r.month,
    label: r.label,
    totalContributionKrw: r.totalContributionKrw,
    totalNetDividendKrw: r.totalNetDividendKrw,
    cumNetDividendKrw: r.cumNetDividendKrw,
    totalValueKrw: r.totalValueKrw,
    cumContributionKrw: r.cumContributionKrw,
  }));

  // stats
  const initialPrincipalKrw = holdings.reduce(
    (sum, h) => sum + h.shares * h.pricePerShare * (h.currency === 'USD' ? usdKrw : 1),
    0,
  );
  const totalPrincipalKrw = initialPrincipalKrw + last.cumContributionKrw;
  const totalProfitKrw = last.totalValueKrw + (reinvest ? 0 : last.cumNetDividendKrw) - totalPrincipalKrw;

  const output: WorkerOutput = {
    chartData,
    perHoldingSummary,
    tableRows,
    lastLabel: last.label,
    totalValueKrw: last.totalValueKrw,
    cumContributionKrw: last.cumContributionKrw,
    cumNetDividendKrw: last.cumNetDividendKrw,
    totalNetDividendKrw: last.totalNetDividendKrw,
    initialPrincipalKrw,
    totalPrincipalKrw,
    totalProfitKrw,
    hasResults: true,
  };

  self.postMessage(output);
};

// suppress TypeScript module error
export {};
