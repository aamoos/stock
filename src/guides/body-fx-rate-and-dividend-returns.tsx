import { BarList, CalcTable } from './CalcBlocks';
import { fxPath } from './calc';
import { formatKrw } from '../simulator';

const START = 1400;
const base = { monthlyKrw: 500_000, years: 10, startFx: START, yieldPct: 10, taxPct: 15 };
const rows = [1100, 1200, 1300, 1400, 1500, 1600, 1700].map((endFx) => ({ endFx, ...fxPath({ ...base, endFx }) }));
const flat = rows.find((r) => r.endFx === START)!;
const low = rows.find((r) => r.endFx === 1200)!;
const high = fxPath({ ...base, startFx: 1600, endFx: 1600 });
const won = (n: number) => `${formatKrw(n)}원`;
const change = (v: number) => (v / flat.valueKrw - 1) * 100;
const diff = (v: number) => `${change(v) > 0 ? '+' : ''}${change(v).toFixed(1)}%`;

export default (
  <>
    <section>
      <h2>결론부터</h2>
      <p>
        매달 같은 원화를 넣는다면 <b>환율이 높으냐 낮으냐보다, 사는 동안 어떻게 움직였느냐</b>가
        중요합니다. 환율이 10년 내내 1,400원이든 1,600원이든 원화 결과는 {won(flat.valueKrw)}과{' '}
        {won(high.valueKrw)}으로 같습니다. 비싸게 산 만큼 비싸게 평가되기 때문입니다.
      </p>
      <p>
        반면 1,400원에서 1,200원으로 서서히 내리면 결과는 {won(low.valueKrw)}으로{' '}
        {Math.abs(change(low.valueKrw)).toFixed(1)}% 줄어듭니다. 환율이{' '}
        {((1 - 1200 / START) * 100).toFixed(1)}% 내린 것보다는 덜 줄어듭니다. 환율이 내리는 동안
        더 싸게 샀기 때문입니다.
      </p>
    </section>

    <section>
      <h2>10년 뒤 환율별 결과</h2>
      <p>
        월 50만원을 10년 동안 달러 월배당 ETF에 넣고, 환율은 {START.toLocaleString('ko-KR')}원에서
        마지막 값까지 일정하게 움직인다고 가정했습니다. 연 배당률 10%, 달러 주가 0%, 세율 15%입니다.
      </p>
      <CalcTable
        caption="원화로 환산한 결과"
        head={['10년 뒤 환율', '평가금', '환율 그대로와 차이', '마지막 달 세후 배당']}
        rows={rows.map((r) => [
          `${r.endFx.toLocaleString('ko-KR')}원`, won(r.valueKrw), diff(r.valueKrw), won(r.monthlyDividendKrw),
        ])}
      />
      <BarList
        caption="10년 뒤 원화 평가금"
        rows={rows.map((r) => ({ label: `${r.endFx.toLocaleString('ko-KR')}원`, value: r.valueKrw, display: won(r.valueKrw) }))}
      />
    </section>

    <section>
      <h2>국내 상장 ETF도 환율 영향을 받을까</h2>
      <p>
        원화로 거래해도 기초자산이 미국 주식이면 환율이 가격에 반영됩니다. 이름에 <b>(H)</b>가 붙은
        상품은 환율 변동을 줄이는 환헤지형이고, 없으면 대체로 환율에 노출됩니다. 정확한 방식은 운용사
        상품 설명에서 확인하세요.
      </p>
    </section>

    <section>
      <h2>시뮬레이터로 볼 때</h2>
      <p>
        <a href="/">시뮬레이터</a>는 전 기간 같은 환율을 쓰고 USD 종목의 적립금을 <b>달러로</b>{' '}
        입력받습니다. 그래서 환율만 올리면 낸 돈과 결과가 함께 커집니다. 환율 변화에 따른 유불리는
        위 표를 참고하세요.
      </p>
      <p className="muted">
        환율이 일정하게 움직인다는 가정이며 환전 수수료는 제외했습니다. 투자 권유가 아닙니다.{' '}
        <a href="/disclaimer">면책조항</a> 참조.
      </p>
    </section>
  </>
);
