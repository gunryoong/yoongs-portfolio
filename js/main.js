/* yoong's portfolio — shared script */

const pad2 = (n) => String(n).padStart(2, "0");

/* header scroll state */
const header = document.querySelector(".site-header");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 10);
});

/* mobile menu */
const toggle = document.querySelector(".nav-toggle");
if (toggle) {
  toggle.addEventListener("click", () => document.body.classList.toggle("menu-open"));
}

/* gallery render (category pages) */
const gallery = document.querySelector("[data-gallery]");
if (gallery && typeof WORKS !== "undefined") {
  const key = gallery.dataset.gallery;
  const items = WORKS[key] || [];
  const masonry = gallery.dataset.layout === "masonry";

  if (masonry) {
    /* 랜덤 갤러리 — 방문할 때마다 순서 셔플 */
    gallery.classList.add("masonry");
    [...items].sort(() => Math.random() - 0.5).forEach((item) => {
      const el = document.createElement("figure");
      el.className = "work reveal";
      el.innerHTML = `<div class="frame"><img src="${item.src}" alt="" loading="lazy"></div>`;
      el.addEventListener("click", () => openLightbox(item));
      gallery.appendChild(el);
    });
  }

  if (!masonry) {
    items.forEach((item, i) => {
      const el = document.createElement("figure");
      const frameClass = item.tall ? " tall" : item.wide ? " wide" : "";
      const poster = item.poster ? ` poster="${item.poster}"` : "";

      if (item.feature) {
        /* 케이스 스터디형 — 영상 + 타이포 설명 블록 */
        el.className = "work feature reveal";
        const media = item.type === "video"
          ? `<video src="${item.src}"${poster} muted loop playsinline preload="none"></video>`
          : `<img src="${item.src}" alt="" loading="lazy">`;
        el.innerHTML = `
          <div class="frame${frameClass}">${media}</div>
          <div class="feature-text">
            <p class="f-kicker">Case ${pad2(i + 1)}${item.client ? " — " + item.client : ""}</p>
            <h2 class="f-title">${item.title || ""}</h2>
            ${item.meta ? `<p class="f-meta">${item.meta}</p>` : ""}
            ${item.desc ? `<p class="f-desc">${item.desc}</p>` : ""}
            ${item.lines ? `<ul class="f-lines">${item.lines
              .map((l, j) => `<li><span class="l-num">${String(j + 1).padStart(2, "0")}</span><span class="l-text">${l}</span></li>`)
              .join("")}</ul>` : ""}
          </div>`;
        el.querySelector(".frame").addEventListener("click", () => openLightbox(item));
        gallery.appendChild(el);

        /* 화면에 보일 때만 재생 (여러 영상 동시 로드 방지) */
        const fVid = el.querySelector("video");
        if (fVid) {
          new IntersectionObserver((ens) => {
            ens.forEach((en) => en.isIntersecting ? fVid.play() : fVid.pause());
          }, { threshold: 0.25 }).observe(fVid);
        }
        return;
      }

      el.className = "work reveal";
      const media = item.type === "video"
        ? `<video src="${item.src}"${poster} muted loop playsinline preload="metadata"></video>`
        : `<img src="${item.src}" alt="${item.title || ""}" loading="lazy">`;
      const warn = item.sensitive
        ? '<div class="sens-warn"><span class="sw-label">SENSITIVE CONTENT</span><span class="sw-text">선정적인 내용이 포함되어 있습니다<br>클릭하면 재생됩니다</span></div>'
        : "";
      el.innerHTML = `
        <div class="frame${frameClass}${item.sensitive ? " sens" : ""}">${media}${warn}</div>
        <figcaption class="cap">
          <span class="num">${pad2(i + 1)}</span>
          <span class="title">${item.title || ""}</span>
          ${item.client ? `<span class="client">${item.client}</span>` : ""}
        </figcaption>`;
      el.addEventListener("click", () => openLightbox(item));
      gallery.appendChild(el);

      /* hover-play videos (선정성 항목 제외) */
      const vid = el.querySelector("video");
      if (vid && !item.sensitive) {
        el.addEventListener("mouseenter", () => vid.play());
        el.addEventListener("mouseleave", () => vid.pause());
      }
    });

    /* 작품이 채워질 때까지 레일을 유지하는 placeholder 타일 */
    const MIN_SLIDES = 5;
    for (let i = items.length; i < MIN_SLIDES; i++) {
      const ph = document.createElement("figure");
      ph.className = "work ph reveal";
      ph.innerHTML = `
        <div class="frame"><span class="ph-num">${pad2(i + 1)}</span></div>
        <figcaption class="cap">
          <span class="num">${pad2(i + 1)}</span>
          <span class="title">Coming soon</span>
        </figcaption>`;
      gallery.appendChild(ph);
    }
  }

  /* ---- 휠 가로 레일 (데스크톱, 매소너리 페이지 제외) ---- */
  if (!masonry) {
  const isDesktop = () => window.innerWidth > 768;
  const railMax = () => gallery.scrollWidth - gallery.clientWidth;
  let railTarget = 0;
  let railAnimating = false;

  const prog = document.createElement("div");
  prog.className = "rail-progress";
  prog.innerHTML =
    '<span class="rp-count"></span><span class="rp-track"><span class="rp-fill"></span></span><span class="rp-hint">Scroll →</span>';
  gallery.after(prog);
  const rpCount = prog.querySelector(".rp-count");
  const rpFill = prog.querySelector(".rp-fill");
  const total = gallery.children.length;

  function updateProgress() {
    const max = railMax();
    const p = max > 0 ? gallery.scrollLeft / max : 1;
    rpFill.style.width = p * 100 + "%";
    const idx = Math.max(1, Math.min(total, Math.round(p * (total - 1)) + 1));
    rpCount.textContent =
      String(idx).padStart(2, "0") + " / " + String(total).padStart(2, "0");
  }
  updateProgress();
  gallery.addEventListener("scroll", updateProgress);
  window.addEventListener("resize", updateProgress);

  function railTick() {
    const diff = railTarget - gallery.scrollLeft;
    if (Math.abs(diff) < 0.5) {
      gallery.scrollLeft = railTarget;
      railAnimating = false;
      updateProgress();
      return;
    }
    gallery.scrollLeft += diff * 0.14;
    updateProgress();
    requestAnimationFrame(railTick);
  }
  function railGo() {
    if (!railAnimating) { railAnimating = true; requestAnimationFrame(railTick); }
  }
  const railPos = () => (railAnimating ? railTarget : gallery.scrollLeft);

  /* 마우스가 레일(영상 줄) 위에 있을 때만 휠을 가로 이동으로 전환, 그밖은 페이지 스크롤 */
  gallery.addEventListener("wheel", (e) => {
    if (!isDesktop()) return;
    const max = railMax();
    if (max <= 0) return;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    const cur = railPos();
    e.preventDefault();
    railTarget = Math.max(0, Math.min(max, cur + delta));
    railGo();
  }, { passive: false });

  document.addEventListener("keydown", (e) => {
    if (!isDesktop() || railMax() <= 0) return;
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const step = gallery.clientWidth * 0.5;
    railTarget = Math.max(0, Math.min(railMax(),
      railPos() + (e.key === "ArrowRight" ? step : -step)));
    railGo();
  });
  }
}

/* ---- 메인: 다크 캐스케이드 피드 (스크롤 중 썸네일 스택, 멈추면 풀스크린 확대) ---- */
const feed = document.querySelector(".feed");
if (feed && typeof WORKS !== "undefined") {
  const vids = (WORKS["ai-video"] || []).filter((v) => v.type === "video");
  const slidesEl = feed.querySelector(".feed-slides");
  const sticky = feed.querySelector(".feed-sticky");
  const cap = feed.querySelector(".feed-cap");
  const capTitle = feed.querySelector(".fcap-title");
  const capMeta = feed.querySelector(".fcap-meta");
  const clientEl = feed.querySelector(".feed-client");
  const fcCur = feed.querySelector(".fc-cur");
  const fcTotal = feed.querySelector(".fc-total");

  vids.forEach((v, i) => {
    const s = document.createElement("a");
    s.className = "feed-slide";
    s.href = "ai-video.html";
    s.innerHTML = `
      <div class="fs-box">
        <video src="${v.src}"${v.poster ? ` poster="${v.poster}"` : ""} muted loop playsinline preload="${i === 0 ? "auto" : "metadata"}"></video>
      </div>
      <span class="fs-tag"><span class="t-num">${pad2(i + 1)}</span><span class="t-name">${v.client || ""}</span></span>`;
    slidesEl.appendChild(s);
  });

  const slides = Array.from(slidesEl.children);
  const tags = slides.map((s) => s.querySelector(".fs-tag"));
  const videos = slides.map((s) => s.querySelector("video"));
  const n = slides.length;
  fcTotal.textContent = pad2(n);
  document.body.classList.add("over-feed"); /* 메인은 항상 다크 헤더 */

  /* 캐스케이드 배치 패턴 (좌→우 계단식) */
  const X_PAT = [0.03, 0.30, 0.14, 0.42];
  const W_PAT = [0.34, 0.24, 0.32, 0.26];

  const HOLD_MS = 6500; /* 각 케이스 풀스크린 유지 시간 */
  const expand = new Array(n).fill(0);
  let pFloat = 0;       /* 현재 위치 (연속값, 무한 증가) */
  let targetP = 0;      /* 목표 위치 (휠 누적으로 연속 변화) */
  let idleExpand = true;
  let holdUntil = performance.now() + HOLD_MS;
  let lastWheel = -9999;
  let lastIdx = -1;

  function feedLoop(t) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const mobile = vw <= 768;
    const settledToTarget = Math.abs(targetP - pFloat) < 0.04;
    const wheelIdle = t - lastWheel > 260; /* 휠이 멈춘 지 260ms 지남 */

    /* 자동 로테이션: 유지 시간이 지나면 다음 케이스로 부드럽게 흐름 */
    if (idleExpand && settledToTarget && t > holdUntil) {
      idleExpand = false;
      targetP = Math.round(targetP) + 1;
    }
    /* 휠이 멈추면 가장 가까운 케이스로 스냅 + 확대 준비 */
    if (!idleExpand && wheelIdle) {
      targetP = Math.round(targetP);
      if (settledToTarget) { idleExpand = true; holdUntil = t + HOLD_MS; }
    }
    /* 연속 추종 (부드러운 감속) */
    pFloat += (targetP - pFloat) * 0.09;
    const idx = ((Math.round(pFloat) % n) + n) % n;

    for (let i = 0; i < n; i++) {
      const it = vids[i];
      /* 무한 루프: 각 슬라이드를 가장 가까운 사이클 위치에 배치 */
      const k = i + n * Math.round((pFloat - i) / n);
      /* 캐스케이드 rect */
      const wF = it.tall ? (mobile ? 0.40 : 0.15) : (mobile ? 0.72 : W_PAT[i % 4]);
      const cw = vw * wF;
      const ch = it.tall ? cw * 16 / 9 : cw * 9 / 16;
      const cx = vw * (mobile ? [0.05, 0.22, 0.10, 0.24][i % 4] : X_PAT[i % 4]);
      const cy = vh * 0.32 + (k - pFloat) * vh * 0.78;
      /* 풀스크린 rect (세로 영상은 높이 기준 중앙) */
      let fw, fh, fx, fy;
      if (it.tall) { fh = vh; fw = vh * 9 / 16; fx = (vw - fw) / 2; fy = 0; }
      else { fw = vw; fh = vh; fx = 0; fy = 0; }

      const target = idleExpand && i === idx ? 1 : 0;
      expand[i] += (target - expand[i]) * 0.075;
      const e = expand[i] < 0.001 ? 0 : expand[i];

      const x = cx + (fx - cx) * e;
      const y = cy + (fy - cy) * e;
      const w = cw + (fw - cw) * e;
      const h = ch + (fh - ch) * e;
      const s = slides[i];
      s.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      s.style.width = w.toFixed(1) + "px";
      s.style.height = h.toFixed(1) + "px";
      s.style.zIndex = e > 0.02 ? 30 : 10 + i;
      tags[i].style.opacity = Math.max(0, 1 - e * 2).toFixed(2);

      /* 화면에 걸린 썸네일 + 확대된 것만 재생 */
      const onScreen = y < vh && y + h > 0;
      if (onScreen || e > 0.02) { if (videos[i].paused) videos[i].play().catch(() => {}); }
      else if (!videos[i].paused) videos[i].pause();
    }

    if (idx !== lastIdx) {
      lastIdx = idx;
      const it = vids[idx];
      fcCur.textContent = pad2(idx + 1);
      capTitle.innerHTML = it.title || "";
      capMeta.textContent = it.meta || "";
      clientEl.textContent = it.client || "";
      if (it.bg) sticky.style.backgroundColor = it.bg;
    }
    const eAct = expand[idx];
    cap.style.opacity = eAct.toFixed(2);
    clientEl.style.opacity = eAct.toFixed(2);

    requestAnimationFrame(feedLoop);
  }
  requestAnimationFrame(feedLoop);

  /* 휠: 델타를 연속 누적 → 케이스 사이를 끊김 없이 흐름 (멈추면 스냅+확대) */
  window.addEventListener("wheel", (e) => {
    const now = performance.now();
    lastWheel = now;
    idleExpand = false;
    targetP += (e.deltaY / window.innerHeight) * 1.15;
    holdUntil = now + HOLD_MS;
  }, { passive: true });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    lastWheel = performance.now();
    idleExpand = false;
    targetP = Math.round(targetP) + (e.key === "ArrowDown" ? 1 : -1);
    holdUntil = performance.now() + HOLD_MS;
  });

  /* 모바일: 터치 스와이프로 케이스 이동 (휠이 없어 스크롤이 안 먹히던 문제) */
  let touchY = null;
  feed.addEventListener("touchstart", (e) => {
    touchY = e.touches[0].clientY;
  }, { passive: true });
  feed.addEventListener("touchmove", (e) => {
    if (touchY === null) return;
    const y = e.touches[0].clientY;
    const dy = touchY - y;
    touchY = y;
    const now = performance.now();
    lastWheel = now;
    idleExpand = false;
    targetP += (dy / window.innerHeight) * 1.5;
    holdUntil = now + HOLD_MS;
  }, { passive: true });
  feed.addEventListener("touchend", () => { touchY = null; }, { passive: true });
}

/* lightbox */
function openLightbox(item) {
  let lb = document.querySelector(".lightbox");
  if (!lb) {
    lb = document.createElement("div");
    lb.className = "lightbox";
    lb.innerHTML = '<button class="lb-close">Close</button><div class="lb-media"></div>';
    lb.addEventListener("click", (e) => {
      if (e.target === lb || e.target.classList.contains("lb-close")) closeLightbox();
    });
    document.body.appendChild(lb);
  }
  const media = lb.querySelector(".lb-media");
  media.innerHTML = item.type === "video"
    ? `<video src="${item.src}" controls autoplay playsinline></video>`
    : `<img src="${item.src}" alt="${item.title || ""}">`;
  lb.classList.add("open");
}
function closeLightbox() {
  const lb = document.querySelector(".lightbox");
  if (lb) {
    lb.classList.remove("open");
    lb.querySelector(".lb-media").innerHTML = "";
  }
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

/* reveal on scroll */
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) {
      en.target.classList.add("visible");
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
