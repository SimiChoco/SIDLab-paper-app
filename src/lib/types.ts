import { DocumentSnapshot, Timestamp } from "firebase/firestore";

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

// User型がどうかをチェック
export function validateAndConvertUser(doc: DocumentSnapshot): User {
  const data = doc.data();

  if (!data) {
    throw new Error(`User data is missing for doc ID: ${doc.id}`);
  }

  // Basic validation
  if (typeof data.name !== "string" || data.name.trim() === "") {
    throw new Error(`Invalid or missing 'name' for user: ${doc.id}`);
  }
  if (typeof data.totalPages !== "number") {
    throw new Error(`Invalid or missing 'totalPages' for user: ${doc.id}`);
  }
  if (!(data.updatedAt instanceof Timestamp)) {
    throw new Error(`Invalid or missing 'updatedAt' for user: ${doc.id}`);
  }

  // Return a well-formed User object
  return {
    id: doc.id,
    name: data.name,
    totalPages: data.totalPages,
    comment: data.comment || "", // Default to empty string if missing
    likedList: data.likedList || [], // Default to empty array if missing
    updatedAt: data.updatedAt.toDate(),
  };
}

// ReadingLog型がどうかをチェック
export function validateAndConvertReadingLog(
  doc: DocumentSnapshot
): ReadingLog {
  const data = doc.data();

  if (!data) {
    throw new Error(`ReadingLog data is missing for doc ID: ${doc.id}`);
  }

  // Basic validation
  if (typeof data.userId !== "string" || data.userId.trim() === "") {
    throw new Error(`Invalid or missing 'userId' for log: ${doc.id}`);
  }
  if (typeof data.userName !== "string" || data.userName.trim() === "") {
    throw new Error(`Invalid or missing 'userName' for log: ${doc.id}`);
  }
  if (typeof data.pages !== "number") {
    throw new Error(`Invalid or missing 'pages' for log: ${doc.id}`);
  }
  if (!(data.createdAt instanceof Timestamp)) {
    throw new Error(`Invalid or missing 'createdAt' for log: ${doc.id}`);
  }

  // Return a well-formed ReadingLog object
  return {
    id: doc.id,
    userId: data.userId,
    userName: data.userName,
    pages: data.pages,
    comment: data.comment || "", // Default to empty string if missing
    likedList: data.likedList || [], // Default to empty array if missing
    createdAt: data.createdAt.toDate(),
  };
}
