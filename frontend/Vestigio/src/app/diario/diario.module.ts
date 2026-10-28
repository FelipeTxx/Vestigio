import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { DiarioPageRoutingModule } from './diario-routing.module';

import { DiarioPage } from './diario.page';

import { TiptapEditorDirective } from 'ngx-tiptap';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiarioPageRoutingModule,
    TiptapEditorDirective
  ],
  declarations: [DiarioPage]
})
export class DiarioPageModule {}
