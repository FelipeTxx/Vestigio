import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';
import { TiptapEditorDirective } from 'ngx-tiptap';
import { PaginaPage } from './pagina.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, TiptapEditorDirective],
  declarations: [PaginaPage],
  exports: [PaginaPage],
})
export class PaginaModule {}
