import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Autor, Noticia } from '../../core/models/models';
import { NoticiasService } from '../../core/services/noticias.service';
import { TiempoRelativoPipe } from '../../shared/pipes/tiempo-relativo.pipe';
import { BadgeComponent } from '../../shared/ui/badge/badge.component';
import { NoticiaGridComponent } from '../../shared/ui/noticia-grid/noticia-grid.component';
import { TagComponent } from '../../shared/ui/tag/tag.component';

const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const AUTOR_FALLBACK: Autor = { id: '', nombre: 'Redacción', rol: '' };

/**
 * Port de `legacy/index.html`: hero + grilla de destacadas + newsletter.
 * Los datos salen de NoticiasService; el hero es la primera destacada.
 */
@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    TiempoRelativoPipe,
    TagComponent,
    BadgeComponent,
    NoticiaGridComponent,
  ],
  template: `
    <main id="main">
      <div class="container">
        @if (hero(); as destacada) {
          <section id="hero" class="hero" aria-labelledby="hero-title">
            <div class="hero__media">
              @if (destacada.imagen) {
                <img [src]="destacada.imagen" [alt]="destacada.titulo" fetchpriority="high" />
              }
              <span class="hero__badge"><app-badge /></span>
            </div>
            <div class="hero__content">
              <div class="hero__meta">
                <app-tag [nombre]="categoriaNombre()" />
                <span class="hero__time">
                  {{ destacada.fecha | tiempoRelativo }} • 6 min de lectura
                </span>
              </div>
              <h1 class="hero__headline" id="hero-title">{{ destacada.titulo }}</h1>
              <p class="hero__excerpt">{{ destacada.resumen }}</p>
              <div class="hero__author">
                <span class="hero__avatar" aria-hidden="true"></span>
                <span class="hero__authorText">
                  <span class="hero__authorName">{{ autor().nombre }}</span>
                  <span class="hero__authorRole">{{ autor().rol }}</span>
                </span>
              </div>
              <a class="btn btn--primary" [routerLink]="['/noticias', destacada.id]">
                <span>Leer noticia completa</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>
          </section>
        }
      </div>

      <div class="container">
        <app-noticia-grid
          [noticias]="destacadas()"
          titulo="Noticias Destacadas"
          bajada="Lo más relevante de la semana, seleccionado por nuestra redacción."
        />
      </div>
    </main>

    <section class="newsletter" aria-labelledby="news-title">
      <div class="container newsletter__inner">
        <div class="newsletter__content">
          <h2 class="newsletter__title" id="news-title">Inteligencia en tu bandeja de entrada</h2>
          <p class="newsletter__text">
            Únete a más de 25,000 lectores que reciben nuestro resumen semanal. Sin spam, solo la
            señal que importa.
          </p>
        </div>
        <div>
          <form class="newsletter__form" (ngSubmit)="suscribir()" novalidate>
            <label class="sr-only" for="email-news">Email</label>
            <input
              class="input"
              id="email-news"
              name="email"
              type="email"
              placeholder="tu@email.com"
              required
              [formControl]="email"
              [attr.aria-invalid]="invalido()"
              (input)="limpiarError()"
            />
            <button class="btn btn--primary" type="submit">Suscribirme</button>
          </form>
          <p class="newsletter__nota">Al suscribirte aceptas nuestra política de privacidad.</p>
          <p class="error" data-for="email" role="alert">{{ error() }}</p>
        </div>
      </div>
    </section>
  `,
})
export class HomeComponent {
  private readonly noticias = inject(NoticiasService);

  protected readonly destacadas = computed<Noticia[]>(() => {
    const destacada = this.hero();
    return this.noticias.noticias().filter((n) => n.id !== destacada?.id);
  });

  protected readonly hero = computed<Noticia | undefined>(
    () => this.noticias.noticias().find((n) => n.destacada) ?? this.noticias.noticias()[0],
  );

  protected readonly categoriaNombre = computed(
    () => this.noticias.categoriasMap().get(this.hero()?.categoria ?? '')?.nombre ?? 'Noticias',
  );

  protected readonly autor = computed<Autor>(() => {
    const id = this.hero()?.autor ?? '';
    return this.noticias.autores().get(id) ?? AUTOR_FALLBACK;
  });

  protected readonly email = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern(RE_EMAIL)],
  });

  protected readonly error = signal('');
  protected readonly invalido = signal(false);

  protected suscribir(): void {
    const valor = this.email.value.trim();
    let mensaje = '';
    if (!valor) mensaje = 'El email es obligatorio.';
    else if (!RE_EMAIL.test(valor)) mensaje = 'Ingresa un email válido.';

    this.error.set(mensaje);
    this.invalido.set(Boolean(mensaje));
    if (mensaje) return;

    this.email.reset();
    this.error.set('');
    this.invalido.set(false);
    alert('¡Listo! Te suscribiste al resumen semanal.');
  }

  protected limpiarError(): void {
    if (!this.invalido()) return;
    this.error.set('');
    this.invalido.set(false);
  }
}
