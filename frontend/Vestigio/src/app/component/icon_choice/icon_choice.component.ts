import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IONIC_ICON_NAMES } from './ionic-icon-names';

@Component({
  selector: 'app-icon-choice',
  templateUrl: './icon_choice.component.html',
  styleUrls: ['./icon_choice.component.scss'],
  standalone: false,
})
export class IconChoiceComponent {
  @Input() selectedIcon = 'book-outline';
  @Input() label = 'Escolher ícone';
  @Output() selectedIconChange = new EventEmitter<string>();

  readonly iconNames = IONIC_ICON_NAMES;
  isOpen = false;
  searchTerm = '';

  get filteredIcons(): readonly string[] {
    const query = this.searchTerm.trim().toLocaleLowerCase();
    return query
      ? this.iconNames.filter(name => name.includes(query))
      : this.iconNames;
  }

  openPicker(): void {
    this.searchTerm = '';
    this.isOpen = true;
  }

  closePicker(): void {
    this.isOpen = false;
  }

  chooseIcon(icon: string): void {
    this.selectedIcon = icon;
    this.selectedIconChange.emit(icon);
    this.closePicker();
  }

  iconSource(icon: string): string {
    return `/svg/${icon}.svg`;
  }

  trackIcon(_index: number, icon: string): string {
    return icon;
  }
}
