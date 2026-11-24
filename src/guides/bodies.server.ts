import type { ReactNode } from 'react';
import monthlyDividend1mTimeline from './body-monthly-dividend-1m-timeline';
import dividendVsGrowthSameReturn from './body-dividend-vs-growth-same-return';
import fallingPriceMonthlyIncome from './body-falling-price-monthly-income';
import startLateCost from './body-start-late-cost';
import coveredCallEtfBasics from './body-covered-call-etf-basics';
import isaAccountDividendTax from './body-isa-account-dividend-tax';
import coveredCallEtfComparison from './body-covered-call-etf-comparison';
import monthlyDividendPortfolioScenarios from './body-monthly-dividend-portfolio-scenarios';
import usDividendTaxGuide from './body-us-dividend-tax-guide';
import dripCompoundEffect from './body-drip-compound-effect';
import financialIncomeTaxStrategy from './body-financial-income-tax-strategy';
import fxRateAndDividendReturns from './body-fx-rate-and-dividend-returns';

// 프리렌더 전용: 모든 가이드 본문을 정적으로 묶어 동기 조회를 제공한다.
// (클라이언트 번들에는 포함되지 않고, entry-server에서만 import 한다.)
const BODIES: Record<string, ReactNode> = {
  'monthly-dividend-1m-timeline': monthlyDividend1mTimeline,
  'dividend-vs-growth-same-return': dividendVsGrowthSameReturn,
  'falling-price-monthly-income': fallingPriceMonthlyIncome,
  'start-late-cost': startLateCost,
  'covered-call-etf-basics': coveredCallEtfBasics,
  'isa-account-dividend-tax': isaAccountDividendTax,
  'covered-call-etf-comparison': coveredCallEtfComparison,
  'monthly-dividend-portfolio-scenarios': monthlyDividendPortfolioScenarios,
  'us-dividend-tax-guide': usDividendTaxGuide,
  'drip-compound-effect': dripCompoundEffect,
  'financial-income-tax-strategy': financialIncomeTaxStrategy,
  'fx-rate-and-dividend-returns': fxRateAndDividendReturns,
};

export function getGuideBodySync(slug: string): ReactNode | null {
  return BODIES[slug] ?? null;
}
