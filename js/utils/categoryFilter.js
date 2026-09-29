/* =========================================================
   utils/categoryFilter.js — filtro inteligente de categorías
   Lee las reglas de cada categoría (data/categories.js).
   Una regla con valor null no se evalúa.
   ========================================================= */
(function (D) {
  // Devuelve los motivos por los que la categoría NO aplica ([] = compatible).
  function evaluar(cat, c) {
    const motivos = [];
    if (cat.genero && cat.genero !== "Mixto" && cat.genero !== c.genero) motivos.push("género");
    if (cat.edadMin !== null && c.edad < cat.edadMin) motivos.push("edad");
    else if (cat.edadMax !== null && c.edad > cat.edadMax) motivos.push("edad");
    if (cat.pesoMin !== null && c.peso < cat.pesoMin) motivos.push("peso");
    else if (cat.pesoMax !== null && c.peso > cat.pesoMax) motivos.push("peso");
    if (cat.alturaMin !== null && c.altura < cat.alturaMin) motivos.push("altura");
    else if (cat.alturaMax !== null && c.altura > cat.alturaMax) motivos.push("altura");
    if (cat.cintas && cat.cintas.indexOf(c.cinta) === -1) motivos.push("cinta");
    return motivos;
  }

  const esCompatible = (cat, c) => evaluar(cat, c).length === 0;

  function compatibles(competidor, modalidadId) {
    return D.CATEGORIAS.filter((cat) =>
      (!modalidadId || cat.modalidad === modalidadId) && esCompatible(cat, competidor));
  }

  D.categoryFilter = { evaluar, esCompatible, compatibles };
})(window.DOKAN = window.DOKAN || {});
