export type ReadingMode = 'ltr' | 'rtl' | 'vertical';

export interface Chapter {
  id: string;
  comicId: string;
  number: number;
  title: string;
  pages: string[]; // image URLs
}

export interface Comic {
  id: string;
  slug: string;
  title: string;
  description: string;
  author: string;
  coverUrl: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  chapters: Chapter[];
}

// src/app/features/auth/models/user.model.ts
export interface User {
  id: string;
  username: string;
  email: string;
  roles: ('user' | 'admin')[];
  token?: string;
}

// src/app/features/settings/models/user-settings.model.ts
export interface UserSettings {
  readingMode: ReadingMode;
}
