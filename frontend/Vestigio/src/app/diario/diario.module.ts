import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular/lazy';
import { DiarioPageRoutingModule } from './diario-routing.module';
import { DiarioPage } from './diario.page';
import { DiariosModule } from './diarios/diarios.module';
import { PaginaModule } from './pagina/pagina.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    DiarioPageRoutingModule,
    DiariosModule,
    PaginaModule
  ],
  declarations: [DiarioPage]
})
export class DiarioPageModule {}
