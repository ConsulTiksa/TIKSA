const yearSpan = document.getElementById("year");
const header = document.querySelector(".site-header");
const brandLink = document.querySelector(".brand");
const ACTIVITY_TIMEOUT = 3000;
let inactivityTimer;

// Año en el footer
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Click en logo -> volver arriba
if (brandLink) {
  brandLink.addEventListener("click", (e) => {
    e.preventDefault();
    if (header) header.classList.remove("header-hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* -------- HEADER: compacto + oculto por inactividad -------- */

function updateHeaderCondensed() {
  if (!header) return;
  if (window.scrollY > 120) {
    header.classList.add("condensed");
  } else {
    header.classList.remove("condensed");
    header.classList.remove("header-hidden");
  }
}

function showHeaderAndResetTimer() {
  if (!header) return;
  header.classList.remove("header-hidden");
  clearTimeout(inactivityTimer);

  if (window.scrollY > 120) {
    inactivityTimer = setTimeout(() => {
      header.classList.add("header-hidden");
    }, ACTIVITY_TIMEOUT);
  }
}

window.addEventListener("scroll", () => {
  updateHeaderCondensed();
  showHeaderAndResetTimer();
});

["mousemove", "touchstart", "keydown"].forEach((eventName) => {
  window.addEventListener(
    eventName,
    () => {
      showHeaderAndResetTimer();
    },
    { passive: true }
  );
});

updateHeaderCondensed();
showHeaderAndResetTimer();

/* -------- REVELAR SECCIONES -------- */

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealElements.forEach((el) => observer.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add("visible"));
}

/* -------- PROCESO INTERACTIVO (solo en index) -------- */

const processDetail = document.getElementById("process-detail");
const processSteps = document.querySelectorAll(".process-step");

const stepsData = {
  1: {
    title: "1. Asesoría y requerimientos",
    text:
      "Nos cuentas qué necesitas, para qué lo quieres usar y qué imagen deseas proyectar. " +
      "Con esa información te proponemos materiales, formatos y cantidades que realmente " +
      "hacen sentido para tu presupuesto y tus objetivos.",
  },
  2: {
    title: "2. Diseño y revisión",
    text:
      "Trabajamos con tus archivos o te apoyamos a ajustarlos para impresión y producción óptimas. " +
      "Revisamos medidas, colores, márgenes y resoluciones para evitar sorpresas en el material final.",
  },
  3: {
    title: "3. Producción y control de calidad",
    text:
      "Una vez aprobados los artes, pasamos a impresión, armado y/o estampado. " +
      "Verificamos acabados, colores y terminados para asegurarnos de que el resultado esté a la altura de tu marca.",
  },
  4: {
    title: "4. Entrega",
    text:
      "Coordinamos contigo fechas y formas de entrega para que recibas el material en tiempo y forma. " +
      "Si lo necesitas, te apoyamos a planear futuras reposiciones o variaciones del mismo proyecto.",
  },
};

function setActiveStep(step) {
  if (!processDetail) return;
  const data = stepsData[step];
  if (!data) return;

  processDetail.innerHTML = `
    <h3>${data.title}</h3>
    <p>${data.text}</p>
  `;

  processSteps.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.step === String(step));
  });
}

processSteps.forEach((btn) => {
  btn.addEventListener("click", () => {
    const step = btn.dataset.step;
    setActiveStep(step);
  });
});

/* -------- MODAL AVISO DE PRIVACIDAD -------- */

const privacyModal = document.getElementById("privacy-modal");
const privacyOpen = document.getElementById("privacy-open");
const privacyClose = document.getElementById("privacy-close");
const privacyBackdrop = document.getElementById("privacy-backdrop");

function openPrivacy() {
  if (!privacyModal) return;
  privacyModal.classList.add("open");
}

function closePrivacy() {
  if (!privacyModal) return;
  privacyModal.classList.remove("open");
}

if (privacyOpen) {
  privacyOpen.addEventListener("click", openPrivacy);
}
if (privacyClose) {
  privacyClose.addEventListener("click", closePrivacy);
}
if (privacyBackdrop) {
  privacyBackdrop.addEventListener("click", closePrivacy);
}
