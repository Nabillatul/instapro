"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin-login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-all"
    >
      <LogOut size={14} />
      Keluar
    </button>
  );
}
