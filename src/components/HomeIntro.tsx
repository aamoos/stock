import { Link } from 'react-router-dom';
import { GUIDES } from '../guides/articles';

export function HomeIntro() {
  return (
    <section className="card home-intro">
      <h2>월배당 ETF 장기 투자, 숫자로 먼저 확인하세요</h2>
      <p>
        QQQI, JEPQ, TIGER 나스닥100 커버드콜처럼 <b>월배당 ETF</b>는 분배율이 높아 보이지만,
        상승장에서의 기회비용·NAV 하락·세금까지 합치면 장기 총수익이 생각보다 낮을 수 있습니다.
        이 시뮬레이터는 <b>월 적립 + 배당 재투자(DRIP) + 계좌별 세율</b>을 한 번에 반영해
        10년·20년 뒤 자산이 어떻게 달라지는지 비교할 수 있게 만든 무료 도구입니다.
      </p>

      <h3>시작 방법</h3>
      <ol className="home-intro-steps">
        <li>왼쪽 <b>설정</b> 패널(☰)에서 시뮬레이션 기간·환율·DRIP 여부를 정합니다.</li>
        <li><b>보유 종목 + 추가</b>로 ETF를 넣고, 월 적립금·연 배당률·연 상승률·세율을 입력합니다.</li>
        <li>일반계좌와 ISA를 섞어 넣으면 세후 수익 차이를 바로 비교할 수 있습니다.</li>
      </ol>

      <h3>투자 가이드</h3>
      <p>
        계산기만으로는 부족한 배경 지식은 아래 가이드에서 정리했습니다.
        커버드콜 ETF 구조, ISA 절세, QQQI·JEPQ·QYLD 비교, 포트폴리오 시나리오,
        미국 배당 세금까지 <b>{GUIDES.length}편</b>의 글로 다룹니다.
      </p>
      <ul className="home-intro-guides">
        {GUIDES.map((g) => (
          <li key={g.slug}>
            <Link to={`/guide/${g.slug}`}>{g.title}</Link>
            <span className="home-intro-guide-meta">약 {g.readingMinutes}분</span>
          </li>
        ))}
      </ul>

      <p className="home-intro-note">
        본 도구와 가이드는 <b>투자 권유가 아닙니다</b>.
        입력한 가정에 따른 수학적 시뮬레이션이며, 실제 분배금·수익률과 다를 수 있습니다.
        자세한 계산 방식은 <Link to="/about">사용법 및 계산 방식</Link>을,
        면책 사항은 <Link to="/disclaimer">면책조항</Link>을 참고하세요.
      </p>
    </section>
  );
}
