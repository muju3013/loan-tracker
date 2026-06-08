import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase";
import type { AuthUser } from "../types/auth";

export async function firebaseSignUp(name: string, email: string, password: string) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    const user: AuthUser = {
      id: cred.user.uid,
      email: cred.user.email ?? "",
      name: name,
    };
    return { user };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function firebaseSignIn(email: string, password: string) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const user: AuthUser = {
      id: cred.user.uid,
      email: cred.user.email ?? "",
      name: cred.user.displayName ?? cred.user.email?.split("@")[0] ?? "User",
    };
    return { user };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function firebaseSignOut() {
  await signOut(auth);
}

export async function firebaseResetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    return null;
  } catch (err: any) {
    return err.message;
  }
}
