"use client";

import { auth } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

export default function TestAuth() {

  const signup = async () => {
    const user = await createUserWithEmailAndPassword(
      auth,
      "test@test.com",
      "password123"
    );

    console.log(user.user);
  };

  const login = async () => {
    const user = await signInWithEmailAndPassword(
      auth,
      "test@test.com",
      "password123"
    );

    console.log(user.user);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <div className="p-10 flex gap-4">
      <button onClick={signup}>Signup</button>
      <button onClick={login}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}