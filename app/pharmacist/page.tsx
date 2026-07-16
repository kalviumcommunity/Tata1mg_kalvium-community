"use client";

import { useRouter } from "next/navigation";
import { PharmacistPortal } from "@/components/PharmacistPortal";

export default function Pharmacist() {
  const router = useRouter();
  return <PharmacistPortal onBack={() => router.push("/")} />;
}
