import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular/lazy';
import { DiarioPagesRoutingModule } from './diario-routing.module';
import { DiarioPagesPage } from './diario.page';
import { DiariosModule } from '../diarios/diarios.module';

@NgModule({
  imports: [CommonModule, IonicModule, DiarioPagesRoutingModule, DiariosModule],
  declarations: [DiarioPagesPage],
})
export class DiarioPagesModule {}
