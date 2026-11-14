import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { addIcons } from 'ionicons';
import {
  addOutline,
  arrowBackOutline,
  bookOutline,
  chatbubbleEllipsesOutline,
  checkmarkCircleOutline,
  listOutline,
  
} from 'ionicons/icons';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';

interface DiaryEntry {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

@Component({
  selector: 'app-diario',
  templateUrl: './diario.page.html',
  standalone: false,
})
export class DiarioPage implements OnInit, OnDestroy {
  private readonly storageKey = 'vestigio.diaries.v1';
  readonly saveLabel = signal('Salvo neste dispositivo');

  diaries: DiaryEntry[] = [];
  selectedDiary: DiaryEntry | null = null;
  editor: Editor | null = null;
  view: 'roadmap' | 'writer' = 'roadmap';

  private readonly notebookCovers = ['cover-clay', 'cover-sage', 'cover-lilac', 'cover-sand'];

  constructor() {
    addIcons({
      addOutline,
      arrowBackOutline,
      bookOutline,
      checkmarkCircleOutline,
      listOutline,
      chatbubbleEllipsesOutline
    });
  }

  ngOnInit(): void {
    this.loadDiaries();
  }

  ngOnDestroy(): void {
    this.destroyEditor();
  }

  openDiary(diary: DiaryEntry): void {
    this.destroyEditor();
    this.selectedDiary = diary;
    this.view = 'writer';
    this.saveLabel.set('Salvo neste dispositivo');

    this.editor = new Editor({
      extensions: [StarterKit],
      content: diary.content || '<p></p>',
      onUpdate: ({ editor }) => {
        if (!this.selectedDiary) return;

        this.selectedDiary.content = editor.getHTML();
        const preview = editor.getText().trim();
        if (preview) this.selectedDiary.excerpt = preview.slice(0, 88);
        this.persistDiaries();
      }
    });
  }

  addDiary(): void {
    const diary: DiaryEntry = {
      id: this.createId(),
      title: 'Novo diário',
      date: this.today(),
      excerpt: 'Um espaço novo para suas ideias.',
      content: '<p></p>'
    };

    this.diaries.unshift(diary);
    this.persistDiaries();
    this.openDiary(diary);
  }

  returnToRoadmap(): void {
    this.persistDiaries();
    this.destroyEditor();
    this.selectedDiary = null;
    this.view = 'roadmap';
  }

  updateTitle(title: string): void {
    if (!this.selectedDiary) return;
    this.selectedDiary.title = title;
    this.persistDiaries();
  }

  coverClass(index: number): string {
    return this.notebookCovers[index % this.notebookCovers.length];
  }

  formattedDate(date: string): string {
    const [year, month, day] = date.split('-').map(Number);
    return new Date(year, month - 1, day, 12).toLocaleDateString('pt-BR', {
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

  private loadDiaries(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as DiaryEntry[];
        this.diaries = Array.isArray(parsed) ? parsed : this.sampleDiaries();
        return;
      }
    } catch {
      // Dados de exemplo são usados se não houver um rascunho local válido.
    }

    this.diaries = this.sampleDiaries();
    this.persistDiaries();
  }

  private sampleDiaries(): DiaryEntry[] {
    return [
      {
        id: 'sample-1',
        title: 'Pequenas vitórias',
        date: this.dateDaysAgo(0),
        excerpt: 'Hoje consegui desacelerar e perceber o que já está dando certo.',
        content: '<p>Hoje consegui desacelerar e perceber o que já está dando certo.</p><p>Uma pequena vitória de cada vez também me leva adiante.</p>'
      },
      {
        id: 'sample-2',
        title: 'Coisas que quero lembrar',
        date: this.dateDaysAgo(1),
        excerpt: 'Uma conversa boa, o café quentinho e a luz no fim da tarde.',
        content: '<p>Uma conversa boa, o café quentinho e a luz no fim da tarde.</p><p>Quero guardar esses instantes simples com carinho.</p>'
      },
      {
        id: 'sample-3',
        title: 'Uma semana mais leve',
        date: this.dateDaysAgo(3),
        excerpt: 'Escolhi fazer uma coisa por vez e deixar espaço para respirar.',
        content: '<p>Escolhi fazer uma coisa por vez e deixar espaço para respirar.</p>'
      },
      {
        id: 'sample-4',
        title: 'Novos começos',
        date: this.dateDaysAgo(5),
        excerpt: 'Nem todo começo precisa ser grandioso. Basta dar o primeiro passo.',
        content: '<p>Nem todo começo precisa ser grandioso. Basta dar o primeiro passo.</p>'
      }
    ];
  }

  private persistDiaries(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.diaries));
    this.saveLabel.set('Salvo neste dispositivo');
  }

  private destroyEditor(): void {
    this.editor?.destroy();
    this.editor = null;
  }

  private createId(): string {
    return globalThis.crypto?.randomUUID?.() ?? `diary-${Date.now()}`;
  }

  private today(): string {
    return this.toDateKey(new Date());
  }

  private dateDaysAgo(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return this.toDateKey(date);
  }

  private toDateKey(date: Date): string {
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }
}
