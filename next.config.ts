import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // 상위 디렉토리의 무관한 lockfile을 워크스페이스 루트로 오인하는 것을 막는다
  outputFileTracingRoot: __dirname,
  // 시안 4벌 전부 정적 프리렌더이므로 정적 export로 배포한다 (서버리스 불필요)
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
