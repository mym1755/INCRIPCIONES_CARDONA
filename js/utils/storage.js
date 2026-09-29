/* =========================================================
   utils/storage.js — persistencia en el navegador (localStorage)
   ========================================================= */
(function (D) {
  let memoria = [];
  const academyKey = D.CONFIG.storageKey + "_academia";

  D.storage = {
    load() {
      try {
        const data = JSON.parse(localStorage.getItem(D.CONFIG.storageKey));
        return Array.isArray(data) ? data : [];
      } catch (e) { return memoria; }
    },
    save(lista) {
      memoria = lista;
      try { localStorage.setItem(D.CONFIG.storageKey, JSON.stringify(lista)); } catch (e) { /* solo memoria */ }
    },
    loadAcademy() {
      try { return localStorage.getItem(academyKey) || ""; } catch (e) { return ""; }
    },
    saveAcademy(nombre) {
      const valor = String(nombre || "").trim();
      try {
        if (valor) localStorage.setItem(academyKey, valor);
        else localStorage.removeItem(academyKey);
      } catch (e) { /* solo memoria */ }
      return valor;
    },
  };
})(window.DOKAN = window.DOKAN || {});
