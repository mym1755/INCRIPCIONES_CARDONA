# DOKAN SYSTEM — Guía de la versión 2

## 1. Qué cambió

Se conservó la tecnología (HTML + CSS + JavaScript puro, funciona en GitHub Pages) y se ordenó en carpetas:

```
index.html              Página principal (inscripción)
categorias.html         Página de categorías (la misma URL de antes sigue funcionando)
assets/
  LOGIN_LOGO.png        ← TÚ lo colocas (logo DOKAN SYSTEM)
  logo.jpg              ← TÚ lo colocas (logo del torneo)
css/                    base.css · layout.css · components.css
js/
  config.js             ★ datos del evento, precios, número de WhatsApp, rutas de logos
  data/categories.js    ★ categorías estructuradas (género, edadMin/Max, peso, altura, cintas)
  types/competitor.js   estructura y estados del competidor
  utils/                categoryFilter · validation · whatsapp · storage · dom
  store.js              estado de la aplicación
  components/           Header · Hero · EventInfo · CategoryCard · CategoriesSection ·
                        FlowSteps · RegistrationForm · CompetitorList · CategorySelector ·
                        ReviewPanel · WhatsAppButton · Contact · Footer
  app.js                arranque
```

**Archivos viejos:** `style.css` y `script.js` de la versión anterior (en la raíz del repo) ya no se usan; puedes borrarlos.
`index.html` y `categorias.html` se reemplazan por los nuevos.

## 2. Antes de subir: coloca los logos (importante)

En tu captura los logos salían rotos: la imagen no estaba en la ruta que la página pedía.
Esta vez las rutas son exactamente:

- `assets/LOGIN_LOGO.png`
- `assets/logo.jpg`

Copia tus dos archivos a la carpeta `assets/` **con esos nombres exactos**. GitHub Pages distingue mayúsculas de minúsculas.

## 3. Probar en tu computadora (VS Code)

1. Abre la carpeta del proyecto en VS Code.
2. Instala la extensión **Live Server**, clic derecho en `index.html` → **Open with Live Server**.
3. Prueba en tres tamaños: F12 → botón de dispositivos (📱) → elige *iPhone*, *iPad* y pantalla normal. Revisa que no haya barra de scroll horizontal.

## 4. Subir a GitHub

**Desde la web:** entra al repo → **Add file → Upload files** → arrastra `index.html`, `categorias.html` y las carpetas `assets`, `css` y `js` completas → **Commit changes**. Espera 1–2 minutos y recarga con `Ctrl + F5`.

**Con Git:**
```bash
git add index.html categorias.html assets css js
git rm style.css script.js
git commit -m "DOKAN SYSTEM v2: asignación inteligente de categorías y envío por WhatsApp"
git push
```

## 5. Qué editar y dónde

| Quiero cambiar…                                   | Archivo |
|----------------------------------------------------|---------|
| Fecha, hora, lugar, precios, teléfono, WhatsApp     | `js/config.js` |
| Agregar / modificar una categoría, con peso o altura | `js/data/categories.js` |
| Qué cintas entran en Principiante/Intermedio/Avanzado | `js/data/categories.js` → `D.GRADOS` |
| Límites de validación (peso, altura, edad mínima)   | `js/utils/validation.js` → `LIM` |
| Colores y tipografía                                | `css/base.css` → `:root` |

Ejemplo de categoría con reglas de peso y altura (se agrega a la lista en `categories.js`):
```js
nuevaCategoria({ codigo: "KU-010", modalidad: "cuartetas", genero: "Masculino",
  nombre: "Kumite Masculino 10 años", edadMin: 10, edadMax: 10, edadTexto: "10 años",
  grado: "Principiante", cintas: ["Amarilla"], pesoMin: 30, pesoMax: 35 })
```
El filtro ya evalúa género, edad, peso, altura y cinta: no hay que tocar la lógica.

## 6. Cómo funciona el flujo

Registrar → Lista → Asignar categoría → Revisar → WhatsApp (el indicador de pasos avanza solo).

- La **edad se calcula al día del torneo** (11 oct 2026), no al día de hoy.
- Un competidor puede tener **una o varias categorías**, incluso más de una dentro de la misma modalidad, y nunca se permite repetir el mismo código. El total se calcula a **Q225 por categoría**.
- El envío final se realiza en **un solo correo** al destino configurado en `js/config.js`.
- La lista se guarda en el navegador del dispositivo (localStorage); no hay base de datos.


## 7. Envío por correo

Al pulsar **Enviar pre-registro** la información se manda directo a `eriquemym1755@gmail.com` (FormSubmit, vía AJAX), sin abrir Gmail ni pedir confirmaciones. Solo aparece el aviso **"Información enviada"**.

**Activación (una sola vez):** la primera vez que se envíe algo, FormSubmit manda un correo de activación a esa dirección. Abre ese correo y pulsa **Activate Form**. Hasta entonces, el envío mostrará un aviso de que falta activar el correo.

Para probar en tu PC usa Live Server (no abras el .html con doble clic): FormSubmit no acepta envíos desde `file://`.

## 8. Academia recordada

La última academia utilizada se guarda en `localStorage` y queda sugerida para los siguientes competidores. Se puede cambiar manualmente en cualquier momento.
