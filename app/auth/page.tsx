"use client";

import { useRouter } from "next/navigation";
import { AuthPage } from "@/components/AuthPage";

export default function Auth() {
  const router = useRouter();

  return (
    <AuthPage
      onLogin={() => {
        // Pharmacist/Admin portals aren't part of this push yet —
        // every successful login lands on the doctor dashboard for now.
        router.push("/doctor");
      }}
      onBack={() => router.push("/")}
    />
  );
}
