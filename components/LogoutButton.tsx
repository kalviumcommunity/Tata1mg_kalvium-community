"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  redirectTo?: string;
  className?: string;
}

export function LogoutButton({ redirectTo = "/auth", className }: LogoutButtonProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/session", { method: "DELETE" });
    } finally {
      router.push(redirectTo);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={className}
    >
      <LogOut className="w-4 h-4" />
      <span style={{ marginLeft: '0.5rem' }}>
        {isLoggingOut ? 'Signing out…' : 'Sign Out'}
      </span>
    </Button>
  );
}
