export interface User {
    id: string;
    name: string;
    totalPages: number;
    updatedAt: Date;
}

export interface ReadingLog {
    id: string;
    userId: string;
    userName: string;
    pages: number;
    createdAt: Date;
}
