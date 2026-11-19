import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface DiaryTypography {
  lineSpacing: number;
  letterSpacing: number;
}

const DEFAULT_TYPOGRAPHY: DiaryTypography = {
  lineSpacing: 1.5,
  letterSpacing: 0,
};

@Injectable({ providedIn: 'root' })
export class UserConfigService {
  private readonly typographySubject = new BehaviorSubject<DiaryTypography>(DEFAULT_TYPOGRAPHY);
  readonly typography$ = this.typographySubject.asObservable();

  get typography(): DiaryTypography {
    return this.typographySubject.value;
  }

  setTypography(typography: DiaryTypography): void {
    const normalized = this.normalize(typography);
    this.typographySubject.next(normalized);
  }

  private normalize(typography: DiaryTypography): DiaryTypography {
    return {
      lineSpacing: this.clamp(Number(typography.lineSpacing), 1, 2.4, DEFAULT_TYPOGRAPHY.lineSpacing),
      letterSpacing: this.clamp(Number(typography.letterSpacing), 0, 2, DEFAULT_TYPOGRAPHY.letterSpacing),
    };
  }

  private clamp(value: number, min: number, max: number, fallback: number): number {
    return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
  }
}
