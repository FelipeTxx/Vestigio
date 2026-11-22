import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular/lazy';
import { DiariosPage } from './diarios.page';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [DiariosPage],
  exports: [DiariosPage],
})
export class DiariosModule {}
