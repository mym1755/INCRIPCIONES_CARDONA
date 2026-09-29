/* =========================================================
   types/competitor.js — estructura y estados del competidor

   Competitor {
     id, nombre, genero, fechaNacimiento (YYYY-MM-DD), edad (al día del torneo),
     peso (kg), altura (m), cinta, gym,
     categorias: string[]   // códigos de categoría asignados
     enviado: boolean
   }
   ========================================================= */
(function (D) {
  D.ESTADOS = {
    PENDIENTE: "Sin categoría",
    ASIGNADA: "Categoría asignada",
    ENVIADO: "Enviado",
  };

  D.estadoDe = function (c) {
    if (c.enviado) return D.ESTADOS.ENVIADO;
    return c.categorias.length ? D.ESTADOS.ASIGNADA : D.ESTADOS.PENDIENTE;
  };

  D.nuevoId = function () {
    return "c_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  };

  D.crearCompetidor = function (d) {
    return {
      id: D.nuevoId(),
      nombre: d.nombre,
      genero: d.genero,
      fechaNacimiento: d.fechaNacimiento,
      edad: d.edad,
      peso: d.peso,
      altura: d.altura,
      cinta: d.cinta,
      gym: d.gym || "",
      categorias: [],
      enviado: false,
    };
  };
})(window.DOKAN = window.DOKAN || {});
