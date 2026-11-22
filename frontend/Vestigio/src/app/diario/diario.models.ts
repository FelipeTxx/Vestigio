export interface DiaryEntry {
  id?: number;
  user_id: any;
  title: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

export interface DiaryTypography {
  lineSpacing: number;
  letterSpacing: number;
}

export interface DiaryPageCard {
  diary: DiaryEntry;
  pageNumber: number;
  dateLabel: string;
  excerpt: string;
  hasConsecutiveNextPage: boolean;
  isInStreak: boolean;
}
