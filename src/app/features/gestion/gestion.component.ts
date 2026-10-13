import { Component, DestroyRef, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { Noticia } from '../../core/models/models';
import { NoticiasService } from '../../core/services/noticias.service';
import { FechaLargaPipe } from '../../shared/pipes/fecha-larga.pipe';
import { MediaComponent } from '../../shared/ui/media/media.component';

interface ErroresNoticia {
  titulo: string;
  categoria: string;
  autor: string;
  resumen: string;
  imagen: string;
  cuerpo: string;
}

const SIN_ERRORES: ErroresNoticia = {
  titulo: '',
  categoria: '',
  autor: '',
  resumen: '',
  imagen: '',
  cuerpo: '',
};

const RE_IMAGEN = /\.(png|jpe?g|gif|webp|avif|bmp|svg)(\?.*)?$/i;

type EstadoPreview = 'cargando' | 'ok' | 'error';

/**
 * Port de `legacy/gestion.html`: panel CRUD minimo. Las mutaciones siempre
 * pasan por NoticiasService; la tabla y el modal reaccionan a sus signals,
 * por lo que no hace falta recargar a mano como en el legacy.
 */
@Component({
  selector: 'app-gestion',
  imports: [ReactiveFormsModule, MediaComponent, FechaLargaPipe],
  template: `
    <main id="main">
      <div class="container container--wide">
        <h1 class="page-title">Gestión de Noticias</h1>

        <section class="section">
          <div class="section__head">
            <div>
              <h2 class="section__title">Todas las Noticias</h2>
              <p class="section__lead">{{ resumen() }}</p>
            </div>
            <button class="btn btn--primary" type="button" (click)="abrirModal()">
              Nueva Noticia
            </button>
          </div>

          <div class="tabla-scroll">
            @if (lista().length) {
              <table class="tabla">
                <caption class="sr-only">
                  Listado de noticias con imagen, datos y acciones de edición y eliminación
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Imagen</th>
                    <th scope="col">Titular</th>
                    <th scope="col">Categoría</th>
                    <th scope="col">Autor</th>
                    <th scope="col">Fecha</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  @for (noticia of lista(); track noticia.id) {
                    <tr>
                      <td class="tabla__celda-imagen">
                        <app-media [imagen]="noticia.imagen" proporcion="3 / 2" />
                      </td>
                      <td>{{ noticia.titulo }}</td>
                      <td>{{ categoriasMap().get(noticia.categoria)?.nombre ?? noticia.categoria }}</td>
                      <td>{{ autoresMap().get(noticia.autor)?.nombre ?? noticia.autor }}</td>
                      <td>{{ noticia.fecha | fechaLarga }}</td>
                      <td>
                        <div class="tabla__acciones">
                          <button class="btn btn--ghost" type="button" (click)="editar(noticia)">
                            Editar
                          </button>
                          <button class="btn btn--danger" type="button" (click)="eliminar(noticia)">
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            } @else {
              <p class="vacio">No hay noticias para mostrar.</p>
            }
          </div>
        </section>
      </div>
    </main>

    <div class="overlay" [hidden]="!modalAbierto()" (click)="onOverlayClick($event)">
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal__head">
          <h2 class="modal__title" id="modal-title">
            {{ editandoId() ? 'Editar Noticia' : 'Crear Nueva Noticia' }}
          </h2>
          <button class="modal__close" type="button" aria-label="Cerrar" (click)="cerrarModal()">
            &times;
          </button>
        </div>

        <form class="form-grid" [formGroup]="formulario" (ngSubmit)="guardar()" novalidate>
          <div class="field">
            <label for="f-titulo">Título de la Noticia</label>
            <input
              #tituloInput
              class="input"
              id="f-titulo"
              name="titulo"
              type="text"
              minlength="10"
              maxlength="120"
              required
              formControlName="titulo"
              [attr.aria-invalid]="errores().titulo ? 'true' : null"
              (input)="limpiar('titulo')"
            />
            <p class="error" role="alert">{{ errores().titulo }}</p>
          </div>

          <div class="form-row">
            <div class="field">
              <label for="f-categoria">Categoría</label>
              <select
                class="input"
                id="f-categoria"
                name="categoria"
                required
                formControlName="categoria"
                [attr.aria-invalid]="errores().categoria ? 'true' : null"
                (change)="limpiar('categoria')"
              >
                <option value="">Selecciona una categoría</option>
                @for (categoria of categorias(); track categoria.id) {
                  <option [value]="categoria.id">{{ categoria.nombre }}</option>
                }
              </select>
              <p class="error" role="alert">{{ errores().categoria }}</p>
            </div>

            <div class="field">
              <label for="f-imagen">URL de Imagen</label>
              <input
                class="input"
                id="f-imagen"
                name="imagen"
                type="text"
                inputmode="url"
                autocomplete="off"
                spellcheck="false"
                placeholder="img/noticia-1.png"
                aria-describedby="ayuda-imagen"
                formControlName="imagen"
                [attr.aria-invalid]="errores().imagen ? 'true' : null"
                (input)="limpiar('imagen')"
              />
              <p class="error" role="alert">{{ errores().imagen }}</p>
              <p class="nota" id="ayuda-imagen">
                Ruta relativa a este archivo o URL completa. Opcional: sin imagen se muestra el
                placeholder. Extensiones: png, jpg, jpeg, gif, webp, avif, bmp, svg.
              </p>
              <div class="preview" [hidden]="!previewSrc()">
                @if (previewSrc(); as src) {
                  <img
                    class="preview__img"
                    [src]="src"
                    [hidden]="previewError()"
                    alt=""
                    (load)="onPreviewLoad()"
                    (error)="onPreviewError()"
                  />
                }
                <span
                  class="preview__msg"
                  [attr.data-estado]="previewEstado()"
                  role="status"
                  >{{ previewMensaje() }}</span
                >
              </div>
            </div>
          </div>

          <div class="field">
            <label for="f-resumen">Descripción Breve</label>
            <textarea
              class="input"
              id="f-resumen"
              name="resumen"
              minlength="40"
              maxlength="280"
              required
              formControlName="resumen"
              [attr.aria-invalid]="errores().resumen ? 'true' : null"
              (input)="limpiar('resumen')"
            ></textarea>
            <p class="error" role="alert">{{ errores().resumen }}</p>
          </div>

          <div class="field">
            <label for="f-cuerpo">Contenido Completo</label>
            <textarea
              class="input"
              id="f-cuerpo"
              name="cuerpo"
              minlength="100"
              required
              formControlName="cuerpo"
              [attr.aria-invalid]="errores().cuerpo ? 'true' : null"
              (input)="limpiar('cuerpo')"
            ></textarea>
            <p class="error" role="alert">{{ errores().cuerpo }}</p>
            <p class="nota">Un párrafo por línea en blanco.</p>
          </div>

          <div class="field">
            <label for="f-autor">Autor</label>
            <select
              class="input"
              id="f-autor"
              name="autor"
              required
              formControlName="autor"
              [attr.aria-invalid]="errores().autor ? 'true' : null"
              (change)="limpiar('autor')"
            >
              <option value="">Selecciona un autor</option>
              @for (autor of autores(); track autor.id) {
                <option [value]="autor.id">{{ autor.nombre }}</option>
              }
            </select>
            <p class="error" role="alert">{{ errores().autor }}</p>
          </div>

          <div class="modal__actions">
            <button class="btn btn--ghost" type="button" (click)="cerrarModal()">Cancelar</button>
            <button class="btn btn--primary" type="submit">Guardar Noticia</button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class GestionComponent {
  private readonly noticias = inject(NoticiasService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  private readonly inputTitulo = viewChild<ElementRef<HTMLInputElement>>('tituloInput');

  protected readonly lista = this.noticias.noticias;
  protected readonly categorias = this.noticias.categorias;
  protected readonly categoriasMap = this.noticias.categoriasMap;
  protected readonly autoresMap = this.noticias.autores;
  protected readonly autores = computed(() => [...this.noticias.autores().values()]);

  protected readonly modalAbierto = signal(false);
  protected readonly editandoId = signal<string | null>(null);
  protected readonly errores = signal<ErroresNoticia>({ ...SIN_ERRORES });

  protected readonly previewSrc = signal<string | null>(null);
  protected readonly previewEstado = signal<EstadoPreview>('cargando');
  protected readonly previewMensaje = signal('');
  protected readonly previewError = computed(() => this.previewEstado() === 'error');

  protected readonly formulario = this.fb.group({
    titulo: '',
    categoria: '',
    autor: '',
    resumen: '',
    imagen: '',
    cuerpo: '',
  });

  constructor() {
    this.formulario.controls.imagen.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((valor) => this.actualizarPreview(valor));

    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((evento) => {
        if (evento.key === 'Escape' && this.modalAbierto()) this.cerrarModal();
      });
  }

  protected readonly resumen = computed(() => {
    const total = this.lista().length;
    return (
      `${total} ${total === 1 ? 'noticia' : 'noticias'} visibles. ` +
      'Las altas y ediciones se guardan en este navegador (localStorage).'
    );
  });

  protected abrirModal(noticia: Noticia | null = null): void {
    this.editandoId.set(noticia ? noticia.id : null);
    this.formulario.reset({
      titulo: '',
      categoria: '',
      autor: '',
      resumen: '',
      imagen: '',
      cuerpo: '',
    });
    this.errores.set({ ...SIN_ERRORES });

    if (noticia) {
      this.formulario.setValue({
        titulo: noticia.titulo,
        categoria: noticia.categoria,
        autor: noticia.autor,
        resumen: noticia.resumen,
        imagen: noticia.imagen ?? '',
        cuerpo: (noticia.cuerpo ?? []).join('\n\n'),
      });
    }

    this.modalAbierto.set(true);
    /* El overlay esta oculto por `hidden`; el foco solo puede entrar despues
       de que el cambio de estado se refleje en el DOM. */
    setTimeout(() => this.inputTitulo()?.nativeElement.focus());
  }

  protected cerrarModal(): void {
    this.modalAbierto.set(false);
    this.editandoId.set(null);
  }

  protected editar(noticia: Noticia): void {
    this.abrirModal(noticia);
  }

  protected eliminar(noticia: Noticia): void {
    if (!confirm(`¿Eliminar "${noticia.titulo}"? Esta acción no se puede deshacer.`)) return;
    this.noticias.eliminar(noticia.id);
  }

  protected guardar(): void {
    const valores = this.formulario.getRawValue();
    const errores = this.validar(valores);
    this.errores.set(errores);

    if (
      errores.titulo ||
      errores.categoria ||
      errores.autor ||
      errores.resumen ||
      errores.imagen ||
      errores.cuerpo
    ) {
      return;
    }

    const cuerpo = valores.cuerpo
      .split(/\n{2,}|\n/)
      .map((parrafo) => parrafo.trim())
      .filter(Boolean);

    const cambios = {
      titulo: valores.titulo.trim(),
      categoria: valores.categoria,
      autor: valores.autor,
      resumen: valores.resumen.trim(),
      imagen: valores.imagen.trim() || null,
      cuerpo,
    };

    const id = this.editandoId();
    if (id) this.noticias.actualizar(id, cambios);
    else this.noticias.crear(cambios);

    this.cerrarModal();
  }

  protected onOverlayClick(evento: MouseEvent): void {
    if (evento.target === evento.currentTarget) this.cerrarModal();
  }

  protected limpiar(campo: keyof ErroresNoticia): void {
    this.errores.update((actuales) => ({ ...actuales, [campo]: '' }));
  }

  protected onPreviewLoad(): void {
    if (!this.previewSrc()) return;
    this.previewEstado.set('ok');
    this.previewMensaje.set('Imagen cargada.');
  }

  protected onPreviewError(): void {
    if (!this.previewSrc()) return;
    this.previewEstado.set('error');
    this.previewMensaje.set('No se pudo cargar esa imagen. Revisá la ruta.');
  }

  private actualizarPreview(valor: string): void {
    const limpio = valor.trim();
    if (!limpio) {
      this.previewSrc.set(null);
      this.previewMensaje.set('');
      this.previewEstado.set('cargando');
      return;
    }
    this.previewEstado.set('cargando');
    this.previewMensaje.set('Cargando…');
    this.previewSrc.set(limpio);
  }

  private validar(valores: {
    titulo: string;
    categoria: string;
    autor: string;
    resumen: string;
    imagen: string;
    cuerpo: string;
  }): ErroresNoticia {
    const titulo = valores.titulo.trim();
    const resumen = valores.resumen.trim();
    const imagen = valores.imagen.trim();
    const cuerpo = valores.cuerpo.trim();
    const errores: ErroresNoticia = { ...SIN_ERRORES };

    if (!titulo) errores.titulo = 'El titular es obligatorio.';
    else if (titulo.length < 10) errores.titulo = 'El titular debe tener al menos 10 caracteres.';

    if (!valores.categoria) errores.categoria = 'La categoría es obligatoria.';

    if (!valores.autor) errores.autor = 'El autor es obligatorio.';

    if (!resumen) errores.resumen = 'El resumen es obligatorio.';
    else if (resumen.length < 40) errores.resumen = 'El resumen debe tener al menos 40 caracteres.';

    if (imagen && !RE_IMAGEN.test(imagen)) {
      errores.imagen = 'La imagen debe ser una ruta o URL de imagen (png, jpg, webp…).';
    }

    if (!cuerpo) errores.cuerpo = 'El cuerpo es obligatorio.';
    else if (cuerpo.length < 100) errores.cuerpo = 'El cuerpo debe tener al menos 100 caracteres.';

    return errores;
  }
}
