/* yoong's portfolio — shared script */

const ROMAN = ["I","II","III","IV","V","VI","VII","VIII","IX","X",
  "XI","XII","XIII","XIV","XV","XVI","XVII","XVIII","XIX","XX",
  "XXI","XXII","XXIII","XXIV","XXV","XXVI","XXVII","XXVIII","XXIX","XXX"];

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

  if (items.length === 0) {
    gallery.innerHTML =
      '<div class="gallery-empty">Coming soon — 작업물 준비 중</div>';
  } else {
    items.forEach((item, i) => {
      const el = document.createElement("figure");
      el.className = "work reveal" + (item.wide ? " span-2" : "");
      const media = item.type === "video"
        ? `<video src="${item.src}" muted loop playsinline preload="metadata"></video>`
        : `<img src="${item.src}" alt="${item.title || ""}" loading="lazy">`;
      el.innerHTML = `
        <div class="frame${item.wide ? " wide" : ""}">${media}</div>
        <figcaption class="cap">
          <span class="num">${ROMAN[i] || i + 1}</span>
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
  }
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
