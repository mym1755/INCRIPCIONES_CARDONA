/* components/CategoriesSection.js — sección de categorías del torneo */
(function (D) {
  D.CategoriesSection = {
    mount(el) {
      el.innerHTML = `
        <div class="section-head">
          <h2>Categorías del torneo</h2>
          <p>Cuatro divisiones, separadas por edad, nivel y género. Al inscribir un competidor, el sistema muestra solo las categorías que le corresponden.</p>
        </div>
        <div class="cat-grid">${D.MODALIDADES.map((m) => D.CategoryCard.overview(m)).join("")}</div>`;
    },
  };
})(window.DOKAN = window.DOKAN || {});
