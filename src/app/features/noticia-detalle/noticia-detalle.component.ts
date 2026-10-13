import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Autor, Noticia } from '../../core/models/models';
import { FavoritosService } from '../../core/services/favoritos.service';
import { NoticiasService } from '../../core/services/noticias.service';
import { FechaCortaPipe } from '../../shared/pipes/fecha-corta.pipe';
import { MediaComponent } from '../../shared/ui/media/media.component';
import { NoticiaGridComponent } from '../../shared/ui/noticia-grid/noticia-grid.component';
import { TagComponent } from '../../shared/ui/tag/tag.component';

const AUTOR_FALLBACK: Autor = { id: '', nombre: 'Redacción', rol: '' };

/**
 * Port de `legacy/noticia.html`: detalle por `:id` con lateral de autor y
 * noticias relacionadas. Un id inexistente muestra el estado vacio del legacy.
 */
@Component({
  selector: 'app-noticia-detalle',
  imports: [RouterLink, TagComponent, MediaComponent, NoticiaGridComponent, FechaCortaPipe],
  template: `
    <main id="main">
      <div class="container container--wide">
        <div class="detalle" [class.is-sin-relacionadas]="!noticia()">
          <div class="detalle__main">
            @if (noticia(); as n) {
              <article class="noticia">
                <p><app-tag [nombre]="categoriaNombre()" /></p>
                <h1 class="page-title">{{ n.titulo }}</h1>
                <div class="noticia__topbar">
                  <div class="noticia__meta">
                    <span class="noticia__autor">{{ autor().nombre }}</span>
                    <span>{{ n.fecha | fechaCorta }}</span>
                    <span>{{ minutos() }} min de lectura</span>
                  </div>
                  <div class="noticia__acciones">
                    <button
                      class="btn btn--sm"
                      type="button"
                      [class.btn--primary]="esFavorito()"
                      [class.btn--ghost]="!esFavorito()"
                      [attr.aria-pressed]="esFavorito()"
                      (click)="alternarFavorito()"
                    >
                      {{ esFavorito() ? '★ En Favoritos' : 'Agregar a Favoritos' }}
                    </button>
                    <div class="compartir">
                      <button
                        class="compartir__btn"
                        type="button"
                        aria-label="Copiar el enlace de esta noticia"
                        (click)="copiarEnlace()"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path
                            d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"
                          />
                          <path
                            d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"
                          />
                        </svg>
                      </button>
                      <a
                        class="compartir__btn"
                        target="_blank"
                        rel="noopener noreferrer"
                        [href]="urlX()"
                        aria-label="Compartir en X"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path
                            d="M18.2 2.3h3.3l-7.2 8.3 8.5 11.2h-6.6l-5.2-6.8-6 6.8H1.7l7.7-8.8L1.3 2.3H8l4.7 6.2 5.5-6.2Zm-1.2 17.5h1.8L7.1 4.1H5.2l11.8 15.7Z"
                          />
                        </svg>
                      </a>
                      <a
                        class="compartir__btn"
                        target="_blank"
                        rel="noopener noreferrer"
                        [href]="urlLinkedin()"
                        aria-label="Compartir en LinkedIn"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path
                            d="M20.4 20.5h-3.6V15c0-1.3 0-3-1.9-3-1.8 0-2.1 1.4-2.1 2.9v5.6H9.4V9h3.4v1.6h.1c.5-.9 1.6-1.9 3.4-1.9 3.6 0 4.2 2.4 4.2 5.5v6.3ZM5.3 7.4A2.1 2.1 0 0 1 3.3 5.3 2.1 2.1 0 1 1 5.3 7.4Zm1.8 13.1H3.6V9h3.5v11.5ZM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6C0 23.2.8 24 1.8 24h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0Z"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                <app-media [imagen]="n.imagen" proporcion="21 / 9" />
                <p class="noticia__lead">{{ n.resumen }}</p>
                <div class="noticia__cuerpo">
                  @for (parrafo of n.cuerpo; track $index) {
                    <p class="noticia__p">{{ parrafo }}</p>
                  }
                </div>
                <p class="noticia__volver">
                  <a class="btn btn--ghost" routerLink="/noticias">&larr; Volver a Noticias</a>
                </p>
                <span class="compartir__aviso" role="status">{{ aviso() }}</span>
              </article>
            } @else {
              <section class="section">
                <h1 class="page-title">No encontramos esa noticia</h1>
                <p class="vacio">
                  Es posible que el enlace haya cambiado o que la noticia ya no esté publicada.
                </p>
                <p style="margin-top: var(--space-10)">
                  <a class="btn btn--ghost" routerLink="/noticias"
                    >Volver al catálogo de noticias</a
                  >
                </p>
              </section>
            }
          </div>

          @if (noticia()) {
            <aside class="detalle__aside" aria-label="Noticias relacionadas">
              <div class="autor-card">
                <div class="autor-card__head">
                  <span class="hero__avatar" aria-hidden="true"></span>
                  <div>
                    <p class="autor-card__name">{{ autor().nombre }}</p>
                    <p class="autor-card__role">{{ autor().rol }}</p>
                  </div>
                </div>
                <a class="autor-card__link" routerLink="/">Ver perfil →</a>
              </div>
              @if (sugeridas().length) {
                <app-noticia-grid [noticias]="sugeridas()" titulo="Noticias Relacionadas" />
              }
            </aside>
          }
        </div>
      </div>
    </main>
  `,
})
export class NoticiaDetalleComponent {
  private readonly noticias = inject(NoticiasService);
  private readonly favoritos = inject(FavoritosService);

  readonly id = input<string>('');

  protected readonly aviso = signal('');

  protected readonly noticia = computed<Noticia | undefined>(() => this.noticias.porId(this.id()));

  protected readonly categoriaNombre = computed(
    () => this.noticias.categoriasMap().get(this.noticia()?.categoria ?? '')?.nombre ?? 'Noticias',
  );

  protected readonly autor = computed<Autor>(() => {
    const id = this.noticia()?.autor ?? '';
    return this.noticias.autores().get(id) ?? AUTOR_FALLBACK;
  });

  protected readonly minutos = computed(() => {
    const parrafos = this.noticia()?.cuerpo ?? [];
    const palabras = parrafos.join(' ').split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(palabras / 200));
  });

  protected readonly esFavorito = computed(() =>
    this.favoritos.esFavorito(this.noticia()?.id ?? ''),
  );

  /**
   * 2 notas: primero de la misma categoria, luego las mas recientes del resto
   * del archivo. `noticias()` ya viene ordenado por fecha descendente.
   */
  protected readonly sugeridas = computed<Noticia[]>(() => {
    const actual = this.noticia();
    if (!actual) return [];
    const lista = this.noticias.noticias();
    const mismaCat = lista.filter(
      (n) => n.id !== actual.id && n.categoria === actual.categoria,
    );
    const otras = lista.filter((n) => n.id !== actual.id && n.categoria !== actual.categoria);
    return [...mismaCat, ...otras].slice(0, 2);
  });

  protected alternarFavorito(): void {
    const actual = this.noticia();
    if (actual) this.favoritos.alternar(actual.id);
  }

  protected async copiarEnlace(): Promise<void> {
    try {
      await navigator.clipboard.writeText(document.location.href);
      this.aviso.set('Enlace copiado');
    } catch {
      this.aviso.set('No se pudo copiar. Copiá el enlace desde la barra del navegador.');
    }
  }

  protected urlX(): string {
    const titulo = this.noticia()?.titulo ?? '';
    const url = encodeURIComponent(document.location.href);
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(titulo)}&url=${url}`;
  }

  protected urlLinkedin(): string {
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      document.location.href,
    )}`;
  }
}
