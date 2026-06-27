import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Делает основной файл стилей неблокирующим, чтобы экран загрузки
// (на инлайн-стилях) рисовался мгновенно, не дожидаясь загрузки CSS приложения.
function nonBlockingCss() {
  return {
    name: "non-blocking-css",
    enforce: "post",
    transformIndexHtml(html) {
      return html.replace(
        /<link rel="stylesheet"([^>]*?)href="([^"]+)"([^>]*)>/g,
        (_match, pre, href, post) =>
          `<link rel="stylesheet"${pre}href="${href}"${post} media="print" onload="this.media='all'">` +
          `<noscript><link rel="stylesheet"${pre}href="${href}"${post}></noscript>`,
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), nonBlockingCss()],
});
