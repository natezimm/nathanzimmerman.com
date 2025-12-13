import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.ts",
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      all: true,
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/setupTests.ts",
        "src/main.tsx",
        "src/vite-env.d.ts",
        "src/assets/**/*",
        "src/components/shared/**/*",
      ],
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
}));
