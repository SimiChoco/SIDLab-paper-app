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
    where
} from "firebase/firestore";
import { db } from "./firebase";
import { User, ReadingLog } from "./types";

const USERS_COLLECTION = "users";
const LOGS_COLLECTION = "logs";

// Add a reading log and update user's total pages
export async function addReadingLog(name: string, pages: number, paperTitle: string) {
    // 1. Check if user exists, create if not
    // For simplicity using name as identifier or part of query. 
    // Ideally we use Auth, but per plan we use name.
    // We'll search for a user with this name (case insensitive ideally, but exact for now)

    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, where("name", "==", name));
    const querySnapshot = await getDocs(q);

    let userId = "";
    let currentTotal = 0;

    if (querySnapshot.empty) {
        // Create new user
        const newUserRef = await addDoc(usersRef, {
            name,
            totalPages: 0,
            updatedAt: serverTimestamp(),
        });
        userId = newUserRef.id;
    } else {
        const userDoc = querySnapshot.docs[0];
        userId = userDoc.id;
        currentTotal = userDoc.data().totalPages || 0;
    }

    // 2. Add Log
    await addDoc(collection(db, LOGS_COLLECTION), {
        userId,
        userName: name,
        pages,
        paperTitle,
        createdAt: serverTimestamp(),
    });

    // 3. Update User Total
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
        totalPages: increment(pages),
        updatedAt: serverTimestamp(),
    });
}

export async function getRanking() {
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, orderBy("totalPages", "desc"), limit(50));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            name: data.name,
            totalPages: data.totalPages,
            updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
        } as User;
    });
}

export async function getRecentLogs() {
    const logsRef = collection(db, LOGS_COLLECTION);
    const q = query(logsRef, orderBy("createdAt", "desc"), limit(20));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            userId: data.userId,
            userName: data.userName,
            pages: data.pages,
            paperTitle: data.paperTitle,
            createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
        } as ReadingLog;
    });
}
