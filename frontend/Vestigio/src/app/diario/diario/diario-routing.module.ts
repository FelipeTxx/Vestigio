import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiarioPagesPage } from './diario.page';

const routes: Routes = [{ path: '', component: DiarioPagesPage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiarioPagesRoutingModule {}
