import { Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, fromEvent } from 'rxjs';

interface NavItem {
  label: string;
  ruta: string;
}

const NAV: NavItem[] = [
  { label: 'Inicio', ruta: '/' },
  { label: 'Noticias', ruta: '/noticias' },
  { label: 'Favoritos', ruta: '/favoritos' },
  { label: 'Gestión', ruta: '/gestion' },
  { label: 'Contacto', ruta: '/contacto' },
];

/**
 * Port de `renderHeader` + `activarMenu` (legacy/js/layout.js).
 * El estado activo se deriva de la URL, no esta hardcodeado por pagina.
 */
@Component({
  selector: 'app-header',
  imports: [RouterLink],
  template: `
    <header class="nav">
      <div class="nav__inner">
        <a class="logo" routerLink="/">
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
        <nav aria-label="Principal">
          <button
            #botonMenu
            class="nav__toggle"
            type="button"
            [attr.aria-expanded]="menuAbierto()"
            aria-controls="nav-principal"
            [attr.aria-label]="menuAbierto() ? 'Cerrar menú' : 'Abrir menú'"
            (click)="alternarMenu()"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          <ul #listaMenu class="nav__links" id="nav-principal" [class.is-open]="menuAbierto()">
            @for (item of nav; track item.ruta) {
              <li>
                <a
                  class="nav__link"
                  [class.is-active]="esActivo(item.ruta)"
                  [attr.aria-current]="esActivo(item.ruta) ? 'page' : null"
                  [routerLink]="item.ruta"
                  (click)="cerrarMenu()"
                  >{{ item.label }}</a
                >
              </li>
            }
          </ul>
        </nav>
        <form class="search" role="search" (submit)="onBuscar($event)">
          <span class="search__icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </span>
          <input
            class="search__input"
            type="search"
            name="q"
            placeholder="Buscar noticias..."
            aria-label="Buscar noticias"
            [value]="consulta()"
          />
        </form>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly botonMenu = viewChild<ElementRef<HTMLButtonElement>>('botonMenu');
  private readonly listaMenu = viewChild<ElementRef<HTMLUListElement>>('listaMenu');

  protected readonly nav = NAV;
  protected readonly menuAbierto = signal(false);
  protected readonly consulta = signal('');
  private readonly urlActual = signal(this.router.url);

  constructor() {
    this.router.events
      .pipe(
        filter((evento): evento is NavigationEnd => evento instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((evento) => {
        this.urlActual.set(evento.urlAfterRedirects);
        this.consulta.set(this.leerQuery(evento.urlAfterRedirects));
      });

    this.consulta.set(this.leerQuery(this.router.url));

    /* Escape cierra el menu y devuelve el foco al boton. */
    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((evento) => {
        if (evento.key === 'Escape') this.cerrarMenu(true);
      });

    /* Un click fuera del menu lo cierra. */
    fromEvent<MouseEvent>(document, 'click')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((evento) => {
        const objetivo = evento.target as Node;
        if (this.botonMenu()?.nativeElement.contains(objetivo)) return;
        if (this.listaMenu()?.nativeElement.contains(objetivo)) return;
        this.cerrarMenu();
      });
  }

  protected esActivo(ruta: string): boolean {
    const actual = this.urlActual().split('?')[0].split('#')[0];
    if (ruta === '/noticias') return actual === '/noticias' || actual.startsWith('/noticias/');
    return actual === ruta;
  }

  protected alternarMenu(): void {
    this.menuAbierto.update((abierto) => !abierto);
  }

  protected cerrarMenu(devolverFoco = false): void {
    if (!this.menuAbierto()) return;
    this.menuAbierto.set(false);
    if (devolverFoco) this.botonMenu()?.nativeElement.focus();
  }

  protected onBuscar(evento: Event): void {
    evento.preventDefault();
    const formulario = evento.target as HTMLFormElement;
    const entrada = formulario.elements.namedItem('q');
    const valor = entrada instanceof HTMLInputElement ? entrada.value : '';
    void this.router.navigate(['/noticias'], { queryParams: { q: valor } });
    this.cerrarMenu();
  }

  private leerQuery(url: string): string {
    const q = this.router.parseUrl(url).queryParams['q'];
    return typeof q === 'string' ? q : '';
  }
}
