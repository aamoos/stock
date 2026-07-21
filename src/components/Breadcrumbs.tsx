import { Link } from 'react-router-dom';

const BASE_URL = 'https://stock-ten-iota.vercel.app';

export interface Crumb {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.to ? { item: `${BASE_URL}${item.to}` } : {}),
    })),
  };

  return (
    <nav className="breadcrumbs" aria-label="현재 위치">
      <ol className="breadcrumbs-list">
        {items.map((item, i) => (
          <li key={i} className="breadcrumbs-item">
            {item.to ? (
              <Link to={item.to}>{item.label}</Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
            {i < items.length - 1 && <span className="breadcrumbs-sep">›</span>}
          </li>
        ))}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </nav>
  );
}
