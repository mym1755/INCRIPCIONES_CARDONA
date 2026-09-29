/* =========================================================
   email.js — envío del pre-registro completo por correo
   FormSubmit mantiene el proyecto compatible con GitHub Pages.
   ========================================================= */
(function (D) {
  const ENDPOINT = "https://formsubmit.co/ajax/" + encodeURIComponent(D.CONFIG.email.destino);

  const fechaLegible = (iso) => (iso || "").split("-").reverse().join("/");
  const num = (n, dec) => Number(n).toFixed(dec);

  function bloqueCompetidor(c, i) {
    const lineas = [
      "COMPETIDOR #" + (i + 1),
      "Nombre: " + c.nombre,
      "Género: " + c.genero,
      "Fecha de nacimiento: " + fechaLegible(c.fechaNacimiento),
      "Edad: " + c.edad + " años",
      "Peso: " + num(c.peso, Number.isInteger(Number(c.peso)) ? 0 : 1) + " kg",
      "Altura: " + num(c.altura, 2) + " m",
      "Cinta: " + c.cinta,
      "Academia / GYM: " + (c.gym || "Sin academia"),
      "Categorías:",
    ];

    // En el correo se envían únicamente los códigos, tal como necesita el pre-registro.
    c.categorias.forEach((codigo) => lineas.push(codigo));

    const total = c.categorias.length * D.CONFIG.precios.categoria;
    lineas.push("Total: " + D.dom.money(total));
    return lineas.join("\n");
  }

  function construirMensaje(competidores) {
    const lista = Array.isArray(competidores) ? competidores : [competidores];
    return [
      "PRE-REGISTRO — DOKAN SYSTEM",
      D.CONFIG.evento.nombre,
      "==============================",
      lista.map(bloqueCompetidor).join("\n==============================\n"),
    ].join("\n");
  }

  // Envío directo: un clic, sin abrir Gmail ni ninguna otra app y sin preguntas.
  async function enviar(competidores) {
    const lista = Array.isArray(competidores) ? competidores : [competidores];
    const problemas = [];
    lista.forEach((c) => D.validation.problemasDeRegistro(c).forEach((p) => problemas.push(c.nombre + ": " + p)));

    if (!lista.length || problemas.length) {
      D.dom.toast(problemas[0] || "No hay registros completos para enviar.", "error");
      return { ok: false, problemas };
    }

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          _subject: "PRE-REGISTRO — DOKAN SYSTEM",
          _captcha: "false",   // sin pantalla de verificación
          _honey: "",
          message: construirMensaje(lista),
        }),
      });

      const data = await response.json().catch(() => ({}));
      // FormSubmit devuelve success como texto ("true"/"false"), por eso se compara como String.
      if (!response.ok || String(data.success) === "false") {
        throw new Error(data.message || "El servicio de correo rechazó el envío.");
      }

      D.store.marcarEnviado(lista.map((c) => c.id));
      D.dom.toast("Información enviada", "ok");
      return { ok: true, data };
    } catch (error) {
      console.error("[DOKAN] Error enviando correo:", error);
      const msg = String(error && error.message || "");
      let aviso = "No se pudo enviar. Intenta de nuevo.";
      if (/activat/i.test(msg)) aviso = "Falta activar el correo destino. Revisa la bandeja de " + D.CONFIG.email.destino + ".";
      else if (window.location.protocol === "file:") aviso = "Abre la página con Live Server o GitHub Pages para poder enviar.";
      D.dom.toast(aviso, "error");
      return { ok: false, error };
    }
  }

  D.email = { construirMensaje, enviar };
})(window.DOKAN = window.DOKAN || {});
