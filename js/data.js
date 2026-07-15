/* ============================================
   작품 데이터
   ============================================
   자료를 추가하는 방법:
   1. 파일을 assets/<카테고리>/ 폴더에 복사
   2. 아래 해당 카테고리 배열에 한 줄 추가

   항목 형식:
   { src: "assets/ai-image/파일명.jpg",   // 경로
     title: "작품 제목",                   // 제목
     client: "브랜드/클라이언트",           // 우측 캡션 (생략 가능)
     type: "image" | "video",             // 기본값 image
     wide: true,                          // 가로형(16:9)
     tall: true,                          // 세로형(9:16)
     feature: true }                      // 케이스 스터디형 (+ meta, desc, lines)
   ============================================ */

const WORKS = {
  "ai-image": [
    { src: "assets/ai-image/ai-01.jpg" },
    { src: "assets/ai-image/ai-02.jpg" },
    { src: "assets/ai-image/ai-03.jpg" },
    { src: "assets/ai-image/ai-04.jpg" },
    { src: "assets/ai-image/ai-05.jpg" },
    { src: "assets/ai-image/ai-06.jpg" },
    { src: "assets/ai-image/ai-07.jpg" },
    { src: "assets/ai-image/ai-08.jpg" },
    { src: "assets/ai-image/ai-09.jpg" },
    { src: "assets/ai-image/ai-10.jpg" },
    { src: "assets/ai-image/ai-11.jpg" },
    { src: "assets/ai-image/ai-12.jpg" },
    { src: "assets/ai-image/ai-13.jpg" },
    { src: "assets/ai-image/ai-14.jpg" },
    { src: "assets/ai-image/ai-15.jpg" },
    { src: "assets/ai-image/ai-16.jpg" },
  ],

  "ai-video": [
    {
      src: "assets/ai-video/esarang-cf.mp4",
      poster: "assets/ai-video/esarang-cf-poster.jpg",
      title: "ESARANG DENTAL — <em>Laminate CF</em>",
      client: "이사랑치과의원",
      type: "video",
      wide: true,
      feature: true,
      meta: "AI Generated Commercial · 16:9 · 21s",
      bg: "#223038",
      desc: "'자연스러운 미소'를 주제로 한 치과 라미네이트 브랜드 필름. 모델 클로즈업부터 셰이드 매칭 디테일, 클리닉 공간까지 AI로 연출했습니다.",
      lines: ["자연스러운, 미소", "보철과 전문의가 맞추는", "공덕역, 가장 자연스러운 라미네이트"],
    },
    {
      src: "assets/ai-video/innerglow-cf.mp4",
      poster: "assets/ai-video/innerglow-cf-poster.jpg",
      title: "INNERGLOW — <em>Collagen Jelly CF</em>",
      client: "Innerglow",
      type: "video",
      tall: true,
      feature: true,
      meta: "AI Generated Commercial · 9:16 · 15s",
      bg: "#38302a",
      desc: "지친 오후의 사무실에서 시작해 한 포의 젤리로 끝나는 15초 풀퍼널 커머셜. 기획·카피부터 이미지 및 모션 생성, 편집까지 전 과정을 AI 파이프라인으로 제작했습니다.",
      lines: ["커피로도 안 되네", "딱 한 포면 돼", "쉽고, 가볍게 한입", "속부터 탱탱하게"],
    },
    {
      src: "assets/ai-video/glenraven-cf.mp4",
      poster: "assets/ai-video/glenraven-cf-poster.jpg",
      title: "GLENRAVEN — <em>Single Malt 18</em>",
      client: "Glenraven",
      type: "video",
      wide: true,
      feature: true,
      meta: "AI Generated Brand Film · 16:9 · 28s",
      bg: "#241509",
      desc: "스코틀랜드 하이랜드의 증류소에서 한 잔의 위스키까지 — 항공 씬, 리퀴드 클로즈업, 라벨 디테일까지 AI로 연출한 싱글몰트 브랜드 필름.",
      lines: ["하이랜드의 아침", "오크통에서 글라스로", "얼음 위로, 깊게", "Aged 18 Years"],
    },
    {
      src: "assets/ai-video/lumiere-cf.mp4",
      poster: "assets/ai-video/lumiere-cf-poster.jpg",
      title: "LUMIÈRE — <em>Golden Serum</em>",
      client: "Lumière",
      type: "video",
      wide: true,
      feature: true,
      meta: "AI Generated Commercial · 16:9 · 21s",
      bg: "#2c2513",
      desc: "골든아워의 빛으로 완성한 럭셔리 세럼 필름. 피부 위 빛의 결을 시각화하는 연출과 카피라이팅까지 AI 파이프라인으로 제작했습니다.",
      lines: ["나는 나에게 가장 좋은 걸 줘요", "피부가 먼저 알아요", "당신의 우아함은 —", "Lumière"],
    },
    {
      src: "assets/ai-video/aether-cf.mp4",
      poster: "assets/ai-video/aether-cf-poster.jpg",
      title: "AETHER — <em>Unleash the Night</em>",
      client: "Aether",
      type: "video",
      wide: true,
      feature: true,
      meta: "AI Generated Commercial · 16:9 · 33s",
      bg: "#0e1526",
      desc: "네온이 흐르는 도시의 밤을 달리는 에너지 드링크 런칭 필름. 매크로, 스트리트, 파티 씬까지 브랜드 세계관 전체를 AI로 구축했습니다.",
      lines: ["네온이 깨어나는 시간", "차가운 첫 모금", "도시를 가로질러", "Unleash the Night"],
    },
  ],

  "video-editing": [
    { src: "assets/video-editing/sone-kimnamgil.mp4", poster: "assets/video-editing/sone-kimnamgil-poster.jpg", type: "video", tall: true },
    { src: "assets/video-editing/sone-malwang.mp4", poster: "assets/video-editing/sone-malwang-poster.jpg", type: "video", tall: true },
    { src: "assets/video-editing/sone-simeunkyung.mp4", poster: "assets/video-editing/sone-simeunkyung-poster.jpg", type: "video", tall: true },
    { src: "assets/video-editing/sone-pinggyego.mp4", poster: "assets/video-editing/sone-pinggyego-poster.jpg", type: "video", tall: true },
    { src: "assets/video-editing/alphai.mp4", poster: "assets/video-editing/alphai-poster.jpg", type: "video", tall: true },
    { src: "assets/video-editing/ezed-detector.mp4", poster: "assets/video-editing/ezed-detector-poster.jpg", type: "video", tall: true },
    { src: "assets/video-editing/ezed-perfume-1.mp4", poster: "assets/video-editing/ezed-perfume-1-poster.jpg", type: "video", tall: true },
    { src: "assets/video-editing/ezed-perfume-2.mp4", poster: "assets/video-editing/ezed-perfume-2-poster.jpg", type: "video", wide: true },
    { src: "assets/video-editing/ezed-perfume-3.mp4", poster: "assets/video-editing/ezed-perfume-3-poster.jpg", type: "video", tall: true, sensitive: true },
    { src: "assets/video-editing/ezed-perfume-4.mp4", poster: "assets/video-editing/ezed-perfume-4-poster.jpg", type: "video", tall: true, sensitive: true },
  ],
};
