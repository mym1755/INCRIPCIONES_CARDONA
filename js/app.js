/* =========================================================
   app.js — arranque: monta los componentes según la página
   ========================================================= */
(function (D) {
  const $ = (id) => document.getElementById(id);

  document.addEventListener("DOMContentLoaded", function () {
    const page = document.body.dataset.page || "index";
    D.store.init();

    D.Header.mount($("app-header"), page);
    D.Contact.mount($("app-contacto"));
    D.Footer.mount($("app-footer"));

    if (page === "categorias") {
      D.Hero.mountCompact($("app-hero"), "Categorías del torneo",
        "Divisiones oficiales por edad, nivel y género. El sistema de inscripción asigna automáticamente solo las que corresponden a cada competidor.");
      D.CategoriesSection.mount($("app-categorias"));
      return;
    }

    D.Hero.mount($("app-hero"));
    D.EventInfo.mountStrip($("app-info"));
    D.EventInfo.mountPrecios($("app-precios"));
    D.CategoriesSection.mount($("app-categorias"));
    D.FlowSteps.mount($("app-flow"));
    D.RegistrationForm.mount($("app-form"));
    D.CompetitorList.mount($("app-list"));
    D.CategorySelector.mount($("app-selector"));
    D.ReviewPanel.mount($("app-review"));
  });
})(window.DOKAN = window.DOKAN || {});
