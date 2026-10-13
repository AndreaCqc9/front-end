# TechNews Hub — Plataforma Web de Noticias Tecnológicas

> **Módulo:** Desarrollo de Front-End  
> **Actividad:** Entrega 2 – Prototipo Funcional (Semana 5)  
> **Proyecto:** Periodismo de Tecnología Independiente  
> **Stack:** Angular 22 + TypeScript (migración 1:1 del prototipo HTML/CSS/JS)  
> **Diseño en Figma:** [Ver Mockups & Maquetación en Figma](https://www.figma.com/design/LskF01uXAoyQvwP2twfBIx/FrontEnd--Community-?node-id=0-1&p=f&t=sVMB88daqURONpRU-0)  
> **Sitio Desplegado (GitHub Pages):** [https://andreacqc9.github.io/front-end/](https://andreacqc9.github.io/front-end/)

---

## 🎨 Maquetación y Diseño UI (Figma)

El prototipo funcional se construyó a partir del diseño y maquetación UI definido en Figma:
- **Enlace al Proyecto Figma:** [FrontEnd - Community Design](https://www.figma.com/design/LskF01uXAoyQvwP2twfBIx/FrontEnd--Community-?node-id=0-1&p=f&t=sVMB88daqURONpRU-0)
- **Vistas Diseñadas:** Landing / Home (Hero & Layouts), Catálogo de Noticias, Vista de Detalle, Sección de Favoritos, Formulario de Contacto y Panel de Gestión (Mini CRUD).

---

## 📋 Descripción del Proyecto

**TechNews Hub** es una plataforma web interactiva desarrollada para la divulgación de noticias y análisis de tecnología en español. El proyecto abarca un diseño moderno, adaptativo y accesible, permitiendo a los usuarios explorar publicaciones por categoría, consultar el detalle completo de las entradas, gestionar sus noticias favoritas de forma persistente y acceder a una interfaz de administración (Mini CRUD) para la creación y eliminación de contenidos.

Esta entrega cumple rigurosamente con las especificaciones establecidas en el documento de *Orientaciones para las entregas del módulo Front End*. El prototipo se migró a **Angular 22** conservando el diseño y el comportamiento originales, reemplazando la capa de scripts globales por componentes standalone y servicios reactivos basados en signals.

---

## 🚀 Funcionalidades Principales (Entrega 2)

### 1. 🏠 Página Principal (Home — `/`)
- **Sección Hero:** Destacado de noticias principales con llamados a la acción (CTA).
- **Catálogo Dinámico:** Renderizado de tarjetas de noticias filtrables y destacadas generado desde capa de datos.
- **Formulario Newsletter:** Suscripción con validación interactiva de correo electrónico.

### 2. 📰 Catálogo y Detalle de Noticias (`/noticias` y `/noticias/:id`)
- **Listado Completo:** Vista amplia de noticias categorizadas (IA, Ciberseguridad, Desarrollo, Ciencia, Gadgets).
- **Filtro y Búsqueda:** Búsqueda en tiempo real por palabra clave (`?q=`) y filtrado dinámico por categoría (`?categoria=`, acepta el id o el nombre de la categoría).
- **Vista Detallada (`/noticias/:id`):** Carga dinámica basada en el parámetro de ruta `id`, mostrando el artículo completo, metadatos y tiempo de lectura.

### 3. ⭐ Gestión de Favoritos (`/favoritos`)
- **Persistencia Local (`localStorage`):** Posibilidad de marcar/desmarcar noticias como favoritas desde cualquier tarjeta o vista de detalle.
- **Panel Dedicado:** Lista personalizada accesible en todo momento para gestionar noticias guardadas offline.

### 4. ✉️ Formulario de Contacto (`/contacto`)
- **Validación en Cliente:** Control estricto de campos obligatorios, sintaxis de correo electrónico y longitud mínima (Reactive Forms tipados).
- **Feedback Visual:** Notificaciones accesibles para el usuario sobre el estado del envío.

### 5. 🛠️ Administración de Noticias / Mini CRUD (`/gestion`)
- **Creación y Edición de Noticias:** Formulario interactivo para publicar y editar artículos especificando título, categoría, imagen y contenido.
- **Eliminación:** Opción de eliminar artículos existentes con sincronización automática del almacenamiento.
- **404 (`/**`):** Ruta comodín para direcciones inexistentes.

---

## 📁 Estructura del Proyecto

```text
front-end/
├── src/
│   ├── index.html                    # Documento host de la SPA
│   ├── main.ts                       # Bootstrap de la aplicación
│   ├── styles/
│   │   ├── tokens.css                # Sistema de diseño (variables CSS, color, tipografía, espaciado)
│   │   └── global.css                # Estilos globales, componentes y layout responsive
│   └── app/
│       ├── app.ts / app.html         # Shell: header + <router-outlet> + footer
│       ├── app.routes.ts             # Rutas lazy (loadComponent)
│       ├── app.config.ts             # Providers (router + component input binding)
│       ├── core/
│       │   ├── models/models.ts      # Noticia, Categoria, Autor, Faq, Metrica, Sitio
│       │   ├── data/seed.ts          # Dataset inicial tipado
│       │   └── services/
│       │       ├── noticias.service.ts   # Estado + localStorage + buscar/crear/actualizar/eliminar
│       │       └── favoritos.service.ts  # Signal de favoritos + alternar/esFavorito
│       ├── shared/
│       │   ├── ui/                   # Tag, Badge, Media, NoticiaCard, NoticiaGrid
│       │   └── pipes/                # tiempoRelativo, fechaLarga, fechaCorta
│       ├── layout/                   # header, footer
│       └── features/                 # home, noticias, noticia-detalle, favoritos,
│                                     # contacto, gestion, not-found
├── public/                           # Assets estáticos (imágenes, favicon)
├── angular.json                      # Configuración del workspace Angular
├── package.json                      # Scripts y dependencias
└── README.md                         # Documentación del proyecto
```

> El prototipo original en HTML/CSS/JS (Entrega 2) queda disponible en el historial de Git del repositorio.

---

## 🛠️ Tecnologías Utilizadas

- **Angular 22** con **componentes standalone** y _lazy loading_ por ruta (`loadComponent`).
- **TypeScript** con **signals** (`signal`, `computed`, `input`) como modelo de estado reactivo.
- **Control flow nativo** de template (`@if` / `@for`) en lugar de directivas estructurales.
- **Reactive Forms** tipados para los formularios de contacto y administración.
- **HTML5:** Estructuración semántica de contenido (`<main>`, `<article>`, `<header>`, `<footer>`, `<section>`).
- **CSS3:**
  - Layouts modernos basados en **Flexbox** y **CSS Grid**.
  - Variables CSS (`tokens.css`) para mantener consistencia de color, tipografía y espaciado.
  - Diseño responsivo adaptado a dispositivos móviles, tablets y escritorio.
- **Estado del cliente** con `localStorage` (claves `tnh:favoritos`, `tnh:noticias`, `tnh:borrados`).
- **Vitest** como runner de tests del scaffold de Angular.

---

## 💻 Instrucciones de Ejecución Local

**Requisitos:** Node.js 22 (recomendado gestionarlo con `nvm`; la versión está fijada en `.nvmrc`).

1. **Clonar el repositorio:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd front-end
   ```

2. **Seleccionar la versión de Node e instalar dependencias:**
   ```bash
   nvm use
   npm install
   ```

3. **Levantar el servidor de desarrollo:**
   ```bash
   npm start
   ```
   Luego abrir `http://localhost:4200/`. La aplicación se recarga automáticamente al modificar los archivos fuente.

4. **Compilar para producción:**
   ```bash
   npm run build
   ```
   Los artefactos se generan en el directorio `dist/`.

5. **Ejecutar los tests:**
   ```bash
   npm test
   ```

---

## 📄 Entregables del Módulo (Entrega 2)

- [x] Mockups y maquetación de pantallas en [Figma](https://www.figma.com/design/LskF01uXAoyQvwP2twfBIx/FrontEnd--Community-?node-id=0-1&p=f&t=sVMB88daqURONpRU-0).
- [x] Código fuente completo.
- [x] Renderizado dinámico de noticias a partir de estructura JSON / objetos JS.
- [x] Funcionalidad completa de lista de favoritos con `localStorage`.
- [x] Formularios interactivos con validación de datos en el cliente.
- [x] Estructura modular del proyecto y archivos de estilo separados.
- [x] Repositorio en GitHub y despliegue en **GitHub Pages**.
- [x] Migración a **Angular 22** con paridad funcional y visual 1:1.

---

## ✒️ Autor / Estudiante

- **Módulo:** Desarrollo de Front-End (Agosto 2026)  
- **Institución / Programa:** Módulo Teórico Práctico - Profesional  
