import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Prioriza código fonte TS/TSX quando existir JS gerado no mesmo diretório.
    extensions: [".ts", ".tsx", ".js", ".jsx", ".mjs", ".json"],
  },
  server: {
    host: true,
    port: 5173,
  },
});
