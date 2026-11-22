import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HelpingService } from '../services/HelpingServices/helpingService';
import { DiarioService } from './diario.service';
import { Diary, DiaryInput } from './diario.models';

@Component({
  selector: 'app-diario',
  templateUrl: './diario.page.html',
  styleUrls: ['./diario.page.scss'],
  standalone: false,
})
export class DiarioPage {
  diaries: Diary[] = [];
  user: any;
  showDiaryDialog = false;
  editingDiary: Diary | null = null;
  pendingDiaryDelete: Diary | null = null;
  diaryTitle = '';
  diaryDescription = '';
  savingDiary = false;

  private readonly diaryColors = ['#8FAF92', '#B7836B', '#8C7D9C', '#B7985F'];

  constructor(
    private authService: AuthService,
    private diarioService: DiarioService,
    private helperService: HelpingService,
    private changeDetector: ChangeDetectorRef,
    private router: Router,
  ) {}

  ionViewWillEnter(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user?.id) {
      this.listDiaries();
      return;
    }

    this.authService.me().subscribe({
      next: user => {
        this.user = user;
        this.listDiaries();
      },
      error: error => this.helperService.showToast(error.message),
    });
  }

  listDiaries(): void {
    this.diarioService.listDiaries().subscribe({
      next: diaries => {
        this.diaries = [...diaries].sort((first, second) =>
          new Date(second.created_at || 0).getTime() - new Date(first.created_at || 0).getTime(),
        );
        this.changeDetector.markForCheck();
      },
      error: error => {
        console.error(error);
        this.helperService.showToast(error.message);
      },
    });
  }

  async addDiary(): Promise<void> {
    this.editingDiary = null;
    this.diaryTitle = '';
    this.diaryDescription = '';
    this.showDiaryDialog = true;
  }

  async editDiary(diary: Diary): Promise<void> {
    this.editingDiary = diary;
    this.diaryTitle = diary.title;
    this.diaryDescription = diary.description ?? '';
    this.showDiaryDialog = true;
  }

  closeDiaryDialog(): void {
    this.showDiaryDialog = false;
    this.editingDiary = null;
  }

  saveDiary(): void {
    if (this.savingDiary) return;

    const title = this.diaryTitle.trim();
    if (!title) {
      this.helperService.showToast('Informe um nome para o diário.');
      return;
    }

    const diary = this.editingDiary;
    this.savingDiary = true;
    const input: DiaryInput = {
      title,
      description: this.diaryDescription.trim(),
      icon: diary?.icon || 'book-outline',
      color: diary?.color || this.diaryColors[this.diaries.length % this.diaryColors.length],
    };

    if (diary) {
      this.diarioService.updateDiary({ title: input.title, description: input.description }, diary.id).subscribe({
        next: updated => {
          this.savingDiary = false;
          this.diaries = this.diaries.map(item => item.id === updated.id ? { ...item, ...updated } : item);
          this.closeDiaryDialog();
          this.changeDetector.markForCheck();
        },
        error: error => {
          this.savingDiary = false;
          console.error(error);
          this.helperService.showToast(error.message);
        },
      });
      return;
    }

    this.diarioService.createDiary(input).subscribe({
      next: createdDiary => {
        this.savingDiary = false;
        this.diaries = [createdDiary, ...this.diaries];
        this.closeDiaryDialog();
        this.changeDetector.markForCheck();
        void this.router.navigate(['/diario', createdDiary.id]);
      },
      error: error => {
        this.savingDiary = false;
        console.error(error);
        this.helperService.showToast(error.message);
      },
    });
  }

  requestDiaryDelete(): void {
    this.pendingDiaryDelete = this.editingDiary;
    this.closeDiaryDialog();
  }

  cancelDiaryDelete(): void {
    this.pendingDiaryDelete = null;
  }

  confirmDeleteDiary(): void {
    const diary = this.pendingDiaryDelete;
    if (!diary) return;

    this.diarioService.deleteDiary(diary.id).subscribe({
      next: () => {
        this.diaries = this.diaries.filter(item => item.id !== diary.id);
        this.pendingDiaryDelete = null;
        this.changeDetector.markForCheck();
      },
      error: error => {
        console.error(error);
        this.helperService.showToast(error.message);
      },
    });
  }

  openDiary(diary: Diary): void {
    void this.router.navigate(['/diario', diary.id]);
  }
}
