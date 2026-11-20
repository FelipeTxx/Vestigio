import { ChangeDetectorRef, Component } from '@angular/core';
import { addIcons } from 'ionicons';
import {
  bookOutline,
  cameraOutline,
  checkmarkOutline,
  informationCircleOutline,
  personCircleOutline,
  settingsOutline,
} from 'ionicons/icons';
import { UserConfigService } from './user-config.service';
import { AuthService } from '../services/auth.service';
import { HelpingService } from '../services/HelpingServices/helpingService';

@Component({
  selector: 'app-user-config',
  standalone: false,
  styleUrl: './user-config.scss',
  templateUrl: './user-config.html',
})
export class UserConfig {

  user: any;

  name = '';
  email = '';
  imagePreview: string | null = null;
  lineSpacing: number | null = null;
  letterSpacing: number | null = null;
  loadingConfig = true;
  configLoadError = false;

  config: any = {
    user_id: null,
    line_spacing: null,
    letter_spacing: null
  }
  configId: any = null;

  constructor(
      private authService: AuthService, 
      private readonly userConfigService: UserConfigService,
      private helperService: HelpingService,
      private readonly changeDetector: ChangeDetectorRef,
    ) {
    this.user = this.authService.getCurrentUser();

    addIcons({
      bookOutline,
      cameraOutline,
      checkmarkOutline,
      informationCircleOutline,
      personCircleOutline,
      settingsOutline,
    });
  }

  
  ionViewWillEnter() {
    this.getConfig();
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

  onLineSpacingInput(event: Event): void {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    this.lineSpacing = Number.isFinite(value) ? value : null;
  }

  onLetterSpacingInput(event: Event): void {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    this.letterSpacing = Number.isFinite(value) ? value : null;
  }

  getConfig(){
    this.loadingConfig = true;
    this.configLoadError = false;

    if (!this.user?.id) {
      this.loadingConfig = false;
      this.configLoadError = true;
      return;
    }

    this.userConfigService.getByUser(this.user.id).subscribe(
      (response: any)=>{
        const config = response?.[0];

        if (!config) {
          this.loadingConfig = false;
          this.configLoadError = true;
          return;
        }

        this.configId = config.id;
        this.lineSpacing = Number(config.line_spacing);
        this.letterSpacing = Number(config.letter_spacing);

        if (!Number.isFinite(this.lineSpacing) || !Number.isFinite(this.letterSpacing)) {
          this.lineSpacing = null;
          this.letterSpacing = null;
          this.loadingConfig = false;
          this.configLoadError = true;
          return;
        }

        this.loadingConfig = false;
        this.changeDetector.detectChanges();
      },
      (error: any)=>{
        console.log(error);
        this.loadingConfig = false;
        this.configLoadError = true;
        this.helperService.showToast(error.message);
      }
    );
  }

  saveConf(){
      if (this.loadingConfig || this.configLoadError || this.configId === null
          || this.lineSpacing === null || this.letterSpacing === null) return;

      this.config.user_id = this.user.id;
      this.config.line_spacing = this.lineSpacing;
      this.config.letter_spacing = this.letterSpacing;
      this.userConfigService.update(this.config, this.configId).subscribe(
        (response: any) =>{
          console.log(this.config)
            console.log(response)
        },
        (error: any)=>{
          console.log(error);
          this.helperService.showToast(error.message);
        }
        
      );
  }

}
