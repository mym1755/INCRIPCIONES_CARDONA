/* =========================================================
   config.js — ÚNICO lugar para cambiar los datos del evento
   ========================================================= */
(function (D) {
  D.CONFIG = {
    marca: "DOKAN SYSTEM",
    subtitulo: "Sistema de gestión del torneo",

    evento: {
      nombre: "Torneo de Karate Dragones Cardona",
      fechaISO: "2026-10-11",            // se usa para calcular la edad el día del torneo
      fechaCorta: "11 OCT 2026",
      fechaLarga: "Domingo 11 de octubre de 2026",
      hora: "8:30 AM",
      lugar: "Colegio Mixto Belén",
      organizador: "Sensei Héctor Cardona",
      telefonoInfo: "5880-6740",         // teléfono de información (flyer)
      facebook: "Dragones Cardona",
    },

    precios: {
      categoria: 225,   // Q por categoría
      publico: 40,
      parqueoCarros: 25,
      parqueoMotos: 15,
    },

    // WhatsApp de contacto. Guatemala = 502.
    whatsapp: {
      codigoPais: "502",
      numero: "35962132",
    },

    // Destino del pre-registro completo.
    // El envío se realiza mediante Web3Forms, compatible con GitHub Pages.
    // accessKey: la clave que llega al correo al crearla en https://web3forms.com
    // (no es secreta; el correo que se use al crearla es el que recibe los pre-registros).
    email: {
      destino: "eriquemym1755@gmail.com",
      accessKey: "232a47a0-e675-4a03-9f94-defe484d70ad",
    },

    // Rutas EXACTAS (respeta mayúsculas/minúsculas: GitHub Pages distingue).
    imagenes: {
      logoHeader: "assets/LOGIN_LOGO.png",
      logoTorneo: "assets/logo.jpg",
    },

    storageKey: "dokan_competidores_v2",
  };

  if (D.CONFIG.whatsapp.numero.length !== 8) {
    console.warn(
      "[DOKAN] El número de WhatsApp tiene " + D.CONFIG.whatsapp.numero.length +
      " dígitos; los números de Guatemala tienen 8. Revisa js/config.js."
    );
  }
})(window.DOKAN = window.DOKAN || {});
