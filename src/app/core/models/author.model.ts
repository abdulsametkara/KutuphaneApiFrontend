export interface Author {
  id: number;
  name: string;
  surname: string;
  placeofBirth?: string;
  yearofBirth: number;
  recordDate?: Date;
}

export interface AuthorCreateDto {
  name: string;
  surname: string;
  placeofBirth?: string;
  yearofBirth: number;
}

export interface AuthorUpdateDto {
  id: number;
  name?: string;
  surname?: string;
  placeofBirth?: string;
  yearofBirth?: number;
} 