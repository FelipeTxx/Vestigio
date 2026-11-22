import { Component, EventEmitter, Input, Output } from '@angular/core';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  chatbubbleEllipsesOutline,
  listOutline,
  trashOutline,
} from 'ionicons/icons';
import { Editor } from '@tiptap/core';
import { DiaryEntry, DiaryTypography } from '../diario.models';

@Component({
  selector: 'app-diario-pagina',
  templateUrl: './pagina.page.html',
  standalone: false,
})
export class PaginaPage {
  @Input() diary!: DiaryEntry;
  @Input() editor: Editor | null = null;
  @Input() pageNumber = 1;
  @Input() typography: DiaryTypography | null = null;
  @Input() caption = '';
  @Input() formattedDate = '';
  @Input() canDelete = false;

  @Output() returnToPages = new EventEmitter<void>();
  @Output() deletePage = new EventEmitter<void>();
  @Output() titleChanged = new EventEmitter<string>();
  @Output() bold = new EventEmitter<void>();
  @Output() italic = new EventEmitter<void>();
  @Output() heading = new EventEmitter<void>();
  @Output() bulletList = new EventEmitter<void>();
  @Output() blockquote = new EventEmitter<void>();

  constructor() {
    addIcons({
      arrowBackOutline,
      chatbubbleEllipsesOutline,
      listOutline,
      trashOutline,
    });
  }
}
