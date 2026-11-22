import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';
import { TiptapEditorDirective } from 'ngx-tiptap';
import { PaginaPage } from './pagina.page';
import { PaginaRoutingModule } from './pagina-routing.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, TiptapEditorDirective, PaginaRoutingModule],
  declarations: [PaginaPage],
})
export class PaginaModule {}
