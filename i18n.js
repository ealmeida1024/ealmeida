// ===== Language (English / Portuguese) =====
// Elements opt in with data-i18n="key" (text), data-i18n-html="key" (markup)
// and data-i18n-attr="placeholder:key;title:key". The subtitle and the
// technology tags are intentionally left out: they stay the same in both languages.

const I18N = {
  en: {
    "loading.0": "Loading assets",
    "loading.1": "Initializing system",
    "loading.2": "Connecting to network",
    "loading.3": "Preparing interface",
    "loading.4": "Almost ready",
    "nav.projects": "Projects",
    "nav.about": "About",
    "nav.contact": "Contact",
    "settings.title": "SETTINGS",
    "settings.open": "Settings",
    "settings.close": "Close settings panel",
    "settings.audio": "Audio Settings",
    "settings.musicVolume": "Music Volume",
    "settings.hoverVolume": "Hover Volume",
    "settings.music": "Background Music",
    "settings.visual": "Visual Settings",
    "settings.flicker": "Text Flicker Effect",
    "settings.parallax": "Parallax Effect",
    "settings.language": "Language",
    "lang.switch": "Mudar para português",
    "works.title": "Projects",
    "works.search": "Search projects...",
    "works.loading": "Loading projects...",
    "works.none": "No projects found",
    "works.noMatch": "No matching projects found",
    "works.tryAgain": "Try a different search term",
    "works.all": "All",
    "works.web": "Web",
    "works.software": "Software",
    "works.preview": "Live preview",
    "works.code": "View code",
    "works.details": "Details",
    "works.repo": "Source code",
    "works.download": "Download",
    "works.live": "Open site",
    "works.screenshots": "Screenshots",
    "works.features": "What it does",
    "works.platforms": "Platforms",
    "works.noCode": "No code available",
    "works.loadFailed": "Failed to load projects",
    "works.retry": "Retry",
    "works.enlarge": "Click a screenshot to enlarge · Esc to close",
    "back": "Back",
    "about.title": "About Me",
    "about.photo": "Photo of Emanuel",
    "about.bio":
      "Hi, I'm Emanuel, a <span id=\"dynamic-age\">{age}</span>-year-old web designer with a strong passion for anime and gaming. I love creating visually appealing and user-friendly websites, often drawing inspiration from the styles and creativity found in the things I enjoy. Design, for me, is about blending aesthetics with functionality, and I'm always looking for new ways to make digital experiences more engaging and relatable.",
    "about.facts":
      "✨ Based in Lisbon <br />💻 Specialized in HTML, CSS, JS, Bootstrap &amp; Tailwind, and native apps in C# <br />🔐 Currently studying cybersecurity <br />🎨 Inspired by synthwave, cyberpunk, vapor aesthetics, and glitch art.",
    "contact.title": "Contact",
    "contact.text": "Let's connect — whether it's for collaboration, questions or anything else!",
    "help.open": "Help Information",
    "help.close": "Close help menu",
    "help.title": "HELP CENTER",
    "help.navQ": "Navigation Keys",
    "help.navA":
      'Use <span class="key">Alt+1</span> for Home, <span class="key">Alt+2</span> for Projects, <span class="key">Alt+3</span> for About, <span class="key">Alt+4</span> for Contact.',
    "help.audioQ": "Audio Controls",
    "help.audioA": 'Press <span class="key">M</span> to toggle background music or use the audio settings in the settings menu.',
    "help.previewQ": "Previewing Projects",
    "help.previewA":
      'Web projects have a live preview <i class="bi bi-eye-fill"></i> and their code <i class="bi bi-code-slash"></i>. Software projects open a details page <i class="bi bi-window-stack"></i> with screenshots and downloads.',
    "help.findQ": "Can't Find Something?",
    "help.findA": "Use the search and the Web / Software filters in the Projects section to find projects by name, description or technologies.",
    "help.moreQ": "Need More Help?",
    "help.moreA": 'Contact me directly via email at <a href="mailto:ealmeida24ar@outlook.com" class="text-purple-300 hover:text-white">ealmeida24ar@outlook.com</a>',
    "help.shortcuts": "Keyboard Shortcuts",
    "help.esc": "Close windows",
    "help.home": "Home",
    "help.toggleHelp": "Toggle Help",
    "help.music": "Toggle music",
    "help.language": "Switch language",
    "modal.code": "Code Preview",
    "modal.close": "Close",
    "tip.menu": "Navigate to section",
    "tip.back": "Return to home",
    "error.title": "SYSTEM FAILURE",
  },
  pt: {
    "loading.0": "A carregar recursos",
    "loading.1": "A iniciar o sistema",
    "loading.2": "A ligar à rede",
    "loading.3": "A preparar a interface",
    "loading.4": "Quase pronto",
    "nav.projects": "Projetos",
    "nav.about": "Sobre",
    "nav.contact": "Contacto",
    "settings.title": "DEFINIÇÕES",
    "settings.open": "Definições",
    "settings.close": "Fechar definições",
    "settings.audio": "Áudio",
    "settings.musicVolume": "Volume da música",
    "settings.hoverVolume": "Volume dos efeitos",
    "settings.music": "Música de fundo",
    "settings.visual": "Visual",
    "settings.flicker": "Efeito de cintilação",
    "settings.parallax": "Efeito de paralaxe",
    "settings.language": "Idioma",
    "lang.switch": "Switch to English",
    "works.title": "Projetos",
    "works.search": "Pesquisar projetos...",
    "works.loading": "A carregar projetos...",
    "works.none": "Nenhum projeto encontrado",
    "works.noMatch": "Nenhum projeto corresponde à pesquisa",
    "works.tryAgain": "Experimenta outro termo",
    "works.all": "Todos",
    "works.web": "Web",
    "works.software": "Software",
    "works.preview": "Pré-visualização",
    "works.code": "Ver código",
    "works.details": "Detalhes",
    "works.repo": "Código-fonte",
    "works.download": "Transferir",
    "works.live": "Abrir site",
    "works.screenshots": "Capturas de ecrã",
    "works.features": "O que faz",
    "works.platforms": "Plataformas",
    "works.noCode": "Sem código disponível",
    "works.loadFailed": "Não foi possível carregar os projetos",
    "works.retry": "Tentar de novo",
    "works.enlarge": "Clica numa captura para ampliar · Esc para fechar",
    "back": "Voltar",
    "about.title": "Sobre mim",
    "about.photo": "Fotografia do Emanuel",
    "about.bio":
      "Olá, sou o Emanuel, um web designer de <span id=\"dynamic-age\">{age}</span> anos com uma grande paixão por anime e videojogos. Adoro criar sites visualmente apelativos e fáceis de usar, muitas vezes inspirados nos estilos e na criatividade das coisas de que gosto. Para mim, design é juntar estética e funcionalidade, e estou sempre à procura de novas formas de tornar as experiências digitais mais envolventes e próximas das pessoas.",
    "about.facts":
      "✨ Em Lisboa <br />💻 Especializado em HTML, CSS, JS, Bootstrap e Tailwind, e em aplicações nativas em C# <br />🔐 A estudar cibersegurança <br />🎨 Inspirado por synthwave, cyberpunk, estética vapor e glitch art.",
    "contact.title": "Contacto",
    "contact.text": "Vamos falar — seja para colaborar, tirar dúvidas ou qualquer outra coisa!",
    "help.open": "Ajuda",
    "help.close": "Fechar ajuda",
    "help.title": "CENTRO DE AJUDA",
    "help.navQ": "Teclas de navegação",
    "help.navA":
      'Usa <span class="key">Alt+1</span> para o Início, <span class="key">Alt+2</span> para Projetos, <span class="key">Alt+3</span> para Sobre e <span class="key">Alt+4</span> para Contacto.',
    "help.audioQ": "Controlos de áudio",
    "help.audioA": 'Carrega em <span class="key">M</span> para ligar ou desligar a música, ou usa as definições de áudio.',
    "help.previewQ": "Ver os projetos",
    "help.previewA":
      'Os projetos web têm pré-visualização <i class="bi bi-eye-fill"></i> e o código <i class="bi bi-code-slash"></i>. Os projetos de software abrem uma página de detalhes <i class="bi bi-window-stack"></i> com capturas e transferências.',
    "help.findQ": "Não encontras algo?",
    "help.findA": "Usa a pesquisa e os filtros Web / Software na secção Projetos para encontrar projetos pelo nome, descrição ou tecnologias.",
    "help.moreQ": "Precisas de mais ajuda?",
    "help.moreA": 'Fala comigo diretamente por email: <a href="mailto:ealmeida24ar@outlook.com" class="text-purple-300 hover:text-white">ealmeida24ar@outlook.com</a>',
    "help.shortcuts": "Atalhos de teclado",
    "help.esc": "Fechar janelas",
    "help.home": "Início",
    "help.toggleHelp": "Abrir ajuda",
    "help.music": "Música",
    "help.language": "Mudar idioma",
    "modal.code": "Código",
    "modal.close": "Fechar",
    "tip.menu": "Ir para a secção",
    "tip.back": "Voltar ao início",
    "error.title": "FALHA DO SISTEMA",
  },
};

const Lang = {
  current: (() => {
    try {
      const saved = localStorage.getItem("language");
      if (saved === "en" || saved === "pt") return saved;
    } catch (e) {}
    return (navigator.language || "").toLowerCase().startsWith("pt") ? "pt" : "en";
  })(),
  listeners: [],

  t(key, vars) {
    let text = (I18N[this.current] && I18N[this.current][key]) ?? I18N.en[key] ?? key;
    if (vars) for (const k in vars) text = text.replaceAll(`{${k}}`, vars[k]);
    return text;
  },

  /** Picks the right language from a project field: plain string, or {en, pt}. */
  pick(value) {
    if (value == null) return "";
    if (typeof value === "string") return value;
    return value[this.current] || value.en || value.pt || "";
  },

  apply(root = document) {
    document.documentElement.lang = this.current === "pt" ? "pt-PT" : "en";
    root.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = this.t(el.dataset.i18n)));
    root.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const vars = el.dataset.i18nVars ? JSON.parse(el.dataset.i18nVars) : undefined;
      el.innerHTML = this.t(el.dataset.i18nHtml, vars);
    });
    root.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      el.dataset.i18nAttr.split(";").forEach((pair) => {
        const [attr, key] = pair.split(":").map((s) => s.trim());
        if (attr && key) el.setAttribute(attr, this.t(key));
      });
    });
    document.querySelectorAll(".lang-option").forEach((b) => {
      const on = b.dataset.lang === this.current;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", on);
    });
  },

  set(lang) {
    if (lang !== "en" && lang !== "pt") return;
    this.current = lang;
    try { localStorage.setItem("language", lang); } catch (e) {}
    this.apply();
    this.listeners.forEach((fn) => fn(lang));
  },

  toggle() { this.set(this.current === "en" ? "pt" : "en"); },
  onChange(fn) { this.listeners.push(fn); },
};

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".lang-option").forEach((b) => b.addEventListener("click", () => Lang.set(b.dataset.lang)));
  Lang.apply();
});
