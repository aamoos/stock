export interface FxRateResult {
  rate: number;
  source: string;
  fetchedAt: number;
}

interface FxProvider {
  name: string;
  url: string;
  parse: (data: unknown) => number | null;
}

const PROVIDERS: FxProvider[] = [
  {
    name: 'frankfurter.app',
    url: 'https://api.frankfurter.app/latest?from=USD&to=KRW',
    parse: (data) => {
      const rates = (data as { rates?: { KRW?: number } } | null)?.rates;
      const krw = rates?.KRW;
      return typeof krw === 'number' && Number.isFinite(krw) ? krw : null;
    },
  },
  {
    name: 'open.er-api.com',
    url: 'https://open.er-api.com/v6/latest/USD',
    parse: (data) => {
      const rates = (data as { rates?: { KRW?: number } } | null)?.rates;
      const krw = rates?.KRW;
      return typeof krw === 'number' && Number.isFinite(krw) ? krw : null;
    },
  },
  {
    name: 'jsdelivr.net',
    url: 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
    parse: (data) => {
      const usd = (data as { usd?: { krw?: number } } | null)?.usd;
      const krw = usd?.krw;
      return typeof krw === 'number' && Number.isFinite(krw) ? krw : null;
    },
  },
];

export async function fetchUsdKrwRate(
  signal?: AbortSignal,
): Promise<FxRateResult> {
  let lastError: unknown = null;
  for (const provider of PROVIDERS) {
    try {
      const res = await fetch(provider.url, { signal, cache: 'no-store' });
      if (!res.ok) {
        lastError = new Error(`${provider.name} HTTP ${res.status}`);
        continue;
      }
      const data = await res.json();
      const rate = provider.parse(data);
      if (rate && rate > 0) {
        return {
          rate: Math.round(rate * 100) / 100,
          source: provider.name,
          fetchedAt: Date.now(),
        };
      }
      lastError = new Error(`${provider.name}: invalid response`);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new Error('환율 조회에 실패했습니다.');
}
