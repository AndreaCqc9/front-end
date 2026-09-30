/**
 * componentes.js — Piezas de UI reutilizables
 *
 * Cada componente es una funcion que devuelve HTML. Se componen entre si.
 * No tocan el DOM: devuelven strings. Quien renderiza decide donde van.
 */

/* `escapar` viene de layout.js, que debe cargarse ANTES que este archivo
   (los scripts clasicos se ejecutan en orden de documento). Se usa el global
   que layout.js publica: no se redefine aca. */

/* ------------------------------------------------------------------ tiempo */

const UNIDADES = [
  { limite: 60, divisor: 1, sufijo: 'segundo', plural: 'segundos' },
  { limite: 3600, divisor: 60, sufijo: 'minuto', plural: 'minutos' },
  { limite: 86400, divisor: 3600, sufijo: 'hora', plural: 'horas' },
  { limite: 2592000, divisor: 86400, sufijo: 'día', plural: 'días' },
  { limite: 31536000, divisor: 2592000, sufijo: 'mes', plural: 'meses' },
];

function tiempoRelativo(iso) {
  const segundos = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (segundos < 60) return 'Hace un momento';
  for (const u of UNIDADES) {
    if (segundos < u.limite) {
      const n = Math.floor(segundos / u.divisor);
      return `Hace ${n} ${n === 1 ? u.sufijo : u.plural}`;
    }
  }
  const anios = Math.floor(segundos / 31536000);
  return `Hace ${anios} ${anios === 1 ? 'año' : 'años'}`;
}

function fechaLarga(iso) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

/* Formato abreviado ("12 mar 2026"), que es el que usa la linea de meta del
   detalle de noticia en design/03-detalle-noticia.png. */
function fechaCorta(iso) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

/* ------------------------------------------------------------- componentes */

/** Etiqueta de categoría. `rgba(79,70,229,0.08)` + texto indigo, segun Figma. */
function tag(nombre) {
  return `<a class="tag" href="noticias.html?categoria=${encodeURIComponent(nombre)}">${escapar(nombre)}</a>`;
}

/** Badge de "ultima hora". Fondo rojo solido, texto blanco, radius 4. */
function badge(texto = 'Última hora') {
  return `<span class="badge">${escapar(texto)}</span>`;
}

/** Boton primario indigo, radius 6, padding 12/24, con flecha. */
function botonPrimario(texto, href = '#') {
  return `<a class="btn btn--primary" href="${href}">
    <span>${escapar(texto)}</span>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6"/>
    </svg>
  </a>`;
}

/** Placeholder de imagen con el color de fallback real del diseno. */
function media(noticia, proporcion = '16 / 10') {
  if (noticia.imagen) {
    return `<div class="media" style="aspect-ratio:${proporcion}">
      <img src="${escapar(noticia.imagen)}" alt="" loading="lazy">
    </div>`;
  }
  return `<div class="media media--vacio" style="aspect-ratio:${proporcion}"
    role="img" aria-label="Imagen no disponible"></div>`;
}

/** Tarjeta de noticia. Es LA pieza que comparten Catalogo y Favoritos. */
function card(noticia, { autores = new Map(), categorias = new Map() } = {}) {
  const autor = autores.get(noticia.autor);
  const categoria = categorias.get(noticia.categoria);
  const minutos = Math.max(1, Math.round((noticia.cuerpo?.join(' ').split(/\s+/).length || 400) / 200));

  return `
<article class="card" data-id="${escapar(noticia.id)}">
  ${media(noticia)}
  <div class="card__body">
    <div class="card__meta">
      ${categoria ? tag(categoria.nombre) : ''}
      <span class="card__time">${escapar(tiempoRelativo(noticia.fecha))} • ${minutos} min de lectura</span>
    </div>
    <h3 class="card__title">
      <a href="noticia.html?id=${encodeURIComponent(noticia.id)}">${escapar(noticia.titulo)}</a>
    </h3>
    <p class="card__resumen">${escapar(noticia.resumen)}</p>
    <div class="card__foot">
      <span class="card__autor">${escapar(autor?.nombre || 'Redacción')}</span>
      <button class="card__fav" type="button"
              data-fav="${escapar(noticia.id)}"
              aria-pressed="false"
              aria-label="Marcar ${escapar(noticia.titulo)} como favorita">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z"/></svg>
      </button>
    </div>
  </div>
</article>`;
}

/* ---------------------------------------------------------------- renderer */

/**
 * RENDERER COMPARTIDO — el punto clave del reuso.
 *
 * Catalogo, Favoritos y la grilla de Home son la MISMA funcion con
 * parametros distintos. Favoritos no es "otra pagina": es esta funcion
 * con otro predicado. Por eso no hay HTML ni CSS duplicado.
 *
 * @param {object[]} noticias
 * @param {object}   opts
 * @param {string}   opts.titulo     - heading de la seccion
 * @param {string}   opts.bajada     - subtexto opcional
 * @param {object[]} opts.categorias - categorias, para el filtro
 * @param {string}   opts.activa     - id de categoria filtrada
 * @param {boolean}  opts.conFiltro  - renderiza el selector de categoria
 * @param {string}   opts.vacio      - mensaje cuando no hay resultados
 * @param {string}   opts.accion     - etiqueta del link de cada tarjeta
 */
function renderListado(noticias, opts = {}) {
  const {
    titulo = 'Noticias Destacadas',
    bajada = '',
    categorias = [],
    activa = '',
    conFiltro = false,
    vacio = 'No hay noticias para mostrar.',
    accion = 'Leer noticia completa',
    autores = new Map(),
    catsMap = new Map(),
    nivel = 'h2',
  } = opts;

  const filtro = conFiltro ? renderFiltro(categorias, activa) : '';
  /* `nivel` permite que la pagina que MODAL el listado use su titulo como H1
     (noticias.html, favoritos.html) sin romper el detalle, donde el H1 ya es el
     del articulo y el titulo de la lateral debe seguir siendo un H2. */
  const encabezado = `
      <div class="section__head">
        <div>
          <${nivel} class="section__title">${escapar(titulo)}</${nivel}>
          ${bajada ? `<p class="section__lead">${escapar(bajada)}</p>` : ''}
        </div>
      </div>`;

  if (!noticias.length) {
    return `<section class="section">${encabezado}${filtro}
      <p class="vacio">${escapar(vacio)}</p>
    </section>`;
  }

  const tarjetas = noticias
    .map((n) => card(n, { autores, categorias: catsMap })
      .replace('</article>', `
        <a class="card__accion" href="noticia.html?id=${encodeURIComponent(n.id)}">${escapar(accion)}</a>
      </article>`))
    .join('');

  return `<section class="section">${encabezado}${filtro}
    <div class="grid">${tarjetas}</div>
  </section>`;
}

function renderFiltro(categorias, activa) {
  const opciones = [{ id: '', nombre: 'Todas' }, ...categorias]
    .map((c) => {
      const url = c.id
        ? `noticias.html?categoria=${encodeURIComponent(c.id)}`
        : 'noticias.html';
      const sel = c.id === activa ? ' is-active' : '';
      return `<a class="chip${sel}" href="${url}">${escapar(c.nombre)}</a>`;
    })
    .join('');
  return `<div class="filtro"><span class="filtro__label">Filtrar por Categoría</span>
    <div class="filtro__chips">${opciones}</div></div>`;
}

/* --------------------------------------------------------------- API publica */

/* Script clasico: no hay `export`. Lo que antes se importaba se expone
   explicitamente en `window`. */
window.tiempoRelativo = tiempoRelativo;
window.fechaLarga = fechaLarga;
window.fechaCorta = fechaCorta;
window.tag = tag;
window.badge = badge;
window.botonPrimario = botonPrimario;
window.media = media;
window.card = card;
window.renderListado = renderListado;
