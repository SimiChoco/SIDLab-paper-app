import { DocumentSnapshot, Timestamp } from "firebase/firestore";

export interface User {
  id: string;
  name: string;
  totalPages: number;
  updatedAt: Date;
  grade: "B4" | "M2";
  // Status fields: 0=Not Started, 1=In Progress(Self), 2=In Progress(Waiting), 3=Completed
  statusWriting: number;
  statusCheck: number;
  statusAbstract: number;
  statusSlide: number;
  // Optional fields for latest status
  comment?: string;
  likedNum?: number;
}

export interface ReadingLog {
  id: string;
  userId: string;
  userName: string;
  pages: number;
  comment: string;
  likedNum: number;
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
    updatedAt: data.updatedAt.toDate(),
    // Default to 0 if missing (backward compatibility)
    statusWriting: typeof data.statusWriting === "number" ? data.statusWriting : 0,
    statusCheck: typeof data.statusCheck === "number" ? data.statusCheck : 0,
    statusAbstract: typeof data.statusAbstract === "number" ? data.statusAbstract : 0,
    statusSlide: typeof data.statusSlide === "number" ? data.statusSlide : 0,
    grade: (data.grade === "B4" || data.grade === "M2") ? data.grade : "B4", // Default to B4
    comment: data.comment,
    likedNum: data.likedNum,
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
    likedNum: data.likedNum || 0, // Default to empty array if missing
    createdAt: data.createdAt.toDate(),
  };
}
