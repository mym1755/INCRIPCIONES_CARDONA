/* components/Hero.js — portada con el logo del torneo (logo.jpg) */
(function (D) {
  D.Hero = {
    mount(el) {
      const C = D.CONFIG, E = C.evento;
      el.innerHTML = `
        <header class="hero" id="inicio">
          <div class="wrap hero-grid">
            <div>
              <span class="eyebrow">${C.subtitulo.toUpperCase()} · ${E.lugar.toUpperCase()}</span>
              <h1>Inscripción de<br><span class="accent">competidores</span></h1>
              <p class="hero-sub">${E.nombre} · ${E.fechaLarga}, ${E.hora}. Registra todos los competidores, asigna una o varias categorías y envía el pre-registro completo por correo.</p>
              <div class="hero-actions">
                <a class="btn btn-primary" href="#inscripcion">${D.dom.icon("user")} Inscribir competidor</a>
                <a class="btn btn-outline" href="#categorias">${D.dom.icon("list")} Ver categorías</a>
              </div>
            </div>
            <div class="hero-logo">
              <img src="${C.imagenes.logoTorneo}" alt="Logo del ${E.nombre}" width="620" height="620">
            </div>
          </div>
        </header>`;
    },
    mountCompact(el, titulo, texto) {
      el.innerHTML = `
        <header class="hero" id="inicio" style="padding-block:clamp(32px,4vw,56px)">
          <div class="wrap">
            <span class="eyebrow">${D.CONFIG.evento.nombre.toUpperCase()}</span>
            <h1 style="font-size:clamp(32px,4.4vw,60px)">${titulo}</h1>
            <p class="hero-sub">${texto}</p>
          </div>
        </header>`;
    },
  };
})(window.DOKAN = window.DOKAN || {});
