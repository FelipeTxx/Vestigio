import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  addOutline,
  arrowBackOutline,
  bookOutline,
  chatbubbleEllipsesOutline,
  listOutline,
  trashOutline,
} from 'ionicons/icons';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { DiarioService } from './diario.service';
import { HelpingService } from '../services/HelpingServices/helpingService';
import { AuthService } from '../services/auth.service';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { DiaryTypography, UserConfigService } from '../user-config/user-config.service';

export interface DiaryEntry {
  id?: number;
  user_id: any;
  title: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

@Component({
  selector: 'app-diario',
  templateUrl: './diario.page.html',
  standalone: false,
})
export class DiarioPage implements OnInit, OnDestroy {
  readonly editorCaption = 'PÁGINA DO DIÁRIO';

  diaries: DiaryEntry[] = [];
  diary: DiaryEntry = {
    user_id: 0,
    title: '',
    content: ''
  };
  selectedDiary: DiaryEntry | null = null;
  editor: Editor | null = null;
  view: 'roadmap' | 'writer' = 'roadmap';
  @ViewChild(IonContent) private content?: IonContent;

  private updateSubject = new Subject<void>();
  private typographySubscription?: Subscription;
  typography: DiaryTypography;

  user: any;
  recentDiaryId: any;

  constructor(
    private authService: AuthService, 
    private diarioService: DiarioService,
    private helperService: HelpingService,
    private changeDetector: ChangeDetectorRef,
    private configService: UserConfigService
  ) {
    this.typography = configService.typography;
    addIcons({
      addOutline,
      arrowBackOutline,
      bookOutline,
      listOutline,
      trashOutline,
      chatbubbleEllipsesOutline
    });
    this.user = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.clearPreviousLocalData();

    this.typographySubscription = this.configService.typography$.subscribe((typography) => {
      this.typography = typography;
      this.changeDetector.markForCheck();
    });

    this.updateSubject.pipe(
      debounceTime(1000)
    ).subscribe(() => this.update());
  }

  ngOnDestroy(): void {
    this.updateSubject.complete();
    this.typographySubscription?.unsubscribe();
    this.destroyEditor();
  }

  ionViewDidEnter(): void {
    if (this.view === 'roadmap') {
      requestAnimationFrame(() => void this.content?.scrollToBottom(250));
    }
  }

  ionViewWillEnter(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user?.id) {
      this.list();
      return;
    }

    this.authService.me().subscribe({
      next: (user: any) => {
        this.user = user;
        this.list();
      },
      error: (error: any) => {
        console.log(error);
        this.helperService.showToast(error.message);
      }
    });
  }

  openDiary(diary: DiaryEntry): void {
    this.destroyEditor();
    this.selectedDiary = diary;
    this.view = 'writer';
    this.editor = new Editor({
      extensions: [StarterKit],
      content: diary.content || '<p></p>',
      onUpdate: ({ editor }) => {
        if (!this.selectedDiary) return;
        this.selectedDiary.content = editor.getHTML();
        this.updateSubject.next();
      }
    });
  }

  addDiary(): void {
    this.diary = {
      user_id: this.user.id, 
      title: 'Novo diário',
      content: '...'
    };

    this.diaries.push(this.diary);
    this.store();
    this.openDiary(this.diary);
  }

  returnToRoadmap(): void {
    this.destroyEditor();
    this.selectedDiary = null;
    this.view = 'roadmap';
  }

  get selectedDiaryId(): number | null {
    return this.selectedDiary?.id ?? null;
  }

  get selectedPageNumber(): number {
    if (!this.selectedDiary) return 1;
    const index = this.diaries.indexOf(this.selectedDiary);
    return index >= 0 ? index + 1 : this.diaries.length + 1;
  }

  get currentStreak(): number {
    if (this.diaries.length < 2) return 0;

    const newestDay = this.calendarDay(this.diaries[this.diaries.length - 1].created_at);
    const now = new Date();
    const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86_400_000;
    if (newestDay === null || today - newestDay < 0 || today - newestDay > 1) return 0;

    let streak = 1;
    let currentRunDay = newestDay;
    for (let index = this.diaries.length - 2; index >= 0; index--) {
      const previousDay = this.calendarDay(this.diaries[index].created_at);
      if (previousDay === currentRunDay) continue;
      if (previousDay !== currentRunDay - 1) break;
      streak++;
      currentRunDay = previousDay;
    }
    return streak;
  }

  hasConsecutiveNextPage(index: number): boolean {
    return this.areConsecutiveDays(this.diaries[index]?.created_at, this.diaries[index + 1]?.created_at);
  }

  isPageInStreak(index: number): boolean {
    return this.hasConsecutiveNextPage(index)
      || this.areConsecutiveDays(this.diaries[index - 1]?.created_at, this.diaries[index]?.created_at);
  }

  deleteSelectedDiary(): void {
    if (this.selectedDiaryId !== null) {
      this.destroy(this.selectedDiaryId);
    }
  }

  updateTitle(title: string): void {
    if (!this.selectedDiary) return;
    this.selectedDiary.title = title;
    this.updateSubject.next();
  }

  previewText(content: string): string {
    return (content || '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
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

  formattedDate(date: string): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).replace('.', '').toUpperCase();
  }

  toggleBold(): void {
    this.editor?.chain().focus().toggleBold().run();
  }

  toggleItalic(): void {
    this.editor?.chain().focus().toggleItalic().run();
  }

  toggleHeading(): void {
    this.editor?.chain().focus().toggleHeading({ level: 2 }).run();
  }

  toggleBulletList(): void {
    this.editor?.chain().focus().toggleBulletList().run();
  }

  toggleBlockquote(): void {
    this.editor?.chain().focus().toggleBlockquote().run();
  }

  private clearPreviousLocalData(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.removeItem('vestigio.diaries.v1');
    } catch {}
  }

  private destroyEditor(): void {
    this.editor?.destroy();
    this.editor = null;
  }

  store(): void {
    if (this.diaries && this.diaries.length > 0) {
      console.log(this.diary)
      this.diarioService.create(this.diary).subscribe({
        next: (response: any) => {
          console.log("response> ",response);
          this.recentDiaryId = response.id;
          Object.assign(this.diary, response);
          this.changeDetector.markForCheck();
        },
        error: (error: any) => {
          console.log(error);
          this.helperService.showToast(error.message);
        }
      });
    }
  }

  update(): void {
    if (this.diaries && this.diaries.length > 0) {

      let toUpdate = {
        title: this.selectedDiary?.title,
        content: this.selectedDiary?.content,
        user_id: this.selectedDiary?.user_id,

      }
      console.log(toUpdate)
      this.diarioService.update(toUpdate, this?.selectedDiary?.id).subscribe({
        next: (response: any) => {
          console.log(response);
        },
        error: (error: any) => {
          console.log(error);
          this.helperService.showToast(error.message);
        }
      });
    }
  }

  list(){
    this.diarioService.getByUser(this.user.id).subscribe({
        next: (response: any) => {
          const diaries = Array.isArray(response) ? response as DiaryEntry[] : [];
          this.diaries = [...diaries].sort((a, b) =>
            new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
          );
          this.changeDetector.markForCheck();
          requestAnimationFrame(() => void this.content?.scrollToBottom(250));
        },
        error: (error: any) => {
          console.log(error);
          this.helperService.showToast(error.message);
        }
      });
  }

    destroy(id: number){
      this.diarioService.destroy(id).subscribe({
          next: (response: any) => {
            console.log(response);
            this.diaries = this.diaries.filter(diary => diary.id !== id);
            if (this.selectedDiary?.id === id) {
              this.returnToRoadmap();
            }
            this.changeDetector.markForCheck();
          },
          error: (error: any) => {
            console.log(error);
            this.helperService.showToast(error.message);
          }
        });
    }

}
