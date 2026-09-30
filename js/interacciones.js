/**
 * interacciones.js — Comportamiento transversal
 *
 * Lo que mas de una vista necesita: alternar favoritos y validar
 * formularios. Vive aca para que index, noticias, favoritos y noticia
 * no repitan listeners.
 */

/* `leerFavoritos` y `alternarFavorito` vienen de almacen.js, que debe cargarse
   ANTES que este archivo (los scripts clasicos se ejecutan en orden de
   documento). Se usan los globales que almacen.js publica. */

/* --------------------------------------------------------------- favoritos */

/** Refleja el estado persistido en todos los botones[data-fav] del arbol. */
function pintarFavoritos() {
  const favs = leerFavoritos();
  document.querySelectorAll('[data-fav]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(favs.has(btn.dataset.fav)));
  });
}

/**
 * Delegacion de eventos: un solo listener en document, no uno por boton.
 * Sigue funcionando con tarjetas que se re-renderizan.
 */
function activarFavoritos(alCambiar) {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-fav]');
    if (!btn) return;
    e.preventDefault();
    const activo = alternarFavorito(btn.dataset.fav);
    btn.setAttribute('aria-pressed', String(activo));
    alCambiar?.(btn.dataset.fav, activo);
  });
  pintarFavoritos();
}

/* --------------------------------------------------------------- formularios */

const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Extensiones que el sitio ya sabe renderizar en `media()`. Se exporta para
   que el dashboard reuse la misma fuente de verdad y no la duplique. */
const RE_IMAGEN = /\.(png|jpe?g|gif|webp|avif|bmp|svg)(\?.*)?$/i;

/**
 * Valida un form segun sus campos. Muestra el error en el span.error
 * hermano y marca aria-invalid. Sin librerias.
 *
 * Reglas soportadas por campo: `requerido`, `email`, `imagen`, `min`,
 * mas `etiqueta` (para los mensajes) y `verbo` (concordancia: "es obligatoria").
 * @returns {boolean}
 */
function validarForm(form, reglas) {
  let ok = true;
  for (const [campo, regla] of Object.entries(reglas)) {
    const input = form.elements[campo];
    if (!input) continue;
    const valor = String(input.value).trim();
    const error = input.closest('.field')?.querySelector('.error')
      || form.querySelector(`.error[data-for="${campo}"]`);

    let mensaje = '';
    if (regla.requerido && !valor) {
      // `verbo` existe para la concordancia: "La categoría es obligatoria".
      mensaje = `${regla.etiqueta} ${regla.verbo || 'es obligatorio'}.`;
    } else if (valor && regla.email && !RE_EMAIL.test(valor)) mensaje = 'Ingresa un email válido.';
    else if (valor && regla.imagen && !RE_IMAGEN.test(valor)) {
      mensaje = `${regla.etiqueta} debe ser una ruta o URL de imagen (png, jpg, webp…).`;
    } else if (valor && regla.min && valor.length < regla.min) {
      mensaje = `${regla.etiqueta} debe tener al menos ${regla.min} caracteres.`;
    }

    input.setAttribute('aria-invalid', String(Boolean(mensaje)));
    if (error) error.textContent = mensaje;
    if (mensaje) ok = false;
  }
  return ok;
}

/** Limpia el error en cuanto el usuario corrige. */
function limpiarErroresAlEscribir(form) {
  form.addEventListener('input', (e) => {
    const input = e.target;
    if (input.getAttribute('aria-invalid') !== 'true') return;
    const error = input.closest('.field')?.querySelector('.error')
      || form.querySelector(`.error[data-for="${input.name}"]`);
    input.setAttribute('aria-invalid', 'false');
    if (error) error.textContent = '';
  });
}

/* --------------------------------------------------------------- API publica */

/* Script clasico: no hay `export`. Lo que antes se importaba se expone
   explicitamente en `window`. */
window.pintarFavoritos = pintarFavoritos;
window.activarFavoritos = activarFavoritos;
window.validarForm = validarForm;
window.limpiarErroresAlEscribir = limpiarErroresAlEscribir;
window.RE_IMAGEN = RE_IMAGEN;
