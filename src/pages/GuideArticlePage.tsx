import { Link, useParams } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';
import { AdSlot } from '../AdSlot';
import { getGuide, GUIDES } from '../guides/articles';

const AD_SLOT_MIDDLE = import.meta.env.VITE_ADSENSE_SLOT_MIDDLE;

export function GuideArticlePage() {
  const { slug = '' } = useParams();
  const guide = getGuide(slug);

  if (!guide) {
    return (
      <PageLayout title="가이드를 찾을 수 없습니다">
        <p>
          요청하신 글이 존재하지 않습니다.{' '}
          <Link to="/guide">가이드 목록으로 돌아가기</Link>
        </p>
      </PageLayout>
    );
  }

  const others = GUIDES.filter((g) => g.slug !== guide.slug);

  return (
    <PageLayout title={guide.title} subtitle={guide.description}>
      <div className="guide-meta guide-meta-top">
        <span>{guide.publishedAt}</span>
        <span className="dot">·</span>
        <span>약 {guide.readingMinutes}분 읽기</span>
      </div>

      {guide.body}

      <AdSlot
        slot={AD_SLOT_MIDDLE}
        format="auto"
        minHeight={120}
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
