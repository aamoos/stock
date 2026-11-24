export const GENERAL_TAX_PCT = 15.4;
export const ISA_TAX_PCT = 9.9;
export const ISA_TOTAL_LIMIT_KRW = 100_000_000;
export const ISA_YEARLY_LIMIT_KRW = 20_000_000;

export interface AccountInput {
  initialKrw: number;
  monthlyKrw: number;
  years: number;
  annualYieldPct: number;
  annualGrowthPct: number;
  /** 총 납입 한도. 넘으면 납입을 멈춘다. 한도가 없으면 Infinity */
  totalLimitKrw?: number;
}

interface PathResult {
  value: number;
  contributed: number;
  reinvested: number;
}

// 시뮬레이터(simulate)와 같은 순서: 주가 반영 → 적립 → 배당 → 재투자
function runPath(input: AccountInput, dividendTaxPct: number): PathResult {
  const limit = input.totalLimitKrw ?? Infinity;
  const monthlyGrowth = Math.pow(1 + input.annualGrowthPct / 100, 1 / 12);
  const monthlyYield = input.annualYieldPct / 100 / 12;
  let contributed = Math.min(input.initialKrw, limit);
  let value = contributed;
  let reinvested = 0;
  for (let m = 0; m < input.years * 12; m++) {
    value *= monthlyGrowth;
    const add = Math.min(input.monthlyKrw, limit - contributed);
    contributed += add;
    value += add;
    const net = value * monthlyYield * (1 - dividendTaxPct / 100);
    reinvested += net;
    value += net;
  }
  return { value, contributed, reinvested };
}

export interface AccountResult {
  contributed: number;
  /** 매도 전 평가금 */
  value: number;
  /** 매도·만기 때 내는 세금 (배당 때 이미 낸 세금은 제외) */
  exitTax: number;
  /** 세금을 모두 낸 뒤 남는 돈 */
  final: number;
}

/** 일반계좌에서 국내 상장 해외형 ETF를 살 때: 배당과 매매차익 모두 15.4%, 손실은 배당과 상계 불가 */
export function generalAccount(input: AccountInput): AccountResult {
  const r = runPath(input, GENERAL_TAX_PCT);
  const gain = r.value - r.contributed - r.reinvested;
  const exitTax = (Math.max(0, gain) * GENERAL_TAX_PCT) / 100;
  return { contributed: r.contributed, value: r.value, exitTax, final: r.value - exitTax };
}

/** ISA: 운용 중 국내 과세 없음, 만기에 손익을 합친 순이익에서 비과세 한도를 빼고 9.9% */
export function isaAccount(input: AccountInput, taxFreeKrw: number): AccountResult {
  const r = runPath(input, 0);
  const profit = r.value - r.contributed;
  const exitTax = (Math.max(0, profit - taxFreeKrw) * ISA_TAX_PCT) / 100;
  return { contributed: r.contributed, value: r.value, exitTax, final: r.value - exitTax };
}
