import { Component, computed, inject } from '@angular/core';
import { Noticia } from '../../core/models/models';
import { FavoritosService } from '../../core/services/favoritos.service';
import { NoticiasService } from '../../core/services/noticias.service';
import { NoticiaGridComponent } from '../../shared/ui/noticia-grid/noticia-grid.component';

/**
 * Port de `legacy/favoritos.html`: el mismo renderer de grilla con el
 * subconjunto de favoritos. La lista se deriva de FavoritosService, asi que
 * sacar un corazon la actualiza en el acto.
 */
@Component({
  selector: 'app-favoritos',
  imports: [NoticiaGridComponent],
  template: `
    <main id="main">
      <div class="container">
        <app-noticia-grid
          [noticias]="noticiasFavoritas()"
          titulo="Tus Favoritos"
          [bajada]="bajada()"
          vacio="Todavía no guardaste ninguna noticia. Usá el corazón en cualquier artículo para agregarla."
          accion="Leer noticia completa"
          nivel="h1"
        />
      </div>
    </main>
  `,
})
export class FavoritosComponent {
  private readonly noticias = inject(NoticiasService);
  private readonly favoritos = inject(FavoritosService);

  protected readonly noticiasFavoritas = computed<Noticia[]>(() => {
    const ids = this.favoritos.favoritos();
    return this.noticias.noticias().filter((n) => ids.has(n.id));
  });

  protected readonly bajada = computed(() => {
    const total = this.noticiasFavoritas().length;
    return total
      ? `${total} ${total === 1 ? 'noticia guardada' : 'noticias guardadas'} en este navegador.`
      : 'Tu lista de lectura se guarda en este navegador.';
  });
}
