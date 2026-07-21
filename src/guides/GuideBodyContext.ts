import { createContext } from 'react';
import type { ReactNode } from 'react';

// 프리렌더(SSR) 시 가이드 본문을 동기적으로 주입하기 위한 컨텍스트.
// 클라이언트에서는 provider가 없어 null이며, 이 경우 기존처럼 동적 import로 로드한다.
export const GuideBodyContext = createContext<((slug: string) => ReactNode) | null>(null);
