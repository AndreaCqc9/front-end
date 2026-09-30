/**
 * layout.js — Chrome compartido (header + footer)
 *
 * Single source of truth. El nav existe UNA vez, aca. Las 6 paginas HTML
 * solo tienen <div data-layout="header"></div> y <div data-layout="footer"></div>.
 *
 * El estado activo se deriva de location.pathname, no esta hardcodeado
 * en cada pagina. Por eso agregar un link es una linea.
 */

const NAV = [
  { label: 'Inicio',    href: 'index.html' },
  { label: 'Noticias',  href: 'noticias.html' },
  { label: 'Favoritos', href: 'favoritos.html' },
  { label: 'Gestión',    href: 'gestion.html' },
  { label: 'Contacto',  href: 'contacto.html' },
];

const CATEGORIAS_NAV = ['cuantica', 'ia', 'hardware', 'software', 'seguridad'];
const COMPANIA = ['Sobre nosotros', 'Términos de Servicio', 'Contacto Editorial'];

function rutaActual() {
  const archivo = location.pathname.split('/').pop();
  return archivo || 'index.html';
}

function rutaDeDetalle() {
  return new URLSearchParams(location.search).get('id');
}

/** Normaliza un href contra la ruta actual para marcar el link activo. */
function esActivo(href) {
  const actual = rutaActual();
  if (href === 'noticias.html' && actual === 'noticia.html') return true;
  if (href === 'noticias.html' && rutaDeDetalle()) return true;
  return href === actual;
}

function icono(nombre) {
  const trazos = {
    zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z"/>',
    lupa: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    flecha: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true">${trazos[nombre] || ''}</svg>`;
}

function renderHeader({ busqueda = '' } = {}) {
  const items = NAV.map((item) => {
    const activo = esActivo(item.href);
    return `<li>
      <a class="nav__link${activo ? ' is-active' : ''}" href="${item.href}"
         ${activo ? 'aria-current="page"' : ''}>${item.label}</a>
    </li>`;
  }).join('');

  return `
<header class="nav">
  <div class="nav__inner">
    <a class="logo" href="index.html">
      <span class="logo__mark">${icono('zap')}</span>
      <span class="logo__word">TechNews <b>Hub</b></span>
    </a>
    <nav aria-label="Principal">
      <!-- Boton hamburguesa. Solo se ve por debajo de 720px (ver styles.css);
           el nav de escritorio queda exactamente como estaba. -->
      <button class="nav__toggle" type="button"
              aria-expanded="false" aria-controls="nav-principal"
              aria-label="Abrir menú">${icono('menu')}</button>
      <ul class="nav__links" id="nav-principal">${items}</ul>
    </nav>
    <form class="search" role="search" action="noticias.html" method="get">
      <span class="search__icon">${icono('lupa')}</span>
      <input class="search__input" type="search" name="q"
             placeholder="Buscar noticias..." aria-label="Buscar noticias"
             value="${escapar(busqueda)}">
    </form>
  </div>
</header>`;
}

/**
 * Menu movil: colapsa el nav por debajo de 720px.
 *
 * El boton se genera en renderHeader(), asi que esta funcion es el unico
 * lugar que lo registra y lo conecta. Se expone como API publica para que
 * test.html pueda verificar el marcado generado.
 *
 * Accesibilidad (WAI-ARIA disclosure pattern):
 *   - aria-expanded refleja el estado real en el boton
 *   - aria-controls apunta al <ul> que el boton muestra/oculta
 *   - Escape cierra y devuelve el foco al boton
 */
function activarMenu() {
  const boton = document.querySelector('.nav__toggle');
  const lista = document.getElementById('nav-principal');
  if (!boton || !lista) return;

  const estaAbierto = () => boton.getAttribute('aria-expanded') === 'true';

  const cerrar = (devolverFoco = false) => {
    if (!estaAbierto()) return;
    boton.setAttribute('aria-expanded', 'false');
    boton.setAttribute('aria-label', 'Abrir menú');
    lista.classList.remove('is-open');
    if (devolverFoco) boton.focus();
  };

  boton.addEventListener('click', () => {
    const abierto = estaAbierto();
    boton.setAttribute('aria-expanded', String(!abierto));
    boton.setAttribute('aria-label', abierto ? 'Abrir menú' : 'Cerrar menú');
    lista.classList.toggle('is-open', !abierto);
  });

  /* Escape cierra el menu y deja el foco en el boton, para que el teclado
     no quede parado sobre un link que ya no se ve. */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrar(true);
  });

  /* Un click fuera del menu lo cierra. Se delega en document para no tener
     que enganchar un listener a cada nodo. */
  document.addEventListener('click', (e) => {
    if (boton.contains(e.target) || lista.contains(e.target)) return;
    cerrar();
  });

  /* Al pulsar un link el menu se cierra antes de navegar. En una recarga
     normal el estado no sobrevive, pero con bfcache (Atrás/Adelante) la pagina
     vuelve con el DOM intacto: sin esto el menu quedaria abierto al volver. */
  lista.addEventListener('click', (e) => {
    if (e.target.closest('a')) cerrar();
  });
}

function renderFooter({ categorias = [], metricas = [] } = {}) {
  const cats = categorias
    .filter((c) => CATEGORIAS_NAV.includes(c.id))
    .map((c) => `<li><a href="noticias.html?categoria=${c.id}">${escapar(c.nombre)}</a></li>`)
    .join('');

  const comp = COMPANIA.map((t) => `<li><a href="#">${t}</a></li>`).join('');

  const stats = metricas
    .map((m) => `
      <div class="stat">
        <span class="stat__value">${escapar(m.valor)}</span>
        <span class="stat__label">${escapar(m.etiqueta)}</span>
      </div>`)
    .join('');

  return `
<footer class="footer">
  <div class="footer__inner">
    <div class="footer__brand">
      <a class="logo logo--inverse" href="index.html">
        <span class="logo__mark">${icono('zap')}</span>
        <span class="logo__word">TechNews <b>Hub</b></span>
      </a>
      <p class="footer__desc">
        La plataforma líder de periodismo de tecnología independiente en español.
        Datos precisos, análisis profundos.
      </p>
      <div class="footer__stats">${stats}</div>
    </div>
    <nav class="footer__col" aria-label="Categorias">
      <h3 class="footer__title">Categorías</h3>
      <ul>${cats}</ul>
    </nav>
    <nav class="footer__col" aria-label="Compania">
      <h3 class="footer__title">Compañía</h3>
      <ul>${comp}</ul>
    </nav>
  </div>
  <div class="footer__legal">
    <p>© 2026 TechNews Hub. Todos los derechos reservados.</p>
    <nav aria-label="Legal">
      <a href="#">Términos de Servicio</a>
      <a href="contacto.html">Contacto Editorial</a>
    </nav>
  </div>
</footer>`;
}

function escapar(valor) {
  return String(valor ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/**
 * Monta el chrome en la pagina. Se llama una vez por vista.
 * @param {object} datos - { sitio, categorias, metricas }
 * @param {string} busqueda - valor inicial del buscador
 */
function montarLayout(datos, busqueda = '') {
  const header = document.querySelector('[data-layout="header"]');
  const footer = document.querySelector('[data-layout="footer"]');
  if (header) {
    header.innerHTML = renderHeader({ busqueda });
    activarMenu();
  }
  if (footer) {
    footer.innerHTML = renderFooter({
      categorias: datos.categorias || [],
      metricas: datos.metricas || [],
    });
  }
}

/* --------------------------------------------------------------- API publica */

/* Script clasico: no hay `export`. `escapar` ademas queda como global de
   pantalla porque componentes.js lo consume asi. */
window.renderHeader = renderHeader;
window.renderFooter = renderFooter;
window.escapar = escapar;
window.montarLayout = montarLayout;
window.activarMenu = activarMenu;
window.NAV = NAV;
