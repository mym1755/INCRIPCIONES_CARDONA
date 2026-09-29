/* components/Header.js — barra superior con marca, logo y menú responsive */
(function (D) {
  D.Header = {
    mount(el, page) {
      const C = D.CONFIG, ic = D.dom.icon;
      const enIndex = page === "index";
      const base = enIndex ? "" : "index.html";
      const links = [
        { id: "inicio", href: base + "#inicio", label: "Inicio" },
        { id: "categorias", href: enIndex ? "#categorias" : "categorias.html", label: "Categorías" },
        { id: "contacto", href: "#contacto", label: "Contacto" },
        { id: "inscripcion", href: base + "#inscripcion", label: "Inscribirse", cta: true },
      ];
      el.innerHTML = `
        <nav class="nav" aria-label="Principal">
          <div class="wrap nav-inner">
            <a class="nav-brand" href="${base}#inicio" aria-label="${C.marca}">
              <img src="${C.imagenes.logoHeader}" alt="Logo ${C.marca}" width="120" height="46">
              <span class="brand-text">
                <span class="brand-name">${C.marca}</span>
                <span class="brand-sub">${C.subtitulo.toUpperCase()}</span>
              </span>
            </a>
            <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-links" aria-label="Abrir menú">${ic("menu", 22)}</button>
            <div class="nav-links" id="nav-links">
              ${links.map((l) => `<a href="${l.href}" data-id="${l.id}" class="${l.cta ? "nav-cta" : ""}">${l.label}</a>`).join("")}
            </div>
          </div>
        </nav>`;

      const menu = D.dom.$("#nav-links", el);
      const toggle = D.dom.$(".nav-toggle", el);
      const cerrar = () => {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menú");
        toggle.innerHTML = ic("menu", 22);
      };
      toggle.addEventListener("click", () => {
        const abierto = menu.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(abierto));
        toggle.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
        toggle.innerHTML = ic(abierto ? "x" : "menu", 22);
      });
      D.dom.$$("a", menu).forEach((a) => a.addEventListener("click", cerrar));
      document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrar(); });

      const marcar = (id) => D.dom.$$("a[data-id]", menu).forEach((a) => {
        const activo = a.dataset.id === id;
        a.classList.toggle("active", activo);
        if (activo) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      });

      if (!enIndex) {
        marcar(page === "categorias" ? "categorias" : "inicio");
        return;
      }
      const ids = ["inicio", "categorias", "inscripcion", "contacto"];
      marcar("inicio");
      if ("IntersectionObserver" in window) {
        const visibles = new Map();
        const obs = new IntersectionObserver((entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) visibles.set(en.target.id, en.intersectionRatio);
            else visibles.delete(en.target.id);
          });
          const mejor = ids.find((id) => visibles.has(id));
          if (mejor) marcar(mejor);
        }, { rootMargin: "-18% 0px -65% 0px", threshold: [0.05, 0.2, 0.5] });
        ids.forEach((id) => { const s = document.getElementById(id); if (s) obs.observe(s); });
      }

      // Si se navega con hash, marca el destino inmediatamente.
      window.addEventListener("hashchange", () => {
        const id = (window.location.hash || "#inicio").slice(1);
        if (ids.indexOf(id) !== -1) marcar(id);
      });
    },
  };
})(window.DOKAN = window.DOKAN || {});
