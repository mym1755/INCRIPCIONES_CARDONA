/* components/EmailButton.js — botón de envío del pre-registro completo */
(function (D) {
  D.EmailButton = {
    render(deshabilitado) {
      return `<button type="button" class="btn btn-primary" data-email-send ${deshabilitado ? "disabled" : ""}>
        ${D.dom.icon("mail", 20)} Enviar pre-registro</button>`;
    },
    attach(el, obtenerLista) {
      el.addEventListener("click", async (ev) => {
        const b = ev.target.closest("[data-email-send]");
        if (!b) return;
        const lista = obtenerLista();
        b.disabled = true;
        b.classList.add("is-loading");
        await D.email.enviar(lista);
        b.disabled = false;
        b.classList.remove("is-loading");
      });
    },
  };
})(window.DOKAN = window.DOKAN || {});
