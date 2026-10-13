import { Injectable, Signal, signal } from '@angular/core';

const CLAVE_FAV = 'tnh:favoritos';

@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private readonly _favoritos = signal<ReadonlySet<string>>(this.leer());

  readonly favoritos: Signal<ReadonlySet<string>> = this._favoritos.asReadonly();

  esFavorito(id: string): boolean {
    return this._favoritos().has(id);
  }

  alternar(id: string): boolean {
    const favoritos = new Set(this._favoritos());
    const activo = !favoritos.has(id);
    if (activo) favoritos.add(id);
    else favoritos.delete(id);
    this.persistir(favoritos);
    return activo;
  }

  /**
   * Quita un id sin alternar. Lo usa NoticiasService al eliminar una noticia,
   * para que la señal de favoritos siga siendo la unica fuente de verdad.
   */
  quitar(id: string): void {
    const favoritos = new Set(this._favoritos());
    if (!favoritos.delete(id)) return;
    this.persistir(favoritos);
  }

  private persistir(favoritos: ReadonlySet<string>): void {
    localStorage.setItem(CLAVE_FAV, JSON.stringify([...favoritos]));
    this._favoritos.set(new Set(favoritos));
  }

  private leer(): ReadonlySet<string> {
    try {
      return new Set<string>(JSON.parse(localStorage.getItem(CLAVE_FAV) || '[]'));
    } catch {
      return new Set<string>();
    }
  }
}
