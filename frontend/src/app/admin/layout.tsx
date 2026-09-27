import React from "react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col md:flex-row bg-background">
      <AdminSidebar />
      <div className="flex-1 overflow-x-hidden p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}
