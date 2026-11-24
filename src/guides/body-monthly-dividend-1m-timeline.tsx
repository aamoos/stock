import { CalcTable } from './CalcBlocks';
import { formatMonths, monthsToGoal, requiredCapital } from '../goal';
import { formatKrw } from '../simulator';

const TARGET = 1_000_000;
const TAX = 15.4;
const YIELDS = [4, 6, 8, 10, 12];
const SAVINGS = [300_000, 500_000, 1_000_000];
const TOTAL_RETURN = 8;

const time = (yieldPct: number, monthly: number, growthPct: number) => {
  const m = monthsToGoal({
    targetMonthlyKrw: TARGET, annualYieldPct: yieldPct, taxRatePct: TAX,
    currentKrw: 0, monthlyContributionKrw: monthly, annualGrowthPct: growthPct, reinvest: true,
  });
  return m === null ? '50년 초과' : formatMonths(m);
};

const head = ['연 배당률', '월 30만원', '월 50만원', '월 100만원'];

export default (
  <>
    <section>
      <h2>결론부터</h2>
      <p>
        0원에서 시작해 주가가 그대로라면, 연 배당률 8% 상품에 월 50만원씩 모아 세후 월 100만원을
        받기까지 <b>{time(8, 500_000, 0)}</b>이 걸립니다. 월 100만원씩 모으면{' '}
        <b>{time(8, 1_000_000, 0)}</b>입니다. 적립금을 두 배로 늘려도 기간은 절반보다 덜 줄어듭니다.
        재투자로 불어나는 시간이 짧아지기 때문입니다.
      </p>
    </section>

    <section>
      <h2>주가가 변하지 않을 때</h2>
      <CalcTable
        caption="세후 월 100만원에 도달하는 기간 (주가 0%, 배당 재투자)"
        head={head}
        rows={YIELDS.map((y) => [`${y}%`, ...SAVINGS.map((s) => time(y, s, 0))])}
      />
      <p>
        다만 이 표는 배당률이 높은 상품에 너무 유리합니다. 배당률 12%와 4% 상품의 주가가 똑같이
        제자리라는 가정이기 때문입니다.
      </p>
    </section>

    <section>
      <h2>총수익이 같을 때</h2>
      <p>
        그래서 <b>배당률과 주가 변동을 합친 총수익을 연 {TOTAL_RETURN}%로 똑같이</b> 맞췄습니다.
        배당률 4%면 주가가 매년 4% 오르고, 12%면 매년 4% 내립니다.
      </p>
      <CalcTable
        caption={`세후 월 100만원에 도달하는 기간 (배당률 + 주가 변동 = ${TOTAL_RETURN}%)`}
        head={head}
        rows={YIELDS.map((y) => [
          `${y}% (주가 ${TOTAL_RETURN - y > 0 ? '+' : ''}${TOTAL_RETURN - y}%)`,
          ...SAVINGS.map((s) => time(y, s, TOTAL_RETURN - y)),
        ])}
      />
      <p>
        월 50만원 기준으로 배당률 4%와 12%의 차이는 첫 표에서 {time(4, 500_000, 0)}과{' '}
        {time(12, 500_000, 0)}이었지만, 여기서는 {time(4, 500_000, 4)}과{' '}
        {time(12, 500_000, -4)}으로 좁혀집니다. 여전히 고배당이 빠르지만, 도달한 뒤에도 주가와 배당이
        매년 4%씩 줄어 <b>월 100만원이 유지되지 않습니다</b>.
      </p>
    </section>

    <section>
      <h2>도달했을 때 필요한 평가금</h2>
      <CalcTable
        caption="세후 월 100만원을 받는 데 필요한 평가금"
        head={['연 배당률', '필요한 평가금']}
        rows={YIELDS.map((y) => [`${y}%`, `${formatKrw(requiredCapital(TARGET, y, TAX) ?? 0)}원`])}
      />
      <p>
        내 목표 금액으로 계산하려면 <a href="/goal">월배당 목표 계산기</a>를 쓰세요. 주가가 내릴 때
        월배당이 줄어드는 정도는{' '}
        <a href="/guide/falling-price-monthly-income">이 글</a>에서 볼 수 있습니다.
      </p>
      <p className="muted">
        배당세율 {TAX}%, 물가 상승과 수수료 제외. 배당률이 유지된다는 가정이며 투자 권유가 아닙니다.{' '}
        <a href="/disclaimer">면책조항</a> 참조.
      </p>
    </section>
  </>
);
