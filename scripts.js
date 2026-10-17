// ===== Configuration =====

const CONFIG = {
  audioVolumes: {
    hover: 0.15,
    background: 0.1,
  },
  sections: ["works", "about", "contact", "help"],
  loadingMessageCount: 5,
  loadingMessageInterval: 2000,
  loadingScreenDelay: 300,
  loadingScreenTimeout: 8000,
  transitionDelay: 500,
};

// ===== DOM Elements =====

const DOM = {
  hoverSound: new Audio("media/hover.wav"),
  bgMusic: document.getElementById("bgMusic"),
  home: document.getElementById("home"),
  parallaxBg: document.getElementById("parallax-bg"),
  loadingScreen: document.getElementById("loadingScreen"),
  loadingText: document.getElementById("loadingText"),
  worksContainer: document.getElementById("works-container"),
  codeModal: document.getElementById("codeModal"),
  codeModalTitle: document.getElementById("codeModalTitle"),
  codeModalBody: document.getElementById("codeModalBody"),
  projectModal: document.getElementById("projectModal"),
  projectModalTitle: document.getElementById("projectModalTitle"),
  projectModalBody: document.getElementById("projectModalBody"),
  lightbox: document.getElementById("lightbox"),
  helpContent: document.getElementById("helpContent"),
  searchInput: document.getElementById("workSearch"),
  filters: document.getElementById("workFilters"),
};

const t = (key, vars) => Lang.t(key, vars);
const pick = (value) => Lang.pick(value);

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

// ===== Audio Functions =====

function initializeAudio() {
  DOM.hoverSound.volume = CONFIG.audioVolumes.hover;
  DOM.bgMusic.volume = CONFIG.audioVolumes.background;
  DOM.bgMusic.muted = false;
  window.addEventListener("load", handleAudioPlay);
}

function handleAudioPlay() {
  const playPromise = DOM.bgMusic.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      document.body.addEventListener("click", () => DOM.bgMusic.play().catch(() => {}), { once: true });
    });
  }
}

function toggleMute() {
  DOM.bgMusic.muted = !DOM.bgMusic.muted;
  const musicToggle = document.getElementById("musicToggle");
  if (musicToggle) musicToggle.checked = !DOM.bgMusic.muted;
  saveSettings();
}

function playHover() {
  DOM.hoverSound.currentTime = 0;
  DOM.hoverSound.play().catch(() => {});
}

function setupHoverableSounds() {
  document.addEventListener("mouseover", (e) => {
    const el = e.target.closest(".menu-button, .back-button, .code-icon, #helpToggle, .filter-chip, .lang-option");
    if (el && !el.contains(e.relatedTarget)) playHover();
  });
}

// ===== Navigation Functions =====

function navigateTo(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  CONFIG.sections.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.style.display = "none";
      el.classList.remove("fade-in");
    }
  });

  if (sectionId === "home") {
    DOM.home.style.display = "block";
    DOM.home.classList.remove("fade-out");
    DOM.home.classList.add("fade-in");
  } else {
    DOM.home.classList.add("fade-out");
    setTimeout(() => {
      DOM.home.style.display = "none";
      section.style.display = "block";
      section.classList.add("fade-in");
    }, CONFIG.transitionDelay);
  }
}

function goBack() {
  navigateTo("home");
}

// ===== Projects data =====
// Each project in data/works.json is either:
//   type "web":      html_code / css_code / js_code (live preview + code), optional links.live
//   type "software": platforms, gallery [{src, caption}], features [{title, text}], links {repo, download, live}
// Text fields can be a plain string or {"en": "...", "pt": "..."}. technologies is never translated.

let works = [];
let activeFilter = "all";

function projectType(work) {
  if (work.type === "software" || work.type === "web") return work.type;
  return work.html_code || work.css_code || work.js_code ? "web" : "software";
}

function hasCode(work) {
  return ["html", "css", "js"].some((k) => (work[`${k}_code`] || "").trim() !== "");
}

function fetchAndDisplayWorks() {
  fetch("data/works.json", { cache: "no-cache" })
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((data) => {
      if (!Array.isArray(data)) throw new Error("works.json must be a list");
      works = data;
      renderWorks();
    })
    .catch((error) => {
      console.error(error);
      showCyberpunkError(`${t("works.loadFailed")}: ${error.message}`, DOM.worksContainer, t("works.retry"));
    });
}

function renderWorks() {
  if (!DOM.worksContainer) return;
  DOM.worksContainer.innerHTML = "";

  if (works.length === 0) {
    DOM.worksContainer.innerHTML = `<div class="cyberpunk-card no-results"><p class="text-purple-300">${t("works.none")}</p></div>`;
    return;
  }

  works.forEach((work, index) => {
    const card = createWorkCard(work);
    card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.08}s`;
    card.style.opacity = "0";
    DOM.worksContainer.appendChild(card);
  });
  applyFilters();
}

function createWorkCard(work) {
  const type = projectType(work);
  const card = document.createElement("div");
  card.className = `cyberpunk-card work-${type}`;
  card.dataset.type = type;

  const links = work.links || {};
  const platforms = Array.isArray(work.platforms) ? work.platforms : [];
  const buttons = [];
  if (type === "web" && hasCode(work)) {
    buttons.push(`<button class="code-icon" data-action="preview" data-id="${escapeHtml(work.id)}" title="${t("works.preview")}" aria-label="${t("works.preview")}"><i class="bi bi-eye-fill"></i></button>`);
    buttons.push(`<button class="code-icon" data-action="code" data-id="${escapeHtml(work.id)}" title="${t("works.code")}" aria-label="${t("works.code")}"><i class="bi bi-code-slash"></i></button>`);
  }
  if (type === "software") {
    buttons.push(`<button class="code-icon code-icon--wide" data-action="details" data-id="${escapeHtml(work.id)}" title="${t("works.details")}"><i class="bi bi-window-stack"></i><span>${t("works.details")}</span></button>`);
  }
  if (links.live) buttons.push(`<a class="code-icon" href="${escapeHtml(links.live)}" target="_blank" rel="noopener" title="${t("works.live")}" aria-label="${t("works.live")}"><i class="bi bi-box-arrow-up-right"></i></a>`);
  if (links.repo) buttons.push(`<a class="code-icon" href="${escapeHtml(links.repo)}" target="_blank" rel="noopener" title="${t("works.repo")}" aria-label="${t("works.repo")}"><i class="bi bi-github"></i></a>`);
  if (links.download) buttons.push(`<a class="code-icon" href="${escapeHtml(links.download)}" target="_blank" rel="noopener" title="${t("works.download")}" aria-label="${t("works.download")}"><i class="bi bi-download"></i></a>`);

  const kind =
    type === "software"
      ? `<i class="bi bi-window-stack"></i> ${t("works.software")}${platforms.length ? " · " + platforms.map(escapeHtml).join(" · ") : ""}`
      : `<i class="bi bi-globe2"></i> ${t("works.web")}`;

  card.innerHTML = `
    <div class="work-media">
      <img src="${escapeHtml(work.image_url)}" alt="${escapeHtml(pick(work.title))}" class="work-image" loading="lazy">
      <span class="work-kind work-kind--${type}">${kind}</span>
    </div>
    <h3>${escapeHtml(pick(work.title))}</h3>
    <p class="date">${formatDate(work.date)}</p>
    <p class="description">${escapeHtml(pick(work.description))}</p>
    <div class="tech-tags">
      ${String(work.technologies || "")
        .split(",")
        .map((tech) => tech.trim())
        .filter(Boolean)
        .map((tech) => `<span class="tech-tag">${escapeHtml(tech)}</span>`)
        .join("")}
    </div>
    <div class="controls"><div class="code-preview-icons">${buttons.join("")}</div></div>
  `;

  card.addEventListener("mouseenter", function () {
    this.classList.add("glitch-hover");
    playHover();
  });
  card.addEventListener("mouseleave", function () {
    this.classList.remove("glitch-hover");
  });
  return card;
}

function formatDate(value) {
  const d = new Date(value);
  if (!value || isNaN(d)) return escapeHtml(value || "");
  return d.toLocaleDateString(Lang.current === "pt" ? "pt-PT" : "en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// ===== Search and filters =====

function applyFilters() {
  const term = (DOM.searchInput?.value || "").trim().toLowerCase();
  const cards = DOM.worksContainer.querySelectorAll(".cyberpunk-card:not(.no-results)");
  let visible = 0;

  cards.forEach((card) => {
    const text = card.textContent.toLowerCase();
    const show = (activeFilter === "all" || card.dataset.type === activeFilter) && (term === "" || text.includes(term));
    card.style.display = show ? "flex" : "none";
    if (show) visible++;
  });

  DOM.worksContainer.querySelectorAll(".no-results").forEach((el) => el.remove());
  if (visible === 0 && cards.length > 0) {
    const empty = document.createElement("div");
    empty.className = "cyberpunk-card no-results";
    empty.innerHTML = `<p class="text-purple-300">${t("works.noMatch")}</p><p class="text-purple-400 text-sm">${t("works.tryAgain")}</p>`;
    DOM.worksContainer.appendChild(empty);
  }
}

function setupSearch() {
  DOM.searchInput?.addEventListener("input", applyFilters);
  DOM.filters?.addEventListener("click", (e) => {
    const chip = e.target.closest(".filter-chip");
    if (!chip) return;
    activeFilter = chip.dataset.filter;
    DOM.filters.querySelectorAll(".filter-chip").forEach((c) => {
      c.classList.toggle("active", c === chip);
      c.setAttribute("aria-pressed", c === chip);
    });
    applyFilters();
  });
}

// ===== Code modal (web projects) =====

function findWork(id) {
  return works.find((w) => String(w.id) === String(id));
}

function openCodeModal(workId, codeType) {
  const work = findWork(workId);
  if (!work) return;
  const tabs = ["html", "css", "js"].filter((k) => (work[`${k}_code`] || "").trim() !== "");
  if (tabs.length === 0) return;
  const current = tabs.includes(codeType) ? codeType : tabs[0];

  DOM.codeModalTitle.textContent = `${pick(work.title)} · ${t("modal.code")}`;
  // No whitespace between the tags: the code area keeps white-space: pre
  DOM.codeModalBody.innerHTML =
    `<div class="code-tabs">${tabs
      .map((k) => `<button type="button" class="code-tab ${k === current ? "active" : ""}" data-tab="${k}" data-id="${escapeHtml(work.id)}">${k.toUpperCase()}</button>`)
      .join("")}</div>` + `<pre class="code-block"></pre>`;
  DOM.codeModalBody.querySelector(".code-block").textContent = work[`${current}_code`];
  DOM.codeModal.classList.add("active");
}

function openPreview(workId) {
  window.open(`preview.html?id=${encodeURIComponent(workId)}`, "_blank", "width=1024,height=768");
}

function closeCodeModal() {
  DOM.codeModal.classList.remove("active");
}

// ===== Details modal (software projects) =====

function openProjectModal(workId) {
  const work = findWork(workId);
  if (!work) return;
  const links = work.links || {};
  const gallery = Array.isArray(work.gallery) && work.gallery.length ? work.gallery : [{ src: work.image_url, caption: work.title }];
  const features = Array.isArray(work.features) ? work.features : [];
  const platforms = Array.isArray(work.platforms) ? work.platforms : [];

  DOM.projectModalTitle.textContent = pick(work.title);
  DOM.projectModalBody.innerHTML = `
    ${work.tagline ? `<p class="project-tagline">${escapeHtml(pick(work.tagline))}</p>` : ""}
    <div class="project-meta">
      ${platforms.map((p) => `<span class="work-kind work-kind--software">${escapeHtml(p)}</span>`).join("")}
      ${String(work.technologies || "").split(",").map((x) => x.trim()).filter(Boolean).map((x) => `<span class="tech-tag">${escapeHtml(x)}</span>`).join("")}
    </div>
    <p class="project-description">${escapeHtml(pick(work.description))}</p>
    <div class="project-links">
      ${links.download ? `<a class="menu-button project-link" href="${escapeHtml(links.download)}" target="_blank" rel="noopener"><i class="bi bi-download"></i> ${t("works.download")}</a>` : ""}
      ${links.repo ? `<a class="menu-button project-link" href="${escapeHtml(links.repo)}" target="_blank" rel="noopener"><i class="bi bi-github"></i> ${t("works.repo")}</a>` : ""}
      ${links.live ? `<a class="menu-button project-link" href="${escapeHtml(links.live)}" target="_blank" rel="noopener"><i class="bi bi-box-arrow-up-right"></i> ${t("works.live")}</a>` : ""}
    </div>
    <h4 class="project-heading">${t("works.screenshots")}</h4>
    <div class="project-gallery">
      ${gallery
        .map(
          (g) => `<figure class="project-shot" tabindex="0">
            <img src="${escapeHtml(g.src)}" alt="${escapeHtml(pick(g.caption))}" loading="lazy">
            ${g.caption ? `<figcaption>${escapeHtml(pick(g.caption))}</figcaption>` : ""}
          </figure>`
        )
        .join("")}
    </div>
    ${
      features.length
        ? `<h4 class="project-heading">${t("works.features")}</h4>
           <div class="project-features">${features
             .map((f) => `<div class="project-feature"><h5>${escapeHtml(pick(f.title))}</h5><p>${escapeHtml(pick(f.text))}</p></div>`)
             .join("")}</div>`
        : ""
    }
    <p class="project-footnote">${t("works.enlarge")}</p>`;
  DOM.projectModal.dataset.id = work.id;
  DOM.projectModal.classList.add("active");
}

function closeProjectModal() {
  DOM.projectModal.classList.remove("active");
  delete DOM.projectModal.dataset.id;
}

function openLightbox(src, caption) {
  DOM.lightbox.querySelector("img").src = src;
  DOM.lightbox.querySelector("img").alt = caption || "";
  DOM.lightbox.querySelector(".lightbox-caption").textContent = caption || "";
  DOM.lightbox.classList.add("open");
  DOM.lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  DOM.lightbox.classList.remove("open");
  DOM.lightbox.setAttribute("aria-hidden", "true");
}

// ===== Loading screen =====

function setupLoadingScreen() {
  let messageIndex = 0;
  const messageInterval = setInterval(() => {
    messageIndex = (messageIndex + 1) % CONFIG.loadingMessageCount;
    DOM.loadingText.textContent = t(`loading.${messageIndex}`);
  }, CONFIG.loadingMessageInterval);

  const hide = () => {
    clearInterval(messageInterval);
    DOM.loadingScreen.classList.add("hide-loading");
  };
  window.addEventListener("load", () => setTimeout(hide, CONFIG.loadingScreenDelay));
  setTimeout(hide, CONFIG.loadingScreenTimeout);
}

// ===== Keyboard =====

function setupKeyboardNavigation() {
  document.addEventListener("keydown", function (event) {
    const typing = event.target.closest("input, textarea, select, [contenteditable]");

    if (event.key === "Escape") {
      if (DOM.lightbox.classList.contains("open")) return closeLightbox();
      closeCodeModal();
      closeProjectModal();
      DOM.helpContent?.classList.remove("active");
    }

    if (event.altKey) {
      if (event.key === "1") navigateTo("home");
      if (event.key === "2") navigateTo("works");
      if (event.key === "3") navigateTo("about");
      if (event.key === "4") navigateTo("contact");
      if (event.key === "h" || event.key === "H") toggleHelpMenu();
      return;
    }

    if (typing || event.ctrlKey || event.metaKey) return;
    if (event.key === "m" || event.key === "M") toggleMute();
    if (event.key === "l" || event.key === "L") Lang.toggle();
  });

  document.addEventListener("keydown", (event) => {
    const fig = event.target.closest?.(".project-shot");
    if (fig && event.key === "Enter") fig.click();
  });
}

// ===== Help =====

function setupHelpMenu() {
  const helpToggle = document.getElementById("helpToggle");
  const helpContent = DOM.helpContent;
  const helpClose = document.getElementById("helpClose");
  if (!helpToggle || !helpContent) return;

  helpToggle.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    helpContent.classList.toggle("active");
  });
  helpClose?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    helpContent.classList.remove("active");
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".help-hover-menu")) helpContent.classList.remove("active");
  });
  helpContent.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (link) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    }
    e.stopPropagation();
  });
}

function toggleHelpMenu() {
  DOM.helpContent?.classList.toggle("active");
}

function setupTooltips() {
  document.querySelectorAll(".menu-button").forEach((el) => el.setAttribute("title", t("tip.menu")));
}

function showCyberpunkError(message, container, action = null) {
  const errorElement = document.createElement("div");
  errorElement.className = "cyberpunk-error";
  errorElement.innerHTML = `
    <div class="error-icon"><i class="bi bi-exclamation-triangle"></i></div>
    <div class="error-content">
      <p class="error-title">${t("error.title")}</p>
      <p class="error-message">${escapeHtml(message)}</p>
      ${action ? `<button class="error-action">${escapeHtml(action)}</button>` : ""}
    </div>`;
  const target = typeof container === "string" ? document.getElementById(container) : container;
  target.innerHTML = "";
  target.appendChild(errorElement);
  errorElement.querySelector(".error-action")?.addEventListener("click", () => location.reload());
  setTimeout(() => errorElement.classList.add("glitch-active"), 100);
}

// ===== Event Listeners =====

function setupEventListeners() {
  DOM.codeModal?.addEventListener("click", (e) => {
    if (e.target === DOM.codeModal) closeCodeModal();
  });
  DOM.projectModal?.addEventListener("click", (e) => {
    if (e.target === DOM.projectModal) closeProjectModal();
  });
  DOM.lightbox?.addEventListener("click", closeLightbox);

  document.addEventListener("click", (e) => {
    const tab = e.target.closest(".code-tab");
    if (tab) return openCodeModal(tab.dataset.id, tab.dataset.tab);

    const shot = e.target.closest(".project-shot");
    if (shot) {
      const img = shot.querySelector("img");
      return openLightbox(img.src, img.alt);
    }

    const button = e.target.closest("button.code-icon");
    if (!button) return;
    const action = button.dataset.action;
    const id = button.dataset.id;
    if (action === "preview") openPreview(id);
    else if (action === "code") openCodeModal(id);
    else if (action === "details") openProjectModal(id);
  });

  // Everything that is built from JavaScript is rebuilt when the language changes
  Lang.onChange(() => {
    renderWorks();
    setupTooltips();
    updateAge();
    if (DOM.projectModal.dataset.id) openProjectModal(DOM.projectModal.dataset.id);
    if (DOM.codeModal.classList.contains("active")) {
      const active = DOM.codeModalBody.querySelector(".code-tab.active");
      if (active) openCodeModal(active.dataset.id, active.dataset.tab);
    }
  });
}

// ===== Initialization =====

function init() {
  initializeAudio();
  setupLoadingScreen();
  setupEventListeners();
  setupHoverableSounds();
  setupKeyboardNavigation();
  setupSearch();
  setupHelpMenu();
  setupTooltips();
  setupSettingsMenu();
  updateAge();
  fetchAndDisplayWorks();
}

document.addEventListener("DOMContentLoaded", init);

// ===== Settings Menu Functions =====

function setupSettingsMenu() {
  const settingsToggle = document.getElementById("settingsToggle");
  const settingsPanel = document.getElementById("settingsPanel");
  const settingsClose = document.getElementById("settingsClose");

  const musicVolumeSlider = document.getElementById("musicVolume");
  const hoverVolumeSlider = document.getElementById("hoverVolume");
  const musicToggle = document.getElementById("musicToggle");
  const flickerToggle = document.getElementById("flickerToggle");
  const parallaxToggle = document.getElementById("parallaxToggle");

  if (settingsToggle && settingsPanel) {
    settingsToggle.addEventListener("click", function () {
      settingsPanel.classList.toggle("active");
    });
  }

  if (settingsClose && settingsPanel) {
    settingsClose.addEventListener("click", function () {
      settingsPanel.classList.remove("active");
    });
  }

  document.addEventListener("click", function (e) {
    if (
      settingsPanel &&
      !e.target.closest("#settingsPanel") &&
      !e.target.closest("#settingsToggle")
    ) {
      settingsPanel.classList.remove("active");
    }
  });

  if (musicVolumeSlider) {
    musicVolumeSlider.value = DOM.bgMusic.volume;
    musicVolumeSlider.addEventListener("input", function () {
      DOM.bgMusic.volume = this.value;
      saveSettings();
    });
  }

  if (hoverVolumeSlider) {
    hoverVolumeSlider.value = DOM.hoverSound.volume;
    hoverVolumeSlider.addEventListener("input", function () {
      DOM.hoverSound.volume = this.value;
      saveSettings();
    });
  }

  if (musicToggle) {
    musicToggle.checked = !DOM.bgMusic.muted;
    musicToggle.addEventListener("change", function () {
      DOM.bgMusic.muted = !this.checked;
      saveSettings();
    });
  }

  if (flickerToggle) {
    flickerToggle.checked = localStorage.getItem("flickerEffect") !== "false";
    flickerToggle.addEventListener("change", function () {
      document.body.classList.toggle("no-flicker", !this.checked);
      localStorage.setItem("flickerEffect", this.checked);
      saveSettings();
    });

    document.body.classList.toggle("no-flicker", !flickerToggle.checked);
  }

  if (parallaxToggle) {
    parallaxToggle.checked = localStorage.getItem("parallaxEffect") !== "false";
    parallaxToggle.addEventListener("change", function () {
      DOM.parallaxBg.classList.toggle("no-parallax", !this.checked);
      localStorage.setItem("parallaxEffect", this.checked);
      saveSettings();
    });

    DOM.parallaxBg.classList.toggle("no-parallax", !parallaxToggle.checked);
  }

  loadSettings();
}

function saveSettings() {
  const settings = {
    musicVolume: DOM.bgMusic.volume,
    hoverVolume: DOM.hoverSound.volume,
    musicMuted: DOM.bgMusic.muted,
    flickerEffect: localStorage.getItem("flickerEffect") !== "false",
    parallaxEffect: localStorage.getItem("parallaxEffect") !== "false",
    glitchEffect: localStorage.getItem("glitchEffect") !== "false",
  };

  localStorage.setItem("portfolioSettings", JSON.stringify(settings));
}

function loadSettings() {
  const savedSettings = localStorage.getItem("portfolioSettings");

  if (savedSettings) {
    const settings = JSON.parse(savedSettings);

    DOM.bgMusic.volume = settings.musicVolume || 0.1;
    DOM.hoverSound.volume = settings.hoverVolume || 0.15;
    DOM.bgMusic.muted = settings.musicMuted || false;

    document.body.classList.toggle("no-flicker", !settings.flickerEffect);
    DOM.parallaxBg.classList.toggle("no-parallax", !settings.parallaxEffect);
    document.body.classList.toggle("no-glitch", !settings.glitchEffect);

    document.getElementById("musicVolume").value = DOM.bgMusic.volume;
    document.getElementById("hoverVolume").value = DOM.hoverSound.volume;
    document.getElementById("musicToggle").checked = !DOM.bgMusic.muted;
    document.getElementById("flickerToggle").checked = settings.flickerEffect;
    document.getElementById("parallaxToggle").checked = settings.parallaxEffect;
  }
}

function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

function updateAge() {
  const age = calculateAge("2002-01-24");
  const bio = document.querySelector('[data-i18n-html="about.bio"]');
  if (bio) {
    bio.dataset.i18nVars = JSON.stringify({ age });
    bio.innerHTML = Lang.t("about.bio", { age });
  }
}
