export interface Diary {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  icon: string;
  color: string;
  pages_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface DiaryInput {
  title: string;
  description: string | null;
  icon: string;
  color: string;
}

export interface DiaryPageEntry {
  id: number;
  diary_id: number;
  user_id: number;
  title: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

export interface DiaryPageInput {
  title: string;
  content: string;
}

export interface DiaryTypography {
  lineSpacing: number;
  letterSpacing: number;
}

export interface DiaryPageCard {
  page: DiaryPageEntry;
  pageNumber: number;
  dateLabel: string;
  excerpt: string;
  hasConsecutiveNextPage: boolean;
  isInStreak: boolean;
}
