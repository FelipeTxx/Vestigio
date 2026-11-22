import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';
import { DiarioPageRoutingModule } from './diario-routing.module';
import { DiarioPage } from './diario.page';
import { DiariosModule } from './diarios/diarios.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiarioPageRoutingModule,
    DiariosModule
  ],
  declarations: [DiarioPage]
})
export class DiarioPageModule {}
