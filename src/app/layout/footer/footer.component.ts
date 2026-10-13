import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Categoria } from '../../core/models/models';
import { NoticiasService } from '../../core/services/noticias.service';

const CATEGORIAS_NAV = ['cuantica', 'ia', 'hardware', 'software', 'seguridad'];
const COMPANIA = ['Sobre nosotros', 'Términos de Servicio', 'Contacto Editorial'];

/** Port de `renderFooter` (legacy/js/layout.js). */
@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="footer__inner">
        <div class="footer__brand">
          <a class="logo logo--inverse" routerLink="/">
            <span class="logo__mark">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />
              </svg>
            </span>
            <span class="logo__word">TechNews <b>Hub</b></span>
          </a>
          <p class="footer__desc">
            La plataforma líder de periodismo de tecnología independiente en español. Datos
            precisos, análisis profundos.
          </p>
          <div class="footer__stats">
            @for (metrica of metricas(); track metrica.etiqueta) {
              <div class="stat">
                <span class="stat__value">{{ metrica.valor }}</span>
                <span class="stat__label">{{ metrica.etiqueta }}</span>
              </div>
            }
          </div>
        </div>
        <nav class="footer__col" aria-label="Categorias">
          <h3 class="footer__title">Categorías</h3>
          <ul>
            @for (categoria of categoriasNav(); track categoria.id) {
              <li>
                <a [routerLink]="['/noticias']" [queryParams]="{ categoria: categoria.id }">{{
                  categoria.nombre
                }}</a>
              </li>
            }
          </ul>
        </nav>
        <nav class="footer__col" aria-label="Compania">
          <h3 class="footer__title">Compañía</h3>
          <ul>
            @for (titulo of compania; track titulo) {
              <li><a href="#">{{ titulo }}</a></li>
            }
          </ul>
        </nav>
      </div>
      <div class="footer__legal">
        <p>© 2026 TechNews Hub. Todos los derechos reservados.</p>
        <nav aria-label="Legal">
          <a href="#">Términos de Servicio</a>
          <a routerLink="/contacto">Contacto Editorial</a>
        </nav>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  private readonly noticias = inject(NoticiasService);

  protected readonly metricas = this.noticias.metricas;
  protected readonly compania = COMPANIA;

  protected readonly categoriasNav = computed<Categoria[]>(() =>
    this.noticias.categorias().filter((categoria) => CATEGORIAS_NAV.includes(categoria.id)),
  );
}
