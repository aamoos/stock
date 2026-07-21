import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';
import { SEO } from '../components/SEO';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { AdSlot } from '../AdSlot';
import { AuthorByline } from '../components/AuthorByline';
import { getGuide, GUIDES, loadGuideBody } from '../guides/articles';
import { GuideBodyContext } from '../guides/GuideBodyContext';
import type { ReactNode } from 'react';

const AD_SLOT_MIDDLE = import.meta.env.VITE_ADSENSE_SLOT_MIDDLE;

export function GuideArticlePage() {
  const { slug = '' } = useParams();
  const guide = getGuide(slug);
  const getBodySync = useContext(GuideBodyContext);
  // 프리렌더(SSR) 시에는 컨텍스트에서 본문을 동기적으로 얻어 첫 렌더에 포함시킨다.
  const [body, setBody] = useState<ReactNode>(() => getBodySync?.(slug) ?? null);
  const [renderedSlug, setRenderedSlug] = useState(slug);

  // 클라이언트에서 slug이 바뀌면(가이드 간 이동) 렌더 도중 본문 상태를 초기화한다.
  if (slug !== renderedSlug) {
    setRenderedSlug(slug);
    setBody(getBodySync?.(slug) ?? null);
  }

  // 아직 본문이 없으면(클라이언트 초기 진입) 동적 import로 비동기 로드한다.
  useEffect(() => {
    if (!guide || body != null) return;
    let cancelled = false;
    const promise = loadGuideBody(slug);
    promise?.then((b) => {
      if (!cancelled) setBody(b);
    });
    return () => {
      cancelled = true;
    };
  }, [slug, guide, body]);

  if (!guide) {
    return (
      <PageLayout title="가이드를 찾을 수 없습니다">
        <SEO title="가이드를 찾을 수 없습니다" canonical="/guide" />
        <p>
          요청하신 글이 존재하지 않습니다.{' '}
          <Link to="/guide">가이드 목록으로 돌아가기</Link>
        </p>
      </PageLayout>
    );
  }

  const others = GUIDES.filter((g) => g.slug !== guide.slug)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 6);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt ?? guide.publishedAt,
    author: {
      '@type': 'Person',
      name: '월배당 자산 시뮬레이터 운영자',
      url: 'https://stock-ten-iota.vercel.app/about',
    },
    publisher: {
      '@type': 'Organization',
      name: '월배당 자산 시뮬레이터',
      url: 'https://stock-ten-iota.vercel.app',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://stock-ten-iota.vercel.app/guide/${guide.slug}`,
    },
  };

  const faqSchema = guide.faq && guide.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  } : null;

  return (
    <PageLayout title={guide.title} subtitle={guide.description}>
      <SEO
        title={guide.title}
        description={guide.description}
        canonical={`/guide/${guide.slug}`}
        ogType="article"
        publishedAt={guide.publishedAt}
        modifiedAt={guide.updatedAt}
        schemaJson={articleSchema}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <Breadcrumbs
        items={[
          { label: '홈', to: '/' },
          { label: '가이드', to: '/guide' },
          { label: guide.title },
        ]}
      />
      <div className="guide-meta guide-meta-top">
        <span>{guide.publishedAt}</span>
        {guide.updatedAt && guide.updatedAt !== guide.publishedAt && (
          <>
            <span className="dot">·</span>
            <span>최종 수정 {guide.updatedAt}</span>
          </>
        )}
        <span className="dot">·</span>
        <span>약 {guide.readingMinutes}분 읽기</span>
      </div>

      <AuthorByline />

      {body}

      {guide.faq && guide.faq.length > 0 && (
        <section className="faq-section">
          <h2>자주 묻는 질문 (FAQ)</h2>
          <dl className="faq-list">
            {guide.faq.map((item, i) => (
              <div key={i} className="faq-item">
                <dt className="faq-question">{item.question}</dt>
                <dd className="faq-answer">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <AdSlot
        slot={AD_SLOT_MIDDLE}
        format="auto"
      />

      {others.length > 0 && (
        <section>
          <h2>다른 가이드</h2>
          <div className="guide-list">
            {others.map((g) => (
              <Link key={g.slug} to={`/guide/${g.slug}`} className="guide-card">
                <div className="guide-meta">
                  <span>{g.publishedAt}</span>
                  <span className="dot">·</span>
                  <span>약 {g.readingMinutes}분</span>
                </div>
                <h3 className="guide-card-title">{g.title}</h3>
                <p className="guide-card-desc">{g.description}</p>
                <span className="guide-card-more">읽어보기 →</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </PageLayout>
  );
}
