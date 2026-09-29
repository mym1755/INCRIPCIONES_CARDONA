/* components/CompetitorList.js — lista de competidores registrados (compacta) */
(function (D) {
  const esc = D.dom.esc, ic = D.dom.icon;

  function fila(c, seleccionado) {
    const estado = D.estadoDe(c);
    const cls = estado === D.ESTADOS.ENVIADO ? "badge-green" : estado === D.ESTADOS.ASIGNADA ? "badge-blue" : "";
    const cats = c.categorias.length
      ? c.categorias.map((cd) => `<span class="chip red">${esc(cd)}</span>`).join("")
      : `<span class="none">Sin categoría</span>`;
    const datos = [c.genero, c.edad + " años", c.peso + " kg", Number(c.altura).toFixed(2) + " m", "Cinta " + c.cinta]
      .concat(c.gym ? [c.gym] : []).map(esc).join(" · ");
    return `
      <article class="comp-card compact ${seleccionado ? "selected" : ""}" data-id="${c.id}"${seleccionado ? ' aria-current="true"' : ""}>
        <div class="comp-top"><h4>${esc(c.nombre)}</h4><span class="badge ${cls}">${estado}</span></div>
        <p class="comp-line">${datos}</p>
        <div class="comp-cats" aria-label="Categorías asignadas">${cats}</div>
        <div class="comp-actions">
          <button type="button" class="btn btn-primary btn-sm" data-act="select">${ic("tag", 15)} ${c.categorias.length ? "Otra categoría" : "Asignar"}</button>
          <button type="button" class="btn btn-outline btn-sm" data-act="remove" aria-label="Quitar a ${esc(c.nombre)}" title="Quitar">${ic("trash", 15)}</button>
        </div>
      </article>`;
  }

  D.CompetitorList = {
    mount(el) {
      const render = () => {
        const st = D.store.state;
        const cuerpo = st.competidores.length
          ? `<div class="comp-summary"><span>${ic("users", 16)} ${st.competidores.length} competidor${st.competidores.length === 1 ? "" : "es"}</span><span>${st.competidores.reduce((n, c) => n + c.categorias.length, 0)} categorías</span></div>
             <div class="comp-list">${st.competidores.map((c) => fila(c, c.id === st.seleccionadoId)).join("")}</div>
             <div class="list-actions">
               <button type="button" class="btn btn-ghost btn-sm" data-act="clear">${ic("trash", 16)} Vaciar lista</button>
               <button type="button" class="btn btn-primary btn-sm" data-act="pre">${ic("clipboard", 16)} Ver pre-registro</button>
             </div>`
          : `<div class="empty"><div class="ico">${ic("users", 26)}</div>
               <strong>Todavía no hay competidores registrados</strong>
               <p>Completa el formulario y cada competidor aparecerá aquí.</p></div>`;
        el.innerHTML = `
          <div class="panel">
            <div class="panel-head">
              <h3><span class="ico">${ic("list", 20)}</span>Competidores registrados</h3>
              <span class="count"><b>${st.competidores.length}</b> en la lista</span>
            </div>${cuerpo}
          </div>`;
      };

      el.addEventListener("click", (ev) => {
        const accion = ev.target.closest("[data-act]");
        const card = ev.target.closest(".comp-card");
        if (accion && accion.dataset.act === "remove" && card) {
          const c = D.store.state.competidores.find((x) => x.id === card.dataset.id);
          if (c && confirm("¿Quitar a " + c.nombre + " de la lista?")) D.store.quitar(c.id);
          return;
        }
        if (accion && accion.dataset.act === "clear") {
          if (confirm("¿Vaciar toda la lista de competidores en este dispositivo?")) D.store.vaciar();
          return;
        }
        if (accion && accion.dataset.act === "pre") {
          D.dom.scrollTo(document.getElementById("revision"));
          return;
        }
        if (card) {
          D.store.seleccionar(card.dataset.id);
          D.dom.scrollTo(document.getElementById("bloque-categorias"));
        }
      });
      D.store.subscribe(render); render();
    },
  };
})(window.DOKAN = window.DOKAN || {});
