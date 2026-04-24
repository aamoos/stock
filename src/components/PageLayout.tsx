import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { SiteFooter } from './SiteFooter';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function PageLayout({ title, subtitle, children }: PageLayoutProps) {
  return (
    <div className="doc-layout">
      <header className="doc-header">
        <Link to="/" className="doc-home">
          ← 시뮬레이터로 돌아가기
        </Link>
        <h1 className="doc-title">{title}</h1>
        {subtitle && <p className="doc-subtitle">{subtitle}</p>}
      </header>
      <article className="doc-content">{children}</article>
      <SiteFooter />
    </div>
  );
}
