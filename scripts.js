// ===== Configuration =====

const CONFIG = {
  audioVolumes: {
    hover: 0.15,
    background: 0.1,
  },

  sections: ["works", "about", "contact", "help"],

  loadingMessages: [
    "Loading assets",
    "Initializing system",
    "Connecting to network",
    "Preparing interface",
    "Almost ready",
  ],
  loadingMessageInterval: 2000,
  loadingScreenDelay: 1000,
  loadingScreenTimeout: 8000,
  transitionDelay: 500,
};

// ===== DOM Elements =====

const DOM = {
  hoverSound: new Audio("media/hover.wav"),
  bgMusic: document.getElementById("bgMusic"),
  musicIcon: document.getElementById("musicIcon"),
  home: document.getElementById("home"),
  works: document.getElementById("works"),
  about: document.getElementById("about"),
  contact: document.getElementById("contact"),
  help: document.getElementById("help"),
  parallaxBg: document.getElementById("parallax-bg"),
  loadingScreen: document.getElementById("loadingScreen"),
  loadingText: document.getElementById("loadingText"),
  worksContainer: document.getElementById("works-container"),
  codeModal: document.getElementById("codeModal"),
  codeModalTitle: document.getElementById("codeModalTitle"),
  codeModalBody: document.getElementById("codeModalBody"),
  helpToggle: document.getElementById("helpToggle"),
  helpContent: document.querySelector(".help-content"),
  helpClose: document.querySelector(".help-close"),
  searchInput: document.getElementById("workSearch"),
};

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
      console.log("Autoplay prevented. Will play on user interaction.");
      document.body.addEventListener(
        "click",
        () => {
          DOM.bgMusic.play().catch((err) => console.error("Play failed:", err));
        },
        { once: true }
      );
    });
  }
}

function toggleMute() {
  DOM.bgMusic.muted = !DOM.bgMusic.muted;
  const musicToggle = document.getElementById("musicToggle");
  if (musicToggle) {
    musicToggle.checked = !DOM.bgMusic.muted;
  }
}

function setupHoverableSounds() {
  const hoverableSelectors =
    ".menu-button, .back-button, .code-icon, #helpToggle";
  const hoverables = document.querySelectorAll(hoverableSelectors);

  hoverables.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      DOM.hoverSound.currentTime = 0;
      DOM.hoverSound.play().catch(() => {});
    });
  });
}

// ===== Visual Effects =====

function setupVisualEffects() {
  // The background and its mouse parallax are handled by background.js
}

// ===== Navigation Functions =====

function navigateTo(sectionId) {
  const section = document.getElementById(sectionId);

  if (!section) {
    console.error(`Section with id "${sectionId}" not found`);
    return;
  }
  CONFIG.sections.forEach((id) => {
    const sectionElement = document.getElementById(id);
    if (sectionElement) {
      sectionElement.style.display = "none";
      sectionElement.classList.remove("fade-in");
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

// ===== Code Preview Modal Functions =====
// Static version: code comes from data/works.json instead of code_preview.php
let worksCache = null;
function getWorks() {
  if (!worksCache) {
    worksCache = fetch("data/works.json", { cache: "no-cache" }).then((r) => {
      if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
      return r.json();
    });
  }
  return worksCache;
}

function openCodeModal(workId, codeType) {
  getWorks()
    .then((works) => {
      const work = works.find((w) => String(w.id) === String(workId));
      if (!work) throw new Error("Work not found");
      DOM.codeModalTitle.textContent = `${work.title} - ${codeType.toUpperCase()}`;
      DOM.codeModalBody.textContent = work[`${codeType}_code`] || "No code available";
      DOM.codeModal.classList.add("active");
    })
    .catch((error) => {
      console.error("Error loading code:", error);
    });
}

function openPreview(workId) {
  window.open(`preview.html?id=${workId}`, "_blank", "width=1024,height=768");
}

function closeCodeModal() {
  DOM.codeModal.classList.remove("active");
}

// ===== Work Items Functions =====
function fetchAndDisplayWorks() {
  fetch("data/works.json", { cache: "no-cache" })
    .then((response) => {
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then((works) => {
      renderWorks(works);
    })
    .catch((error) => {
      console.error("Error:", error);
      showCyberpunkError(
        `Failed to load works: ${error.message}`,
        DOM.worksContainer,
        "Retry"
      );
    });
}

function renderWorks(works) {
  if (!DOM.worksContainer) return;

  DOM.worksContainer.innerHTML = "";

  if (!Array.isArray(works)) {
    throw new Error("Expected array but got " + typeof works);
  }

  if (works.length === 0) {
    DOM.worksContainer.innerHTML = `
      <div class="cyberpunk-card">
        <p class="text-purple-300">No works found</p>
      </div>
    `;
    return;
  }

  works.forEach((work) => {
    const card = createWorkCard(work);
    DOM.worksContainer.appendChild(card);
  });

  document.querySelectorAll(".cyberpunk-card").forEach((card, index) => {
    card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
    card.style.opacity = "0";
  });
}

function createWorkCard(work) {
  const card = document.createElement("div");
  card.className = "cyberpunk-card";

  const hasHtml = work.html_code && work.html_code.trim() !== "";
  const hasCss = work.css_code && work.css_code.trim() !== "";
  const hasJs = work.js_code && work.js_code.trim() !== "";
  const hasAnyCode = hasHtml || hasCss || hasJs;

  card.innerHTML = `
    <img src="${work.image_url}" alt="${work.title}" class="work-image">
    <h3>${work.title}</h3>
    <p class="date">${work.date}</p>
    <p class="description">${work.description}</p>
    <div class="tech-tags">
      ${work.technologies
        .split(",")
        .map((tech) => `<span class="tech-tag">${tech.trim()}</span>`)
        .join("")}
    </div>
    <div class="controls">
      <div class="code-preview-icons">
        ${
          hasAnyCode
            ? `
          <button class="code-icon preview-icon" data-action="preview" data-id="${work.id}" title="Live Preview">
            <i class="bi bi-eye-fill"></i>
          </button>
        `
            : ""
        }
      </div>
    </div>
  `;

  card.addEventListener("mouseenter", function () {
    this.classList.add("glitch-hover");
    DOM.hoverSound.currentTime = 0;
    DOM.hoverSound.play().catch(() => {});
  });

  card.addEventListener("mouseleave", function () {
    this.classList.remove("glitch-hover");
  });

  return card;
}

function setupLoadingScreen() {
  let messageIndex = 0;

  const messageInterval = setInterval(() => {
    messageIndex = (messageIndex + 1) % CONFIG.loadingMessages.length;
    DOM.loadingText.textContent = CONFIG.loadingMessages[messageIndex];
  }, CONFIG.loadingMessageInterval);

  window.addEventListener("load", () => {
    setTimeout(() => {
      clearInterval(messageInterval);
      DOM.loadingScreen.classList.add("hide-loading");
    }, CONFIG.loadingScreenDelay);
  });

  setTimeout(() => {
    clearInterval(messageInterval);
    DOM.loadingScreen.classList.add("hide-loading");
  }, CONFIG.loadingScreenTimeout);
}

function setupSearch() {
  if (!DOM.searchInput || !DOM.worksContainer) return;

  DOM.searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    const workCards = DOM.worksContainer.querySelectorAll(
      ".cyberpunk-card:not(.no-results)"
    );

    workCards.forEach((card) => {
      const title = card.querySelector("h3")?.textContent.toLowerCase() || "";
      const description =
        card.querySelector(".description")?.textContent.toLowerCase() || "";
      const technologies =
        card.querySelector(".tech-tags")?.textContent.toLowerCase() || "";

      if (
        title.includes(searchTerm) ||
        description.includes(searchTerm) ||
        technologies.includes(searchTerm)
      ) {
        card.style.display = "flex";
        card.style.animation = "fadeIn 0.3s ease forwards";
      } else {
        card.style.display = "none";
      }
    });

    const visibleCards = Array.from(workCards).filter(
      (card) => card.style.display !== "none"
    );

    DOM.worksContainer
      .querySelectorAll(".no-results")
      .forEach((el) => el.remove());

    if (visibleCards.length === 0 && searchTerm !== "") {
      const noResults = document.createElement("div");
      noResults.className = "cyberpunk-card no-results";
      noResults.innerHTML = `
        <p class="text-purple-300">No matching projects found</p>
        <p class="text-purple-400 text-sm">Try a different search term</p>
      `;
      DOM.worksContainer.appendChild(noResults);
    }
  });
}

function setupKeyboardNavigation() {
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeCodeModal();
      DOM.helpContent?.classList.remove("active");
    }

    if (event.altKey) {
      if (event.key === "1") navigateTo("home");
      if (event.key === "2") navigateTo("works");
      if (event.key === "3") navigateTo("about");
      if (event.key === "4") navigateTo("contact");
      if (event.key === "h" || event.key === "H") toggleHelpMenu();
    }

    if (event.key === "m" || event.key === "M") {
      toggleMute();
    }
  });

  document
    .querySelectorAll(".menu-button, .back-button, .code-icon")
    .forEach((el) => {
      el.setAttribute("tabindex", "0");

      el.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          this.click();
        }
      });
    });
}


function setupHelpMenu() {
  const helpToggle = document.getElementById("helpToggle");
  const helpContent = document.getElementById("helpContent");
  const helpClose = document.getElementById("helpClose");

  if (!helpToggle || !helpContent) return;

  helpToggle.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    helpContent.classList.toggle("active");
  });

  if (helpClose) {
    helpClose.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      helpContent.classList.remove("active");
    });
  }

  document.addEventListener("click", function (e) {
    if (
      !e.target.closest(".help-hover-menu") &&
      helpContent.classList.contains("active")
    ) {
      helpContent.classList.remove("active");
    }
  });

  helpContent.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && helpContent.classList.contains("active")) {
      helpContent.classList.remove("active");
    }
  });

  const helpLinks = document.querySelectorAll(".help-content a");
  helpLinks.forEach((link) => {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });

  updateKeyboardShortcutsInHelp();
}

function toggleHelpMenu() {
  const helpContent = document.getElementById("helpContent");
  if (helpContent) {
    helpContent.classList.toggle("active");
  }
}

function updateKeyboardShortcutsInHelp() {
  document.querySelectorAll(".shortcut-grid").forEach((grid) => {
    const shortcuts = grid.querySelectorAll(".shortcut");
    shortcuts.forEach((shortcut) => {
      if (shortcut.innerHTML.includes("Alt+5")) {
        shortcut.innerHTML = '<span class="key">Alt+H</span> Toggle Help';
      }
    });
  });
}

function setupTooltips() {
  const tooltipItems = [
    { selector: '.code-icon[data-action="preview"]', text: "See live preview" },
    { selector: "#muteButton", text: "Toggle music (M)" },
    { selector: ".menu-button", text: "Navigate to section" },
    { selector: ".back-button", text: "Return to home" },
    { selector: ".admin-access-area a", text: "Admin access" },

  ];

  tooltipItems.forEach((item) => {
    document.querySelectorAll(item.selector).forEach((el) => {
      el.setAttribute("title", item.text);
      el.setAttribute("aria-label", item.text);
    });
  });
}

function showCyberpunkError(message, container, action = null) {
  const errorElement = document.createElement("div");
  errorElement.className = "cyberpunk-error";
  errorElement.innerHTML = `
    <div class="error-icon"><i class="bi bi-exclamation-triangle"></i></div>
    <div class="error-content">
      <p class="error-title">SYSTEM FAILURE</p>
      <p class="error-message">${message}</p>
      ${action ? `<button class="error-action">${action}</button>` : ""}
    </div>
  `;

  if (typeof container === "string") {
    document.getElementById(container).innerHTML = "";
    document.getElementById(container).appendChild(errorElement);
  } else {
    container.innerHTML = "";
    container.appendChild(errorElement);
  }

  if (action) {
    errorElement
      .querySelector(".error-action")
      .addEventListener("click", () => {
        location.reload();
      });
  }

  setTimeout(() => {
    errorElement.classList.add("glitch-active");
  }, 100);
}

// ===== Event Listeners Setup =====

function setupEventListeners() {
  DOM.codeModal?.addEventListener("click", function (e) {
    if (e.target === this) {
      closeCodeModal();
    }
  });

  document.addEventListener("click", function (e) {
    const button = e.target.closest(".code-icon");
    if (!button) return;

    const action = button.getAttribute("data-action");
    const workId = button.getAttribute("data-id");

    if (action === "preview") {
      openPreview(workId);
    } else if (["html", "css", "js"].includes(action)) {
      openCodeModal(workId, action);
    }
  });
}

// ===== Initialization =====

function init() {
  initializeAudio();
  setupVisualEffects();
  setupLoadingScreen();
  setupEventListeners();

  setupHoverableSounds();
  setupKeyboardNavigation();
  setupSearch();
  setupHelpMenu();
  setupTooltips();

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

function init() {
  initializeAudio();
  setupVisualEffects();
  setupLoadingScreen();
  setupEventListeners();

  setupHoverableSounds();
  setupKeyboardNavigation();
  setupSearch();
  setupHelpMenu();
  setupTooltips();
  setupSettingsMenu();

  const muteButton = document.getElementById("muteButton");
  if (muteButton) {
    muteButton.style.display = "none";
  }

  fetchAndDisplayWorks();

  function fetchAndDisplayWorks() {
    fetch("data/works.json", { cache: "no-cache" })
      .then((response) => {
        if (!response.ok) {
          console.error(`HTTP error! status: ${response.status}`);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((works) => {
        console.log("Works data received:", works);
        renderWorks(works);
      })
      .catch((error) => {
        console.error("Error details:", error);
        showCyberpunkError(
          `Failed to load works: ${error.message}`,
          DOM.worksContainer,
          "Retry"
        );
      });
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
  const birthDate = "2002-01-24";
  const currentAge = calculateAge(birthDate);

  const ageElement = document.getElementById("dynamic-age");
  if (ageElement) {
    ageElement.textContent = currentAge;
  }
}

document.addEventListener("DOMContentLoaded", updateAge);
