import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { AppData } from "../types";
import { DEFAULT_HOLIDAYS_2026 } from "../data/defaultHolidays";

export function subscribeToUserData(
  userId: string,
  onData: (data: AppData) => void,
  onError: (error: Error) => void
) {
  const userRef = doc(db, "users", userId, "data", "appData");

  return onSnapshot(
    userRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onData(snapshot.data() as AppData);
      } else {
        const fresh: AppData = {
          loans: [],
          emiSchedule: [],
          holidays: [...DEFAULT_HOLIDAYS_2026],
        };
        setDoc(userRef, fresh).catch(onError);
        onData(fresh);
      }
    },
    onError
  );
}

export async function syncLoanChange(
  userId: string,
  _prev: AppData,
  next: AppData,
  _loanId?: string
) {
  const userRef = doc(db, "users", userId, "data", "appData");
  await setDoc(userRef, next);
}

export async function resetUserData(userId: string): Promise<AppData> {
  const fresh: AppData = {
    loans: [],
    emiSchedule: [],
    holidays: [...DEFAULT_HOLIDAYS_2026],
  };
  const userRef = doc(db, "users", userId, "data", "appData");
  await setDoc(userRef, fresh);
  return fresh;
}
