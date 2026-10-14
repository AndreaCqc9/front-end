import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Faq } from '../../core/models/models';
import { SEED } from '../../core/data/seed';

const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Port de `legacy/contacto.html`: formulario de contacto + FAQ. Las reglas y
 * los mensajes replican `validarForm`/`limpiarErroresAlEscribir`
 * (legacy/js/interacciones.js) campo por campo.
 */
@Component({
  selector: 'app-contacto',
  imports: [RouterLink, ReactiveFormsModule],
  template: `
    <main id="main">
      <div class="container">
        <h1 class="page-title">Contáctanos</h1>

        <section class="section">
          <div class="contacto">
            <div id="col-form">
              @if (!enviado()) {
                <h2 class="section__title">Envíanos un mensaje</h2>
                <p class="section__lead">
                  Para consultas editoriales, licencias o correcciones. Respondemos en un plazo de
                  48 horas hábiles.
                </p>

                <form class="form-grid" [formGroup]="formulario" (ngSubmit)="enviar()" novalidate>
                  <div class="field">
                    <label for="c-nombre">Nombre completo</label>
                    <input
                      class="input"
                      id="c-nombre"
                      name="nombre"
                      type="text"
                      autocomplete="name"
                      minlength="3"
                      maxlength="80"
                      required
                      formControlName="nombre"
                      [attr.aria-invalid]="errorNombre() ? 'true' : null"
                      (input)="limpiar('nombre')"
                    />
                    <p class="error" role="alert">{{ errorNombre() }}</p>
                  </div>

                  <div class="field">
                    <label for="c-email">Correo electrónico</label>
                    <input
                      class="input"
                      id="c-email"
                      name="email"
                      type="email"
                      autocomplete="email"
                      placeholder="nombre@dominio.com"
                      required
                      formControlName="email"
                      [attr.aria-invalid]="errorEmail() ? 'true' : null"
                      (input)="limpiar('email')"
                    />
                    <p class="error" role="alert">{{ errorEmail() }}</p>
                  </div>

                  <div class="field">
                    <label for="c-asunto">Asunto</label>
                    <input
                      class="input"
                      id="c-asunto"
                      name="asunto"
                      type="text"
                      autocomplete="off"
                      minlength="3"
                      maxlength="120"
                      required
                      formControlName="asunto"
                      [attr.aria-invalid]="errorAsunto() ? 'true' : null"
                      (input)="limpiar('asunto')"
                    />
                    <p class="error" role="alert">{{ errorAsunto() }}</p>
                  </div>

                  <div class="field">
                    <label for="c-mensaje">Mensaje</label>
                    <textarea
                      class="input"
                      id="c-mensaje"
                      name="mensaje"
                      minlength="20"
                      maxlength="1000"
                      required
                      formControlName="mensaje"
                      [attr.aria-invalid]="errorMensaje() ? 'true' : null"
                      (input)="limpiar('mensaje')"
                    ></textarea>
                    <p class="error" role="alert">{{ errorMensaje() }}</p>
                  </div>

                  <div>
                    <button class="btn btn--primary" type="submit">Enviar Mensaje →</button>
                  </div>
                </form>
              } @else {
                <h2 class="section__title">Mensaje enviado</h2>
                <p class="section__lead">
                  Gracias por escribir. Nuestro equipo editorial responde en un plazo de 48 horas
                  hábiles.
                </p>
                <p style="margin-top: var(--space-10)">
                  <a class="btn btn--primary" routerLink="/">Volver al inicio</a>
                </p>
              }
            </div>

            <aside aria-labelledby="faq-title">
              <h2 class="section__title" id="faq-title">Preguntas Frecuentes</h2>
              <div class="faq">
                @for (item of faq; track item.pregunta) {
                  <details>
                    <summary>{{ item.pregunta }}</summary>
                    <p>{{ item.respuesta }}</p>
                  </details>
                }
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  `,
})
export class ContactoComponent {
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly faq: Faq[] = SEED.faq;
  protected readonly enviado = signal(false);

  protected readonly formulario = this.fb.group({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: '',
  });

  protected readonly errorNombre = signal('');
  protected readonly errorEmail = signal('');
  protected readonly errorAsunto = signal('');
  protected readonly errorMensaje = signal('');

  protected enviar(): void {
    const valores = this.formulario.getRawValue();
    const nombre = valores.nombre.trim();
    const email = valores.email.trim();
    const asunto = valores.asunto.trim();
    const mensaje = valores.mensaje.trim();

    let errNombre = '';
    if (!nombre) errNombre = 'El nombre es obligatorio.';
    else if (nombre.length < 3) errNombre = 'El nombre debe tener al menos 3 caracteres.';

    let errEmail = '';
    if (!email) errEmail = 'El email es obligatorio.';
    else if (!RE_EMAIL.test(email)) errEmail = 'Ingresa un email válido.';

    let errAsunto = '';
    if (!asunto) errAsunto = 'El asunto es obligatorio.';
    else if (asunto.length < 3) errAsunto = 'El asunto debe tener al menos 3 caracteres.';

    let errMensaje = '';
    if (!mensaje) errMensaje = 'El mensaje es obligatorio.';
    else if (mensaje.length < 20) errMensaje = 'El mensaje debe tener al menos 20 caracteres.';

    this.errorNombre.set(errNombre);
    this.errorEmail.set(errEmail);
    this.errorAsunto.set(errAsunto);
    this.errorMensaje.set(errMensaje);

    if (errNombre || errEmail || errAsunto || errMensaje) return;

    this.enviado.set(true);
  }

  protected limpiar(campo: 'nombre' | 'email' | 'asunto' | 'mensaje'): void {
    switch (campo) {
      case 'nombre':
        this.errorNombre.set('');
        return;
      case 'email':
        this.errorEmail.set('');
        return;
      case 'asunto':
        this.errorAsunto.set('');
        return;
      case 'mensaje':
        this.errorMensaje.set('');
        return;
    }
  }
}
