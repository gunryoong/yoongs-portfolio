# yoong's — AI creative portfolio

GUNYOONG KIM — AI 이미지 제작 / AI 영상 제작 / 영상편집 포트폴리오 사이트.

## 작품 추가 방법

1. 파일을 `assets/<카테고리>/` 폴더에 복사
   - `assets/ai-image/` — AI 이미지
   - `assets/ai-video/` — AI 영상
   - `assets/video-editing/` — 영상편집
2. `js/data.js`를 열어 해당 카테고리 배열에 항목 추가:
   ```js
   { src: "assets/ai-image/작품1.jpg", title: "작품 제목", client: "브랜드" }
   ```
   영상은 `type: "video"`, 가로형(16:9)은 `wide: true` 추가.
3. 커밋 & 푸시하면 GitHub Pages에 자동 반영.
