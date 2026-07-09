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

  {
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
      el.innerHTML = `
        <div class="frame${frameClass}">${media}</div>
        <figcaption class="cap">
          <span class="num">${pad2(i + 1)}</span>
          <span class="title">${item.title || ""}</span>
          ${item.client ? `<span class="client">${item.client}</span>` : ""}
        </figcaption>`;
      el.addEventListener("click", () => openLightbox(item));
      gallery.appendChild(el);

      /* hover-play videos */
      const vid = el.querySelector("video");
      if (vid) {
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

  /* ---- 휠 가로 레일 (데스크톱) ---- */
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

  window.addEventListener("wheel", (e) => {
    if (!isDesktop()) return;
    const max = railMax();
    if (max <= 0) return;
    /* 레일이 화면 중앙 근처에 있을 때만 휠을 가로 이동으로 전환 */
    const r = gallery.getBoundingClientRect();
    if (r.bottom < window.innerHeight * 0.35 || r.top > window.innerHeight * 0.75) return;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    const cur = railPos();
    /* 양 끝에서는 하이재킹을 풀어 페이지 세로 스크롤로 복귀 */
    if ((delta > 0 && cur >= max - 1) || (delta < 0 && cur <= 1)) return;
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

/* ---- 메인: 풀스크린 비디오 피드 (휠 스크롤 → 축소, 멈추면 확대) ---- */
const feed = document.querySelector(".feed");
if (feed && typeof WORKS !== "undefined") {
  const vids = (WORKS["ai-video"] || []).filter((v) => v.type === "video");
  const slidesEl = feed.querySelector(".feed-slides");
  const fcCur = feed.querySelector(".fc-cur");
  const fcTotal = feed.querySelector(".fc-total");

  vids.forEach((v, i) => {
    const s = document.createElement("a");
    s.className = "feed-slide";
    s.href = "ai-video.html";
    s.innerHTML = `
      <div class="fs-media">
        <video src="${v.src}"${v.poster ? ` poster="${v.poster}"` : ""} muted loop playsinline preload="${i === 0 ? "auto" : "none"}"></video>
      </div>
      <div class="fs-caption">
        <span class="fs-num">CASE ${pad2(i + 1)}${v.client ? " — " + v.client.toUpperCase() : ""}</span>
        <h2>${v.title}</h2>
      </div>`;
    slidesEl.appendChild(s);
  });

  const slides = Array.from(slidesEl.children);
  const medias = slides.map((s) => s.querySelector(".fs-media"));
  const videos = slides.map((s) => s.querySelector("video"));
  const n = slides.length;
  fcTotal.textContent = pad2(n);
  feed.style.height = n * 100 + "vh";

  let scale = 1;
  let targetScale = 1;
  let idleTimer = null;
  let snapping = false;
  let snapTarget = 0;
  let lastIdx = -1;

  const feedTop = () => feed.getBoundingClientRect().top + window.scrollY;
  const progress = () => {
    const vh = window.innerHeight;
    return Math.min(n - 1, Math.max(0, (window.scrollY - feedTop()) / vh));
  };

  function feedLoop() {
    scale += (targetScale - scale) * 0.11;
    const p = progress();
    slides.forEach((s, i) => {
      s.style.transform = `translateY(${(i - p) * 100}%)`;
    });
    medias.forEach((m) => { m.style.transform = `scale(${scale.toFixed(4)})`; });
    const idx = Math.round(p);
    const settled = Math.abs(scale - 1) < 0.06;
    slides.forEach((s, i) => s.classList.toggle("active", i === idx && settled));
    if (idx !== lastIdx) {
      lastIdx = idx;
      fcCur.textContent = pad2(idx + 1);
      videos.forEach((v, i) => { if (i === idx) v.play(); else if (!v.paused) v.pause(); });
    }
    requestAnimationFrame(feedLoop);
  }
  requestAnimationFrame(feedLoop);

  window.addEventListener("scroll", () => {
    if (snapping) {
      if (Math.abs(window.scrollY - snapTarget) < 2) snapping = false;
      return;
    }
    const rect = feed.getBoundingClientRect();
    const inFeed = rect.top <= 1 && rect.bottom >= window.innerHeight - 1;
    if (!inFeed) { targetScale = 1; return; }

    targetScale = 0.62; /* 스크롤 중: 축소 */
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      targetScale = 1; /* 멈추면: 확대 */
      const vh = window.innerHeight;
      const snapped = Math.round(progress());
      const targetY = Math.round(feedTop() + snapped * vh);
      if (Math.abs(window.scrollY - targetY) > 4) {
        snapping = true;
        snapTarget = targetY;
        window.scrollTo({ top: targetY, behavior: "smooth" });
      }
    }, 200);
  }, { passive: true });
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
