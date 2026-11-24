import { BarList, CalcTable } from './CalcBlocks';
import { last } from './calc';
import { formatKrw } from '../simulator';

const INITIAL = 10_000_000;
const YIELD = 12;
const YEARS = 10;

function compare(growthPct: number) {
  const base = { initialKrw: INITIAL, years: YEARS, yieldPct: YIELD, growthPct };
  const on = last(base).totalValueKrw;
  const offLast = last({ ...base, reinvest: false });
  const off = offLast.totalValueKrw + offLast.cumNetDividendKrw;
  return { growthPct, on, off, diff: on - off };
}

// 재투자와 현금 보관의 결과가 같아지는 연 주가 변동률
let lo = -20;
let hi = 0;
for (let i = 0; i < 40; i++) {
  const mid = (lo + hi) / 2;
  if (compare(mid).diff > 0) hi = mid;
  else lo = mid;
}
const breakeven = Math.abs(hi).toFixed(1);

const rows = [3, 0, -3, -6, -9, -12, -15].map(compare);
const at = (g: number) => rows.find((r) => r.growthPct === g)!;
const won = (n: number) => `${formatKrw(n)}원`;
const pct = (n: number) => `${n > 0 ? '+' : ''}${n}%`;

export default (
  <>
    <section>
      <h2>결론부터</h2>
      <p>
        연 배당률 {YIELD}%, 배당세율 15.4%라면 10년 동안 주가가 <b>매년 약 {breakeven}%보다 더
        빠질 때부터</b> 배당 재투자(DRIP)가 현금으로 모으는 것보다 불리했습니다. 주가가 그보다 덜
        빠지면 재투자가 유리합니다.
      </p>
      <p>
        "주가가 떨어지는 상품은 재투자하면 안 된다"는 말은 절반만 맞습니다. 중요한 것은
        <b> 하락 폭이 세후 배당률과 비교해 얼마나 큰지</b>입니다.
      </p>
    </section>

    <section>
      <h2>어떻게 계산했나</h2>
      <ul>
        <li>처음에 1,000만원을 넣고 추가 적립은 하지 않습니다.</li>
        <li>연 배당률 {YIELD}%, 배당세율 15.4%, 기간 {YEARS}년입니다.</li>
        <li><b>재투자</b>: 세후 배당으로 매달 같은 종목을 삽니다.</li>
        <li><b>현금 보관</b>: 세후 배당을 이자 없이 모으고, 마지막 평가금과 더합니다.</li>
        <li>배당은 그때의 주가에 비례합니다. 주가가 내리면 배당금도 줄어듭니다.</li>
      </ul>
    </section>

    <section>
      <h2>주가 변동률별 10년 뒤 결과</h2>
      <CalcTable
        caption="1,000만원을 넣고 10년 뒤 남는 돈 (팔 때의 세금 제외)"
        head={['연 주가', '재투자', '현금 보관', '차이']}
        rows={rows.map((r) => [
          pct(r.growthPct), won(r.on), won(r.off),
          <b key="d">{r.diff >= 0 ? '+' : '-'}{won(Math.abs(r.diff))}</b>,
        ])}
      />
      <BarList
        caption="재투자했을 때 10년 뒤 평가금"
        rows={rows.map((r) => ({ label: pct(r.growthPct), value: r.on, display: won(r.on) }))}
      />
      <p>
        주가가 그대로라면 재투자한 쪽이 {won(at(0).diff)} 더 많습니다. 반대로 매년 12%씩 빠지면
        재투자는 원금 1,000만원보다 적은 {won(at(-12).on)}만 남고, 현금 보관도{' '}
        {won(at(-12).off)}으로 원금에 못 미칩니다. <b>이때의 문제는 재투자 여부보다
        상품 선택</b>입니다.
      </p>
    </section>

    <section>
      <h2>왜 이런 기준이 나올까</h2>
      <p>
        재투자한 돈은 그 뒤로 세후 배당만큼 늘고 주가 하락만큼 줄어듭니다. 배당률 {YIELD}%의 세후
        배당률은 약 {(YIELD * 0.846).toFixed(1)}%입니다. 주가가 이보다 많이 빠지면 재투자한 돈이
        현금보다 빨리 줄어듭니다. 배당과 하락이 매달 나뉘어 일어나기 때문에 실제로 계산한
        기준은 {breakeven}%로 조금 낮습니다.
      </p>
    </section>

    <section>
      <h2>재투자하지 않는 편이 나은 경우</h2>
      <ul>
        <li>배당을 생활비로 써야 할 때</li>
        <li>주가 하락이 세후 배당률보다 클 것으로 예상할 때</li>
        <li>배당으로 다른 자산을 사서 비중을 조절하고 싶을 때</li>
      </ul>
      <p>
        내 조건으로 확인하려면 <a href="/">시뮬레이터</a>에서 연 상승률을 음수로 넣고 배당 재투자를
        켜고 꺼 보세요. 주가가 내릴 때 월 배당이 어떻게 줄어드는지는{' '}
        <a href="/guide/falling-price-monthly-income">주가가 빠지면 월배당은 얼마나 줄까</a>에
        정리했습니다.
      </p>
      <p className="muted">
        매년 같은 비율로 움직인다는 가정이며 실제 주가와 배당은 다릅니다. 투자 권유가 아닙니다.{' '}
        <a href="/disclaimer">면책조항</a> 참조.
      </p>
    </section>
  </>
);
