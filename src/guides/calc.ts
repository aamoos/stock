import { simulate } from '../simulator';

// 가이드 글의 표는 모두 빌드할 때 시뮬레이터와 같은 함수로 계산한다.
// 글에 숫자를 손으로 적지 않아 계산식이 바뀌어도 어긋나지 않는다.

export interface CalcInput {
  initialKrw?: number;
  monthlyKrw?: number;
  years: number;
  yieldPct: number;
  growthPct: number;
  taxPct?: number;
  reinvest?: boolean;
}

export function run({
  initialKrw = 0, monthlyKrw = 0, years, yieldPct, growthPct, taxPct = 15.4, reinvest = true,
}: CalcInput) {
  const price = 10_000;
  return simulate({
    months: years * 12,
    usdKrw: 1,
    reinvest,
    startYearMonth: '2000-01',
    holdings: [{
      id: 'calc', name: '', ticker: '', account: 'general', currency: 'KRW',
      shares: initialKrw / price, pricePerShare: price,
      annualYieldPct: yieldPct, annualGrowthPct: growthPct,
      monthlyContribution: monthlyKrw, taxRatePct: taxPct,
    }],
  });
}

export const last = (input: CalcInput) => {
  const results = run(input);
  return results[results.length - 1];
};

export interface FxInput {
  monthlyKrw: number;
  years: number;
  startFx: number;
  endFx: number;
  yieldPct: number;
  taxPct: number;
}

/** 환율이 시작값에서 끝값까지 일정하게 움직일 때, 매달 같은 원화로 달러 ETF를 사는 경우의 원화 평가금 */
export function fxPath({ monthlyKrw, years, startFx, endFx, yieldPct, taxPct }: FxInput) {
  const months = years * 12;
  const net = (yieldPct / 100 / 12) * (1 - taxPct / 100);
  let usd = 0;
  let fx = startFx;
  for (let m = 0; m < months; m++) {
    fx = months === 1 ? endFx : startFx + ((endFx - startFx) * m) / (months - 1);
    usd += monthlyKrw / fx;
    usd *= 1 + net;
  }
  return { valueKrw: usd * fx, monthlyDividendKrw: usd * net * fx };
}
