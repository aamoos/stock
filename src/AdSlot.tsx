import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const CLIENT = import.meta.env.VITE_ADSENSE_CLIENT as string | undefined;

let scriptLoadingPromise: Promise<void> | null = null;

function loadAdsenseScript(client: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (scriptLoadingPromise) return scriptLoadingPromise;

  const existing = document.querySelector<HTMLScriptElement>(
    'script[data-adsense-loader]',
  );
  if (existing) {
    scriptLoadingPromise = Promise.resolve();
    return scriptLoadingPromise;
  }

  scriptLoadingPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
    s.dataset.adsenseLoader = 'true';
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load AdSense script'));
    document.head.appendChild(s);
  });

  return scriptLoadingPromise;
}

interface AdSlotProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  minHeight?: number;
  label?: string;
}

export function AdSlot({
  slot,
  format = 'auto',
  responsive = true,
  minHeight = 100,
  label = '광고',
}: AdSlotProps) {
  const insRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);

  const enabled = Boolean(CLIENT && slot);

  useEffect(() => {
    if (!enabled || !CLIENT) return;
    if (pushedRef.current) return;
    pushedRef.current = true;

    loadAdsenseScript(CLIENT)
      .then(() => {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
          console.warn('AdSense push failed:', err);
        }
      })
      .catch((err) => console.warn(err));
  }, [enabled]);

  if (!enabled) {
    return (
      <div
        className="ad-placeholder"
        style={{ minHeight }}
        aria-hidden="true"
      >
        <span>{label} 자리 (AdSense 미설정)</span>
      </div>
    );
  }

  return (
    <div className="ad-wrap" style={{ minHeight }}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
