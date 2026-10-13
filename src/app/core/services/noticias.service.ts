import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { Autor, Categoria, Metrica, Noticia, Sitio } from '../models/models';
import { SEED } from '../data/seed';
import { FavoritosService } from './favoritos.service';

const CLAVE_NOTICIAS = 'tnh:noticias';
const CLAVE_BORRADOS = 'tnh:borrados';

export type NoticiaNueva = {
  titulo: string;
  categoria: string;
  autor: string;
  resumen: string;
  cuerpo: string[];
  imagen?: string | null;
};

/**
 * Port de legacy/js/almacen.js.
 *
 * Dos capas: el seed (SEED, solo lectura) y localStorage (estado del usuario).
 * Las noticias guardadas pisan al seed por id, las nuevas se agregan y lo
 * borrado se descarta al final. Orden descendente por fecha.
 */
@Injectable({ providedIn: 'root' })
export class NoticiasService {
  private readonly favoritosService = inject(FavoritosService);

  private readonly _guardadas = signal<Noticia[]>(this.leerNoticiasGuardadas());
  private readonly _borrados = signal<ReadonlySet<string>>(new Set(this.leerBorrados()));

  readonly sitio: Signal<Sitio> = computed(() => SEED.sitio);
  readonly categorias: Signal<Categoria[]> = computed(() => SEED.categorias);
  readonly metricas: Signal<Metrica[]> = computed(() => SEED.metricas);
  readonly autores: Signal<Map<string, Autor>> = computed(
    () => new Map(SEED.autores.map((a) => [a.id, a] as const)),
  );
  readonly categoriasMap: Signal<Map<string, Categoria>> = computed(
    () => new Map(SEED.categorias.map((c) => [c.id, c] as const)),
  );
  readonly noticias: Signal<Noticia[]> = computed(() => {
    const porId = new Map<string, Noticia>(SEED.noticias.map((n) => [n.id, n] as const));
    for (const n of this._guardadas()) porId.set(n.id, n);
    for (const id of this._borrados()) porId.delete(id);
    return [...porId.values()].sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
    );
  });

  buscar(consulta: string, fuente?: Noticia[]): Noticia[] {
    const base = fuente ?? this.noticias();
    const q = this.sinAcentos(consulta.trim());
    if (!q) return base;
    return base.filter(
      (n) => this.sinAcentos(n.titulo).includes(q) || this.sinAcentos(n.resumen).includes(q),
    );
  }

  porId(id: string): Noticia | undefined {
    return this.noticias().find((n) => n.id === id);
  }

  crear(datos: NoticiaNueva): Noticia {
    const noticia: Noticia = {
      id: this.slug(datos.titulo),
      titulo: datos.titulo,
      categoria: datos.categoria,
      autor: datos.autor,
      resumen: datos.resumen,
      cuerpo: datos.cuerpo,
      fecha: new Date().toISOString(),
      destacada: false,
      // Si el campo se dejo vacio se guarda null, que `media()` pinta como placeholder.
      imagen: datos.imagen || null,
    };
    this.guardarNoticias([...this.leerNoticiasGuardadas(), noticia]);
    return noticia;
  }

  /**
   * UPSERT. Una noticia del seed no tiene fila propia en localStorage, asi que
   * un `map` no la encuentra y la edicion se pierde en silencio. Se escribe la
   * copia completa modificada, que la composicion de `noticias` vuelve a pisar
   * sobre el seed.
   */
  actualizar(id: string, cambios: Partial<Noticia>): void {
    const guardadas = this.leerNoticiasGuardadas();
    const limpia = this.soloDefinidos(cambios);
    const i = guardadas.findIndex((n) => n.id === id);

    if (i >= 0) {
      guardadas[i] = { ...guardadas[i], ...limpia };
    } else {
      const seed = SEED.noticias.find((n) => n.id === id);
      if (!seed) throw new Error(`No existe la noticia "${id}"`);
      guardadas.push({ ...seed, ...limpia });
    }
    this.guardarNoticias(guardadas);
  }

  /**
   * Borrado en dos piezas: quita la fila si es creada por el usuario, y si es
   * del seed la registra en `tnh:borrados` para que la composicion la oculte.
   * Tambien la saca de favoritos.
   */
  eliminar(id: string): void {
    this.guardarNoticias(this.leerNoticiasGuardadas().filter((n) => n.id !== id));

    const borrados = new Set(this.leerBorrados());
    borrados.add(id);
    localStorage.setItem(CLAVE_BORRADOS, JSON.stringify([...borrados]));
    this._borrados.set(borrados);

    this.favoritosService.quitar(id);
  }

  private guardarNoticias(lista: Noticia[]): void {
    localStorage.setItem(CLAVE_NOTICIAS, JSON.stringify(lista));
    this._guardadas.set(lista);
  }

  private leerNoticiasGuardadas(): Noticia[] {
    try {
      return JSON.parse(localStorage.getItem(CLAVE_NOTICIAS) || '[]');
    } catch {
      return [];
    }
  }

  private leerBorrados(): string[] {
    try {
      return JSON.parse(localStorage.getItem(CLAVE_BORRADOS) || '[]');
    } catch {
      return [];
    }
  }

  /** Evita guardar campos undefined: JSON los descarta y rompe el merge. */
  private soloDefinidos(obj: Partial<Noticia>): Partial<Noticia> {
    const limpio: Partial<Noticia> = { ...obj };
    for (const clave of Object.keys(limpio) as (keyof Noticia)[]) {
      if (limpio[clave] === undefined) delete limpio[clave];
    }
    return limpio;
  }

  /** Quita los diacriticos para que la busqueda no dependa de como se escriba. */
  private sinAcentos(valor: string): string {
    return valor.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  private slug(titulo: string): string {
    return this.sinAcentos(titulo)
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60);
  }
}
