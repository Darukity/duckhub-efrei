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