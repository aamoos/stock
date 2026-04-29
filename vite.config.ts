import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: "esnext",
    minify: "terser",
    // 1. 청크 크기 경고 제한을 1000kB로 상향 (노란 경고 해결)
    chunkSizeWarningLimit: 1000,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2,
      },
    },
    rollupOptions: {
      output: {
        // 2. 청크 전략을 통해 큰 라이브러리 분리
        manualChunks(id) {
          if (
            id.includes("node_modules/recharts") ||
            id.includes("node_modules/d3-") ||
            id.includes("node_modules/victory-")
          ) {
            return "recharts";
          }
          if (
            id.includes("node_modules/react-router-dom") ||
            id.includes("node_modules/react-router/") ||
            id.includes("node_modules/@remix-run/")
          ) {
            return "router";
          }
          if (
            id.includes("node_modules/react-dom") ||
            id.includes("node_modules/react/") ||
            id.includes("node_modules/scheduler/")
          ) {
            return "react-vendor";
          }
          // 추가적으로 용량이 큰 외부 라이브러리가 있다면 아래와 같이 일반화 가능합니다.
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
    cssCodeSplit: true,
    reportCompressedSize: false,
  },
});
