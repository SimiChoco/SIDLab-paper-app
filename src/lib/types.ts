export interface User {
  id: string;
  name: string;
  totalPages: number;
  comment: string;
  likedList: string[];
  updatedAt: Date;
}

export interface ReadingLog {
  id: string;
  userId: string;
  userName: string;
  pages: number;
  comment: string;
  likedList: string[];
  createdAt: Date;
}
