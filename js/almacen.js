/**
 * almacen.js — Carga de datos y persistencia
 *
 * Two capas:
 *   1. js/datos.js (window.TNH_DATOS) -> seed, solo lectura
 *   2. localStorage                   -> estado del usuario (favoritos + CRUD)
 *
 * El seed viaja como script clasico, no como fetch: sobre file:// el navegador
 * bloquea fetch y los modulos ES por CORS. Cargar los datos con un <script>
 * comun evita depender de un servidor local.
 */

const CLAVE_FAV = 'tnh:favoritos';
const CLAVE_NOTICIAS = 'tnh:noticias';
const CLAVE_BORRADOS = 'tnh:borrados';

let cache = null;

/* ------------------------------------------------------------------ lectura */

function cargarDatos() {
  if (cache) return cache;
  const seed = window.TNH_DATOS;
  if (!seed) throw new Error('No se encontró window.TNH_DATOS: falta js/datos.js');

  const guardadas = leerNoticiasGuardadas();

  // Las guardadas pisan a las del seed por id, y las nuevas se agregan.
  // Lo borrado desde el dashboard se descarta al final.
  const borrados = new Set(leerBorrados());
  const porId = new Map(seed.noticias.map((n) => [n.id, n]));
  for (const n of guardadas) porId.set(n.id, n);
  for (const id of borrados) porId.delete(id);

  cache = {
    ...seed,
    noticias: [...porId.values()].sort(
      (a, b) => new Date(b.fecha) - new Date(a.fecha)
    ),
    autoresMap: new Map(seed.autores.map((a) => [a.id, a])),
    categoriasMap: new Map(seed.categorias.map((c) => [c.id, c])),
  };
  return cache;
}

function invalidarCache() {
  cache = null;
}

/* --------------------------------------------------------------- favoritos */

function leerFavoritos() {
  try {
    return new Set(JSON.parse(localStorage.getItem(CLAVE_FAV) || '[]'));
  } catch {
    return new Set();
  }
}

function alternarFavorito(id) {
  const favs = leerFavoritos();
  if (favs.has(id)) favs.delete(id);
  else favs.add(id);
  localStorage.setItem(CLAVE_FAV, JSON.stringify([...favs]));
  return favs.has(id);
}

function esFavorito(id) {
  return leerFavoritos().has(id);
}

/* ------------------------------------------------------- CRUD (dashboard) */

function leerNoticiasGuardadas() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_NOTICIAS) || '[]');
  } catch {
    return [];
  }
}

/** Guarda el array completo de noticias editadas/creadas. */
function guardarNoticias(lista) {
  localStorage.setItem(CLAVE_NOTICIAS, JSON.stringify(lista));
  invalidarCache();
}

function crearNoticia(datos) {
  const noticia = {
    ...datos,
    id: `${datos.titulo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)}`,
    fecha: new Date().toISOString(),
    destacada: false,
    /* La imagen viene del formulario. Si el campo se dejo vacio se guarda
       `null`, que es lo que `media()` ya sabe pintar como placeholder
       (`.media--vacio`). Antes se hardcodeaba `null` y se perdia el valor. */
    imagen: datos.imagen || null,
  };
  guardarNoticias([...leerNoticiasGuardadas(), noticia]);
  return noticia;
}

/**
 * UPSERT. Una noticia del seed no tiene fila propia en localStorage, asi que
 * un `map` no la encuentra y la edicion se pierde en silencio. Se escribe la
 * copia completa modificada, que `cargarDatos()` vuelve a pisar sobre el seed.
 */
function actualizarNoticia(id, cambios) {
  const guardadas = leerNoticiasGuardadas();
  const limpia = soloDefinidos(cambios);
  const i = guardadas.findIndex((n) => n.id === id);

  if (i >= 0) {
    guardadas[i] = { ...guardadas[i], ...limpia };
  } else {
    const seed = cache?.noticias.find((n) => n.id === id);
    if (!seed) throw new Error(`No existe la noticia "${id}"`);
    guardadas.push({ ...seed, ...limpia });
  }
  guardarNoticias(guardadas);
}

/**
 * Borrado en dos piezas: quita la fila si es creada por el usuario, y si es
 * del seed la registra en `tnh:borrados` para que `cargarDatos()` la oculte.
 * Sin esto, editar o borrar una noticia del seed no hacia nada.
 */
function eliminarNoticia(id) {
  guardarNoticias(leerNoticiasGuardadas().filter((n) => n.id !== id));

  const borrados = new Set(leerBorrados());
  borrados.add(id);
  localStorage.setItem(CLAVE_BORRADOS, JSON.stringify([...borrados]));

  const favs = leerFavoritos();
  favs.delete(id);
  localStorage.setItem(CLAVE_FAV, JSON.stringify([...favs]));
}

function leerBorrados() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_BORRADOS) || '[]');
  } catch {
    return [];
  }
}

/** Evita guardar campos undefined: JSON los descarta y rompe el merge. */
function soloDefinidos(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));
}

/* ------------------------------------------------------------------ busqueda */

/* Quita los diacriticos para que la busqueda no dependa de como el usuario
   escriba. Sin esto, "cuantico" no encuentra "cuánticos". Mismo patron que
   usa crearNoticia() para el id y noticias.html para el filtro de categoria. */
function sinAcentos(s) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function buscar(consulta, noticias) {
  const q = sinAcentos(consulta.trim());
  if (!q) return noticias;
  return noticias.filter((n) =>
    sinAcentos(n.titulo).includes(q) ||
    sinAcentos(n.resumen).includes(q)
  );
}

/* --------------------------------------------------------------- API publica */

/* Script clasico: no hay `export`. Lo que antes se importaba se expone
   explicitamente en `window`, asi cada pagina lo sigue usando por nombre. */
window.cargarDatos = cargarDatos;
window.invalidarCache = invalidarCache;
window.leerFavoritos = leerFavoritos;
window.alternarFavorito = alternarFavorito;
window.esFavorito = esFavorito;
window.leerNoticiasGuardadas = leerNoticiasGuardadas;
window.guardarNoticias = guardarNoticias;
window.crearNoticia = crearNoticia;
window.actualizarNoticia = actualizarNoticia;
window.eliminarNoticia = eliminarNoticia;
window.leerBorrados = leerBorrados;
window.buscar = buscar;
