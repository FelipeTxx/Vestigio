import { Component, OnInit } from '@angular/core';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';

@Component({
  selector: 'app-diario',
  templateUrl: './diario.page.html',
  styleUrls: ['./diario.page.scss'],
  standalone: false,
})
export class DiarioPage implements OnInit {

  editor!: Editor;

  constructor() { }

  ngOnInit() {
    this.editor = new Editor({
      extensions: [
        StarterKit, // Inclui negrito, itálico, parágrafos, cabeçalhos, etc.
      ],
      content: '<p>Comece a digitar seu texto aqui no Ionic!</p>',
    });
  }
  ngOnDestroy() {
    this.editor.destroy();
  }


}

  


