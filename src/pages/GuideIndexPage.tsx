import { Link } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';
import { SEO } from '../components/SEO';
import { GUIDES } from '../guides/articles';

export function GuideIndexPage() {
  return (
    <PageLayout
      title="가이드"
      subtitle="커버드콜 ETF, ISA 절세, 세금, DRIP, 포트폴리오까지 — 월배당 투자 가이드 11편."
    >
      <SEO
        title="월배당 ETF 투자 가이드"
        description="커버드콜 ETF 기초부터 ISA·연금 절세, DRIP 복리, 국내 ETF 비교, 금융소득 종합과세, 환율 영향까지. 월배당 ETF 투자 가이드 11편."
        canonical="/guide"
      />
      <div className="guide-list">
        {GUIDES.map((g) => (
          <Link key={g.slug} to={`/guide/${g.slug}`} className="guide-card">
            <div className="guide-meta">
              <span>{g.publishedAt}</span>
              <span className="dot">·</span>
              <span>약 {g.readingMinutes}분</span>
            </div>
            <h2 className="guide-card-title">{g.title}</h2>
            <p className="guide-card-desc">{g.description}</p>
            <span className="guide-card-more">읽어보기 →</span>
          </Link>
        ))}
      </div>
    </PageLayout>
  );
}
