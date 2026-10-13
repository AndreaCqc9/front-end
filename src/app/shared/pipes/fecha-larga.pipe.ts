import { Pipe, PipeTransform } from '@angular/core';

/** Port de `fechaLarga` (legacy/js/componentes.js): "12 de marzo de 2026". */
@Pipe({ name: 'fechaLarga' })
export class FechaLargaPipe implements PipeTransform {
  transform(iso: string): string {
    return new Date(iso).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
}
