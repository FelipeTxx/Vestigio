import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Diary, DiaryPageCard, DiaryPageEntry } from '../diario.models';
import { DiarioService } from '../diario.service';
import { HelpingService } from '../../services/HelpingServices/helpingService';

@Component({
  selector: 'app-diario-pages',
  templateUrl: './diario.page.html',
  styleUrls: ['./diario.page.scss'],
  standalone: false,
})
export class DiarioPagesPage {
  diary: Diary | null = null;
  pages: DiaryPageEntry[] = [];
  private diaryId = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private diarioService: DiarioService,
    private helperService: HelpingService,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ionViewWillEnter(): void {
    const diaryId = Number(this.route.snapshot.paramMap.get('diaryId'));
    if (!Number.isInteger(diaryId) || diaryId < 1) {
      void this.router.navigate(['/diario']);
      return;
    }

    this.diaryId = diaryId;
    this.diarioService.getDiary(diaryId).subscribe({
      next: diary => {
        if (this.diaryId !== diaryId) return;
        this.diary = diary;
        this.changeDetector.markForCheck();
      },
      error: error => {
        console.error(error);
        this.helperService.showToast(error.message);
        void this.router.navigate(['/diario']);
      },
    });
    this.diarioService.listPages(diaryId).subscribe({
      next: pages => {
        if (this.diaryId !== diaryId) return;
        this.pages = [...pages].sort((first, second) =>
          new Date(first.created_at || 0).getTime() - new Date(second.created_at || 0).getTime(),
        );
        this.changeDetector.markForCheck();
      },
      error: error => {
        console.error(error);
        this.helperService.showToast(error.message);
      },
    });
  }

  get pageCards(): DiaryPageCard[] {
    return this.pages.map((page, index) => ({
      page,
      pageNumber: index + 1,
      dateLabel: page.created_at ? this.formattedDate(page.created_at) : '',
      excerpt: this.previewText(page.content),
      hasConsecutiveNextPage: this.areConsecutiveDays(this.pages[index]?.created_at, this.pages[index + 1]?.created_at),
      isInStreak: this.areConsecutiveDays(this.pages[index - 1]?.created_at, this.pages[index]?.created_at)
        || this.areConsecutiveDays(this.pages[index]?.created_at, this.pages[index + 1]?.created_at),
    }));
  }

  get currentStreak(): number {
    if (this.pages.length === 0) return 0;
    let streak = 0;
    let previousDay: number | null = null;
    const today = this.calendarDay(new Date().toISOString());
    if (today === null) return 0;
    for (let index = this.pages.length - 1; index >= 0; index--) {
      const day = this.calendarDay(this.pages[index].created_at);
      if (day === null) break;
      if (previousDay !== null && previousDay - day > 1) break;
      if (previousDay === null && today - day > 1) break;
      streak++;
      previousDay = day;
    }
    return streak;
  }

  openPage(page: DiaryPageCard): void {
    void this.router.navigate(['/diario', this.diaryId, 'page', page.page.id]);
  }

  addPage(): void {
    if (!this.diaryId) return;
    this.diarioService.createPage(this.diaryId, { title: 'Nova página', content: '<p></p>' }).subscribe({
      next: page => {
        void this.router.navigate(['/diario', this.diaryId, 'page', page.id]);
      },
      error: error => {
        console.error(error);
        this.helperService.showToast(error.message);
      },
    });
  }

  backToDiaries(): void {
    void this.router.navigate(['/diario']);
  }

  private previewText(content: string): string {
    return (content || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim();
  }

  private formattedDate(value: string): string {
    return new Date(value).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'short', year: 'numeric',
    }).replace('.', '').toUpperCase();
  }

  private areConsecutiveDays(first?: string, second?: string): boolean {
    const firstDay = this.calendarDay(first);
    const secondDay = this.calendarDay(second);
    return firstDay !== null && secondDay === firstDay + 1;
  }

  private calendarDay(value?: string): number | null {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000;
  }
}
