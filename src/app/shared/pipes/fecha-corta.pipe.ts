import { Pipe, PipeTransform } from '@angular/core';

/** Port de `fechaCorta` (legacy/js/componentes.js): "12 mar 2026". */
@Pipe({ name: 'fechaCorta' })
export class FechaCortaPipe implements PipeTransform {
  transform(iso: string): string {
    return new Date(iso).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
}
