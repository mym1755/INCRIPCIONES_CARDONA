/* =========================================================
   utils/validation.js — validaciones y cálculo de edad
   ========================================================= */
(function (D) {
  const LIM = {
    nombreMin: 3,
    edadMin: 3, edadMax: 99,
    pesoMin: 8, pesoMax: 200,
    alturaMin: 0.6, alturaMax: 2.3,
  };

  function parseNumero(v) {
    if (v === null || v === undefined) return NaN;
    const s = String(v).trim().replace(",", ".");
    return /^\d+(\.\d+)?$/.test(s) ? Number(s) : NaN;
  }

  function fechaValida(iso) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso || "")) return null;
    const d = new Date(iso + "T00:00:00");
    return isNaN(d.getTime()) ? null : d;
  }

  // Edad cumplida en la fecha de referencia (por defecto, el día del torneo).
  function calcularEdad(fechaNac, refISO) {
    const nac = fechaValida(fechaNac);
    const ref = fechaValida(refISO || D.CONFIG.evento.fechaISO);
    if (!nac || !ref) return null;
    let edad = ref.getFullYear() - nac.getFullYear();
    const m = ref.getMonth() - nac.getMonth();
    if (m < 0 || (m === 0 && ref.getDate() < nac.getDate())) edad--;
    return edad;
  }

  // Valida los datos crudos del formulario. Devuelve { ok, errores, datos }.
  function validarFormulario(raw) {
    const e = {};
    const nombre = (raw.nombre || "").trim().replace(/\s+/g, " ");
    if (!nombre) e.nombre = "Escribe el nombre completo del competidor.";
    else if (nombre.length < LIM.nombreMin || !/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(nombre)) e.nombre = "El nombre no es válido.";
    else if (nombre.split(" ").length < 2) e.nombre = "Escribe nombre y apellido.";

    if (raw.genero !== "Masculino" && raw.genero !== "Femenino") e.genero = "Selecciona el género.";

    let edad = null;
    if (!raw.fechaNacimiento) e.fechaNacimiento = "Ingresa la fecha de nacimiento.";
    else if (!fechaValida(raw.fechaNacimiento)) e.fechaNacimiento = "La fecha de nacimiento no es válida.";
    else if (fechaValida(raw.fechaNacimiento) > new Date()) e.fechaNacimiento = "La fecha de nacimiento no puede ser futura.";
    else {
      edad = calcularEdad(raw.fechaNacimiento);
      if (edad === null || edad < LIM.edadMin) e.fechaNacimiento = "La edad mínima para competir es " + LIM.edadMin + " años.";
      else if (edad > LIM.edadMax) e.fechaNacimiento = "La edad ingresada no es válida.";
    }

    const peso = parseNumero(raw.peso);
    if (raw.peso === "" || raw.peso === undefined) e.peso = "Ingresa el peso en kilogramos.";
    else if (isNaN(peso) || peso < LIM.pesoMin || peso > LIM.pesoMax) e.peso = "El peso debe estar entre " + LIM.pesoMin + " y " + LIM.pesoMax + " kg.";

    const altura = parseNumero(raw.altura);
    if (raw.altura === "" || raw.altura === undefined) e.altura = "Ingresa la altura en metros. Ejemplo: 1.40";
    else if (isNaN(altura) || altura < LIM.alturaMin || altura > LIM.alturaMax) e.altura = "La altura va en metros, entre " + LIM.alturaMin.toFixed(2) + " y " + LIM.alturaMax.toFixed(2) + ". Ejemplo: 1.40";

    if (!raw.cinta || D.CINTAS.indexOf(raw.cinta) === -1) e.cinta = "Selecciona la cinta.";

    const ok = Object.keys(e).length === 0;
    return {
      ok, errores: e,
      datos: ok ? {
        nombre, genero: raw.genero, fechaNacimiento: raw.fechaNacimiento, edad,
        peso, altura, cinta: raw.cinta, gym: (raw.gym || "").trim(),
      } : null,
    };
  }

  // Revisión final antes de enviar por WhatsApp. Devuelve lista de problemas (vacía = completo).
  function problemasDeRegistro(c) {
    const p = [];
    const chequeo = validarFormulario({
      nombre: c.nombre, genero: c.genero, fechaNacimiento: c.fechaNacimiento,
      peso: String(c.peso), altura: String(c.altura), cinta: c.cinta, gym: c.gym,
    });
    Object.keys(chequeo.errores).forEach((k) => p.push(chequeo.errores[k]));
    if (!c.categorias.length) p.push("Falta asignar al menos una categoría.");
    c.categorias.forEach((codigo) => {
      const cat = D.categoriaPorCodigo(codigo);
      if (!cat) { p.push("La categoría " + codigo + " ya no existe."); return; }
      const motivos = D.categoryFilter.evaluar(cat, c);
      if (motivos.length) p.push("Categoría incompatible (" + codigo + "): revisa " + motivos.join(", ") + ".");
    });
    return p;
  }

  D.validation = { LIM, parseNumero, calcularEdad, validarFormulario, problemasDeRegistro };
})(window.DOKAN = window.DOKAN || {});
