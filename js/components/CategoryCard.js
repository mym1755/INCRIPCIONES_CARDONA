/* components/CategoryCard.js — tarjeta de modalidad (resumen) y opción seleccionable */
(function (D) {
  const esc = D.dom.esc;
  const unicos = (arr) => arr.filter((v, i) => arr.indexOf(v) === i);

  D.CategoryCard = {
    // Resumen de una modalidad, generado a partir de los datos (no escrito a mano).
    overview(mod) {
      const cats = D.categoriasDeModalidad(mod.id);
      const rango = cats.length > 6 ? cats[0].codigo + " a " + cats[cats.length - 1].codigo
        : cats.map((c) => c.codigo).join(" · ");
      const chips = (arr, cls) => arr.map((t) => `<span class="chip ${cls || ""}">${esc(t)}</span>`).join("");
      return `
        <article class="cat-card">
          <span class="code-range">${esc(rango)}</span>
          <h3>${esc(mod.nombre)}</h3>
          <p class="sub">${esc(mod.descripcion)}</p>
          <div class="cat-block"><div class="k">EDADES</div><div class="chip-row">${chips(unicos(cats.map((c) => c.edadTexto)))}</div></div>
          <div class="cat-block"><div class="k">NIVELES</div><div class="chip-row">${chips(unicos(cats.map((c) => c.grado)), "blue")}</div></div>
          <div class="cat-block"><div class="k">GÉNERO</div><div class="chip-row">${chips(unicos(cats.map((c) => c.genero)), "red")}</div></div>
          <details>
            <summary>Ver las ${cats.length} categorías</summary>
            <ul class="cat-full">${cats.map((c) => `<li><b>${esc(c.codigo)}</b><span>${esc(c.nombre.split(" · ").slice(1).join(" · "))}</span></li>`).join("")}</ul>
          </details>
        </article>`;
    },

    // Categoría seleccionable (asignación).
    option(cat, seleccionada, asignada) {
      return `
        <button type="button" class="opt" role="radio" aria-checked="${seleccionada}" data-codigo="${esc(cat.codigo)}">
          <span class="code">${esc(cat.codigo)}${asignada ? " · ASIGNADA" : ""}</span>
          <span class="name">${esc(cat.nombre.split(" · ").slice(1, 3).join(" · "))}</span>
          <span class="tags">
            <span class="chip">${esc(cat.genero)}</span>
            <span class="chip blue">${esc(cat.grado)}</span>
          </span>
        </button>`;
    },
  };
})(window.DOKAN = window.DOKAN || {});
