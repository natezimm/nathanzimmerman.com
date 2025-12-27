/// <reference types="vite/client" />
/// <reference types="vitest/globals" />

declare module "*.avif" {
  const src: string;
  export default src;
}
