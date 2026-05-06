import { useEffect, useState } from 'react';

export interface SiteStats {
  totalUsers: number;
  todayUsers: number;
  activeUsers: number;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

export function useSiteStats() {
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    setStatus('loading');
    fetch('/api/stats')
      .then((r) => r.json())
      .then((data: SiteStats) => {
        if (data.totalUsers === 0 && data.todayUsers === 0 && data.activeUsers === 0) {
          setStatus('error');
        } else {
          setStats(data);
          setStatus('success');
        }
      })
      .catch(() => setStatus('error'));
  }, []);

  return { stats, status };
}
