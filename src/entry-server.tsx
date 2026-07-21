import { renderToString } from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { Route, Routes, StaticRouter } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { GuideIndexPage } from './pages/GuideIndexPage';
import { GuideArticlePage } from './pages/GuideArticlePage';
import { GuideBodyContext } from './guides/GuideBodyContext';
import { getGuideBodySync } from './guides/bodies.server';
import { GUIDES } from './guides/articles';

export interface RenderResult {
  appHtml: string;
  head: string;
}

export function render(url: string): RenderResult {
  const rawHtml = renderToString(
    <HelmetProvider>
      <GuideBodyContext.Provider value={getGuideBodySync}>
        <StaticRouter location={url}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/guide" element={<GuideIndexPage />} />
            <Route path="/guide/:slug" element={<GuideArticlePage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </StaticRouter>
      </GuideBodyContext.Provider>
    </HelmetProvider>,
  );

  // React 19 + react-helmet-async(v3)는 <title>/<meta>/<link>를 앱 트리에 인라인으로
  // 렌더링한다(브라우저 자동 hoisting 전제). 프리렌더 정적 HTML에서는 이 태그들을
  // 추출해 <head>로 옮기고, body(appHtml)에서는 제거해 문서 구조를 올바르게 만든다.
  const titleRe = /<title[^>]*>[\s\S]*?<\/title>/gi;
  const metaRe = /<meta\b[^>]*?>/gi;
  const linkRe = /<link\b[^>]*?>/gi;

  const titles = rawHtml.match(titleRe) ?? [];
  const metas = rawHtml.match(metaRe) ?? [];
  const links = rawHtml.match(linkRe) ?? [];

  const appHtml = rawHtml
    .replace(titleRe, '')
    .replace(metaRe, '')
    .replace(linkRe, '');

  const head = [...titles, ...metas, ...links].join('\n    ');

  return { appHtml, head };
}

// 프리렌더 대상 라우트 목록 (정적 페이지 + 모든 가이드 글)
export const PRERENDER_ROUTES: string[] = [
  '/',
  '/about',
  '/contact',
  '/disclaimer',
  '/privacy',
  '/guide',
  ...GUIDES.map((g) => `/guide/${g.slug}`),
];

export interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq: string;
  priority: string;
}

// 가이드 메타데이터와 항상 동기화되는 sitemap 항목 (빌드 시 dist/sitemap.xml 생성에 사용)
export const SITEMAP: SitemapEntry[] = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/guide', changefreq: 'weekly', priority: '0.8' },
  ...GUIDES.map((g) => ({
    loc: `/guide/${g.slug}`,
    lastmod: g.updatedAt ?? g.publishedAt,
    changefreq: 'monthly',
    priority: '0.7',
  })),
  { loc: '/about', changefreq: 'monthly', priority: '0.7' },
  { loc: '/contact', changefreq: 'monthly', priority: '0.5' },
  { loc: '/disclaimer', changefreq: 'yearly', priority: '0.3' },
  { loc: '/privacy', changefreq: 'yearly', priority: '0.3' },
];
