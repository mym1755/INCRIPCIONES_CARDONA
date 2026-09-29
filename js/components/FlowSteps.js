/* components/FlowSteps.js — indicador visual del flujo de inscripción */
(function (D) {
  const PASOS = [
    ["Registrar", "Datos del competidor"],
    ["Lista", "Registra todos"],
    ["Categorías", "Una o varias por competidor"],
    ["Pre-registro", "Revisa todo"],
    ["Enviar correo", "Todos en un solo envío"],
  ];

  function pasoActual() {
    const st = D.store.state;
    if (!st.competidores.length) return 1;
    if (!st.competidores.every((c) => c.categorias.length)) return st.seleccionadoId ? 3 : 2;
    if (!st.competidores.every((c) => D.validation.problemasDeRegistro(c).length === 0)) return 4;
    if (!st.competidores.every((c) => c.enviado)) return 5;
    return 6;
  }

  D.FlowSteps = {
    mount(el) {
      const render = () => {
        const actual = pasoActual();
        el.innerHTML = `<ol class="flow" aria-label="Pasos de la inscripción">` + PASOS.map((p, i) => {
          const n = i + 1;
          const cls = n < actual ? "done" : n === actual ? "active" : "";
          return `<li class="${cls}"${n === actual ? ' aria-current="step"' : ""}>
            <span class="num">${n < actual ? D.dom.icon("check", 16) : n}</span>
            <span class="txt">${p[0]}<small>${p[1]}</small></span></li>`;
        }).join("") + `</ol>`;
      };
      D.store.subscribe(render); render();
    },
  };
})(window.DOKAN = window.DOKAN || {});
