import { Component, EventEmitter, Input, Output } from '@angular/core';
import { addIcons } from 'ionicons';
import { addOutline, bookOutline } from 'ionicons/icons';
import { DiaryPageCard } from '../diario.models';

@Component({
  selector: 'app-diarios-list',
  templateUrl: './diarios.page.html',
  standalone: false,
})
export class DiariosPage {
  @Input() pages: DiaryPageCard[] = [];
  @Input() currentStreak = 0;
  @Output() pageSelected = new EventEmitter<DiaryPageCard>();
  @Output() addPage = new EventEmitter<void>();

  constructor() {
    addIcons({ addOutline, bookOutline });
  }
}
