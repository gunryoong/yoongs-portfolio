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

/* ---- 메인: AI 비디오 스크롤 쇼케이스 ---- */
const scBody = document.querySelector(".sc-body");
if (scBody && typeof WORKS !== "undefined") {
  const vids = (WORKS["ai-video"] || []).filter((v) => v.type === "video");
  const titlesEl = scBody.querySelector(".sc-titles");
  const track = scBody.querySelector(".sc-track");
  const mediaEl = scBody.querySelector(".sc-media");

  vids.forEach((v, i) => {
    const a = document.createElement("a");
    a.className = "sc-item";
    a.href = "ai-video.html";
    a.innerHTML = `
      <span class="sc-num">CASE ${pad2(i + 1)}</span>
      <h3>${v.title}</h3>
      ${v.meta ? `<p class="sc-meta">${v.meta}</p>` : ""}
      ${v.poster ? `<img class="sc-inline" src="${v.poster}" alt="" loading="lazy">` : ""}`;
    titlesEl.appendChild(a);

    const f = document.createElement("div");
    f.className = "sc-frame";
    f.innerHTML = `<video src="${v.src}"${v.poster ? ` poster="${v.poster}"` : ""} muted loop playsinline preload="none"></video>`;
    track.appendChild(f);
  });

  const items = Array.from(titlesEl.children);
  const frames = Array.from(track.children);
  let scTicking = false;

  function scSync() {
    scTicking = false;
    if (window.innerWidth <= 768 || frames.length === 0) return;
    const rect = scBody.getBoundingClientRect();
    const stickyH = mediaEl.clientHeight;
    const topOffset = mediaEl.offsetTop === 0 ? window.innerHeight * 0.14 : window.innerHeight * 0.14;
    const range = rect.height - stickyH;
    if (range <= 0) return;
    const p = Math.min(1, Math.max(0, (topOffset - rect.top) / range));
    track.style.transform = `translateY(${-p * (frames.length - 1) * stickyH}px)`;
    const idx = Math.round(p * (frames.length - 1));
    items.forEach((el, i) => el.classList.toggle("active", i === idx));
    frames.forEach((f, i) => {
      const v = f.querySelector("video");
      if (i === idx) { if (v.paused) v.play(); } else if (!v.paused) v.pause();
    });
  }
  window.addEventListener("scroll", () => {
    if (!scTicking) { scTicking = true; requestAnimationFrame(scSync); }
  }, { passive: true });
  window.addEventListener("resize", scSync);
  scSync();
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
