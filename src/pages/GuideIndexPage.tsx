import { Link } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';
import { SEO } from '../components/SEO';
import { Breadcrumbs } from '../components/Breadcrumbs';
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
      <Breadcrumbs
        items={[
          { label: '홈', to: '/' },
          { label: '가이드' },
        ]}
      />

      <section>
        <p>
          <b>월배당 ETF·커버드콜 투자 가이드</b> 모음입니다. QQQI·JEPQ·TIGER 나스닥100
          커버드콜처럼 분배율이 높은 상품이 인기지만, 상승장 기회비용·NAV 하락·세금까지
          따지면 실제 총수익은 생각과 다를 수 있습니다. 아래 글들은 상품 구조부터
          계좌별 절세, 배당 재투자(DRIP) 복리, 포트폴리오 구성까지 실제 투자 판단에
          필요한 배경 지식을 단계별로 정리했습니다.
        </p>
        <p>
          각 글은 <b>FAQ</b>와 <Link to="/">홈 시뮬레이터</Link> 연동 예시를 포함합니다.
          처음이라면 <Link to="/guide/covered-call-etf-basics">커버드콜 ETF 기초</Link>부터
          읽고, 절세가 궁금하면{' '}
          <Link to="/guide/isa-account-dividend-tax">ISA 절세</Link> 또는{' '}
          <Link to="/guide/pension-isa-general-account">계좌 선택 가이드</Link>를
          참고하세요.
        </p>
      </section>

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
