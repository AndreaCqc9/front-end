import { Pipe, PipeTransform } from '@angular/core';

interface Unidad {
  limite: number;
  divisor: number;
  sufijo: string;
  plural: string;
}

const UNIDADES: Unidad[] = [
  { limite: 60, divisor: 1, sufijo: 'segundo', plural: 'segundos' },
  { limite: 3600, divisor: 60, sufijo: 'minuto', plural: 'minutos' },
  { limite: 86400, divisor: 3600, sufijo: 'hora', plural: 'horas' },
  { limite: 2592000, divisor: 86400, sufijo: 'día', plural: 'días' },
  { limite: 31536000, divisor: 2592000, sufijo: 'mes', plural: 'meses' },
];

/** Port de `tiempoRelativo` (legacy/js/componentes.js). */
@Pipe({ name: 'tiempoRelativo' })
export class TiempoRelativoPipe implements PipeTransform {
  transform(iso: string): string {
    const segundos = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (segundos < 60) return 'Hace un momento';
    for (const u of UNIDADES) {
      if (segundos < u.limite) {
        const n = Math.floor(segundos / u.divisor);
        return `Hace ${n} ${n === 1 ? u.sufijo : u.plural}`;
      }
    }
    const anios = Math.floor(segundos / 31536000);
    return `Hace ${anios} ${anios === 1 ? 'año' : 'años'}`;
  }
}
