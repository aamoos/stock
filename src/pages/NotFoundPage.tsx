import { Link } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';
import { SEO } from '../components/SEO';

export function NotFoundPage() {
  return (
    <PageLayout title="페이지를 찾을 수 없습니다">
      <SEO title="페이지를 찾을 수 없습니다" noindex />
      <p>주소가 바뀌었거나 없는 페이지입니다.</p>
      <ul>
        <li><Link to="/">월배당 자산 시뮬레이터</Link></li>
        <li><Link to="/goal">월배당 목표 계산기</Link></li>
        <li><Link to="/guide">투자 가이드</Link></li>
      </ul>
    </PageLayout>
  );
}
