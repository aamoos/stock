export type AccountType = 'general' | 'isa';
export type Currency = 'KRW' | 'USD';

export interface Holding {
  id: string;
  name: string;
  ticker: string;
  account: AccountType;
  currency: Currency;
  shares: number;
  pricePerShare: number;
  annualYieldPct: number;
  annualGrowthPct: number;
  monthlyContribution: number;
  taxRatePct: number;
}

export interface SimInput {
  holdings: Holding[];
  months: number;
  usdKrw: number;
  reinvest: boolean;
  startYearMonth: string;
}

export interface HoldingMonth {
  id: string;
  shares: number;
  price: number;
  valueKrw: number;
  grossDividendKrw: number;
  netDividendKrw: number;
  contributionKrw: number;
}

export interface MonthResult {
  month: number;
  label: string;
  perHolding: HoldingMonth[];
  totalContributionKrw: number;
  totalGrossDividendKrw: number;
  totalNetDividendKrw: number;
  totalValueKrw: number;
  cumContributionKrw: number;
  cumGrossDividendKrw: number;
  cumNetDividendKrw: number;
}

const toKrw = (amount: number, currency: Currency, fx: number) =>
  currency === 'USD' ? amount * fx : amount;

export function simulate(input: SimInput): MonthResult[] {
  const results: MonthResult[] = [];

  const state = input.holdings.map((h) => ({
    ...h,
    currentShares: h.shares,
    currentPrice: h.pricePerShare,
    // 월별 성장 배수 사전 계산 (매 루프마다 Math.pow 반복 방지)
    monthlyGrowthFactor: Math.pow(1 + h.annualGrowthPct / 100, 1 / 12),
    monthlyYieldRate: h.annualYieldPct / 100 / 12,
    netRate: 1 - h.taxRatePct / 100,
  }));

  let cumContribution = 0;
  let cumGross = 0;
  let cumNet = 0;

  // startYearMonth 파싱을 루프 밖으로 이동
  const [ys, ms] = input.startYearMonth.split('-');
  const startYear = Number(ys);
  const startMonth = Number(ms) - 1;

  for (let m = 1; m <= input.months; m++) {
    let totalContributionKrw = 0;
    let totalGrossKrw = 0;
    let totalNetKrw = 0;
    let totalValueKrw = 0;

    const perHolding: HoldingMonth[] = state.map((h) => {
      h.currentPrice = h.currentPrice * h.monthlyGrowthFactor;

      const contribution = h.monthlyContribution;
      if (contribution > 0 && h.currentPrice > 0) {
        h.currentShares += contribution / h.currentPrice;
      }

      const gross = h.currentShares * h.currentPrice * h.monthlyYieldRate;
      const net = gross * h.netRate;

      if (input.reinvest && h.currentPrice > 0) {
        h.currentShares += net / h.currentPrice;
      }

      const contributionKrw = toKrw(contribution, h.currency, input.usdKrw);
      const grossKrw = toKrw(gross, h.currency, input.usdKrw);
      const netKrw = toKrw(net, h.currency, input.usdKrw);
      const valueKrw = toKrw(h.currentShares * h.currentPrice, h.currency, input.usdKrw);

      totalContributionKrw += contributionKrw;
      totalGrossKrw += grossKrw;
      totalNetKrw += netKrw;
      totalValueKrw += valueKrw;

      return {
        id: h.id,
        shares: h.currentShares,
        price: h.currentPrice,
        valueKrw,
        grossDividendKrw: grossKrw,
        netDividendKrw: netKrw,
        contributionKrw,
      };
    });

    cumContribution += totalContributionKrw;
    cumGross += totalGrossKrw;
    cumNet += totalNetKrw;

    // Date 객체 없이 연월 계산
    const totalMonths = startMonth + (m - 1);
    const labelYear = startYear + Math.floor(totalMonths / 12);
    const labelMonth = String((totalMonths % 12) + 1).padStart(2, '0');
    const label = `${labelYear}-${labelMonth}`;

    results.push({
      month: m,
      label,
      perHolding,
      totalContributionKrw,
      totalGrossDividendKrw: totalGrossKrw,
      totalNetDividendKrw: totalNetKrw,
      totalValueKrw,
      cumContributionKrw: cumContribution,
      cumGrossDividendKrw: cumGross,
      cumNetDividendKrw: cumNet,
    });
  }

  return results;
}

export const formatKrw = (n: number) => {
  if (!isFinite(n)) return '-';
  const abs = Math.abs(n);
  if (abs >= 1e8) return `${(n / 1e8).toFixed(2)}억`;
  if (abs >= 1e4) return `${(n / 1e4).toFixed(0)}만`;
  return `${Math.round(n).toLocaleString()}`;
};

export const formatKrwFull = (n: number) =>
  isFinite(n) ? `${Math.round(n).toLocaleString()}원` : '-';
