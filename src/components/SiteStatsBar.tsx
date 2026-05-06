import { useSiteStats } from '../hooks/useSiteStats';

function fmt(n: number): string {
  if (n >= 10000) return (n / 10000).toFixed(1) + '만';
  return n.toLocaleString('ko-KR');
}

export function SiteStatsBar() {
  const { stats, status } = useSiteStats();

  if (status === 'error' || status === 'idle') return null;

  return (
    <div className="site-stats-bar" aria-label="사이트 방문자 통계">
      {status === 'loading' ? (
        <span className="site-stats-loading">통계 로딩 중...</span>
      ) : stats ? (
        <>
          <span className="site-stats-item">
            <span className="site-stats-dot site-stats-dot--active" />
            <span className="site-stats-label">실시간</span>
            <span className="site-stats-value">{fmt(stats.activeUsers)}명</span>
          </span>
          <span className="site-stats-divider" />
          <span className="site-stats-item">
            <span className="site-stats-label">오늘</span>
            <span className="site-stats-value">{fmt(stats.todayUsers)}명</span>
          </span>
          <span className="site-stats-divider" />
          <span className="site-stats-item">
            <span className="site-stats-label">누적</span>
            <span className="site-stats-value">{fmt(stats.totalUsers)}명</span>
          </span>
        </>
      ) : null}
    </div>
  );
}
