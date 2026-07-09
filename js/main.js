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
  feed.style.height = n * 100 + "vh";

  /* 캐스케이드 배치 패턴 (좌→우 계단식) */
  const X_PAT = [0.03, 0.30, 0.14, 0.42];
  const W_PAT = [0.34, 0.24, 0.32, 0.26];

  const expand = new Array(n).fill(0);
  let idleExpand = true; /* 로드 직후: 첫 케이스 확대 상태 */
  let idleTimer = null;
  let lastIdx = -1;

  const feedTop = () => feed.getBoundingClientRect().top + window.scrollY;
  const progress = () => {
    const vh = window.innerHeight;
    return Math.min(n - 1, Math.max(0, (window.scrollY - feedTop()) / vh));
  };

  function feedLoop() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const mobile = vw <= 768;
    const p = progress();
    const idx = Math.round(p);

    for (let i = 0; i < n; i++) {
      const it = vids[i];
      /* 캐스케이드 rect */
      const wF = it.tall ? (mobile ? 0.40 : 0.15) : (mobile ? 0.72 : W_PAT[i % 4]);
      const cw = vw * wF;
      const ch = it.tall ? cw * 16 / 9 : cw * 9 / 16;
      const cx = vw * (mobile ? [0.05, 0.22, 0.10, 0.24][i % 4] : X_PAT[i % 4]);
      const cy = vh * 0.32 + (i - p) * vh * 0.78;
      /* 풀스크린 rect (세로 영상은 높이 기준 중앙) */
      let fw, fh, fx, fy;
      if (it.tall) { fh = vh; fw = vh * 9 / 16; fx = (vw - fw) / 2; fy = 0; }
      else { fw = vw; fh = vh; fx = 0; fy = 0; }

      const target = idleExpand && i === idx ? 1 : 0;
      expand[i] += (target - expand[i]) * 0.085;
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
      tags[i].style.opacity = (1 - e * 2).toFixed(2);

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

    /* 피드 위에 있는 동안 헤더 다크 모드 */
    document.body.classList.toggle("over-feed", feed.getBoundingClientRect().bottom > 90);

    requestAnimationFrame(feedLoop);
  }
  requestAnimationFrame(feedLoop);

  window.addEventListener("scroll", () => {
    idleExpand = false; /* 스크롤 중: 캐스케이드 */
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { idleExpand = true; }, 450); /* 멈추면: 확대 */
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
