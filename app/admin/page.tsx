"use client";

import { useRouter } from "next/navigation";
import { AdminPortal } from "@/components/AdminPortal";

export default function Admin() {
  const router = useRouter();
  return <AdminPortal onBack={() => router.push("/")} />;
}
