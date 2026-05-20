import { Link } from 'react-router-dom';

export function AuthorByline() {
  return (
    <aside className="author-byline">
      <div className="author-byline-label">작성</div>
      <div className="author-byline-body">
        <p>
          <b>월배당 자산 시뮬레이터 운영자</b> — 10년 이상 국내외 ETF·주식을 직접
          투자하며, 월배당·커버드콜 전략을 연구·운용해 온 개인 투자자이자
          소프트웨어 개발자입니다. 본 글은 KRX·금융감독원·국세청·ETF 운용사
          공식 자료를 바탕으로 직접 정리했습니다.
        </p>
        <p className="author-byline-links">
          <Link to="/about">운영자 소개 · 계산 방식</Link>
          <span className="dot">·</span>
          <Link to="/contact">문의하기</Link>
        </p>
        <p className="author-byline-disclaimer">
          공인 금융·세무 자격증 보유자가 아니며, 투자·세무 자문이 아닙니다.
        </p>
      </div>
    </aside>
  );
}
