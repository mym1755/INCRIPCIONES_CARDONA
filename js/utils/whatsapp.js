/* =========================================================
   utils/whatsapp.js — mensaje y enlace de WhatsApp
   ========================================================= */
(function (D) {
  const fechaLegible = (iso) => (iso || "").split("-").reverse().join("/");
  const num = (n, dec) => Number(n).toFixed(dec);

  function bloqueCompetidor(c) {
    const lineas = [
      "Nombre: " + c.nombre,
      "Género: " + c.genero,
      "Fecha de nacimiento: " + fechaLegible(c.fechaNacimiento),
      "Edad: " + c.edad + " años",
      "Peso: " + num(c.peso, Number.isInteger(c.peso) ? 0 : 1) + " kg",
      "Altura: " + num(c.altura, 2) + " m",
      "Cinta: " + c.cinta,
      "GYM: " + (c.gym || "Sin GYM"),
    ];
    c.categorias.forEach((codigo, i) => {
      const cat = D.categoriaPorCodigo(codigo);
      const mod = cat ? D.modalidadPorId(cat.modalidad).nombre : "";
      lineas.push("");
      lineas.push("Categoría" + (c.categorias.length > 1 ? " " + (i + 1) : "") + ": " + (cat ? cat.nombre : codigo) + " [" + codigo + "]");
      lineas.push("Modalidad: " + mod);
    });
    const total = c.categorias.length * D.CONFIG.precios.categoria;
    lineas.push("");
    lineas.push("Total a pagar: " + D.dom.money(total) + " (" + c.categorias.length + " × " + D.dom.money(D.CONFIG.precios.categoria) + ")");
    return lineas.join("\n");
  }

  function construirMensaje(competidores) {
    const lista = Array.isArray(competidores) ? competidores : [competidores];
    const cab = "*INSCRIPCIÓN TORNEO DOKAN SYSTEM*\n" + D.CONFIG.evento.nombre + " · " + D.CONFIG.evento.fechaLarga;
    return cab + "\n\n" + lista.map(bloqueCompetidor).join("\n\n────────────\n\n");
  }

  function construirUrl(texto) {
    const w = D.CONFIG.whatsapp;
    return "https://wa.me/" + w.codigoPais + w.numero + "?text=" + encodeURIComponent(texto);
  }

  D.whatsapp = { construirMensaje, construirUrl };
})(window.DOKAN = window.DOKAN || {});
