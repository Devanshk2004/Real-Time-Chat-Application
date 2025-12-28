"use client";

import { useAuthStore } from "../store/useAuthStore";
import HomePage from "../components/HomePage"; 
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const { authUser, isCheckingAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isCheckingAuth && !authUser) {
      router.push("/login");
    }
  }, [authUser, isCheckingAuth, router]);

  if (isCheckingAuth) return null; 

  if (authUser) {
    return <HomePage />;
  }

  return null;
}

