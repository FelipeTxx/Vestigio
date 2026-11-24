import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconChoiceComponent } from './icon_choice.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [IconChoiceComponent],
  exports: [IconChoiceComponent],
})
export class IconChoiceModule {}
