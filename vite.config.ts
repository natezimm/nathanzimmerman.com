import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
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
      lines: 90,
      statements: 85,
      functions: 85,
      branches: 80,
    },
  },
}));
