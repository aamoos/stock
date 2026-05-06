/* eslint-disable @typescript-eslint/no-explicit-any */
const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID;
const GA4_SERVICE_ACCOUNT_KEY = process.env.GA4_SERVICE_ACCOUNT_KEY;

interface StatsResponse {
  totalUsers: number;
  todayUsers: number;
  activeUsers: number;
}

async function getAccessToken(serviceAccountKey: string): Promise<string> {
  const key = JSON.parse(serviceAccountKey);

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: key.client_email,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const encode = (obj: object) =>
    Buffer.from(JSON.stringify(obj)).toString('base64url');

  const signingInput = `${encode(header)}.${encode(payload)}`;

  const { createSign } = await import('crypto');
  const sign = createSign('RSA-SHA256');
  sign.update(signingInput);
  const signature = sign.sign(key.private_key, 'base64url');

  const jwt = `${signingInput}.${signature}`;

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const tokenData = await tokenRes.json() as { access_token: string };
  return tokenData.access_token;
}

async function runReport(
  accessToken: string,
  propertyId: string,
  dateRange: { startDate: string; endDate: string },
  metrics: string[],
): Promise<number[]> {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dateRanges: [dateRange],
        metrics: metrics.map((name) => ({ name })),
      }),
    },
  );
  const data = await res.json() as { rows?: { metricValues: { value: string }[] }[] };
  const row = data.rows?.[0];
  if (!row) return metrics.map(() => 0);
  return row.metricValues.map((v) => parseInt(v.value, 10) || 0);
}

export default async function handler(_req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  if (!GA4_PROPERTY_ID || !GA4_SERVICE_ACCOUNT_KEY) {
    return res.status(200).json({ totalUsers: 0, todayUsers: 0, activeUsers: 0 });
  }

  try {
    const accessToken = await getAccessToken(GA4_SERVICE_ACCOUNT_KEY);

    const today = new Date().toISOString().split('T')[0];

    const [totalUsers] = await runReport(
      accessToken,
      GA4_PROPERTY_ID,
      { startDate: '2020-01-01', endDate: today },
      ['totalUsers'],
    );

    const [todayUsers] = await runReport(
      accessToken,
      GA4_PROPERTY_ID,
      { startDate: today, endDate: today },
      ['totalUsers'],
    );

    const realtimeRes = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runRealtimeReport`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metrics: [{ name: 'activeUsers' }],
        }),
      },
    );
    const realtimeData = await realtimeRes.json() as { rows?: { metricValues: { value: string }[] }[] };
    const activeUsers = parseInt(realtimeData.rows?.[0]?.metricValues?.[0]?.value ?? '0', 10);

    const result: StatsResponse = { totalUsers, todayUsers, activeUsers };
    return res.status(200).json(result);
  } catch (err) {
    console.error('GA4 stats error:', err);
    return res.status(200).json({ totalUsers: 0, todayUsers: 0, activeUsers: 0 });
  }
}
