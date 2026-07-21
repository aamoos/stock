import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const ssrEntry = pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href;

const { render, PRERENDER_ROUTES, SITEMAP } = await import(ssrEntry);

const BASE_URL = 'https://stock-ten-iota.vercel.app';

const templatePath = path.join(distDir, 'index.html');
const template = fs.readFileSync(templatePath, 'utf-8');

if (!template.includes('<div id="root"></div>')) {
  throw new Error('index.html에서 <div id="root"></div> 를 찾을 수 없습니다. 프리렌더 주입 지점이 바뀌었는지 확인하세요.');
}

let count = 0;
for (const route of PRERENDER_ROUTES) {
  const { appHtml, head } = render(route);

  let html = template;
  if (head) {
    // 템플릿의 기본(fallback) <title>을 제거해 helmet이 주입하는 title과 중복되지 않게 한다.
    html = html.replace(/\s*<title>[\s\S]*?<\/title>/i, '');
    html = html.replace('</head>', `${head}\n  </head>`);
  }
  html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

  const outPath =
    route === '/'
      ? path.join(distDir, 'index.html')
      : path.join(distDir, route.replace(/^\//, ''), 'index.html');

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html, 'utf-8');
  count += 1;
  console.log(`  prerendered  ${route.padEnd(45)} -> ${path.relative(root, outPath)}`);
}

console.log(`\n✓ ${count}개 라우트를 정적 HTML로 프리렌더링했습니다.`);

// sitemap.xml 을 가이드 메타데이터 기준으로 다시 생성 (lastmod 포함)
const sitemapBody = SITEMAP.map((e) => {
  const lastmod = e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : '';
  return `  <url>\n    <loc>${BASE_URL}${e.loc}</loc>${lastmod}\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`;
}).join('\n');
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapBody}\n</urlset>\n`;
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf-8');
console.log(`✓ sitemap.xml (${SITEMAP.length}개 URL, lastmod 포함) 생성 완료.`);
