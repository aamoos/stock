import { BarList, CalcTable } from './CalcBlocks';
import { last } from './calc';
import { formatKrw } from '../simulator';

const MONTHLY = 500_000;
const END = 20;
const YIELD = 8;

const value = (years: number) =>
  last({ monthlyKrw: MONTHLY, years, yieldPct: YIELD, growthPct: 0 }).totalValueKrw;

const full = value(END);
const rows = [0, 1, 3, 5, 10].map((delay) => {
  const v = value(END - delay);
  return {
    delay,
    v,
    paid: MONTHLY * 12 * (END - delay),
    needed: (MONTHLY * full) / v,
  };
});
const won = (n: number) => `${formatKrw(n)}원`;
const label = (d: number) => (d === 0 ? '지금 시작' : `${d}년 뒤 시작`);
const five = rows.find((r) => r.delay === 5)!;

export default (
  <>
    <section>
      <h2>결론부터</h2>
      <p>
        연 배당률 {YIELD}%, 주가 0%로 {END}년을 잡으면, 5년 늦게 시작할 때 같은 금액을 만들기 위해
        월 50만원 대신 <b>월 {won(five.needed)}</b>을 넣어야 합니다. 납입한 원금은{' '}
        {won(rows[0].paid - five.paid)} 적은데 결과는 <b>{won(full - five.v)}</b> 줄어듭니다.
      </p>
    </section>

    <section>
      <h2>시작 시점별 결과</h2>
      <CalcTable
        caption={`지금부터 ${END}년 뒤의 평가금 (월 50만원, 세후 배당 재투자)`}
        head={['시작', '낸 돈', '평가금', '같은 결과에 필요한 월 적립']}
        rows={rows.map((r) => [label(r.delay), won(r.paid), won(r.v), <b key="n">{won(r.needed)}</b>])}
      />
      <BarList
        caption={`${END}년 뒤 평가금`}
        rows={rows.map((r) => ({ label: label(r.delay), value: r.v, display: won(r.v) }))}
      />
    </section>

    <section>
      <h2>이 표를 볼 때 주의할 점</h2>
      <ul>
        <li>
          빨리 시작하는 것이 유리하려면 <b>세후 총수익이 0보다 커야</b> 합니다. 주가가 배당보다 많이
          빠지는 상품이라면 일찍 넣은 돈이 오히려 더 많이 줄어듭니다.
        </li>
        <li>비상금이나 이자가 높은 대출이 있다면 먼저 해결하는 편이 나을 수 있습니다.</li>
        <li>{END}년 동안 배당률과 주가가 일정하다는 가정이라 실제와 다릅니다.</li>
      </ul>
      <p>
        내 나이와 적립금으로는 <a href="/goal">월배당 목표 계산기</a>에서 확인하고, 손실이 나는 경우는{' '}
        <a href="/guide/drip-compound-effect">주가가 떨어질 때의 재투자</a>를 함께 보세요.
      </p>
      <p className="muted">
        배당세율 15.4%, 물가 상승 제외. 투자 권유가 아닙니다. <a href="/disclaimer">면책조항</a> 참조.
      </p>
    </section>
  </>
);
