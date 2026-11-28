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

export interface HabitRegister {
  id: number;
  habit_id: number;
  diary_id: number | null;
  page_id: number | null;
  trigger_text: string | null;
  trigger_content: HabitTriggerContent | null;
  occurred_at?: string | null;
  intensity: number;
  created_at?: string;
  updated_at?: string;
}

export interface HabitOccurrenceContent {
  order: number;
  source_key: string;
  from: number;
  to: number;
  text: string;
  slice: Record<string, unknown>;
}

export interface HabitTriggerContent {
  version: 1;
  occurrences: HabitOccurrenceContent[];
}

export interface HabitRegisterInput {
  habit_id: number;
  trigger_text: string;
  trigger_content: HabitTriggerContent;
  intensity: number;
}
