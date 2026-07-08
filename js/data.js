/* ============================================
   작품 데이터
   ============================================
   자료를 추가하는 방법:
   1. 파일을 assets/<카테고리>/ 폴더에 복사
   2. 아래 해당 카테고리 배열에 한 줄 추가

   항목 형식:
   { src: "assets/fashion-design/파일명.jpg",  // 경로
     title: "작품 제목",                        // 제목
     client: "브랜드/클라이언트",                // 우측 캡션 (생략 가능)
     type: "image" | "video",                  // 기본값 image
     wide: true }                              // 가로형(16:9)이면 true
   ============================================ */

const WORKS = {
  "fashion-design": [
    // { src: "assets/fashion-design/example.jpg", title: "Collection 01", client: "Brand" },
  ],

  "photoshoot": [
    // { src: "assets/photoshoot/example.jpg", title: "Editorial", client: "Magazine" },
  ],

  "ai-image": [
    // { src: "assets/ai-image/example.jpg", title: "AI Editorial", client: "Personal" },
  ],

  "ai-video": [
    {
      src: "assets/ai-video/innerglow-cf.mp4",
      poster: "assets/ai-video/innerglow-cf-poster.jpg",
      title: "INNERGLOW — <em>Collagen Jelly CF</em>",
      client: "Innerglow",
      type: "video",
      tall: true,
      feature: true,
      meta: "AI Generated Commercial · 9:16 · 15s",
      desc: "지친 오후의 사무실에서 시작해 한 포의 젤리로 끝나는 15초 풀퍼널 커머셜. 기획·카피부터 이미지 및 모션 생성, 편집까지 전 과정을 AI 파이프라인으로 제작했습니다.",
      lines: ["커피로도 안 되네", "딱 한 포면 돼", "쉽고, 가볍게 한입", "속부터 탱탱하게"],
    },
  ],

  "video-editing": [
    // { src: "assets/video-editing/example.mp4", title: "Brand Film", type: "video", wide: true },
  ],
};
