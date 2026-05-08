/* eslint-disable @typescript-eslint/no-explicit-any */

const NAMESPACE = 'stock-ten-iota-vercel-app';
const TODAY_KEY = `today-${new Date().toISOString().split('T')[0]}`;
const TOTAL_KEY = 'total';

export default async function handler(_req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  try {
    const [todayRes, totalRes] = await Promise.all([
      fetch(`https://api.countapi.xyz/hit/${NAMESPACE}/${TODAY_KEY}`),
      fetch(`https://api.countapi.xyz/hit/${NAMESPACE}/${TODAY_KEY}-total`),
    ]);

    const [todayData, totalData] = await Promise.all([
      todayRes.json() as Promise<{ value: number }>,
      totalRes.json() as Promise<{ value: number }>,
    ]);

    return res.status(200).json({
      todayUsers: todayData.value ?? 0,
      totalUsers: totalData.value ?? 0,
    });
  } catch {
    return res.status(200).json({ todayUsers: 0, totalUsers: 0 });
  }
}
