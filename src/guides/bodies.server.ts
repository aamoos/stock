import type { ReactNode } from 'react';
import coveredCallEtfBasics from './body-covered-call-etf-basics';
import isaAccountDividendTax from './body-isa-account-dividend-tax';
import coveredCallEtfComparison from './body-covered-call-etf-comparison';
import monthlyDividendPortfolioScenarios from './body-monthly-dividend-portfolio-scenarios';
import usDividendTaxGuide from './body-us-dividend-tax-guide';
import dripCompoundEffect from './body-drip-compound-effect';
import koreaCoveredCallEtfComparison from './body-korea-covered-call-etf-comparison';
import monthlyEtfVsDividendStocks from './body-monthly-etf-vs-dividend-stocks';
import financialIncomeTaxStrategy from './body-financial-income-tax-strategy';
import fxRateAndDividendReturns from './body-fx-rate-and-dividend-returns';
import pensionIsaGeneralAccount from './body-pension-isa-general-account';

// 프리렌더 전용: 모든 가이드 본문을 정적으로 묶어 동기 조회를 제공한다.
// (클라이언트 번들에는 포함되지 않고, entry-server에서만 import 한다.)
const BODIES: Record<string, ReactNode> = {
  'covered-call-etf-basics': coveredCallEtfBasics,
  'isa-account-dividend-tax': isaAccountDividendTax,
  'covered-call-etf-comparison': coveredCallEtfComparison,
  'monthly-dividend-portfolio-scenarios': monthlyDividendPortfolioScenarios,
  'us-dividend-tax-guide': usDividendTaxGuide,
  'drip-compound-effect': dripCompoundEffect,
  'korea-covered-call-etf-comparison': koreaCoveredCallEtfComparison,
  'monthly-etf-vs-dividend-stocks': monthlyEtfVsDividendStocks,
  'financial-income-tax-strategy': financialIncomeTaxStrategy,
  'fx-rate-and-dividend-returns': fxRateAndDividendReturns,
  'pension-isa-general-account': pensionIsaGeneralAccount,
};

export function getGuideBodySync(slug: string): ReactNode | null {
  return BODIES[slug] ?? null;
}
