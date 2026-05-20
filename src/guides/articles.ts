import type React from 'react';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface GuideArticle {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  readingMinutes: number;
  faq?: FaqItem[];
}

export const GUIDES: GuideArticle[] = [
  {
    slug: 'covered-call-etf-basics',
    title: '커버드콜 ETF란? 고배당의 원리와 장단점',
    description:
      'QQQI, TIGER 나스닥100 커버드콜 같은 상품의 기본 구조와 장·단점, 그리고 장기 투자 시 주의해야 할 리스크를 정리합니다.',
    publishedAt: '2025-11-12',
    updatedAt: '2026-05-06',
    readingMinutes: 7,
    faq: [
      {
        question: '커버드콜 ETF와 일반 배당 ETF의 차이는 무엇인가요?',
        answer: '일반 배당 ETF는 보유 주식의 배당금을 분배하지만, 커버드콜 ETF는 보유 자산에 대해 콜 옵션을 매도하여 얻는 프리미엄을 추가로 분배합니다. 이 때문에 분배율이 높지만, 기초자산 가격이 크게 오를 때 그 상승 이익의 일부를 포기해야 합니다.',
      },
      {
        question: '커버드콜 ETF는 하락장에서 안전한가요?',
        answer: '하락장에서 옵션 프리미엄 수입이 일부 손실을 완충해 주지만, 기초자산 하락은 그대로 반영됩니다. 즉 완전한 방어 수단이 아니며, 급락장에서는 일반 인덱스 ETF와 비슷하게 손실이 발생할 수 있습니다.',
      },
      {
        question: 'NAV가 감소하면 분배금도 줄어드나요?',
        answer: '네, 커버드콜 ETF의 분배금은 주가(NAV)에 비례하는 구조이므로 NAV가 지속 하락하면 분배금 절대 금액도 함께 줄어듭니다. 공격적 100% 오버레이 상품(QYLD, 데일리타겟 등)에서 이 현상이 두드러질 수 있습니다.',
      },
    ],
  },
  {
    slug: 'isa-account-dividend-tax',
    title: 'ISA 계좌로 월배당 ETF 절세하기: 한도·과세 정리',
    description:
      'ISA(개인종합자산관리계좌)의 비과세·분리과세 구조를 이해하고, 월배당 ETF 투자에서 어떻게 세금을 최소화할지 정리합니다.',
    publishedAt: '2025-12-03',
    updatedAt: '2026-05-06',
    readingMinutes: 8,
    faq: [
      {
        question: 'ISA 계좌를 중도에 해지하면 어떻게 되나요?',
        answer: '의무 가입 기간(3년) 이전에 중도 해지하면 비과세·분리과세 혜택이 사라지고, 발생한 이익에 대해 일반 금융소득 세율(15.4%)이 소급 적용됩니다. 3년 이상 유지할 자금으로 운용하는 것이 중요합니다.',
      },
      {
        question: 'ISA에서 미국 상장 QQQI, JEPQ를 직접 살 수 있나요?',
        answer: '아니요, ISA 계좌에서는 국내 상장 ETF만 매수할 수 있습니다. 미국 상장 QQQI·JEPQ·QYLD는 ISA로 직접 매수 불가하며, 대신 TIGER 나스닥100 커버드콜 시리즈, KODEX 미국나스닥100 데일리커버드콜OTM 등 한국 상장 대안을 이용해야 합니다.',
      },
      {
        question: 'ISA 한도가 부족하면 일반계좌와 병행해야 하나요?',
        answer: 'ISA 연간 납입 한도는 2,000만원(누적 최대 1억원)입니다. 이를 초과하는 투자 금액은 일반계좌 또는 연금저축·IRP 계좌를 병행해야 합니다. 세제 혜택 순서는 일반적으로 ISA → 연금저축/IRP → 일반계좌 순으로 우선 배분하는 것이 유리합니다.',
      },
    ],
  },
  {
    slug: 'covered-call-etf-comparison',
    title: 'QQQI · JEPQ · QYLD 커버드콜 ETF 전격 비교',
    description:
      '같은 나스닥100 기반이지만 구조가 다른 QQQI, JEPQ, QYLD를 분배율·총수익·세금·상승 여지 관점에서 정리합니다.',
    publishedAt: '2026-01-08',
    updatedAt: '2026-05-06',
    readingMinutes: 9,
    faq: [
      {
        question: 'QQQI와 JEPQ 중 어떤 것이 더 나은 선택인가요?',
        answer: '투자 목표에 따라 다릅니다. 높은 분배율을 원한다면 QQQI(~13~14%), 장기 총수익과 분배율의 균형을 원한다면 JEPQ가 유리할 수 있습니다. QQQI는 세금 효율이 높고, JEPQ는 JPMorgan의 적극 운용으로 낙폭이 상대적으로 작은 경향이 있습니다. 둘 다 소액 편입해 직접 비교해보는 것을 권장합니다.',
      },
      {
        question: 'QYLD의 분배율이 가장 높은데 왜 추천받지 못하나요?',
        answer: 'QYLD는 100% ATM 오버레이 전략으로 상승 여지를 거의 포기합니다. 강세장에서는 기초자산인 나스닥100(QQQ)이 크게 오르더라도 QYLD NAV는 거의 오르지 않습니다. 높은 분배율에도 불구하고 장기 총수익(분배 + 자본차익)은 QQQ나 JEPQ·QQQI에 비해 낮은 경향이 있습니다.',
      },
      {
        question: '한국 투자자에게 세금 효율이 가장 좋은 상품은 무엇인가요?',
        answer: '한국 투자자 기준으로는 미국 원천징수 15%가 공통 적용되므로 미국 내 세금 구조 차이의 영향이 제한적입니다. 다만 ISA 계좌를 활용해 국내 상장 커버드콜 ETF(TIGER 나스닥100 커버드콜 등)에 투자하면, 미국 원천징수 없이 분배금을 만기까지 과세 이연할 수 있어 실질적으로 가장 세금 효율이 높습니다.',
      },
    ],
  },
  {
    slug: 'monthly-dividend-portfolio-scenarios',
    title: '월배당 포트폴리오 3가지 시나리오 (공격 · 균형 · 안정)',
    description:
      '목표와 투자 성향에 따라 월배당 포트폴리오를 어떻게 구성할지, 공격형·균형형·안정형 3가지 예시를 수치와 함께 정리합니다.',
    publishedAt: '2026-02-14',
    updatedAt: '2026-05-06',
    readingMinutes: 10,
    faq: [
      {
        question: '월배당 ETF 100%로만 포트폴리오를 구성하면 안 되나요?',
        answer: '가능하지만 권장하지 않습니다. 커버드콜 ETF만으로 구성하면 강세장에서 기회비용이 크고, 장기적으로 NAV가 감소할 위험이 있습니다. 총수익 극대화를 원한다면 커버드콜 비중을 30~60% 수준으로 제한하고 순수 성장형 인덱스(S&P500, 나스닥100 등)를 함께 편입하는 것이 일반적으로 더 나은 결과를 냅니다.',
      },
      {
        question: '리밸런싱은 얼마나 자주 해야 하나요?',
        answer: '월배당 포트폴리오는 일반적으로 연 1~2회 리밸런싱이 적절합니다. 더 자주 하면 거래 비용과 세금 부담이 늘어날 수 있습니다. 목표 비중에서 ±5~10% 이상 이탈했을 때 조정하는 "밴드 기반 리밸런싱"도 많이 활용됩니다.',
      },
      {
        question: '월배당을 받으면 바로 재투자해야 하나요?',
        answer: '재투자(DRIP)를 하면 복리 효과로 장기 수익이 커지므로, 현금이 필요하지 않다면 즉시 재투자가 유리합니다. 하지만 재투자 시점의 주가와 매수 비용, 과세 여부에 따라 효율이 달라질 수 있습니다. 홈 시뮬레이터에서 DRIP 옵션을 켜고/꺼서 10년 후 차이를 직접 비교해보세요.',
      },
    ],
  },
  {
    slug: 'us-dividend-tax-guide',
    title: '미국 배당주 세금 완벽 정리 (일반계좌 · ISA · 연금계좌)',
    description:
      '미국 배당주와 미국 상장 ETF의 배당 과세 구조를 원천징수부터 국내 합산·연말정산까지 계좌 유형별로 정리합니다.',
    publishedAt: '2026-03-21',
    updatedAt: '2026-05-06',
    readingMinutes: 8,
    faq: [
      {
        question: '미국 주식 배당을 받으면 한국에서도 세금을 내야 하나요?',
        answer: '미국에서 15% 원천징수 후, 한국 기준 세율 15.4%와의 차이인 약 0.4%를 한국에서 추가 납부합니다(외국납부세액공제 적용). 연간 금융소득이 2,000만원을 초과하면 종합소득세 신고 대상이 되어 누진세율이 추가 적용될 수 있습니다.',
      },
      {
        question: 'ISA와 연금저축 중 어디에 먼저 넣는 게 유리한가요?',
        answer: '당장 세액공제 환급을 원한다면 연금저축·IRP가 유리합니다(연 900만원 한도, 13.2~16.5% 환급). 유동성을 원한다면 ISA(3년 후 해지 가능)가 낫습니다. 일반적으로 세액공제 한도를 연금계좌로 먼저 채운 뒤, 남은 금액을 ISA에 넣는 순서를 권장합니다.',
      },
      {
        question: '금융소득 종합과세 2,000만원 기준은 어떻게 계산하나요?',
        answer: '국내·해외 모든 계좌의 이자소득과 배당소득을 합산한 금액이 연간 2,000만원을 초과하면 종합과세 대상입니다. ISA 계좌 내 분배금은 만기 시점까지 포함되지 않으며, 연금저축 수령액도 별도 연금소득으로 분리됩니다. 금액이 2,000만원에 근접한다면 ISA 활용으로 분배금을 이연하는 전략이 효과적입니다.',
      },
    ],
  },
  {
    slug: 'drip-compound-effect',
    title: 'DRIP 배당 재투자, 복리 효과 완벽 가이드',
    description:
      '배당 재투자(DRIP)가 장기 자산에 미치는 복리 효과, 켜야 할 때와 끄는 것이 나을 때, 커버드콜 ETF에서의 주의점을 정리합니다.',
    publishedAt: '2026-04-02',
    updatedAt: '2026-05-18',
    readingMinutes: 8,
    faq: [
      {
        question: 'DRIP을 켜면 세금도 더 많이 내나요?',
        answer: '일반계좌에서는 배당이 발생하는 시점에 과세되므로, DRIP을 켜도 매월 배당 소득세는 동일하게 발생합니다. 다만 재투자로 주식 수가 늘면 이후 달 배당 절대액도 커져 세금 총액이 늘 수 있습니다. ISA 한도 내 0% 세율이면 DRIP의 복리 효과가 더 크게 남습니다.',
      },
      {
        question: '모든 월배당 ETF에 DRIP을 켜는 게 좋나요?',
        answer: '아닙니다. NAV가 장기 하락하는 공격적 커버드콜 ETF에 DRIP을 켜면 하락하는 자산에 계속 재투자하게 됩니다. 자산 축적이 목표이고 상품의 장기 전망에 확신이 있을 때 DRIP이 유리하고, 현금 흐름이 목표면 DRIP을 끄는 것이 맞습니다.',
      },
      {
        question: '시뮬레이터에서 DRIP 효과는 어떻게 비교하나요?',
        answer: '같은 종목·같은 적립 조건으로 DRIP 옵션만 ON/OFF하여 두 번 실행하면 됩니다. 차트의 평가금·누적배당 곡선과 최종 평가금 통계를 비교하세요.',
      },
    ],
  },
  {
    slug: 'korea-covered-call-etf-comparison',
    title: 'TIGER vs KODEX vs SOL — 국내 커버드콜 ETF 비교',
    description:
      'ISA·연금계좌에서 매수 가능한 국내 상장 커버드콜 ETF를 운용사·전략·보수·분배 안정성 관점에서 비교하는 방법을 정리합니다.',
    publishedAt: '2026-04-18',
    updatedAt: '2026-05-18',
    readingMinutes: 9,
    faq: [
      {
        question: '국내 커버드콜 ETF만으로 QQQI와 같은 효과를 낼 수 있나요?',
        answer: '완전히 동일하지는 않습니다. 운용 전략·오버레이 비율·보수·분배 정책이 다릅니다. 다만 나스닥100·S&P500 등 같은 기초 지수를 추종하는 국내 상품을 골라 ISA에서 운용하면 세금 측면에서 미국 직접 투자보다 유리한 경우가 많습니다.',
      },
      {
        question: '데일리타겟 ETF는 ISA에 넣어도 되나요?',
        answer: '가능하지만 장기 NAV 감소 리스크가 큽니다. ISA 비과세 혜택이 있어도 원금이 줄면 분배금 절대액도 함께 줄어듭니다. 3년 의무 기간 동안 NAV 추이와 분배 안정성을 운용사 공시로 확인한 뒤 결정하세요.',
      },
      {
        question: '국내 ETF 선택 시 거래량이 왜 중요한가요?',
        answer: '호가 스프레드가 넓으면 매수·매도 시마다 비용이 발생합니다. 월 적립식이라도 매월 매수하므로 유동성이 좋은 상품이 장기적으로 유리할 수 있습니다. KRX에서 일평균 거래대금을 확인하세요.',
      },
    ],
  },
  {
    slug: 'monthly-etf-vs-dividend-stocks',
    title: '월배당 ETF vs 배당주 — 무엇이 다른가',
    description:
      '월배당 ETF와 개별 배당주의 수익 구조, 세금, 리스크, 관리 부담을 비교하고 어떤 투자자에게 어떤 방식이 맞는지 정리합니다.',
    publishedAt: '2026-05-01',
    updatedAt: '2026-05-18',
    readingMinutes: 8,
    faq: [
      {
        question: '배당주가 월배당 ETF보다 항상 유리한가요?',
        answer: '그렇지 않습니다. 우량 배당주는 장기 자본차익+배당 성장이 가능하지만, 종목 리스크·배당 삭감·분기 배당 등 현금흐름이 불규칙합니다. 월배당 ETF는 분산·월 단위 분배·소액 접근이 쉽지만, 커버드콜형은 상승 제한·NAV 리스크가 있습니다.',
      },
      {
        question: '둘 다 포트폴리오에 넣어도 되나요?',
        answer: '네, 많은 투자자가 성장형 인덱스 + 커버드콜 ETF + (소액) 우량 배당주를 혼합합니다. 비중은 나이·목표·세금 상황에 따라 달라집니다.',
      },
      {
        question: '시뮬레이터에 배당주도 넣을 수 있나요?',
        answer: '네. "새 종목"으로 추가하고 연 배당률·연 상승률·월 적립금을 입력하면 ETF와 동일하게 시뮬레이션할 수 있습니다.',
      },
    ],
  },
  {
    slug: 'financial-income-tax-strategy',
    title: '금융소득 종합과세 2,000만원 — 월배당 투자자 대응법',
    description:
      '금융소득 종합과세 기준과 포함·제외 항목, 월배당 ETF 투자자가 2,000만원 한도를 관리하는 실무 전략을 정리합니다.',
    publishedAt: '2026-05-08',
    updatedAt: '2026-05-18',
    readingMinutes: 9,
    faq: [
      {
        question: 'ISA 분배금은 2,000만원에 포함되나요?',
        answer: 'ISA 만기(3년+) 해지 전까지는 일반적으로 분배금이 금융소득 합산에 포함되지 않습니다. 만기 해지 시 비과세 한도·분리과세 등 ISA 규정에 따라 과세됩니다. ISA 중도 해지 시 혜택이 소급 취소될 수 있습니다.',
      },
      {
        question: 'DRIP을 하면 종합과세를 피할 수 있나요?',
        answer: '일반계좌에서는 DRIP 여부와 관계없이 배당 발생 시점에 배당소득으로 과세됩니다. DRIP은 현금 인출만 미루는 것이지 과세 이연이 아닙니다.',
      },
      {
        question: '시뮬레이터에서 종합과세를 반영할 수 있나요?',
        answer: '자동 판별은 하지 않습니다. 2,000만원 초과 시나리오를 보려면 배당세율을 15.4%보다 높게(예: 20~35%) 입력해 보수적으로 시뮬레이션할 수 있습니다.',
      },
    ],
  },
  {
    slug: 'fx-rate-and-dividend-returns',
    title: '환율 변동이 월배당 ETF 수익에 미치는 영향',
    description:
      '미국 상장 ETF 투자 시 환율이 평가금·배당·적립 매수에 미치는 영향과, 시뮬레이터로 시나리오별 비교하는 방법을 정리합니다.',
    publishedAt: '2026-05-12',
    updatedAt: '2026-05-18',
    readingMinutes: 7,
    faq: [
      {
        question: '원화가 약세(환율 상승)면 월배당 ETF 수익이 항상 늘어나나요?',
        answer: '원화 기준 평가금·배당 원화액은 늘어날 수 있지만, 같은 원화로 USD ETF를 살 때는 고환율이 불리합니다. 순효과는 매수 시점·보유 기간·환율 변동 경로에 따라 달라집니다.',
      },
      {
        question: '국내 상장 ETF는 환율 걱정이 없나요?',
        answer: '원화로 거래되므로 투자자가 직접 환전하지 않아도, 기초자산이 미국 시장이면 NAV에 환율·해외 시장 변동이 반영됩니다. 완전히 환율과 무관하지는 않습니다.',
      },
      {
        question: '시뮬레이터 환율은 어떻게 설정하나요?',
        answer: '설정 패널의 USD→KRW에서 직접 입력하거나 ↻ 버튼으로 최신 환율을 불러올 수 있습니다. 전 기간 고정 환율 가정이므로 1,300/1,400/1,500 등 여러 값으로 나눠 실행해 비교하세요.',
      },
    ],
  },
  {
    slug: 'pension-isa-general-account',
    title: '연금저축 vs ISA vs 일반계좌 — 월배당 ETF 어디에?',
    description:
      '월배당 ETF 투자 시 일반계좌·ISA·연금저축·IRP의 세금·유동성·한도 차이와 실무 배분 순서를 정리합니다.',
    publishedAt: '2026-05-18',
    readingMinutes: 9,
    faq: [
      {
        question: '월배당 ETF는 어느 계좌에 먼저 넣어야 하나요?',
        answer: '일반적으로 연금저축·IRP 세액공제 한도 → ISA(3년+ 유지 가능한 국내 ETF) → 일반계좌(해외 직접·한도 초과분) 순을 참고합니다. 다만 유동성·나이·소득에 따라 달라질 수 있습니다.',
      },
      {
        question: 'QQQI를 ISA에 넣을 수 있나요?',
        answer: '아니요. QQQI는 미국 상장 ETF이므로 ISA 매수가 불가합니다. ISA에는 TIGER·KODEX 등 국내 상장 커버드콜 ETF를 넣을 수 있습니다.',
      },
      {
        question: '시뮬레이터로 계좌별 차이를 볼 수 있나요?',
        answer: '같은 ETF를 두 번 추가하고 계좌 유형(일반/ISA)과 배당세율(15.4% vs 0%·9.9%)만 다르게 설정하면 누적 세후 배당·최종 평가금을 비교할 수 있습니다.',
      },
    ],
  },
];

const bodyImports: Record<string, () => Promise<{ default: React.ReactNode }>> = {
  'covered-call-etf-basics': () => import('./body-covered-call-etf-basics'),
  'isa-account-dividend-tax': () => import('./body-isa-account-dividend-tax'),
  'covered-call-etf-comparison': () => import('./body-covered-call-etf-comparison'),
  'monthly-dividend-portfolio-scenarios': () => import('./body-monthly-dividend-portfolio-scenarios'),
  'us-dividend-tax-guide': () => import('./body-us-dividend-tax-guide'),
  'drip-compound-effect': () => import('./body-drip-compound-effect'),
  'korea-covered-call-etf-comparison': () => import('./body-korea-covered-call-etf-comparison'),
  'monthly-etf-vs-dividend-stocks': () => import('./body-monthly-etf-vs-dividend-stocks'),
  'financial-income-tax-strategy': () => import('./body-financial-income-tax-strategy'),
  'fx-rate-and-dividend-returns': () => import('./body-fx-rate-and-dividend-returns'),
  'pension-isa-general-account': () => import('./body-pension-isa-general-account'),
};

export function loadGuideBody(slug: string): Promise<React.ReactNode> | null {
  const loader = bodyImports[slug];
  if (!loader) return null;
  return loader().then((m) => m.default);
}

export const getGuide = (slug: string) => GUIDES.find((g) => g.slug === slug);
