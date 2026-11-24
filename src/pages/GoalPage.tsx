import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';
import { SEO } from '../components/SEO';
import {
  FINANCIAL_INCOME_LIMIT_KRW,
  MAX_GOAL_MONTHS,
  formatMonths,
  grossYearlyDividend,
  monthsToGoal,
  requiredCapital,
} from '../goal';
import { renderGoalImage } from '../goalImage';
import { formatKrw, formatKrwFull } from '../simulator';
import { useLocalStorage } from '../useLocalStorage';

interface GoalForm {
  targetMan: number;
  yieldPct: number;
  taxPct: number;
  currentMan: number;
  monthlyMan: number;
  growthPct: number;
  reinvest: boolean;
}

const DEFAULT_FORM: GoalForm = {
  targetMan: 100,
  yieldPct: 10,
  taxPct: 15.4,
  currentMan: 1000,
  monthlyMan: 100,
  growthPct: 0,
  reinvest: true,
};

const TAX_OPTIONS = [
  { value: 15.4, label: '일반계좌 · 국내 상장 (15.4%)' },
  { value: 15, label: '일반계좌 · 미국 직접 (15%)' },
  { value: 0, label: 'ISA 만기 전 (국내세 0%)' },
];

const YIELD_ROWS = [4, 6, 8, 10, 12];

const MAN = 10_000;

export function GoalPage() {
  const [form, setForm] = useLocalStorage<GoalForm>('goalForm', DEFAULT_FORM);
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  const update = (patch: Partial<GoalForm>) => setForm((prev) => ({ ...prev, ...patch }));
  const numberOf = (value: string, min = 0, max = Number.MAX_SAFE_INTEGER) =>
    Math.min(max, Math.max(min, Number(value) || 0));

  const target = form.targetMan * MAN;
  const required = requiredCapital(target, form.yieldPct, form.taxPct);
  const gross = grossYearlyDividend(target, form.taxPct);
  const months = useMemo(
    () =>
      monthsToGoal({
        targetMonthlyKrw: form.targetMan * MAN,
        annualYieldPct: form.yieldPct,
        taxRatePct: form.taxPct,
        currentKrw: form.currentMan * MAN,
        monthlyContributionKrw: form.monthlyMan * MAN,
        annualGrowthPct: form.growthPct,
        reinvest: form.reinvest,
      }),
    [form],
  );

  const overLimit = gross !== null && gross > FINANCIAL_INCOME_LIMIT_KRW && form.taxPct > 0;

  const makeFile = async () => {
    if (required === null) return null;
    const blob = await renderGoalImage({
      target: `${form.targetMan.toLocaleString('ko-KR')}만원`,
      required: `${formatKrw(required)}원`,
      assumption: `연 배당률 ${form.yieldPct}% · 배당세율 ${form.taxPct}% 가정`,
      host: window.location.host,
    });
    return new File([blob], 'monthly-dividend-goal.png', { type: 'image/png' });
  };

  const download = (file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const saveImage = async () => {
    setShareMessage(null);
    try {
      const file = await makeFile();
      if (!file) return;
      download(file);
      setShareMessage('이미지를 저장했습니다.');
    } catch (err) {
      setShareMessage(err instanceof Error ? err.message : '이미지를 만들지 못했습니다.');
    }
  };

  const shareImage = async () => {
    setShareMessage(null);
    try {
      const file = await makeFile();
      if (!file) return;
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: '월배당 목표 계산기' });
      } else {
        download(file);
        setShareMessage('이 브라우저는 공유를 지원하지 않아 이미지로 저장했습니다.');
      }
    } catch (err) {
      // 사용자가 공유 창을 닫은 경우는 오류가 아니다.
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setShareMessage('공유하지 못했습니다. 이미지 저장을 이용해 주세요.');
    }
  };

  return (
    <PageLayout
      title="월배당 목표 계산기"
      subtitle="매달 받고 싶은 배당금을 넣으면 필요한 투자금과 걸리는 기간을 거꾸로 계산합니다."
    >
      <SEO
        title="월배당 목표 계산기 - 월 100만원 배당 받으려면 얼마 필요할까"
        description="매달 받고 싶은 세후 배당금에서 거꾸로 필요한 투자금과 도달 기간을 계산합니다. 배당률별 필요 금액과 금융소득 2,000만원 초과 여부도 확인할 수 있습니다."
        canonical="/goal"
      />

      <section className="goal-form" aria-label="목표 입력">
        <label>
          <span>목표 월배당 (세후, 만원)</span>
          <input
            type="number" min={0} inputMode="decimal" value={form.targetMan}
            onChange={(e) => update({ targetMan: numberOf(e.target.value) })}
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
          <span>계좌 · 배당세율</span>
          <select
            value={form.taxPct}
            onChange={(e) => update({ taxPct: Number(e.target.value) })}
          >
            {TAX_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>
        <label>
          <span>현재 투자금 (만원)</span>
          <input
            type="number" min={0} inputMode="decimal" value={form.currentMan}
            onChange={(e) => update({ currentMan: numberOf(e.target.value) })}
          />
        </label>
        <label>
          <span>월 적립금 (만원)</span>
          <input
            type="number" min={0} inputMode="decimal" value={form.monthlyMan}
            onChange={(e) => update({ monthlyMan: numberOf(e.target.value) })}
          />
        </label>
        <label>
          <span>연 주가 변동률 (%)</span>
          <input
            type="number" min={-50} max={50} step="any" value={form.growthPct}
            onChange={(e) => update({ growthPct: numberOf(e.target.value, -50, 50) })}
          />
        </label>
        <label className="toggle">
          <input
            type="checkbox" checked={form.reinvest}
            onChange={(e) => update({ reinvest: e.target.checked })}
          />
          <span>목표 도달 전까지 배당 재투자 (DRIP)</span>
        </label>
      </section>

      <section className="goal-result" aria-live="polite">
        {required === null ? (
          <p>목표 월배당과 연 배당률을 0보다 크게 입력해 주세요.</p>
        ) : (
          <>
            <p className="goal-result-label">
              매달 {form.targetMan.toLocaleString('ko-KR')}만원(세후)을 받으려면
            </p>
            <p className="goal-result-value">{formatKrw(required)}원</p>
            <p className="goal-result-sub">
              정확히는 {formatKrwFull(required)} · 연 배당률 {form.yieldPct}%가 유지된다는 가정
            </p>
            <p className="goal-result-time">
              {months === null
                ? `지금 조건으로는 ${MAX_GOAL_MONTHS / 12}년 안에 도달하지 못합니다.`
                : `지금 조건이면 약 ${formatMonths(months)} 뒤에 도달합니다.`}
            </p>
            {overLimit && (
              <p className="goal-result-warn">
                이 목표의 세전 배당은 연 {formatKrw(gross)}원으로 <b>금융소득 2,000만원을 넘습니다</b>.
                종합과세 대상이 될 수 있어 실제 세금은 더 클 수 있습니다.{' '}
                <Link to="/guide/financial-income-tax-strategy">대응법 보기</Link>
              </p>
            )}
            {form.taxPct === 0 && (
              <p className="goal-result-warn">
                ISA는 만기 때 비과세 한도를 넘는 이익에 9.9%가 과세되고, 해외에서 낸 세금은 먼저
                빠질 수 있습니다. 연 납입 한도도 있어 실제 필요 금액은 달라집니다.
              </p>
            )}
            <div className="goal-actions">
              <button type="button" className="btn btn-primary" onClick={shareImage}>결과 공유</button>
              <button type="button" className="btn goal-btn-secondary" onClick={saveImage}>이미지 저장</button>
            </div>
            <p className="goal-result-note">공유 이미지에는 현재 투자금과 월 적립금이 들어가지 않습니다.</p>
            {shareMessage && <p className="goal-result-note" role="status">{shareMessage}</p>}
          </>
        )}
      </section>

      <section>
        <h2>배당률별 필요한 투자금</h2>
        <p>
          매달 {form.targetMan.toLocaleString('ko-KR')}만원(세후), 배당세율 {form.taxPct}% 기준입니다.
        </p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>연 배당률</th><th>필요한 투자금</th></tr>
            </thead>
            <tbody>
              {YIELD_ROWS.map((y) => {
                const amount = requiredCapital(target, y, form.taxPct);
                return (
                  <tr key={y}>
                    <td>{y}%</td>
                    <td className="strong">{amount === null ? '-' : `${formatKrw(amount)}원`}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p>
          배당률이 높을수록 필요한 돈은 줄지만, 그만큼 주가 하락이나 배당 감소 위험이 클 수 있습니다.
          연 주가 변동률을 <b>0% 이하</b>로도 넣어 보세요.
        </p>
      </section>

      <section>
        <h2>계산 방법</h2>
        <pre>
{`필요한 투자금 = 목표 월배당 × 12 ÷ (연 배당률 × (1 - 배당세율))`}
        </pre>
        <p>
          예를 들어 월 100만원, 연 배당률 10%, 세율 15.4%라면
          1,200만원 ÷ 0.0846 = <b>약 1억 4,184만원</b>입니다.
          도달 기간은 <Link to="/">월배당 자산 시뮬레이터</Link>와 같은 계산식을 쓰며,
          매달 적립하고 배당을 재투자해 월 세후 배당이 목표에 처음 닿는 시점을 찾습니다.
        </p>
        <p className="muted">
          물가 상승, 환율, 수수료는 반영하지 않습니다. 배당률은 바뀔 수 있으며 투자 권유가 아닙니다.
          자세한 내용은 <Link to="/disclaimer">면책조항</Link>을 참고하세요.
        </p>
      </section>
    </PageLayout>
  );
}
