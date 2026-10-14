export interface Sitio {
  nombre: string;
  descripcion: string;
  dominio: string;
}

export interface Categoria {
  id: string;
  nombre: string;
}

export interface Autor {
  id: string;
  nombre: string;
  rol: string;
}

export interface Noticia {
  id: string;
  titulo: string;
  categoria: string;
  autor: string;
  fecha: string;
  destacada: boolean;
  imagen: string | null;
  resumen: string;
  cuerpo: string[];
}

export interface Faq {
  pregunta: string;
  respuesta: string;
}

export interface Metrica {
  valor: string;
  etiqueta: string;
}

export interface DatosSitio {
  sitio: Sitio;
  categorias: Categoria[];
  autores: Autor[];
  noticias: Noticia[];
  faq: Faq[];
  metricas: Metrica[];
}
