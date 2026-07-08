# yoong's 포트폴리오 사이트 — 제작 과정 기록

> 2026-07-08 · Claude Code와 함께 제작
> 사이트: https://gunryoong.github.io/yoongs-portfolio/
> 레퍼런스: https://depoluxe.xyz/

---

## 1. 기획

**목표** — 5개 분야를 다루는 개인 포트폴리오 사이트를 만들고 GitHub Pages로 배포한다.

| 분류 | 페이지 |
|---|---|
| 패션디자인 | `fashion-design.html` |
| 촬영기획&진행 | `photoshoot.html` |
| AI 이미지 제작 | `ai-image.html` |
| AI 영상 제작 | `ai-video.html` |
| 영상편집 | `video-editing.html` |

**결정 사항**
- 브랜드명: **yoong's**
- 톤: 화이트 미니멀 (depoluxe.xyz와 동일 계열 — "strategic & cinematic luxury")
- 구조: 메인 페이지 + 카테고리별 개별 페이지
- 배포: GitHub Pages (repo: `gunryoong/yoongs-portfolio`, main 브랜치 루트)

## 2. 레이아웃 제작

- 순수 HTML/CSS/JS 정적 사이트 (빌드 도구 없음 — GitHub Pages에 바로 올라감)
- 메인: 히어로 문구 + 카테고리 인덱스 리스트(로마숫자 I–V) + About/Contact
- 카테고리 페이지: 키커 + 대형 세리프 타이틀 + 갤러리 + Prev/Next 내비게이션
- 갤러리는 `js/data.js`의 배열 데이터로 렌더링 — **파일 복사 + 배열 한 줄 추가**로 작품 등록
- 영문 타이포: Cormorant Garamond (세리프, 이탤릭 포인트)

## 3. GitHub 배포

- 이 Mac에는 gh CLI / SSH 키 / 저장된 인증이 전혀 없었음
- gh CLI 바이너리를 직접 내려받고, **GitHub Device Flow**(기기 인증)로 토큰 발급
  - 브라우저에서 github.com/login/device 접속 → 코드 입력 → 승인
  - 코드는 15분 만료라 두 번 만료된 끝에 인증 완료
- `gh repo create` → `git push` → Pages API로 활성화 → 사이트 라이브 확인

## 4. AI 영상 페이지 — 케이스 스터디 레이아웃

- 첫 테스트로 INNERGLOW 콜라겐 젤리 CF(9:16, 15s) 등록
- ffmpeg가 없어서 정적 빌드(arm64)를 내려받아 사용
  - 원본 69MB → **720p 2.4MB**로 압축, 포스터 프레임 추출
- 영상에서 프레임을 뽑아 내용 분석 후, **광고 카피 흐름을 타이포 라인으로 배치**하는
  피처 레이아웃 설계: 영상 + (Case 키커 / 타이틀 / 메타 / 설명 / 카피 4줄)

## 5. 타이포 결정 과정

1. 초기: 나눔명조 + 가짜 이탤릭 → "성의 없어 보인다"는 피드백
2. 4가지 시안 비교 (Noto Serif KR / Gowun Batang / Song Myung / Hahmlet)
   — 실제 페이지에 적용해 스크린샷으로 비교
3. Song Myung 적용 → 다시 나눔명조로 복원 (가짜 이탤릭 제거는 유지)
4. **최종: 한글 전체 고딕(Pretendard) 전환**
   - 영문은 Cormorant 세리프 이탤릭 유지 → "영문 세리프 × 한글 고딕" 조합
   - 고딕 기준으로 카피 라인 크기 축소 (15–19px, weight 500)

## 6. 휠 가로 레일 (depoluxe archive 참고)

- 데스크톱: 갤러리가 가로 스트립이 되고 **휠 스크롤 → 가로 이동**으로 변환 (lerp 관성)
- 스트립 양 끝에서는 하이재킹을 풀어 자연스럽게 페이지 세로 스크롤로 복귀
- 하단에 로마숫자 카운터 + 진행 바 (`01 / 05 ─── SCROLL →`), ←/→ 방향키 지원
- 모바일: 세로 스택 유지
- 작품이 5개 미만이면 로마숫자 placeholder 타일("Coming soon")로 레일 유지
  — 실제 작품을 추가하면 자동으로 대체됨

## 7. AI 영상 4편 등록

`playbook v2/projects/`의 `*_Vf.mp4`(최종본)를 분석·압축해 등록:

| Case | 프로젝트 | 형식 | 원본 → 웹용 |
|---|---|---|---|
| I | INNERGLOW — Collagen Jelly CF | 9:16 · 15s | 69MB → 2.5MB |
| II | GLENRAVEN — Single Malt 18 | 16:9 · 28s | 131MB → 9.2MB |
| III | LUMIÈRE — Golden Serum | 16:9 · 21s | 48MB → 3.2MB |
| IV | AETHER — Unleash the Night | 16:9 · 33s | 57MB → 11MB |

- 각 영상을 프레임 단위로 분석해 설명·타이포 라인 작성
  (LUMIÈRE는 영상 속 실제 카피 사용, 나머지는 씬 흐름으로 구성)
- 성능: `preload="none"` + IntersectionObserver로 **화면에 보이는 영상만 재생**

## 8. 작품 추가 방법 (앞으로의 워크플로)

```
1. 파일을 assets/<카테고리>/ 에 복사
   (영상은 ffmpeg로 720p~1080p 압축 권장 — GitHub 파일당 100MB 제한)
2. js/data.js 해당 카테고리 배열에 항목 추가:
   { src: "assets/ai-image/작품.jpg", title: "제목", client: "브랜드" }
   영상: type: "video" / 가로형: wide: true / 세로형: tall: true
   케이스 스터디형: feature: true + meta, desc, lines 추가
3. git commit & push → 1~2분 내 사이트 반영
```

## 기술 스택 요약

- HTML / CSS / Vanilla JS (프레임워크·빌드 없음)
- 폰트: Cormorant Garamond (영문 세리프) + Pretendard (한글 고딕) + Inter (UI)
- 호스팅: GitHub Pages
- 영상 처리: ffmpeg (H.264, CRF 24, faststart)
