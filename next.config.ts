import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // 상위 디렉토리의 무관한 lockfile을 워크스페이스 루트로 오인하는 것을 막는다
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
