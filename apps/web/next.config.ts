import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output is enabled in Docker builds (Phase 8). Local Windows
  // builds often fail creating symlinks without Developer Mode.
  output: process.env.DOCKER_BUILD === "1" ? "standalone" : undefined,
  transpilePackages: ["@keynotes/ui", "@keynotes/validators", "@keynotes/db"],
};

export default nextConfig;
