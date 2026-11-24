import { ChangeDetectorRef, Component, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Editor, Mark, mergeAttributes } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { addIcons } from 'ionicons';
import {
  addOutline,
  alarmOutline,
  arrowBackOutline,
  bonfireOutline,
  bookOutline,
  cafeOutline,
  chatbubbleEllipsesOutline,
  fitnessOutline,
  heartOutline,
  leafOutline,
  listOutline,
  moonOutline,
  musicalNotesOutline,
  pizzaOutline,
  sparklesOutline,
  sunnyOutline,
  trashOutline,
  walkOutline,
  waterOutline,
} from 'ionicons/icons';
import { Subject, debounceTime, finalize } from 'rxjs';
import { HelpingService } from '../../services/HelpingServices/helpingService';
import { UserConfigService } from '../../user-config/user-config.service';
import { DiaryPageEntry, DiaryTypography } from '../diario.models';
import { DiarioService } from '../diario.service';

interface HabitTypeOption {
  id: number;
  name: string;
  is_default?: boolean;
}

function validHabitColor(color: string): string {
  return /^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(color) ? color : '#8FAF92';
}

function habitHighlightTints(color: string): { tint: string; alternate: string } {
  const normalized = validHabitColor(color).slice(1);
  const expanded = normalized.length === 3
    ? normalized.split('').map(character => character + character).join('')
    : normalized;
  const channels = [0, 2, 4].map(index => parseInt(expanded.slice(index, index + 2), 16));
  const blendWithWhite = (amount: number) => `#${channels
    .map(channel => Math.round(channel + (255 - channel) * amount).toString(16).padStart(2, '0'))
    .join('')}`;
  return { tint: blendWithWhite(0.84), alternate: blendWithWhite(0.91) };
}

const HabitHighlight = Mark.create({
  name: 'habitHighlight',
  inclusive: true,
  addAttributes() {
    return {
      habitId: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('data-habit-id'),
        renderHTML: (attributes: Record<string, any>) => ({ 'data-habit-id': attributes['habitId'] }),
      },
      habitKey: {
        default: '',
        parseHTML: (element: HTMLElement) => element.getAttribute('data-habit-key'),
        renderHTML: (attributes: Record<string, any>) => ({ 'data-habit-key': attributes['habitKey'] }),
      },
      habitName: {
        default: '',
        parseHTML: (element: HTMLElement) => element.getAttribute('data-habit-name'),
        renderHTML: (attributes: Record<string, any>) => ({ 'data-habit-name': attributes['habitName'] }),
      },
      habitColor: {
        default: '#8FAF92',
        parseHTML: (element: HTMLElement) => element.getAttribute('data-habit-color'),
        renderHTML: (attributes: Record<string, any>) => ({ 'data-habit-color': attributes['habitColor'] }),
      },
    };
  },
  parseHTML() {
    return [{
      tag: 'span[data-habit-mark]',
      contentElement: (node: HTMLElement) => node.querySelector('[data-habit-content]') ?? node,
    }];
  },
  renderHTML({ HTMLAttributes }) {
    const color = validHabitColor(HTMLAttributes['data-habit-color'] || '#8FAF92');
    const tints = habitHighlightTints(color);
    const name = HTMLAttributes['data-habit-name'] || 'Hábito';
    return ['span', mergeAttributes(HTMLAttributes, {
      class: 'habit-highlight',
      'data-habit-mark': '',
      style: `--habit-color:${color};--habit-tint:${tints.tint};--habit-tint-alternate:${tints.alternate}`,
    }),
    ['span', { 'data-habit-content': '', class: 'habit-highlight-content' }, 0],
    ['span', { 'data-habit-popover': '', contenteditable: 'false' },
      ['span', { 'data-habit-dot': '', 'aria-hidden': 'true' }],
      ['span', { 'data-habit-label': '', 'aria-hidden': 'true' }, name],
      ['button', {
        type: 'button',
        'data-habit-remove': '',
        'aria-label': `Remover marcação de ${name}`,
        title: 'Remover marcação',
      }, '×']]];
  },
});

@Component({
  selector: 'app-diario-pagina',
  templateUrl: './pagina.page.html',
  styleUrls: ['./pagina.page.scss'],
  standalone: false
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

  habitToggle: boolean = false;
  habit_list: { name: string; icon: string; color: string; habit_type_id?: number | null }[] = [
    
  ];
  habitDialogOpen = false;
  habitTypes: HabitTypeOption[] = [];
  habitTypesLoading = false;
  habitDraft = { name: '', icon: 'sparkles-outline', color: '#8FAF92', habit_type_id: null as number | null };
  habitSelections: { id: string; habit_name: string; habit_color: string; text: string, rawId: number }[] = [];
  activeTypingHabit: { key: string; name: string; color: string } | null = null;
  private selectedHabitKey: string | null = null;
  private habitSelectionSequence = 0;
  private activeHabitPopover: HTMLElement | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private diarioService: DiarioService,
    private userConfigService: UserConfigService,
    private helperService: HelpingService,
    private changeDetector: ChangeDetectorRef,
  ) {
    addIcons({
      addOutline,
      alarmOutline,
      arrowBackOutline,
      bonfireOutline,
      bookOutline,
      cafeOutline,
      chatbubbleEllipsesOutline,
      fitnessOutline,
      heartOutline,
      leafOutline,
      listOutline,
      moonOutline,
      musicalNotesOutline,
      pizzaOutline,
      sparklesOutline,
      sunnyOutline,
      trashOutline,
      walkOutline,
      waterOutline,
    });
    this.updateSubject.pipe(debounceTime(1000)).subscribe(page => this.update(page));
  }

  ionViewWillEnter(): void {
    let user_id;
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
        user_id = page.user_id;
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

    this.diarioService.getHabits().subscribe(
      (response: any)=>{
        console.log(response);
        this.habit_list = response;
      },
      (error: any)=>{
        this.helperService.showToast(error.message)
      }
    );
    this.diarioService.findRegisterByUserId(40).subscribe(
      (response: any)=>{
        console.log(response);
        if(response.length > 0){
          this.habitSelections = response;
        }
        else{
          console.log("ff", response)
        }
      },
      (error: any)=>{
        this.helperService.showToast(error.message)
      }
    );

    
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

  applyHabit(habit: { id?: number; name: string; icon: string; color: string }): void {
    if (!this.editor) return;
    const { from, to, empty } = this.editor.state.selection;
    const color = validHabitColor(habit.color);
    const activeId = this.habitMarkerId(habit);
    const attributes = {
      habitId: activeId,
      habitKey: activeId,
      habitName: habit.name,
      habitColor: color,
    };

    if (empty || from === to) {
      if (this.editor.isActive('habitHighlight', { habitKey: activeId })) {
        this.editor.chain().focus().unsetMark('habitHighlight').run();
        this.activeTypingHabit = null;
      } else {
        this.editor.chain().focus().setMark('habitHighlight', attributes).run();
        this.activeTypingHabit = { key: activeId, name: habit.name, color };
      }
      this.changeDetector.markForCheck();
      return;
    }

    this.activeTypingHabit = null;
    if (this.editor.isActive('habitHighlight', { habitKey: activeId })) {
      this.editor.chain().focus().unsetMark('habitHighlight').setTextSelection(to).run();
      this.changeDetector.markForCheck();
      return;
    }

    attributes.habitId = `selection-${Date.now()}-${++this.habitSelectionSequence}`;
    this.editor.chain().focus().setMark('habitHighlight', attributes).setTextSelection(to).run();
    this.refreshHabitSelections(this.editor);
    this.changeDetector.markForCheck();
  }

  isHabitActive(habit: { id?: number; name: string; color: string }): boolean {
    const key = this.habitMarkerId(habit);
    return this.activeTypingHabit?.key === key || this.selectedHabitKey === key;
  }

  private habitMarkerId(habit: { id?: number; name: string; color: string }): string {
    return `habit-${habit.id ?? `${habit.name}:${validHabitColor(habit.color)}`}`;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target;
    if (target instanceof HTMLElement && target.closest('[data-habit-popover]')) return;
    this.closeHabitPopover();
  }

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
      extensions: [StarterKit, HabitHighlight],
      content,
      editorProps: {
        attributes: {
          class: 'diary-prosemirror',
          spellcheck: 'true',
          'aria-label': 'Conteúdo da página do diário',
        },
        handleDOMEvents: {
          mouseover: (_view, event) => {
            const target = event.target;
            if (!(target instanceof HTMLElement)) return false;
            const markElement = target.closest<HTMLElement>('[data-habit-mark]');
            if (markElement) this.openHabitPopover(markElement);
            return false;
          },
          click: (view, event) => {
            const target = event.target;
            if (!(target instanceof HTMLElement)) return false;
            const removeButton = target.closest<HTMLElement>('[data-habit-remove]');
            const markElement = removeButton?.closest<HTMLElement>('[data-habit-mark]');
            const contentElement = markElement?.querySelector<HTMLElement>('[data-habit-content]');
            if (!removeButton || !markElement || !contentElement) return false;

            event.preventDefault();
            const markType = view.state.schema.marks['habitHighlight'];
            const id = markElement.getAttribute('data-habit-id');
            if (markType && id) {
              let transaction = view.state.tr;
              view.state.doc.descendants((node, position) => {
                if (!node.isText || !node.marks.some(mark => mark.type === markType && mark.attrs['habitId'] === id)) return;
                transaction = transaction.removeMark(position, position + node.nodeSize, markType);
              });
              if (transaction.docChanged) view.dispatch(transaction);
            }
            this.closeHabitPopover();
            return true;
          },
        },
      },
      onUpdate: ({ editor }) => {
        this.page.content = this.serializableEditorHtml(editor);
        this.refreshHabitSelections(editor);
        this.updateSubject.next(this.page);
        this.changeDetector.markForCheck();
      },
      onSelectionUpdate: ({ editor }) => {
        this.syncSelectedHabit(editor);
        this.changeDetector.markForCheck();
      },
      onBlur: () => {
        this.selectedHabitKey = null;
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
    console.log(this.habitSelections);
    for(let register of this.habitSelections){
      let toSave = {
          habit_id: register.rawId,
          trigger_text: register.text,
          occurred_at: new Date().toISOString().split('T')[0],
          intensity: 3
      }
      console.log("FUNFANDO>>", register)
      console.log(register.rawId)
      this.diarioService.postHabitsRegister(register.rawId, { register: toSave }).subscribe(
        (response: any)=>{
          console.log(response);
        },
        (error: any)=>{
          this.helperService.showToast(error.message)
        }
      );
    }
    
    
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

  private serializableEditorHtml(editor: Editor): string {
    const container = document.createElement('div');
    container.innerHTML = editor.getHTML();
    container.querySelectorAll('[data-habit-label], [data-habit-remove]').forEach(element => element.remove());
    container.querySelectorAll<HTMLElement>('[data-habit-content]').forEach(content => {
      const parent = content.parentNode;
      while (content.firstChild) parent?.insertBefore(content.firstChild, content);
      content.remove();
    });
    return container.innerHTML;
  }

  private refreshHabitSelections(editor: Editor): void {
    const selections = new Map<string, {
      id: string;
      habit_name: string;
      habit_color: string;
      text: string;
      lastPosition: number;
      rawId: number;
    }>();

    editor.state.doc.descendants((node, position) => {
      if (!node.isText) return;
      const mark = node.marks.find(candidate => candidate.type.name === 'habitHighlight');
      if (!mark) return;
      const rawAttr: string | number = mark.attrs['habitId'] ?? position;
      const cleanedString: string = String(rawAttr).replace(/\D/g, '') || String(position);
      const rawId: number = Number(cleanedString);
      const id = String(mark.attrs['habitId'] ?? `habit-at-${position}`);
      const current = selections.get(id);
      const text = node.text ?? '';
      console.log(rawId)
      if (current) {
        current.text += `${position > current.lastPosition ? ' ' : ''}${text}`;
        current.lastPosition = position + node.nodeSize;
      } else {
        selections.set(id, {
          id,
          habit_name: String(mark.attrs['habitName'] ?? 'Hábito'),
          habit_color: validHabitColor(String(mark.attrs['habitColor'] ?? '#8FAF92')),
          text,
          lastPosition: position + node.nodeSize,
          rawId: rawId
        });
      }
    });

    this.habitSelections = [...selections.values()].map(({ lastPosition: _lastPosition, ...selection }) => selection);
    console.log(this.habitSelections)
  }

  private syncSelectedHabit(editor: Editor): void {
    const { from, to, empty } = editor.state.selection;
    const markType = editor.state.schema.marks['habitHighlight'];
    if (!markType) {
      this.selectedHabitKey = null;
      return;
    }

    const keys = new Set<string>();
    if (empty) {
      const marks = editor.state.storedMarks ?? editor.state.selection.$from.marks();
      const mark = marks.find(candidate => candidate.type === markType);
      if (mark?.attrs['habitKey']) keys.add(String(mark.attrs['habitKey']));
    } else {
      editor.state.doc.nodesBetween(from, to, node => {
        const mark = node.marks.find(candidate => candidate.type === markType);
        if (mark?.attrs['habitKey']) keys.add(String(mark.attrs['habitKey']));
      });
    }

    this.selectedHabitKey = keys.size === 1 ? [...keys][0] : null;
  }

  private openHabitPopover(markElement: HTMLElement): void {
    if (this.activeHabitPopover === markElement) return;
    this.closeHabitPopover();
    markElement.classList.add('habit-popover-open');
    this.activeHabitPopover = markElement;
  }

  private closeHabitPopover(): void {
    this.activeHabitPopover?.classList.remove('habit-popover-open');
    this.activeHabitPopover = null;
  }

  toggleHabit(){
    this.habitToggle = !this.habitToggle;
  }

  addHabit(){
    this.habitDraft = { name: '', icon: 'sparkles-outline', color: '#8FAF92', habit_type_id: null };
    this.habitTypes = [];
    this.habitDialogOpen = true;
    this.habitTypesLoading = true;
    this.diarioService.getHabitTypes().pipe(
      finalize(() => {
        this.habitTypesLoading = false;
        this.changeDetector.markForCheck();
      }),
    ).subscribe({
      next: (response: any) => {
        const types = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response?.habit_types)
              ? response.habit_types
              : [];
        this.habitTypes = types;
        this.changeDetector.markForCheck();
      },
      error: (error: any) => {
        this.helperService.showToast(error.message);
      },
    });
  }

  openHabitColorPicker(input: HTMLInputElement): void {
    try {
      if (typeof input.showPicker === 'function') {
        input.showPicker();
        return;
      }
    } catch {
      // Em navegadores sem showPicker, o clique no input continua disponível.
    }
    input.click();
  }

  updateHabitColor(event: Event): void {
    this.habitDraft.color = (event.target as HTMLInputElement).value;
  }

  habitIconColor(backgroundColor: string): string {
    const hex = backgroundColor.trim().replace(/^#/, '');
    const normalized = hex.length === 3
      ? hex.split('').map(character => character + character).join('')
      : hex;
    if (!/^[\da-f]{6}$/i.test(normalized)) return '#ffffff';

    const channels = [0, 2, 4].map(index => parseInt(normalized.slice(index, index + 2), 16) / 255);
    const linear = channels.map(channel => channel <= 0.04045
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2));
    const luminance = 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];

    return luminance > 0.179 ? '#1f2520' : '#ffffff';
  }

  saveHabitOptions(): void {
    const name = this.habitDraft.name.trim();
    if (!name || this.habitDraft.habit_type_id === null) return;
    this.habitDraft.name = name;
    this.habitDialogOpen = false;

    this.habit_list.push(this.habitDraft);
    console.log(this.habit_list)
    let toSave = {
      user_id: this.page.user_id,
      habit_type_id: this.habitDraft.habit_type_id,
      name: this.habitDraft.name,
      color: this.habitDraft.color,
      icon: this.habitDraft.icon
    }
    this.diarioService.postHabits({ habit: toSave }).subscribe(
      (response: any)=>{
        console.log(response);
      },
      (error: any)=>{
        this.helperService.showToast(error.message);
      }
    );
  }

  closeHabitDialog(): void {
    this.habitDialogOpen = false;
  }

}
