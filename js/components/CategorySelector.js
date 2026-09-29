/* components/CategorySelector.js — asignación inteligente de categorías */
(function (D) {
  const esc = D.dom.esc, ic = D.dom.icon;

  D.CategorySelector = {
    mount(el) {
      const render = () => {
        const c = D.store.seleccionado(), st = D.store.state;
        if (!c) {
          el.innerHTML = `
            <div class="panel">
              <div class="panel-head"><h3><span class="ico">${ic("tag", 20)}</span>Asignar categorías</h3></div>
              <div class="empty"><div class="ico">${ic("tag", 24)}</div>
                <strong>Selecciona un competidor de la lista</strong>
                <p>El sistema mostrará únicamente las categorías compatibles y permitirá asignar más de una.</p></div>
            </div>`;
          return;
        }

        const grupos = D.MODALIDADES.map((m) => ({
          m,
          cats: D.categoryFilter.compatibles(c, m.id).filter((cat) => c.categorias.indexOf(cat.codigo) === -1),
        }));
        if (!grupos.some((g) => g.m.id === st.modalidad)) st.modalidad = (grupos.find((g) => g.cats.length) || grupos[0]).m.id;
        const activo = grupos.find((g) => g.m.id === st.modalidad) || grupos[0];
        const tieneEn = (mid) => c.categorias.some((cd) => { const x = D.categoriaPorCodigo(cd); return x && x.modalidad === mid; });
        const total = D.categoriasDeModalidad(activo.m.id).length;
        const compatiblesTotales = D.categoryFilter.compatibles(c, activo.m.id).length;
        const ocultas = Math.max(0, total - compatiblesTotales);

        el.innerHTML = `
          <div class="panel">
            <div class="panel-head">
              <h3><span class="ico">${ic("tag", 20)}</span>Asignar categorías</h3>
              <span class="count"><b>${c.categorias.length}</b> asignadas</span>
            </div>
            <div class="who">
              <strong>${esc(c.nombre)}</strong>
              <span class="badge">${esc(c.genero)}</span><span class="badge">${c.edad} años</span>
              <span class="badge">${c.peso} kg</span><span class="badge">${Number(c.altura).toFixed(2)} m</span>
              <span class="badge">Cinta ${esc(c.cinta)}</span>
              <span class="badge">${esc(c.gym || "Sin academia")}</span>
            </div>
            <p class="filter-note">${ic("info", 16)}<span>Se filtra por género, edad y cinta. Si una categoría define peso o altura, también se aplica. Las categorías ya asignadas desaparecen para evitar duplicados.</span></p>
            <div class="tabs" role="tablist" aria-label="Modalidad">
              ${grupos.map((g) => `<button type="button" role="tab" class="tab ${tieneEn(g.m.id) ? "has-cat" : ""}" aria-selected="${g.m.id === st.modalidad}" data-mod="${g.m.id}">
                ${esc(g.m.nombre)} <span class="n">${g.cats.length}</span></button>`).join("")}
            </div>
            ${activo.cats.length
              ? `<div class="opt-list" role="radiogroup" aria-label="Categorías compatibles">${activo.cats.map((cat) => D.CategoryCard.option(cat, st.pendiente === cat.codigo, false)).join("")}</div>`
              : `<div class="empty"><strong>No hay nuevas categorías compatibles en esta modalidad</strong><p>Puede que todas las categorías compatibles ya estén asignadas o no correspondan a ${esc(c.nombre)}.</p></div>`}
            ${ocultas > 0 && activo.cats.length ? `<p class="form-note">Se ocultaron ${ocultas} categorías de esta modalidad por no corresponder al competidor.</p>` : ""}
            <div class="assign-actions">
              <button type="button" class="btn btn-primary" data-act="confirm" ${st.pendiente ? "" : "disabled"}>${ic("check")} Confirmar categoría</button>
            </div>
            ${c.categorias.length ? `<div class="assigned-block">
              <div class="assigned-title">Categorías asignadas</div>
              <div class="assigned" aria-label="Categorías asignadas">${c.categorias.map((cd) => {
                const cat = D.categoriaPorCodigo(cd);
                return `<span class="badge badge-green">${ic("check", 14)} ${esc(cat ? cat.codigo : cd)}<button type="button" data-quitar="${esc(cd)}" aria-label="Quitar categoría ${esc(cat ? cat.nombre : cd)}">${ic("x", 14)}</button></span>`;
              }).join("")}</div>
              <button type="button" class="btn btn-outline btn-sm" data-act="new-category">${ic("tag", 16)} Asignar nueva categoría</button>
            </div>` : `<p class="form-note">Este competidor todavía no tiene categorías. Puedes asignarle una o varias.</p>`}
          </div>`;
      };

      el.addEventListener("click", (ev) => {
        const tab = ev.target.closest("[data-mod]");
        if (tab) { D.store.setModalidad(tab.dataset.mod); return; }
        const op = ev.target.closest(".opt");
        if (op) { D.store.setPendiente(op.dataset.codigo); return; }
        const q = ev.target.closest("[data-quitar]");
        if (q) {
          if (confirm("¿Quitar esta categoría del competidor?")) D.store.quitarCategoria(D.store.state.seleccionadoId, q.dataset.quitar);
          return;
        }
        if (ev.target.closest('[data-act="new-category"]')) {
          D.store.setPendiente(null);
          const options = el.querySelector(".opt-list");
          if (options) options.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
        if (ev.target.closest('[data-act="confirm"]')) {
          const st = D.store.state;
          const r = D.store.asignarCategoria(st.seleccionadoId, st.pendiente);
          if (!r.ok) { D.dom.toast(r.error, "error"); return; }
          D.dom.toast("Categoría asignada: " + r.categoria.codigo, "ok");
        }
      });

      D.store.subscribe(render); render();
    },
  };
})(window.DOKAN = window.DOKAN || {});
