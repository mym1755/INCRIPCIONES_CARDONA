/* components/EventInfo.js — franja de datos del evento y tarjetas de precios */
(function (D) {
  D.EventInfo = {
    mountStrip(el) {
      const E = D.CONFIG.evento, P = D.CONFIG.precios, ic = D.dom.icon;
      const items = [
        ["calendar", "FECHA", E.fechaCorta, ""],
        ["clock", "HORARIO", E.hora, ""],
        ["pin", "LUGAR", E.lugar.toUpperCase(), ""],
        ["tag", "PARTICIPACIÓN", D.dom.money(P.categoria) + " / categoría", "red"],
      ];
      el.innerHTML = `<section class="info-strip" aria-label="Datos del evento"><div class="wrap info-grid">` +
        items.map((i) => `
          <div class="info-item">
            <span class="ico">${ic(i[0], 22)}</span>
            <div><div class="label">${i[1]}</div><div class="value ${i[3]}">${i[2]}</div></div>
          </div>`).join("") + `</div></section>`;
    },
    mountPrecios(el) {
      const P = D.CONFIG.precios, ic = D.dom.icon, m = D.dom.money;
      el.innerHTML = `
        <div class="section-head">
          <h2>Precios del evento</h2>
          <p>Costos oficiales de participación, entrada del público y parqueo.</p>
        </div>
        <div class="price-grid">
          <div class="price-card">
            <div class="tag">${ic("award")} PARTICIPACIÓN</div>
            <div class="amount"><span>Q</span>${P.categoria.toFixed(2)}</div>
            <p class="note">Por categoría en la que participe el competidor.</p>
          </div>
          <div class="price-card">
            <div class="tag">${ic("ticket")} ENTRADA AL PÚBLICO</div>
            <div class="amount"><span>Q</span>${P.publico.toFixed(2)}</div>
            <p class="note">Acceso general para acompañantes y espectadores.</p>
          </div>
          <div class="price-card">
            <div class="tag">${ic("car")} PARQUEO</div>
            <div class="amount"><span>Q</span>${P.parqueoCarros.toFixed(2)} / <span>Q</span>${P.parqueoMotos.toFixed(2)}</div>
            <p class="note">${m(P.parqueoCarros)} carros · ${m(P.parqueoMotos)} motos.</p>
          </div>
        </div>`;
    },
  };
})(window.DOKAN = window.DOKAN || {});
