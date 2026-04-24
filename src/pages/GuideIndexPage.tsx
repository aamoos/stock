import { Link } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';
import { GUIDES } from '../guides/articles';

export function GuideIndexPage() {
  return (
    <PageLayout
      title="가이드"
      subtitle="월배당 ETF 투자에 참고가 되는 글을 모았습니다."
    >
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
