import { Link } from 'react-router-dom';

export function AuthorByline() {
  return (
    <aside className="author-byline">
      <div className="author-byline-label">작성</div>
      <div className="author-byline-body">
        <p>
          <b>월배당 자산 시뮬레이터 운영자</b> — 이 사이트와 계산기를 만든
          소프트웨어 개발자입니다. 금융 전문가가 아니므로 중요한 수치는
          국세청·운용사 공식 자료에서 한 번 더 확인해 주세요.
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
