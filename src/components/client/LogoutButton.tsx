"use client";

import { logout } from "@/lib/actions";

export function LogoutButton() {
  return (
    <form action={logout} className="w-full">
      <button
        type="submit"
        className="w-full text-left transition-colors hover:opacity-80"
      >
        Logout
      </button>
    </form>
  );
}

