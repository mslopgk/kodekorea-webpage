# kodekorea.kr 호스팅

설치일: 2026-08-03 · 서버: `general-server-1` (156.228.4.156)

## 접속

```bash
ssh -i ~/.ssh/id_ed25519_new ubuntu@156.228.4.156
```

⚠️ `ubuntu@blend.kodekorea.kr`로는 SSH가 안 된다. 그 도메인은 Cloudflare 프록시 뒤에 있어
80/443만 통과하고 22번이 차단된다. **오리진 IP로 직접 붙어야 한다.**

## 구조

```
/var/www/kodekorea/
├── current -> releases/<타임스탬프>   ← Caddy가 이 링크를 root로 본다
├── releases/
│   ├── 20260803-173349/              ← 릴리스는 타임스탬프 디렉토리
│   └── placeholder/                  ← DNS 연결 전 안내 페이지 (롤백 대상으로 보존)
└── deploy.sh
```

**배포는 심볼릭 링크 전환**이다. 파일을 덮어쓰지 않으므로 배포 중 반쯤 갱신된 상태가
노출되지 않고, 롤백은 링크를 되돌리는 것으로 끝난다. Caddy를 재시작하지 않으므로
같은 서버의 다른 서비스에 영향이 없다.

## 배포

로컬 리포에서:

```bash
npm run deploy            # 빌드 → 업로드 → 링크 전환
npm run deploy:list       # 현재 릴리스와 목록
npm run deploy:rollback   # 직전 릴리스로 되돌리기
```

서버에서 직접:

```bash
sudo /var/www/kodekorea/deploy.sh --list
sudo /var/www/kodekorea/deploy.sh --rollback
```

릴리스는 최근 5개만 보관하고 나머지는 자동 정리된다.
`index.html`이 없는 아카이브는 거부하고 링크를 전환하지 않는다.

## Caddy 설정

`/etc/caddy/Caddyfile` 맨 아래에 `www.kodekorea.kr`(리다이렉트)과 `kodekorea.kr` 두 블록이
추가돼 있다. 기존 11개 서브도메인 블록은 손대지 않았다. 백업은
`/etc/caddy/Caddyfile.bak-20260803-083030`.

설정을 바꿀 때는 반드시:

```bash
sudo caddy validate --config /etc/caddy/Caddyfile   # 먼저 검증
sudo systemctl reload caddy                        # restart 아님 — reload는 무중단
```

주요 지시자:

| 항목 | 설정 | 이유 |
|---|---|---|
| `/_next/static/*` | `max-age=31536000, immutable` | 파일명에 내용해시가 있어 영구 캐시 가능 |
| HTML | `no-cache, must-revalidate` | 배포가 즉시 반영돼야 한다 |
| `try_files` | `{path} {path}/index.html {path}.html` | `trailingSlash: true` 정적 export 대응 |
| `handle_errors` | `/404.html` | Next.js가 만든 404 페이지 사용 |
| `X-Robots-Tag` | **`noindex, nofollow`** | ⚠️ 아래 참고 |

### ⚠️ 정식 오픈 전에 반드시 지울 것

```
X-Robots-Tag "noindex, nofollow"
```

콘텐츠가 확정되지 않아 색인을 막아둔 상태다. 아래가 해결되기 전에 지우면 안 된다.

- 사업자등록번호 (법정 표기 의무 · 회신본 부록 A-4)
- 개인정보처리방침 (문의 폼으로 개인정보를 받는 순간 법적 필수 · 회신본 7)
- 클라이언트 실명 노출 동의 (현재 `ANONYMIZE = true`로 마스킹 중)
- 브랜드 컬러·로고 확정 (현재 액센트는 임의값)

## DNS (사용자가 설정)

```
kodekorea.kr        A     156.228.4.156
www.kodekorea.kr    A     156.228.4.156   (또는 CNAME kodekorea.kr)
```

**처음에는 DNS-only(회색 구름)로 두어야 한다.** Cloudflare 프록시(주황 구름)를 켠 상태로는
Caddy가 Let's Encrypt 인증서를 발급받지 못한다 — 챌린지가 Cloudflare에서 종료되기 때문이다.

순서:

1. A 레코드를 DNS-only로 추가
2. Caddy가 자동 발급 (60초 주기로 재시도, 최대 30일)
3. `sudo journalctl -u caddy -f | grep kodekorea` 로 발급 확인
4. 확인 후 원하면 Cloudflare 프록시를 켠다 (SSL 모드는 **Full (strict)**)

현재 `kodekorea.kr`은 **216.198.79.1**을 가리키고 있어 ACME가 실패 중이다. 정상이며,
DNS를 옮기면 자동으로 해결된다.

## 검증

DNS 전환 후:

```bash
curl -sI https://kodekorea.kr/ | head -20
curl -s -o /dev/null -w "%{http_code}\n" https://kodekorea.kr/c/v2/
curl -sI https://www.kodekorea.kr/            # 308 -> https://kodekorea.kr/
```

DNS 전환 전 서버 안에서 확인하려면 (HTTPS는 인증서가 없어 불가):

```bash
curl -sI -H "Host: kodekorea.kr" http://127.0.0.1/    # 308 리다이렉트만 확인 가능
sudo -u caddy test -r /var/www/kodekorea/current/index.html && echo OK
```

## 같은 서버의 다른 서비스

건드리지 않았다. 참고용 목록 (전부 127.0.0.1 바인딩 + Caddy 리버스 프록시):

`supabase` · `supabase-lms` · `supabase-axedu` · `supabase-students` ·
`mcp`(10001) · `lms`(10002) · `blend`(10003) · `monitor`(3001) ·
`attendance`(8020) · `design`(10004) · `team`(정적 `/var/www/teamhub`) ·
`bubblemap`(8110) · `uptime-kuma`

`team.kodekorea.kr`이 정적 사이트 선례이고, kodekorea.kr도 같은 방식이다.
