# vercel.json 주석

`vercel.json`은 스키마 검증이 엄격해서 `comment` 같은 임의 키를 허용하지 않는다.
그래서 설명을 여기 남긴다.

## ⚠️ `X-Robots-Tag: noindex, nofollow`

**정식 오픈 전까지 제거하지 말 것.** kodekorea.kr의 DNS가 현재 Vercel을 가리키고 있어,
이 헤더가 없으면 미완성 사이트가 그대로 검색에 색인된다.

제거 전 선행 조건:
- 사업자등록번호 (법정 표기 의무)
- 개인정보처리방침 (문의 폼 가동 시 법적 필수)
- 클라이언트 실명 노출 동의 (현재 `ANONYMIZE = true`)
- 브랜드 컬러·로고 확정 (현재 액센트는 임의값)

같은 헤더가 서버 쪽 Caddy 설정에도 걸려 있다. 두 곳을 함께 지워야 한다.
자세한 내용은 `docs/hosting.md`.

## 빌드 설정을 vercel.json에 둔 이유

Vercel 프로젝트(`kodekorea-new-page-geo`)의 대시보드 설정은 이전 사이트 기준으로
**Vite → `dist`** 로 남아 있다. `vercel.json`의 `framework`/`buildCommand`/`outputDirectory`가
대시보드 설정보다 우선하므로, 대시보드를 건드리지 않고 Next.js → `out`으로 배포된다.
