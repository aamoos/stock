import { Link } from 'react-router-dom';

export function SiteFooter() {
  return (
    <footer className="footer">
      <nav className="footer-nav">
        <Link to="/">홈</Link>
        <span className="dot">·</span>
        <Link to="/about">사용법</Link>
        <span className="dot">·</span>
        <Link to="/disclaimer">면책조항</Link>
        <span className="dot">·</span>
        <Link to="/privacy">개인정보처리방침</Link>
      </nav>
      <p>
        본 사이트는 <b>투자 권유가 아닙니다</b>. 입력한 가정(연 배당률, 주가 상승률, 환율, 세율)에
        따른 단순 수학적 시뮬레이션이며, 실제 ETF 분배금·수익률과 크게 다를 수 있습니다. 투자 결정은
        스스로 충분히 검토한 후 본인의 책임하에 이루어져야 합니다.
      </p>
      <p>
        © {new Date().getFullYear()} 월배당 자산 시뮬레이터. All rights reserved.
      </p>
    </footer>
  );
}
