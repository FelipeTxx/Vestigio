import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';
import { TiptapEditorDirective } from 'ngx-tiptap';
import { PaginaPage } from './pagina.page';
import { PaginaRoutingModule } from './pagina-routing.module';
import { IconChoiceModule } from '../../component/icon_choice/icon_choice.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, TiptapEditorDirective, PaginaRoutingModule, IconChoiceModule],
  declarations: [PaginaPage],
})
export class PaginaModule {}
