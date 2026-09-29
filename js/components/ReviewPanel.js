/* components/ReviewPanel.js — pre-registro completo y envío por correo */
(function (D) {
  const esc = D.dom.esc, ic = D.dom.icon;

  function fila(c, index) {
    const problemas = D.validation.problemasDeRegistro(c);
    const total = c.categorias.length * D.CONFIG.precios.categoria;
    const datos = [c.genero, c.edad + " años", c.peso + " kg", Number(c.altura).toFixed(2) + " m", "Cinta " + c.cinta, c.gym || "Sin academia"].map(esc).join(" · ");
    const chips = c.categorias.length
      ? c.categorias.map((cd) => { const cat = D.categoriaPorCodigo(cd); return `<span class="chip red" title="${esc(cat ? cat.nombre : cd)}">${esc(cd)}</span>`; }).join("")
      : `<span class="none">Sin categoría asignada</span>`;
    return `
      <article class="pre-row ${problemas.length ? "has-problem" : ""}">
        <div class="pre-who">
          <div class="pre-name"><span class="pre-number">#${index + 1}</span><strong>${esc(c.nombre)}</strong>
            <span class="badge ${problemas.length ? "" : "badge-green"}">${problemas.length ? "Pendiente" : "Completo"}</span></div>
          <p class="pre-line">${datos}</p>
        </div>
        <div class="chip-row pre-codes">${chips}</div>
        <div class="pre-tot"><span>${c.categorias.length} cat. · <b>${D.dom.money(total)}</b></span>
          <button type="button" class="btn btn-outline btn-sm" data-edit="${c.id}" title="Revisar / asignar categorías">${ic("tag", 15)}</button></div>
        ${problemas.length ? `<ul class="problems" role="alert">${problemas.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}
      </article>`;
  }

  D.ReviewPanel = {
    mount(el) {
      const render = () => {
        const lista = D.store.state.competidores;
        if (!lista.length) {
          el.innerHTML = `
            <div class="panel" id="revision">
              <div class="panel-head"><h3><span class="ico">${ic("clipboard", 20)}</span>Pre-registro</h3></div>
              <div class="empty"><div class="ico">${ic("clipboard", 24)}</div>
                <strong>Aquí aparecerá el pre-registro completo</strong>
                <p>Registra primero todos los competidores y después asígnales una o varias categorías.</p></div>
            </div>`;
          return;
        }

        const incompletos = lista.filter((c) => D.validation.problemasDeRegistro(c).length > 0);
        const totalCategorias = lista.reduce((sum, c) => sum + c.categorias.length, 0);
        const total = totalCategorias * D.CONFIG.precios.categoria;
        const mensaje = incompletos.length ? "" : D.email.construirMensaje(lista);

        el.innerHTML = `
          <div class="panel" id="revision">
            <div class="panel-head">
              <h3><span class="ico">${ic("clipboard", 20)}</span>Pre-registro completo</h3>
              <span class="count"><b>${lista.length}</b> competidor${lista.length === 1 ? "" : "es"}</span>
            </div>
            <div class="pre-summary ${incompletos.length ? "warning" : "ready"}">
              <div><strong>${incompletos.length ? "Hay registros pendientes" : "Todo listo para enviar"}</strong><span>${incompletos.length ? incompletos.length + " competidor(es) necesitan revisión." : "Todos tienen al menos una categoría compatible."}</span></div>
              <div><b>${totalCategorias}</b><span>categorías</span></div>
              <div><b>${D.dom.money(total)}</b><span>total estimado</span></div>
            </div>
            <div class="pre-list">${lista.map(fila).join("")}</div>
            ${mensaje ? `<details class="preview"><summary>Ver el contenido del correo</summary><pre>${esc(mensaje)}</pre></details>` : ""}
            <div class="pre-send">
              <p class="form-note">Se envía todo en un solo correo a <strong>${esc(D.CONFIG.email.destino)}</strong>.</p>
              ${D.EmailButton.render(incompletos.length > 0)}
            </div>
          </div>`;
      };

      D.EmailButton.attach(el, () => D.store.state.competidores.slice());

      el.addEventListener("click", (ev) => {
        const b = ev.target.closest("[data-edit]");
        if (!b) return;
        D.store.seleccionar(b.dataset.edit);
        D.dom.scrollTo(document.getElementById("bloque-categorias"));
      });

      D.store.subscribe(render); render();
    },
  };
})(window.DOKAN = window.DOKAN || {});
