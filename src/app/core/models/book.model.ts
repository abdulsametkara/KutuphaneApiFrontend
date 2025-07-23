//book modeli tanımlama
export interface Book {
  id: number;
  title: string;
  description?: string;
  countofPage: number;
  authorId  : number;
  categoryId: number;
  recordDate: Date;
  fileKey?: string;

}

export interface BookCreateDto {
    title: string;
    description?: string;
    countofPage: number;
    authorId: number;
    categoryId: number;
    fileKey?: string;

}

export interface BookUpdateDto {
    id: number;
    title?: string;
    description?: string;
    countofPage?: number;
    authorId?: number;
    categoryId?: number;
    fileKey?: string;

}