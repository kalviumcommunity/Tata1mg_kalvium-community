import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "PrescripTrack — Healthcare Management System",
  description:
    "Streamline healthcare with role-based dashboards for doctors, pharmacists, and admins to manage prescriptions, verify credentials, track orders, and analyze data.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ height: "100%", margin: 0 }}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
