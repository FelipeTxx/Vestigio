import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserConfig } from './user-config';

const routes: Routes = [{ path: '', component: UserConfig }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserConfigRoutingModule { }
