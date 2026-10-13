import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Vista 404 para rutas desconocidas (`**`). Reusa el lenguaje del estado vacio
 * del legacy (`.page-title` + `.vacio` + boton fantasma).
 */
@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <main id="main">
      <div class="container">
        <section class="section">
          <h1 class="page-title">Página no encontrada</h1>
          <p class="vacio">
            La página que buscás no existe o cambió de dirección. Volvé al inicio o recorré el
            catálogo de noticias.
          </p>
          <p style="margin-top: var(--space-10)">
            <a class="btn btn--primary" routerLink="/">Volver al inicio</a>
            <a class="btn btn--ghost" routerLink="/noticias">Ir al catálogo</a>
          </p>
        </section>
      </div>
    </main>
  `,
})
export class NotFoundComponent {}
