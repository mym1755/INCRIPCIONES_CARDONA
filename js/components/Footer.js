/* components/Footer.js — pie de página */
(function (D) {
  D.Footer = {
    mount(el) {
      const C = D.CONFIG;
      el.innerHTML = `
        <footer class="footer">
          <div class="wrap footer-inner">
            <div class="footer-brand">
              <img src="${C.imagenes.logoHeader}" alt="Logo ${C.marca}" height="34">
              <span>${C.marca} · ${C.subtitulo}</span>
            </div>
            <span>${C.evento.nombre} · ${C.evento.fechaCorta}</span>
            <nav class="footer-links" aria-label="Pie de página">
              <a href="index.html#inicio">Inicio</a><a href="categorias.html">Categorías</a><a href="index.html#inscripcion">Inscribirse</a>
            </nav>
          </div>
        </footer>`;
    },
  };
})(window.DOKAN = window.DOKAN || {});
