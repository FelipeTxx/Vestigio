import { Component, EventEmitter, Input, Output } from '@angular/core';
import { addIcons } from 'ionicons';
import { addOutline, arrowBackOutline, bookOutline, createOutline } from 'ionicons/icons';
import { Diary, DiaryPageCard } from '../diario.models';

@Component({
  selector: 'app-diarios-list',
  templateUrl: './diarios.page.html',
  styleUrls: ['./diarios.page.scss'],
  standalone: false,
})
export class DiariosPage {
  @Input() mode: 'diaries' | 'pages' = 'diaries';
  @Input() diaries: Diary[] = [];
  @Input() pages: DiaryPageCard[] = [];
  @Input() selectedDiary: Diary | null = null;
  @Input() currentStreak = 0;

  @Output() diarySelected = new EventEmitter<Diary>();
  @Output() addDiary = new EventEmitter<void>();
  @Output() editDiary = new EventEmitter<Diary>();
  @Output() pageSelected = new EventEmitter<DiaryPageCard>();
  @Output() addPage = new EventEmitter<void>();
  @Output() backToDiaries = new EventEmitter<void>();

  constructor() {
    addIcons({ addOutline, arrowBackOutline, bookOutline, createOutline });
  }
}
