/* components/Contact.js — sección de contacto */
(function (D) {
  D.Contact = {
    mount(el) {
      const E = D.CONFIG.evento, ic = D.dom.icon;
      const telDigitos = E.telefonoInfo.replace(/\D/g, "");
      const card = (icon, k, v, extra) => `<div class="contact-card"><span class="ico">${ic(icon, 22)}</span><div class="k">${k}</div><div class="v">${v}</div>${extra || ""}</div>`;
      el.innerHTML = `
        <div class="section-head">
          <h2>Contacto</h2>
          <p>¿Dudas sobre categorías, pagos o el día del torneo? Comunícate con el organizador.</p>
        </div>
        <div class="contact-grid">
          ${card("user", "ORGANIZADOR", D.dom.esc(E.organizador))}
          ${card("phone", "TELÉFONO / WHATSAPP", E.telefonoInfo,
            `<a class="btn btn-whatsapp btn-sm" target="_blank" rel="noopener" href="https://wa.me/${D.CONFIG.whatsapp.codigoPais}${telDigitos}">${ic("whatsapp", 16)} Escribir por WhatsApp</a>`)}
          ${card("pin", "LUGAR", D.dom.esc(E.lugar), `<span class="hint" style="color:var(--muted)">${E.fechaLarga} · ${E.hora}</span>`)}
          ${card("facebook", "SÍGUENOS EN FACEBOOK", D.dom.esc(E.facebook))}
        </div>`;
    },
  };
})(window.DOKAN = window.DOKAN || {});
