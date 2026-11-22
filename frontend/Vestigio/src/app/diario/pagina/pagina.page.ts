import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { addIcons } from 'ionicons';
import { arrowBackOutline, chatbubbleEllipsesOutline, listOutline, trashOutline } from 'ionicons/icons';
import { Subject, debounceTime } from 'rxjs';
import { HelpingService } from '../../services/HelpingServices/helpingService';
import { UserConfigService } from '../../user-config/user-config.service';
import { DiaryPageEntry, DiaryTypography } from '../diario.models';
import { DiarioService } from '../diario.service';

@Component({
  selector: 'app-diario-pagina',
  templateUrl: './pagina.page.html',
  styleUrls: ['./pagina.page.scss'],
  standalone: false,
})
export class PaginaPage implements OnDestroy {
  page: DiaryPageEntry = { id: 0, diary_id: 0, user_id: 0, title: '', content: '' };
  editor: Editor | null = null;
  pageNumber = 1;
  typography: DiaryTypography | null = null;
  readonly caption = 'PÁGINA DO DIÁRIO';
  formattedDate = '';
  canDelete = false;
  showDeleteConfirmation = false;

  private diaryId = 0;
  private pageId = 0;
  private readonly updateSubject = new Subject<DiaryPageEntry>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private diarioService: DiarioService,
    private userConfigService: UserConfigService,
    private helperService: HelpingService,
    private changeDetector: ChangeDetectorRef,
  ) {
    addIcons({ arrowBackOutline, chatbubbleEllipsesOutline, listOutline, trashOutline });
    this.updateSubject.pipe(debounceTime(1000)).subscribe(page => this.update(page));
  }

  ionViewWillEnter(): void {
    this.diaryId = Number(this.route.snapshot.paramMap.get('diaryId'));
    this.pageId = Number(this.route.snapshot.paramMap.get('pageId'));
    if (!Number.isInteger(this.diaryId) || this.diaryId < 1 || !Number.isInteger(this.pageId) || this.pageId < 1) {
      this.backToPages();
      return;
    }

    this.diarioService.getPage(this.pageId).subscribe({
      next: page => {
        if (page.diary_id !== this.diaryId) {
          this.backToPages();
          return;
        }
        this.page = page;
        this.canDelete = true;
        this.formattedDate = page.created_at ? this.formatDate(page.created_at) : '';
        this.initializeEditor(page.content || '<p></p>');
        this.changeDetector.markForCheck();
        this.loadTypography(page.user_id);
        this.diarioService.listPages(this.diaryId).subscribe({
          next: pages => {
            const index = pages.findIndex(entry => entry.id === page.id);
            this.pageNumber = index >= 0 ? index + 1 : 1;
            this.changeDetector.markForCheck();
          },
          error: error => console.error('Não foi possível calcular o número da página.', error),
        });
      },
      error: error => {
        console.error(error);
        this.helperService.showToast(error.message);
        this.backToPages();
      },
    });
  }

  ngOnDestroy(): void {
    this.updateSubject.complete();
    this.destroyEditor();
  }

  titleChanged(title: string): void {
    this.page.title = title;
    this.updateSubject.next(this.page);
  }

  returnToPages(): void {
    void this.router.navigate(['/diario', this.diaryId]);
  }

  deletePage(): void {
    if (!this.pageId) return;
    this.showDeleteConfirmation = true;
  }

  cancelDeletePage(): void {
    this.showDeleteConfirmation = false;
  }

  confirmDeletePage(): void {
    this.showDeleteConfirmation = false;

    this.diarioService.deletePage(this.pageId).subscribe({
      next: () => this.returnToPages(),
      error: error => {
        console.error(error);
        this.helperService.showToast(error.message);
      },
    });
  }

  toggleBold(): void { this.editor?.chain().focus().toggleBold().run(); }
  toggleItalic(): void { this.editor?.chain().focus().toggleItalic().run(); }
  toggleHeading(): void { this.editor?.chain().focus().toggleHeading({ level: 2 }).run(); }
  toggleBulletList(): void { this.editor?.chain().focus().toggleBulletList().run(); }
  toggleBlockquote(): void { this.editor?.chain().focus().toggleBlockquote().run(); }

  focusEditorAt(event: MouseEvent): void {
    if (!this.editor) return;
    const target = event.target;
    if (target instanceof HTMLElement && target.closest('.ProseMirror')) return;

    event.preventDefault();
    const position = this.editor.view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos;
    if (position === undefined) this.editor.commands.focus('end');
    else this.editor.commands.focus(position);
  }

  private initializeEditor(content: string): void {
    this.destroyEditor();
    this.editor = new Editor({
      extensions: [StarterKit],
      content,
      editorProps: {
        attributes: {
          class: 'diary-prosemirror',
          spellcheck: 'true',
          'aria-label': 'Conteúdo da página do diário',
        },
      },
      onUpdate: ({ editor }) => {
        this.page.content = editor.getHTML();
        this.updateSubject.next(this.page);
        this.changeDetector.markForCheck();
      },
    });
  }

  private update(page: DiaryPageEntry): void {
    if (!page.id) return;
    this.diarioService.updatePage({ title: page.title, content: page.content }, page.id).subscribe({
      next: updatedPage => Object.assign(this.page, updatedPage),
      error: error => {
        console.error(error);
        this.helperService.showToast(error.message);
      },
    });
  }

  private loadTypography(userId: number): void {
    this.typography = null;
    if (!userId) {
      this.changeDetector.markForCheck();
      return;
    }
    this.userConfigService.getByUser(userId).subscribe({
      next: (response: any) => {
        const config = response?.[0];
        if (!config) {
          this.typography = null;
          this.changeDetector.markForCheck();
          return;
        }
        const lineSpacing = Number(config.line_spacing);
        const letterSpacing = Number(config.letter_spacing);
        this.typography = Number.isFinite(lineSpacing) && Number.isFinite(letterSpacing)
          ? { lineSpacing, letterSpacing }
          : null;
        this.changeDetector.markForCheck();
      },
      error: error => console.error('Não foi possível carregar a tipografia do diário.', error),
    });
  }

  private formatDate(value: string): string {
    return new Date(value).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'short', year: 'numeric',
    }).replace('.', '').toUpperCase();
  }

  private backToPages(): void {
    if (this.diaryId > 0) void this.router.navigate(['/diario', this.diaryId]);
    else void this.router.navigate(['/diario']);
  }

  private destroyEditor(): void {
    this.editor?.destroy();
    this.editor = null;
  }
}
