import type React from 'react';

export interface GuideArticle {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readingMinutes: number;
}

export const GUIDES: GuideArticle[] = [
  {
    slug: 'covered-call-etf-basics',
    title: '커버드콜 ETF란? 고배당의 원리와 장단점',
    description:
      'QQQI, TIGER 나스닥100 커버드콜 같은 상품의 기본 구조와 장·단점, 그리고 장기 투자 시 주의해야 할 리스크를 정리합니다.',
    publishedAt: '2026-04-24',
    readingMinutes: 7,
  },
  {
    slug: 'isa-account-dividend-tax',
    title: 'ISA 계좌로 월배당 ETF 절세하기: 한도·과세 정리',
    description:
      'ISA(개인종합자산관리계좌)의 비과세·분리과세 구조를 이해하고, 월배당 ETF 투자에서 어떻게 세금을 최소화할지 정리합니다.',
    publishedAt: '2026-04-24',
    readingMinutes: 8,
  },
  {
    slug: 'covered-call-etf-comparison',
    title: 'QQQI · JEPQ · QYLD 커버드콜 ETF 전격 비교',
    description:
      '같은 나스닥100 기반이지만 구조가 다른 QQQI, JEPQ, QYLD를 분배율·총수익·세금·상승 여지 관점에서 정리합니다.',
    publishedAt: '2026-04-24',
    readingMinutes: 9,
  },
  {
    slug: 'monthly-dividend-portfolio-scenarios',
    title: '월배당 포트폴리오 3가지 시나리오 (공격 · 균형 · 안정)',
    description:
      '목표와 투자 성향에 따라 월배당 포트폴리오를 어떻게 구성할지, 공격형·균형형·안정형 3가지 예시를 수치와 함께 정리합니다.',
    publishedAt: '2026-04-24',
    readingMinutes: 10,
  },
  {
    slug: 'us-dividend-tax-guide',
    title: '미국 배당주 세금 완벽 정리 (일반계좌 · ISA · 연금계좌)',
    description:
      '미국 배당주와 미국 상장 ETF의 배당 과세 구조를 원천징수부터 국내 합산·연말정산까지 계좌 유형별로 정리합니다.',
    publishedAt: '2026-04-24',
    readingMinutes: 8,
  },
];

const bodyImports: Record<string, () => Promise<{ default: React.ReactNode }>> = {
  'covered-call-etf-basics': () => import('./body-covered-call-etf-basics'),
  'isa-account-dividend-tax': () => import('./body-isa-account-dividend-tax'),
  'covered-call-etf-comparison': () => import('./body-covered-call-etf-comparison'),
  'monthly-dividend-portfolio-scenarios': () => import('./body-monthly-dividend-portfolio-scenarios'),
  'us-dividend-tax-guide': () => import('./body-us-dividend-tax-guide'),
};

export function loadGuideBody(slug: string): Promise<React.ReactNode> | null {
  const loader = bodyImports[slug];
  if (!loader) return null;
  return loader().then((m) => m.default);
}

export const getGuide = (slug: string) => GUIDES.find((g) => g.slug === slug);
