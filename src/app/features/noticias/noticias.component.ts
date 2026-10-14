import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Categoria, Noticia } from '../../core/models/models';
import { NoticiasService } from '../../core/services/noticias.service';
import { NoticiaGridComponent } from '../../shared/ui/noticia-grid/noticia-grid.component';

/**
 * Port de `legacy/noticias.html`: catalogo con filtro por categoria y busqueda
 * por texto. El filtro llega por `?categoria=` (id o nombre) y la busqueda por
 * `?q=`; ambos se leen de forma reactiva desde queryParamMap.
 */
@Component({
  selector: 'app-noticias',
  imports: [NoticiaGridComponent],
  template: `
    <main id="main">
      <div class="container">
        <app-noticia-grid
          [noticias]="lista()"
          [titulo]="titulo()"
          [bajada]="bajada()"
          [categorias]="categorias()"
          [activa]="activa()"
          [conFiltro]="true"
          [vacio]="vacio()"
          accion="Leer noticia completa"
          nivel="h1"
        />
      </div>
    </main>
  `,
})
export class NoticiasComponent {
  private readonly noticias = inject(NoticiasService);
  private readonly route = inject(ActivatedRoute);

  private readonly params = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  protected readonly categorias = this.noticias.categorias;

  private readonly catParam = computed(() => (this.params().get('categoria') ?? '').trim());
  private readonly q = computed(() => (this.params().get('q') ?? '').trim());

  /**
   * El filtro llega de dos lugares: los chips y el footer mandan el id, el
   * componente `app-tag` manda el nombre. Se aceptan ambos y siempre se
   * resuelve al id, que es lo que la grilla necesita para marcar el chip.
   */
  private readonly categoria = computed<Categoria | null>(() => {
    const parametro = this.catParam();
    if (!parametro) return null;
    return (
      this.categorias().find((c) => c.id === parametro) ??
      this.categorias().find((c) => this.sinAcentos(c.nombre) === this.sinAcentos(parametro)) ??
      null
    );
  });

  protected readonly activa = computed(() => this.categoria()?.id ?? '');

  protected readonly lista = computed<Noticia[]>(() => {
    const categoria = this.categoria();
    const base = categoria
      ? this.noticias.noticias().filter((n) => n.categoria === categoria.id)
      : this.noticias.noticias();
    return this.noticias.buscar(this.q(), base);
  });

  protected readonly titulo = computed(() => {
    if (this.q()) return 'Resultados de búsqueda';
    return this.categoria()?.nombre ?? 'Catálogo de Noticias';
  });

  protected readonly bajada = computed(() => {
    const total = this.lista().length;
    if (this.q()) return `${this.plural(total, 'resultado', 'resultados')} para «${this.q()}».`;
    if (this.categoria()) {
      return `${this.plural(total, 'noticia', 'noticias')} publicadas en esta sección.`;
    }
    return 'Todo el archivo de TechNews Hub, ordenado por fecha de publicación.';
  });

  protected readonly vacio = computed(() =>
    this.q()
      ? 'No encontramos noticias para esa búsqueda. Probá con otra categoría o usá menos términos.'
      : 'Todavía no hay noticias publicadas en esta categoría.',
  );

  private plural(n: number, singular: string, plural: string): string {
    return `${n} ${n === 1 ? singular : plural}`;
  }

  private sinAcentos(valor: string): string {
    return valor.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
}
