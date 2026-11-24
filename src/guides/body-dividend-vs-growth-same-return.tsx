import { CalcTable } from './CalcBlocks';
import { generalAccount } from '../isa';
import { formatKrw } from '../simulator';

const TOTAL = 8;
const YIELDS = [0, 2, 4, 6, 8];

const result = (years: number, yieldPct: number) =>
  generalAccount({
    initialKrw: 10_000_000, monthlyKrw: 500_000, years,
    annualYieldPct: yieldPct, annualGrowthPct: TOTAL - yieldPct,
  });

const won = (n: number) => `${formatKrw(n)}원`;

const spread = (years: number, key: 'value' | 'final') => {
  const values = YIELDS.map((y) => result(years, y)[key]);
  return ((Math.max(...values) / Math.min(...values) - 1) * 100).toFixed(1);
};

const table = (years: number) => (
  <CalcTable
    caption={`${years}년 뒤 (처음 1,000만원 + 월 50만원)`}
    head={['배당률 / 주가', '팔기 전 평가금', '팔 때 세금', '세금 낸 뒤']}
    rows={YIELDS.map((y) => {
      const r = result(years, y);
      return [`${y}% / ${TOTAL - y > 0 ? '+' : ''}${TOTAL - y}%`, won(r.value), won(r.exitTax), <b key="f">{won(r.final)}</b>];
    })}
  />
);

export default (
  <>
    <section>
      <h2>결론부터</h2>
      <p>
        일반계좌에서 <b>국내 상장 해외형 ETF</b>를 살 때, 배당률과 주가 상승을 합친 총수익이 연{' '}
        {TOTAL}%로 같다면 세금을 모두 낸 뒤의 차이는 10년에 {spread(10, 'final')}%, 20년에{' '}
        {spread(20, 'final')}%였습니다. 팔기 전 평가금만 보면 차이가 각각 {spread(10, 'value')}%,{' '}
        {spread(20, 'value')}%로 훨씬 커 보입니다.
      </p>
      <p>
        "배당을 받으면 세금 때문에 크게 손해"라는 말은 <b>팔 때의 세금을 빼고 본 경우</b>가 많습니다.
      </p>
      <p>
        게다가 주가로 번 쪽은 파는 해에 차익이 몰립니다. 아래 10년 표의 배당률 0%도 차익이{' '}
        {won(result(10, 0).exitTax / 0.154)}이라 <b>금융소득 2,000만원을 넘습니다</b>. 한 해에 모두
        팔면 종합과세로 세금이 더 늘 수 있어, 나눠 파는 계획이 필요합니다.
      </p>
    </section>

    <section>
      <h2>10년 동안 투자하면</h2>
      {table(10)}
    </section>

    <section>
      <h2>20년 동안 투자하면</h2>
      {table(20)}
    </section>

    <section>
      <h2>왜 차이가 작을까</h2>
      <p>
        국내 상장 해외형 ETF는 배당뿐 아니라 <b>매매차익에도 15.4%</b>가 과세됩니다. 주가로 벌면
        세금을 나중에 내고, 배당으로 벌면 매달 나눠 낸다는 차이만 남습니다. 세금을 미루는 이점이 있지만,
        마지막에 커진 차익에 한꺼번에 세금을 내면서 상당 부분 줄어듭니다.
      </p>
    </section>

    <section>
      <h2>결과가 달라지는 경우</h2>
      <ul>
        <li>
          <b>마지막 해에 차익이 몰리는 경우</b> — 배당소득이 2,000만원을 넘으면{' '}
          <a href="/guide/financial-income-tax-strategy">종합과세</a> 대상이 될 수 있습니다. 이 표에는
          반영하지 않았습니다.
        </li>
        <li>
          <b>미국 상장 ETF를 직접 사는 경우</b> — 매매차익은 양도소득세 22%(연 250만원 공제)로 따로
          과세되어 계산이 달라집니다.
        </li>
        <li>
          <b>ISA에서 사는 경우</b> — <a href="/isa">ISA 비교 계산기</a>로 확인하세요.
        </li>
      </ul>
      <p className="muted">
        매매차익은 "평가금 - 납입금 - 재투자한 세후 배당" 전체에 15.4%를 적용한 단순 계산입니다.
        실제로는 과표기준가에 따라 달라질 수 있습니다. 투자 권유가 아닙니다.{' '}
        <a href="/disclaimer">면책조항</a> 참조.
      </p>
    </section>

    <section>
      <h2>확인에 쓴 자료</h2>
      <ul>
        <li><a href="https://kbam.co.kr/insights/guide/domestic-vs-overseas-etf-tax-comparison" target="_blank" rel="noopener noreferrer">KB자산운용 — 국내 상장·해외 직구 ETF 세금 비교</a></li>
        <li><a href="https://view.asiae.co.kr/article/2026081915244676925" target="_blank" rel="noopener noreferrer">아시아경제 — 국내 상장 ETF도 투자자산별 다른 세금</a></li>
      </ul>
    </section>
  </>
);
