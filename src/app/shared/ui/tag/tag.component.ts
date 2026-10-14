import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Port de `tag()` (legacy/js/componentes.js). Enlaza al catalogo filtrado. */
@Component({
  selector: 'app-tag',
  imports: [RouterLink],
  styles: [':host { display: contents; }'],
  template: `<a
    class="tag"
    [routerLink]="['/noticias']"
    [queryParams]="{ categoria: nombre() }"
    >{{ nombre() }}</a
  >`,
})
export class TagComponent {
  readonly nombre = input.required<string>();
}
