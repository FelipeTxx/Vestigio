import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiarioPage } from './diario.page';

const routes: Routes = [
  { path: '', component: DiarioPage },
  {
    path: ':diaryId/page/:pageId',
    loadChildren: () => import('./pagina/pagina.module').then(module => module.PaginaModule),
  },
  {
    path: ':diaryId',
    loadChildren: () => import('./diario/diario.module').then(module => module.DiarioPagesModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiarioPageRoutingModule {}
