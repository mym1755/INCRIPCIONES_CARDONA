/* components/WhatsAppButton.js — botón y envío del registro por WhatsApp */
(function (D) {
  D.WhatsAppButton = {
    render(competidorId, deshabilitado) {
      return `<button type="button" class="btn btn-whatsapp" data-wa="${competidorId}" ${deshabilitado ? "disabled" : ""}>
        ${D.dom.icon("whatsapp", 20)} Enviar registro por WhatsApp</button>`;
    },

    // Valida TODO antes de abrir WhatsApp. Nunca envía información incompleta.
    enviar(competidores) {
      const lista = Array.isArray(competidores) ? competidores : [competidores];
      const problemas = [];
      lista.forEach((c) => D.validation.problemasDeRegistro(c).forEach((p) => problemas.push(c.nombre + ": " + p)));
      if (!lista.length || problemas.length) {
        D.dom.toast(problemas[0] || "No hay registros para enviar.", "error");
        return { ok: false, problemas };
      }
      const url = D.whatsapp.construirUrl(D.whatsapp.construirMensaje(lista));
      const a = document.createElement("a");
      a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer";
      document.body.appendChild(a); a.click(); a.remove();
      D.store.marcarEnviado(lista.map((c) => c.id));
      D.dom.toast("Se abrió WhatsApp con el registro. Presiona enviar dentro de WhatsApp.", "ok");
      return { ok: true, url };
    },
  };
})(window.DOKAN = window.DOKAN || {});
