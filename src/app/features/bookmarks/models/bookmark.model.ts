export interface Bookmark {
  comicId: string;     // identifie le comic
  chapterId: string;   // chapitre courant
  pageIndex: number;   // 0-based page
  updatedAt: string;   // ISO timestamp
}