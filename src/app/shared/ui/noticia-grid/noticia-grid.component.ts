import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Categoria, Noticia } from '../../../core/models/models';
import { NoticiaCardComponent } from '../noticia-card/noticia-card.component';

const CATEGORIA_TODAS: Categoria = { id: '', nombre: 'Todas' };

/**
 * Port de `renderListado` + `renderFiltro` (legacy/js/componentes.js).
 * El catalogo, favoritos y la grilla de la home son este mismo componente
 * con parametros distintos.
 */
@Component({
  selector: 'app-noticia-grid',
  imports: [RouterLink, NoticiaCardComponent],
  styles: [':host { display: contents; }'],
  template: `
    <section class="section">
      <div class="section__head">
        <div>
          @if (nivel() === 'h1') {
            <h1 class="section__title">{{ titulo() }}</h1>
          } @else {
            <h2 class="section__title">{{ titulo() }}</h2>
          }
          @if (bajada(); as textoBajada) {
            <p class="section__lead">{{ textoBajada }}</p>
          }
        </div>
      </div>
      @if (conFiltro()) {
        <div class="filtro">
          <span class="filtro__label">Filtrar por Categoría</span>
          <div class="filtro__chips">
            @for (opcion of opcionesFiltro(); track opcion.id) {
              <a
                class="chip"
                [class.is-active]="opcion.id === activa()"
                [routerLink]="['/noticias']"
                [queryParams]="opcion.id ? { categoria: opcion.id } : {}"
                >{{ opcion.nombre }}</a
              >
            }
          </div>
        </div>
      }
      @if (noticias().length) {
        <div class="grid">
          @for (noticia of noticias(); track noticia.id) {
            <app-noticia-card [noticia]="noticia" [accion]="accion()" />
          }
        </div>
      } @else {
        <p class="vacio">{{ vacio() }}</p>
      }
    </section>
  `,
})
export class NoticiaGridComponent {
  readonly noticias = input.required<Noticia[]>();
  readonly titulo = input<string>('Noticias Destacadas');
  readonly bajada = input<string>('');
  readonly categorias = input<Categoria[]>([]);
  readonly activa = input<string>('');
  readonly conFiltro = input<boolean>(false);
  readonly vacio = input<string>('No hay noticias para mostrar.');
  readonly accion = input<string>('Leer noticia completa');
  readonly nivel = input<'h1' | 'h2'>('h2');

  protected readonly opcionesFiltro = computed<Categoria[]>(() => [
    CATEGORIA_TODAS,
    ...this.categorias(),
  ]);
}
