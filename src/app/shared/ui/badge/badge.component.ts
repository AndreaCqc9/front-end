import { Component, input } from '@angular/core';

/** Port de `badge()` (legacy/js/componentes.js). */
@Component({
  selector: 'app-badge',
  styles: [':host { display: contents; }'],
  template: `<span class="badge">{{ texto() }}</span>`,
})
export class BadgeComponent {
  readonly texto = input<string>('Última hora');
}
