"use client";

export function Unauthenticated({ children }: { children: React.ReactNode }) {
  if (localStorage.getItem("token")) {
    return null;
  }

  return children;
}
