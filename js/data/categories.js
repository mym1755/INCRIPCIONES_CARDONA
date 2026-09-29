/* =========================================================
   data/categories.js — configuración estructurada de categorías
   Cada categoría es un objeto con reglas; el filtro las lee tal cual.
   Para agregar/editar una categoría NO hay que tocar la lógica.

   Category {
     id, codigo, nombre, modalidad,
     genero: "Masculino" | "Femenino" | "Mixto",
     edadMin, edadMax, edadTexto,
     grado,
     cintas: string[] | null,          // null = cualquier cinta
     pesoMin, pesoMax,                 // kg   (null = sin regla)
     alturaMin, alturaMax              // m    (null = sin regla)
   }
   ========================================================= */
(function (D) {
  D.CINTAS = ["Blanca", "Amarilla", "Naranja", "Morada", "Azul", "Verde", "Café", "Roja", "Negra"];

  // Qué cintas entran en cada grado (las categorías se filtran con esto).
  //   Principiante: Blanca, Amarilla, Naranja
  //   Intermedio:   Morada, Azul
  //   Avanzado:     Verde, Café, Roja
  //   Cinta Negra:  Negra
  D.GRADOS = [
    { nombre: "Principiante", cintas: ["Blanca", "Amarilla", "Naranja"] },
    { nombre: "Intermedio",   cintas: ["Morada", "Azul"] },
    { nombre: "Avanzado",     cintas: ["Verde", "Café", "Roja"] },
    { nombre: "Cinta Negra",  cintas: ["Negra"] },
  ];

  D.MODALIDADES = [
    { id: "cuartetas", nombre: "Cuartetas / Puntos Libre", prefijo: "CPL",
      descripcion: "Pelea por puntos en grupos de cuatro competidores.", variasPorCompetidor: false },
    { id: "kata-arma", nombre: "Kata con Arma", prefijo: "KA",
      descripcion: "Ejecución de kata utilizando arma tradicional.", variasPorCompetidor: false },
    { id: "kata-tradicional", nombre: "Kata Tradicional", prefijo: "KT",
      descripcion: "Ejecución de formas tradicionales sin arma.", variasPorCompetidor: false },
    { id: "especiales", nombre: "Categorías Especiales", prefijo: "ESP",
      descripcion: "Divisiones únicas fuera de la estructura general.", variasPorCompetidor: true },
  ];

  const EDADES = [[3, 5], [6, 7], [8, 9], [10, 11], [12, 13], [14, 15], [16, 17], [18, 99]];
  const edadTexto = (min, max) => (max >= 99 ? min + "+ años" : min + " a " + max + " años");
  const pad = (n) => String(n).padStart(3, "0");

  let nextId = 1;
  const nuevaCategoria = (o) => Object.assign({
    id: nextId++, cintas: null,
    pesoMin: null, pesoMax: null, alturaMin: null, alturaMax: null,
  }, o);

  const lista = [];
  const modNombre = (id) => D.MODALIDADES.find((m) => m.id === id).nombre;

  // CPL-001 … CPL-064  (edad × género × grado)
  let n = 1;
  EDADES.forEach(([min, max]) => {
    ["Masculino", "Femenino"].forEach((genero) => {
      D.GRADOS.forEach((g) => {
        lista.push(nuevaCategoria({
          codigo: "CPL-" + pad(n++), modalidad: "cuartetas", genero,
          nombre: modNombre("cuartetas") + " · " + edadTexto(min, max) + " · " + g.nombre + " · " + genero,
          edadMin: min, edadMax: max, edadTexto: edadTexto(min, max), grado: g.nombre, cintas: g.cintas,
        }));
      });
    });
  });

  // KA-001 … KA-032  y  KT-001 … KT-032  (edad × grado, mixto)
  [["KA", "kata-arma"], ["KT", "kata-tradicional"]].forEach(([prefijo, modalidad]) => {
    let k = 1;
    EDADES.forEach(([min, max]) => {
      D.GRADOS.forEach((g) => {
        lista.push(nuevaCategoria({
          codigo: prefijo + "-" + pad(k++), modalidad, genero: "Mixto",
          nombre: modNombre(modalidad) + " · " + edadTexto(min, max) + " · " + g.nombre + " · Mixto",
          edadMin: min, edadMax: max, edadTexto: edadTexto(min, max), grado: g.nombre, cintas: g.cintas,
        }));
      });
    });
  });

  // Especiales
  const negra = ["Negra"];
  [
    ["OPW-1", "Gran Campeón", "Masculino", 18, 99, "Cinta Negra", negra],
    ["OPW-2", "Gran Campeón", "Femenino",  18, 99, "Cinta Negra", negra],
    ["SN-01", "Seniors",      "Masculino", 25, 99, "Cinta Negra", negra],
    ["SN-02", "Seniors",      "Femenino",  25, 99, "Cinta Negra", negra],
  ].forEach(([codigo, titulo, genero, min, max, grado, cintas]) => {
    lista.push(nuevaCategoria({
      codigo, modalidad: "especiales", genero, grado, cintas,
      nombre: titulo + " · " + edadTexto(min, max) + " · " + grado + " · " + genero,
      edadMin: min, edadMax: max, edadTexto: edadTexto(min, max),
    }));
  });
  lista.push(nuevaCategoria({
    codigo: "KEX-007", modalidad: "especiales", genero: "Mixto", grado: "Toda cinta", cintas: null,
    nombre: "Kata Exhibición General · Toda edad · Toda cinta · Mixto",
    edadMin: 3, edadMax: 99, edadTexto: "Toda edad",
  }));

  D.CATEGORIAS = lista;
  D.categoriaPorCodigo = (codigo) => lista.find((c) => c.codigo === codigo) || null;
  D.categoriasDeModalidad = (id) => lista.filter((c) => c.modalidad === id);
  D.modalidadPorId = (id) => D.MODALIDADES.find((m) => m.id === id) || null;
})(window.DOKAN = window.DOKAN || {});
