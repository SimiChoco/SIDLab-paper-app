import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  orderBy,
  limit,
  increment,
  serverTimestamp,
  Timestamp,
  getDoc,
  setDoc,
  where,
  runTransaction,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";
export { db };
import {
  User,
  ReadingLog,
  validateAndConvertUser,
  validateAndConvertReadingLog,
} from "./types";

export const USERS_COLLECTION = "users";
export const LOGS_COLLECTION = "logs";

export async function getLogById(logId: string): Promise<ReadingLog> {
  const docRef = doc(db, LOGS_COLLECTION, logId);
  const docSnap = await getDoc(docRef);
  const data = validateAndConvertReadingLog(docSnap);
  return data;
}

export async function updateReadingLog(logId: string, newPages: number) {
  try {
    await runTransaction(db, async (transaction) => {
      // 1. Get the log
      const logRef = doc(db, LOGS_COLLECTION, logId);
      const logDoc = await transaction.get(logRef);
      if (!logDoc.exists()) {
        throw new Error("Log not found!");
      }

      const logData = logDoc.data();
      const oldPages = logData.pages;
      const userId = logData.userId;
      const pageDiff = newPages - oldPages;

      // 2. Get the user
      const userRef = doc(db, USERS_COLLECTION, userId);
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) {
        throw new Error("User not found!");
      }

      // 3. Update Log
      transaction.update(logRef, {
        pages: newPages,
      });

      // 4. Update User Total
      transaction.update(userRef, {
        totalPages: increment(pageDiff),
        updatedAt: serverTimestamp(),
      });
    });
    console.log("Transaction successfully committed!");
  } catch (e) {
    console.log("Transaction failed: ", e);
    throw e;
  }
}

// Create a new user
export async function createUser(name: string, comment: string) {
  const usersRef = collection(db, USERS_COLLECTION);
  const q = query(usersRef, where("name", "==", name));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    throw new Error("User already exists");
  }

  const newUserRef = await addDoc(usersRef, {
    name,
    totalPages: 0,
    comment: comment,
    likedNum: 0,
    updatedAt: serverTimestamp(),
  });
  return newUserRef.id;
}

// Get all users for dropdown
export async function getAllUsers() {
  const usersRef = collection(db, USERS_COLLECTION);
  const q = query(usersRef, orderBy("name"));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
    validateAndConvertUser(doc);

    return {
      id: doc.id,
      name: doc.data().name,
      comment: doc.data().comment,
      likedNum: doc.data().likedNum,
    };
  });
}

// Log progress (Absolute page count)
export async function addReadingLog(
  userId: string,
  userName: string,
  currentTotalPages: number,
  likedNum: number,
  comment: string
) {
  // 1. Add Log (Recording the milestone reached)
  await addDoc(collection(db, LOGS_COLLECTION), {
    userId,
    userName,
    pages: currentTotalPages,
    comment: comment,
    likedNum: likedNum === undefined ? 0 : likedNum,
    createdAt: serverTimestamp(),
  });

  // 2. Update User Total (Set directly, no increment)
  const userRef = doc(db, USERS_COLLECTION, userId);
  await updateDoc(userRef, {
    totalPages: currentTotalPages,
    comment: comment,
    likedNum: 0,
    updatedAt: serverTimestamp(),
  });
}

// Delete a user and their logs
export async function deleteUser(userId: string) {
  // 1. Delete all logs for this user (Ideally this should be a batch or cloud function, but doing simple query delete here)
  const logsRef = collection(db, LOGS_COLLECTION);
  const q = query(logsRef, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
  await Promise.all(deletePromises);

  // 2. Delete the user
  await deleteDoc(doc(db, USERS_COLLECTION, userId));
}

export async function getRanking(): Promise<User[]> {
  const usersRef = collection(db, USERS_COLLECTION);
  const q = query(usersRef, orderBy("totalPages", "desc"), limit(50));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
    const data = validateAndConvertUser(doc);
    return data;
  });
}

export async function getRecentLogs(): Promise<ReadingLog[]> {
  const logsRef = collection(db, LOGS_COLLECTION);
  const q = query(logsRef, orderBy("createdAt", "desc"), limit(20));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
    const data = validateAndConvertReadingLog(doc);
    return data;
  });
}

export async function addLiked(targetDb: "Users" | "ReadingLog", id: string) {
  console.log(targetDb);
  if (targetDb == "Users") {
    try {
      console.log("Users selected");
      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, USERS_COLLECTION, id);
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists()) {
          throw new Error("User not found!");
        }

        const userData = validateAndConvertUser(userDoc);

        const likedNum = userData.likedNum;

        transaction.update(userRef, {
          likedNum: likedNum + 1,
        });
      });
      console.log("Add liked successfully committed!");
    } catch (e) {
      console.log("Add liked failed: ", e);
      throw e;
    }
  } else if (targetDb == "ReadingLog") {
    try {
      console.log("ReadingLog selected");
      await runTransaction(db, async (transaction) => {
        const logRef = doc(db, LOGS_COLLECTION, id);
        const logDoc = await transaction.get(logRef);
        console.log(id);
        console.log(logDoc);
        if (!logDoc.exists()) {
          throw new Error("Log not found!");
        }

        const logData = validateAndConvertReadingLog(logDoc);

        const likedNum = logData.likedNum;

        transaction.update(logRef, {
          likedNum: likedNum + 1,
        });
      });
      console.log("Add liked successfully committed!");
    } catch (e) {
      console.log("Add liked failed: ", e);
      throw e;
    }
  }
}
