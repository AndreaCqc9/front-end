import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'noticias',
    loadComponent: () =>
      import('./features/noticias/noticias.component').then((m) => m.NoticiasComponent),
  },
  {
    path: 'noticias/:id',
    loadComponent: () =>
      import('./features/noticia-detalle/noticia-detalle.component').then(
        (m) => m.NoticiaDetalleComponent,
      ),
  },
  {
    path: 'favoritos',
    loadComponent: () =>
      import('./features/favoritos/favoritos.component').then((m) => m.FavoritosComponent),
  },
  {
    path: 'contacto',
    loadComponent: () =>
      import('./features/contacto/contacto.component').then((m) => m.ContactoComponent),
  },
  {
    path: 'gestion',
    loadComponent: () =>
      import('./features/gestion/gestion.component').then((m) => m.GestionComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
