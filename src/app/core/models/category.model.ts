export interface Category {
  id: number;
  name: string;
  recordDate?: Date;
}

export interface CategoryCreateDto {
  name: string;
}

export interface CategoryUpdateDto {
  id: number;
  name?: string;
} 