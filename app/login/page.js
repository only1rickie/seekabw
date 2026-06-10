"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert("Logged in!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={login}>
      <input type="email" onChange={(e)=>setEmail(e.target.value)} />
      <input type="password" onChange={(e)=>setPassword(e.target.value)} />
      <button>Login</button>
    </form>
  );
}