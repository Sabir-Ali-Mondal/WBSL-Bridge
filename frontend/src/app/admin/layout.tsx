import React from "react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-theme flex h-[100dvh] min-h-0 w-full flex-none flex-col overflow-hidden bg-[#080F1C] text-[#F1F5F9] md:flex-row">
      <AdminSidebar />
      <main className="h-0 min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain bg-[#080F1C] p-4 text-[#F1F5F9] md:h-full md:w-auto md:p-6">
        {children}
      </main>
    </div>
  );
}
