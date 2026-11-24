import { BarList, CalcTable } from './CalcBlocks';
import { run } from './calc';
import { formatKrw } from '../simulator';

const INITIAL = 100_000_000;
const YIELD = 12;

function path(growthPct: number) {
  const r = run({ initialKrw: INITIAL, years: 10, yieldPct: YIELD, growthPct, reinvest: false });
  const end = r[r.length - 1];
  return {
    growthPct,
    first: r[0].totalNetDividendKrw,
    year5: r[59].totalNetDividendKrw,
    year10: end.totalNetDividendKrw,
    value: end.totalValueKrw,
    dividends: end.cumNetDividendKrw,
    total: end.totalValueKrw + end.cumNetDividendKrw,
  };
}

const rows = [3, 0, -3, -5, -7, -10].map(path);
const won = (n: number) => `${formatKrw(n)}원`;
const pct = (n: number) => `${n > 0 ? '+' : ''}${n}%`;
const at = (g: number) => rows.find((r) => r.growthPct === g)!;

export default (
  <>
    <section>
      <h2>결론부터</h2>
      <p>
        1억원을 연 배당률 {YIELD}% 상품에 넣으면 첫 달 세후 배당은 약 {won(at(0).first)}입니다. 그런데
        주가가 매년 5%씩 빠지면 10년 뒤 월배당은 <b>{won(at(-5).year10)}</b>, 10%씩 빠지면{' '}
        <b>{won(at(-10).year10)}</b>으로 줄어듭니다. <b>배당률이 그대로 {YIELD}%여도</b> 배당금은 줄어듭니다.
      </p>
    </section>

    <section>
      <h2>월배당이 줄어드는 모습</h2>
      <CalcTable
        caption="1억원을 넣고 배당을 모두 쓸 때의 세후 월배당"
        head={['연 주가', '첫 달', '5년 뒤', '10년 뒤']}
        rows={rows.map((r) => [pct(r.growthPct), won(r.first), won(r.year5), <b key="y">{won(r.year10)}</b>])}
      />
      <BarList
        caption="10년 뒤 세후 월배당"
        rows={rows.map((r) => ({ label: pct(r.growthPct), value: r.year10, display: won(r.year10) }))}
      />
    </section>

    <section>
      <h2>받은 배당까지 합치면 본전일까</h2>
      <CalcTable
        caption="10년 동안 받은 세후 배당 + 남은 평가금"
        head={['연 주가', '받은 배당', '남은 평가금', '합계']}
        rows={rows.map((r) => [pct(r.growthPct), won(r.dividends), won(r.value), <b key="t">{won(r.total)}</b>])}
      />
      <p>
        매년 5%씩 빠져도 10년 합계는 {won(at(-5).total)}으로 원금보다 많습니다. 하지만 매년 10%씩 빠지면{' '}
        {YIELD}% 배당을 10년이나 받고도 {won(at(-10).total)}으로 <b>원금 1억원에 못 미칩니다</b>.
      </p>
    </section>

    <section>
      <h2>상품을 볼 때 확인할 것</h2>
      <ol>
        <li><b>분배율보다 분배금 금액의 추이</b> — 주당 분배금이 2~3년 동안 줄고 있는지 봅니다.</li>
        <li><b>배당을 포함한 총수익</b> — 주가만 보거나 배당만 보면 반쪽입니다.</li>
        <li><b>생활비로 쓸 계획이라면</b> — 첫 달 배당이 아니라 5년, 10년 뒤 금액으로 계획을 세웁니다.</li>
      </ol>
      <p>
        배당을 다시 투자하면 결과가 어떻게 달라지는지는{' '}
        <a href="/guide/drip-compound-effect">배당 재투자 계산</a>을 참고하세요. 커버드콜 상품의 구조는{' '}
        <a href="/guide/covered-call-etf-basics">커버드콜 ETF 기초</a>에서 설명합니다.
      </p>
      <p className="muted">
        주가가 매년 같은 비율로 움직이고 배당률이 유지된다는 가정입니다. 배당세율 15.4%. 투자 권유가
        아닙니다. <a href="/disclaimer">면책조항</a> 참조.
      </p>
    </section>
  </>
);
