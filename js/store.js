/* =========================================================
   store.js — estado de la aplicación (competidores, selección)
   Los componentes se suscriben y se vuelven a pintar en cada cambio.
   ========================================================= */
(function (D) {
  const state = { competidores: [], seleccionadoId: null, modalidad: null, pendiente: null };
  const listeners = [];
  const emit = () => listeners.forEach((fn) => fn(state));
  const persist = () => D.storage.save(state.competidores);
  const buscar = (id) => state.competidores.find((c) => c.id === id) || null;

  D.store = {
    state,
    init() { state.competidores = D.storage.load(); },
    subscribe(fn) { listeners.push(fn); },
    seleccionado() { return buscar(state.seleccionadoId); },

    agregar(datos) {
      const c = D.crearCompetidor(datos);
      state.competidores.push(c);
      state.seleccionadoId = c.id; state.modalidad = null; state.pendiente = null;
      if (c.gym) D.storage.saveAcademy(c.gym);
      persist(); emit();
      return c;
    },
    seleccionar(id) {
      state.seleccionadoId = id; state.modalidad = null; state.pendiente = null;
      emit();
    },
    quitar(id) {
      state.competidores = state.competidores.filter((c) => c.id !== id);
      if (state.seleccionadoId === id) { state.seleccionadoId = null; state.pendiente = null; }
      persist(); emit();
    },
    vaciar() {
      state.competidores = []; state.seleccionadoId = null; state.pendiente = null;
      persist(); emit();
    },
    setModalidad(id) { state.modalidad = id; state.pendiente = null; emit(); },
    setPendiente(codigo) { state.pendiente = codigo; emit(); },

    asignarCategoria(id, codigo) {
      const c = buscar(id);
      const cat = D.categoriaPorCodigo(codigo);
      if (!c) return { ok: false, error: "Selecciona un competidor." };
      if (!cat) return { ok: false, error: "La categoría seleccionada no existe." };
      const motivos = D.categoryFilter.evaluar(cat, c);
      if (motivos.length) return { ok: false, error: "Categoría incompatible con el competidor (" + motivos.join(", ") + ")." };
      if (c.categorias.indexOf(codigo) !== -1) {
        return { ok: false, error: "Esa categoría ya está asignada a este competidor." };
      }
      // Un competidor puede tener una o varias categorías, incluso dentro de la misma modalidad.
      c.categorias.push(codigo);
      c.enviado = false; state.pendiente = null;
      persist(); emit();
      return { ok: true, categoria: cat };
    },
    quitarCategoria(id, codigo) {
      const c = buscar(id);
      if (!c) return;
      c.categorias = c.categorias.filter((x) => x !== codigo);
      c.enviado = false;
      persist(); emit();
    },
    marcarEnviado(ids) {
      state.competidores.forEach((c) => { if (ids.indexOf(c.id) !== -1) c.enviado = true; });
      persist(); emit();
    },
  };
})(window.DOKAN = window.DOKAN || {});
