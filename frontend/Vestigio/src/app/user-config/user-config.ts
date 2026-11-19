import { Component } from '@angular/core';
import { addIcons } from 'ionicons';
import {
  bookOutline,
  cameraOutline,
  informationCircleOutline,
  personCircleOutline,
  settingsOutline,
} from 'ionicons/icons';
import { UserConfigService } from './user-config.service';

@Component({
  selector: 'app-user-config',
  standalone: false,
  styleUrl: './user-config.scss',
  templateUrl: './user-config.html',
})
export class UserConfig {
  name = '';
  email = '';
  imagePreview: string | null = null;
  lineSpacing: number;
  letterSpacing: number;

  constructor(private readonly configService: UserConfigService) {
    this.lineSpacing = configService.typography.lineSpacing;
    this.letterSpacing = configService.typography.letterSpacing;

    addIcons({
      bookOutline,
      cameraOutline,
      informationCircleOutline,
      personCircleOutline,
      settingsOutline,
    });
  }

  initialsFor(name: string): string {
    const initials = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);
    return initials.map((part) => part[0].toLocaleUpperCase()).join('') || 'V';
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = typeof reader.result === 'string' ? reader.result : null;
    };
    reader.readAsDataURL(file);
  }

  updateTypography(): void {
    this.configService.setTypography({
      lineSpacing: this.lineSpacing,
      letterSpacing: this.letterSpacing,
    });
  }

}
