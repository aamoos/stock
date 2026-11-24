import { simulate } from './simulator';

export interface GoalInput {
  targetMonthlyKrw: number;
  annualYieldPct: number;
  taxRatePct: number;
  currentKrw: number;
  monthlyContributionKrw: number;
  annualGrowthPct: number;
  reinvest: boolean;
}

export const MAX_GOAL_MONTHS = 600;

// 금융소득 종합과세 기준 (연간 이자 + 배당, 세전)
export const FINANCIAL_INCOME_LIMIT_KRW = 20_000_000;

/** 목표 월배당(세후)을 지금 바로 받기 위해 필요한 평가금. 배당이 없으면 null */
export function requiredCapital(
  targetMonthlyKrw: number,
  annualYieldPct: number,
  taxRatePct: number,
): number | null {
  const netYearlyRate = (annualYieldPct / 100) * (1 - taxRatePct / 100);
  if (!(netYearlyRate > 0) || !(targetMonthlyKrw > 0)) return null;
  return (targetMonthlyKrw * 12) / netYearlyRate;
}

/** 목표 월배당을 받을 때의 연간 세전 배당 */
export function grossYearlyDividend(targetMonthlyKrw: number, taxRatePct: number): number | null {
  const netRate = 1 - taxRatePct / 100;
  if (!(netRate > 0) || !(targetMonthlyKrw > 0)) return null;
  return (targetMonthlyKrw * 12) / netRate;
}

/** 월 세후 배당이 목표에 처음 도달하는 개월 수. 최대 기간 안에 못 가면 null */
export function monthsToGoal(input: GoalInput): number | null {
  if (requiredCapital(input.targetMonthlyKrw, input.annualYieldPct, input.taxRatePct) === null) {
    return null;
  }
  const pricePerShare = 10_000;
  const results = simulate({
    months: MAX_GOAL_MONTHS,
    usdKrw: 1,
    reinvest: input.reinvest,
    startYearMonth: '2000-01',
    holdings: [
      {
        id: 'goal',
        name: 'goal',
        ticker: '',
        account: 'general',
        currency: 'KRW',
        shares: input.currentKrw / pricePerShare,
        pricePerShare,
        annualYieldPct: input.annualYieldPct,
        annualGrowthPct: input.annualGrowthPct,
        monthlyContribution: input.monthlyContributionKrw,
        taxRatePct: input.taxRatePct,
      },
    ],
  });
  const hit = results.find((r) => r.totalNetDividendKrw >= input.targetMonthlyKrw);
  return hit ? hit.month : null;
}

export function formatMonths(months: number): string {
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m}개월`;
  return m === 0 ? `${y}년` : `${y}년 ${m}개월`;
}
