/* =========================================================
   utils/dom.js — helpers de DOM e iconos
   ========================================================= */
(function (D) {
  const ICONS = {
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.5 3.2-5.5 7-5.5s7 2 7 5.5"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.8c2.4.6 4 2.2 4 5.2"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    pin: '<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    whatsapp: '<path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-5.2A8.5 8.5 0 1 1 21 11.5z"/><path d="M9 9c.5 2.5 2.5 4.5 5 5l1.2-1.2-2-1-.9.7c-.8-.4-1.6-1.2-2-2l.7-.9-1-2z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    tag: '<path d="M20 12 12 20 3 11V3h8z"/><circle cx="7.5" cy="7.5" r="1"/>',
    send: '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',
    alert: '<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    car: '<path d="M5 16V11l2-5h10l2 5v5M3 16h18M7 19v-3M17 19v-3"/><circle cx="8" cy="13" r=".6"/><circle cx="16" cy="13" r=".6"/>',
    ticket: '<path d="M3 8a2 2 0 0 0 0 4v4h18v-4a2 2 0 0 1 0-4V6H3z"/><path d="M13 6v12"/>',
    facebook: '<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/>',
    clipboard: '<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4h6v3H9zM9 12h6M9 16h4"/>',
    award: '<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-3 5 3-1.5-7"/>',
  };

  D.dom = {
    $: (sel, root) => (root || document).querySelector(sel),
    $$: (sel, root) => Array.from((root || document).querySelectorAll(sel)),
    esc(s) {
      return String(s === null || s === undefined ? "" : s).replace(/[&<>"']/g, (c) => (
        { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
      ));
    },
    icon(name, size) {
      const s = size || 18;
      return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
        'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        (ICONS[name] || "") + "</svg>";
    },
    money: (n) => "Q" + Number(n).toFixed(2),
    toast(msg, tipo) {
      let el = document.getElementById("toast");
      if (!el) {
        el = document.createElement("div");
        el.id = "toast"; el.className = "toast";
        el.setAttribute("role", "status"); el.setAttribute("aria-live", "polite");
        document.body.appendChild(el);
      }
      el.textContent = msg;
      el.className = "toast show " + (tipo || "");
      clearTimeout(el._t);
      el._t = setTimeout(() => el.classList.remove("show"), 3800);
    },
    scrollTo(el) { if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); },
  };
})(window.DOKAN = window.DOKAN || {});
