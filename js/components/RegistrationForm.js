/* components/RegistrationForm.js — formulario de registro del competidor */
(function (D) {
  const ic = D.dom.icon;

  function campo(o) {
    return `
      <div class="field ${o.full ? "full" : ""}">
        <label for="f-${o.name}">${o.label}${o.req ? '<span class="req" aria-hidden="true">*</span>' : ""}</label>
        ${o.control}
        ${o.hint ? `<span class="hint">${o.hint}</span>` : ""}
        <p class="err" id="err-${o.name}" role="alert"></p>
      </div>`;
  }

  D.RegistrationForm = {
    mount(el) {
      const hoy = new Date().toISOString().slice(0, 10);
      const academiaGuardada = D.storage.loadAcademy();
      const opt = (arr, ph) => `<option value="">${ph}</option>` + arr.map((v) => `<option>${v}</option>`).join("");
      el.innerHTML = `
        <div class="panel">
          <div class="panel-head"><h3><span class="ico">${ic("user", 20)}</span>Registrar competidor</h3></div>
          <form id="form-registro" novalidate autocomplete="off">
            <div class="form-grid">
              ${campo({ name: "nombre", label: "Nombre completo", req: true, full: true,
                control: `<input id="f-nombre" name="nombre" type="text" placeholder="Nombre y apellido" maxlength="80" aria-describedby="err-nombre">` })}
              ${campo({ name: "genero", label: "Género", req: true,
                control: `<select id="f-genero" name="genero" aria-describedby="err-genero">${opt(["Masculino", "Femenino"], "Seleccione…")}</select>` })}
              ${campo({ name: "fechaNacimiento", label: "Fecha de nacimiento", req: true,
                control: `<input id="f-fechaNacimiento" name="fechaNacimiento" type="date" max="${hoy}" aria-describedby="err-fechaNacimiento">` })}
              ${campo({ name: "edad", label: "Edad el día del torneo",
                control: `<input id="f-edad" name="edad" type="text" readonly placeholder="Se calcula sola" tabindex="-1">` })}
              ${campo({ name: "cinta", label: "Cinta", req: true,
                control: `<select id="f-cinta" name="cinta" aria-describedby="err-cinta">${opt(D.CINTAS, "Seleccione…")}</select>` })}
              ${campo({ name: "peso", label: "Peso (kg)", req: true,
                control: `<input id="f-peso" name="peso" type="number" inputmode="decimal" step="0.1" min="${D.validation.LIM.pesoMin}" max="${D.validation.LIM.pesoMax}" placeholder="Ej. 35" aria-describedby="err-peso">` })}
              ${campo({ name: "altura", label: "Altura (metros)", req: true, hint: "Ejemplo: 1.25 · 1.40 · 1.55 · 1.70",
                control: `<input id="f-altura" name="altura" type="number" inputmode="decimal" step="0.01" min="${D.validation.LIM.alturaMin}" max="${D.validation.LIM.alturaMax}" placeholder="Ej. 1.40" aria-describedby="err-altura">` })}
              ${campo({ name: "gym", label: "GYM / Academia", full: true,
                control: `<input id="f-gym" name="gym" type="text" list="academias-sugeridas" value="${D.dom.esc(academiaGuardada)}" placeholder="Nombre del gimnasio o academia" maxlength="80">
                <datalist id="academias-sugeridas">${academiaGuardada ? `<option value="${D.dom.esc(academiaGuardada)}">` : ""}</datalist>` })}
            </div>
            <div class="form-actions">
              <button class="btn btn-primary" type="submit">${ic("check")} Registrar competidor</button>
              <button class="btn btn-outline" type="reset">Limpiar</button>
            </div>
            <p class="form-note">Los campos con * son obligatorios. La edad se calcula al día del torneo (${D.CONFIG.evento.fechaCorta}).</p>
          </form>
        </div>`;

      const form = D.dom.$("#form-registro", el);
      const get = (n) => form.elements[n];
      const setErr = (name, msg) => {
        const p = D.dom.$("#err-" + name, el), input = get(name);
        if (p) p.textContent = msg || "";
        if (input) { if (msg) input.setAttribute("aria-invalid", "true"); else input.removeAttribute("aria-invalid"); }
      };
      const limpiar = () => ["nombre", "genero", "fechaNacimiento", "cinta", "peso", "altura"].forEach((n) => setErr(n, ""));

      const actualizarEdad = () => {
        const e = D.validation.calcularEdad(get("fechaNacimiento").value);
        get("edad").value = e === null || e < 0 ? "" : e + " años";
      };
      get("fechaNacimiento").addEventListener("input", actualizarEdad);
      get("fechaNacimiento").addEventListener("change", actualizarEdad);
      form.addEventListener("input", (ev) => { if (ev.target.name) setErr(ev.target.name, ""); });
      form.addEventListener("reset", () => setTimeout(() => { limpiar(); get("edad").value = ""; }, 0));

      form.addEventListener("submit", (ev) => {
        ev.preventDefault();
        const raw = {};
        ["nombre", "genero", "fechaNacimiento", "peso", "altura", "cinta", "gym"].forEach((n) => { raw[n] = get(n).value; });
        const r = D.validation.validarFormulario(raw);
        limpiar();
        if (!r.ok) {
          Object.keys(r.errores).forEach((k) => setErr(k, r.errores[k]));
          const primero = Object.keys(r.errores)[0];
          get(primero).focus();
          D.dom.toast("Revisa los campos marcados en rojo.", "error");
          return;
        }
        const c = D.store.agregar(r.datos);
        const academia = D.storage.loadAcademy();
        form.reset();
        get("gym").value = academia;
        D.dom.toast(c.nombre + " fue registrado. Ahora asigna su categoría.", "ok");
        D.dom.scrollTo(document.getElementById("bloque-categorias"));
      });
    },
  };
})(window.DOKAN = window.DOKAN || {});
