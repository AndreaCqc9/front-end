import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Noticia } from '../../../core/models/models';
import { FavoritosService } from '../../../core/services/favoritos.service';
import { NoticiasService } from '../../../core/services/noticias.service';
import { TiempoRelativoPipe } from '../../pipes/tiempo-relativo.pipe';
import { MediaComponent } from '../media/media.component';
import { TagComponent } from '../tag/tag.component';

/**
 * Port de `card()` (legacy/js/componentes.js). Pieza compartida por el
 * catalogo, favoritos, la home y la lateral del detalle.
 */
@Component({
  selector: 'app-noticia-card',
  imports: [RouterLink, TagComponent, MediaComponent, TiempoRelativoPipe],
  styles: [':host { display: contents; }'],
  template: `
    <article class="card" [attr.data-id]="noticia().id">
      <app-media [imagen]="noticia().imagen" />
      <div class="card__body">
        <div class="card__meta">
          @if (categoriaNombre(); as nombreCategoria) {
            <app-tag [nombre]="nombreCategoria" />
          }
          <span class="card__time">
            {{ noticia().fecha | tiempoRelativo }} • {{ minutos() }} min de lectura
          </span>
        </div>
        <h3 class="card__title">
          <a [routerLink]="['/noticias', noticia().id]">{{ noticia().titulo }}</a>
        </h3>
        <p class="card__resumen">{{ noticia().resumen }}</p>
        <div class="card__foot">
          <span class="card__autor">{{ autorNombre() }}</span>
          <button
            class="card__fav"
            type="button"
            [attr.aria-pressed]="favoritos.esFavorito(noticia().id)"
            [attr.aria-label]="'Marcar ' + noticia().titulo + ' como favorita'"
            (click)="favoritos.alternar(noticia().id)"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z"
              />
            </svg>
          </button>
        </div>
      </div>
      @if (accion(); as textoAccion) {
        <a class="card__accion" [routerLink]="['/noticias', noticia().id]">{{ textoAccion }}</a>
      }
    </article>
  `,
})
export class NoticiaCardComponent {
  private readonly noticias = inject(NoticiasService);
  protected readonly favoritos = inject(FavoritosService);

  readonly noticia = input.required<Noticia>();
  readonly accion = input<string>();

  protected readonly categoriaNombre = computed(
    () => this.noticias.categoriasMap().get(this.noticia().categoria)?.nombre,
  );
  protected readonly autorNombre = computed(
    () => this.noticias.autores().get(this.noticia().autor)?.nombre ?? 'Redacción',
  );
  protected readonly minutos = computed(() =>
    Math.max(
      1,
      Math.round((this.noticia().cuerpo.join(' ').split(/\s+/).length || 400) / 200),
    ),
  );
}
