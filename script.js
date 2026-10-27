"use strict";

const PHOTO_CONFIG = [
  {
    canvasId: "photoCanvas1",
    placeholderId: "placeholder1",
    src: "images/portrait.jpeg"
  },
  {
    canvasId: "photoCanvas2",
    placeholderId: "placeholder2",
    src: "images/family.jpeg"
  },
  {
    canvasId: "photoCanvas3",
    placeholderId: "placeholder3",
    src: "images/lilies.jpeg"
  }
];

const PHOTO_DURATION = 6000;
const INITIAL_BLUR = 28;
const PHOTO_START_DELAY = 700;

const animationRuns = new Map();
const loadedImages = new Map();

document.documentElement.classList.add("js-reveal");

function loadImage(src) {
  if (loadedImages.has(src)) {
    return loadedImages.get(src);
  }

  const promise = new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => {
      reject(new Error(`Gagal memuat gambar: ${src}`));
    };

    image.src = src;
  });

  loadedImages.set(src, promise);
  return promise;
}

function drawPhoto(ctx, image, width, height, blur = 0) {
  ctx.clearRect(0, 0, width, height);

  const scale = Math.min(
    width / image.naturalWidth,
    height / image.naturalHeight
  );

  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;

  const x = (width - drawWidth) / 2;
  const y = (height - drawHeight) / 2;

  ctx.save();
  ctx.filter = blur > 0 ? `blur(${blur}px)` : "none";
  ctx.drawImage(image, x, y, drawWidth, drawHeight);
  ctx.restore();
}

function easeInOutCubic(t) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function drawReveal(ctx, image, width, height, progress) {
  const eased = easeInOutCubic(progress);
  const blur = INITIAL_BLUR * (1 - eased);

  drawPhoto(ctx, image, width, height, blur);

  const sweepWidth = Math.max(width * 0.22, 90);
  const diagonal = height * 0.18;
  const edge = -sweepWidth - diagonal +
    (width + 2 * sweepWidth + 2 * diagonal) * eased;

  ctx.save();

  ctx.beginPath();
  ctx.moveTo(edge - sweepWidth, 0);
  ctx.lineTo(edge + sweepWidth, 0);
  ctx.lineTo(edge + sweepWidth - diagonal, height);
  ctx.lineTo(edge - sweepWidth - diagonal, height);
  ctx.closePath();
  ctx.clip();

  drawPhoto(ctx, image, width, height, 0);

  const gradient = ctx.createLinearGradient(
    edge - sweepWidth,
    0,
    edge + sweepWidth,
    0
  );

  gradient.addColorStop(0, "rgba(255,255,255,0)");
  gradient.addColorStop(0.35, "rgba(255,255,255,0.08)");
  gradient.addColorStop(0.5, "rgba(255,255,255,0.42)");
  gradient.addColorStop(0.65, "rgba(255,255,255,0.08)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(edge - sweepWidth, 0, sweepWidth * 2, height);

  ctx.restore();
}

function nextFrame() {
  return new Promise(resolve => requestAnimationFrame(resolve));
}

async function waitForCanvasSize(canvas) {
  while (canvas.clientWidth === 0 || canvas.clientHeight === 0) {
    await nextFrame();
  }
}

function showPhotoError(config, error) {
  console.error(error);

  const placeholder = document.getElementById(
    config.placeholderId
  );

  if (placeholder) {
    placeholder.classList.remove("is-hidden");
    placeholder.innerHTML = `
      <span>♡</span>
      <p>Photo unavailable</p>
    `;
  }
}

async function playPhoto(config) {
  const canvas = document.getElementById(config.canvasId);
  const placeholder = document.getElementById(config.placeholderId);

  if (!canvas) return;

  const runId = Symbol("photo-run");
  animationRuns.set(config.canvasId, runId);

  try {
    const image = await loadImage(config.src);

    if (animationRuns.get(config.canvasId) !== runId) return;

    await waitForCanvasSize(canvas);

    if (animationRuns.get(config.canvasId) !== runId) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Canvas tidak bisa digunakan.");
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const width = rect.width;
    const height = rect.height;

    drawPhoto(ctx, image, width, height, INITIAL_BLUR);

    if (placeholder) {
      placeholder.classList.add("is-hidden");
    }

    canvas.classList.add("is-ready");

    await new Promise(resolve =>
      setTimeout(resolve, PHOTO_START_DELAY)
    );

    if (animationRuns.get(config.canvasId) !== runId) return;

    const startTime = performance.now();

    await new Promise(resolve => {
      function animate(now) {
        if (animationRuns.get(config.canvasId) !== runId) {
          resolve();
          return;
        }

        const progress = Math.min(
          (now - startTime) / PHOTO_DURATION,
          1
        );

        drawReveal(ctx, image, width, height, progress);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          drawPhoto(ctx, image, width, height, 0);
          resolve();
        }
      }

      requestAnimationFrame(animate);
    });
  } catch (error) {
    showPhotoError(config, error);
  }
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element && value != null) {
    element.textContent = value;
  }
}

function setParagraphs(id, paragraphs) {
  const element = document.getElementById(id);
  if (!element || !Array.isArray(paragraphs)) return;

  element.replaceChildren();

  paragraphs.forEach(text => {
    const p = document.createElement("p");
    p.textContent = text;
    element.appendChild(p);
  });
}

function populateContent() {
  const content = window.SITE_CONTENT;

  if (!content) {
    console.error("SITE_CONTENT tidak ditemukan. Periksa content.js.");
    return;
  }

  (content.chapters || []).forEach((chapter, index) => {
    const number = index + 1;

    setText(`chapter${number}Label`, chapter.label);
    setText(`chapter${number}Title`, chapter.title);
    setText(`chapter${number}Intro`, chapter.intro);
    setParagraphs(`chapter${number}Poem`, chapter.poem);
  });

  if (content.ending) {
    setText("endingEyebrow", content.ending.eyebrow);
    setText("endingTitle", content.ending.title);
    setParagraphs("endingText", content.ending.paragraphs);
    setText("endingSignature", content.ending.signature);
  }
}

function setupReveal() {
  const elements = document.querySelectorAll(
    ".chapter-copy, .chapter-photo, .ending > *"
  );

  if (!("IntersectionObserver" in window)) {
    elements.forEach(element => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12
  });

  elements.forEach(element => observer.observe(element));
}

function initialisePhotos() {
  if (!("IntersectionObserver" in window)) {
    PHOTO_CONFIG.forEach(config => playPhoto(config));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        playPhoto(entry.target.photoConfig);
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });

  PHOTO_CONFIG.forEach(config => {
    const canvas = document.getElementById(config.canvasId);

    if (canvas) {
      canvas.photoConfig = config;
      observer.observe(canvas);
    }
  });
}

function startWebsite() {
  populateContent();
  setupReveal();
  initialisePhotos();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startWebsite, {
    once: true
  });
} else {
  startWebsite();
}