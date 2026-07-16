"use client";

import { useRouter } from "next/navigation";
import { DoctorPortal } from "@/components/DoctorPortal";

export default function Doctor() {
  const router = useRouter();
  return <DoctorPortal onBack={() => router.push("/")} />;
}
