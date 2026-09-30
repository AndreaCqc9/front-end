# TechNews Hub — Plataforma Web de Noticias Tecnológicas

> **Módulo:** Desarrollo de Front-End  
> **Actividad:** Entrega 2 – Prototipo Funcional (Semana 5)  
> **Proyecto:** Periodismo de Tecnología Independiente  
> **Diseño en Figma:** [Ver Mockups & Maquetación en Figma](https://www.figma.com/design/LskF01uXAoyQvwP2twfBIx/FrontEnd--Community-?node-id=0-1&p=f&t=sVMB88daqURONpRU-0)

---

## 🎨 Maquetación y Diseño UI (Figma)

El prototipo funcional se construyó a partir del diseño y maquetación UI definido en Figma:
- **Enlace al Proyecto Figma:** [FrontEnd - Community Design](https://www.figma.com/design/LskF01uXAoyQvwP2twfBIx/FrontEnd--Community-?node-id=0-1&p=f&t=sVMB88daqURONpRU-0)
- **Vistas Diseñadas:** Landing / Home (Hero & Layouts), Catálogo de Noticias, Vista de Detalle, Sección de Favoritos, Formulario de Contacto y Panel de Gestión (Mini CRUD).

---

## 📋 Descripción del Proyecto

**TechNews Hub** es una plataforma web interactiva desarrollada para la divulgación de noticias y análisis de tecnología en español. El proyecto abarca un diseño moderno, adaptativo y accesible, permitiendo a los usuarios explorar publicaciones por categoría, consultar el detalle completo de las entradas, gestionar sus noticias favoritas de forma persistente y acceder a una interfaz de administración (Mini CRUD) para la creación y eliminación de contenidos.

Esta entrega cumple rigurosamente con las especificaciones establecidas en el documento de *Orientaciones para las entregas del módulo Front End*, consolidando el prototipo funcional mediante tecnologías fundamentales de la web moderna.

---

## 🚀 Funcionalidades Principales (Entrega 2)

### 1. 🏠 Página Principal (Home - `index.html`)
- **Sección Hero:** Destacado de noticias principales con llamados a la acción (CTA).
- **Catálogo Dinámico:** Renderizado de tarjetas de noticias filtrables y destacadas generado desde capa de datos.
- **Formulario Newsletter:** Suscripción con validación interactiva de correo electrónico.

### 2. 📰 Catálogo y Detalle de Noticias (`noticias.html` & `noticia.html`)
- **Listado Completo:** Vista amplia de noticias categorizadas (IA, Ciberseguridad, Desarrollo, Ciencia, Gadgets).
- **Filtro y Búsqueda:** Búsqueda en tiempo real por palabra clave y filtrado dinámico por categoría.
- **Vista Detallada (`noticia.html?id=...`):** Carga dinámica basada en el parámetro URL `id`, mostrando el artículo completo, metadatos y tiempo de lectura.

### 3. ⭐ Gestión de Favoritos (`favoritos.html`)
- **Persistencia Local (`localStorage`):** Posibilidad de marcar/desmarcar noticias como favoritas desde cualquier tarjeta o vista de detalle.
- **Panel Dedicado:** Lista personalizada accesible en todo momento para gestionar noticias guardadas offline.

### 4. ✉️ Formulario de Contacto (`contacto.html`)
- **Validación en Cliente:** Control estricto de campos obligatorios, sintaxis de correo electrónico y longitud mínima.
- **Feedback Visual:** Notificaciones accesibles para el usuario sobre el estado del envío.

### 5. 🛠️ Administración de Noticias / Mini CRUD (`gestion.html`)
- **Creación de Noticias:** Formulario interactivo para publicar nuevos artículos especificando título, categoría, imagen y contenido.
- **Eliminación:** Opción de eliminar artículos existentes con sincronización automática del almacenamiento.

---

## 📁 Estructura del Proyecto

```text
front-end/
├── index.html            # Página de inicio / Landing page
├── noticias.html         # Catálogo de noticias con filtros y búsqueda
├── noticia.html          # Vista en detalle de noticia específica
├── favoritos.html        # Sección de artículos guardados por el usuario
├── contacto.html         # Formulario de contacto con validaciones
├── gestion.html          # Mini CRUD para creación y eliminación de noticias
├── css/
│   ├── tokens.css        # Sistema de diseño (Variables CSS, colores, tipografía)
│   └── styles.css        # Estilos globales, componentes y layout responsive
├── js/
│   ├── datos.js          # Dataset inicial y modelos de información
│   ├── almacen.js        # Capa de almacenamiento y estado (localStorage API)
│   ├── componentes.js    # Componentes dinámicos UI (Cards, badges, botones)
│   ├── layout.js         # Renderizado reutilizable de Header y Footer
│   └── interacciones.js # Lógica de eventos, filtros, validaciones y CRUD
├── img/                  # Recursos gráficos e imágenes de noticias
└── README.md             # Documentación del proyecto
```

---

## 🛠️ Tecnologías Utilizadas

- **HTML5:** Estructuración semántica de contenido (`<main>`, `<article>`, `<header>`, `<footer>`, `<section>`).
- **CSS3:** 
  - Layouts modernos basados en **Flexbox** y **CSS Grid**.
  - Variables CSS (`tokens.css`) para mantener consistencia de color, tipografía y espaciado.
  - Diseño responsivo adaptado a dispositivos móviles, tablets y escritorio.
- **JavaScript (ES6+):**
  - Manipulación avanzada del DOM y delegación de eventos.
  - Gestión de estado cliente con `localStorage`.
  - Lectura de parámetros de navegación vía `URLSearchParams`.
  - Módulos organizados por responsabilidad (Patrón de separación de conceptos).

---

## 💻 Instrucciones de Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd front-end
   ```

2. **Ejecutar el proyecto:**
   - Al tratarse de un prototipo construido con HTML/CSS/JS vanila, no requiere de una etapa de compilación o instalación de dependencias mediante Node.js.
   - Puede abrir directamente `index.html` en cualquier navegador web moderno (Google Chrome, Mozilla Firefox, Safari, Edge).
   - *Recomendación:* Utilizar una extensión de servidor local como **Live Server** en VS Code / IDE para una óptima experiencia con recarga en vivo.

---

## 📄 Entregables del Módulo (Entrega 2)

- [x] Mockups y maquetación de pantallas en [Figma](https://www.figma.com/design/LskF01uXAoyQvwP2twfBIx/FrontEnd--Community-?node-id=0-1&p=f&t=sVMB88daqURONpRU-0).
- [x] Código fuente completo en HTML, CSS y JavaScript.
- [x] Renderizado dinámico de noticias a partir de estructura JSON / objetos JS.
- [x] Funcionalidad completa de lista de favoritos con `localStorage`.
- [x] Formularios interactivos con validación de datos en el cliente.
- [x] Estructura modular del proyecto y archivos de estilo separados.
- [x] Repositorio en GitHub listo para despliegue.

---

## ✒️ Autor / Estudiante

- **Módulo:** Desarrollo de Front-End (Agosto 2026)  
- **Institución / Programa:** Módulo Teórico Práctico - Profesional  
