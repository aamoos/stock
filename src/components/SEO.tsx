import { Helmet } from 'react-helmet-async';

const SITE_NAME = '월배당 자산 시뮬레이터';
const BASE_URL = 'https://stock-ten-iota.vercel.app';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og.png`;

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogType?: 'website' | 'article';
  publishedAt?: string;
  modifiedAt?: string;
  schemaJson?: object;
}

export function SEO({
  title,
  description,
  canonical,
  ogType = 'website',
  publishedAt,
  modifiedAt,
  schemaJson,
}: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | 월배당 ETF 배당 재투자 계산기`;
  const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : BASE_URL;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={DEFAULT_OG_IMAGE} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="ko_KR" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />

      {ogType === 'article' && publishedAt && (
        <meta property="article:published_time" content={publishedAt} />
      )}
      {ogType === 'article' && modifiedAt && (
        <meta property="article:modified_time" content={modifiedAt} />
      )}

      {schemaJson && (
        <script type="application/ld+json">
          {JSON.stringify(schemaJson)}
        </script>
      )}
    </Helmet>
  );
}
