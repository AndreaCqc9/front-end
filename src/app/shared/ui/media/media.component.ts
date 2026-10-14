import { Component, input } from '@angular/core';

/** Port de `media()` (legacy/js/componentes.js): imagen o placeholder. */
@Component({
  selector: 'app-media',
  styles: [':host { display: contents; }'],
  template: `
    @if (imagen()) {
      <div class="media" [style.aspect-ratio]="proporcion()">
        <img [src]="imagen()" alt="" loading="lazy" />
      </div>
    } @else {
      <div
        class="media media--vacio"
        [style.aspect-ratio]="proporcion()"
        role="img"
        aria-label="Imagen no disponible"
      ></div>
    }
  `,
})
export class MediaComponent {
  readonly imagen = input<string | null>(null);
  readonly proporcion = input<string>('16 / 10');
}
