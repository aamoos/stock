import { Link } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';
import { SEO } from '../components/SEO';
import {
  ISA_TOTAL_LIMIT_KRW,
  ISA_YEARLY_LIMIT_KRW,
  generalAccount,
  isaAccount,
} from '../isa';
import { formatKrw, formatKrwFull } from '../simulator';
import { useLocalStorage } from '../useLocalStorage';

interface IsaForm {
  monthlyMan: number;
  years: number;
  yieldPct: number;
  growthPct: number;
  taxFreeMan: number;
}

const DEFAULT_FORM: IsaForm = {
  monthlyMan: 50, years: 5, yieldPct: 10, growthPct: 0, taxFreeMan: 200,
};

const MAN = 10_000;
const MAX_MONTHLY_MAN = Math.floor(ISA_YEARLY_LIMIT_KRW / 12 / MAN);

export function IsaPage() {
  const [form, setForm] = useLocalStorage<IsaForm>('isaForm', DEFAULT_FORM);
  const update = (patch: Partial<IsaForm>) => setForm((prev) => ({ ...prev, ...patch }));
  const numberOf = (value: string, min: number, max: number) =>
    Math.min(max, Math.max(min, Number(value) || 0));

  // 입력 중에는 3 미만도 허용하고(예: 10을 치려고 1을 누른 순간) 계산할 때만 범위를 맞춘다.
  const years = Math.min(20, Math.max(3, Math.round(form.years)));
  const input = {
    initialKrw: 0,
    monthlyKrw: form.monthlyMan * MAN,
    years,
    annualYieldPct: form.yieldPct,
    annualGrowthPct: form.growthPct,
    totalLimitKrw: ISA_TOTAL_LIMIT_KRW,
  };
  const general = generalAccount(input);
  const isa = isaAccount(input, form.taxFreeMan * MAN);
  const diff = isa.final - general.final;
  const hitLimit = form.monthlyMan * MAN * years * 12 > ISA_TOTAL_LIMIT_KRW;

  return (
    <PageLayout
      title="ISA vs 일반계좌 비교 계산기"
      subtitle="같은 돈을 국내 상장 해외형 월배당 ETF에 넣었을 때, 세금을 모두 낸 뒤의 차이를 비교합니다."
    >
      <SEO
        title="ISA vs 일반계좌 비교 계산기 - 월배당 ETF 세금 차이"
        description="월배당 ETF를 ISA와 일반계좌에서 샀을 때 배당세, 매매차익 과세, ISA 비과세 한도와 9.9% 분리과세까지 반영해 남는 돈을 비교합니다."
        canonical="/isa"
      />

      <section className="goal-form" aria-label="조건 입력">
        <label>
          <span>월 납입금 (만원, 최대 {MAX_MONTHLY_MAN})</span>
          <input
            type="number" min={0} max={MAX_MONTHLY_MAN} inputMode="decimal" value={form.monthlyMan}
            onChange={(e) => update({ monthlyMan: numberOf(e.target.value, 0, MAX_MONTHLY_MAN) })}
          />
        </label>
        <label>
          <span>기간 (년, 3~20)</span>
          <input
            type="number" min={3} max={20} inputMode="numeric" value={form.years}
            onChange={(e) => update({ years: numberOf(e.target.value, 0, 20) })}
          />
        </label>
        <label>
          <span>연 배당률 (%)</span>
          <input
            type="number" min={0} max={100} step="any" inputMode="decimal" value={form.yieldPct}
            onChange={(e) => update({ yieldPct: numberOf(e.target.value, 0, 100) })}
          />
        </label>
        <label>
          <span>연 주가 변동률 (%)</span>
          <input
            type="number" min={-50} max={50} step="any" value={form.growthPct}
            onChange={(e) => update({ growthPct: numberOf(e.target.value, -50, 50) })}
          />
        </label>
        <label>
          <span>ISA 유형</span>
          <select
            value={form.taxFreeMan}
            onChange={(e) => update({ taxFreeMan: Number(e.target.value) })}
          >
            <option value={200}>일반형 (비과세 200만원)</option>
            <option value={400}>서민·농어민형 (비과세 400만원)</option>
          </select>
        </label>
      </section>

      <section className="goal-result" aria-live="polite">
        {form.monthlyMan <= 0 ? (
          <p>월 납입금을 0보다 크게 입력해 주세요.</p>
        ) : (
          <>
            <p className="goal-result-label">{years}년 뒤 ISA가 일반계좌보다</p>
            <p className="goal-result-value">
              {formatKrw(Math.abs(diff))}원 {diff >= 0 ? '더 많습니다' : '더 적습니다'}
            </p>
            <p className="goal-result-sub">
              낸 돈 {formatKrwFull(isa.contributed)} · 세금을 모두 낸 뒤 기준
            </p>
            {hitLimit && (
              <p className="goal-result-warn">
                ISA 총 납입 한도 1억원을 채우면 두 계좌 모두 납입을 멈춘 것으로 계산했습니다.
              </p>
            )}
          </>
        )}
      </section>

      <section>
        <h2>항목별 비교</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>항목</th><th>일반계좌</th><th>ISA</th></tr>
            </thead>
            <tbody>
              <tr><td>낸 돈</td><td>{formatKrw(general.contributed)}원</td><td>{formatKrw(isa.contributed)}원</td></tr>
              <tr><td>세금 내기 전 평가금</td><td>{formatKrw(general.value)}원</td><td>{formatKrw(isa.value)}원</td></tr>
              <tr><td>팔 때·만기 세금</td><td>{formatKrw(general.exitTax)}원</td><td>{formatKrw(isa.exitTax)}원</td></tr>
              <tr><td>남는 돈</td><td className="strong">{formatKrw(general.final)}원</td><td className="strong">{formatKrw(isa.final)}원</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>계산 방법</h2>
        <ul>
          <li><b>일반계좌</b>: 배당에서 15.4%를 떼고 재투자하며, 마지막에 매매차익에 15.4%를 냅니다. 주가가 내려 손실이 나도 이미 낸 배당세는 돌려받지 못합니다.</li>
          <li><b>ISA</b>: 배당을 떼지 않고 재투자하고, 만기에 배당과 주가 손익을 합친 순이익에서 비과세 한도를 뺀 금액에 9.9%를 냅니다.</li>
          <li>두 계좌 모두 같은 금액을 같은 순서로 납입하고 배당을 전부 재투자합니다.</li>
        </ul>
        <p>
          그래서 <b>주가가 떨어질 때도 ISA가 유리할 수 있습니다</b>. 손실을 배당과 합쳐 계산하기
          때문입니다. 연 주가 변동률에 음수를 넣어 보세요.
        </p>
      </section>

      <section>
        <h2>실제와 다를 수 있는 부분</h2>
        <ul>
          <li>2025년부터 해외 주식 배당에 붙는 현지 세금은 ISA에서도 먼저 빠질 수 있습니다. 이 계산에는 넣지 않아 <b>ISA의 이점이 실제보다 크게 나올 수 있습니다</b>.</li>
          <li>일반계좌의 매매차익은 과표기준가에 따라 달라질 수 있습니다.</li>
          <li>금융소득 2,000만원 초과에 따른 종합과세는 반영하지 않았습니다.</li>
          <li>국내 주식형 ETF는 매매차익 과세가 달라 이 계산기에 맞지 않습니다.</li>
        </ul>
      </section>

      <section>
        <h2>2026년 11월 기준 ISA 제도</h2>
        <p>
          연 납입 한도 2,000만원, 총 1억원, 의무 기간 3년, 비과세 200만원(서민·농어민형 400만원), 초과분
          9.9% 분리과세를 적용했습니다. 2026년 세제개편안의 '생산적금융 ISA'는 11월 15일 기준 국회
          의결 전으로 보도되어 반영하지 않았습니다.
        </p>
        <ul>
          <li><a href="https://magazine.hankyung.com/money/article/202601102666c" target="_blank" rel="noopener noreferrer">한경MONEY — ETF 계좌별 세금</a></li>
          <li><a href="https://www.donbase.com/posts/isa-tax-reform-2026" target="_blank" rel="noopener noreferrer">돈베이스 — 2026 세제개편안 ISA 진행 상황</a></li>
        </ul>
        <p className="muted">
          세법은 바뀔 수 있으니 가입 전 금융회사와 국세청 안내를 확인하세요. 투자·세무 자문이 아닙니다.{' '}
          <Link to="/guide/isa-account-dividend-tax">ISA 가이드</Link> ·{' '}
          <Link to="/disclaimer">면책조항</Link>
        </p>
      </section>
    </PageLayout>
  );
}
